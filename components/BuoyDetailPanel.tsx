"use client"

import React, { useState, useEffect } from 'react'
import { X, Download, FileJson, FileText, Share2, ArrowUpRightFromCircle, MapPin, ExternalLink, Sparkles, Compass, Waves, Anchor, BarChart3, ThermometerSnowflake, Droplet, Beaker, Wind, CloudRain, Sun, Thermometer, Percent, Gauge, CalendarClock, Tag, NotepadText, Image as ImageIcon, AlertTriangle, CheckCircle2, XCircle, Wrench } from 'lucide-react'
import { DataVisualizer } from '@/components/ui/DataVisualizer'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Buoy, BuoyDataMetrics } from '../lib/types';

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
  buoy: Buoy | null;
  onClose: () => void;
}

const StatusIndicator = ({ status }: { status: Buoy['status'] }) => {
  let colorClasses = '';
  let pulseColor = '';
  let IconComponent = AlertTriangle;

  switch (status) {
    case 'Online':
      colorClasses = 'text-green-600 dark:text-green-400';
      pulseColor = 'bg-green-500';
      IconComponent = CheckCircle2;
      break;
    case 'Warning':
      colorClasses = 'text-amber-500 dark:text-amber-400';
      pulseColor = 'bg-amber-500';
      IconComponent = AlertTriangle;
      break;
    case 'Offline':
      colorClasses = 'text-red-600 dark:text-red-400';
      pulseColor = 'bg-red-500';
      IconComponent = XCircle;
      break;
    case 'Maintenance':
      colorClasses = 'text-blue-500 dark:text-blue-400';
      pulseColor = 'bg-blue-500';
      IconComponent = Wrench;
      break;
    default:
      colorClasses = 'text-gray-500 dark:text-gray-400';
      pulseColor = 'bg-gray-500';
      IconComponent = AlertTriangle; // Default or unknown status
  }

  return (
    <div className={`flex items-center font-medium ${colorClasses}`}>
      <span className="relative flex h-3 w-3 mr-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseColor} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${pulseColor}`}></span>
      </span>
      <IconComponent className="h-4 w-4 mr-1" />
      {status}
    </div>
  );
};


function InfoItem({ 
  label, 
  value, 
  valueClassName = "",
  icon,
  unit = ""
}: { 
  label: string; 
  value: string | number | undefined; 
  valueClassName?: string;
  icon?: React.ReactNode;
  unit?: string;
}) {
  if (value === undefined || value === null || Number.isNaN(value)) return null; // Don't render if value is not meaningful
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        {icon && <span className="mr-2 text-gray-500 dark:text-gray-500 w-4 h-4">{icon}</span>}
        <span>{label}</span>
      </div>
      <div className={cn("font-medium text-sm text-gray-900 dark:text-white", valueClassName)}>
        {value}{unit}
      </div>
    </div>
  )
}

// Helper to format data keys to readable labels and assign icons
const getSensorDisplayConfig = (key: string): { label: string; icon: React.ReactNode; unit: string } => {
  const config: { [key: string]: { label: string; icon: React.ReactNode; unit: string } } = {
    waterTemp: { label: 'Water Temp.', icon: <ThermometerSnowflake />, unit: '°C' },
    salinity: { label: 'Salinity', icon: <Droplet />, unit: 'PSU' },
    waveHeight: { label: 'Wave Height', icon: <Waves />, unit: 'm' },
    ph: { label: 'pH Level', icon: <Beaker />, unit: '' },
    dissolvedOxygen: { label: 'Dissolved O₂', icon: <Sparkles />, unit: 'mg/L' }, // Changed icon
    turbidity: { label: 'Turbidity', icon: <BarChart3 />, unit: 'NTU' }, // Changed icon
    chlorophyll: { label: 'Chlorophyll', icon: <Sparkles />, unit: 'µg/L' }, // Placeholder icon
    conductivity: { label: 'Conductivity', icon: <BarChart3 />, unit: 'µS/cm' }, // Placeholder icon
    pressure: { label: 'Pressure', icon: <Gauge />, unit: 'hPa' },
    oxygenSaturation: { label: 'O₂ Saturation', icon: <Percent />, unit: '%' },
    windSpeed: { label: 'Wind Speed', icon: <Wind />, unit: 'm/s' },
    windDirection: { label: 'Wind Direction', icon: <Compass />, unit: '°' },
    airTemp: { label: 'Air Temp.', icon: <Thermometer />, unit: '°C' },
    humidity: { label: 'Humidity', icon: <Percent />, unit: '%' }, // Placeholder icon
    uvIndex: { label: 'UV Index', icon: <Sun />, unit: '' },
    precipitation: { label: 'Precipitation', icon: <CloudRain />, unit: 'mm/hr' },
    cloudCover: { label: 'Cloud Cover', icon: <CloudRain />, unit: '%' }, // Placeholder icon
    batteryLevel: { label: 'Battery', icon: <BarChart3 />, unit: '%' } // Placeholder icon
  };
  return config[key] || { label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), icon: <BarChart3/>, unit: '' };
};

