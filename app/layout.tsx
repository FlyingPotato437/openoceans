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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenOcean',
    description: 'An open-source initiative for oceanographic data visualization and analysis',
    creator: '@openocean',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable} ${playfairDisplay.variable} ${caveat.variable} ${dancingScript.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sf-pro antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          suppressHydrationWarning
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
