'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const router  = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #003A5D 0%, #001829 100%)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-display font-extrabold text-4xl text-white tracking-tight">LINHA RETA</div>
          <div className="text-lr-ocean text-xs font-semibold tracking-[0.3em] mt-1">TURISMO · PAINEL ADMIN</div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-lr-ocean transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-lr-ocean transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="px-6 pb-4 text-lr-coral text-sm">{error}</div>
            )}

            <div className="px-6 pb-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Entrando...' : 'Entrar no painel'}
              </button>
            </div>
          </div>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          Acesso restrito · Linha Reta Turismo
        </p>
      </div>
    </div>
  )
}
