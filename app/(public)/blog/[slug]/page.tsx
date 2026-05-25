import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate, whatsappUrl } from '@/lib/utils'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import LinkExt from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('posts').select('title, meta_title, meta_description, og_image_url').eq('slug', slug).single()
  return {
    title:       data?.meta_title  || (data ? `${data.title} — Linha Reta Turismo` : 'Post'),
    description: data?.meta_description || '',
    openGraph:   data?.og_image_url ? { images: [{ url: data.og_image_url }] } : undefined,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  // Renderiza conteúdo Tiptap para HTML
  let contentHTML = ''
  if (post.content) {
    try {
      contentHTML = generateHTML(post.content as any, [
        StarterKit, Highlight, LinkExt, ImageExt,
        Underline, TextStyle, Table, TableRow, TableCell, TableHeader,
      ])
    } catch {
      contentHTML = ''
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-20">
        {post.cover_image_url && (
          <div className="relative h-[50vh] min-h-[320px] max-h-[500px]">
            <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
      </section>

      {/* Conteúdo */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {post.category && (
            <Link href={`/blog?categoria=${post.category}`}
              className="badge bg-lr-ocean/10 text-lr-ocean text-xs capitalize">
              {post.category}
            </Link>
          )}
          {post.published_at && (
            <span className="text-sm text-gray-400">{formatDate(post.published_at)}</span>
          )}
          {post.reading_time_min && (
            <span className="text-sm text-gray-400">· {post.reading_time_min} min de leitura</span>
          )}
        </div>

        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-lr-navy tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-lr-ink-soft leading-relaxed mb-8 border-l-4 border-lr-ocean pl-4 font-serif italic">
            {post.excerpt}
          </p>
        )}

        {/* Conteúdo do post */}
        {contentHTML ? (
          <div className="tiptap-content" dangerouslySetInnerHTML={{ __html: contentHTML }} />
        ) : (
          <p className="text-gray-400 text-center py-10">Conteúdo não disponível.</p>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-lr-sand text-lr-ink-soft text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-8 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, #003A5D 0%, #00A7D8 100%)' }}>
          <h3 className="font-display font-extrabold text-2xl text-white mb-2">Pronto para esta aventura?</h3>
          <p className="text-white/70 mb-6">Fale com a equipe da Linha Reta e monte seu roteiro personalizado.</p>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
            style={{ background: '#FFC247', color: '#003A5D' }}>
            Falar no WhatsApp
          </a>
        </div>

        {/* Volta */}
        <div className="mt-8">
          <Link href="/blog" className="text-lr-ocean text-sm hover:underline">← Voltar ao blog</Link>
        </div>
      </article>
    </>
  )
}
