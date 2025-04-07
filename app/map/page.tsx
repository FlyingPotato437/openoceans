'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import BuoyDetailPanel from '@/components/BuoyDetailPanel'
import { ArrowLeft, Info, Download } from 'lucide-react'
import Link from 'next/link'

// Import the Buoy type
type Buoy = {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  status?: 'active' | 'warning' | 'offline'
  data: {
    temperature: number
    salinity: number
    ph: number
    dissolved_oxygen: number
  }
}

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-80px)] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">
      <p className="text-lg text-gray-500 dark:text-gray-400">Loading map...</p>
    </div>
  ),
})

// Enhanced buoy data with more buoys placed in water not land
const BUOY_DATA: Buoy[] = [
  {
    id: 'B001',
    name: 'Northeast Pacific Buoy',
    location: {
      lat: 40.7128,
      lng: -140.0060,
    },
    status: 'active',
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
      lat: -16.7203,
      lng: 146.7710,
    },
    status: 'active',
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
      lng: 15.5931,
    },
    status: 'warning',
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
    status: 'active',
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
    status: 'active',
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
    status: 'offline',
    data: {
      temperature: 26.5,
      salinity: 40.1,
      ph: 8.2,
      dissolved_oxygen: 6.0,
    },
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
  },
]

export default function MapPage() {
  const [selectedBuoy, setSelectedBuoy] = useState<string | null>(null)
  const [showBuoyDetail, setShowBuoyDetail] = useState(false)

  const handleBuoySelect = (buoy: Buoy) => {
    setSelectedBuoy(buoy.id)
    setShowBuoyDetail(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-ocean-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Interactive Buoy Map
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Explore our network of OpenOcean smart buoys in collaboration with REEFlect
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/data/download" className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-ocean-100 text-ocean-800 hover:bg-ocean-200 dark:bg-ocean-900 dark:text-ocean-100 dark:hover:bg-ocean-800 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Data</span>
              </Link>
              <Link href="/about#technology" className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Info className="w-4 h-4" />
                <span>About Buoys</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <MapComponent buoyData={BUOY_DATA} onBuoySelected={handleBuoySelect} className="h-[calc(100vh-180px)]" />
        
        {showBuoyDetail && selectedBuoy && (
          <div className="absolute top-4 right-4 w-full sm:w-[450px] z-10">
            <BuoyDetailPanel 
              buoy={BUOY_DATA.find(b => b.id === selectedBuoy)!}
              onClose={() => setShowBuoyDetail(false)}
            />
          </div>
        )}
        
        <div className="absolute bottom-6 left-4 z-10 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium mb-2">Buoy Status Legend</div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Warning</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 