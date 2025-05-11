'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download, FileJson, FileText, FileSpreadsheet, Clipboard, Check, ArrowRight, ExternalLink, BarChart2, Globe, Clock, Database } from 'lucide-react'
import { downloadData } from '@/lib/download'

// Sample datasets - Reduced to 5
const DATASETS = [
  {
    id: 'temperature',
    name: 'Temperature Data',
    description: 'Sea surface temperature readings from our network of ocean buoys.',
    size: 'Large (Generated)', // Updated size to reflect generated data
    formats: ['csv', 'json', 'excel'],
    lastUpdated: new Date().toISOString().split('T')[0], // Dynamic date
    image: '/images/temp-data.jpg',
    stats: {
      records: '5 buoys, 10k readings', // Updated stats
      timespan: '2022-Present',
      regions: 'Varied (Generated)',
      samplingRate: 'Hourly (Generated)'
    }
  },
  { 
    id: 'salinity',
    name: 'Salinity Data',
    description: 'Ocean salinity measurements from our global buoy network.',
    size: 'Large (Generated)',
    formats: ['csv', 'json', 'excel'],
    lastUpdated: new Date().toISOString().split('T')[0],
    image: '/images/salinity-data.jpg',
    stats: {
      records: '5 buoys, 10k readings',
      timespan: '2022-Present',
      regions: 'Varied (Generated)',
      samplingRate: 'Hourly (Generated)'
    }
  },
  {
    id: 'ph',
    name: 'pH Levels',
    description: 'Ocean acidity (pH) readings from our monitoring stations.',
    size: 'Large (Generated)',
    formats: ['csv', 'json', 'excel'],
    lastUpdated: new Date().toISOString().split('T')[0],
    image: '/images/ph-data.jpg',
    stats: {
      records: '5 buoys, 10k readings',
      timespan: '2022-Present',
      regions: 'Varied (Generated)',
      samplingRate: 'Hourly (Generated)'
    }
  },
  {
    id: 'dissolved_oxygen',
    name: 'Dissolved Oxygen',
    description: 'Dissolved oxygen concentration measurements from our buoys.',
    size: 'Large (Generated)',
    formats: ['csv', 'json', 'excel'],
    lastUpdated: new Date().toISOString().split('T')[0],
    image: '/images/oxygen-data.jpg',
    stats: {
      records: '5 buoys, 10k readings',
      timespan: '2022-Present',
      regions: 'Varied (Generated)',
      samplingRate: 'Hourly (Generated)'
    }
  },
  {
    id: 'reef', // Keeping this one as it was specifically mentioned elsewhere (REEFlect)
    name: 'REEFlect Coral Data',
    description: 'Specialized coral reef monitoring data from REEFlect buoys.',
    size: 'Large (Generated)',
    formats: ['csv', 'json', 'excel'],
    lastUpdated: new Date().toISOString().split('T')[0],
    image: '/images/coral-data.jpg',
    stats: {
      records: '5 buoys, 10k readings',
      timespan: '2022-Present',
      regions: 'Varied (Generated)',
      samplingRate: 'Hourly (Generated)'
    }
  }
];

// Format icon mapping
const FORMAT_ICONS = {
  csv: <FileText className="h-5 w-5" />,
  json: <FileJson className="h-5 w-5" />,
  excel: <FileSpreadsheet className="h-5 w-5" />,
}

