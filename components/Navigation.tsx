'use client'

import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Search, Moon, Sun } from 'lucide-react'
import { ThemeSwitcher } from './ThemeSwitcher'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const MENU_ITEMS = [
  {
    name: 'Home',
    href: '/',
    icon: '🌎', // Globe emoji
    emojiLabel: 'Globe'
  },
  {
    name: 'Map',
    href: '/map',
    icon: '📍', // Map pin emoji
    emojiLabel: 'Map Pin'
  },
  {
    name: 'About',
    href: '/about',
    icon: 'ℹ️', // Info emoji
    emojiLabel: 'Information',
    children: [
      { name: 'Our Mission', href: '/about#mission' },
      { name: 'The Team', href: '/about#team' },
      { name: 'Technology', href: '/about#technology' },
    ]
  },
  {
    name: 'Data',
    href: '/data',
    icon: '💾', // Database emoji
    emojiLabel: 'Database',
    children: [
      { name: 'Browse Datasets', href: '/data/browse' },
      { name: 'API Access', href: '/data/api' },
      { name: 'Download Options', href: '/data/download' },
    ]
  },
  {
    name: 'Research',
    href: '/research',
    icon: '📚', // Book emoji
    emojiLabel: 'Book'
  },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { isResearchAuthorized } = useAuth()
  const [mounted, setMounted] = useState(false)
  
  // Handle client-side only operations
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useEffect(() => {
    setIsOpen(false)
    setOpenDropdown(null)
  }, [pathname])
  
  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name)
  }
  
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }
  
  // Render a simplified version during server rendering to avoid hydration mismatches
  const filteredMenuItems = mounted 
    ? MENU_ITEMS.filter(item => !(item.name === 'Research' && !isResearchAuthorized))
    : MENU_ITEMS.filter(item => item.name !== 'Research')
  
  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/95 dark:bg-black/95 backdrop-blur-lg shadow-sharp border-b border-border" 
          : "bg-white/80 dark:bg-black/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 z-10" onClick={() => setIsOpen(false)}>
            <div className="relative w-8 h-8 md:w-9 md:h-9 overflow-hidden">
              <div className="absolute inset-0 rounded-sharp-md bg-gradient-to-br from-ocean-500 to-seagrass-400 animate-pulse [animation-duration:4s]"></div>
              <div className="absolute inset-[2px] bg-white dark:bg-black rounded-sharp-md flex items-center justify-center">
                <Image 
                  src="/globe.svg" 
                  width={20} 
                  height={20} 
                  alt="OpenOcean Globe" 
                  className="text-ocean-600 dark:text-ocean-400"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-base md:text-lg text-black dark:text-white tracking-tight">
                Open<span className="text-ocean-600 dark:text-ocean-400">Ocean</span>
              </span>
              <span className="text-[10px] text-[#6e6e73] dark:text-gray-400 -mt-1 whitespace-nowrap uppercase tracking-wider">
                in collaboration with REEFlect
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {filteredMenuItems.map((item) => {
              return (
                <div key={item.name} className="relative">
                  {item.children ? (
                    <button 
                      onClick={() => toggleDropdown(item.name)}
                      className={cn(
                        "px-3 py-1 text-sm font-medium rounded-sharp-md flex items-center gap-1.5 transition-all duration-200",
                        isActive(item.href) 
                          ? "text-white dark:text-white bg-ocean-600 dark:bg-ocean-600 blob-shape" 
                          : "text-black hover:text-black dark:text-white dark:hover:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] blob-shape-alt"
                      )}
                    >
                      <span className="hidden sm:block" role="img" aria-label={item.emojiLabel}>{item.icon}</span>
                      <span>{item.name}</span>
                      <ChevronDown 
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          openDropdown === item.name ? "rotate-180" : ""
                        )} 
                      />
                    </button>
                  ) : (
                    <Link 
                      href={item.href}
                      className={cn(
                        "px-3 py-1 text-sm font-medium rounded-sharp-md flex items-center gap-1.5 transition-all duration-200",
                        isActive(item.href) 
                          ? "text-white dark:text-white bg-ocean-600 dark:bg-ocean-600 blob-shape" 
                          : "text-black hover:text-black dark:text-white dark:hover:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] blob-shape-alt"
                      )}
                    >
                      <span className="hidden sm:block" role="img" aria-label={item.emojiLabel}>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                  
                  <AnimatePresence>
                    {item.children && openDropdown === item.name && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-1 bg-white dark:bg-[#1c1c1e] shadow-sharp-md rounded-sharp-md py-1 w-48 border border-border hand-drawn-box"
                      >
                        {item.children.map((child) => (
                          <Link 
                            key={child.name} 
                            href={child.href}
                            className={cn(
                              "block px-3 py-1.5 text-sm transition-colors",
                              pathname === child.href
                                ? "text-ocean-600 dark:text-ocean-400 bg-[#f2f2f7] dark:bg-[#2c2c2e] wavy-text"
                                : "text-black hover:text-black dark:text-white dark:hover:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e]"
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
            
            <div className="h-6 border-l border-gray-300 dark:border-gray-700 mx-1" />
            
            <button className="p-1.5 text-black hover:text-black dark:text-white dark:hover:text-white rounded-sharp-md hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors blob-shape" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            
            <ThemeSwitcher />
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeSwitcher />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-black hover:text-black dark:text-white dark:hover:text-white rounded-sharp-md hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors z-20 blob-shape"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 bg-white/95 dark:bg-black/95 backdrop-blur-lg shadow-sharp md:hidden overflow-hidden z-40 border-b border-border hand-drawn-box"
          >
            <nav className="container mx-auto px-4 py-4 max-h-[70vh] overflow-y-auto pb-16">
              <div className="space-y-0.5">
                {filteredMenuItems.map((item) => {
                  return (
                    <Fragment key={item.name}>
                      {item.children ? (
                        <div className="border-b border-border pb-1 mb-1">
                          <button 
                            onClick={() => toggleDropdown(item.name)}
                            className="flex items-center justify-between w-full py-2 px-3 rounded-sharp-md"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-ocean-600 dark:text-ocean-400" role="img" aria-label={item.emojiLabel}>{item.icon}</span>
                              <span className={cn(
                                "text-sm font-medium uppercase tracking-wide",
                                isActive(item.href) ? "text-ocean-600 dark:text-ocean-400 wavy-text" : "text-black dark:text-white"
                              )}>
                                {item.name}
                              </span>
                            </div>
                            <ChevronDown 
                              className={cn(
                                "h-4 w-4 text-gray-500 transition-transform duration-200",
                                openDropdown === item.name ? "rotate-180" : ""
                              )} 
                            />
                          </button>
                          
                          <AnimatePresence>
                            {openDropdown === item.name && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-1 pl-9 border-l-2 border-ocean-100 dark:border-ocean-900/50 ml-3 space-y-1"
                              >
                                {item.children.map((child) => (
                                  <Link 
                                    key={child.name} 
                                    href={child.href}
                                    className={cn(
                                      "block py-1.5 text-sm font-medium transition-colors",
                                      pathname === child.href
                                        ? "text-ocean-600 dark:text-ocean-400 organic-underline"
                                        : "text-black dark:text-white hover:text-ocean-600 dark:hover:text-ocean-400"
                                    )}
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link 
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 py-2 px-3 text-sm font-medium uppercase tracking-wide border-b border-border pb-1 mb-1 rounded-sharp-md",
                            isActive(item.href) 
                              ? "text-ocean-600 dark:text-ocean-400 wavy-text" 
                              : "text-black dark:text-white"
                          )}
                        >
                          <span className="text-ocean-600 dark:text-ocean-400" role="img" aria-label={item.emojiLabel}>{item.icon}</span>
                          {item.name}
                        </Link>
                      )}
                    </Fragment>
                  )
                })}
              </div>
              
              <div className="pt-3 mt-3">
                <div className="bg-[#f2f2f7] dark:bg-[#2c2c2e] p-2 rounded-sharp-md flex items-center blob-shape">
                  <Search className="h-4 w-4 text-[#6e6e73] dark:text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-transparent border-none outline-none text-black dark:text-white w-full text-sm"
                  />
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
} 