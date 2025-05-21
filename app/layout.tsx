import './globals.css'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Playfair_Display, Caveat, Dancing_Script } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
// import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Add organic, handwritten, and serif fonts
const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const caveat = Caveat({ 
  subsets: ['latin'],
  variable: '--font-handwritten',
  display: 'swap',
})

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-cursive',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://openocean.org'),
  title: 'OpenOcean',
  description: 'An open-source initiative for oceanographic data visualization and analysis',
  icons: {
    icon: [
      { url: '/logos/openoceans_favicon.png', type: 'image/png', sizes: 'any' }
    ],
    apple: [
      { url: '/logos/openoceans_favicon.png', type: 'image/png' }
    ],
    shortcut: ['/logos/openoceans_favicon.png']
  },
  keywords: [
    'oceanography',
    'climate',
    'data visualization',
    'open data',
    'research',
    'buoy',
    'water quality',
    'temperature',
    'ocean',
    'sea',
    'maritime',
    'marine',
    'science',
  ],
  authors: [
    {
      name: 'OpenOcean Contributors',
      url: 'https://github.com/openocean/contributors',
    },
  ],
  creator: 'OpenOcean Initiative',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://openocean.org',
    title: 'OpenOcean',
    description: 'An open-source initiative for oceanographic data visualization and analysis',
    siteName: 'OpenOcean',
    images: [
      {
        url: '/images/reeflect-logo.svg', // TODO: Replace with a more representative ocean image if desired
        width: 1200,
        height: 630,
        alt: 'OpenOcean Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenOcean',
    description: 'An open-source initiative for oceanographic data visualization and analysis',
    creator: '@openocean',
    images: [
      {
        url: '/images/reeflect-logo.svg', // TODO: Replace with a more representative ocean image if desired
        alt: 'OpenOcean Logo',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OpenOcean',
    url: 'https://openocean.org',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://openocean.org/search?q={search_term_string}', // Update if you have a site search
      'query-input': 'required name=search_term_string',
    },
    description: 'An open-source initiative for oceanographic data visualization and analysis',
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable} ${playfairDisplay.variable} ${caveat.variable} ${dancingScript.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sf-pro antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex flex-col min-h-screen mx-auto">
              <Navigation />
              <main className="flex-grow pt-16">{children}</main>
              <Footer />
            </div>
            {/* <Analytics /> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
