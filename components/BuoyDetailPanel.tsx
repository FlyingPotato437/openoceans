"use client"

import { useState, useEffect } from 'react'
import { X, Download, FileJson, FileText, Share2, ArrowUpRightFromCircle, MapPin, ExternalLink } from 'lucide-react'
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
    status?: 'active' | 'warning' | 'offline'
    data: {
      temperature: number
      salinity: number
      ph: number
      dissolved_oxygen: number
    }
  } | null
  onClose: () => void
}

// Sample historical data for visualization
const generateSampleData = (buoyId: string) => {
  const result = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - i);
    
    // Base values with some randomness
    const baseTemp = 22 + Math.sin(i / 4) * 2;
    const baseSalinity = 35 + Math.cos(i / 6) * 0.8;
    const basePh = 8.1 + Math.sin(i / 8) * 0.2;
    const baseOxygen = 7 + Math.cos(i / 5) * 0.5;
    
    result.push({
      timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: baseTemp + (Math.random() - 0.5) * 0.3,
      salinity: baseSalinity + (Math.random() - 0.5) * 0.2,
      ph: basePh + (Math.random() - 0.5) * 0.1,
      dissolved_oxygen: baseOxygen + (Math.random() - 0.5) * 0.2
    });
  }
  
  return result.reverse();
}

