'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type ThemeMode   = 'light' | 'dark'
export type AccentColor = 'ocean' | 'sun' | 'green' | 'coral' | 'purple'

const ACCENT_COLORS: Record<AccentColor, { primary: string; soft: string; label: string }> = {
  ocean:  { primary: '#00A7D8', soft: '#E0F4FB', label: 'Oceano'   },
  sun:    { primary: '#FFC247', soft: '#FFF8E6', label: 'Sol'      },
  green:  { primary: '#2E8B57', soft: '#E8F5EE', label: 'Verde'    },
  coral:  { primary: '#FF7A59', soft: '#FEF0ED', label: 'Coral'    },
  purple: { primary: '#7C3AED', soft: '#EDE9FE', label: 'Roxo'     },
}

type ThemeCtx = {
  mode:        ThemeMode
  accent:      AccentColor
  setMode:     (m: ThemeMode) => void
  setAccent:   (a: AccentColor) => void
  accentColor: string
  accentSoft:  string
  colors:      typeof ACCENT_COLORS
}

const Ctx = createContext<ThemeCtx>({} as ThemeCtx)
export const useDashboardTheme = () => useContext(Ctx)
export { ACCENT_COLORS }

export default function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode,   setModeState]   = useState<ThemeMode>('light')
  const [accent, setAccentState] = useState<AccentColor>('ocean')

  useEffect(() => {
    try {
      const m = localStorage.getItem('lr_dash_mode')   as ThemeMode   | null
      const a = localStorage.getItem('lr_dash_accent') as AccentColor | null
      if (m) setModeState(m)
      if (a) setAccentState(a)
    } catch {}
  }, [])

  const setMode = (m: ThemeMode) => {
    setModeState(m)
    try { localStorage.setItem('lr_dash_mode', m) } catch {}
  }

  const setAccent = (a: AccentColor) => {
    setAccentState(a)
    try { localStorage.setItem('lr_dash_accent', a) } catch {}
  }

  const { primary, soft } = ACCENT_COLORS[accent]

  const bg      = mode === 'dark' ? '#0F1923' : '#F8F4EA'
  const surface = mode === 'dark' ? '#1A2535' : '#FFFFFF'
  const border  = mode === 'dark' ? '#2A3A4E' : '#E5E7EB'
  const text     = mode === 'dark' ? '#F1F5F9' : '#1F2937'
  const textSoft = mode === 'dark' ? '#94A3B8' : '#6B7280'

  return (
    <Ctx.Provider value={{ mode, accent, setMode, setAccent, accentColor: primary, accentSoft: soft, colors: ACCENT_COLORS }}>
      <div
        style={{
          '--dash-bg':         bg,
          '--dash-surface':    surface,
          '--dash-border':     border,
          '--dash-text':       text,
          '--dash-text-soft':  textSoft,
          '--dash-accent':     primary,
          '--dash-accent-soft':soft,
          background:          bg,
          color:               text,
          minHeight:           '100vh',
          transition:          'background 0.3s, color 0.3s',
        } as React.CSSProperties}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
}
