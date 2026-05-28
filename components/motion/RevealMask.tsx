'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  children:    React.ReactNode
  className?:  string
  delay?:      number
  direction?:  'up' | 'left' | 'right'
  color?:      string
  once?:       boolean
}

export default function RevealMask({
  children,
  className  = '',
  delay      = 0,
  direction  = 'up',
  color      = '#FFC247',
  once       = true,
}: Props) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })

  const maskVariants = {
    up: {
      initial: { scaleY: 1, originY: 0 },
      animate: { scaleY: 0, originY: 0 },
    },
    left: {
      initial: { scaleX: 1, originX: 0 },
      animate: { scaleX: 0, originX: 0 },
    },
    right: {
      initial: { scaleX: 1, originX: 1 },
      animate: { scaleX: 0, originX: 1 },
    },
  }

  const mv = maskVariants[direction]

  return (
    <div ref={ref} className={`relative overflow-hidden inline-block ${className}`}>
      {/* Conteúdo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.01, delay: delay + 0.3 }}
      >
        {children}
      </motion.div>

      {/* Máscara que desliza para revelar */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ background: color, transformOrigin: direction === 'up' ? 'bottom' : direction === 'left' ? 'left' : 'right' }}
        initial={mv.initial}
        animate={inView ? mv.animate : mv.initial}
        transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  )
}
