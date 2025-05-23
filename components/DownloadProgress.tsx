'use client'

import { useState, useEffect } from 'react'
import { Download, FileJson, FileText, FileSpreadsheet, Check, AlertCircle, BarChart3, Database, Eye, Clock } from 'lucide-react'

interface DownloadProgressProps {
  datasetName: string
  format: string
  fileSize: string
  onComplete: () => void
  onCancel: () => void
}

interface ProgressStage {
  id: string
  name: string
  description: string
  duration: number
}

const downloadStages: ProgressStage[] = [
  {
    id: 'prepare',
    name: 'Preparing Dataset',
    description: 'Compiling and validating data integrity...',
    duration: 2000
  },
  {
    id: 'process',
    name: 'Processing Format',
    description: 'Converting to requested format...',
    duration: 3000
  },
  {
    id: 'compress',
    name: 'Compressing File',
    description: 'Optimizing file size for download...',
    duration: 1500
  },
  {
    id: 'finalize',
    name: 'Finalizing Download',
    description: 'Preparing secure download link...',
    duration: 1000
  }
]

export default function DownloadProgress({ datasetName, format, fileSize, onComplete, onCancel }: DownloadProgressProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [dataPreview, setDataPreview] = useState<any[]>([])

  useEffect(() => {
    // Generate mock data preview
    const mockData = Array.from({ length: 5 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      buoy_id: `OO-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      water_temp: (22 + Math.random() * 3).toFixed(2),
      wave_height: (1 + Math.random() * 2).toFixed(2),
      salinity: (34 + Math.random() * 2).toFixed(2),
      ph: (7.8 + Math.random() * 0.4).toFixed(2),
      dissolved_oxygen: (6 + Math.random() * 2).toFixed(2)
    }))
    setDataPreview(mockData)
  }, [])

  useEffect(() => {
    if (currentStageIndex >= downloadStages.length) {
      setIsComplete(true)
      setDownloadUrl(`/downloads/${datasetName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.${format}`)
      onComplete()
      return
    }

    const currentStage = downloadStages[currentStageIndex]
    const progressStep = 100 / downloadStages.length
    let stageProgress = 0

    const progressInterval = setInterval(() => {
      stageProgress += 2
      const totalProgress = (currentStageIndex * progressStep) + (stageProgress * progressStep / 100)
      setProgress(Math.min(totalProgress, 100))

      if (stageProgress >= 100) {
        clearInterval(progressInterval)
        setTimeout(() => {
          setCurrentStageIndex(prev => prev + 1)
        }, 200)
      }
    }, currentStage.duration / 50)

    return () => clearInterval(progressInterval)
  }, [currentStageIndex, datasetName, format, onComplete])

  const formatIcon = {
    csv: <FileText className="h-5 w-5" />,
    json: <FileJson className="h-5 w-5" />,
    excel: <FileSpreadsheet className="h-5 w-5" />
  }[format] || <FileText className="h-5 w-5" />

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hand-drawn-box">
      <div className="bg-gradient-to-r from-ocean-500 to-ocean-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {formatIcon}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif">{datasetName}</h3>
              <p className="text-ocean-100 text-sm font-mono">{format.toUpperCase()} • {fileSize}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono">{Math.round(progress)}%</div>
            <div className="text-ocean-100 text-sm font-handwritten">Complete</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-handwritten">
              {isComplete ? 'Download Ready' : downloadStages[currentStageIndex]?.name || 'Processing...'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {currentStageIndex + 1} of {downloadStages.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <div 
              className="bg-ocean-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-handwritten">
            {isComplete ? 'Your file is ready for download' : downloadStages[currentStageIndex]?.description}
          </p>
        </div>

        {/* Stage Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          {downloadStages.map((stage, index) => (
            <div
              key={stage.id}
              className={`p-3 rounded-lg border doodle-border ${
                index < currentStageIndex
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : index === currentStageIndex
                  ? 'bg-ocean-50 dark:bg-ocean-900/20 border-ocean-200 dark:border-ocean-800'
                  : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {index < currentStageIndex ? (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : index === currentStageIndex ? (
                  <div className="h-4 w-4 border-2 border-ocean-600 dark:border-ocean-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                )}
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 font-handwritten">
                  {stage.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Data Preview */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-serif">Data Preview</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto hand-drawn-box-alt">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-1 px-2 text-gray-600 dark:text-gray-400 font-handwritten">Timestamp</th>
                  <th className="text-left py-1 px-2 text-gray-600 dark:text-gray-400 font-handwritten">Buoy ID</th>
                  <th className="text-left py-1 px-2 text-gray-600 dark:text-gray-400 font-handwritten">Temp (°C)</th>
                  <th className="text-left py-1 px-2 text-gray-600 dark:text-gray-400 font-handwritten">Wave (m)</th>
                  <th className="text-left py-1 px-2 text-gray-600 dark:text-gray-400 font-handwritten">Salinity</th>
                </tr>
              </thead>
              <tbody>
                {dataPreview.slice(0, 3).map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="py-1 px-2 text-gray-700 dark:text-gray-300 font-mono">
                      {new Date(row.timestamp).toLocaleString()}
                    </td>
                    <td className="py-1 px-2 text-gray-700 dark:text-gray-300 font-mono">{row.buoy_id}</td>
                    <td className="py-1 px-2 text-gray-700 dark:text-gray-300 font-mono">{row.water_temp}</td>
                    <td className="py-1 px-2 text-gray-700 dark:text-gray-300 font-mono">{row.wave_height}</td>
                    <td className="py-1 px-2 text-gray-700 dark:text-gray-300 font-mono">{row.salinity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 font-handwritten">
              <Database className="h-3 w-3" />
              Showing 3 of ~{(Math.random() * 50000 + 10000).toFixed(0)} records
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-handwritten">
            <BarChart3 className="h-4 w-4" />
            <span>Quality: 99.8%</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-handwritten">
            <Clock className="h-4 w-4" />
            <span>Updated: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-mono">
            <Database className="h-4 w-4" />
            <span>Version: 2.1.4</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isComplete && downloadUrl ? (
            <a
              href={downloadUrl}
              download
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors gap-2 font-serif blob-shape"
            >
              <Download className="h-5 w-5" />
              Download File
            </a>
          ) : (
            <div className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed gap-2 font-handwritten">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Preparing Download...
            </div>
          )}
          
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors font-handwritten"
          >
            Cancel
          </button>
        </div>

        {!isComplete && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hand-drawn-box">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium font-serif">Processing in Progress</p>
                <p className="text-xs mt-1 text-blue-600 dark:text-blue-400 font-handwritten">
                  Please keep this window open while we prepare your dataset. Large files may take a few minutes to process.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 