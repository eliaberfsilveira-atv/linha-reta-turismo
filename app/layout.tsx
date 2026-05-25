import type { Metadata } from 'next'
import { League_Spartan, Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://linharetaturismo.com.br'),
  title: {
    default: 'Linha Reta Turismo — Do sonho ao destino, sem desvio.',
    template: '%s | Linha Reta Turismo',
  },
  description: 'Pacotes de viagem para os destinos mais bonitos do Brasil e do mundo. Nordeste, Fernando de Noronha, Gramado e muito mais.',
  keywords: ['turismo', 'pacotes de viagem', 'nordeste', 'Fernando de Noronha', 'Recife', 'viagem', 'agência de viagens'],
  authors: [{ name: 'Linha Reta Turismo' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Linha Reta Turismo',
    title: 'Linha Reta Turismo — Do sonho ao destino, sem desvio.',
    description: 'Pacotes de viagem para os destinos mais bonitos do Brasil e do mundo.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linha Reta Turismo',
    description: 'Pacotes de viagem para os destinos mais bonitos do Brasil.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${leagueSpartan.variable} ${poppins.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-lr-sand text-lr-ink">
        {children}
      </body>
    </html>
  )
}
