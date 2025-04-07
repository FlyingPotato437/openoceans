"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
        "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 text-slate-700 transition-all dark:rotate-90 dark:scale-0 dark:text-slate-400" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 text-slate-700 transition-all dark:rotate-0 dark:scale-100 dark:text-slate-400" />
    </button>
  )
} 