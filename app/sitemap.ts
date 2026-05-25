import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://linharetaturismo.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const [destinationsRes, postsRes] = await Promise.all([
    supabase.from('destinations').select('slug, updated_at').neq('status', 'inactive'),
    supabase.from('posts').select('slug, updated_at').eq('status', 'published'),
  ])

  const destinations = destinationsRes.data || []
  const posts        = postsRes.data        || []

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:              `${SITE_URL}`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         1,
    },
    {
      url:              `${SITE_URL}/destinos`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.9,
    },
    {
      url:              `${SITE_URL}/blog`,
      lastModified:     new Date(),
      changeFrequency:  'daily',
      priority:         0.8,
    },
    {
      url:              `${SITE_URL}/captura`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.6,
    },
    {
      url:              `${SITE_URL}/privacidade`,
      lastModified:     new Date(),
      changeFrequency:  'yearly',
      priority:         0.3,
    },
  ]

  // Páginas de destinos
  const destinationPages: MetadataRoute.Sitemap = destinations.map(d => ({
    url:             `${SITE_URL}/destinos/${d.slug}`,
    lastModified:    d.updated_at ? new Date(d.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority:        0.8,
  }))

  // Páginas de posts
  const postPages: MetadataRoute.Sitemap = posts.map(p => ({
    url:             `${SITE_URL}/blog/${p.slug}`,
    lastModified:    p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority:        0.7,
  }))

  return [...staticPages, ...destinationPages, ...postPages]
}
