import './globals.css'
import type { Metadata } from 'next'
import { Inter, Raleway, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'OpenOcean - Ocean Monitoring Initiative',
  description: 'Making ocean data accessible to researchers, conservationists, and the public through open data and visualization.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen font-sans antialiased', inter.variable, raleway.variable, jetbrainsMono.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <main className="min-h-screen flex flex-col">
              <Navigation />
              <div className="flex-1 pt-16 md:pt-20">
                {children}
              </div>
              <Footer />
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
