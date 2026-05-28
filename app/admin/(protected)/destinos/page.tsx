import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export const metadata = { title: 'Destinos — Admin' }
export const revalidate = 0

const STATUS_CONFIG = {
  active:    { label: 'Ativo',     color: '#2E8B57', bg: '#2E8B5720' },
  inactive:  { label: 'Inativo',   color: '#FF7A59', bg: '#FF7A5920' },
  promotion: { label: 'Promoção',  color: '#FFC247', bg: '#FFC24720' },
}

const CATEGORY_LABEL: Record<string, string> = {
  nordeste:      'Nordeste',
  nacional:      'Brasil',
  internacional: 'Internacional',
  cruzeiro:      'Cruzeiro',
}

export default async function AdminDestinosPage() {
  const supabase = await createClient()
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">Destinos</h1>
          <p className="text-lr-ink-soft mt-1">{destinations?.length || 0} destinos cadastrados</p>
        </div>
        <Link href="/admin/destinos/novo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
          style={{ background: '#FFC247', color: '#003A5D' }}>
          + Novo destino
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!destinations?.length ? (
          <div className="p-16 text-center text-gray-400">Nenhum destino cadastrado</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Destino</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Categoria</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Preço</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {destinations.map((d) => {
                const st = STATUS_CONFIG[d.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active
                return (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {d.cover_image_url && (
                          <img src={d.cover_image_url} alt={d.name}
                            className="w-12 h-9 object-cover rounded-lg shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-lr-navy">{d.name}</div>
                          <div className="text-gray-400 text-xs mt-0.5">{d.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {CATEGORY_LABEL[d.category] || d.category}
                    </td>
                    <td className="px-6 py-4 font-semibold text-lr-navy">
                      {d.base_price ? formatPrice(d.base_price) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/destinos/${d.id}`}
                        className="text-lr-ocean text-sm font-semibold hover:underline">
                        Editar →
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
