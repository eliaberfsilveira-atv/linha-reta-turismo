import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { whatsappUrl, formatPrice, discountPercent, isPromotionActive } from '@/lib/utils'
import type { Destination, Testimonial } from '@/types/database'
import HeroContent from '@/components/animations/HeroContent'
import HeroVideo from '@/components/animations/HeroVideo'
import LoadingScreen from '@/components/animations/LoadingScreen'
import Reveal from '@/components/animations/Reveal'
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger'

export const metadata: Metadata = {
  title: 'Linha Reta Turismo — Do sonho ao destino, sem desvio.',
  description: 'Pacotes de viagem para os destinos mais bonitos do Brasil. Porto de Galinhas, Fernando de Noronha, Maceió, Natal e muito mais.',
}

export const revalidate = 60

async function getData() {
  const supabase = await createClient()
  const [destinationsRes, testimonialsRes] = await Promise.all([
    supabase.from('destinations').select('*').eq('status', 'active').order('sort_order').limit(6),
    supabase.from('testimonials').select('*').eq('is_published', true).limit(3),
  ])
  return {
    destinations: (destinationsRes.data || []) as Destination[],
    testimonials: (testimonialsRes.data || []) as Testimonial[],
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  nordeste: 'Nordeste', nacional: 'Brasil', internacional: 'Internacional', cruzeiro: 'Cruzeiro',
}

export default async function HomePage() {
  const { destinations, testimonials } = await getData()
  const WHATSAPP = whatsappUrl()

  return (
    <>
      <LoadingScreen />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col"
        style={{ background: '#001829' }}
      >
        <HeroVideo />

        {/* Spacer for fixed nav */}
        <div className="h-20" />

        <HeroContent />

        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path d="M0 80 Q360 20 720 50 T1440 30 L1440 80 Z" fill="#F8F4EA" />
        </svg>
      </section>

      {/* ── DESTINOS ─────────────────────────────────────────── */}
      <section id="destinos" className="section">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <Reveal>
              <div>
                <div className="text-lr-ocean font-bold text-sm uppercase tracking-widest mb-2">Onde você quer ir?</div>
                <h2 className="section-title">Destinos em destaque</h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/destinos" className="text-lr-ocean font-semibold text-sm hover:underline flex items-center gap-1">
                Ver todos os destinos →
              </Link>
            </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => {
              const hasPromo = d.status === 'promotion' && d.promotion_price && isPromotionActive(d.promotion_end_date)
              const displayPrice = hasPromo ? d.promotion_price! : d.base_price
              return (
                <StaggerItem key={d.id}>
                  <Link href={`/destinos/${d.slug}`} className="destination-card group block">
                    <div className="relative h-52 overflow-hidden">
                      {d.cover_image_url ? (
                        <Image src={d.cover_image_url} alt={d.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-lr-sky/30" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="badge bg-lr-navy/90 text-white text-[10px]">{CATEGORY_LABELS[d.category] || d.category}</span>
                      </div>
                      {hasPromo && (
                        <div className="absolute top-3 right-3">
                          <span className="badge bg-lr-coral text-white text-[10px]">-{discountPercent(d.base_price!, d.promotion_price!)}% OFF</span>
                        </div>
                      )}
                      {d.duration_days && (
                        <div className="absolute bottom-3 right-3 text-white/90 text-xs font-medium">{d.duration_days} dias</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-bold text-xl text-lr-navy mb-1">{d.name}</h3>
                      <p className="text-lr-ink-soft text-sm leading-relaxed line-clamp-2 mb-4">{d.short_description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          {hasPromo && d.base_price && (
                            <div className="text-xs text-lr-ink-soft/60 line-through">{formatPrice(d.base_price)}</div>
                          )}
                          {displayPrice && (
                            <div className="font-display font-bold text-xl text-lr-navy">a partir de {formatPrice(displayPrice)}</div>
                          )}
                        </div>
                        <div className="w-9 h-9 rounded-full bg-lr-sun flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#003A5D" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── COMO FUNCIONA ────────────────────────────────────── */}
      <section id="sobre" className="section" style={{ background: '#002438' }}>
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <div className="text-lr-ocean font-bold text-sm uppercase tracking-widest mb-3">Simples assim</div>
            <h2 className="section-title text-white mb-4">Como funciona</h2>
            <p className="section-subtitle text-white/60 mx-auto mb-16">
              Da primeira mensagem até a volta pra casa, a Linha Reta cuida de cada detalhe da sua viagem.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Fale com a gente', desc: 'Mande uma mensagem no WhatsApp e nos conte seu destino dos sonhos, datas e orçamento.', icon: '💬' },
              { n: '02', title: 'Receba seu roteiro', desc: 'Montamos um pacote personalizado com hospedagem, passeios e tudo incluído.', icon: '✈️' },
              { n: '03', title: 'Embarque tranquilo', desc: 'Cuide só de aproveitar. Nós garantimos que tudo esteja perfeito do início ao fim.', icon: '🌊' },
            ].map((step) => (
              <StaggerItem key={step.n}>
                <div className="text-left p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="font-display font-extrabold text-6xl mb-3" style={{ color: 'rgba(255,194,71,0.2)', lineHeight: 1 }}>{step.n}</div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">{step.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal delay={0.2}>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-primary mt-12 inline-flex">
              Começar agora →
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── DEPOIMENTOS ──────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="section bg-white">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-12">
              <div className="text-lr-ocean font-bold text-sm uppercase tracking-widest mb-2">Quem já viajou</div>
              <h2 className="section-title">O que nossos viajantes dizem</h2>
            </Reveal>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <StaggerItem key={t.id}>
                  <div className="p-7 rounded-2xl border border-lr-ink/8 bg-lr-sand h-full">
                    <div className="flex mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC247"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      ))}
                    </div>
                    <p className="text-lr-ink text-sm leading-relaxed mb-4 font-serif italic">&ldquo;{t.content}&rdquo;</p>
                    <div>
                      <div className="font-bold text-sm text-lr-navy">{t.client_name}</div>
                      {t.destination_visited && <div className="text-xs text-lr-ink-soft mt-0.5">{t.destination_visited}</div>}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section id="contato" className="section" style={{ background: '#F1EADA' }}>
        <Reveal className="max-w-2xl mx-auto text-center">
          <div className="text-lr-ocean font-bold text-sm uppercase tracking-widest mb-3">Pronto para partir?</div>
          <h2 className="section-title mb-4">Vamos planejar sua próxima aventura</h2>
          <p className="text-lr-ink-soft text-lg mb-10">
            Entre em contato pelo WhatsApp e receba um orçamento personalizado em até 48 horas.
          </p>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-8 py-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.472A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.003-1.37l-.358-.214-3.713.955.972-3.606-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            Falar agora no WhatsApp
          </a>
        </Reveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-lr-navy-deep text-white/70 py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
          <div>
            <div className="font-display font-extrabold text-2xl text-white tracking-tight mb-1">LINHA RETA</div>
            <div className="text-lr-ocean text-xs font-semibold tracking-[0.3em] mb-4">TURISMO</div>
            <p className="text-sm leading-relaxed max-w-xs">Do sonho ao destino, sem desvio. Especialistas em viagens pelo Brasil.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <div className="font-bold text-white mb-3 font-display tracking-wide text-xs uppercase">Destinos</div>
              <div className="space-y-2">
                {['nordeste', 'nacional', 'internacional'].map((c) => (
                  <Link key={c} href={`/destinos?categoria=${c}`} className="block capitalize hover:text-white transition-colors">
                    {CATEGORY_LABELS[c]}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="font-bold text-white mb-3 font-display tracking-wide text-xs uppercase">Links</div>
              <div className="space-y-2">
                <Link href="/blog" className="block hover:text-white transition-colors">Blog</Link>
                <Link href="/captura" className="block hover:text-white transition-colors">Ofertas exclusivas</Link>
                <Link href="/privacidade" className="block hover:text-white transition-colors">Política de privacidade</Link>
              </div>
            </div>
          </div>
          <div className="text-sm">
            <div className="font-bold text-white mb-3 font-display tracking-wide text-xs uppercase">Contato</div>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.472A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.003-1.37l-.358-.214-3.713.955.972-3.606-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
              +55 81 9121-8178
            </a>
            <div className="text-xs text-white/40 mt-6">© {new Date().getFullYear()} Linha Reta Turismo.<br />Todos os direitos reservados.</div>
          </div>
        </div>
      </footer>
    </>
  )
}
