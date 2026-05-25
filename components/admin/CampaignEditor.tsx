'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Campaign } from '@/types/database'

type BlockType = 'header' | 'text' | 'button' | 'image' | 'destination' | 'divider' | 'footer'

type Block = {
  id: string
  type: BlockType
  content: Record<string, string>
}

const BLOCK_LABELS: Record<BlockType, string> = {
  header:      '🏷 Cabeçalho',
  text:        '📝 Texto',
  button:      '🔘 Botão CTA',
  image:       '🖼 Imagem',
  destination: '✈️ Card destino',
  divider:     '— Divisor',
  footer:      '📎 Rodapé',
}

const DEFAULT_BLOCKS: Record<BlockType, Record<string, string>> = {
  header:      { title: 'Título do email', subtitle: 'Subtítulo opcional' },
  text:        { content: 'Digite seu texto aqui...' },
  button:      { label: 'Ver oferta', url: 'https://linharetaturismo.com.br/destinos' },
  image:       { url: '', alt: 'Imagem' },
  destination: { name: 'Nome do destino', price: 'R$ 1.890', duration: '5 dias', url: '#' },
  divider:     {},
  footer:      { company: 'Linha Reta Turismo', unsubscribe_text: 'Cancelar inscrição' },
}

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

type Props = { campaign?: Campaign; mode: 'create' | 'edit' }

