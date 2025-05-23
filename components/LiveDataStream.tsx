'use client'

import { useState, useEffect } from 'react'
import { Activity, AlertCircle, Wifi, WifiOff, TrendingUp, TrendingDown } from 'lucide-react'

interface DataPoint {
  timestamp: string
  value: number
  trend?: 'up' | 'down' | 'stable'
}

interface StreamData {
  waterTemp: DataPoint[]
  waveHeight: DataPoint[]
  salinity: DataPoint[]
  ph: DataPoint[]
  dissolvedOxygen: DataPoint[]
}

interface LiveDataStreamProps {
  buoyId: string
  buoyName: string
  isActive?: boolean
}

export default function LiveDataStream({ buoyId, buoyName, isActive = true }: LiveDataStreamProps) {
  const [streamData, setStreamData] = useState<StreamData>({
    waterTemp: [],
    waveHeight: [],
    salinity: [],
    ph: [],
    dissolvedOxygen: []
  })
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting')
  const [dataAge, setDataAge] = useState(0)

  // Simulate real-time data streaming
  useEffect(() => {
    if (!isActive) {
      setConnectionStatus('disconnected')
      return
    }

    // Simulate connection establishment
    const connectionTimer = setTimeout(() => {
      setConnectionStatus('connected')
    }, 1500)

    // Simulate data streaming
    const streamInterval = setInterval(() => {
      const now = new Date()
      const timestamp = now.toISOString()

      setStreamData(prev => {
        const generateValue = (base: number, variance: number) => {
          return base + (Math.random() - 0.5) * variance
        }

        const getTrend = (current: number, previous?: number): 'up' | 'down' | 'stable' => {
          if (!previous) return 'stable'
          const diff = current - previous
          if (Math.abs(diff) < 0.1) return 'stable'
          return diff > 0 ? 'up' : 'down'
        }

        const addDataPoint = (array: DataPoint[], value: number) => {
          const lastValue = array[array.length - 1]?.value
          const newPoint = {
            timestamp,
            value: parseFloat(value.toFixed(2)),
            trend: getTrend(value, lastValue)
          }
          // Keep only last 20 data points
          return [...array.slice(-19), newPoint]
        }

        return {
          waterTemp: addDataPoint(prev.waterTemp, generateValue(22.5, 0.5)),
          waveHeight: addDataPoint(prev.waveHeight, generateValue(1.2, 0.3)),
          salinity: addDataPoint(prev.salinity, generateValue(35.0, 0.2)),
          ph: addDataPoint(prev.ph, generateValue(8.1, 0.05)),
          dissolvedOxygen: addDataPoint(prev.dissolvedOxygen, generateValue(6.5, 0.3))
        }
      })

      setDataAge(0)
    }, 3000) // Update every 3 seconds

    // Update data age
    const ageInterval = setInterval(() => {
      setDataAge(prev => prev + 1)
    }, 1000)

    return () => {
      clearTimeout(connectionTimer)
      clearInterval(streamInterval)
      clearInterval(ageInterval)
    }
  }, [isActive])

  const formatDataAge = (seconds: number) => {
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ${seconds % 60}s ago`
  }

  const getLatestValue = (dataArray: DataPoint[]) => {
    return dataArray[dataArray.length - 1]
  }

  const renderTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-red-500" />
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-blue-500" />
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hand-drawn-box">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 font-serif">
            <Activity className="h-5 w-5 text-ocean-600 dark:text-ocean-400" />
            Live Data Stream
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-handwritten">
            {buoyName} • {buoyId}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400 font-handwritten">
                    Connected
                  </span>
                </>
              ) : connectionStatus === 'connecting' ? (
                <>
                  <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400 font-handwritten">
                    Connecting...
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400 font-handwritten">
                    Disconnected
                  </span>
                </>
              )}
            </div>
            {connectionStatus === 'connected' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                Last update: {formatDataAge(dataAge)}
              </p>
            )}
          </div>
        </div>
      </div>

      {connectionStatus === 'connected' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Water Temperature */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800/50 doodle-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 font-handwritten">Water Temp</h4>
                {renderTrendIcon(getLatestValue(streamData.waterTemp)?.trend)}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                {getLatestValue(streamData.waterTemp)?.value || '--'}°C
              </p>
              <div className="mt-2 h-12 flex items-end gap-1">
                {streamData.waterTemp.slice(-10).map((point, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-red-400 dark:bg-red-600 rounded-t opacity-80"
                    style={{
                      height: `${((point.value - 20) / 5) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Wave Height */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/50 doodle-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 font-handwritten">Wave Height</h4>
                {renderTrendIcon(getLatestValue(streamData.waveHeight)?.trend)}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                {getLatestValue(streamData.waveHeight)?.value || '--'}m
              </p>
              <div className="mt-2 h-12 flex items-end gap-1">
                {streamData.waveHeight.slice(-10).map((point, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-400 dark:bg-blue-600 rounded-t opacity-80"
                    style={{
                      height: `${(point.value / 3) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* pH */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800/50 doodle-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 font-handwritten">pH Level</h4>
                {renderTrendIcon(getLatestValue(streamData.ph)?.trend)}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                {getLatestValue(streamData.ph)?.value || '--'}
              </p>
              <div className="mt-2 h-12 flex items-end gap-1">
                {streamData.ph.slice(-10).map((point, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-purple-400 dark:bg-purple-600 rounded-t opacity-80"
                    style={{
                      height: `${((point.value - 7.5) / 1) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50 hand-drawn-box-alt">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium font-serif">Live Transmission Active</p>
                <p className="text-xs mt-1 text-blue-600 dark:text-blue-400 font-handwritten">
                  Data is being transmitted via satellite link every 3 seconds. Minor fluctuations are normal due to ocean dynamics.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : connectionStatus === 'connecting' ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-ocean-600 dark:border-ocean-400 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-handwritten">
            Establishing satellite connection...
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
            This may take a few seconds
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <WifiOff className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-handwritten">
            No active data stream
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
            The buoy may be offline or undergoing maintenance
          </p>
        </div>
      )}
    </div>
  )
} 