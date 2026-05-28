'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
  const [visible, setVisible]   = useState(false)
  const [hovered, setHovered]   = useState(false)
  const [clicked, setClicked]   = useState(false)
  const [isMobile, setMobile]   = useState(true)

  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)

  // Ring segue com delay (spring)
  const rx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.5 })
  const ry = useSpring(my, { stiffness: 120, damping: 20, mass: 0.5 })

  useEffect(() => {
    // Só ativa em desktop
    if (window.matchMedia('(pointer: coarse)').matches) return
    setMobile(false)

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onDown  = () => setClicked(true)
    const onUp    = () => setClicked(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    // Detecta hover em elementos interativos
    const addHover = () => {
      document.querySelectorAll('a, button, [data-cursor="pointer"]').forEach(el => {
        el.addEventListener('mouseenter', () => setHovered(true))
        el.addEventListener('mouseleave', () => setHovered(false))
      })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    addHover()
    const observer = new MutationObserver(addHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      observer.disconnect()
    }
  }, [])

  if (isMobile) return null

  return (
    <>
      {/* Dot — segue exatamente */}
      <motion.div
        className="fixed z-[9999] pointer-events-none rounded-full mix-blend-difference"
        style={{
          x: mx, y: my,
          translateX: '-50%', translateY: '-50%',
          width:  clicked ? 6 : 8,
          height: clicked ? 6 : 8,
          background: 'white',
          opacity: visible ? 1 : 0,
          transition: 'width 0.15s, height 0.15s, opacity 0.2s',
        }}
      />

      {/* Ring — segue com delay */}
      <motion.div
        className="fixed z-[9998] pointer-events-none rounded-full mix-blend-difference"
        style={{
          x: rx, y: ry,
          translateX: '-50%', translateY: '-50%',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
        animate={{
          width:  hovered ? 48 : clicked ? 28 : 36,
          height: hovered ? 48 : clicked ? 28 : 36,
          border: `1.5px solid rgba(255,255,255,${hovered ? 0.9 : 0.6})`,
          scale:  hovered ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      />
    </>
  )
}