export default function CampaignEditor({ campaign, mode }: Props) {
  const router   = useRouter()
  const supabase = createClient()

  const [saving, setSaving]   = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState('')
  const [preview, setPreview] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const [form, setForm] = useState({
    name:         campaign?.name         || '',
    subject:      campaign?.subject      || '',
    preview_text: campaign?.preview_text || '',
  })

  const [blocks, setBlocks] = useState<Block[]>(
    campaign?.blocks
      ? (campaign.blocks as any[]).map(b => ({ ...b }))
      : [
          { id: generateId(), type: 'header', content: { title: 'Título da campanha', subtitle: '' } },
          { id: generateId(), type: 'text', content: { content: 'Escreva o conteúdo do seu email aqui...' } },
          { id: generateId(), type: 'button', content: { label: 'Ver destinos', url: 'https://linharetaturismo.com.br/destinos' } },
          { id: generateId(), type: 'footer', content: { company: 'Linha Reta Turismo', unsubscribe_text: 'Cancelar inscrição' } },
        ]
  )

  function addBlock(type: BlockType) {
    const newBlock: Block = { id: generateId(), type, content: { ...DEFAULT_BLOCKS[type] } }
    setBlocks(b => [...b, newBlock])
    setSelected(newBlock.id)
  }

  function updateBlock(id: string, key: string, value: string) {
    setBlocks(b => b.map(block => block.id === id ? { ...block, content: { ...block.content, [key]: value } } : block))
  }

  function removeBlock(id: string) {
    setBlocks(b => b.filter(block => block.id !== id))
    if (selected === id) setSelected(null)
  }

  function moveBlock(id: string, dir: 'up' | 'down') {
    setBlocks(b => {
      const idx = b.findIndex(block => block.id === id)
      if (dir === 'up' && idx === 0) return b
      if (dir === 'down' && idx === b.length - 1) return b
      const newBlocks = [...b]
      const swap = dir === 'up' ? idx - 1 : idx + 1
      ;[newBlocks[idx], newBlocks[swap]] = [newBlocks[swap], newBlocks[idx]]
      return newBlocks
    })
  }

  function renderBlockPreview(block: Block) {
    const c = block.content
    switch (block.type) {
      case 'header':
        return (
          <div className="text-center py-8 px-6" style={{ background: '#003A5D' }}>
            <div className="font-display font-extrabold text-2xl text-white">{c.title || 'Título'}</div>
            {c.subtitle && <div className="text-white/70 mt-1 text-sm">{c.subtitle}</div>}
          </div>
        )
      case 'text':
        return <div className="px-6 py-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{c.content}</div>
      case 'button':
        return (
          <div className="px-6 py-4 text-center">
            <span className="inline-flex px-6 py-3 rounded-full text-sm font-bold"
              style={{ background: '#FFC247', color: '#003A5D' }}>
              {c.label || 'Botão'}
            </span>
          </div>
        )
      case 'image':
        return c.url
          ? <img src={c.url} alt={c.alt} className="w-full object-cover max-h-48" />
          : <div className="mx-6 my-4 h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">Sem imagem</div>
      case 'destination':
        return (
          <div className="mx-6 my-4 p-4 border border-gray-100 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-lr-navy">{c.name}</div>
              <div className="text-sm text-gray-500">{c.duration}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lr-navy">{c.price}</div>
              <span className="text-xs text-lr-ocean">Ver pacote →</span>
            </div>
          </div>
        )
      case 'divider':
        return <div className="mx-6 my-2 border-t border-gray-100" />
      case 'footer':
        return (
          <div className="px-6 py-6 text-center text-xs text-gray-400" style={{ background: '#F8F4EA' }}>
            <div className="font-bold text-gray-600 mb-1">{c.company}</div>
            <div>Você está recebendo este email por ter se inscrito.</div>
            <div className="mt-2">
              <span className="underline cursor-pointer">{c.unsubscribe_text || 'Cancelar inscrição'}</span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')

    const payload = {
      name:         form.name,
      subject:      form.subject,
      preview_text: form.preview_text || null,
      blocks:       blocks as any,
      status:       'draft' as any,
    }

    let err
    if (mode === 'create') {
      const res = await supabase.from('email_campaigns').insert(payload)
      err = res.error
    } else {
      const res = await supabase.from('email_campaigns').update(payload).eq('id', campaign!.id)
      err = res.error
    }

    if (err) { setError(err.message); setSaving(false); return }
    router.push('/admin/email')
    router.refresh()
  }

  async function handleSend() {
    if (!confirm(`Enviar campanha "${form.name}" para todos os subscribers ativos?`)) return
    setSending(true)
    setError('')

    const res = await fetch('/api/campaigns/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: campaign?.id, form, blocks }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Erro ao enviar'); setSending(false); return }

    router.push('/admin/email')
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-lr-ocean transition-colors"

  return (
    <div className="grid grid-cols-5 gap-6 max-w-6xl">

      {/* Editor lateral */}
      <div className="col-span-2 space-y-4">

        {/* Configurações */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-display font-bold text-lg text-lr-navy">Configurações</h2>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nome interno</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={inputCls} placeholder="Promoção julho 2025" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Assunto do email</label>
            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className={inputCls} placeholder="🌊 Oferta exclusiva: Porto de Galinhas" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Preview text</label>
            <input value={form.preview_text} onChange={e => setForm(f => ({ ...f, preview_text: e.target.value }))}
              className={inputCls} placeholder="Texto que aparece antes de abrir o email..." />
          </div>
        </div>

        {/* Blocos selecionado */}
        {selected && (() => {
          const block = blocks.find(b => b.id === selected)
          if (!block) return null
          return (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h2 className="font-display font-bold text-lg text-lr-navy">
                {BLOCK_LABELS[block.type]}
              </h2>
              {Object.entries(block.content).map(([key, val]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  {val.length > 60 ? (
                    <textarea rows={3} value={val}
                      onChange={e => updateBlock(block.id, key, e.target.value)}
                      className={inputCls} />
                  ) : (
                    <input value={val}
                      onChange={e => updateBlock(block.id, key, e.target.value)}
                      className={inputCls} />
                  )}
                </div>
              ))}
              <button onClick={() => removeBlock(block.id)}
                className="text-xs text-red-400 hover:text-red-600 font-semibold">
                Remover bloco
              </button>
            </div>
          )
        })()}

        {/* Adicionar blocos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-display font-bold text-base text-lr-navy mb-3">Adicionar bloco</h2>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(BLOCK_LABELS) as BlockType[]).map(type => (
              <button key={type} onClick={() => addBlock(type)}
                className="text-left px-3 py-2.5 rounded-xl text-xs font-medium border border-gray-100 hover:border-lr-ocean hover:text-lr-ocean transition-colors">
                {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Ações */}
        {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

        <div className="space-y-2">
          <button onClick={handleSave} disabled={saving}
            className="w-full py-2.5 rounded-xl text-sm font-bold border-2 border-lr-navy text-lr-navy hover:bg-lr-navy/5 disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar rascunho'}
          </button>
          {mode === 'edit' && campaign?.status === 'draft' && (
            <button onClick={handleSend} disabled={sending}
              className="w-full py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
              style={{ background: '#2E8B57', color: 'white' }}>
              {sending ? 'Enviando...' : '🚀 Enviar para todos os subscribers'}
            </button>
          )}
        </div>
      </div>

      {/* Preview do email */}
      <div className="col-span-3">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
            <span className="text-sm font-bold text-gray-500">Preview do email</span>
            <span className="text-xs text-gray-400">{blocks.length} blocos</span>
          </div>

          <div className="divide-y divide-gray-50">
            {blocks.map((block, idx) => (
              <div key={block.id}
                onClick={() => setSelected(block.id)}
                className={`relative cursor-pointer group transition-all ${selected === block.id ? 'ring-2 ring-lr-ocean ring-inset' : 'hover:ring-1 hover:ring-gray-200 hover:ring-inset'}`}>

                {renderBlockPreview(block)}

                {/* Controls */}
                <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1">
                  <button onClick={e => { e.stopPropagation(); moveBlock(block.id, 'up') }}
                    className="w-6 h-6 rounded bg-white/90 text-gray-500 hover:text-lr-navy text-xs border border-gray-200 flex items-center justify-center">
                    ↑
                  </button>
                  <button onClick={e => { e.stopPropagation(); moveBlock(block.id, 'down') }}
                    className="w-6 h-6 rounded bg-white/90 text-gray-500 hover:text-lr-navy text-xs border border-gray-200 flex items-center justify-center">
                    ↓
                  </button>
                  <button onClick={e => { e.stopPropagation(); removeBlock(block.id) }}
                    className="w-6 h-6 rounded bg-white/90 text-red-400 hover:text-red-600 text-xs border border-gray-200 flex items-center justify-center">
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
