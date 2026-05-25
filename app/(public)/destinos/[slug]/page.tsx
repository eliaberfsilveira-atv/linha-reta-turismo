import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, discountPercent, isPromotionActive, whatsappUrl } from '@/lib/utils'
import SchemaOrg from '@/components/public/SchemaOrg'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('destinations').select('name, short_description').eq('slug', slug).single()
  return {
    title:       data ? `${data.name} — Linha Reta Turismo` : 'Destino',
    description: data?.short_description || '',
  }
}

export default async function DestinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: d } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .neq('status', 'inactive')
    .single()

  if (!d) notFound()

  const hasPromo     = d.status === 'promotion' && d.promotion_price && isPromotionActive(d.promotion_end_date)
  const displayPrice = hasPromo ? d.promotion_price! : d.base_price
  const waUrl        = whatsappUrl(d.whatsapp_message || undefined)

  return (
    <>
      <SchemaOrg type="destination" data={{ name: d.name, description: d.short_description, image: d.cover_image_url, price: d.base_price ?? undefined, slug: d.slug }} />
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px]">
        {d.cover_image_url ? (
          <Image src={d.cover_image_url} alt={d.name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-lr-navy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge bg-white/20 text-white text-xs capitalize">{d.category}</span>
              {d.duration_days && (
                <span className="badge bg-white/20 text-white text-xs">{d.duration_days} dias</span>
              )}
              {hasPromo && (
                <span className="badge bg-lr-coral text-white text-xs">
                  -{discountPercent(d.base_price!, d.promotion_price!)}% OFF
                </span>
              )}
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white tracking-tight">{d.name}</h1>
            {d.short_description && (
              <p className="text-white/80 text-lg mt-2 max-w-2xl">{d.short_description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="section">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-8">

            {/* Descrição */}
            {d.long_description && (
              <div>
                <h2 className="section-title text-3xl mb-4">Sobre o destino</h2>
                <p className="text-lr-ink-soft leading-relaxed text-lg">{d.long_description}</p>
              </div>
            )}

            {/* Galeria */}
            {d.gallery_urls?.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-2xl text-lr-navy mb-4">Galeria</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {d.gallery_urls.map((url: string, i: number) => (
                    <div key={i} className="relative h-40 rounded-xl overflow-hidden">
                      <Image src={url} alt={`${d.name} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Destaques */}
            {d.highlights?.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-2xl text-lr-navy mb-4">Destaques</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {d.highlights.map((h: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-lr-sky/20">
                      <div className="w-8 h-8 rounded-full bg-lr-ocean/20 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00A7D8" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                      <span className="text-lr-ink font-medium text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* O que está incluído */}
            {d.includes?.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-2xl text-lr-navy mb-4">O que está incluído</h2>
                <ul className="space-y-2">
                  {d.includes.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-lr-ink-soft">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E8B57" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-5">
              {/* Preço */}
              <div>
                {hasPromo && d.base_price && (
                  <div className="text-sm text-gray-400 line-through">{formatPrice(d.base_price)}</div>
                )}
                {displayPrice && (
                  <>
                    <div className="text-xs text-gray-500 mb-0.5">a partir de</div>
                    <div className="font-display font-extrabold text-4xl text-lr-navy">{formatPrice(displayPrice)}</div>
                  </>
                )}
                {d.duration_days && (
                  <div className="text-sm text-gray-500 mt-1">{d.duration_days} dias de experiência</div>
                )}
              </div>

              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="btn-primary w-full justify-center text-base py-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.472A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.003-1.37l-.358-.214-3.713.955.972-3.606-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                Quero este pacote
              </a>

              <div className="text-center text-xs text-gray-400">
                Resposta em até 48 horas · Sem compromisso
              </div>

              <div className="border-t border-gray-50 pt-4 space-y-2 text-sm text-gray-500">
                {[
                  'Pacote personalizado',
                  'Suporte durante toda a viagem',
                  'Seguro viagem incluído',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2E8B57" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb back */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <Link href="/destinos" className="text-lr-ocean text-sm hover:underline">← Ver todos os destinos</Link>
      </div>
    </>
  )
}
