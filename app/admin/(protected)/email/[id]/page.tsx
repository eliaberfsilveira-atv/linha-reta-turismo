import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CampaignEditor from '@/components/admin/CampaignEditor'
import Link from 'next/link'

export const metadata = { title: 'Editar Campanha — Admin' }

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: campaign } = await supabase
    .from('email_campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (!campaign) notFound()

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/email" className="text-gray-400 hover:text-lr-navy transition-colors text-sm">
          ← Email
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">{campaign.name}</h1>
      </div>
      <CampaignEditor mode="edit" campaign={campaign} />
    </div>
  )
}
