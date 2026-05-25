import DestinationForm from '@/components/admin/DestinationForm'
import Link from 'next/link'

export const metadata = { title: 'Novo Destino — Admin' }

export default function NovoDestinoPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/destinos" className="text-gray-400 hover:text-lr-navy transition-colors text-sm">
          ← Destinos
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">Novo destino</h1>
      </div>
      <DestinationForm mode="create" />
    </div>
  )
}