// Helper function to map global BuoyStatus to MiniMap's expected status
const mapBuoyStatus = (status: Buoy['status']): 'active' | 'warning' | 'offline' | 'maintenance' | 'inactive' => {
  switch (status) {
    case 'Online':
      return 'active';
    case 'Offline':
      return 'offline';
    case 'Warning':
      return 'warning';
    case 'Maintenance':
      return 'maintenance';
    default:
      return 'inactive'; // Default for any statuses not explicitly mapped
  }
};

export default function BuoyDetailPanel({ buoy, onClose }: { buoy: Buoy | null; onClose: () => void; }) {
  if (buoy) {
    console.log("BuoyDetailPanel received:", JSON.parse(JSON.stringify(buoy)));
    console.log("BuoyDetailPanel buoy.data.salinity:", buoy.data?.salinity);
  }
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [historyData, setHistoryData] = useState<any[]>([])
  
  // Directly use buoy.data, as it's now comprehensive and includes fluctuations from page.tsx
  const currentBuoyData = buoy?.data;
  
  useEffect(() => {
    if (activeTab === 'data' && currentBuoyData) {
      setLoading(true)
      const timer = setTimeout(() => {
        const generateData = () => {
          const count = 24
          const data = []
          const now = new Date()
          
          // Base values from current buoy data, with fallbacks for undefined
          let waterTemp = currentBuoyData.waterTemp ?? 0;
          let salinity = currentBuoyData.salinity ?? 35;
          let ph = currentBuoyData.ph ?? 8.0;
          let dissolvedOxygen = currentBuoyData.dissolvedOxygen ?? 7.0;
          let waveHeight = currentBuoyData.waveHeight ?? 0.5;
          
          for (let i = count; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 60 * 60 * 1000) // hourly data
            
            // Small random fluctuations for historical data simulation
            waterTemp = Number((waterTemp + (Math.random() * 0.4 - 0.2)).toFixed(1))
            salinity = Number((salinity + (Math.random() * 0.2 - 0.1)).toFixed(1))
            ph = Number((ph + (Math.random() * 0.06 - 0.03)).toFixed(2))
            dissolvedOxygen = Number((dissolvedOxygen + (Math.random() * 0.2 - 0.1)).toFixed(1))
            waveHeight = Number((waveHeight + (Math.random() * 0.1 - 0.05)).toFixed(2))
            
            data.push({
              date: date.toISOString(),
              waterTemp,
              salinity,
              ph,
              dissolvedOxygen,
              waveHeight
            })
          }
          return data
        }
        setHistoryData(generateData())
        setLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [activeTab, currentBuoyData])
  
  if (!buoy) return null
  
  const isReeflectBuoy = buoy.tags?.includes('REEFlect');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500 border-2 border-ocean-200 dark:border-ocean-700 m-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-ocean-300/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-tl from-blue-300/20 to-transparent rounded-full translate-x-1/2 translate-y-1/2 blur-xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('/images/noise-pattern.png')] opacity-[0.02] pointer-events-none"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:rotate-90 transform"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex items-start justify-between bg-gradient-to-r from-ocean-50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/20">
          <div className="flex items-center">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-ocean-100 dark:bg-ocean-900/40 flex items-center justify-center border-2 border-ocean-300 dark:border-ocean-700 shadow-inner">
              {buoy.imageUrl ? (
                <Image src={buoy.imageUrl} alt={buoy.name} width={48} height={48} className="object-cover" />
              ) : (
                isReeflectBuoy ? <Waves className="w-6 h-6 text-ocean-600 dark:text-ocean-400" /> : <Anchor className="w-6 h-6 text-ocean-600 dark:text-ocean-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {buoy.name}
                <span className="px-2 py-0.5 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-700 dark:text-ocean-400 text-xs rounded-full font-medium">
                  {buoy.id}
                </span>
                {isReeflectBuoy && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/40 dark:to-blue-900/40 text-teal-700 dark:text-teal-400 text-xs rounded-full font-medium border border-teal-200 dark:border-teal-800/50 shadow-inner">
                    <Sparkles className="w-3 h-3 mr-1 text-teal-500" />
                    REEFlect™
                  </span>
                )}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Lat: {buoy.location.lat.toFixed(4)}, Lng: {buoy.location.lng.toFixed(4)}
              </div>
            </div>
          </div>
          <div className="mt-1">
             <StatusIndicator status={buoy.status} />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex space-x-1 bg-gray-50 dark:bg-gray-800/30 sticky top-0 z-10">
          {['overview', 'data', 'map', 'export'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                activeTab === tab
                  ? 'bg-ocean-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/50'
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */} 
        <div className="p-6 overflow-y-auto flex-grow styled-scrollbar">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Image, Notes, Tags */} 
              <div className="space-y-6">
                {buoy.imageUrl && (
                  <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                    <Image src={buoy.imageUrl} alt={`Image of ${buoy.name}`} width={600} height={400} className="object-cover w-full" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center"><NotepadText className="w-5 h-5 mr-2 text-ocean-600 dark:text-ocean-400"/>Notes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-200 dark:border-gray-700 whitespace-pre-wrap">
                    {buoy.notes || 'No notes available for this buoy.'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center"><Tag className="w-5 h-5 mr-2 text-ocean-600 dark:text-ocean-400"/>Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {(buoy.tags ?? []).map((tag: string) => ( // Handle potentially undefined tags
                      <span key={tag} className="px-2 py-1 bg-ocean-100 dark:bg-ocean-700 text-ocean-700 dark:text-ocean-200 rounded-full text-xs font-medium flex items-center">
                        <Tag className="w-3 h-3 mr-1.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: General Info & Sensor Data */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">General Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-200 dark:border-gray-700 space-y-1">
                    <InfoItem label="Last Transmission" value={buoy.lastTransmission ? new Date(buoy.lastTransmission).toLocaleString() : 'N/A'} icon={<CalendarClock size={16}/>} />
                    <InfoItem label="Depth" value={buoy.depth || 'N/A'} icon={<Anchor size={16}/>} /> 
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Live Sensor Readings</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-200 dark:border-gray-700 space-y-1">
                    {Object.entries(buoy.data ?? {}).map(([key, value]) => {
                      const config = getSensorDisplayConfig(key as keyof BuoyDataMetrics);
                      if (value === undefined || value === null) return null; // Skip if value is not meaningful
                      return (
                        <InfoItem 
                          key={key} 
                          label={config.label} 
                          value={value} 
                          icon={config.icon} 
                          unit={config.unit} 
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="h-[400px]"> {/* Ensure container has height for chart */}
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-gray-500">Loading historical data...</div>
                </div>
              ) : (
                <DataVisualizer data={historyData} />
              )}
            </div>
          )}

          {activeTab === 'map' && (
            <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
              {buoy.location ? (
                <MiniMap 
                  location={buoy.location} 
                  status={mapBuoyStatus(buoy.status)} 
                  height="h-48"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location data unavailable.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Export Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download buoy data in various formats. Note: Historical data is simulated for this demonstration.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[ { format: 'JSON', icon: <FileJson/>, desc: 'Full data export including metadata and readings.' }, { format: 'CSV', icon: <FileText/>, desc: 'Timeseries sensor data in CSV format.' }, { format: 'Share', icon: <Share2/>, desc: 'Generate a shareable link to this buoy.' }].map(item => (
                  <button 
                    key={item.format}
                    className="flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/60 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                    onClick={() => alert(`Exporting as ${item.format} (demo)`)}
                  >
                    {React.cloneElement(item.icon, {className: "w-10 h-10 mb-3 text-ocean-600 dark:text-ocean-400"})}
                    <span className="text-lg font-medium text-gray-800 dark:text-white">{item.format}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">{item.desc}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 dark:text-yellow-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                      For actual research or production use, please refer to our official API documentation for data access and export.
                      <Link href="/docs/api" legacyBehavior><a className="font-medium underline ml-1 hover:text-yellow-600 dark:hover:text-yellow-100">Learn more</a></Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with external link (optional) */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 text-right">
          <Link href={`/buoy/${buoy.id}/details`} legacyBehavior>
            <a className="text-sm text-ocean-600 dark:text-ocean-400 hover:underline inline-flex items-center">
              View Full Buoy Details Page <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}