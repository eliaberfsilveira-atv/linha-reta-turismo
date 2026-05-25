'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CapturePage() {
  const [form, setForm]       = useState({ name: '', email: '' })
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) { setError('Você precisa aceitar para continuar.'); return }

    setLoading(true)
    setError('')

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, consent: true, source: 'capture_page' }),
    })

    if (res.ok) {
      setSuccess(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Erro ao inscrever. Tente novamente.')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6"
        style={{ background: 'linear-gradient(160deg, #003A5D 0%, #002438 100%)' }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="font-display font-extrabold text-4xl text-white mb-4">Você está dentro!</h1>
          <p className="text-white/70 text-lg mb-8">
            Enviamos um email de boas-vindas. Fique de olho nas próximas ofertas exclusivas.
          </p>
          <Link href="/" className="btn-primary">Explorar destinos</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Left — Visual */}
      <div className="md:w-1/2 relative min-h-[300px] md:min-h-screen"
        style={{ background: 'linear-gradient(160deg, #003A5D 0%, #001829 100%)' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
          <div className="font-display font-extrabold text-5xl text-white tracking-tight mb-4">
            Ofertas antes<br />de todo mundo
          </div>
          <p className="text-white/60 text-lg max-w-xs">
            Receba os melhores pacotes e promoções exclusivas diretamente no seu email.
          </p>

          <div className="mt-10 space-y-3 text-left w-full max-w-xs">
            {[
              '✈️ Promoções relâmpago de pacotes',
              '🌊 Destinos novos em primeira mão',
              '💛 Conteúdo exclusivo de viagem',
              '🔕 Sem spam — cancele quando quiser',
            ].map(item => (
              <div key={item} className="text-white/70 text-sm">{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="md:w-1/2 flex items-center justify-center px-8 py-16 bg-lr-sand">
        <div className="w-full max-w-md">
          <Link href="/" className="text-lr-ink-soft text-sm hover:text-lr-navy mb-8 block">← Voltar ao site</Link>

          <div className="mb-8">
            <div className="font-display font-extrabold text-4xl text-lr-navy tracking-tight mb-2">
              Quero receber<br />as melhores ofertas
            </div>
            <p className="text-lr-ink-soft">É gratuito e você pode sair quando quiser.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Seu nome</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Como podemos te chamar?"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lr-ocean transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Seu email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="seu@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lr-ocean transition-colors bg-white"
              />
            </div>

            {/* LGPD Consent */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-lr-navy"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                Concordo em receber emails da Linha Reta Turismo com ofertas e conteúdo.
                Você pode cancelar a inscrição a qualquer momento.
                Leia nossa{' '}
                <Link href="/privacidade" className="text-lr-ocean underline" target="_blank">
                  política de privacidade
                </Link>.
              </span>
            </label>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading || !consent}
              className="w-full btn-primary justify-center py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? 'Inscrevendo...' : 'Quero receber as ofertas →'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Sem spam. Cancelamento com 1 clique.
          </p>
        </div>
      </div>
    </div>
  )
}
