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

  // Check for existing auth on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem('researchAuth')
    if (storedAuth === 'true') {
      setIsResearchAuthorized(true)
    }
  }, [])

  const authorizeResearch = (password: string): boolean => {
    const isValid = password === 'srikanthsamyiscool'
    
    if (isValid) {
      setIsResearchAuthorized(true)
      localStorage.setItem('researchAuth', 'true')
    }
    
    return isValid
  }

  const logout = () => {
    setIsResearchAuthorized(false)
    localStorage.removeItem('researchAuth')
  }

  return (
    <AuthContext.Provider value={{ isResearchAuthorized, authorizeResearch, logout }}>
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