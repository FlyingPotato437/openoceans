'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Beaker, 
  Thermometer, 
  Waves, 
  Droplet, 
  Download, 
  ArrowDownToLine, 
  Share2, 
  Database, 
  FileJson, 
  FileSpreadsheet, 
  Atom, 
  Globe2, 
  Users, 
  AlertCircle,
  Info,
  ArrowRight
} from 'lucide-react'
import { BuoyCard } from '@/components/ui/BuoyCard'
import BuoyDetailPanel from '@/components/BuoyDetailPanel'
import { Globe } from '@/components/ui/globe'
import { downloadData } from '@/lib/download'

// Dynamically import the MiniMap component to avoid SSR issues with Leaflet
const MiniMap = dynamic(() => import('@/components/MiniMap'), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
    </div>
  ),
})

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">
      <p className="text-lg text-gray-500 dark:text-gray-400">Loading map...</p>
    </div>
  ),
})

// Sample buoy data
const BUOY_DATA = [
  {
    id: 'B001',
    name: 'Pacific Northwest Buoy',
    location: {
      lat: 45.5155,
      lng: -122.6789,
    },
    type: 'oceanographic',
    data: {
      temperature: 18.5,
      salinity: 35.1,
      ph: 8.1,
      dissolved_oxygen: 7.2,
    },
  },
  {
    id: 'B002',
    name: 'Great Barrier Reef Buoy',
    location: {
      lat: -16.9203,
      lng: 145.7710,
    },
    type: 'oceanographic',
    data: {
      temperature: 25.3,
      salinity: 35.6,
      ph: 8.2,
      dissolved_oxygen: 6.8,
    },
  },
  {
    id: 'B003',
    name: 'Mediterranean Buoy',
    location: {
      lat: 37.5024,
      lng: 15.0931,
    },
    type: 'oceanographic',
    data: {
      temperature: 22.1,
      salinity: 38.2,
      ph: 8.0,
      dissolved_oxygen: 6.5,
    },
  },
  {
    id: 'B004',
    name: 'Caribbean Buoy',
    location: {
      lat: 18.2208,
      lng: -66.5901,
    },
    type: 'oceanographic',
    data: {
      temperature: 27.8,
      salinity: 36.0,
      ph: 8.1,
      dissolved_oxygen: 6.7,
    },
  },
  {
    id: 'B005',
    name: 'South China Sea Buoy',
    location: {
      lat: 10.7500,
      lng: 115.8000,
    },
    type: 'oceanographic',
    data: {
      temperature: 29.2,
      salinity: 34.5,
      ph: 8.0,
      dissolved_oxygen: 6.3,
    },
  },
  {
    id: 'B006',
    name: 'Red Sea Buoy',
    location: {
      lat: 27.9654,
      lng: 34.5733,
    },
    type: 'oceanographic',
    data: {
      temperature: 26.5,
      salinity: 40.1,
      ph: 8.2,
      dissolved_oxygen: 6.0,
    },
  },
]

// Updated DATASETS with remaining entries
const DATASETS = [
  {
    id: 'temperature',
    name: 'Temperature Data',
    description: 'Sea surface temperature readings from our network of ocean buoys.',
    size: '24.5 MB',
    format: 'csv, json, excel',
    lastUpdated: '2023-11-28',
    icon: <Thermometer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
  },
  { 
    id: 'salinity',
    name: 'Salinity Data',
    description: 'Ocean salinity measurements from our global buoy network.',
    size: '18.7 MB',
    format: 'csv, json, excel',
    lastUpdated: '2023-11-28',
    icon: <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
  },
  {
    id: 'ph',
    name: 'pH Levels',
    description: 'Ocean acidity (pH) readings from our monitoring stations.',
    size: '15.3 MB',
    format: 'csv, json, excel',
    lastUpdated: '2023-11-27',
    icon: <Beaker className="h-5 w-5 text-blue-600 dark:text-blue-400" />
  },
  {
    id: 'dissolved_oxygen',
    name: 'Dissolved Oxygen',
    description: 'Dissolved oxygen concentration measurements from our buoys.',
    size: '22.1 MB',
    format: 'csv, json, excel',
    lastUpdated: '2023-11-27',
    icon: <Waves className="h-5 w-5 text-blue-600 dark:text-blue-400" />
  },
  {
    id: 'complete',
    name: 'Complete Dataset',
    description: 'Full dataset including all parameters from our ocean monitoring network.',
    size: '78.6 MB',
    format: 'csv, json, excel',
    lastUpdated: '2023-11-28',
    icon: <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
  }
]

