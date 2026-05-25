'use client'

import { motion } from 'framer-motion'
import Counter from './Counter'

const ease = [0.2, 0.7, 0.3, 1]

const STATS = [
  { target: 500, prefix: '+', suffix: '', label: 'Viajantes atendidos' },
  { target: 5,   prefix: '',  suffix: '★', label: 'Avaliação média' },
  { target: 48,  prefix: '',  suffix: 'h', label: 'Resposta garantida' },
]

export default function HeroContent() {
  return (
    <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 pb-20 pt-8">
      <div className="max-w-3xl">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{ background: 'rgba(255,194,71,0.15)', color: '#FFC247', border: '1px solid rgba(255,194,71,0.3)' }}
        >
          ✦ Especialistas em destinos brasileiros
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="font-display font-extrabold text-5xl md:text-7xl text-white leading-[0.95] tracking-tight mb-6"
        >
          Do sonho<br />
          <span style={{ color: '#FFC247' }}>ao destino,</span><br />
          sem desvio.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease }}
          className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
        >
          Pacotes completos para os destinos mais bonitos do Brasil.
          Nós cuidamos de tudo para você viver a viagem dos seus sonhos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          className="flex flex-wrap gap-4"
        >
          <a href="#destinos" className="btn-primary">
            Ver destinos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5581912181781'}?text=${encodeURIComponent('Olá! Vim pelo site e quero montar um roteiro personalizado.')}`}
            target="_blank" rel="noopener noreferrer"
            className="btn-outline"
          >
            Montar roteiro personalizado
          </a>
        </motion.div>

        {/* Stats com counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/10"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.65 + i * 0.1, ease }}
            >
              <div className="font-display font-extrabold text-3xl" style={{ color: '#FFC247' }}>
                <Counter
                  target={stat.target}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={1600}
                />
              </div>
              <div className="text-white/50 text-sm mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-white/40 text-xs font-medium tracking-widest uppercase">Explorar</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}
