import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BlogEditor from '@/components/admin/BlogEditor'
import Link from 'next/link'

export const metadata = { title: 'Editar Post — Admin' }

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-lr-navy transition-colors text-sm">
          ← Blog
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight line-clamp-1">{post.title}</h1>
      </div>
      <BlogEditor mode="edit" post={post} />
    </div>
  )
}
