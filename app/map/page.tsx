'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Info, MapPin, Filter, List, Grid3X3, ArrowDownToLine, Sparkles, CloudLightning, Waves, LifeBuoy, Anchor, Compass } from 'lucide-react'
import BuoyDetailPanel from '@/components/BuoyDetailPanel'
import Link from 'next/link'

// Define our Buoy type that matches the one in Map.tsx
type BuoyData = {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  status: 'active' | 'warning' | 'offline' | 'maintenance' | 'inactive'
  data?: {
    temperature: number
    salinity: number
    ph: number
    dissolved_oxygen: number
  }
  sensors?: {
    temperature: number
    pH: number
    salinity: number
    turbidity: number
    dissolved_oxygen: number
  }
  type: string
}

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-ocean-50 dark:bg-gray-900">
      <div className="text-ocean-600 dark:text-ocean-400 animate-pulse">Loading map...</div>
    </div>
  )
})

// Enhanced buoy data with more buoys placed in water not land
const BUOY_DATA: BuoyData[] = [
  {
    id: 'B001',
    name: 'North Atlantic Buoy',
    location: {
      lat: 41.2176,
      lng: -37.6273,
    },
    status: 'active',
    data: {
      temperature: 18.5,
      salinity: 35.5,
      ph: 8.1,
      dissolved_oxygen: 7.2,
    },
    type: 'standard',
  },
  {
    id: 'B002',
    name: 'Pacific Northwest Buoy',
    location: {
      lat: 42.1245,
      lng: -128.7382,
    },
    status: 'warning',
    data: {
      temperature: 15.7,
      salinity: 33.8,
      ph: 8.0,
      dissolved_oxygen: 6.9,
    },
    type: 'standard',
  },
  {
    id: 'B003',
    name: 'Mediterranean Buoy',
    location: {
      lat: 37.5024,
      lng: 15.5931,
    },
    status: 'warning',
    data: {
      temperature: 22.1,
      ph: 8.0,
      salinity: 38.2,
      dissolved_oxygen: 6.5,
    },
    type: 'standard',
  },
  {
    id: 'B004',
    name: 'Caribbean Buoy',
    location: {
      lat: 18.2208,
      lng: -66.5901,
    },
    status: 'active',
    data: {
      temperature: 27.8,
      salinity: 36.0,
      ph: 8.1,
      dissolved_oxygen: 6.7,
    },
    type: 'standard',
  },
  {
    id: 'B005',
    name: 'South China Sea Buoy',
    location: {
      lat: 10.7500,
      lng: 115.8000,
    },
    status: 'active',
    data: {
      temperature: 29.2,
      salinity: 34.5,
      ph: 8.0,
      dissolved_oxygen: 6.3,
    },
    type: 'standard',
  },
  {
    id: 'B006',
    name: 'Red Sea Buoy',
    location: {
      lat: 27.9654,
      lng: 34.5733,
    },
    status: 'offline',
    data: {
      temperature: 26.5,
      salinity: 40.1,
      ph: 8.2,
      dissolved_oxygen: 6.0,
    },
    type: 'standard',
  },
  {
    id: 'B007',
    name: 'North Atlantic Buoy',
    location: {
      lat: 42.3601,
      lng: -40.0589,
    },
    status: 'active',
    data: {
      temperature: 15.7,
      salinity: 34.8,
      ph: 8.1,
      dissolved_oxygen: 7.5,
    },
    type: 'standard',
  },
  {
    id: 'B008',
    name: 'South Pacific Buoy',
    location: {
      lat: -15.7781,
      lng: -170.1322,
    },
    status: 'active',
    data: {
      temperature: 27.3,
      salinity: 35.4,
      ph: 8.2,
      dissolved_oxygen: 6.9,
    },
    type: 'standard',
  },
  {
    id: 'B009',
    name: 'Indian Ocean Buoy',
    location: {
      lat: -8.3405,
      lng: 80.5098,
    },
    status: 'active',
    data: {
      temperature: 28.6,
      salinity: 34.9,
      ph: 8.0,
      dissolved_oxygen: 6.4,
    },
    type: 'standard',
  },
  {
    id: 'B010',
    name: 'Gulf of Mexico Buoy',
    location: {
      lat: 25.7617,
      lng: -89.3965,
    },
    status: 'warning',
    data: {
      temperature: 26.2,
      salinity: 36.2,
      ph: 7.9,
      dissolved_oxygen: 6.3,
    },
    type: 'standard',
  },
  {
    id: 'B011',
    name: 'Baltic Sea Buoy',
    location: {
      lat: 58.5953,
      lng: 18.2812,
    },
    status: 'active',
    data: {
      temperature: 14.2,
      salinity: 8.5,
      ph: 8.3,
      dissolved_oxygen: 8.1,
    },
    type: 'standard',
  },
  {
    id: 'B012',
    name: 'South Atlantic Buoy',
    location: {
      lat: -34.6037,
      lng: -18.3814,
    },
    status: 'active',
    data: {
      temperature: 19.1,
      salinity: 35.3,
      ph: 8.1,
      dissolved_oxygen: 7.0,
    },
    type: 'standard',
  },
  {
    id: 'B013',
    name: 'Arctic Ocean Buoy',
    location: {
      lat: 78.9218,
      lng: -3.9875,
    },
    status: 'warning',
    data: {
      temperature: 3.2,
      salinity: 34.2,
      ph: 8.0,
      dissolved_oxygen: 8.7,
    },
    type: 'standard',
  },
  {
    id: 'B014',
    name: 'REEFlect Coral Monitoring Buoy 1',
    location: {
      lat: 24.5551,
      lng: -81.7800,
    },
    status: 'active',
    data: {
      temperature: 26.7,
      salinity: 36.1,
      ph: 8.2,
      dissolved_oxygen: 6.9,
    },
    type: 'reeflect',
  },
  {
    id: 'B015',
    name: 'REEFlect Coral Monitoring Buoy 2',
    location: {
      lat: 16.7406,
      lng: -169.5209,
    },
    status: 'active',
    data: {
      temperature: 27.9,
      salinity: 35.8,
      ph: 8.1,
      dissolved_oxygen: 6.8,
    },
    type: 'reeflect',
  },
]

