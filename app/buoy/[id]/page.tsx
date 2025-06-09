'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ArrowLeft, Download, MapPin, Calendar, Anchor, Waves, Activity, AlertTriangle, CheckCircle, ExternalLink, Share2, FileJson, FileText, Info } from 'lucide-react'
import { useSimulatedBuoyData } from '@/lib/hooks/useSimulatedBuoyData'
import { Buoy } from '@/lib/types'
import LiveDataStream from '@/components/LiveDataStream'
import { DEMO_MODE } from '@/components/DemoBanner'

// Dynamically import the MiniMap component to avoid SSR issues with Leaflet
const MiniMap = dynamic(() => import('@/components/MiniMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-handwritten">Loading map...</p>
    </div>
  ),
})

export default function BuoyDetailPage() {
  const params = useParams()
  const buoys = useSimulatedBuoyData()
  const [buoy, setBuoy] = useState<Buoy | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id && buoys.length > 0) {
      const foundBuoy = buoys.find(b => b.id === params.id)
      setBuoy(foundBuoy || null)
      setIsLoading(false)
    }
  }, [params.id, buoys])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-ocean-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!buoy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-ocean-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Link href="/data/browse" className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:underline mb-6 font-handwritten">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Browse
          </Link>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center hand-drawn-box">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif">Buoy Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-handwritten">
              The buoy with ID &quot;<span className="font-mono">{params.id}</span>&quot; could not be found in our network.
            </p>
            <Link 
              href="/data/browse"
              className="inline-flex items-center px-6 py-3 bg-ocean-600 hover:bg-ocean-700 text-white font-medium rounded-lg transition-colors font-serif blob-shape"
            >
              Browse All Buoys
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'text-green-600 dark:text-green-400'
      case 'Warning': return 'text-yellow-600 dark:text-yellow-400'
      case 'Offline': return 'text-red-600 dark:text-red-400'
      case 'Maintenance': return 'text-blue-600 dark:text-blue-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Online': return <CheckCircle className="h-5 w-5" />
      case 'Warning': return <AlertTriangle className="h-5 w-5" />
      case 'Offline': return <AlertTriangle className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${buoy.name} - OpenOcean`,
        text: `Check out live data from ${buoy.name}`,
        url: window.location.href
      })
    } catch {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-ocean-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/data/browse" className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:underline font-handwritten">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Browse
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-handwritten blob-shape-alt"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hand-drawn-box">
              <div className="bg-gradient-to-r from-ocean-500 to-ocean-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 font-serif">{buoy.name}</h1>
                    <p className="text-ocean-100 mb-4 font-mono">ID: {buoy.id}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-mono">{buoy.location.lat.toFixed(4)}°, {buoy.location.lng.toFixed(4)}°</span>
                      </div>
                      {buoy.depth && (
                        <div className="flex items-center gap-2">
                          <Anchor className="h-4 w-4" />
                          <span className="font-handwritten">Depth: {buoy.depth}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 ${getStatusColor(buoy.status)}`}>
                    {getStatusIcon(buoy.status)}
                    <span className="font-medium text-white font-serif">{buoy.status}</span>
                  </div>
                </div>
              </div>
              
              {buoy.imageUrl && (
                <div className="relative h-64">
                  <Image 
                    src={buoy.imageUrl}
                    alt={buoy.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-serif">Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400 font-handwritten">
                          Last transmission: <span className="font-mono">{buoy.lastTransmission ? new Date(buoy.lastTransmission).toLocaleString() : 'N/A'}</span>
                        </span>
                      </div>
                      {buoy.type && (
                        <div className="flex items-center gap-2">
                          <Waves className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400 font-handwritten">Type: {buoy.type}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-serif">Notes</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-handwritten">
                      {buoy.notes || 'No additional notes available for this buoy.'}
                    </p>
                  </div>
                </div>
                
                {buoy.tags && buoy.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-serif">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {buoy.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-ocean-100 dark:bg-ocean-900 text-ocean-700 dark:text-ocean-300 rounded-full text-sm font-medium doodle-border font-handwritten"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Data Stream */}
            <LiveDataStream 
              buoyId={buoy.id}
              buoyName={buoy.name}
              isActive={buoy.status === 'Online'}
            />

            {/* Demo Notice - Integrated into page content */}
            {DEMO_MODE && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 hand-drawn-box">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2 font-serif">Demo Site Notice</h3>
                    <div className="text-sm text-orange-800 dark:text-orange-200 space-y-2 font-handwritten">
                      <p><strong>This is a demonstration site.</strong> All data shown for this buoy is simulated and for testing purposes only.</p>
                      <p>Real-time readings, historical data, and sensor information are generated for demonstration and may not reflect actual oceanographic conditions.</p>
                      <p><strong>Do not use this data for navigation, research, or safety purposes.</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Accuracy Disclaimer */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 hand-drawn-box">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 font-serif">Data Accuracy & Reliability</h3>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2 font-handwritten">
                    <p><strong>Sensor Accuracy:</strong> Temperature ±0.1°C, Salinity ±0.02 PSU, pH ±0.02, Wave Height ±0.05m</p>
                    <p><strong>Data Quality:</strong> All readings undergo real-time quality control. Data marked as &quot;Warning&quot; may have reduced accuracy.</p>
                    <p><strong>Calibration:</strong> Sensors are calibrated every 6 months. Last calibration dates available in metadata.</p>
                    <p><strong>Limitations:</strong> Environmental conditions may affect sensor performance. Use caution during extreme weather events.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Data Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hand-drawn-box">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 font-serif">
                <Download className="h-5 w-5 text-ocean-600 dark:text-ocean-400" />
                Download Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-handwritten">
                Access historical and real-time data from this buoy in various formats.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  href={`/data/download?buoy=${buoy.id}&format=csv`}
                  className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-ocean-300 dark:hover:border-ocean-700 transition-colors doodle-border"
                >
                  <FileText className="h-8 w-8 text-ocean-600 dark:text-ocean-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white font-serif">CSV Format</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-handwritten">Comma-separated values</p>
                  </div>
                </Link>
                <Link 
                  href={`/data/download?buoy=${buoy.id}&format=json`}
                  className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-ocean-300 dark:hover:border-ocean-700 transition-colors doodle-border"
                >
                  <FileJson className="h-8 w-8 text-ocean-600 dark:text-ocean-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white font-serif">JSON Format</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-handwritten">JavaScript Object Notation</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Location Map */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hand-drawn-box">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 font-serif">
                  <MapPin className="h-5 w-5 text-ocean-600 dark:text-ocean-400" />
                  Location
                </h3>
              </div>
              <div className="h-64">
                <MiniMap 
                  location={buoy.location}
                  status={buoy.status === 'Online' ? 'active' : 'inactive'}
                  height="h-64"
                />
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 font-handwritten">Latitude:</span>
                    <span className="font-mono text-gray-900 dark:text-white">{buoy.location.lat.toFixed(6)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 font-handwritten">Longitude:</span>
                    <span className="font-mono text-gray-900 dark:text-white">{buoy.location.lng.toFixed(6)}°</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Measurements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hand-drawn-box">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 font-serif">
                <Activity className="h-5 w-5 text-ocean-600 dark:text-ocean-400" />
                Current Readings
              </h3>
              <div className="space-y-4">
                {Object.entries(buoy.data || {}).map(([key, value]) => {
                  if (value === undefined || value === null) return null
                  
                  const labels: Record<string, { label: string; unit: string }> = {
                    waterTemp: { label: 'Water Temperature', unit: '°C' },
                    waveHeight: { label: 'Wave Height', unit: 'm' },
                    salinity: { label: 'Salinity', unit: 'PSU' },
                    ph: { label: 'pH Level', unit: '' },
                    dissolvedOxygen: { label: 'Dissolved Oxygen', unit: 'mg/L' },
                    conductivity: { label: 'Conductivity', unit: 'mS/cm' },
                    turbidity: { label: 'Turbidity', unit: 'NTU' }
                  }
                  
                  const config = labels[key] || { label: key, unit: '' }
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg doodle-border">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-handwritten">{config.label}</span>
                      <span className="text-lg font-bold text-ocean-600 dark:text-ocean-400 font-mono">
                        {typeof value === 'number' ? value.toFixed(2) : value}{config.unit}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hand-drawn-box">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-serif">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href={`/data/api#buoy-${buoy.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-3 border border-ocean-300 dark:border-ocean-700 text-ocean-600 dark:text-ocean-400 hover:bg-ocean-50 dark:hover:bg-ocean-900/20 rounded-lg transition-colors font-handwritten blob-shape-alt"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  API Documentation
                </Link>
                <Link 
                  href="/data/browse"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg transition-colors font-serif blob-shape"
                >
                  Browse Other Buoys
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 