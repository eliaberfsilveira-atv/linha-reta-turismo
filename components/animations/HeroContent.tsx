'use client'

import { motion } from 'framer-motion'

const ease = [0.2, 0.7, 0.3, 1]

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
          Pacotes completos para os destinos mais bonitos do Brasil. Nós cuidamos de tudo para você viver a viagem dos seus sonhos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          className="flex flex-wrap gap-4"
        >
          <a href="#destinos" className="btn-primary">
            Ver destinos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5581912181781'}?text=${encodeURIComponent('Olá! Vim pelo site e tenho interesse nos pacotes.')}`}
            target="_blank" rel="noopener noreferrer"
            className="btn-outline"
          >
            Montar roteiro personalizado
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/10"
        >
          {[['+500', 'Viajantes atendidos'], ['5★', 'Avaliação média'], ['48h', 'Resposta garantida']].map(([n, l], i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.65 + i * 0.1, ease }}
            >
              <div className="font-display font-extrabold text-3xl" style={{ color: '#FFC247' }}>{n}</div>
              <div className="text-white/50 text-sm mt-0.5">{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
