import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, discountPercent, isPromotionActive, whatsappUrl } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Destinos — Linha Reta Turismo',
  description: 'Explore todos os nossos destinos: Porto de Galinhas, Fernando de Noronha, Maceió, Natal, Gramado e muito mais.',
}

export const revalidate = 60

const CATEGORIES = [
  { value: 'all',           label: 'Todos' },
  { value: 'nordeste',      label: 'Nordeste' },
  { value: 'nacional',      label: 'Brasil' },
  { value: 'internacional', label: 'Internacional' },
  { value: 'cruzeiro',      label: 'Cruzeiros' },
]

export default async function DestinosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('destinations').select('*').neq('status', 'inactive').order('sort_order')
  if (categoria && categoria !== 'all') {
    query = query.eq('category', categoria)
  }

  const { data: destinations } = await query
  const active = categoria || 'all'

  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 text-center" style={{ background: 'linear-gradient(160deg, #003A5D 0%, #002438 100%)' }}>
        <div className="text-lr-ocean font-bold text-sm uppercase tracking-widest mb-3">Explore o Brasil</div>
        <h1 className="font-display font-extrabold text-5xl md:text-6xl text-white tracking-tight mb-4">
          Nossos destinos
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          Do Nordeste à Serra Gaúcha, cuide só de aproveitar. Nós cuidamos de tudo.
        </p>
      </section>

      {/* Filtros */}
      <section className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-thin">
          {CATEGORIES.map(cat => (
            <Link key={cat.value}
              href={cat.value === 'all' ? '/destinos' : `/destinos?categoria=${cat.value}`}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: active === cat.value ? '#003A5D' : 'transparent',
                color:      active === cat.value ? 'white'   : '#3A4D5C',
                border:     active === cat.value ? 'none'    : '1px solid #e5e7eb',
              }}>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        <div className="max-w-7xl mx-auto">
          {!destinations?.length ? (
            <div className="text-center py-20 text-gray-400">Nenhum destino encontrado nessa categoria.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((d) => {
                const hasPromo = d.status === 'promotion' && d.promotion_price && isPromotionActive(d.promotion_end_date)
                const displayPrice = hasPromo ? d.promotion_price! : d.base_price
                const waMsg = d.whatsapp_message || undefined

                return (
                  <Link key={d.id} href={`/destinos/${d.slug}`} className="destination-card group">
                    <div className="relative h-56 overflow-hidden">
                      {d.cover_image_url ? (
                        <Image src={d.cover_image_url} alt={d.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-lr-sky/30" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="badge bg-lr-navy/90 text-white text-[10px] capitalize">{d.category}</span>
                      </div>

                      {hasPromo && (
                        <div className="absolute top-3 right-3">
                          <span className="badge bg-lr-coral text-white text-[10px]">
                            -{discountPercent(d.base_price!, d.promotion_price!)}% OFF
                          </span>
                        </div>
                      )}

                      {d.duration_days && (
                        <div className="absolute bottom-3 right-3 text-white/90 text-xs font-medium bg-black/30 px-2 py-0.5 rounded-full">
                          {d.duration_days} dias
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h2 className="font-display font-bold text-xl text-lr-navy mb-1">{d.name}</h2>
                      <p className="text-lr-ink-soft text-sm leading-relaxed line-clamp-2 mb-4">{d.short_description}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          {hasPromo && d.base_price && (
                            <div className="text-xs text-gray-400 line-through">{formatPrice(d.base_price)}</div>
                          )}
                          {displayPrice && (
                            <div className="font-display font-bold text-xl text-lr-navy">
                              a partir de {formatPrice(displayPrice)}
                            </div>
                          )}
                        </div>
                        <div className="w-9 h-9 rounded-full bg-lr-sun flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#003A5D" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="section-title mb-4">Não encontrou o destino ideal?</h2>
          <p className="text-lr-ink-soft mb-8">Fale com a gente e montamos um roteiro personalizado para você.</p>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
