'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isResearchAuthorized: boolean
  authorizeResearch: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isResearchAuthorized, setIsResearchAuthorized] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Check for existing auth on initial load - client-side only
  useEffect(() => {
    const storedAuth = localStorage.getItem('researchAuth')
    if (storedAuth === 'true') {
      setIsResearchAuthorized(true)
    }
    setInitialized(true)
  }, [])

  const authorizeResearch = (password: string): boolean => {
    // Only allow client-side
    if (typeof window === 'undefined') return false
    
    const isValid = password === 'srikanthsamyiscool'
    
    if (isValid) {
      setIsResearchAuthorized(true)
      localStorage.setItem('researchAuth', 'true')
    }
    
    return isValid
  }

  const logout = () => {
    // Only allow client-side
    if (typeof window === 'undefined') return
    
    setIsResearchAuthorized(false)
    localStorage.removeItem('researchAuth')
  }

  // Use this value for the context during server-side rendering
  const contextValue = {
    isResearchAuthorized,
    authorizeResearch,
    logout
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 