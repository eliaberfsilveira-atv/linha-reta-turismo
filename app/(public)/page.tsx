import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { whatsappUrl, formatPrice, discountPercent, isPromotionActive } from '@/lib/utils'
import type { Destination, Testimonial, Promotion } from '@/types/database'

export const metadata: Metadata = {
  title: 'Linha Reta Turismo — Do sonho ao destino, sem desvio.',
  description: 'Pacotes de viagem para os destinos mais bonitos do Brasil. Porto de Galinhas, Fernando de Noronha, Maceió, Natal e muito mais.',
}

export const revalidate = 60 // ISR: revalida a cada 60 segundos

async function getData() {
  const supabase = await createClient()

  const [destinationsRes, testimonialsRes, promotionsRes] = await Promise.all([
    supabase.from('destinations').select('*').eq('status', 'active').order('sort_order').limit(6),
    supabase.from('testimonials').select('*').eq('is_published', true).limit(3),
    supabase.from('promotions').select('*, destinations(name, slug, cover_image_url)')
      .eq('is_active', true).gt('end_date', new Date().toISOString()).limit(3),
  ])

  return {
    destinations: (destinationsRes.data || []) as Destination[],
    testimonials: (testimonialsRes.data || []) as Testimonial[],
    promotions: promotionsRes.data || [],
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  nordeste:       'Nordeste',
  nacional:       'Brasil',
  internacional:  'Internacional',
  cruzeiro:       'Cruzeiro',
}

const WHATSAPP_DEFAULT = whatsappUrl()

export default async function HomePage() {
  const { destinations, testimonials, promotions } = await getData()

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #003A5D 0%, #002438 60%, #001829 100%)' }}
      >
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        {/* Sun glow */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,194,71,0.18) 0%, transparent 70%)' }} />

        {/* ── NAV ── */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-7">
          {/* Logo SVG */}
          <div className="flex items-center gap-3">
            <svg width="42" height="42" viewBox="0 0 64 64" fill="none" aria-label="Linha Reta Turismo">
              <circle cx="32" cy="32" r="30" stroke="white" strokeWidth="1.5" opacity="0.5" />
              <circle cx="32" cy="38" r="7" fill="#FFC247" />
              <path d="M6 40 Q32 36 58 40" stroke="white" strokeWidth="1" opacity="0.3" />
              <path d="M8 44 Q16 41 24 44 T40 44 T56 44" stroke="#00A7D8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M10 22 Q32 8 54 24" stroke="#00A7D8" strokeWidth="1.2" fill="none" strokeDasharray="2 3" />
              <g transform="translate(48 18) rotate(35)">
                <path d="M0 0 L10 -1.5 L13 0 L10 1.5 Z M5 -0.5 L5 -4 M5 0.5 L5 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="white" />
              </g>
            </svg>
            <div className="leading-none font-display">
              <div className="text-white font-extrabold text-xl tracking-tight">LINHA RETA</div>
              <div className="text-lr-ocean text-[10px] font-semibold tracking-[0.3em] flex items-center gap-1.5 mt-0.5">
                <span className="w-3 h-px bg-lr-ocean/60" />TURISMO<span className="w-3 h-px bg-lr-ocean/60" />
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/75">
            {[['Destinos', '#destinos'], ['Blog', '/blog'], ['Sobre', '#sobre'], ['Contato', '#contato']].map(([l, h]) => (
              <a key={l} href={h} className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>

          <a href={WHATSAPP_DEFAULT} target="_blank" rel="noopener noreferrer"
            className="btn-primary text-xs">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.472A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.003-1.37l-.358-.214-3.713.955.972-3.606-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            Falar no WhatsApp
          </a>
        </nav>

        {/* ── HERO CONTENT ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 pb-20 pt-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: 'rgba(255,194,71,0.15)', color: '#FFC247', border: '1px solid rgba(255,194,71,0.3)' }}>
              ✦ Especialistas em destinos brasileiros
            </div>

            <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white leading-[0.95] tracking-tight mb-6">
              Do sonho<br />
              <span style={{ color: '#FFC247' }}>ao destino,</span><br />
              sem desvio.
            </h1>

            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Pacotes completos para os destinos mais bonitos do Brasil. Nós cuidamos de tudo para você viver a viagem dos seus sonhos.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#destinos" className="btn-primary">
                Ver destinos
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href={WHATSAPP_DEFAULT} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Montar roteiro personalizado
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/10">
              {[['+500', 'Viajantes atendidos'], ['5★', 'Avaliação média'], ['48h', 'Resposta garantida']].map(([n, l]) => (
                <div key={n}>
                  <div className="font-display font-extrabold text-3xl" style={{ color: '#FFC247' }}>{n}</div>
                  <div className="text-white/50 text-sm mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path d="M0 80 Q360 20 720 50 T1440 30 L1440 80 Z" fill="#F8F4EA" />
        </svg>
      </section>

      {/* ── DESTINOS ─────────────────────────────────────────── */}
      <section id="destinos" className="section">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-lr-ocean font-bold text-sm uppercase tracking-widest mb-2">Onde você quer ir?</div>
              <h2 className="section-title">Destinos em destaque</h2>
            </div>
            <Link href="/destinos" className="text-lr-ocean font-semibold text-sm hover:underline flex items-center gap-1">
              Ver todos os destinos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => {
              const hasPromo = d.status === 'promotion' && d.promotion_price && isPromotionActive(d.promotion_end_date)
              const displayPrice = hasPromo ? d.promotion_price! : d.base_price

              return (
                <Link key={d.id} href={`/destinos/${d.slug}`} className="destination-card group">
                  <div className="relative h-52 overflow-hidden">
                    {d.cover_image_url ? (
                      <Image src={d.cover_image_url} alt={d.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-lr-sky/30 flex items-center justify-center text-lr-ocean/40 text-sm">Sem imagem</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badge categoria */}
                    <div className="absolute top-3 left-3">
                      <span className="badge bg-lr-navy/90 text-white text-[10px]">
                        {CATEGORY_LABELS[d.category] || d.category}
                      </span>
                    </div>

                    {/* Badge promoção */}
                    {hasPromo && (
                      <div className="absolute top-3 right-3">
                        <span className="badge bg-lr-coral text-white text-[10px]">
                          -{discountPercent(d.base_price!, d.promotion_price!)}% OFF
                        </span>
                      </div>
                    )}

                    {/* Duração */}
                    {d.duration_days && (
                      <div className="absolute bottom-3 right-3 text-white/90 text-xs font-medium">
                        {d.duration_days} dias
                      </div>
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
        </div>
      </section>

      {/* ── COMO FUNCIONA ────────────────────────────────────── */}
      <section id="sobre" className="section" style={{ background: '#002438' }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-lr-ocean font-bold text-sm uppercase tracking-widest mb-3">Simples assim</div>
          <h2 className="section-title text-white mb-4">Como funciona</h2>
          <p className="section-subtitle text-white/60 mx-auto mb-16">
            Da primeira mensagem até a volta pra casa, a Linha Reta cuida de cada detalhe da sua viagem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Fale com a gente', desc: 'Mande uma mensagem no WhatsApp e nos conte seu destino dos sonhos, datas e orçamento.', icon: '💬' },
              { n: '02', title: 'Receba seu roteiro', desc: 'Montamos um pacote personalizado com hospedagem, passeios e tudo incluído.', icon: '✈️' },
              { n: '03', title: 'Embarque tranquilo', desc: 'Cuide só de aprovechar. Nós garantimos que tudo esteja perfeito do início ao fim.', icon: '🌊' },
            ].map((step) => (
              <div key={step.n} className="text-left p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="font-display font-extrabold text-6xl mb-3" style={{ color: 'rgba(255,194,71,0.2)', lineHeight: 1 }}>{step.n}</div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{step.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <a href={WHATSAPP_DEFAULT} target="_blank" rel="noopener noreferrer" className="btn-primary mt-12 inline-flex">
            Começar agora →
          </a>
        </div>
      </section>

      {/* ── DEPOIMENTOS ──────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="section bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-lr-ocean font-bold text-sm uppercase tracking-widest mb-2">Quem já viajou</div>
              <h2 className="section-title">O que nossos viajantes dizem</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="p-7 rounded-2xl border border-lr-ink/8 bg-lr-sand">
                  <div className="flex mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC247"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                  <p className="text-lr-ink text-sm leading-relaxed mb-4 font-serif italic">&ldquo;{t.content}&rdquo;</p>
                  <div>
                    <div className="font-bold text-sm text-lr-navy">{t.client_name}</div>
                    {t.destination_visited && (
                      <div className="text-xs text-lr-ink-soft mt-0.5">{t.destination_visited}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTATO / CTA ────────────────────────────────────── */}
      <section id="contato" className="section" style={{ background: '#F1EADA' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-lr-ocean font-bold text-sm uppercase tracking-widest mb-3">Pronto para partir?</div>
          <h2 className="section-title mb-4">Vamos planejar sua próxima aventura</h2>
          <p className="text-lr-ink-soft text-lg mb-10">
            Entre em contato pelo WhatsApp e receba um orçamento personalizado em até 48 horas.
          </p>
          <a href={WHATSAPP_DEFAULT} target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-8 py-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.472A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.003-1.37l-.358-.214-3.713.955.972-3.606-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            Falar agora no WhatsApp
          </a>
        </div>
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
            <a href={WHATSAPP_DEFAULT} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors mb-2">
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