export default function BuoyDetailPanel({ buoy, onClose }: BuoyDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'export'>('overview')
  const [historyData, setHistoryData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  useEffect(() => {
    if (buoy) {
      // Simulate API call to get historical data
      setLoading(true);
      setImageError(false);
      setTimeout(() => {
        setHistoryData(generateSampleData(buoy.id));
        setLoading(false);
      }, 800);
    }
  }, [buoy]);
  
  if (!buoy) return null;

  // Determine status color
  const getStatusColor = (status?: string) => {
    if (!status || status === 'active') return 'text-green-600 dark:text-green-500';
    if (status === 'warning') return 'text-amber-600 dark:text-amber-500';
    return 'text-red-600 dark:text-red-500';
  };

  const getStatusText = (status?: string) => {
    if (!status || status === 'active') return 'Active';
    if (status === 'warning') return 'Warning';
    return 'Offline';
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700 m-4 relative">
        {/* Close button - always visible in the top-right corner */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-md"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-5 py-4 flex items-center bg-gray-50 dark:bg-gray-800/50">
          <div>
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {buoy.name}
              <span className="px-2 py-0.5 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-700 dark:text-ocean-400 text-xs rounded-full font-medium">
                {buoy.id}
              </span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <span>{buoy.location.lat.toFixed(4)}, {buoy.location.lng.toFixed(4)}</span>
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-5 bg-white dark:bg-gray-900">
          <div className="flex space-x-6">
            <TabButton 
              isActive={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
              label="Overview"
            />
            <TabButton 
              isActive={activeTab === 'data'} 
              onClick={() => setActiveTab('data')}
              label="Historical Data"
            />
            <TabButton 
              isActive={activeTab === 'export'} 
              onClick={() => setActiveTab('export')}
              label="Export & API"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-900">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Buoy Location */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4 flex justify-between items-center">
                  <span>Buoy Location</span>
                  <Link 
                    href={`/map?buoy=${buoy.id}`}
                    className="text-xs flex items-center gap-1 text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300 px-2 py-1 rounded hover:bg-ocean-50 dark:hover:bg-ocean-900/20"
                  >
                    <span>View Full Map</span>
                    <ArrowUpRightFromCircle className="h-3 w-3" />
                  </Link>
                </h3>
                
                <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <MiniMap 
                    location={{ lat: buoy.location.lat, lng: buoy.location.lng }}
                    status={buoy.status || 'active'}
                  />
                  
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded shadow-sm">
                    <span className="font-medium">Lat: {buoy.location.lat.toFixed(6)}</span>
                    <span className="font-medium">Lng: {buoy.location.lng.toFixed(6)}</span>
                  </div>
                </div>
              </div>
              
              {/* Buoy Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">
                  Buoy Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <InfoItem label="ID" value={buoy.id} />
                    <InfoItem label="Name" value={buoy.name} />
                    <InfoItem label="Latitude" value={buoy.location.lat.toFixed(6)} />
                    <InfoItem label="Longitude" value={buoy.location.lng.toFixed(6)} />
                  </div>
                  
                  <div className="space-y-3">
                    <InfoItem 
                      label="Status" 
                      value={getStatusText(buoy.status)} 
                      valueClassName={getStatusColor(buoy.status)} 
                    />
                    <InfoItem label="Last Update" value="10 minutes ago" />
                    <InfoItem label="Deployment Date" value="June 15, 2023" />
                    <InfoItem label="Battery" value="85%" valueClassName="text-green-600 dark:text-green-500" />
                  </div>
                </div>

                {/* REEFlect branding for specific buoys */}
                {buoy.id.includes('REEFlect') && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 bg-ocean-100 dark:bg-ocean-900/30 rounded-lg overflow-hidden flex items-center justify-center">
                        <div className="text-ocean-500 dark:text-ocean-400 font-bold text-xs">REEFlect</div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          REEFlect™ Enhanced Coral Monitoring Buoy
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Equipped with specialized coral health sensors
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Current Metrics */}
              <div className="bg-gradient-to-br from-ocean-50 to-seagrass-50 dark:from-ocean-900/30 dark:to-seagrass-900/30 rounded-xl p-5 border border-ocean-100 dark:border-ocean-800/50 shadow-sm">
                <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">
                  Current Readings
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard 
                    label="Temperature" 
                    value={`${buoy.data.temperature.toFixed(1)}°C`} 
                    change="+0.3°C"
                    isUp={true}
                  />
                  <MetricCard 
                    label="Salinity" 
                    value={`${buoy.data.salinity.toFixed(1)} PSU`} 
                    change="-0.2 PSU"
                    isUp={false}
                  />
                  <MetricCard 
                    label="pH Level" 
                    value={buoy.data.ph.toFixed(1)} 
                    change="+0.1"
                    isUp={true}
                  />
                  <MetricCard 
                    label="Dissolved O₂" 
                    value={`${buoy.data.dissolved_oxygen.toFixed(1)} mg/L`} 
                    change="+0.2 mg/L"
                    isUp={true}
                  />
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
              
              {/* Mini Visualization */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
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
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">
                    Trends & Patterns
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Daily Temperature Range</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">18.2°C - 20.5°C</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Temperature Trend</span>
                      <span className="font-medium text-green-600 dark:text-green-500">Rising (+0.2°C/day)</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">pH Stability</span>
                      <span className="font-medium text-blue-600 dark:text-blue-500">Stable (±0.05)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Anomaly Detection</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">None detected</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">
                    Related Parameters
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Chlorophyll</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">0.8 μg/L</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Turbidity</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">2.4 NTU</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Current Speed</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">0.3 m/s</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Wave Height</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">0.8 m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'export' && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">
                  Export Data
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
                  Download data from this buoy in various formats for offline analysis or integration with your own tools.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <button className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <FileText className="h-8 w-8 text-gray-500 dark:text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">CSV</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">24.5 KB</span>
                  </button>
                  
                  <button className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <FileJson className="h-8 w-8 text-gray-500 dark:text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">JSON</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">32.1 KB</span>
                  </button>
                  
                  <button className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Download className="h-8 w-8 text-gray-500 dark:text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Excel</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">45.7 KB</span>
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Data last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">
                  API Access
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Access this buoy's data programmatically through our REST API.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 font-mono text-sm mb-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
                  <code className="text-gray-800 dark:text-gray-200">
                    GET https://api.openocean.org/v1/buoys/{buoy.id}
                  </code>
                </div>
                
                <a 
                  href="/data/api"
                  className="text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300 inline-flex items-center text-sm font-medium"
                >
                  <span>View API Documentation</span>
                  <ExternalLink className="h-4 w-4 ml-1.5" />
                </a>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">
                  Share
                </h3>
                
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 py-2 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                    <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Copy Link</span>
                  </button>
                  
                  <button className="flex items-center gap-2 py-2 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                    <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Email</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TabButton({ 
  isActive, 
  onClick, 
  label 
}: { 
  isActive: boolean; 
  onClick: () => void; 
  label: string 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-3 relative text-sm font-medium transition-colors",
        isActive 
          ? "text-ocean-600 dark:text-ocean-400" 
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
      )}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ocean-500 dark:bg-ocean-400" />
      )}
    </button>
  )
}

function InfoItem({ 
  label, 
  value, 
  valueClassName 
}: { 
  label: string; 
  value: string; 
  valueClassName?: string 
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={cn("text-sm font-medium text-gray-900 dark:text-gray-200", valueClassName)}>
        {value}
      </span>
    </div>
  )
}

function MetricCard({ 
  label, 
  value, 
  change, 
  isUp 
}: { 
  label: string; 
  value: string; 
  change: string; 
  isUp: boolean 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <span className={cn(
          "text-xs font-medium flex items-center gap-0.5",
          isUp ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
        )}>
          {change}
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isUp ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </span>
      </div>
      <span className="text-lg font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
  )
} 