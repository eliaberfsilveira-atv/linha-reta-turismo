'use client'

import { motion } from 'framer-motion'

type Props = {
  size?: number
  variant?: 'light' | 'dark'
  className?: string
  animate?: boolean
}

export default function Logo({ size = 40, variant = 'light', className = '', animate = true }: Props) {
  const navy  = variant === 'light' ? 'rgba(255,255,255,0.55)' : '#003A5D'
  const ocean = '#00A7D8'
  const sun   = '#FFC247'
  const green = '#2E8B57'
  const plane = variant === 'light' ? '#FFFFFF' : '#003A5D'

  const ease = [0.2, 0.7, 0.3, 1]

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Linha Reta Turismo"
      whileHover="hover"
      initial={animate ? "hidden" : "visible"}
      animate="visible"
    >
      {/* ── Círculo — desenha-se ── */}
      <motion.circle
        cx="50" cy="50" r="47"
        stroke={navy}
        strokeWidth="3.5"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: 'easeInOut', delay: 0 } },
        }}
        style={{ pathLength: 1 }}
      />

      {/* ── Onda — desliza da esquerda ── */}
      <motion.path
        d="M6 64 Q20 54 35 62 Q50 70 65 60 Q78 52 94 58 L94 80 Q78 74 65 82 Q50 90 35 82 Q20 74 6 80 Z"
        fill={ocean}
        variants={{
          hidden: { x: -30, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease, delay: 0.5 } },
        }}
      />

      {/* Onda clara */}
      <motion.path
        d="M6 72 Q20 64 35 70 Q50 76 65 68 Q78 60 94 66 L94 84 Q78 78 65 86 Q50 94 35 86 Q20 78 6 84 Z"
        fill={ocean}
        opacity="0.35"
        variants={{
          hidden: { x: -20, opacity: 0 },
          visible: { x: 0, opacity: 0.35, transition: { duration: 0.6, ease, delay: 0.6 } },
        }}
      />

      {/* ── Sol — sobe de baixo ── */}
      <motion.circle
        cx="50" cy="66" r="11"
        fill={sun}
        variants={{
          hidden: { y: 12, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease, delay: 0.75 } },
        }}
      />
      {/* Máscara sol — parte inferior coberta pela onda */}
      <motion.path
        d="M38 66 Q50 54 62 66 L62 82 Q50 82 38 82 Z"
        fill={ocean}
        variants={{
          hidden: { y: 12, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease, delay: 0.75 } },
        }}
      />

      {/* ── Palmeira — cresce ── */}
      <motion.g
        variants={{
          hidden: { scaleY: 0, originY: '100%', opacity: 0 },
          visible: { scaleY: 1, opacity: 1, transition: { duration: 0.5, ease, delay: 0.9 } },
        }}
        style={{ transformOrigin: '30px 70px' }}
      >
        <line x1="30" y1="70" x2="27" y2="44" stroke={green} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M27 44 Q20 36 14 38 Q20 42 24 47" fill={green} />
        <path d="M27 44 Q22 33 26 27 Q28 35 30 40" fill={green} />
        <path d="M27 44 Q34 36 38 38 Q32 42 28 47" fill={green} />
      </motion.g>

      {/* ── Avião — entra voando ── */}
      <motion.g
        variants={{
          hidden: { x: 20, y: -20, opacity: 0 },
          visible: { x: 0, y: 0, opacity: 1, transition: { duration: 0.55, ease, delay: 1.05 } },
          hover: {
            x: [0, 4, 0],
            y: [0, -4, 0],
            transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
          },
        }}
      >
        <g transform="translate(55, 28) rotate(-28)">
          <ellipse cx="0" cy="0" rx="13" ry="4" fill={plane} />
          <path d="M-2 1 L-9 10 L7 6 Z" fill={plane} opacity="0.85" />
          <path d="M-9 0 L-14 5 L-5 3 Z" fill={plane} opacity="0.85" />
          <circle cx="2" cy="-1" r="1.3" fill={ocean} />
          <circle cx="5.5" cy="-1" r="1.3" fill={ocean} />
          <circle cx="-1.5" cy="-1" r="1.3" fill={ocean} />
        </g>
      </motion.g>

      {/* ── Esteira — aparece por último ── */}
      <motion.path
        d="M74 20 Q62 36 50 50"
        stroke={ocean}
        strokeWidth="1.8"
        fill="none"
        strokeDasharray="3 3"
        strokeLinecap="round"
        opacity="0.6"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 0.6, transition: { duration: 0.5, ease: 'easeInOut', delay: 1.15 } },
        }}
      />
    </motion.svg>
  )
}
