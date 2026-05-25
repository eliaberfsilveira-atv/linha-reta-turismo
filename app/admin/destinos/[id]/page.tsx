import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DestinationForm from '@/components/admin/DestinationForm'
import Link from 'next/link'

export const metadata = { title: 'Editar Destino — Admin' }

export default async function EditDestinoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single()

  if (!destination) notFound()

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/destinos" className="text-gray-400 hover:text-lr-navy transition-colors text-sm">
          ← Destinos
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">{destination.name}</h1>
      </div>
      <DestinationForm mode="edit" destination={destination} />
    </div>
  )
}