'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Database, Download, ChevronRight, FileJson, Server, BarChart3, ArrowDownToLine } from 'lucide-react'

export default function DataPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-br from-ocean-50 via-ocean-100 to-ocean-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="annotation -rotate-2 mb-3 opacity-80 text-ocean-600 dark:text-ocean-400 text-sm font-handwritten">
              Comprehensive ocean metrics
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4 font-serif">
              Ocean <span className="font-serif italic text-ocean-600 dark:text-ocean-400 relative">
                Data
                <span className="absolute bottom-1 left-0 w-full h-2 bg-ocean-400/30 dark:bg-ocean-600/30 -z-10 translate-y-2 rotate-1 blob-shape"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed font-handwritten">
              Access and analyze comprehensive ocean monitoring data collected by OpenOcean and REEFlect buoys
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link 
                href="/data/browse" 
                className="bg-white dark:bg-gray-800 blob-shape shadow-md hover:transition-all overflow-hidden flex flex-col transform hover:-rotate-1 hover:scale-[1.02] duration-300 hand-drawn-box"
              >
                <div className="h-40 bg-ocean-100 dark:bg-ocean-900 relative">
                  <div className="absolute inset-0 bg-[url('/images/dot-pattern.svg')] opacity-5 mix-blend-overlay"></div>
                  <Database className="absolute inset-0 m-auto h-16 w-16 text-ocean-600 dark:text-ocean-400" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-serif">Browse Datasets</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 font-handwritten">
                    Explore our comprehensive collection of ocean monitoring data gathered from our global network.
                  </p>
                  <div className="flex items-center text-ocean-600 dark:text-ocean-400 text-lg font-serif">
                    <span>Browse now</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/data/api" 
                className="bg-white dark:bg-gray-800 blob-shape-alt shadow-md hover:transition-all overflow-hidden flex flex-col transform hover:rotate-1 hover:scale-[1.02] duration-300 hand-drawn-box"
              >
                <div className="h-40 bg-ocean-100 dark:bg-ocean-900 relative">
                  <div className="absolute inset-0 bg-[url('/images/dot-pattern.svg')] opacity-5 mix-blend-overlay"></div>
                  <FileJson className="absolute inset-0 m-auto h-16 w-16 text-ocean-600 dark:text-ocean-400" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-serif">API Access</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 font-handwritten">
                    Integrate our ocean data directly into your applications with our comprehensive REST API.
                  </p>
                  <div className="flex items-center text-ocean-600 dark:text-ocean-400 text-lg font-serif">
                    <span>View documentation</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/data/download" 
                className="bg-white dark:bg-gray-800 blob-shape shadow-md hover:transition-all overflow-hidden flex flex-col transform hover:-rotate-1 hover:scale-[1.02] duration-300 hand-drawn-box"
              >
                <div className="h-40 bg-ocean-100 dark:bg-ocean-900 relative">
                  <div className="absolute inset-0 bg-[url('/images/dot-pattern.svg')] opacity-5 mix-blend-overlay"></div>
                  <Download className="absolute inset-0 m-auto h-16 w-16 text-ocean-600 dark:text-ocean-400" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-serif">Download Options</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 font-handwritten">
                    Download complete datasets in various formats for offline analysis and research.
                  </p>
                  <div className="flex items-center text-ocean-600 dark:text-ocean-400 text-lg font-serif">
                    <span>Get data</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden hand-drawn-box">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-10">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900 text-ocean-600 dark:text-ocean-400 text-sm font-medium mb-4 transform -rotate-1 font-handwritten">
                    <Server className="w-4 h-4 mr-2" />
                    REEFlect Partnership
                  </div>
                  
                  <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4 brush-bg inline-block">
                    Enhanced Coral Reef Monitoring Data
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed font-handwritten">
                    Through our collaboration with <span className="text-ocean-600 dark:text-ocean-400 wavy-text font-cursive">REEFlect</span>, we offer specialized coral reef monitoring datasets with enhanced metrics for reef health assessment, coral bleaching prediction, and ecosystem analysis.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-1 mr-3 mt-0.5 doodle-border">
                        <span role="img" aria-label="Check" className="text-green-600 dark:text-green-400">✅</span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 wavy-text font-handwritten">Coral bleaching risk analysis</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-1 mr-3 mt-0.5 doodle-border">
                        <span role="img" aria-label="Check" className="text-green-600 dark:text-green-400">✅</span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 wavy-text font-handwritten">Reef biodiversity metrics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-1 mr-3 mt-0.5 doodle-border">
                        <span role="img" aria-label="Check" className="text-green-600 dark:text-green-400">✅</span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 wavy-text font-handwritten">High-resolution temperature anomaly detection</span>
                    </li>
                  </ul>
                  
                  <Link 
                    href="/data/browse?category=reef" 
                    className="inline-flex items-center px-5 py-2.5 rounded-lg border border-ocean-600 dark:border-ocean-400 text-ocean-600 dark:text-ocean-400 hover:bg-ocean-50 dark:hover:bg-gray-700 transition-colors font-medium text-lg blob-shape font-serif"
                  >
                    <span>Explore REEFlect Data</span>
                    <span className="ml-2" role="img" aria-label="Right">➡️</span>
                  </Link>
                </div>
                
                <div className="bg-ocean-600 dark:bg-ocean-900 relative hidden md:block">
                  <div className="absolute inset-0">
                    <Image 
                      src="/images/coral-reef.jpg" 
                      alt="High-resolution photo of a coral reef ecosystem, public domain or licensed for educational use"
                      fill
                      style={{ objectFit: 'cover' }}
                      className="mix-blend-overlay opacity-50"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <Image 
                        src="/images/reeflect-logo.svg" 
                        alt="REEFlect Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6 brush-bg inline-block">
                Latest Data Updates
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    id: 'temperature',
                    name: 'Global Temperature Array',
                    description: 'Continuous sea temperature profiles, including deep ocean and surface layers.',
                    size: '~22.7 MB',
                    updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
                  },
                  {
                    id: 'reef',
                    name: 'Coral Ecosystem Monitoring',
                    description: 'Integrated multi-parameter data from vital coral reef locations globally.',
                    size: '~25.1 MB',
                    updated: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
                  }
                ].map(dataset => (
                  <div key={dataset.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hand-drawn-box">
                    <div className="flex justify-between items-start mb-4">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 doodle-border">
                        <span role="img" aria-label="Chart" className="text-blue-600 dark:text-blue-400">📊</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">Updated {dataset.updated}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-serif">{dataset.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-handwritten">
                      {dataset.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{dataset.size}</span>
                      <Link href={`/data/download?dataset=${dataset.id}`} className="text-ocean-600 dark:text-ocean-400 inline-flex items-center text-sm font-medium blob-shape-alt px-2 py-1 font-serif">
                        <ArrowDownToLine className="w-3 h-3 mr-1" />
                        <span>Download</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 