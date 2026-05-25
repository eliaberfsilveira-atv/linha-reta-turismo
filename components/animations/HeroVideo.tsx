'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Vídeos gratuitos do Pexels — licença livre para uso comercial
// 1. Drone sobre litoral do Brasil — Costa Brasileira (Produtora Midtrack)
// 2. Câmera lenta, ondas tropicais vistas do alto (Engin Akyurt)
// 3. Drone sobre praia com coqueiros e água turquesa (Drone footage)
const HERO_VIDEOS = [
  'https://videos.pexels.com/video-files/2772930/2772930-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/2181401/2181401-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/6624635/6624635-hd_1920_1080_25fps.mp4',
]

function GradientFallback() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #003A5D 0%, #002438 60%, #001829 100%)'
      }} />
      {[...Array(5)].map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: `${140 + i * 50}px`, height: `${140 + i * 50}px`,
            left: `${8 + i * 18}%`, top: `${15 + (i % 3) * 22}%`,
            background: i % 2 === 0 ? 'rgba(0,167,216,0.08)' : 'rgba(255,194,71,0.06)',
          }}
          animate={{ x: [0, 18, -10, 0], y: [0, -14, 9, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 9 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.3 }}
        />
      ))}
    </div>
  )
}

export default function HeroVideo() {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const [videoUrl, setVideoUrl]     = useState('')
  const [videoLoaded, setLoaded]    = useState(false)
  const [videoError, setError]      = useState(false)

  useEffect(() => {
    const idx = Math.floor(Math.random() * HERO_VIDEOS.length)
    setVideoUrl(HERO_VIDEOS[idx])
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <GradientFallback />

      {videoUrl && !videoError && (
        <motion.video
          ref={videoRef}
          key={videoUrl}
          src={videoUrl}
          autoPlay muted loop playsInline
          onCanPlay={() => setLoaded(true)}
          onError={() => setError(true)}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={videoLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
          transition={{ duration: 2, ease: [0.2, 0.7, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.4) saturate(1.15) contrast(1.05)' }}
        />
      )}

      {/* Overlay cinematográfico */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(0,18,30,0.25) 0%, rgba(0,18,30,0.05) 35%, rgba(0,18,30,0.45) 75%, rgba(0,18,30,0.92) 100%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to right, rgba(0,18,30,0.55) 0%, rgba(0,18,30,0.15) 55%, transparent 100%)',
      }} />

      {/* Grain cinematográfico */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.18,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
      />
    </div>
  )
}
