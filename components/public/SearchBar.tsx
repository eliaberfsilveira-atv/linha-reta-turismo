'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: 'nordeste',      label: '🌊 Nordeste'       },
  { value: 'nacional',      label: '🇧🇷 Brasil'         },
  { value: 'internacional', label: '✈️ Internacional'   },
  { value: 'cruzeiro',      label: '🚢 Cruzeiros'      },
]

export default function SearchBar() {
  const router   = useRouter()
  const [active, setActive] = useState('')

  function go(cat: string) {
    setActive(cat)
    router.push(cat ? `/destinos?categoria=${cat}` : '/destinos')
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2"
        style={{ border: '1px solid rgba(0,58,93,0.08)' }}>

        {/* Texto */}
        <div className="flex-1 flex items-center gap-3 px-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Para onde você quer ir?"
            className="flex-1 text-sm outline-none text-lr-navy placeholder-gray-400 py-2 bg-transparent"
            onKeyDown={e => { if (e.key === 'Enter') go(active) }}
          />
        </div>

        {/* Divisor */}
        <div className="hidden md:block w-px bg-gray-100 my-2" />

        {/* Filtro rápido */}
        <div className="flex items-center gap-1 px-2 overflow-x-auto pb-0.5 md:pb-0">
          {CATEGORIES.map(cat => (
            <button key={cat.value}
              onClick={() => go(active === cat.value ? '' : cat.value)}
              className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
              style={{
                background: active === cat.value ? '#003A5D' : '#F3F4F6',
                color:      active === cat.value ? 'white'   : '#6B7280',
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Botão */}
        <button
          onClick={() => go(active)}
          className="shrink-0 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:brightness-105"
          style={{ background: '#FFC247', color: '#003A5D' }}>
          Buscar
        </button>
      </div>
    </div>
  )
}
