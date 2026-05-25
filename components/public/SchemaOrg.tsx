// Componente de Schema.org para SEO estruturado
// Uso: <SchemaOrg type="destination" data={destination} />

type DestinationSchemaProps = {
  type: 'destination'
  data: {
    name: string
    description?: string | null
    image?: string | null
    price?: number | null
    slug: string
  }
}

type BlogSchemaProps = {
  type: 'blog'
  data: {
    title: string
    excerpt?: string | null
    image?: string | null
    publishedAt?: string | null
    slug: string
  }
}

type OrganizationSchemaProps = {
  type: 'organization'
}

type Props = DestinationSchemaProps | BlogSchemaProps | OrganizationSchemaProps

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://linharetaturismo.com.br'

export default function SchemaOrg(props: Props) {
  let schema: Record<string, any> = {}

  if (props.type === 'organization') {
    schema = {
      '@context':   'https://schema.org',
      '@type':      'TravelAgency',
      name:         'Linha Reta Turismo',
      url:          SITE_URL,
      logo:         `${SITE_URL}/logo.png`,
      description:  'Agência de viagens especializada em destinos brasileiros, especialmente no Nordeste.',
      address: {
        '@type':           'PostalAddress',
        addressLocality:   'Recife',
        addressRegion:     'PE',
        addressCountry:    'BR',
      },
      contactPoint: {
        '@type':            'ContactPoint',
        telephone:          '+55-81-9121-8178',
        contactType:        'customer service',
        availableLanguage:  'Portuguese',
      },
      sameAs: [],
    }
  }

  if (props.type === 'destination') {
    const { data } = props
    schema = {
      '@context': 'https://schema.org',
      '@type':    'TouristDestination',
      name:       data.name,
      description: data.description || '',
      url:        `${SITE_URL}/destinos/${data.slug}`,
      image:      data.image || '',
      offers: data.price ? {
        '@type':        'Offer',
        price:          data.price,
        priceCurrency:  'BRL',
        availability:   'https://schema.org/InStock',
        seller: {
          '@type': 'TravelAgency',
          name:    'Linha Reta Turismo',
        },
      } : undefined,
    }
  }

  if (props.type === 'blog') {
    const { data } = props
    schema = {
      '@context':         'https://schema.org',
      '@type':            'BlogPosting',
      headline:           data.title,
      description:        data.excerpt || '',
      image:              data.image || '',
      url:                `${SITE_URL}/blog/${data.slug}`,
      datePublished:      data.publishedAt || new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name:    'Linha Reta Turismo',
      },
      publisher: {
        '@type': 'Organization',
        name:    'Linha Reta Turismo',
        logo: {
          '@type': 'ImageObject',
          url:     `${SITE_URL}/logo.png`,
        },
      },
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
