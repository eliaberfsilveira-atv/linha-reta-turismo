'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { href: '/admin',          icon: '📊', label: 'Dashboard'      },
  { href: '/admin/leads',    icon: '📥', label: 'Leads'          },
  { href: '/admin/destinos', icon: '✈️', label: 'Destinos'       },
  { href: '/admin/blog',     icon: '✍️', label: 'Blog'           },
  { href: '/admin/email',    icon: '📧', label: 'Email Marketing' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Fecha ao navegar no mobile
  useEffect(() => { setOpen(false) }, [pathname])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={34} variant="light" />
            <div>
              <div className="font-display font-extrabold text-lg text-white tracking-tight leading-none">LINHA RETA</div>
              <div className="text-lr-ocean text-[9px] font-semibold tracking-[0.3em] mt-0.5">TURISMO · ADMIN</div>
            </div>
          </div>
          {isMobile && (
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white p-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(0,167,216,0.15)' : 'transparent',
                color:      active ? '#00A7D8' : 'rgba(255,255,255,0.6)',
                borderLeft: active ? '2px solid #00A7D8' : '2px solid transparent',
              }}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-red-500/10"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>🚪</span> Sair
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — fixo */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-64 z-20"
        style={{ background: '#002438', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile/Tablet — hamburger button */}
      {isMobile && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-30 flex items-center justify-center w-10 h-10 rounded-xl shadow-lg"
          style={{ background: '#003A5D', border: '1px solid rgba(255,255,255,0.1)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      )}

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobile && open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 z-40 flex flex-col"
              style={{ background: '#002438', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
