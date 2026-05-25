'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Youtube from '@tiptap/extension-youtube'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { slugify, readingTime } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/types/database'

type Props = { post?: Post; mode: 'create' | 'edit' }

const CATEGORIES = ['destinos', 'dicas', 'roteiros', 'gastronomia', 'hospedagem', 'promoções', 'nordeste', 'nacional']

export default function BlogEditor({ post, mode }: Props) {
  const router   = useRouter()
  const supabase = createClient()

  const [saving, setSaving]     = useState(false)
  const [aiLoading, setAiLoad]  = useState(false)
  const [error, setError]       = useState('')
  const [aiPanel, setAiPanel]   = useState(false)
  const [aiTopic, setAiTopic]   = useState('')
  const [aiKeywords, setAiKw]   = useState('')
  const [aiResult, setAiResult] = useState('')

  const [form, setForm] = useState({
    title:            post?.title            || '',
    slug:             post?.slug             || '',
    excerpt:          post?.excerpt          || '',
    category:         post?.category         || '',
    tags:             post?.tags?.join(', ') || '',
    meta_title:       post?.meta_title       || '',
    meta_description: post?.meta_description || '',
    og_image_url:     post?.og_image_url     || '',
    status:           post?.status           || 'draft',
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image,
      Underline,
      TextStyle,
      Youtube.configure({ controls: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: post?.content ? post.content as any : '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  })

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    setForm(f => ({ ...f, title, slug: mode === 'create' ? slugify(title) : f.slug }))
  }

  async function callAI(action: string) {
    setAiLoad(true)
    setAiResult('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          topic:    aiTopic || form.title,
          keywords: aiKeywords.split(',').map(k => k.trim()).filter(Boolean),
          draft:    editor?.getText().slice(0, 500),
        }),
      })
      const data = await res.json()
      setAiResult(data.result || 'Erro ao gerar conteúdo')
    } catch {
      setAiResult('Erro ao conectar com a IA')
    }
    setAiLoad(false)
  }

  function insertAIDraft() {
    if (!editor || !aiResult) return
    editor.commands.setContent(aiResult)
    setAiPanel(false)
  }

  async function handleSave(status: string) {
    setSaving(true)
    setError('')

    const content   = editor?.getJSON()
    const textContent = editor?.getText() || ''

    const payload = {
      title:            form.title,
      slug:             form.slug,
      excerpt:          form.excerpt || null,
      content:          content || null,
      category:         form.category || null,
      tags:             form.tags.split(',').map(t => t.trim()).filter(Boolean),
      meta_title:       form.meta_title || null,
      meta_description: form.meta_description || null,
      og_image_url:     form.og_image_url || null,
      status:           status as any,
      reading_time_min: readingTime(textContent),
      published_at:     status === 'published' ? new Date().toISOString() : (post?.published_at || null),
    }

    let err
    if (mode === 'create') {
      const res = await supabase.from('posts').insert(payload)
      err = res.error
    } else {
      const res = await supabase.from('posts').update(payload).eq('id', post!.id)
      err = res.error
    }

    if (err) { setError(err.message); setSaving(false); return }
    router.push('/admin/blog')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm('Excluir este post permanentemente?')) return
    await supabase.from('posts').delete().eq('id', post!.id)
    router.push('/admin/blog')
  }

  const ToolbarBtn = ({ onClick, active, title, children }: any) => (
    <button type="button" onClick={onClick} title={title}
      className={`px-2.5 py-1.5 rounded text-sm font-medium transition-colors ${active ? 'bg-lr-navy text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
      {children}
    </button>
  )

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-lr-ocean transition-colors"

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Título e slug */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <input
          value={form.title}
          onChange={handleTitleChange}
          placeholder="Título do post..."
          className="w-full text-3xl font-display font-extrabold text-lr-navy border-none outline-none placeholder-gray-300"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">URL:</span>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            className="flex-1 text-xs text-lr-ocean border-b border-dashed border-gray-200 outline-none pb-0.5" />
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 px-4 py-3 border-b border-gray-50">
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Negrito">
            <strong>B</strong>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Itálico">
            <em>I</em>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')} title="Sublinhado">
            <u>U</u>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHighlight().run()} active={editor?.isActive('highlight')} title="Destaque">
            ✦
          </ToolbarBtn>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Título H2">
            H2
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Título H3">
            H3
          </ToolbarBtn>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Lista">
            ≡
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Lista numerada">
            1.
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Citação">
            "
          </ToolbarBtn>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={() => {
            const url = prompt('URL do link:')
            if (url) editor?.chain().focus().setLink({ href: url }).run()
          }} active={editor?.isActive('link')} title="Link">
            🔗
          </ToolbarBtn>
          <ToolbarBtn onClick={() => {
            const url = prompt('URL da imagem:')
            if (url) editor?.chain().focus().setImage({ src: url }).run()
          }} active={false} title="Imagem">
            🖼
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} active={false} title="Tabela">
            ⊞
          </ToolbarBtn>
          <div className="ml-auto">
            <button type="button" onClick={() => setAiPanel(!aiPanel)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{ background: aiPanel ? '#003A5D' : '#FFC247', color: aiPanel ? 'white' : '#003A5D' }}>
              ✦ Assistente IA
            </button>
          </div>
        </div>

        {/* Painel IA */}
        {aiPanel && (
          <div className="border-b border-gray-50 p-4 space-y-3" style={{ background: '#F8F4EA' }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tema / título</label>
                <input value={aiTopic} onChange={e => setAiTopic(e.target.value)}
                  className={inputCls} placeholder="ex: melhores praias do Nordeste" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Palavras-chave (separe por vírgula)</label>
                <input value={aiKeywords} onChange={e => setAiKw(e.target.value)}
                  className={inputCls} placeholder="praias nordeste, viagem barata" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => callAI('draft_post')} disabled={aiLoading}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-lr-navy text-white disabled:opacity-50">
                {aiLoading ? '⏳ Gerando...' : '✦ Gerar rascunho completo'}
              </button>
              <button type="button" onClick={() => callAI('meta_description')} disabled={aiLoading}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-lr-navy text-lr-navy disabled:opacity-50">
                Meta description
              </button>
              <button type="button" onClick={() => callAI('suggest_tags')} disabled={aiLoading}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-lr-navy text-lr-navy disabled:opacity-50">
                Sugerir tags
              </button>
            </div>
            {aiResult && (
              <div className="space-y-2">
                <textarea readOnly value={aiResult} rows={6}
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 bg-white resize-none" />
                <div className="flex gap-2">
                  <button type="button" onClick={insertAIDraft}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-lr-ocean text-white">
                    Inserir no editor
                  </button>
                  <button type="button" onClick={() => {
                    setForm(f => ({ ...f, meta_description: aiResult.slice(0, 155) }))
                  }}
                    className="px-4 py-2 rounded-lg text-xs font-bold border border-gray-300 text-gray-600">
                    Usar como meta description
                  </button>
                  <button type="button" onClick={() => {
                    setForm(f => ({ ...f, tags: aiResult }))
                  }}
                    className="px-4 py-2 rounded-lg text-xs font-bold border border-gray-300 text-gray-600">
                    Usar como tags
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <EditorContent editor={editor} />
      </div>

      {/* Excerpt */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Resumo / Excerpt</label>
        <textarea rows={3} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
          className={inputCls} placeholder="Breve descrição exibida na listagem do blog..." />
      </div>

      {/* Categoria e tags */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-lr-navy">Categorização</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Categoria</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
              <option value="">Selecione...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tags (separe por vírgula)</label>
            <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              className={inputCls} placeholder="nordeste, praia, viagem em família" />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-lr-navy">SEO</h2>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Meta title</label>
          <input value={form.meta_title} onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))}
            className={inputCls} placeholder="Título para o Google (60 caracteres ideal)" />
          <div className="text-xs text-gray-400 mt-1">{form.meta_title.length}/60 caracteres</div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Meta description</label>
          <textarea rows={3} value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))}
            className={inputCls} placeholder="Descrição para o Google (155 caracteres ideal)" />
          <div className="text-xs text-gray-400 mt-1">{form.meta_description.length}/155 caracteres</div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">OG Image URL</label>
          <input value={form.og_image_url} onChange={e => setForm(f => ({ ...f, og_image_url: e.target.value }))}
            className={inputCls} placeholder="https://... (imagem para compartilhar nas redes)" />
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

      {/* Ações */}
      <div className="flex items-center justify-between pb-10">
        {mode === 'edit' && (
          <button type="button" onClick={handleDelete}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
            Excluir post
          </button>
        )}
        <div className="flex gap-3 ml-auto">
          <button type="button" onClick={() => router.push('/admin/blog')}
            className="px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="button" onClick={() => handleSave('draft')} disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-bold border-2 border-lr-navy text-lr-navy hover:bg-lr-navy/5 disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar rascunho'}
          </button>
          <button type="button" onClick={() => handleSave('published')} disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
            style={{ background: '#FFC247', color: '#003A5D' }}>
            {saving ? 'Publicando...' : '🚀 Publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}
