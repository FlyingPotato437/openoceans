'use client'

import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Search, Moon, Sun, Thermometer, Waves, Droplet, Database, BookOpen, Info, MapPin, Globe2 } from 'lucide-react'
import { ThemeSwitcher } from './ThemeSwitcher'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const MENU_ITEMS = [
  {
    name: 'Home',
    href: '/',
    icon: <Globe2 className="w-4 h-4" />
  },
  {
    name: 'Map',
    href: '/map',
    icon: <MapPin className="w-4 h-4" />
  },
  {
    name: 'About',
    href: '/about',
    icon: <Info className="w-4 h-4" />,
    children: [
      { name: 'Our Mission', href: '/about#mission' },
      { name: 'The Team', href: '/about#team' },
      { name: 'Technology', href: '/about#technology' },
    ]
  },
  {
    name: 'Data',
    href: '/data',
    icon: <Database className="w-4 h-4" />,
    children: [
      { name: 'Browse Datasets', href: '/data/browse' },
      { name: 'API Access', href: '/data/api' },
      { name: 'Download Options', href: '/data/download' },
    ]
  },
  {
    name: 'Research',
    href: '/research',
    icon: <BookOpen className="w-4 h-4" />
  },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { isResearchAuthorized } = useAuth()
  
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
  
  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm shadow-md border-b border-gray-200 dark:border-gray-800" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 z-10" onClick={() => setIsOpen(false)}>
            <div className="relative w-9 h-9 md:w-10 md:h-10 overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-ocean-500 to-teal-500 animate-pulse [animation-duration:4s]"></div>
              <div className="absolute inset-[2px] bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                <Image 
                  src="/globe.svg" 
                  width={24} 
                  height={24} 
                  alt="OpenOcean Globe" 
                  className="text-ocean-600 dark:text-ocean-400"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg md:text-xl text-gray-900 dark:text-white">
                Open<span className="text-ocean-600 dark:text-ocean-400">Ocean</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1 whitespace-nowrap">
                in collaboration with REEFlect
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {MENU_ITEMS.map((item) => {
              if (item.name === 'Research' && !isResearchAuthorized) {
                return null;
              }
              
              return (
                <div key={item.name} className="relative">
                  {item.children ? (
                    <button 
                      onClick={() => toggleDropdown(item.name)}
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors",
                        isActive(item.href) 
                          ? "text-ocean-700 dark:text-ocean-400 bg-ocean-50 dark:bg-ocean-900/40" 
                          : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <span className="hidden sm:block">{item.icon}</span>
                      <span>{item.name}</span>
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          openDropdown === item.name ? "rotate-180" : ""
                        )} 
                      />
                    </button>
                  ) : (
                    <Link 
                      href={item.href}
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors",
                        isActive(item.href) 
                          ? "text-ocean-700 dark:text-ocean-400 bg-ocean-50 dark:bg-ocean-900/40" 
                          : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <span className="hidden sm:block">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                  
                  <AnimatePresence>
                    {item.children && openDropdown === item.name && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-1 bg-white dark:bg-gray-900 shadow-lg rounded-lg py-1 w-48 border border-gray-200 dark:border-gray-800"
                      >
                        {item.children.map((child) => (
                          <Link 
                            key={child.name} 
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 text-sm transition-colors",
                              pathname === child.href
                                ? "text-ocean-600 dark:text-ocean-400 bg-ocean-50 dark:bg-ocean-900/30"
                                : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
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
            
            <button className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            
            <ThemeSwitcher />
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeSwitcher />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-20"
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
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 bg-white dark:bg-gray-900 shadow-lg md:hidden overflow-hidden z-40 border-b border-gray-200 dark:border-gray-700"
          >
            <nav className="container mx-auto px-4 py-4 max-h-[70vh] overflow-y-auto pb-20">
              <div className="space-y-2">
                {MENU_ITEMS.map((item) => {
                  if (item.name === 'Research' && !isResearchAuthorized) {
                    return null;
                  }
                  
                  return (
                    <Fragment key={item.name}>
                      {item.children ? (
                        <div className="border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
                          <button 
                            onClick={() => toggleDropdown(item.name)}
                            className="flex items-center justify-between w-full py-3 px-2 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-ocean-600 dark:text-ocean-400">{item.icon}</span>
                              <span className={cn(
                                "text-base font-medium",
                                isActive(item.href) ? "text-ocean-700 dark:text-ocean-400" : "text-gray-900 dark:text-white"
                              )}>
                                {item.name}
                              </span>
                            </div>
                            <ChevronDown 
                              className={cn(
                                "h-5 w-5 text-gray-500 transition-transform duration-200",
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
                                className="mt-1 pl-10 border-l-2 border-ocean-100 dark:border-ocean-900/50 ml-3 space-y-2"
                              >
                                {item.children.map((child) => (
                                  <Link 
                                    key={child.name} 
                                    href={child.href}
                                    className={cn(
                                      "block py-2 text-sm font-medium transition-colors",
                                      pathname === child.href
                                        ? "text-ocean-600 dark:text-ocean-400"
                                        : "text-gray-700 dark:text-gray-300 hover:text-ocean-600 dark:hover:text-ocean-400"
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
                            "flex items-center gap-3 py-3 px-2 text-base font-medium border-b border-gray-100 dark:border-gray-800 pb-2 mb-2 rounded-lg",
                            isActive(item.href) 
                              ? "text-ocean-700 dark:text-ocean-400" 
                              : "text-gray-900 dark:text-white"
                          )}
                        >
                          <span className="text-ocean-600 dark:text-ocean-400">{item.icon}</span>
                          {item.name}
                        </Link>
                      )}
                    </Fragment>
                  )
                })}
              </div>
              
              <div className="pt-4 mt-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center">
                  <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 w-full"
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