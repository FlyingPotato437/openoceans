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
    return <div className="w-7 h-7" />
  }
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        "relative p-1.5 rounded-sharp-md transition-all duration-200 focus:outline-none",
        theme === 'dark' 
          ? "bg-[#2c2c2e] text-white hover:bg-[#3a3a3e]" 
          : "bg-[#f2f2f7] text-black hover:bg-[#e5e5ea]"
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 transition-transform duration-200" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-200" />
      )}
    </button>
  )
} 