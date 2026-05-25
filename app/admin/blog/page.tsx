import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Blog — Admin' }
export const revalidate = 0

const STATUS_CONFIG = {
  draft:     { label: 'Rascunho',   color: '#9CA3AF', bg: '#F3F4F6' },
  published: { label: 'Publicado',  color: '#2E8B57', bg: '#2E8B5720' },
  archived:  { label: 'Arquivado',  color: '#FF7A59', bg: '#FF7A5920' },
}

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, slug, title, status, category, published_at, created_at, reading_time_min')
    .order('created_at', { ascending: false })

  const total     = posts?.length || 0
  const published = posts?.filter(p => p.status === 'published').length || 0
  const drafts    = posts?.filter(p => p.status === 'draft').length || 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-lr-navy tracking-tight">Blog</h1>
          <p className="text-lr-ink-soft mt-1">
            {total} posts · {published} publicados · {drafts} rascunhos
          </p>
        </div>
        <Link href="/admin/blog/novo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
          style={{ background: '#FFC247', color: '#003A5D' }}>
          ✍️ Novo post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!posts?.length ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-3">✍️</div>
            <div className="font-bold text-lr-navy mb-1">Nenhum post ainda</div>
            <div className="text-gray-400 text-sm mb-6">Crie seu primeiro post e comece a ranquear no Google</div>
            <Link href="/admin/blog/novo"
              className="inline-flex px-5 py-2.5 rounded-xl font-bold text-sm"
              style={{ background: '#FFC247', color: '#003A5D' }}>
              Criar primeiro post
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Título</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Categoria</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Data</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => {
                const st = STATUS_CONFIG[post.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft
                return (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-lr-navy">{post.title}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{post.category || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {post.published_at
                        ? formatDate(post.published_at)
                        : formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/blog/${post.id}`}
                        className="text-lr-ocean text-sm font-semibold hover:underline">
                        Editar →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
