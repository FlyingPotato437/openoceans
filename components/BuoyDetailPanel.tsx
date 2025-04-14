"use client"

import { useState, useEffect } from 'react'
import { X, Download, FileJson, FileText, Share2, ArrowUpRightFromCircle, MapPin, ExternalLink, Sparkles, Compass, Waves, Anchor, BarChart3, ThermometerSnowflake, Droplet, Beaker } from 'lucide-react'
import { DataVisualizer } from '@/components/ui/DataVisualizer'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Import MiniMap with dynamic loading (no SSR) to avoid leaflet issues
const MiniMap = dynamic(() => import('./MiniMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="animate-pulse text-sm text-gray-500">Loading map...</div>
    </div>
  )
})

type BuoyDetailPanelProps = {
  buoy: {
    id: string
    name: string
    location: {
      lat: number
      lng: number
    }
    status?: 'active' | 'warning' | 'offline' | 'maintenance' | 'inactive'
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
  } | null
  onClose: () => void
}

function InfoItem({ 
  label, 
  value, 
  valueClassName = "",
  icon
}: { 
  label: string; 
  value: string | number; 
  valueClassName?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-gray-600 dark:text-gray-400">
        {icon && <span className="mr-1.5">{icon}</span>}
        <span>{label}</span>
      </div>
      <div className={cn("font-medium text-gray-900 dark:text-white", valueClassName)}>
        {value}
      </div>
    </div>
  )
}

function getStatusText(status?: string) {
  if (!status) return 'Unknown'
  
  const statusMap: {[key: string]: string} = {
    'active': '✅ Active',
    'warning': '⚠️ Warning',
    'offline': '❌ Offline',
    'maintenance': '🔧 Maintenance',
    'inactive': '⏸️ Inactive'
  }
  
  return statusMap[status] || 'Unknown'
}

function getStatusColor(status?: string) {
  if (!status) return ''
  
  const colorMap: {[key: string]: string} = {
    'active': 'text-green-600 dark:text-green-500 font-semibold',
    'warning': 'text-amber-600 dark:text-amber-500 font-semibold',
    'offline': 'text-red-600 dark:text-red-500 font-semibold',
    'maintenance': 'text-blue-600 dark:text-blue-500 font-semibold',
    'inactive': 'text-gray-600 dark:text-gray-500 font-semibold'
  }
  
  return colorMap[status] || ''
}

