"use client"

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  
  // Avoid hydration mismatch by only rendering once mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <div className="w-9 h-9" />
  }
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        "relative p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        theme === 'dark' 
          ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" 
          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
      )}
      aria-label="Toggle theme"
    >
      <Sun className={cn(
        "h-5 w-5 transition-opacity",
        theme === 'dark' ? "opacity-100" : "opacity-0 absolute"
      )} />
      <Moon className={cn(
        "h-5 w-5 transition-opacity",
        theme === 'dark' ? "opacity-0 absolute" : "opacity-100"
      )} />
    </button>
  )
} 