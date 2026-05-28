import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import KPICard from '@/components/admin/KPICard'
import DashboardCharts from '@/components/admin/DashboardCharts'
import { formatDate } from '@/lib/utils'

export const revalidate = 0

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

async function getData() {
  const supabase = await createClient()
  const now      = new Date()
  const thisMonth  = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const lastMonth  = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const ago24h     = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const ago30d     = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    leadsAll, leadsThis, leadsLast, leadsUrgent,
    subsAll, subsThis, subsLast,
    postsAll, destinationsAll,
    leadsRecent, leadsBy30d,
  ] = await Promise.all([
    supabase.from('leads').select('id, status, source, destination_id, created_at, name').order('created_at', { ascending: false }),
    supabase.from('leads').select('id', { count: 'exact' }).gte('created_at', thisMonth),
    supabase.from('leads').select('id', { count: 'exact' }).gte('created_at', lastMonth).lt('created_at', thisMonth),
    supabase.from('leads').select('id', { count: 'exact' }).eq('status', 'new').lt('created_at', ago24h),
    supabase.from('subscribers').select('id', { count: 'exact' }).eq('is_subscribed', true),
    supabase.from('subscribers').select('id', { count: 'exact' }).eq('is_subscribed', true).gte('subscribed_at', thisMonth),
    supabase.from('subscribers').select('id', { count: 'exact' }).eq('is_subscribed', true).gte('subscribed_at', lastMonth).lt('subscribed_at', thisMonth),
    supabase.from('posts').select('id', { count: 'exact' }).eq('status', 'published'),
    supabase.from('destinations').select('id', { count: 'exact' }).neq('status', 'inactive'),
    supabase.from('leads').select('id, name, status, source, created_at, destinations(name)').order('created_at', { ascending: false }).limit(5),
    supabase.from('leads').select('created_at').gte('created_at', ago30d).order('created_at'),
  ])

  const allLeads = leadsAll.data || []

  // Conversão
  const converted    = allLeads.filter(l => l.status === 'converted').length
  const convRate     = allLeads.length ? Math.round((converted / allLeads.length) * 100) : 0
  const convLast     = 0 // simplificado

  // Funil
  const funnel = {
    new:       allLeads.filter(l => l.status === 'new').length,
    contacted: allLeads.filter(l => l.status === 'contacted').length,
    converted: allLeads.filter(l => l.status === 'converted').length,
    lost:      allLeads.filter(l => l.status === 'lost').length,
  }

  // Leads por destino
  const byDest: Record<string, number> = {}
  allLeads.forEach((l: any) => {
    const name = l.destinations?.name || 'Direto'
    byDest[name] = (byDest[name] || 0) + 1
  })
  const leadsByDest = Object.entries(byDest)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name: name.split(',')[0], count }))

  // Leads por source
  const bySrc: Record<string, number> = {}
  allLeads.forEach(l => { bySrc[l.source || 'Direto'] = (bySrc[l.source || 'Direto'] || 0) + 1 })
  const leadsBySrc = Object.entries(bySrc).map(([name, value]) => ({ name, value }))

  // Sparklines (últimos 7 dias simplificado)
  const sparkLeads = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000).toDateString()
    return allLeads.filter(l => new Date(l.created_at).toDateString() === d).length
  })

  // Leads por dia (30 dias)
  const leadsByDay: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toISOString().split('T')[0]
    const count = (leadsBy30d.data || []).filter(l => l.created_at.startsWith(key)).length
    leadsByDay.push({ date: key.slice(5), count })
  }

  // Trend %
  const leadsThisCount = leadsThis.count || 0
  const leadsLastCount = leadsLast.count || 1
  const leadsTrend     = Math.round(((leadsThisCount - leadsLastCount) / leadsLastCount) * 100)
  const subsTrend      = Math.round((((subsThis.count || 0) - (subsLast.count || 1)) / (subsLast.count || 1)) * 100)

  return {
    leadsThis:   leadsThisCount,
    leadsUrgent: leadsUrgent.count || 0,
    leadsTrend,
    subsTotal:   subsAll.count || 0,
    subsThis:    subsThis.count || 0,
    subsTrend,
    convRate,
    postsTotal:  postsAll.count || 0,
    destsTotal:  destinationsAll.count || 0,
    funnel,
    leadsByDest,
    leadsBySrc,
    sparkLeads,
    leadsByDay,
    recent: leadsRecent.data || [],
    totalLeads: allLeads.length,
  }
}

const SOURCE_LABEL: Record<string, string> = {
  contact_form: 'Formulário', destination_page: 'Destino', blog: 'Blog', capture_page: 'Captura',
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new:       { label: 'Novo',       color: '#FFC247' },
  contacted: { label: 'Contactado', color: '#00A7D8' },
  converted: { label: 'Convertido', color: '#2E8B57' },
  lost:      { label: 'Perdido',    color: '#FF7A59' },
}

