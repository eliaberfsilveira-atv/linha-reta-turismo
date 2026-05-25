import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Email Marketing — Admin' }
export const revalidate = 0

const STATUS_CONFIG = {
  draft:     { label: 'Rascunho',   color: '#9CA3AF', bg: '#F3F4F6' },
  scheduled: { label: 'Agendado',   color: '#00A7D8', bg: '#00A7D820' },
  sending:   { label: 'Enviando',   color: '#FFC247', bg: '#FFC24720' },
  sent:      { label: 'Enviado',    color: '#2E8B57', bg: '#2E8B5720' },
  paused:    { label: 'Pausado',    color: '#FF7A59', bg: '#FF7A5920' },
}

export default async function AdminEmailPage() {
  const supabase = await createClient()

  const [campaignsRes, subscribersRes] = await Promise.all([
    supabase.from('email_campaigns').select('*').order('created_at', { ascending: false }),
    supabase.from('subscribers').select('id', { count: 'exact' }).eq('is_subscribed', true),
  ])

  const campaigns   = campaignsRes.data || []
  const totalSubs   = subscribersRes.count || 0
  const sent        = campaigns.filter(c => c.status === 'sent').length
  const drafts      = campaigns.filter(c => c.status === 'draft').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">Email Marketing</h1>
          <p className="text-lr-ink-soft mt-1">
            {totalSubs} subscribers · {sent} campanhas enviadas · {drafts} rascunhos
          </p>
        </div>
        <Link href="/admin/email/nova"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
          style={{ background: '#FFC247', color: '#003A5D' }}>
          📧 Nova campanha
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Subscribers ativos', value: totalSubs, icon: '👥', color: '#00A7D8' },
          { label: 'Campanhas enviadas', value: sent,      icon: '✅', color: '#2E8B57' },
          { label: 'Taxa média abertura', value: campaigns.filter(c => c.status === 'sent').length > 0
              ? Math.round(campaigns.filter(c => c.status === 'sent').reduce((acc, c) => acc + (c.open_count / Math.max(c.recipient_count, 1)), 0) / Math.max(sent, 1) * 100) + '%'
              : '—',
            icon: '📊', color: '#FFC247' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="font-display font-extrabold text-2xl" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Subscribers link */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl text-lr-navy">Campanhas</h2>
        <Link href="/admin/email/subscribers" className="text-sm text-lr-ocean hover:underline">
          Ver subscribers ({totalSubs}) →
        </Link>
      </div>

      {/* Campaigns list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!campaigns.length ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-3">📧</div>
            <div className="font-bold text-lr-navy mb-1">Nenhuma campanha ainda</div>
            <div className="text-gray-400 text-sm mb-6">Crie sua primeira campanha de email</div>
            <Link href="/admin/email/nova"
              className="inline-flex px-5 py-2.5 rounded-xl font-bold text-sm"
              style={{ background: '#FFC247', color: '#003A5D' }}>
              Criar campanha
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Campanha</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Enviados</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Aberturas</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Data</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c) => {
                const st = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft
                const openRate = c.recipient_count > 0
                  ? Math.round((c.open_count / c.recipient_count) * 100) + '%'
                  : '—'
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-lr-navy">{c.name}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{c.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{c.recipient_count || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{openRate}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {c.sent_at ? formatDate(c.sent_at) : formatDate(c.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/email/${c.id}`}
                        className="text-lr-ocean text-sm font-semibold hover:underline">
                        {c.status === 'draft' ? 'Editar →' : 'Ver →'}
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
