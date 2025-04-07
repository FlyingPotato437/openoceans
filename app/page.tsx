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
        ref={heroRef}
        className="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-white to-teal-50 dark:from-gray-900 dark:to-teal-950/30 flex items-center"
      >
        <div className="container mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 py-16">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Open Ocean Data
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">For a Sustainable Future</span>
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                  Access comprehensive ocean monitoring data from our global network of REEFlect smart buoys. 
                  Free to download, analyze, and use for research, education, and conservation.
                </p>
                <div className="flex flex-wrap gap-4 mb-12">
                  <a
                    href="#explore-map"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Globe2 className="h-5 w-5" />
                    <span>Explore Map</span>
                  </a>
                  <a
                    href="#download-data"
                    className="bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 border border-teal-600 dark:border-teal-500 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Data</span>
                  </a>
                </div>
                
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Database className="h-8 w-8 text-teal-500 dark:text-teal-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Data Points</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">12.8M+</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Globe2 className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Buoys Deployed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">128</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Research Partners</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">43</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative h-[500px] lg:h-[700px]">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square">
                  <Globe />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Wave Effect at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-teal-500/10 backdrop-blur-sm"></div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              We believe that open ocean data is essential for addressing climate change, 
              protecting marine ecosystems, and fostering scientific collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-teal-50 dark:bg-gray-800 p-6 rounded-xl border border-teal-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Open Access</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All data collected by our buoys is freely available under open-source licenses for research, education, and innovation.
              </p>
            </div>
            
            <div className="bg-teal-50 dark:bg-gray-800 p-6 rounded-xl border border-teal-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Global Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We partner with researchers, organizations, and citizen scientists worldwide to expand our monitoring network.
              </p>
            </div>
            
            <div className="bg-teal-50 dark:bg-gray-800 p-6 rounded-xl border border-teal-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Climate Action</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our data helps identify ocean changes, enabling timely interventions to protect endangered marine ecosystems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map and Buoys Section */}
      <section id="explore-map" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Global Buoy Network</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore our network of smart buoys deployed across key marine ecosystems, collecting vital data on ocean health 24/7.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe2 className="h-5 w-5 text-teal-500" />
                  <span>Interactive Map</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Click on a buoy marker to view detailed real-time data.</p>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <MapComponent buoys={BUOY_DATA} onBuoySelect={handleBuoySelect} />
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md h-full">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-teal-500" />
                  <span>Featured Buoys</span>
                </h3>
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                  {BUOY_DATA.slice(0, 4).map((buoy) => (
                    <div 
                      key={buoy.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-300 dark:hover:border-teal-700 transition-colors cursor-pointer"
                      onClick={() => handleBuoySelect(buoy)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{buoy.name}</h4>
                        <span className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                          Live
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">ID: {buoy.id}</p>
                      <div className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span>{buoy.data.temperature}°C</span>
                        <span className="mx-2">|</span>
                        <Droplet className="h-4 w-4 text-blue-500" />
                        <span>{buoy.data.salinity} PSU</span>
                      </div>
                    </div>
                  ))}
                  <button 
                    className="w-full py-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center justify-center gap-1"
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
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Download Ocean Data</h2>
          
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow">
              <span className="text-sm font-medium">Format:</span>
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
            {DATASETS.map((dataset) => (
              <div key={dataset.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      {dataset.icon}
                    </div>
                    <h3 className="text-xl font-bold">{dataset.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{dataset.description}</p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <span>{dataset.size}</span>
                    <span>Last updated: {dataset.lastUpdated}</span>
                  </div>
                  <button 
                    onClick={() => handleDownload(dataset.id)}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition flex items-center justify-center"
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
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Key Parameters We Monitor</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our smart buoys continuously monitor these critical ocean health indicators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <Thermometer className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Temperature Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track ocean temperature changes to identify potential coral bleaching events and thermal stress.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <Waves className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">pH & Acidification</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor ocean acidification levels to understand impacts on coral calcification and marine life.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <Droplet className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Salinity Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track salinity levels which affect coral growth, reproduction, and overall reef ecosystem health.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <Beaker className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Dissolved Oxygen</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Measure oxygen levels to assess water quality and identify potential dead zones affecting marine life.
              </p>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl shadow-lg overflow-hidden text-white">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">API Access</h3>
                <p className="mb-6 opacity-90">
                  For real-time data integration, use our comprehensive REST API with documentation and sample code.
                </p>
                <div className="bg-white/10 p-4 rounded-lg mb-6 font-mono text-sm overflow-x-auto">
                  <code>curl -X GET https://api.reeflect.org/v1/buoys/B001/data \<br />
                  -H "Authorization: Bearer YOUR_API_KEY"</code>
                </div>
                <Link 
                  href="/api" 
                  className="inline-flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <Atom className="h-4 w-4" />
                  <span>View API Docs</span>
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden text-white">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Join Our Network</h3>
                <p className="mb-6 opacity-90">
                  Become a data contributor or research partner and help expand our global monitoring capabilities.
                </p>
                <ul className="mb-6 space-y-2 opacity-90">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-400"></div>
                    <span>Access to premium data visualization tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-400"></div>
                    <span>Collaborative research opportunities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-400"></div>
                    <span>Technical support for buoy deployment</span>
                  </li>
                </ul>
                <Link 
                  href="/partners" 
                  className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Become a Partner</span>
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
