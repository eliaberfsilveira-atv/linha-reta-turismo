'use client'

import { useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

type Props = {
  children:    React.ReactNode
  className?:  string
  intensity?:  number  // graus de rotação (default 8)
  scale?:      number  // scale no hover (default 1.03)
}

export default function Tilt3D({
  children,
  className  = '',
  intensity  = 8,
  scale      = 1.03,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setHovered] = useState(false)

  const rotateX = useSpring(0, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 })
  const glowX   = useSpring(50, { stiffness: 150, damping: 20 })
  const glowY   = useSpring(50, { stiffness: 150, damping: 20 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect   = ref.current.getBoundingClientRect()
    const cx     = (e.clientX - rect.left) / rect.width   // 0-1
    const cy     = (e.clientY - rect.top)  / rect.height  // 0-1
    rotateY.set((cx - 0.5) *  intensity * 2)
    rotateX.set((cy - 0.5) * -intensity * 2)
    glowX.set(cx * 100)
    glowY.set(cy * 100)
  }

  function onMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
    glowX.set(50)
    glowY.set(50)
    setHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      animate={{ scale: isHovered ? scale : 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
    >
      {children}

      {/* Brilho que segue o cursor */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  )
}
