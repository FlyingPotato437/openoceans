"use client"

import Link from 'next/link'
import { Github, Twitter, Mail, ExternalLink, Database, Heart, MapPin } from 'lucide-react'

const FOOTER_LINKS = [
  {
    title: 'Ocean Data',
    links: [
      { label: 'Buoy Network', href: '/map' },
      { label: 'Data API', href: '/data/api' },
      { label: 'Data Downloads', href: '/data/download' },
      { label: 'Historical Records', href: '/data/historical' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Research Papers', href: '/research' },
      { label: 'Developer API', href: '/api' },
      { label: 'Data Visualization', href: '/visualization' },
    ]
  },
  {
    title: 'About Us',
    links: [
      { label: 'Mission', href: '/about#mission' },
      { label: 'Team', href: '/about#team' },
      { label: 'Partners', href: '/about#partners' },
      { label: 'Contact', href: '/about#contact' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Data License', href: '/license' },
      { label: 'Open Source', href: '/opensource' },
    ]
  },
]

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Branding & Mission */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-r from-ocean-400 to-seagrass-400 rounded-full opacity-80 dark:opacity-90" />
                <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-ocean-600 dark:text-ocean-400 font-bold text-sm">OO</span>
                </div>
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-white">
                  Open<span className="text-ocean-600 dark:text-ocean-400">Ocean</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ocean Monitoring Initiative</p>
              </div>
            </div>
            
            <p className="mt-6 text-gray-600 dark:text-gray-300 max-w-md">
              Making ocean data accessible to everyone. We are committed to monitoring and preserving our oceans through open data, research, and community collaboration.
            </p>
            
            <div className="mt-6 flex items-center gap-4">
              <a 
                href="https://github.com/openocean" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/openocean" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:info@openocean.org" 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading font-medium text-sm uppercase tracking-wider text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-ocean-600 dark:hover:text-ocean-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} OpenOcean Initiative. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-y-2 gap-x-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-ocean-600 dark:hover:text-ocean-400 flex items-center gap-1.5 transition-colors">
              <MapPin className="h-4 w-4" />
              <span>Global Buoy Network</span>
            </a>
            <a href="#" className="hover:text-ocean-600 dark:hover:text-ocean-400 flex items-center gap-1.5 transition-colors">
              <Database className="h-4 w-4" />
              <span>Open Data Initiative</span>
            </a>
            <a href="#" className="hover:text-ocean-600 dark:hover:text-ocean-400 flex items-center gap-1.5 transition-colors">
              <Heart className="h-4 w-4" />
              <span>Support Our Work</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 