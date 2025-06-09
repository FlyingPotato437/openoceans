'use client'

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

// Simple config - change this to false to disable demo mode
const DEMO_MODE = true

interface DemoBannerProps {
  variant?: 'banner' | 'badge' | 'watermark'
  showCloseButton?: boolean
}

export default function DemoBanner({ 
  variant = 'banner', 
  showCloseButton = true 
}: DemoBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!DEMO_MODE || !isVisible) {
    return null
  }

  if (variant === 'watermark') {
    return (
      <div className="fixed bottom-4 right-4 z-30 pointer-events-none bg-gray-100/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-600/50 rounded-md px-3 py-1.5 text-gray-500 dark:text-gray-400 text-xs font-handwritten backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <span className="opacity-60">⚠️</span>
          <span>Demo Site - Test Data</span>
        </div>
      </div>
    )
  }

  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 text-xs font-medium">
        <AlertTriangle className="h-3 w-3" />
        <span>Demo</span>
      </div>
    )
  }

  // Default banner variant
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-orange-500 to-amber-500 text-white border-b border-orange-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-2 relative">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            <span>This is a demo site for testing purposes only. Data shown may not be real.</span>
          </div>
          {showCloseButton && (
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-0 p-1 hover:bg-white/20 rounded-md transition-colors"
              aria-label="Close demo banner"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Export the demo mode state for other components to use
export { DEMO_MODE } 