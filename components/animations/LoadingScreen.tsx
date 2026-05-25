'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Só mostra na primeira visita da sessão
    const seen = sessionStorage.getItem('lr_loaded')
    if (seen) { setVisible(false); return }

    const start = Date.now()
    const duration = 1800

    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(elapsed / duration, 1)
      // Easing exponencial — avança rápido no início, desacelera no final
      setProgress(1 - Math.pow(1 - p, 3))
      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setVisible(false)
          sessionStorage.setItem('lr_loaded', '1')
        }, 200)
      }
    }

    requestAnimationFrame(tick)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#001829' }}
        >
          {/* Glow sutil */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,167,216,0.08) 0%, transparent 70%)' }} />

          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.3, 1] }}
            className="mb-10"
          >
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <motion.circle
                cx="32" cy="32" r="30"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="32" cy="38" r="7"
                fill="#FFC247"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
              />
              <motion.path
                d="M8 44 Q16 41 24 44 T40 44 T56 44"
                stroke="#00A7D8"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
              />
              <motion.path
                d="M10 22 Q32 8 54 24"
                stroke="#00A7D8"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="2 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.g
                transform="translate(48 18) rotate(35)"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <path d="M0 0 L10 -1.5 L13 0 L10 1.5 Z" fill="white" />
              </motion.g>
            </svg>
          </motion.div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mb-12"
          >
            <div className="font-display font-extrabold text-2xl text-white tracking-tight">LINHA RETA</div>
            <div className="text-lr-ocean text-[10px] font-semibold tracking-[0.4em] mt-1 flex items-center justify-center gap-2">
              <span className="w-4 h-px bg-lr-ocean/50" />
              TURISMO
              <span className="w-4 h-px bg-lr-ocean/50" />
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-px bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00A7D8, #FFC247)',
                width: `${progress * 100}%`,
              }}
            />
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-5 text-white text-xs tracking-widest uppercase"
          >
            Do sonho ao destino
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
