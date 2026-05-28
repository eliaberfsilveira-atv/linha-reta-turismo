'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  text:       string
  className?: string
  delay?:     number
  by?:        'word' | 'char'
  once?:      boolean
}

export default function SplitText({
  text,
  className = '',
  delay     = 0,
  by        = 'word',
  once      = true,
}: Props) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once, margin: '-80px' })

  const tokens = by === 'char'
    ? text.split('')
    : text.split(' ')

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${by === 'word' ? 'gap-x-[0.25em]' : ''} overflow-hidden`} aria-label={text}>
      {tokens.map((token, i) => (
        <span key={i} className="overflow-hidden inline-block" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.65,
              delay:    delay + i * (by === 'char' ? 0.03 : 0.07),
              ease:     [0.2, 0.7, 0.3, 1],
            }}
          >
            {token}{by === 'word' ? '' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
