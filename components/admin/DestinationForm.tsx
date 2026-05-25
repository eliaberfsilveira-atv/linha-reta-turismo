'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import type { Destination } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

type Props = {
  destination?: Destination
  mode: 'create' | 'edit'
}

const CATEGORIES = ['nordeste', 'nacional', 'internacional', 'cruzeiro']
const STATUSES   = ['active', 'inactive', 'promotion']
const STATUS_LABELS: Record<string, string> = { active: 'Ativo', inactive: 'Inativo', promotion: 'Promoção' }

export default function DestinationForm({ destination, mode }: Props) {
  const router  = useRouter()
  const supabase = createClient()

  const [loading, setLoading]       = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState(false)

  const [form, setForm] = useState({
    name:              destination?.name              || '',
    slug:              destination?.slug              || '',
    short_description: destination?.short_description || '',
    long_description:  destination?.long_description  || '',
    category:          destination?.category          || 'nordeste',
    cover_image_url:   destination?.cover_image_url   || '',
    base_price:        destination?.base_price?.toString()        || '',
    promotion_price:   destination?.promotion_price?.toString()   || '',
    promotion_end_date:destination?.promotion_end_date?.slice(0,10) || '',
    duration_days:     destination?.duration_days?.toString()     || '',
    whatsapp_message:  destination?.whatsapp_message  || '',
    status:            destination?.status            || 'active',
    sort_order:        destination?.sort_order?.toString()        || '0',
    includes:          destination?.includes?.join('\n')          || '',
    highlights:        destination?.highlights?.join('\n')        || '',
  })

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm(f => ({ ...f, name, slug: mode === 'create' ? slugify(name) : f.slug }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `destinations/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('media').upload(path, file)
    if (uploadError) { setError('Erro no upload: ' + uploadError.message); setUploading(false); return }

    const { data } = supabase.storage.from('media').getPublicUrl(path)
    setForm(f => ({ ...f, cover_image_url: data.publicUrl }))
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      name:               form.name,
      slug:               form.slug,
      short_description:  form.short_description || null,
      long_description:   form.long_description  || null,
      category:           form.category as any,
      cover_image_url:    form.cover_image_url   || null,
      base_price:         form.base_price        ? parseFloat(form.base_price)      : null,
      promotion_price:    form.promotion_price   ? parseFloat(form.promotion_price) : null,
      promotion_end_date: form.promotion_end_date || null,
      duration_days:      form.duration_days     ? parseInt(form.duration_days)     : null,
      whatsapp_message:   form.whatsapp_message  || null,
      status:             form.status as any,
      sort_order:         parseInt(form.sort_order) || 0,
      includes:           form.includes.split('\n').filter(Boolean),
      highlights:         form.highlights.split('\n').filter(Boolean),
    }

    let err
    if (mode === 'create') {
      const res = await supabase.from('destinations').insert(payload)
      err = res.error
    } else {
      const res = await supabase.from('destinations').update(payload).eq('id', destination!.id)
      err = res.error
    }

    if (err) { setError(err.message); setLoading(false); return }

    setSuccess(true)
    setTimeout(() => router.push('/admin/destinos'), 800)
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que quer excluir este destino?')) return
    await supabase.from('destinations').delete().eq('id', destination!.id)
    router.push('/admin/destinos')
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-lr-ocean transition-colors"

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">

      {/* Informações básicas */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-lr-navy">Informações básicas</h2>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome do destino *">
            <input required value={form.name} onChange={handleNameChange} className={inputCls} placeholder="Porto de Galinhas" />
          </Field>
          <Field label="Slug (URL)">
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputCls} placeholder="porto-de-galinhas" />
          </Field>
        </div>

        <Field label="Descrição curta">
          <input value={form.short_description} onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} className={inputCls} placeholder="Descrição exibida nos cards" />
        </Field>

        <Field label="Descrição completa">
          <textarea rows={5} value={form.long_description} onChange={e => setForm(f => ({ ...f, long_description: e.target.value }))} className={inputCls} placeholder="Texto completo da página do destino" />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Categoria">
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Duração (dias)">
            <input type="number" value={form.duration_days} onChange={e => setForm(f => ({ ...f, duration_days: e.target.value }))} className={inputCls} placeholder="5" />
          </Field>
          <Field label="Ordem de exibição">
            <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className={inputCls} placeholder="1" />
          </Field>
        </div>
      </div>

      {/* Imagem de capa */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-lr-navy">Imagem de capa</h2>

        {form.cover_image_url && (
          <img src={form.cover_image_url} alt="Capa" className="w-full h-48 object-cover rounded-xl" />
        )}

        <div className="flex gap-3">
          <div className="flex-1">
            <Field label="URL da imagem">
              <input value={form.cover_image_url} onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))} className={inputCls} placeholder="https://..." />
            </Field>
          </div>
          <div className="flex flex-col justify-end">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-lr-ocean text-lr-ocean hover:bg-lr-ocean/5 transition-colors">
              {uploading ? 'Enviando...' : '↑ Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      {/* Preços */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-lr-navy">Preços</h2>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Preço base (R$)">
            <input type="number" step="0.01" value={form.base_price} onChange={e => setForm(f => ({ ...f, base_price: e.target.value }))} className={inputCls} placeholder="1890.00" />
          </Field>
          <Field label="Preço promocional (R$)">
            <input type="number" step="0.01" value={form.promotion_price} onChange={e => setForm(f => ({ ...f, promotion_price: e.target.value }))} className={inputCls} placeholder="1590.00" />
          </Field>
          <Field label="Fim da promoção">
            <input type="date" value={form.promotion_end_date} onChange={e => setForm(f => ({ ...f, promotion_end_date: e.target.value }))} className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Detalhes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-lr-navy">Detalhes</h2>

        <div className="grid grid-cols-2 gap-4">
          <Field label="O que está incluído (1 por linha)">
            <textarea rows={5} value={form.includes} onChange={e => setForm(f => ({ ...f, includes: e.target.value }))} className={inputCls} placeholder={"Hospedagem com café da manhã\nPasseio de jangada\nTransfer"} />
          </Field>
          <Field label="Destaques (1 por linha)">
            <textarea rows={5} value={form.highlights} onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))} className={inputCls} placeholder={"Piscinas naturais\nMergulho com snorkel\nGastronomia local"} />
          </Field>
        </div>

        <Field label="Mensagem WhatsApp personalizada">
          <input value={form.whatsapp_message} onChange={e => setForm(f => ({ ...f, whatsapp_message: e.target.value }))} className={inputCls} placeholder="Olá! Tenho interesse no pacote Porto de Galinhas..." />
        </Field>
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-display font-bold text-lg text-lr-navy mb-4">Status</h2>
        <div className="flex gap-3">
          {STATUSES.map(s => (
            <button key={s} type="button"
              onClick={() => setForm(f => ({ ...f, status: s }))}
              className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
              style={{
                borderColor: form.status === s ? '#003A5D' : '#e5e7eb',
                background:  form.status === s ? '#003A5D' : 'transparent',
                color:        form.status === s ? 'white'   : '#6b7280',
              }}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {error   && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
      {success && <div className="p-4 rounded-xl bg-green-50 text-green-600 text-sm font-bold">Salvo com sucesso!</div>}

      <div className="flex items-center justify-between">
        {mode === 'edit' && (
          <button type="button" onClick={handleDelete}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
            Excluir destino
          </button>
        )}
        <div className="flex gap-3 ml-auto">
          <button type="button" onClick={() => router.push('/admin/destinos')}
            className="px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
            style={{ background: '#FFC247', color: '#003A5D' }}>
            {loading ? 'Salvando...' : mode === 'create' ? 'Criar destino' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </form>
  )
}