export default async function AdminDashboard() {
  const d = await getData()

  return (
    <div className="space-y-8 pb-12">

      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight" style={{ color: 'var(--dash-text)' }}>
            {greeting()}, Linha Reta 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--dash-text-soft)' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Alertas */}
        {d.leadsUrgent > 0 && (
          <Link href="/admin/leads?status=new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold animate-pulse"
            style={{ background: '#FF7A5920', color: '#FF7A59', border: '1px solid #FF7A5940' }}>
            🔴 {d.leadsUrgent} lead{d.leadsUrgent > 1 ? 's' : ''} sem resposta há +24h
          </Link>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon="📥" label="Leads este mês"     value={d.leadsThis}   trend={d.leadsTrend}  sparkline={d.sparkLeads}  delay={0}    />
        <KPICard icon="👥" label="Subscribers ativos"  value={d.subsTotal}   trend={d.subsTrend}   delay={0.08}  />
        <KPICard icon="✅" label="Taxa de conversão"   value={d.convRate}    suffix="%"            delay={0.16}  />
        <KPICard icon="⚠️" label="Leads urgentes"      value={d.leadsUrgent} alert={d.leadsUrgent > 0} delay={0.24} />
      </div>

      {/* Stats secundários */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total de leads', value: d.totalLeads, icon: '📊' },
          { label: 'Posts publicados', value: d.postsTotal, icon: '✍️' },
          { label: 'Destinos ativos', value: d.destsTotal, icon: '✈️' },
        ].map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
            <div className="text-2xl">{s.icon}</div>
            <div>
              <div className="font-display font-extrabold text-2xl" style={{ color: 'var(--dash-text)' }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--dash-text-soft)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <DashboardCharts
        leadsByDay={d.leadsByDay}
        leadsByDest={d.leadsByDest}
        leadsBySrc={d.leadsBySrc}
        funnel={d.funnel}
      />

      {/* Feed + Ações rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Feed de atividade */}
        <div className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
          <h2 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--dash-text)' }}>
            Atividade recente
          </h2>
          <div className="space-y-3">
            {d.recent.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--dash-text-soft)' }}>Nenhuma atividade ainda.</p>
            )}
            {d.recent.map((lead: any, i: number) => {
              const st = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new
              return (
                <div key={lead.id} className="flex items-center gap-3 py-2 border-b last:border-0"
                  style={{ borderColor: 'var(--dash-border)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: st.color }}>
                    {lead.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--dash-text)' }}>
                      {lead.name || 'Lead'} — {(lead as any).destinations?.name || SOURCE_LABEL[lead.source] || 'Direto'}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--dash-text-soft)' }}>
                      {formatDate(lead.created_at)}
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: st.color + '20', color: st.color }}>
                    {st.label}
                  </span>
                </div>
              )
            })}
          </div>
          <Link href="/admin/leads" className="block mt-4 text-xs font-semibold text-center"
            style={{ color: 'var(--dash-accent)' }}>
            Ver todos os leads →
          </Link>
        </div>

        {/* Ações rápidas */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
          <h2 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--dash-text)' }}>
            Ações rápidas
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Novo post no blog',    href: '/admin/blog/novo',      icon: '✍️' },
              { label: 'Novo destino',          href: '/admin/destinos/novo',  icon: '✈️' },
              { label: 'Nova campanha email',   href: '/admin/email/nova',     icon: '📧' },
              { label: 'Ver leads novos',       href: '/admin/leads?status=new', icon: '📥' },
              { label: 'Ver subscribers',       href: '/admin/email/subscribers', icon: '👥' },
            ].map(action => (
              <Link key={action.href} href={action.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{
                  background: 'var(--dash-bg)',
                  color:      'var(--dash-text)',
                  border:     '1px solid var(--dash-border)',
                }}>
                <span>{action.icon}</span>
                {action.label}
                <span className="ml-auto" style={{ color: 'var(--dash-text-soft)' }}>→</span>
              </Link>
            ))}
          </div>

          {/* Funil resumido */}
          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--dash-border)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--dash-text-soft)' }}>
              Pipeline de leads
            </div>
            {Object.entries({
              'Novos':       { count: d.funnel.new,       color: '#FFC247' },
              'Contactados': { count: d.funnel.contacted, color: '#00A7D8' },
              'Convertidos': { count: d.funnel.converted, color: '#2E8B57' },
              'Perdidos':    { count: d.funnel.lost,      color: '#FF7A59' },
            }).map(([label, { count, color }]) => (
              <div key={label} className="flex items-center gap-2 mb-2">
                <div className="text-xs w-24 shrink-0" style={{ color: 'var(--dash-text-soft)' }}>{label}</div>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--dash-bg)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.totalLeads ? (count / d.totalLeads) * 100 : 0}%`, background: color }} />
                </div>
                <div className="text-xs font-bold w-6 text-right" style={{ color }}>{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
