import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Dashboard — Admin' }
export const revalidate = 30

async function getStats() {
  const supabase = await createClient()
  const [leads, subscribers, posts, destinations] = await Promise.all([
    supabase.from('leads').select('id, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('subscribers').select('id', { count: 'exact' }).eq('is_subscribed', true),
    supabase.from('posts').select('id', { count: 'exact' }).eq('status', 'published'),
    supabase.from('destinations').select('id', { count: 'exact' }).eq('status', 'active'),
  ])
  return {
    recentLeads:      leads.data || [],
    subscriberCount:  subscribers.count || 0,
    publishedPosts:   posts.count || 0,
    activeDestinations: destinations.count || 0,
    newLeadsCount:    leads.data?.filter((l: any) => l.status === 'new').length || 0,
  }
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  new:       { label: 'Novo',        color: '#FFC247' },
  contacted: { label: 'Contactado',  color: '#00A7D8' },
  converted: { label: 'Convertido',  color: '#2E8B57' },
  lost:      { label: 'Perdido',     color: '#FF7A59' },
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: 'Leads novos',       value: stats.newLeadsCount,       icon: '🔔', href: '/admin/leads',     color: '#FFC247' },
    { label: 'Subscribers ativos',value: stats.subscriberCount,     icon: '📧', href: '/admin/email',     color: '#00A7D8' },
    { label: 'Posts publicados',  value: stats.publishedPosts,      icon: '✍️', href: '/admin/blog',      color: '#2E8B57' },
    { label: 'Destinos ativos',   value: stats.activeDestinations,  icon: '✈️', href: '/admin/destinos',  color: '#003A5D' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">Dashboard</h1>
        <p className="text-lr-ink-soft mt-1">Visão geral da Linha Reta Turismo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <a key={card.label} href={card.href}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="text-2xl mb-3">{card.icon}</div>
            <div className="font-display font-extrabold text-3xl mb-1" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-lr-navy transition-colors">{card.label}</div>
          </a>
        ))}
      </div>

      {/* Leads recentes */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <h2 className="font-display font-bold text-lg text-lr-navy">Leads recentes</h2>
          <a href="/admin/leads" className="text-sm text-lr-ocean hover:underline">Ver todos →</a>
        </div>

        {stats.recentLeads.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">Nenhum lead ainda</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.recentLeads.map((lead: any) => {
              const st = STATUS_LABEL[lead.status] || STATUS_LABEL.new
              return (
                <div key={lead.id} className="flex items-center justify-between px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: st.color + '20', color: st.color }}>
                    {st.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
