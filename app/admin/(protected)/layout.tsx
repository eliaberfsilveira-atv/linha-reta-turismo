import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/Sidebar'
import DashboardThemeProvider from '@/components/admin/DashboardThemeProvider'
import ThemeSwitcher from '@/components/admin/ThemeSwitcher'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <DashboardThemeProvider>
      <div className="flex min-h-screen" style={{ background: 'var(--dash-bg)' }}>
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          {/* Theme switcher flutuante */}
          <div className="fixed top-4 right-6 z-40">
            <ThemeSwitcher />
          </div>
          {children}
        </main>
      </div>
    </DashboardThemeProvider>
  )
}
