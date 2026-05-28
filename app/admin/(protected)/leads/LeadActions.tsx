'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const STATUS_OPTIONS = [
  { value: 'new',       label: 'Novo',       color: '#FFC247' },
  { value: 'contacted', label: 'Contactado', color: '#00A7D8' },
  { value: 'converted', label: 'Convertido', color: '#2E8B57' },
  { value: 'lost',      label: 'Perdido',    color: '#FF7A59' },
]

type Lead = {
  id: string
  status: string
  admin_notes: string | null
  name: string
}

export default function LeadActions({ lead }: { lead: Lead }) {
  const router   = useRouter()
  const supabase = createClient()

  const [open,   setOpen]   = useState(false)
  const [notes,  setNotes]  = useState(lead.admin_notes || '')
  const [saving, setSaving] = useState(false)

  async function updateStatus(status: string) {
    await supabase.from('leads').update({ status }).eq('id', lead.id)
    router.refresh()
  }

  async function saveNotes() {
    setSaving(true)
    await supabase.from('leads').update({ admin_notes: notes }).eq('id', lead.id)
    setSaving(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        ⋯
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-10 z-20 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Status */}
            <div className="p-3 border-b border-gray-50">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alterar status</div>
              <div className="grid grid-cols-2 gap-1.5">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { updateStatus(opt.value); setOpen(false) }}
                    className="px-2 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
                    style={{
                      background: lead.status === opt.value ? opt.color : opt.color + '20',
                      color:      lead.status === opt.value ? 'white' : opt.color,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div className="p-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notas internas</div>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Observações sobre o lead..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:border-lr-ocean"
              />
              <button
                onClick={saveNotes}
                disabled={saving}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
                style={{ background: '#003A5D', color: 'white' }}
              >
                {saving ? 'Salvando...' : 'Salvar nota'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