export default function BuoyDetailPanel({ buoy, onClose }: BuoyDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [historyData, setHistoryData] = useState<any[]>([])
  
  // Combined data from either the data or sensors field
  const buoyData = {
    temperature: buoy?.data?.temperature || buoy?.sensors?.temperature || 0,
    salinity: buoy?.data?.salinity || buoy?.sensors?.salinity || 0,
    ph: buoy?.data?.ph || buoy?.sensors?.pH || 0,
    dissolved_oxygen: buoy?.data?.dissolved_oxygen || buoy?.sensors?.dissolved_oxygen || 0,
    turbidity: buoy?.sensors?.turbidity || 0
  }
  
  // Simulate loading data
  useEffect(() => {
    if (activeTab === 'data') {
      setLoading(true)
      const timer = setTimeout(() => {
        // Generate random historical data
        const generateData = () => {
          const count = 24
          const data = []
          const now = new Date()
          
          // Base values from buoy data
          let temperature = buoyData.temperature
          let salinity = buoyData.salinity
          let ph = buoyData.ph
          let dissolved_oxygen = buoyData.dissolved_oxygen
          
          for (let i = count; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 60 * 60 * 1000) // hourly data
            
            // Small random fluctuations
            temperature = Number((temperature + (Math.random() * 0.4 - 0.2)).toFixed(1))
            salinity = Number((salinity + (Math.random() * 0.2 - 0.1)).toFixed(1))
            ph = Number((ph + (Math.random() * 0.06 - 0.03)).toFixed(2))
            dissolved_oxygen = Number((dissolved_oxygen + (Math.random() * 0.2 - 0.1)).toFixed(1))
            
            data.push({
              date: date.toISOString(),
              temperature,
              salinity,
              ph,
              dissolved_oxygen
            })
          }
          
          return data
        }
        
        setHistoryData(generateData())
        setLoading(false)
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [activeTab, buoyData])
  
  if (!buoy) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500 border-2 border-ocean-200 dark:border-ocean-700 m-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-ocean-300/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-tl from-blue-300/20 to-transparent rounded-full translate-x-1/2 translate-y-1/2 blur-xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('/images/noise-pattern.png')] opacity-[0.02] pointer-events-none"></div>
        
        {/* Close button - always visible in the top-right corner */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:rotate-90 transform"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex items-center bg-gradient-to-r from-ocean-50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/20">
          <div className="flex items-center">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-ocean-100 dark:bg-ocean-900/40 flex items-center justify-center border-2 border-ocean-300 dark:border-ocean-700 shadow-inner">
              {buoy.type === 'reeflect' ? (
                <Waves className="w-6 h-6 text-ocean-600 dark:text-ocean-400" />
              ) : (
                <Anchor className="w-6 h-6 text-ocean-600 dark:text-ocean-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {buoy.name}
                <span className="px-2 py-0.5 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-700 dark:text-ocean-400 text-xs rounded-full font-medium">
                  {buoy.id}
                </span>
                {buoy.type === 'reeflect' && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/40 dark:to-blue-900/40 text-teal-700 dark:text-teal-400 text-xs rounded-full font-medium border border-teal-200 dark:border-teal-800/50 shadow-inner">
                    <Sparkles className="w-3 h-3 mr-1 text-teal-500" />
                    REEFlect™
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5 font-mono">
                <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                <span>{buoy.location.lat.toFixed(4)}, {buoy.location.lng.toFixed(4)}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 text-center relative ${
              activeTab === 'overview'
                ? 'text-ocean-600 dark:text-ocean-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <span className="relative z-10">Overview</span>
            {activeTab === 'overview' && (
              <span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-ocean-500 dark:bg-ocean-400"
                style={{
                  animation: 'tab-highlight 0.3s cubic-bezier(0.65, 0, 0.35, 1) forwards'
                }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`flex-1 py-3 px-4 text-center relative ${
              activeTab === 'data'
                ? 'text-ocean-600 dark:text-ocean-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <span className="relative z-10">Data Analysis</span>
            {activeTab === 'data' && (
              <span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-ocean-500 dark:bg-ocean-400"
                style={{
                  animation: 'tab-highlight 0.3s cubic-bezier(0.65, 0, 0.35, 1) forwards'
                }}
              />
            )}
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Buoy Location */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4 flex justify-between items-center">
                  <span className="flex items-center">
                    <Compass className="w-5 h-5 mr-2 text-ocean-500" />
                    Buoy Location
                  </span>
                  <Link 
                    href={`/map?buoy=${buoy.id}`}
                    className="text-xs flex items-center gap-1 text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300 px-2 py-1 rounded hover:bg-ocean-50 dark:hover:bg-ocean-900/20"
                  >
                    <span>View Full Map</span>
                    <ArrowUpRightFromCircle className="h-3 w-3" />
                  </Link>
                </h3>
                
                <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
                  <MiniMap 
                    location={{ lat: buoy.location.lat, lng: buoy.location.lng }}
                    status={buoy.status === 'maintenance' ? 'active' : (buoy.status || 'active')}
                  />
                  
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <span className="font-mono tracking-tight">📍 {buoy.location.lat.toFixed(6)}</span>
                    <span className="font-mono tracking-tight">🧭 {buoy.location.lng.toFixed(6)}</span>
                  </div>
                </div>
              </div>
              
              {/* Buoy Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Anchor className="w-5 h-5 mr-2 text-ocean-500" />
                  Buoy Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3.5">
                    <InfoItem 
                      label="ID" 
                      value={buoy.id} 
                      icon={<span className="text-xs">🏷️</span>}
                    />
                    <InfoItem 
                      label="Name" 
                      value={buoy.name} 
                      icon={<span className="text-xs">📝</span>}
                    />
                    <InfoItem 
                      label="Latitude" 
                      value={buoy.location.lat.toFixed(6)} 
                      icon={<span className="text-xs">🌐</span>}
                    />
                    <InfoItem 
                      label="Longitude" 
                      value={buoy.location.lng.toFixed(6)} 
                      icon={<span className="text-xs">🧭</span>}
                    />
                  </div>
                  
                  <div className="space-y-3.5">
                    <InfoItem 
                      label="Status" 
                      value={getStatusText(buoy.status)} 
                      valueClassName={getStatusColor(buoy.status)} 
                    />
                    <InfoItem 
                      label="Last Update" 
                      value="10 minutes ago" 
                      icon={<span className="text-xs">⏱️</span>}
                    />
                    <InfoItem 
                      label="Deployment Date" 
                      value="June 15, 2023" 
                      icon={<span className="text-xs">📅</span>}
                    />
                    <InfoItem 
                      label="Battery" 
                      value="85%" 
                      valueClassName="text-green-600 dark:text-green-500 font-semibold" 
                      icon={<span className="text-xs">🔋</span>}
                    />
                  </div>
                </div>

                {/* REEFlect branding for specific buoys */}
                {buoy.type === 'reeflect' && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/40 dark:to-blue-900/40 rounded-lg overflow-hidden flex items-center justify-center border border-teal-200 dark:border-teal-800/50 shadow-inner">
                        <div className="text-teal-600 dark:text-teal-400 font-bold text-xs">REEFlect™</div>
                        <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-md"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          REEFlect™ Enhanced Coral Monitoring Buoy
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Equipped with specialized coral health sensors 🪸
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Current Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-ocean-50 dark:from-blue-900/20 dark:to-ocean-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <ThermometerSnowflake className="w-4 h-4 text-blue-500 mr-1.5" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {buoyData.temperature.toFixed(1)}°C
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                      Normal range
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                  <div className="px-4 py-2 bg-gradient-to-r from-teal-50 to-ocean-50 dark:from-teal-900/20 dark:to-ocean-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Droplet className="w-4 h-4 text-teal-500 mr-1.5" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Salinity</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      {buoyData.salinity.toFixed(1)} PSU
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-1"></span>
                      Stable
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-ocean-50 dark:from-purple-900/20 dark:to-ocean-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Beaker className="w-4 h-4 text-purple-500 mr-1.5" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">pH Level</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {buoyData.ph.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                      Optimal
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                  <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-ocean-50 dark:from-green-900/20 dark:to-ocean-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Waves className="w-4 h-4 text-green-500 mr-1.5" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dissolved O₂</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {buoyData.dissolved_oxygen.toFixed(1)} mg/L
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                      Good level
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-ocean-500" />
                    24-Hour Trend
                  </h3>
                  <button 
                    onClick={() => setActiveTab('data')}
                    className="text-xs flex items-center gap-1 text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300 px-2 py-1 rounded hover:bg-ocean-50 dark:hover:bg-ocean-900/20"
                  >
                    <span>Full Analysis</span>
                    <ArrowUpRightFromCircle className="h-3 w-3" />
                  </button>
                </div>
                
                {loading ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ocean-500"></div>
                  </div>
                ) : (
                  <DataVisualizer 
                    data={historyData}
                    className="mt-2 h-48 overflow-hidden -mx-2"
                  />
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'data' && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-ocean-500" />
                    Historical Data Analysis
                  </h3>
                  
                  <div className="flex gap-2">
                    <select className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-md p-1.5">
                      <option value="24h">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                    </select>
                    
                    <button className="flex items-center gap-1 bg-ocean-100 text-ocean-600 hover:bg-ocean-200 dark:bg-ocean-900/40 dark:text-ocean-400 dark:hover:bg-ocean-900/60 px-3 py-1.5 rounded-md text-sm transition-colors border border-ocean-200 dark:border-ocean-800/30">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ocean-500"></div>
                  </div>
                ) : (
                  <DataVisualizer 
                    data={historyData}
                    className="mt-2 h-64"
                  />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-ocean-500" />
                    Trends & Patterns
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="text-xs mr-1.5">🌡️</span>
                        Daily Temperature Range
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">18.2°C - 20.5°C</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="text-xs mr-1.5">📈</span>
                        Temperature Trend
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-500">Rising (+0.2°C/day)</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="text-xs mr-1.5">⚖️</span>
                        pH Stability
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-500">Stable (±0.05)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="text-xs mr-1.5">🔍</span>
                        Anomaly Detection
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">None detected</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Waves className="w-5 h-5 mr-2 text-ocean-500" />
                    Related Parameters
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="text-xs mr-1.5">🌱</span>
                        Chlorophyll
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">0.8 μg/L</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="text-xs mr-1.5">💧</span>
                        Turbidity
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">2.4 NTU</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="text-xs mr-1.5">🌊</span>
                        Current Speed
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">0.3 m/s</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="text-xs mr-1.5">🌊</span>
                        Wave Height
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">0.8 m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span>Last updated 10 minutes ago</span>
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-white dark:bg-gray-800 text-ocean-600 dark:text-ocean-400 px-3 py-1.5 rounded text-xs font-medium transition-colors hover:bg-ocean-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <FileJson className="h-3.5 w-3.5" />
              <span>JSON</span>
            </button>
            <button className="flex items-center gap-1 bg-white dark:bg-gray-800 text-ocean-600 dark:text-ocean-400 px-3 py-1.5 rounded text-xs font-medium transition-colors hover:bg-ocean-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <FileText className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>
            <button className="flex items-center gap-1 bg-white dark:bg-gray-800 text-ocean-600 dark:text-ocean-400 px-3 py-1.5 rounded text-xs font-medium transition-colors hover:bg-ocean-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes tab-highlight {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  )
} 