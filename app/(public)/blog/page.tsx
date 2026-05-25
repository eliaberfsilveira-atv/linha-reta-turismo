import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, truncate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog — Linha Reta Turismo',
  description: 'Dicas de viagem, roteiros, destinos e tudo que você precisa saber para viajar melhor pelo Brasil.',
}

export const revalidate = 60

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, cover_image_url, category, tags, published_at, reading_time_min')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const featured = posts?.[0]
  const rest     = posts?.slice(1) || []

  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 text-center" style={{ background: 'linear-gradient(160deg, #003A5D 0%, #002438 100%)' }}>
        <div className="text-lr-ocean font-bold text-sm uppercase tracking-widest mb-3">Inspiração para viajar</div>
        <h1 className="font-display font-extrabold text-5xl md:text-6xl text-white tracking-tight mb-4">Blog</h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          Roteiros, dicas e tudo que você precisa para planejar a viagem dos seus sonhos.
        </p>
      </section>

      <section className="section">
        <div className="max-w-6xl mx-auto">
          {!posts?.length ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">✍️</div>
              <h2 className="font-display font-bold text-2xl text-lr-navy mb-2">Em breve</h2>
              <p className="text-gray-400">Estamos preparando conteúdo incrível para você.</p>
            </div>
          ) : (
            <>
              {/* Post em destaque */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="group block mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-64 md:h-auto min-h-[300px]">
                      {featured.cover_image_url ? (
                        <Image src={featured.cover_image_url} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-lr-sky/30" />
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      {featured.category && (
                        <span className="badge bg-lr-ocean/10 text-lr-ocean text-xs mb-3 capitalize">{featured.category}</span>
                      )}
                      <h2 className="font-display font-extrabold text-3xl text-lr-navy leading-tight mb-3 group-hover:text-lr-ocean transition-colors">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-lr-ink-soft leading-relaxed mb-4">{truncate(featured.excerpt, 160)}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {featured.published_at && <span>{formatDate(featured.published_at)}</span>}
                        {featured.reading_time_min && <span>· {featured.reading_time_min} min de leitura</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid de posts */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                      <div className="relative h-48">
                        {post.cover_image_url ? (
                          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-lr-sky/20" />
                        )}
                      </div>
                      <div className="p-5">
                        {post.category && (
                          <span className="text-xs font-bold text-lr-ocean uppercase tracking-wider capitalize">{post.category}</span>
                        )}
                        <h3 className="font-display font-bold text-lg text-lr-navy mt-1 mb-2 line-clamp-2 group-hover:text-lr-ocean transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                          {post.published_at && <span>{formatDate(post.published_at)}</span>}
                          {post.reading_time_min && <span>· {post.reading_time_min} min</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
