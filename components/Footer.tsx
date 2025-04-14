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
    <footer className="bg-[#f2f2f7] dark:bg-black border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Branding & Mission */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-r from-ocean-500 to-seagrass-500 rounded-sharp-md opacity-80 dark:opacity-90" />
                <div className="absolute inset-[2px] bg-white dark:bg-black rounded-sharp-md flex items-center justify-center">
                  <span className="text-ocean-600 dark:text-ocean-400 font-medium text-sm">OO</span>
                </div>
              </div>
              <div>
                <h2 className="font-bold text-xl text-black dark:text-white tracking-tight">
                  Open<span className="text-ocean-600 dark:text-ocean-400">Ocean</span>
                </h2>
                <p className="text-[10px] text-[#6e6e73] dark:text-gray-400 uppercase tracking-wider">Ocean Monitoring Initiative</p>
              </div>
            </div>
            
            <p className="mt-5 text-[#424245] dark:text-[#a1a1a6] max-w-md text-sm">
              Making ocean data accessible to everyone. We are committed to monitoring and preserving our oceans through open data, research, and community collaboration.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <a 
                href="https://github.com/openocean" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-gray-900 transition-colors rounded-sharp-md border border-border"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com/openocean" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-gray-900 transition-colors rounded-sharp-md border border-border blob-shape"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="mailto:info@openocean.org" 
                className="p-2 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-gray-900 transition-colors rounded-sharp-md border border-border"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          {FOOTER_LINKS.map((section, index) => (
            <div key={section.title} className="border-l-2 border-border pl-4">
              <h3 className="font-bold text-sm text-black dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-[#424245] dark:text-[#a1a1a6] hover:text-ocean-600 dark:hover:text-ocean-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] mb-4 md:mb-0 uppercase tracking-wider">
            &copy; {new Date().getFullYear()} OpenOcean Initiative. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="inline-flex items-center px-3 py-1 text-xs rounded-sharp-md border border-border bg-white dark:bg-gray-900 text-black dark:text-white hover:border-ocean-600 dark:hover:border-ocean-400 transition-colors hand-drawn-box">
              <MapPin className="h-3 w-3 mr-1.5 text-ocean-600 dark:text-ocean-400" />
              <span>Global Network</span>
            </a>
            <a href="#" className="inline-flex items-center px-3 py-1 text-xs rounded-sharp-md border border-border bg-white dark:bg-gray-900 text-black dark:text-white hover:border-ocean-600 dark:hover:border-ocean-400 transition-colors">
              <Database className="h-3 w-3 mr-1.5 text-ocean-600 dark:text-ocean-400" />
              <span>Open Data</span>
            </a>
            <a href="#" className="inline-flex items-center px-3 py-1 text-xs rounded-sharp-md border border-border bg-white dark:bg-gray-900 text-black dark:text-white hover:border-ocean-600 dark:hover:border-ocean-400 transition-colors blob-shape">
              <Heart className="h-3 w-3 mr-1.5 text-ocean-600 dark:text-ocean-400" />
              <span>Support</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 