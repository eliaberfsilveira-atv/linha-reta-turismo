import CampaignEditor from '@/components/admin/CampaignEditor'
import Link from 'next/link'

export const metadata = { title: 'Nova Campanha — Admin' }

export default function NovaCampanhaPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/email" className="text-gray-400 hover:text-lr-navy transition-colors text-sm">
          ← Email
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">Nova campanha</h1>
      </div>
      <CampaignEditor mode="create" />
    </div>
  )
}