export default function MapPage() {
  const [selectedBuoy, setSelectedBuoy] = useState<string | null>(null)
  const [showBuoyDetail, setShowBuoyDetail] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'grid'>('map')
  const [filterOpen, setFilterOpen] = useState(false)

  const handleBuoySelect = (buoy: BuoyData) => {
    setSelectedBuoy(buoy.id)
    setShowBuoyDetail(true)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="container mx-auto px-4 md:px-6 py-8 relative">
        <div className="mb-6 relative">
          <div className="annotation text-ocean-600 dark:text-ocean-500 opacity-80 mb-2 transform rotate-1">
            Interactive Explorer
          </div>
          <h1 className="text-3xl md:text-5xl font-serif italic font-bold text-gray-900 dark:text-white brush-bg">
            Ocean Buoy <span className="font-handwritten normal-case text-ocean-600 dark:text-ocean-400 relative">
              Network
              <span className="absolute bottom-1 left-0 w-full h-3 bg-ocean-400/30 dark:bg-ocean-600/30 -z-10 translate-y-2 rotate-1"></span>
            </span>
          </h1>
          <p className="text-lg md:text-xl font-handwritten text-gray-600 dark:text-gray-400 mt-2 organic-underline inline-block">
            Explore our global network of smart monitoring buoys
          </p>
        </div>
        
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 relative">
          <div className="flex items-center gap-2 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm transition-all transform hover:scale-105 ${
                viewMode === 'map'
                  ? 'bg-ocean-600 text-white dark:bg-ocean-600 border border-ocean-500 blob-shape'
                  : 'bg-ocean-100 text-ocean-700 dark:bg-gray-800 dark:text-ocean-300 border border-ocean-200 dark:border-ocean-800 blob-shape-alt'
              } hover:bg-ocean-500 hover:text-white dark:hover:bg-ocean-500`}
            >
              <span className="mr-2" role="img" aria-label="Map Pin">📍</span>
              <span className="relative">
                Map View
              </span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm transition-all transform hover:scale-105 ${
                viewMode === 'list'
                  ? 'bg-ocean-600 text-white dark:bg-ocean-600 border border-ocean-500 blob-shape'
                  : 'bg-ocean-100 text-ocean-700 dark:bg-gray-800 dark:text-ocean-300 border border-ocean-200 dark:border-ocean-800 blob-shape-alt'
              } hover:bg-ocean-500 hover:text-white dark:hover:bg-ocean-500`}
            >
              <span className="mr-2" role="img" aria-label="List">📋</span>
              <span className="relative">
                List View
              </span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm transition-all transform hover:scale-105 ${
                viewMode === 'grid'
                  ? 'bg-ocean-600 text-white dark:bg-ocean-600 border border-ocean-500 blob-shape'
                  : 'bg-ocean-100 text-ocean-700 dark:bg-gray-800 dark:text-ocean-300 border border-ocean-200 dark:border-ocean-800 blob-shape-alt'
              } hover:bg-ocean-500 hover:text-white dark:hover:bg-ocean-500`}
            >
              <span className="mr-2" role="img" aria-label="Grid">🔲</span>
              <span className="relative">
                Grid View
              </span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 rounded-lg p-1">
            <button 
              onClick={() => setFilterOpen(!filterOpen)} 
              className="flex items-center px-4 py-2.5 rounded-lg text-sm bg-white text-ocean-700 dark:bg-gray-800 dark:text-ocean-300 hover:bg-ocean-500 hover:text-white dark:hover:bg-ocean-600 transition-all border border-ocean-200 dark:border-ocean-700 transform hover:scale-105 blob-shape"
            >
              <span className="mr-2" role="img" aria-label="Filter">🔍</span>
              <span className="relative">
                Filter
              </span>
            </button>
            <button 
              className="flex items-center px-4 py-2.5 rounded-lg text-sm bg-white text-ocean-700 dark:bg-gray-800 dark:text-ocean-300 hover:bg-ocean-500 hover:text-white dark:hover:bg-ocean-600 transition-all border border-ocean-200 dark:border-ocean-700 transform hover:scale-105 blob-shape-alt"
            >
              <span className="mr-2" role="img" aria-label="Download">⬇️</span>
              <span>Export</span>
            </button>
            <button 
              onClick={() => setShowInfo(!showInfo)} 
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white text-ocean-700 dark:bg-gray-800 dark:text-ocean-300 hover:bg-ocean-500 hover:text-white dark:hover:bg-ocean-600 transition-all border border-ocean-200 dark:border-ocean-700 transform hover:scale-105 blob-shape"
            >
              <span role="img" aria-label="Information">ℹ️</span>
              <span className="sr-only">Information</span>
            </button>
          </div>
        </div>
        
        {showInfo && (
          <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-ocean-200 dark:border-ocean-700 shadow-md hand-drawn-box">
            <h3 className="text-xl font-serif italic font-semibold text-ocean-800 dark:text-ocean-300 mb-3 flex items-center brush-bg">
              About the Map
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
              This interactive map displays the locations of all OpenOcean monitoring buoys. Each marker represents a buoy, with color indicating its operational status.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Click on a buoy to view its details and latest measurements. You can filter buoys by type, location, or status using the filter controls.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium flex items-center doodle-border">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                Active
              </div>
              <div className="px-3 py-1.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full text-xs font-medium flex items-center doodle-border">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-1.5"></span>
                Warning
              </div>
              <div className="px-3 py-1.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-medium flex items-center doodle-border">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                Offline
              </div>
              <div className="px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium flex items-center doodle-border">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
                Maintenance
              </div>
            </div>
          </div>
        )}
        
        {filterOpen && (
          <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-ocean-200 dark:border-ocean-700 shadow-md hand-drawn-box">
            <h3 className="text-xl font-serif italic font-semibold text-ocean-800 dark:text-ocean-300 mb-4 flex items-center brush-bg">
              <span className="mr-2" role="img" aria-label="Filter">🔍</span>
              Filter Buoys
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 ml-1">
                  Buoy Type
                </label>
                <select className="w-full p-3 rounded-lg border border-ocean-200 dark:border-ocean-800 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-ocean-400/30 focus:border-ocean-400 dark:focus:ring-ocean-600/30 dark:focus:border-ocean-600 transition-all blob-shape">
                  <option value="">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="reeflect">REEFlect™</option>
                  <option value="coastal">Coastal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 ml-1">
                  Region
                </label>
                <select className="w-full p-3 rounded-lg border border-ocean-200 dark:border-ocean-800 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-ocean-400/30 focus:border-ocean-400 dark:focus:ring-ocean-600/30 dark:focus:border-ocean-600 transition-all blob-shape-alt">
                  <option value="">All Regions</option>
                  <option value="pacific">Pacific Ocean</option>
                  <option value="atlantic">Atlantic Ocean</option>
                  <option value="indian">Indian Ocean</option>
                  <option value="arctic">Arctic Ocean</option>
                  <option value="southern">Southern Ocean</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 ml-1">
                  Status
                </label>
                <select className="w-full p-3 rounded-lg border border-ocean-200 dark:border-ocean-800 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-ocean-400/30 focus:border-ocean-400 dark:focus:ring-ocean-600/30 dark:focus:border-ocean-600 transition-all blob-shape">
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button className="px-5 py-2.5 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg text-lg border border-ocean-500 transition-all transform hover:scale-105 blob-shape">
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        {viewMode === 'map' && (
          <div className="rounded-xl overflow-hidden shadow-xl border-2 border-ocean-200 dark:border-ocean-800/50 h-[calc(100vh-12rem)] relative hand-drawn-box">
            <div className="absolute inset-0 bg-gradient-to-b from-ocean-50/50 to-transparent pointer-events-none z-10 h-8 opacity-70"></div>
            <MapComponent 
              buoyData={BUOY_DATA as any} 
              onBuoySelected={(buoy: any) => handleBuoySelect(buoy as BuoyData)} 
            />
            <div className="absolute bottom-4 left-4 flex space-x-2 z-10">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg text-xs text-ocean-800 dark:text-ocean-200 border border-ocean-100 dark:border-ocean-800 flex items-center transform -rotate-1 doodle-border">
                <span className="mr-1.5" role="img" aria-label="Compass">🧭</span>
                <span>OpenOcean™ Explorer</span>
              </div>
            </div>
          </div>
        )}
        
        {viewMode === 'list' && (
          <div className="rounded-xl overflow-hidden shadow-xl border-2 border-ocean-200 dark:border-ocean-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm divide-y divide-ocean-100 dark:divide-gray-800 animate-in fade-in zoom-in-95 duration-300 hand-drawn-box">
            {BUOY_DATA.map((buoy) => (
              <div key={buoy.id} className="p-5 flex items-center justify-between hover:bg-ocean-50/70 dark:hover:bg-gray-800/70 transition-colors duration-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-ocean-100 dark:bg-ocean-900/40 flex items-center justify-center mr-4 border-2 border-ocean-200 dark:border-ocean-800 shadow-inner relative overflow-hidden doodle-border">
                    {buoy.type === 'reeflect' ? (
                      <span role="img" aria-label="Waves">🌊</span>
                    ) : (
                      <span role="img" aria-label="Anchor">⚓</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-ocean-200/50 dark:to-ocean-700/30"></div>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg font-serif">{buoy.name}</h3>
                    <div className="flex items-center">
                      <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{buoy.location.lat.toFixed(2)}°N, {buoy.location.lng.toFixed(2)}°W</p>
                      <span className="mx-2 text-ocean-300 dark:text-ocean-600">•</span>
                      <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{buoy.id}</p>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full mr-1.5 ${
                        buoy.status === 'active' ? 'bg-green-500' : 
                        buoy.status === 'warning' ? 'bg-amber-500' : 
                        buoy.status === 'maintenance' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                        {buoy.status === 'active' ? 'Active' : 
                         buoy.status === 'warning' ? 'Warning' : 
                         buoy.status === 'maintenance' ? 'Maintenance' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleBuoySelect(buoy)}
                  className="px-4 py-2 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-ocean-300 rounded-lg text-sm transition-all duration-300 border border-ocean-200 dark:border-ocean-800/50 hover:shadow-lg hover:scale-105 blob-shape"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
        
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            {BUOY_DATA.map((buoy) => (
              <div 
                key={buoy.id} 
                onClick={() => handleBuoySelect(buoy)}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border-2 border-ocean-200 dark:border-ocean-800/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group hand-drawn-box"
              >
                <div className="h-48 bg-gradient-to-br from-ocean-400/20 to-blue-400/20 dark:from-ocean-900/40 dark:to-blue-900/40 relative">
                  <div className="absolute inset-0 bg-[url('/images/dot-pattern.png')] opacity-5 mix-blend-overlay"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-ocean-100/80 dark:bg-ocean-900/60 backdrop-blur-sm flex items-center justify-center border-2 border-ocean-300 dark:border-ocean-700 shadow-xl shadow-ocean-500/10 group-hover:scale-110 transition-transform duration-500 doodle-border">
                      {buoy.type === 'reeflect' ? (
                        <span className="text-2xl" role="img" aria-label="Coral">🪸</span>
                      ) : (
                        <span className="text-2xl" role="img" aria-label="Buoy">🔍</span>
                      )}
                    </div>
                    
                    <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/20 to-transparent dark:from-black/20 pointer-events-none"></div>
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white/20 to-transparent dark:from-black/20 pointer-events-none"></div>
                  </div>
                  
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full text-xs font-medium text-ocean-700 dark:text-ocean-400 border border-ocean-200 dark:border-ocean-800/50 shadow-lg transform -rotate-2 group-hover:rotate-0 transition-all duration-300 doodle-border">
                    {buoy.type === 'reeflect' ? '🪸 REEFlect™' : '🔍 Standard'}
                  </div>
                  
                  <div className="absolute top-3 left-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${
                      buoy.status === 'active' ? 'bg-green-500' : 
                      buoy.status === 'warning' ? 'bg-amber-500' : 
                      buoy.status === 'maintenance' ? 'bg-blue-500' : 'bg-red-500'
                    } ring-4 ring-white/30 dark:ring-black/30`}></div>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-serif font-bold text-gray-900 dark:text-white text-xl group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors duration-300">{buoy.name}</h3>
                  <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-1 mb-4">{buoy.location.lat.toFixed(2)}°N, {buoy.location.lng.toFixed(2)}°W</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-ocean-50/70 dark:bg-gray-800/70 rounded-lg p-2 flex flex-col items-center justify-center blob-shape">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Temperature</span>
                      <span className="text-lg font-bold text-ocean-600 dark:text-ocean-400">
                        {(buoy.data?.temperature || buoy.sensors?.temperature || 0).toFixed(1)}°C
                      </span>
                    </div>
                    <div className="bg-ocean-50/70 dark:bg-gray-800/70 rounded-lg p-2 flex flex-col items-center justify-center blob-shape-alt">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Salinity</span>
                      <span className="text-lg font-bold text-ocean-600 dark:text-ocean-400">
                        {(buoy.data?.salinity || buoy.sensors?.salinity || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1.5 ${
                        buoy.status === 'active' ? 'bg-green-500' : 
                        buoy.status === 'warning' ? 'bg-amber-500' : 
                        buoy.status === 'maintenance' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                        {buoy.status === 'active' ? 'Active' : 
                         buoy.status === 'warning' ? 'Warning' : 
                         buoy.status === 'maintenance' ? 'Maintenance' : 'Offline'}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-500 wavy-text">{buoy.id}</span>
                  </div>
                  
                  <div className="mt-4 w-full h-0.5 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-ocean-400 to-blue-500 w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showBuoyDetail && selectedBuoy && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <BuoyDetailPanel 
              buoy={BUOY_DATA.find(b => b.id === selectedBuoy)!}
              onClose={() => setShowBuoyDetail(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
} 