export default function Home() {
  const [selectedBuoy, setSelectedBuoy] = useState<string | null>(null)
  const [showBuoyDetail, setShowBuoyDetail] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<'csv' | 'json' | 'excel'>('csv')
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroVisible, setHeroVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setHeroVisible(rect.bottom > 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBuoySelect = (buoy: any) => {
    if (!buoy.type) {
      buoy.type = 'oceanographic'
    }
    setSelectedBuoy(buoy.id)
    setShowBuoyDetail(true)
  }

  const handleDownload = (datasetId: string) => {
    const dataUrls: { [key: string]: string } = {
      'temperature': '/data/sample_buoy_data.json',
      'salinity': '/data/sample_buoy_data.json',
      'ph': '/data/sample_buoy_data.json', 
      'dissolved_oxygen': '/data/sample_buoy_data.json',
      'complete': '/data/sample_buoy_data.json'
    }
    
    const url = dataUrls[datasetId]
    if (url) {
      downloadData(url, {
        filename: `reeflect_${datasetId}_data`,
        format: downloadFormat
      })
    } else {
      // In a real app, this would trigger a download from the server
      alert(`Downloading ${datasetId} dataset in ${downloadFormat} format`)
    }
  }

  return (
    <>
      {/* Padding for fixed header */}
      <div className="pt-16"></div>

      {/* Hero Section with Interactive Globe */}
      <section
        id="hero"
        className="min-h-screen relative flex items-center justify-center pt-20 pb-16 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-black dark:via-blue-950/10 dark:to-black overflow-hidden"
      >
        {/* Enhanced background texture and floating elements */}
        <div className="absolute inset-0 bg-[url('/images/noise-pattern.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] right-[5%] w-72 h-72 rounded-full bg-gradient-to-br from-ocean-300/30 to-transparent blur-3xl animate-pulse-slow pointer-events-none"></div>
          <div className="absolute top-[60%] left-[10%] w-52 h-52 rounded-full bg-gradient-to-br from-blue-300/30 to-transparent blur-3xl animate-float pointer-events-none"></div>
          <div className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full bg-gradient-to-tr from-seagrass-300/20 to-transparent blur-3xl animate-float-slow-reverse pointer-events-none"></div>
          
          {/* Enhanced scattered dots with glass morphism */}
          <div className="absolute bottom-[10%] left-[20%] w-8 h-8 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md shadow-lg animate-float-slow pointer-events-none"></div>
          <div className="absolute top-[15%] left-[30%] w-4 h-4 rounded-full bg-white/50 dark:bg-white/15 backdrop-blur-md shadow-lg animate-float-slow-reverse pointer-events-none"></div>
          <div className="absolute top-[35%] right-[25%] w-5 h-5 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md shadow-lg animate-float-medium pointer-events-none"></div>
          <div className="absolute top-[25%] left-[15%] w-6 h-6 rounded-full bg-blue-300/40 dark:bg-blue-500/15 backdrop-blur-md shadow-lg animate-float-medium-reverse pointer-events-none"></div>
          <div className="absolute bottom-[35%] right-[10%] w-9 h-9 rounded-full bg-seagrass-300/30 dark:bg-seagrass-500/15 backdrop-blur-md shadow-lg animate-float-slow pointer-events-none"></div>
          
          {/* Enhanced wave lines with gradients */}
          <div className="absolute top-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-ocean-400/30 to-transparent animate-pulse-slow"></div>
          <div className="absolute top-[70%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse-slow animation-delay-500"></div>
          <div className="absolute top-[50%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-seagrass-400/20 to-transparent animate-pulse-slow animation-delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 py-16 lg:pr-12 z-20">
              <div className="max-w-2xl relative">
                {/* Enhanced badge with organic shape and handwritten font */}
                <div className="inline-flex items-center px-3 py-1.5 mb-6 bg-gradient-to-r from-ocean-50/80 to-blue-50/80 dark:from-ocean-900/40 dark:to-blue-900/50 border-l-4 border-ocean-600 rounded-lg backdrop-blur-sm relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hand-drawn-box">
                  <div className="absolute inset-0 w-full translate-x-[-100%] group-hover:translate-x-[100%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out"></div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ocean-600 dark:text-ocean-400 mr-2">✨</span>
                  <span className="text-xs font-handwritten uppercase tracking-wider text-ocean-600 dark:text-ocean-400">Version 1.0 Release</span>
                </div>
                
                {/* Enhanced animated title with mixture of fonts */}
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
                  <div className="overflow-hidden">
                    <span className="inline-block animate-slide-up-fade bg-gradient-to-r from-ocean-600 via-blue-500 to-seagrass-500 dark:from-ocean-400 dark:via-blue-400 dark:to-seagrass-400 bg-clip-text text-transparent [text-shadow:0_4px_30px_rgba(0,0,0,0.1)]">
                      Open Ocean Data
                    </span>
                  </div>
                  <div className="overflow-hidden mt-1">
                    <span className="inline-block animate-slide-up-fade animation-delay-100 text-black dark:text-white [text-shadow:0_4px_8px_rgba(0,0,0,0.1)]">
                      For a <span className="relative inline-block font-serif italic">
                        Sustainable
                        <span className="absolute bottom-1 left-0 w-full h-3 bg-ocean-400/40 dark:bg-ocean-600/40 -z-10 translate-y-2 animate-pulse-slow rounded-md skew-x-3"></span>
                      </span> Future
                    </span>
                  </div>
                </h1>
                
                {/* Enhanced animated description with highlighted words and better typography */}
                <div className="overflow-hidden mb-8">
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 animate-slide-up-fade animation-delay-200 leading-relaxed">
                    Access comprehensive ocean monitoring data from our 
                    <span className="relative inline-block px-1">
                      <span className="relative z-10 text-ocean-600 dark:text-ocean-400 font-medium">global network</span>
                      <span className="absolute inset-0 bg-ocean-100 dark:bg-ocean-900/40 rounded-md -z-0 transform -rotate-1"></span>
                    </span>
                    of REEFlect smart buoys.
                    <span className="block mt-3 text-lg md:text-xl opacity-85 wavy-text">
                      Free to download, analyze, and use for 
                      <span className="font-medium text-blue-600 dark:text-blue-400 ml-1">research</span>, 
                      <span className="font-medium text-seagrass-600 dark:text-seagrass-400 mx-1">education</span>, and 
                      <span className="font-medium text-ocean-600 dark:text-ocean-400 ml-1">conservation</span>.
                    </span>
                  </p>
                </div>
                
                {/* Enhanced CTA buttons with organic styling */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 animate-slide-up-fade animation-delay-300">
                  <a 
                    href="/map" 
                    className="px-6 py-3 bg-gradient-to-r from-ocean-600 to-blue-600 hover:from-ocean-700 hover:to-blue-700 text-white rounded-lg transition transform hover:-translate-y-1 flex items-center justify-center shadow-lg"
                  >
                    <Waves className="h-5 w-5 mr-2" />
                    <span>Explore Buoy Network</span>
                  </a>
                  <a 
                    href="/data/download" 
                    className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition transform hover:-translate-y-1 flex items-center justify-center shadow-md text-gray-800 dark:text-gray-200 blob-shape"
                  >
                    <Download className="h-5 w-5 mr-2 text-ocean-600 dark:text-ocean-400" />
                    <span>Download Data</span>
                  </a>
                </div>
                
                {/* Enhanced stats with improved animations, hover effects and glass morphism */}
                <div className="flex items-center gap-8 flex-wrap overflow-hidden">
                  <div className="flex items-center gap-3 animate-slide-up-fade animation-delay-500 transform hover:scale-105 transition-transform duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-ocean-50 dark:from-gray-900 dark:to-ocean-900/30 border border-ocean-100 dark:border-ocean-800/50 flex items-center justify-center group-hover:border-ocean-300 dark:group-hover:border-ocean-600 transition-colors duration-300 backdrop-blur-sm">
                      <Database className="h-5 w-5 text-ocean-600 dark:text-ocean-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Data Points</p>
                      <p className="text-2xl font-bold text-black dark:text-white font-mono group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors duration-300">12.8M+</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 animate-slide-up-fade animation-delay-600 transform hover:scale-105 transition-transform duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-ocean-50 dark:from-gray-900 dark:to-ocean-900/30 border border-ocean-100 dark:border-ocean-800/50 flex items-center justify-center group-hover:border-ocean-300 dark:group-hover:border-ocean-600 transition-colors duration-300 backdrop-blur-sm">
                      <Globe2 className="h-5 w-5 text-ocean-600 dark:text-ocean-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Buoys Deployed</p>
                      <p className="text-2xl font-bold text-black dark:text-white font-mono group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors duration-300">128</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 animate-slide-up-fade animation-delay-700 transform hover:scale-105 transition-transform duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-ocean-50 dark:from-gray-900 dark:to-ocean-900/30 border border-ocean-100 dark:border-ocean-800/50 flex items-center justify-center group-hover:border-ocean-300 dark:group-hover:border-ocean-600 transition-colors duration-300 backdrop-blur-sm">
                      <Users className="h-5 w-5 text-ocean-600 dark:text-ocean-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Research Partners</p>
                      <p className="text-2xl font-bold text-black dark:text-white font-mono group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors duration-300">43</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative h-[320px] md:h-[400px] lg:h-[550px] z-10">
              <div className="absolute inset-0 pointer-events-none animate-fade-in lg:-ml-16">
                {/* Enhanced globe with 3D effects and better animations */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[400px] lg:w-[550px] aspect-square animate-spin-slow drop-shadow-2xl">
                  <Globe />
                </div>
                {/* Enhanced highlight rings around the globe with glass morphism */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[440px] lg:w-[590px] aspect-square rounded-full border-2 border-dashed border-ocean-300/40 dark:border-ocean-700/40 animate-spin-reverse-slower"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[460px] lg:w-[620px] aspect-square rounded-full border border-ocean-200/30 dark:border-ocean-800/30 animate-pulse-slow backdrop-blur-[1px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] md:w-[480px] lg:w-[650px] aspect-square rounded-full border border-seagrass-200/20 dark:border-seagrass-800/20 animate-spin-slower backdrop-blur-[1px]"></div>
                
                {/* Enhanced buoy indicators on the globe with label popups and glow effects */}
                <div className="absolute top-[30%] left-[55%] group">
                  <div className="w-3 h-3 bg-white dark:bg-ocean-400 rounded-full shadow-glow animate-pulse-fast"></div>
                  <div className="absolute top-0 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md text-ocean-600 dark:text-ocean-400 whitespace-nowrap pointer-events-none transform scale-0 group-hover:scale-100 origin-left transition-transform duration-300">
                    Pacific Northwest Buoy
                  </div>
                </div>
                <div className="absolute top-[45%] left-[40%] group">
                  <div className="w-2 h-2 bg-white dark:bg-ocean-400 rounded-full shadow-glow animate-pulse"></div>
                  <div className="absolute top-0 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md text-ocean-600 dark:text-ocean-400 whitespace-nowrap pointer-events-none transform scale-0 group-hover:scale-100 origin-left transition-transform duration-300">
                    Mediterranean Buoy
                  </div>
                </div>
                <div className="absolute top-[60%] left-[48%] group">
                  <div className="w-2.5 h-2.5 bg-white dark:bg-ocean-400 rounded-full shadow-glow animate-pulse-slow"></div>
                  <div className="absolute top-0 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md text-ocean-600 dark:text-ocean-400 whitespace-nowrap pointer-events-none transform scale-0 group-hover:scale-100 origin-left transition-transform duration-300">
                    Great Barrier Reef Buoy
                  </div>
                </div>
                <div className="absolute top-[33%] left-[28%] group">
                  <div className="w-2 h-2 bg-seagrass-400 dark:bg-seagrass-500 rounded-full shadow-glow-green animate-pulse-slow"></div>
                  <div className="absolute top-0 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md text-seagrass-600 dark:text-seagrass-400 whitespace-nowrap pointer-events-none transform scale-0 group-hover:scale-100 origin-left transition-transform duration-300">
                    Caribbean Buoy
                  </div>
                </div>
                <div className="absolute top-[63%] left-[62%] group">
                  <div className="w-2 h-2 bg-seagrass-400 dark:bg-seagrass-500 rounded-full shadow-glow-green animate-pulse-medium"></div>
                  <div className="absolute top-0 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md text-seagrass-600 dark:text-seagrass-400 whitespace-nowrap pointer-events-none transform scale-0 group-hover:scale-100 origin-left transition-transform duration-300">
                    South China Sea Buoy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced scrolling indicator with better animation but no Apple-specific styling */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce-slow">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</div>
          <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center pt-1 group backdrop-blur-sm hover:border-ocean-400 dark:hover:border-ocean-600 transition-colors duration-300">
            <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-scroll-down group-hover:bg-ocean-400 dark:group-hover:bg-ocean-500 transition-colors"></div>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-md bg-ocean-50/80 dark:bg-ocean-900/40 mb-6 backdrop-blur-sm border border-ocean-200 dark:border-ocean-800/30 blob-shape-alt">
              <span className="text-sm font-handwritten text-ocean-600 dark:text-ocean-400 uppercase tracking-wider">Our Mission</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-black dark:text-white mb-4 brush-bg">Making Ocean Data Accessible</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-sf-pro">
              We believe that open ocean data is essential for addressing climate change, 
              protecting marine ecosystems, and fostering scientific collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border-l-3 border-ocean-600 hover:shadow-md transition-shadow duration-300 hand-drawn-box">
              <div className="w-12 h-12 bg-ocean-50/80 dark:bg-ocean-900/40 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner">
                <Database className="h-6 w-6 text-ocean-600 dark:text-ocean-400" />
              </div>
              <h3 className="text-xl font-cursive font-bold text-black dark:text-white mb-2">Open Access</h3>
              <p className="text-gray-700 dark:text-gray-300 font-serif">
                All data collected by our buoys is freely available under open-source licenses for research, education, and innovation.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border-l-3 border-ocean-600 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-ocean-50/80 dark:bg-ocean-900/40 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner">
                <Share2 className="h-6 w-6 text-ocean-600 dark:text-ocean-400" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2 font-sf-display">Global Collaboration</h3>
              <p className="text-gray-700 dark:text-gray-300 font-sf-pro">
                We partner with researchers, organizations, and citizen scientists worldwide to expand our monitoring network.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border-l-3 border-ocean-600 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-ocean-50/80 dark:bg-ocean-900/40 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner">
                <Droplet className="h-6 w-6 text-ocean-600 dark:text-ocean-400" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2 font-sf-display">Data Transparency</h3>
              <p className="text-gray-700 dark:text-gray-300 font-sf-pro">
                Complete documentation of our methodologies, sensor specifications, and data processing for maximum transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map and Buoys Section */}
      <section id="explore-map" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-md bg-ocean-50/80 dark:bg-ocean-900/40 mb-6 backdrop-blur-sm shadow-apple-sm border border-ocean-200 dark:border-ocean-800/30">
              <span className="text-sm font-medium text-ocean-600 dark:text-ocean-400 uppercase tracking-wider font-sf-pro">Explore</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-sf-display">Global Buoy Network</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-sf-pro">
              Explore our network of smart buoys deployed across key marine ecosystems, collecting vital data on ocean health 24/7.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-apple hover:shadow-apple-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 font-sf-display">
                  <Globe2 className="h-5 w-5 text-ocean-500" />
                  <span>Interactive Map</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-sf-pro">Click on a buoy marker to view detailed real-time data.</p>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <MapComponent buoyData={BUOY_DATA} onBuoySelected={handleBuoySelect} />
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-apple hover:shadow-apple-lg transition-shadow duration-300 h-full border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 font-sf-display">
                  <Info className="h-5 w-5 text-ocean-500" />
                  <span>Featured Buoys</span>
                </h3>
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                  {BUOY_DATA.slice(0, 4).map((buoy) => (
                    <div 
                      key={buoy.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-ocean-300 dark:hover:border-ocean-700 transition-colors cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                      onClick={() => handleBuoySelect(buoy)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white font-sf-display">{buoy.name}</h4>
                        <span className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-sf-pro">
                          Live
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-mono">ID: {buoy.id}</p>
                      
                      {/* Add MiniMap for the buoy location */}
                      <div className="mb-3 rounded-lg overflow-hidden shadow-apple-sm">
                        <MiniMap 
                          location={{ lat: buoy.location.lat, lng: buoy.location.lng }}
                          status="active"
                          height="h-32"
                        />
                      </div>
                      
                      <div className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300 font-sf-pro">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span>{buoy.data.temperature}°C</span>
                        <span className="mx-2">|</span>
                        <Droplet className="h-4 w-4 text-blue-500" />
                        <span>{buoy.data.salinity} PSU</span>
                      </div>
                    </div>
                  ))}
                  <button 
                    className="w-full py-2 text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-300 font-medium flex items-center justify-center gap-1 font-sf-pro"
                    onClick={() => document.getElementById('buoy-cards')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span>View All Buoys</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div id="buoy-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUOY_DATA.map((buoy) => (
              <BuoyCard
                key={buoy.id}
                id={buoy.id}
                name={buoy.name}
                location={`${buoy.location.lat.toFixed(2)}, ${buoy.location.lng.toFixed(2)}`}
                temperature={buoy.data.temperature}
                onViewDetails={() => handleBuoySelect(buoy)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Download Data Section */}
      <section id="download-data" className="py-16 bg-gradient-to-b from-ocean-50/50 to-white dark:from-ocean-950/30 dark:to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-md bg-ocean-50/80 dark:bg-ocean-900/40 mb-6 backdrop-blur-sm border border-ocean-200 dark:border-ocean-800/30">
              <span className="text-sm font-medium text-ocean-600 dark:text-ocean-400 uppercase tracking-wider">Data</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-center">Download Ocean Data</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Access comprehensive ocean monitoring datasets in multiple formats for your research and analysis needs.
            </p>
          </div>
          
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 blob-shape">
              <span className="text-sm">Format:</span>
              <select 
                value={downloadFormat} 
                onChange={(e) => setDownloadFormat(e.target.value as 'csv' | 'json' | 'excel')}
                className="bg-transparent text-sm p-1 rounded border border-gray-300 dark:border-gray-700"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="excel">Excel</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DATASETS.map((dataset, index) => (
              <div key={dataset.id} className={`bg-white/90 dark:bg-gray-800/90 rounded-xl hover:shadow-lg transition-shadow duration-300 overflow-hidden backdrop-blur-sm border border-gray-200 dark:border-gray-700 ${index % 3 === 0 ? 'hand-drawn-box' : index % 3 === 1 ? 'blob-shape' : ''}`}>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-ocean-100 dark:bg-ocean-900/40 flex items-center justify-center mr-3 shadow-inner">
                      {dataset.icon}
                    </div>
                    <h3 className="text-xl font-bold">{dataset.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{dataset.description}</p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-6 font-mono">
                    <span>{dataset.size}</span>
                    <span>Last updated: {dataset.lastUpdated}</span>
                  </div>
                  <button 
                    onClick={() => handleDownload(dataset.id)}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-ocean-600 to-blue-600 hover:from-ocean-700 hover:to-blue-700 text-white rounded-xl transition flex items-center justify-center hover:shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download {downloadFormat.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-md bg-ocean-50/80 dark:bg-ocean-900/40 mb-6 backdrop-blur-sm border border-ocean-200 dark:border-ocean-800/30">
              <span className="text-sm font-medium text-ocean-600 dark:text-ocean-400 uppercase tracking-wider">Parameters</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Key Parameters We Monitor</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 organic-underline inline-block">
              Our smart buoys continuously monitor these critical ocean health indicators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:scale-105 transform hand-drawn-box">
              <div className="w-12 h-12 bg-blue-100/80 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Thermometer className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Temperature Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track ocean temperature changes to identify potential coral bleaching events and thermal stress.
              </p>
            </div>
            
            <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:scale-105 transform blob-shape">
              <div className="w-12 h-12 bg-purple-100/80 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Waves className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">pH & Acidification</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor ocean acidification levels to understand impacts on coral calcification and marine life.
              </p>
            </div>
            
            <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:scale-105 transform doodle-border">
              <div className="w-12 h-12 bg-ocean-100/80 dark:bg-ocean-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Droplet className="h-6 w-6 text-ocean-600 dark:text-ocean-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Salinity Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track salinity levels which affect coral growth, reproduction, and overall reef ecosystem health.
              </p>
            </div>
            
            <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:scale-105 transform">
              <div className="w-12 h-12 bg-seagrass-100/80 dark:bg-seagrass-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Beaker className="h-6 w-6 text-seagrass-600 dark:text-seagrass-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Dissolved Oxygen</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Measure oxygen levels to assess water quality and identify potential dead zones affecting marine life.
              </p>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl shadow-apple-lg overflow-hidden text-white backdrop-blur-sm border border-teal-400/20">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 font-sf-display flex items-center gap-2">
                  <Atom className="h-5 w-5" />
                  API Access
                </h3>
                <p className="mb-6 opacity-90 font-sf-pro">
                  For real-time data integration, use our comprehensive REST API with documentation and sample code.
                </p>
                <div className="bg-white/10 p-4 rounded-lg mb-6 font-mono text-sm overflow-x-auto border border-white/20 shadow-inner">
                  <code>curl -X GET https://api.reeflect.org/v1/buoys/B001/data \<br />
                  -H "Authorization: Bearer YOUR_API_KEY"</code>
                </div>
                <Link 
                  href="/api" 
                  className="inline-flex items-center gap-2 bg-white text-teal-600 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Atom className="h-4 w-4" />
                  <span className="font-sf-pro">View API Docs</span>
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-ocean-900 via-gray-900 to-ocean-900/80 rounded-xl shadow-apple-lg overflow-hidden text-white backdrop-blur-sm border border-ocean-700/30">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 font-sf-display flex items-center gap-2">
                  <Users className="h-5 w-5 text-ocean-400" />
                  Join Our Network
                </h3>
                <p className="mb-6 opacity-90 font-sf-pro">
                  Become a data contributor or research partner and help expand our global monitoring capabilities.
                </p>
                <ul className="mb-6 space-y-3 opacity-90 font-sf-pro">
                  <li className="flex items-start gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-ocean-400 mt-1.5"></div>
                    <span>Access to premium data visualization tools</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-ocean-400 mt-1.5"></div>
                    <span>Collaborative research opportunities</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-ocean-400 mt-1.5"></div>
                    <span>Technical support for buoy deployment</span>
                  </li>
                </ul>
                <Link 
                  href="/partners" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-ocean-600 to-blue-600 hover:from-ocean-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Users className="h-4 w-4" />
                  <span className="font-sf-pro">Become a Partner</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Show buoy detail panel when a buoy is selected */}
      {showBuoyDetail && selectedBuoy && (
        <BuoyDetailPanel
          buoy={BUOY_DATA.find(buoy => buoy.id === selectedBuoy) || null}
          onClose={() => setShowBuoyDetail(false)}
        />
      )}
    </>
  )
}
