'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, discountPercent, isPromotionActive, whatsappUrl } from '@/lib/utils'
import PromoCountdown from '@/components/animations/PromoCountdown'
import type { Destination } from '@/types/database'

const BLUR_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAADNJREFUGFdjYGBg+M+ABzAyMjIwMDAQpQEAAAD//yMCAQAA//8jAgEAAAAA//8jAgEAAAAA'

const CATEGORY_LABELS: Record<string, string> = {
  nordeste: 'Nordeste', nacional: 'Brasil', internacional: 'Internacional', cruzeiro: 'Cruzeiro',
}

export default function DestinationCard({ d }: { d: Destination }) {
  const [hovered, setHovered] = useState(false)

  const hasPromo     = d.status === 'promotion' && d.promotion_price && isPromotionActive(d.promotion_end_date)
  const displayPrice = hasPromo ? d.promotion_price! : d.base_price
  const discount     = hasPromo ? discountPercent(d.base_price!, d.promotion_price!) : 0
  const waUrl        = whatsappUrl(`Olá! Tenho interesse no pacote para ${d.name}. Pode me passar mais informações?`)

  return (
    <Link href={`/destinos/${d.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagem */}
      <div className="relative h-56 overflow-hidden">
        {d.cover_image_url ? (
          <Image src={d.cover_image_url} alt={d.name} fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            placeholder="blur" blurDataURL={BLUR_URL} />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #003A5D, #00A7D8)' }} />
        )}

        {/* Overlay hover — slide up */}
        <div className="absolute inset-0 transition-all duration-400"
          style={{
            background: hovered
              ? 'linear-gradient(to top, rgba(0,18,30,0.85) 0%, rgba(0,18,30,0.3) 60%, transparent 100%)'
              : 'linear-gradient(to top, rgba(0,18,30,0.5) 0%, transparent 60%)',
          }} />

        {/* Badges topo */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ background: 'rgba(0,58,93,0.85)' }}>
            {CATEGORY_LABELS[d.category] || d.category}
          </span>
        </div>

        {/* Badge promoção */}
        {hasPromo && (
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
              style={{ background: '#FF7A59' }}>
              -{discount}% OFF
            </span>
            {d.promotion_end_date && (
              <PromoCountdown endDate={d.promotion_end_date} />
            )}
          </div>
        )}

        {/* Info reveal no hover */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 transition-all duration-300"
          style={{ transform: hovered ? 'translateY(0)' : 'translateY(8px)', opacity: hovered ? 1 : 0 }}>
          <div className="flex items-center gap-2">
            {d.duration_days && (
              <span className="text-white/80 text-xs">📅 {d.duration_days} dias</span>
            )}
            {d.highlights?.[0] && (
              <span className="text-white/80 text-xs">· ✓ {d.highlights[0]}</span>
            )}
          </div>
          <button
            onClick={e => { e.preventDefault(); window.open(waUrl, '_blank') }}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110"
            style={{ background: '#25D366', color: 'white' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.472A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.003-1.37l-.358-.214-3.713.955.972-3.606-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            Consultar no WhatsApp
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display font-bold text-xl text-lr-navy mb-1">{d.name}</h3>
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
          <div className="w-9 h-9 rounded-full bg-lr-sun flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#003A5D" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
