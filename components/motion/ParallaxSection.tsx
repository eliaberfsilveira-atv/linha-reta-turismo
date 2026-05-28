'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type Props = {
  children:   React.ReactNode
  className?: string
  offset?:    number
  direction?: 'up' | 'down'
}

export default function ParallaxSection({
  children,
  className = '',
  offset    = 80,
  direction = 'up',
}: Props) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target:  ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? [offset, -offset] : [-offset, offset]
  )

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
