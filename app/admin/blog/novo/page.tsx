import BlogEditor from '@/components/admin/BlogEditor'
import Link from 'next/link'

export const metadata = { title: 'Novo Post — Admin' }

export default function NovoBlogPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-lr-navy transition-colors text-sm">
          ← Blog
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">Novo post</h1>
      </div>
      <BlogEditor mode="create" />
    </div>
  )
}
