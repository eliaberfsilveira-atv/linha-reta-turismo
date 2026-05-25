import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Subscribers — Admin' }
export const revalidate = 0

export default async function SubscribersPage() {
  const supabase = await createClient()
  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })

  const active   = subscribers?.filter(s => s.is_subscribed).length || 0
  const inactive = subscribers?.filter(s => !s.is_subscribed).length || 0

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/email" className="text-gray-400 hover:text-lr-navy transition-colors text-sm">
          ← Email
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">Subscribers</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Ativos',    value: active,                     color: '#2E8B57' },
          { label: 'Inativos',  value: inactive,                    color: '#FF7A59' },
          { label: 'Total',     value: subscribers?.length || 0,    color: '#003A5D' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="font-display font-extrabold text-3xl mb-1" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!subscribers?.length ? (
          <div className="p-16 text-center text-gray-400">Nenhum subscriber ainda</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Nome</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Origem</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-lr-navy">{s.email}</td>
                  <td className="px-6 py-4 text-gray-600">{s.name || '—'}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs capitalize">{s.source || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: s.is_subscribed ? '#2E8B5720' : '#FF7A5920',
                        color:      s.is_subscribed ? '#2E8B57'   : '#FF7A59',
                      }}>
                      {s.is_subscribed ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(s.subscribed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
