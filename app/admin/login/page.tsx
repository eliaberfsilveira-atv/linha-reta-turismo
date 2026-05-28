'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

// Partícula flutuante
function Particle({ delay, x, size, duration }: { delay: number; x: number; size: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        bottom: '-20px',
        width:  size,
        height: size,
        background: size > 8
          ? 'rgba(0,167,216,0.15)'
          : 'rgba(255,194,71,0.2)',
        filter: 'blur(1px)',
      }}
      animate={{
        y:       [0, -(400 + Math.random() * 300)],
        x:       [0, (Math.random() - 0.5) * 80],
        opacity: [0, 0.8, 0],
        scale:   [0.5, 1.2, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease:   'easeInOut',
      }}
    />
  )
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id:       i,
  delay:    i * 0.7,
  x:        5 + (i * 5.5) % 90,
  size:     4 + (i % 5) * 4,
  duration: 6 + (i % 4) * 2,
}))

export default function AdminLoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [shake,    setShake]    = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos')
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } else {
      router.push('/admin')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #001829 0%, #002E4A 50%, #001220 100%)' }}>

      {/* Glow orbs de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{ width: 600, height: 600, top: '10%', left: '-10%',
            background: 'radial-gradient(circle, rgba(0,167,216,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: 500, height: 500, bottom: '5%', right: '-5%',
            background: 'radial-gradient(circle, rgba(255,194,71,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: 350, height: 350, top: '40%', right: '20%',
            background: 'radial-gradient(circle, rgba(0,167,216,0.07) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
      </div>

      {/* Ondas animadas no rodapé */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: 180 }}>
        {[0, 1, 2].map(i => (
          <motion.svg key={i} className="absolute bottom-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none"
            style={{ opacity: 0.08 + i * 0.04 }}
            animate={{ x: [0, i % 2 === 0 ? -40 : 40, 0] }}
            transition={{ duration: 12 + i * 3, repeat: Infinity, ease: 'easeInOut' }}>
            <path d={`M0 ${60 + i * 10} Q360 ${20 + i * 8} 720 ${50 + i * 10} T1440 ${30 + i * 8} L1440 120 L0 120 Z`}
              fill="#00A7D8" />
          </motion.svg>
        ))}
      </div>

      {/* Partículas flutuantes */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => <Particle key={p.id} {...p} />)}
      </div>

      {/* Linha de grade sutil */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,167,216,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,167,216,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Card de login */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-8 overflow-hidden"
          style={{
            background:  'rgba(255,255,255,0.04)',
            border:      '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(24px)',
            boxShadow:   '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Logo + titulo */}
          <div className="flex flex-col items-center mb-8">
            <Logo size={64} variant="light" animate={true} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="text-center mt-4"
            >
              <div className="font-display font-extrabold text-2xl text-white tracking-tight">Painel Admin</div>
              <div className="text-white/40 text-xs mt-1 tracking-wider">LINHA RETA TURISMO</div>
            </motion.div>
          </div>

          {/* Formulário */}
          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email" required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contato@linharetaturismo.com.br"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background:  'rgba(255,255,255,0.06)',
                  border:      '1px solid rgba(255,255,255,0.12)',
                  color:       'white',
                }}
                onFocus={e => e.target.style.border = '1px solid rgba(0,167,216,0.6)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.12)'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                Senha
              </label>
              <input
                type="password" required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background:  'rgba(255,255,255,0.06)',
                  border:      '1px solid rgba(255,255,255,0.12)',
                  color:       'white',
                }}
                onFocus={e => e.target.style.border = '1px solid rgba(0,167,216,0.6)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.12)'}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                  style={{ background: 'rgba(255,122,89,0.15)', color: '#FF7A59', border: '1px solid rgba(255,122,89,0.3)' }}>
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, brightness: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl font-display font-bold text-sm tracking-wide transition-all disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #FFC247 0%, #FFB020 100%)', color: '#003A5D' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-lr-navy/30 border-t-lr-navy rounded-full"
                  />
                  Entrando...
                </span>
              ) : (
                'Entrar no painel →'
              )}
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-white/20 text-xs mt-6 tracking-widest uppercase"
        >
          Do sonho ao destino, sem desvio.
        </motion.p>
      </motion.div>
    </div>
  )
}
