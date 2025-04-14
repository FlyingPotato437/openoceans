"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by only mounting on client-side
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // To handle the flash of unstyled content during dark mode
  if (!mounted) {
    // Render a placeholder div that takes up the same space during SSR
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 