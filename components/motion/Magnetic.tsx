'use client'

import { useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

type Props = {
  children:   React.ReactNode
  className?: string
  strength?:  number  // intensidade do efeito (default 0.35)
}

export default function Magnetic({ children, className = '', strength = 0.35 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const x   = useSpring(0, { stiffness: 200, damping: 15 })
  const y   = useSpring(0, { stiffness: 200, damping: 15 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx   = e.clientX - (rect.left + rect.width  / 2)
    const cy   = e.clientY - (rect.top  + rect.height / 2)
    x.set(cx * strength)
    y.set(cy * strength)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: 'inline-flex' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  )
}
