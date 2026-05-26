'use client'

import { useEffect, useState } from 'react'

type Props = { endDate: string }

export default function PromoCountdown({ endDate }: Props) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [expired, setExpired]   = useState(false)

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now()
      if (diff <= 0) { setExpired(true); return }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000)  / 60000),
        s: Math.floor((diff % 60000)    / 1000),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [endDate])

  if (expired) return null

  const Unit = ({ v, l }: { v: number; l: string }) => (
    <div className="flex flex-col items-center">
      <span className="font-display font-extrabold text-base leading-none" style={{ color: '#FFC247' }}>
        {String(v).padStart(2, '0')}
      </span>
      <span className="text-[9px] uppercase tracking-wider text-white/50">{l}</span>
    </div>
  )

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(255,122,89,0.3)' }}>
      <span className="text-[10px] text-white/70 mr-1">⏱</span>
      <Unit v={timeLeft.d} l="d" />
      <span className="text-white/40 text-xs mb-1">:</span>
      <Unit v={timeLeft.h} l="h" />
      <span className="text-white/40 text-xs mb-1">:</span>
      <Unit v={timeLeft.m} l="m" />
      <span className="text-white/40 text-xs mb-1">:</span>
      <Unit v={timeLeft.s} l="s" />
    </div>
  )
}
