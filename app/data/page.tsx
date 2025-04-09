'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Database, Download, ChevronRight, FileJson, Server, BarChart3, ArrowDownToLine } from 'lucide-react'

export default function DataPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-br from-ocean-50 via-ocean-100 to-ocean-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Ocean <span className="text-ocean-600 dark:text-ocean-400">Data</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-ocean-100 dark:bg-ocean-900 relative">
                  <Database className="absolute inset-0 m-auto h-16 w-16 text-ocean-600 dark:text-ocean-400" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Browse Datasets</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Explore our comprehensive collection of ocean monitoring data gathered from our global network.
                  </p>
                  <div className="flex items-center text-ocean-600 dark:text-ocean-400 font-medium">
                    <span>Browse now</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/data/api" 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-ocean-100 dark:bg-ocean-900 relative">
                  <FileJson className="absolute inset-0 m-auto h-16 w-16 text-ocean-600 dark:text-ocean-400" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">API Access</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Integrate our ocean data directly into your applications with our comprehensive REST API.
                  </p>
                  <div className="flex items-center text-ocean-600 dark:text-ocean-400 font-medium">
                    <span>View documentation</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/data/download" 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-ocean-100 dark:bg-ocean-900 relative">
                  <Download className="absolute inset-0 m-auto h-16 w-16 text-ocean-600 dark:text-ocean-400" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Download Options</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Download complete datasets in various formats for offline analysis and research.
                  </p>
                  <div className="flex items-center text-ocean-600 dark:text-ocean-400 font-medium">
                    <span>Get data</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-10">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900 text-ocean-600 dark:text-ocean-400 text-sm font-medium mb-4">
                    <Server className="w-4 h-4 mr-2" />
                    REEFlect Partnership
                  </div>
                  
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                    Enhanced Coral Reef Monitoring Data
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Through our collaboration with REEFlect, we offer specialized coral reef monitoring datasets with enhanced metrics for reef health assessment, coral bleaching prediction, and ecosystem analysis.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-1 mr-3 mt-0.5">
                        <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Coral bleaching risk analysis</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-1 mr-3 mt-0.5">
                        <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Reef biodiversity metrics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-1 mr-3 mt-0.5">
                        <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">High-resolution temperature anomaly detection</span>
                    </li>
                  </ul>
                  
                  <Link 
                    href="/data/browse?category=reef" 
                    className="inline-flex items-center px-5 py-2.5 rounded-lg border border-ocean-600 dark:border-ocean-400 text-ocean-600 dark:text-ocean-400 hover:bg-ocean-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    <span>Explore REEFlect Data</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
                
                <div className="bg-ocean-600 dark:bg-ocean-900 relative hidden md:block">
                  <div className="absolute inset-0">
                    <Image 
                      src="/images/coral-data.jpg" 
                      alt="Coral reef data visualization"
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
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                Latest Data Updates
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                      <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Updated 2 days ago</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Temperature Dataset</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Global sea temperature readings from our network of buoys, including anomaly detection.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">24.5 MB</span>
                    <Link href="/data/download?dataset=temperature" className="text-ocean-600 dark:text-ocean-400 inline-flex items-center text-sm font-medium">
                      <ArrowDownToLine className="h-3.5 w-3.5 mr-1" />
                      <span>Download</span>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                      <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Updated 2 days ago</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">pH Levels Dataset</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Ocean acidity (pH) readings from monitoring stations, with time-series trends.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">15.3 MB</span>
                    <Link href="/data/download?dataset=ph" className="text-ocean-600 dark:text-ocean-400 inline-flex items-center text-sm font-medium">
                      <ArrowDownToLine className="h-3.5 w-3.5 mr-1" />
                      <span>Download</span>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                      <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Updated 3 days ago</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">REEFlect Coral Dataset</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Specialized coral reef monitoring data from REEFlect sensors with bleaching risk analysis.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">18.7 MB</span>
                    <Link href="/data/download?dataset=reef" className="text-ocean-600 dark:text-ocean-400 inline-flex items-center text-sm font-medium">
                      <ArrowDownToLine className="h-3.5 w-3.5 mr-1" />
                      <span>Download</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 