export default function DownloadDataPage() {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [queryDataset, setQueryDataset] = useState<string | null>(null)
  
  // Handle URL query parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const datasetParam = params.get('dataset')
      
      if (datasetParam) {
        setSelectedDataset(datasetParam)
        setQueryDataset(datasetParam)
      }
    }
  }, [])
  
  const handleCopyAPIKey = () => {
    navigator.clipboard.writeText('api_key_12345abcdef6789ghijklmnopqrstuvwxyz')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleDownload = () => {
    if (!selectedDataset || !selectedFormat) return;

    // selectedDataset is the ID like 'temperature', 'salinity', etc.
    // selectedFormat is 'csv', 'json', or 'excel'.

    // The first argument to downloadData (originalUrl) is not critical for data selection anymore,
    // as the specific data file is chosen based on options.filename inside downloadData.
    // We can pass a placeholder or a generic path.
    const placeholderUrl = `/api/data_placeholder/${selectedDataset}`;

    downloadData(placeholderUrl, {
      filename: `openocean_${selectedDataset}_data`, // e.g., openocean_temperature_data
      format: selectedFormat as 'csv' | 'json' | 'excel'
    });
  }
  
  const dataset = selectedDataset ? DATASETS.find(d => d.id === selectedDataset) : null
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-ocean-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <Link href="/data" className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to Data</span>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Download Data
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Download complete ocean monitoring datasets in various formats
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {queryDataset && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 rounded-sm p-4 mb-8 animate-in fade-in duration-300">
                <p className="text-blue-800 dark:text-blue-300">
                  You've been directed to download the {DATASETS.find(d => d.id === queryDataset)?.name}. Please select your preferred format below.
                </p>
              </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 mb-10 overflow-hidden">
              <div className="border-l-4 border-ocean-500 dark:border-ocean-400 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="inline-block w-6 h-6 rounded-sm bg-ocean-500 text-white flex items-center justify-center text-xs mr-2.5">1</span>
                  Select a Dataset
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {DATASETS.map(dataset => (
                    <div 
                      key={dataset.id}
                      onClick={() => setSelectedDataset(dataset.id)}
                      className={`cursor-pointer rounded-sm flex flex-col overflow-hidden transition-all duration-200 ${
                        selectedDataset === dataset.id
                          ? 'ring-2 ring-ocean-500 dark:ring-ocean-400 shadow-lg translate-y-[-2px]'
                          : 'border border-gray-200 dark:border-gray-700 hover:border-ocean-200 dark:hover:border-gray-600 hover:shadow-md hover:translate-y-[-2px]'
                      }`}
                    >
                      <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
                        <Image 
                          src={dataset.image}
                          alt={dataset.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="transition-opacity"
                        />
                      </div>
                      <div className={`p-4 flex-1 ${
                        selectedDataset === dataset.id
                          ? 'bg-ocean-50 dark:bg-ocean-900/40 border-t-2 border-ocean-500 dark:border-ocean-400'
                          : 'bg-white dark:bg-gray-800'
                      }`}>
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-white">{dataset.name}</h3>
                          <div className={`rounded-sm h-5 w-5 ${
                            selectedDataset === dataset.id
                              ? 'bg-ocean-500 dark:bg-ocean-400 text-white flex items-center justify-center'
                              : 'border-2 border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedDataset === dataset.id && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{dataset.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Database className="h-3 w-3 mr-1" />
                            <span>{dataset.stats.records} records</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{dataset.stats.timespan}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Globe className="h-3 w-3 mr-1" />
                            <span>{dataset.stats.regions}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <BarChart2 className="h-3 w-3 mr-1" />
                            <span>{dataset.stats.samplingRate}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{dataset.size}</span>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Updated: {dataset.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {selectedDataset && (
              <div className="bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 mb-10 overflow-hidden animate-in slide-in-from-top duration-300">
                <div className="border-l-4 border-ocean-500 dark:border-ocean-400 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="inline-block w-6 h-6 rounded-sm bg-ocean-500 text-white flex items-center justify-center text-xs mr-2.5">2</span>
                    Select Format
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {dataset?.formats.map(format => (
                      <div 
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        className={`cursor-pointer p-5 rounded-sm flex flex-col items-center transition-all duration-200 ${
                          selectedFormat === format
                            ? 'bg-ocean-50 dark:bg-ocean-900/40 ring-2 ring-ocean-500 dark:ring-ocean-400 shadow-md translate-y-[-2px]'
                            : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 hover:shadow-md hover:translate-y-[-2px]'
                        }`}
                      >
                        <div className={`p-4 rounded-sm ${
                          selectedFormat === format
                            ? 'bg-ocean-100 dark:bg-ocean-900/60 text-ocean-600 dark:text-ocean-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}>
                          {FORMAT_ICONS[format as keyof typeof FORMAT_ICONS]}
                        </div>
                        <div className="text-center mt-3">
                          <h3 className="font-medium text-gray-900 dark:text-white uppercase">{format}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {format === 'csv' && 'Comma-separated values'}
                            {format === 'json' && 'JavaScript Object Notation'}
                            {format === 'excel' && 'Microsoft Excel format'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {selectedDataset && selectedFormat && (
              <div className="bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 mb-10 overflow-hidden animate-in slide-in-from-top duration-300">
                <div className="border-l-4 border-ocean-500 dark:border-ocean-400 p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="inline-block w-6 h-6 rounded-sm bg-ocean-500 text-white flex items-center justify-center text-xs mr-2.5">3</span>
                    Download
                  </h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center">
                        <div className="relative h-14 w-14 rounded-sm overflow-hidden mr-4 hidden sm:block">
                          <Image 
                            src={dataset?.image || ''}
                            alt={dataset?.name || ''}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {DATASETS.find(d => d.id === selectedDataset)?.name} ({selectedFormat.toUpperCase()})
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {dataset?.size} • {dataset?.stats.records} records • Ready for download
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center px-6 py-3 rounded-sm bg-ocean-600 hover:bg-ocean-700 dark:bg-ocean-600 dark:hover:bg-ocean-700 text-white font-medium transition-colors shadow-md hover:shadow-lg"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        <span>Download File</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      API Access
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      You can also access this data programmatically through our API:
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-sm p-4 font-mono text-sm mb-4 overflow-x-auto border-l-2 border-ocean-500 dark:border-ocean-400">
                      <code>
                        GET https://api.openocean.org/v1/data/{selectedDataset}?format={selectedFormat}&api_key=YOUR_API_KEY
                      </code>
                    </div>
                    
                    <div className="flex items-center mb-6">
                      <div className="relative flex-1 mr-2">
                        <input 
                          type="text" 
                          value="api_key_12345abcdef6789ghijklmnopqrstuvwxyz" 
                          readOnly
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 dark:focus:ring-ocean-400 text-gray-400 dark:text-gray-500 font-mono"
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400 font-mono">API Key: </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleCopyAPIKey}
                        className="inline-flex items-center px-4 py-2 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Clipboard className="h-4 w-4 mr-2" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <Link 
                      href="/data/api" 
                      className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-300 font-medium transition-colors"
                    >
                      <span>View complete API documentation</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-ocean-50 dark:bg-gray-800 rounded-sm shadow-lg border-l-4 border-ocean-500 dark:border-ocean-400 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-ocean-100 dark:bg-ocean-900 rounded-sm mr-4">
                    <ExternalLink className="h-5 w-5 text-ocean-600 dark:text-ocean-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    REEFlect Specialized Datasets
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Looking for the specialized coral reef monitoring datasets? Through our partnership with REEFlect, we offer advanced coral reef analytics and monitoring data.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/data/browse?category=reef" 
                    className="inline-flex items-center px-5 py-2.5 rounded-sm bg-ocean-600 hover:bg-ocean-700 text-white transition-colors shadow-md hover:shadow-lg"
                  >
                    <span>Browse REEFlect Data</span>
                  </Link>
                  
                  <a 
                    href="https://reeflect.org/data" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    <span>Visit REEFlect Data Portal</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 