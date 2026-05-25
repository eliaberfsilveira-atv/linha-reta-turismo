import { createClient } from '@/lib/supabase/server'
import { formatDate, whatsappUrl } from '@/lib/utils'
import LeadActions from './LeadActions'

export const metadata = { title: 'Leads — Admin' }
export const revalidate = 0

const STATUS_CONFIG = {
  new:       { label: 'Novo',        color: '#FFC247', bg: '#FFC24720', order: 0 },
  contacted: { label: 'Contactado',  color: '#00A7D8', bg: '#00A7D820', order: 1 },
  converted: { label: 'Convertido',  color: '#2E8B57', bg: '#2E8B5720', order: 2 },
  lost:      { label: 'Perdido',     color: '#FF7A59', bg: '#FF7A5920', order: 3 },
}

const SOURCE_LABEL: Record<string, string> = {
  contact_form:     'Formulário',
  destination_page: 'Página destino',
  blog:             'Blog',
  capture_page:     'Captura',
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const { status, search } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('leads')
    .select('*, destinations(name)')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data: leads } = await query

  // Contagem por status
  const { data: allLeads } = await supabase
    .from('leads')
    .select('status')

  const counts = (allLeads || []).reduce((acc: Record<string, number>, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1
    acc.all = (acc.all || 0) + 1
    return acc
  }, {})

  const activeStatus = status || 'all'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">Leads</h1>
          <p className="text-lr-ink-soft mt-1">{counts.all || 0} contatos recebidos</p>
        </div>
      </div>

      {/* Stats por status */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { key: 'all', label: 'Todos', color: '#003A5D', bg: '#003A5D15' },
          ...Object.entries(STATUS_CONFIG).map(([key, val]) => ({ key, ...val })),
        ].map(stat => (
          <a key={stat.key} href={`/admin/leads${stat.key !== 'all' ? `?status=${stat.key}` : ''}`}
            className="p-4 rounded-2xl border-2 transition-all"
            style={{
              background:   activeStatus === stat.key ? stat.bg : 'white',
              borderColor:  activeStatus === stat.key ? stat.color : '#e5e7eb',
            }}>
            <div className="font-display font-extrabold text-2xl" style={{ color: stat.color }}>
              {counts[stat.key] || 0}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </a>
        ))}
      </div>

      {/* Search */}
      <form className="mb-4">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          name="search"
          defaultValue={search}
          placeholder="Buscar por nome ou email..."
          className="w-full md:w-96 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-lr-ocean"
        />
      </form>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!leads?.length ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <div className="font-bold text-lr-navy mb-1">Nenhum lead encontrado</div>
            <div className="text-gray-400 text-sm">
              {search ? 'Tente uma busca diferente.' : 'Os leads aparecerão aqui quando chegarem pelo site.'}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {leads.map((lead: any) => {
              const st = STATUS_CONFIG[lead.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.new
              const waUrl = whatsappUrl(`Olá ${lead.name}! Vi seu contato pelo site da Linha Reta. Posso te ajudar?`)

              return (
                <div key={lead.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="font-bold text-lr-navy">{lead.name}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                        {lead.destinations?.name && (
                          <span className="text-xs text-gray-400">✈️ {lead.destinations.name}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                        <a href={`mailto:${lead.email}`} className="hover:text-lr-ocean transition-colors">
                          ✉️ {lead.email}
                        </a>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="hover:text-lr-ocean transition-colors">
                            📞 {lead.phone}
                          </a>
                        )}
                        <span className="text-xs text-gray-400">
                          {SOURCE_LABEL[lead.source] || lead.source} · {formatDate(lead.created_at)}
                        </span>
                      </div>

                      {lead.message && (
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mb-2 line-clamp-2">
                          &ldquo;{lead.message}&rdquo;
                        </p>
                      )}

                      {lead.admin_notes && (
                        <p className="text-xs text-lr-ocean bg-lr-sky/20 rounded-lg px-3 py-1.5">
                          📝 {lead.admin_notes}
                        </p>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a href={waUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-105"
                        style={{ background: '#25D366', color: 'white' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.472A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.003-1.37l-.358-.214-3.713.955.972-3.606-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                        WhatsApp
                      </a>
                      <LeadActions lead={lead} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
