'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin',          label: 'Dashboard',  icon: '⊞' },
  { href: '/admin/destinos', label: 'Destinos',    icon: '✈️' },
  { href: '/admin/blog',     label: 'Blog',        icon: '✍️' },
  { href: '/admin/email',    label: 'Email',       icon: '📧' },
  { href: '/admin/leads',    label: 'Leads',       icon: '🔔' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 flex flex-col z-20"
      style={{ background: '#002438', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Logo size={36} variant="light" />
          <div>
            <div className="font-display font-extrabold text-lg text-white tracking-tight leading-none">LINHA RETA</div>
            <div className="text-lr-ocean text-[9px] font-semibold tracking-[0.3em] mt-0.5">TURISMO · ADMIN</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)

          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-lr-ocean/20 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}>
              <span className="text-base">{item.icon}</span>
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-lr-ocean" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full">
          <span>→</span>
          Sair
        </button>
      </div>
    </aside>
  )
}
