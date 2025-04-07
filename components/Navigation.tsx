'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Search, Globe } from 'lucide-react'
import { ThemeSwitcher } from './ThemeSwitcher'
import { cn } from '@/lib/utils'

const MENU_ITEMS = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Map',
    href: '/map',
  },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'Our Mission', href: '/about#mission' },
      { name: 'The Team', href: '/about#team' },
      { name: 'Technology', href: '/about#technology' },
    ]
  },
  {
    name: 'Data',
    href: '/data',
    children: [
      { name: 'Browse Datasets', href: '/data/browse' },
      { name: 'API Access', href: '/data/api' },
      { name: 'Download Options', href: '/data/download' },
    ]
  },
  {
    name: 'Research',
    href: '/research',
  },
]

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const handleDropdownToggle = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(name)
    }
  }
  
  const closeMenu = () => {
    setIsMenuOpen(false)
    setActiveDropdown(null)
  }
  
  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-800" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" onClick={closeMenu}>
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
          <nav className="hidden md:flex items-center space-x-2">
            {MENU_ITEMS.map((item) => (
              <div key={item.name} className="relative group">
                {item.children ? (
                  <button 
                    onClick={() => handleDropdownToggle(item.name)}
                    className="px-4 py-2 text-sm font-medium rounded-md flex items-center space-x-1.5 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span>{item.name}</span>
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        activeDropdown === item.name ? "rotate-180" : ""
                      )} 
                    />
                  </button>
                ) : (
                  <Link 
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
                
                {/* Dropdown Menu */}
                {item.children && (
                  <div 
                    className={cn(
                      "absolute left-0 mt-1 bg-white dark:bg-gray-900 shadow-lg rounded-md py-1 w-48 border border-gray-200 dark:border-gray-800 transform origin-top-left transition-all duration-200",
                      activeDropdown === item.name
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    )}
                  >
                    {item.children.map((child) => (
                      <Link 
                        key={child.name} 
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={closeMenu}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="h-6 border-l border-gray-300 dark:border-gray-700 mx-2" />
            
            <button className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            <ThemeSwitcher />
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <ThemeSwitcher />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 top-16 bg-white dark:bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="h-full overflow-y-auto pb-24">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {MENU_ITEMS.map((item) => (
              <div key={item.name} className="py-1">
                {item.children ? (
                  <div>
                    <button 
                      onClick={() => handleDropdownToggle(item.name)}
                      className="flex items-center justify-between w-full py-3 border-b border-gray-100 dark:border-gray-800"
                    >
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                      <ChevronDown 
                        className={cn(
                          "h-5 w-5 text-gray-500 transition-transform duration-200",
                          activeDropdown === item.name ? "rotate-180" : ""
                        )} 
                      />
                    </button>
                    
                    {activeDropdown === item.name && (
                      <div className="mt-2 pl-4 ml-2 border-l border-gray-200 dark:border-gray-800 space-y-2 animate-in slide-in-from-top-5 duration-200">
                        {item.children.map((child) => (
                          <Link 
                            key={child.name} 
                            href={child.href}
                            className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-ocean-600 dark:hover:text-ocean-400"
                            onClick={closeMenu}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    href={item.href}
                    className="flex items-center py-3 text-base font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="py-4 mt-4">
              <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="ml-2 flex-1 bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
} 