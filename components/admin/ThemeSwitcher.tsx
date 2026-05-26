'use client'

import { useDashboardTheme, ACCENT_COLORS, AccentColor } from './DashboardThemeProvider'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeSwitcher() {
  const { mode, accent, setMode, setAccent, accentColor } = useDashboardTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
        style={{
          background: `${accentColor}18`,
          color:      accentColor,
          border:     `1px solid ${accentColor}30`,
        }}
      >
        <span>{mode === 'dark' ? '🌙' : '☀️'}</span>
        <span className="hidden md:inline">Tema</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-20 w-64 rounded-2xl shadow-2xl p-4 space-y-4"
              style={{
                background: 'var(--dash-surface)',
                border:     '1px solid var(--dash-border)',
              }}
            >
              {/* Modo */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--dash-text-soft)' }}>
                  Modo
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['light', 'dark'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: mode === m ? accentColor : 'var(--dash-bg)',
                        color:      mode === m ? 'white' : 'var(--dash-text-soft)',
                        border:     `1px solid ${mode === m ? accentColor : 'var(--dash-border)'}`,
                      }}
                    >
                      {m === 'light' ? '☀️ Claro' : '🌙 Escuro'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cor de destaque */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--dash-text-soft)' }}>
                  Cor de destaque
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.entries(ACCENT_COLORS) as [AccentColor, { primary: string; label: string }][]).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setAccent(key)}
                      title={val.label}
                      className="relative w-10 h-10 rounded-xl transition-transform hover:scale-110"
                      style={{ background: val.primary }}
                    >
                      {accent === key && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
