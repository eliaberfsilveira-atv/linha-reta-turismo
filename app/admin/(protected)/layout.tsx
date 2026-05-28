import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/Sidebar'
import DashboardThemeProvider from '@/components/admin/DashboardThemeProvider'
import ThemeSwitcher from '@/components/admin/ThemeSwitcher'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <DashboardThemeProvider>
      <div className="flex min-h-screen" style={{ background: 'var(--dash-bg)' }}>
        <AdminSidebar />
        {/* Desktop: ml-64 | Mobile/Tablet: ml-0 com padding-top para o botão hamburger */}
        <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 px-4 md:px-6 lg:px-8 py-6 lg:py-8 min-w-0">
          <div className="fixed top-4 right-4 z-40">
            <ThemeSwitcher />
          </div>
          {children}
        </main>
      </div>
    </DashboardThemeProvider>
  )
}
