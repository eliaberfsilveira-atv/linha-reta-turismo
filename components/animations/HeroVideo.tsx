'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const HERO_VIDEOS = [
  process.env.NEXT_PUBLIC_HERO_VIDEO_1,
  process.env.NEXT_PUBLIC_HERO_VIDEO_2,
  process.env.NEXT_PUBLIC_HERO_VIDEO_3,
].filter(Boolean) as string[]

function GradientFallback() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #003A5D 0%, #002438 60%, #001829 100%)'
      }} />
      {[...Array(4)].map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: `${160 + i * 60}px`, height: `${160 + i * 60}px`,
            left: `${8 + i * 20}%`, top: `${15 + (i % 3) * 22}%`,
            background: i % 2 === 0 ? 'rgba(0,167,216,0.09)' : 'rgba(255,194,71,0.07)',
          }}
          animate={{ x: [0, 20, -12, 0], y: [0, -16, 10, 0], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
        />
      ))}
    </div>
  )
}

function getNextVideoIndex(): number {
  if (typeof window === 'undefined' || HERO_VIDEOS.length === 0) return 0
  try {
    const last = parseInt(localStorage.getItem('lr_hero_idx') || '-1', 10)
    // Round-robin: avança para o próximo, nunca repete o anterior
    const next = (last + 1) % HERO_VIDEOS.length
    localStorage.setItem('lr_hero_idx', String(next))
    return next
  } catch {
    return 0
  }
}

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoUrl, setVideoUrl]   = useState('')
  const [loaded,   setLoaded]     = useState(false)
  const [error,    setError]      = useState(false)
  const [isMobile, setIsMobile]   = useState(false)

  useEffect(() => {
    if (HERO_VIDEOS.length === 0) return

    // Detecta mobile
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setIsMobile(mobile)

    // Round-robin entre os vídeos
    const idx = getNextVideoIndex()
    setVideoUrl(HERO_VIDEOS[idx])
  }, [])

  // Tenta forçar play no mobile (iOS Safari precisa disso)
  useEffect(() => {
    if (!videoRef.current || !videoUrl) return
    const vid = videoRef.current

    const tryPlay = () => {
      vid.play().catch(() => {
        // iOS pode bloquear — aguarda interação do usuário
        const unlock = () => { vid.play().catch(() => {}); document.removeEventListener('touchstart', unlock) }
        document.addEventListener('touchstart', unlock, { once: true })
      })
    }

    if (vid.readyState >= 3) {
      tryPlay()
    } else {
      vid.addEventListener('canplay', tryPlay, { once: true })
    }

    return () => vid.removeEventListener('canplay', tryPlay)
  }, [videoUrl])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <GradientFallback />

      {videoUrl && !error && (
        <motion.video
          ref={videoRef}
          key={videoUrl}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          // atributos webkit para iOS Safari
          {...{ 'webkit-playsinline': 'true', 'x-webkit-airplay': 'allow' }}
          onCanPlay={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(false) }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={loaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
          transition={{ duration: 2, ease: [0.2, 0.7, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.4) saturate(1.15) contrast(1.05)' }}
        />
      )}

      {/* Overlay cinematográfico */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(0,18,30,0.2) 0%, rgba(0,18,30,0.05) 30%, rgba(0,18,30,0.4) 70%, rgba(0,18,30,0.92) 100%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to right, rgba(0,18,30,0.55) 0%, rgba(0,18,30,0.12) 55%, transparent 100%)',
      }} />

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none" style={{
        opacity: 0.15,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
      }} />
    </div>
  )
}
