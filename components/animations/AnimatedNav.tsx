'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5581912181781'
const WA_MSG    = encodeURIComponent('Olá! Vim pelo site e tenho interesse nos pacotes.')
const WA_URL    = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`

export default function AnimatedNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-5 transition-all duration-300"
      style={{
        background:   scrolled ? 'rgba(0,26,41,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom:   scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <svg width="36" height="36" viewBox="0 0 64 64" fill="none" aria-label="Linha Reta Turismo">
          <circle cx="32" cy="32" r="30" stroke="white" strokeWidth="1.5" opacity="0.5" />
          <circle cx="32" cy="38" r="7" fill="#FFC247" />
          <path d="M8 44 Q16 41 24 44 T40 44 T56 44" stroke="#00A7D8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M10 22 Q32 8 54 24" stroke="#00A7D8" strokeWidth="1.2" fill="none" strokeDasharray="2 3" />
          <g transform="translate(48 18) rotate(35)">
            <path d="M0 0 L10 -1.5 L13 0 L10 1.5 Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="white" />
          </g>
        </svg>
        <div className="leading-none font-display">
          <div className="text-white font-extrabold text-xl tracking-tight">LINHA RETA</div>
          <div className="text-lr-ocean text-[10px] font-semibold tracking-[0.3em] flex items-center gap-1.5 mt-0.5">
            <span className="w-3 h-px bg-lr-ocean/60" />TURISMO<span className="w-3 h-px bg-lr-ocean/60" />
          </div>
        </div>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/75">
        {[['Destinos', '/destinos'], ['Blog', '/blog'], ['Ofertas', '/captura'], ['Contato', '#contato']].map(([l, h]) => (
          <Link key={l} href={h} className="hover:text-white transition-colors relative group">
            {l}
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-lr-sun transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      <a href={WA_URL} target="_blank" rel="noopener noreferrer"
        className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-bold text-xs uppercase tracking-widest transition-all hover:brightness-105 hover:shadow-lg hover:-translate-y-0.5"
        style={{ background: '#FFC247', color: '#003A5D' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.472A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.003-1.37l-.358-.214-3.713.955.972-3.606-.233-.371A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
        WhatsApp
      </a>

      {/* Mobile menu button */}
      <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open
            ? <path d="M18 6L6 18M6 6l12 12"/>
            : <path d="M3 12h18M3 6h18M3 18h18"/>
          }
        </svg>
      </button>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 md:hidden"
          style={{ background: 'rgba(0,26,41,0.97)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex flex-col px-6 py-4 gap-4">
            {[['Destinos', '/destinos'], ['Blog', '/blog'], ['Ofertas exclusivas', '/captura'], ['Contato', '#contato']].map(([l, h]) => (
              <Link key={l} href={h} onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white text-sm font-medium py-1">
                {l}
              </Link>
            ))}
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="btn-primary justify-center mt-2">
              Falar no WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
