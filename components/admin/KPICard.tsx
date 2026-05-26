'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'
import { useDashboardTheme } from './DashboardThemeProvider'

type Sparkline = number[]

type Props = {
  icon:       string
  label:      string
  value:      number
  prefix?:    string
  suffix?:    string
  trend?:     number   // % vs período anterior
  sparkline?: Sparkline
  alert?:     boolean
  delay?:     number
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80, h = 32
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function KPICard({ icon, label, value, prefix = '', suffix = '', trend, sparkline, alert, delay = 0 }: Props) {
  const { accentColor, accentSoft, mode } = useDashboardTheme()
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * value))
      if (p < 1) requestAnimationFrame(tick)
      else setCount(value)
    }
    requestAnimationFrame(tick)
  }, [inView, value])

  const trendUp    = (trend || 0) >= 0
  const trendColor = alert ? '#FF7A59' : trendUp ? '#2E8B57' : '#FF7A59'
  const cardBg     = alert
    ? (mode === 'dark' ? '#2A1A1A' : '#FEF0ED')
    : 'var(--dash-surface)'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.3, 1] }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background:  cardBg,
        border:      alert ? '1px solid #FF7A5940' : '1px solid var(--dash-border)',
        boxShadow:   '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--dash-text-soft)' }}>{label}</span>
        </div>
        {trend !== undefined && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: trendColor + '20', color: trendColor }}>
            {trendUp ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="font-display font-extrabold text-4xl" style={{ color: alert ? '#FF7A59' : accentColor }}>
          {prefix}{count.toLocaleString('pt-BR')}{suffix}
        </div>
        {sparkline && <MiniSparkline data={sparkline} color={alert ? '#FF7A59' : accentColor} />}
      </div>
    </motion.div>
  )
}
