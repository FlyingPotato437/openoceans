'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, ChevronDown, ArrowDownToLine, BarChart3, Waves, Droplet, Beaker, ArrowLeft } from 'lucide-react'

// Sample dataset categories
const CATEGORIES = [
  { id: 'all', name: 'All Datasets' },
  { id: 'temperature', name: 'Temperature' },
  { id: 'salinity', name: 'Salinity' },
  { id: 'ph', name: 'pH Levels' },
  { id: 'oxygen', name: 'Dissolved Oxygen' },
  { id: 'reef', name: 'REEFlect Coral Data' },
]

// Sample datasets
const ALL_DATASETS = [
  {
    id: 'global-temp',
    name: 'Global Ocean Temperature',
    description: 'Comprehensive temperature readings from our global buoy network with historical trends and anomaly detection.',
    category: 'temperature',
    size: '24.5 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-28',
    icon: <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Global',
    buoys: 'All',
    timeframe: '2020-2023',
    frequency: 'Hourly'
  },
  {
    id: 'pacific-temp',
    name: 'Pacific Ocean Temperature',
    description: 'Temperature data specifically from Pacific Ocean monitoring stations with regional analysis.',
    category: 'temperature',
    size: '10.2 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-28',
    icon: <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Pacific',
    buoys: 'B001, B008, B015',
    timeframe: '2020-2023',
    frequency: 'Hourly'
  },
  {
    id: 'global-salinity',
    name: 'Global Ocean Salinity',
    description: 'Salinity measurements from across the global network with time-series analysis and seasonal variations.',
    category: 'salinity',
    size: '18.7 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-28',
    icon: <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Global',
    buoys: 'All',
    timeframe: '2020-2023',
    frequency: 'Hourly'
  },
  {
    id: 'global-ph',
    name: 'Global Ocean pH Levels',
    description: 'Comprehensive pH measurements from across our buoy network with acidification trend analysis.',
    category: 'ph',
    size: '15.3 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-27',
    icon: <Beaker className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Global',
    buoys: 'All',
    timeframe: '2020-2023',
    frequency: 'Hourly'
  },
  {
    id: 'global-oxygen',
    name: 'Global Dissolved Oxygen',
    description: 'Dissolved oxygen concentration data from our monitoring network with hypoxic zone identification.',
    category: 'oxygen',
    size: '22.1 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-27',
    icon: <Waves className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Global',
    buoys: 'All',
    timeframe: '2020-2023',
    frequency: 'Hourly'
  },
  {
    id: 'reef-health',
    name: 'REEFlect Coral Health Index',
    description: 'Specialized coral reef health metrics from REEFlect buoys with bleaching risk assessment and trend analysis.',
    category: 'reef',
    size: '12.8 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-26',
    icon: <BarChart3 className="h-5 w-5 text-coral-600 dark:text-coral-400" />,
    region: 'Coral Reefs',
    buoys: 'B002, B014, B015',
    timeframe: '2021-2023',
    frequency: 'Hourly'
  },
  {
    id: 'reef-temperature',
    name: 'REEFlect Coral Temperature Anomalies',
    description: 'High-resolution temperature data from coral reef sites with anomaly detection for early bleaching warnings.',
    category: 'reef',
    size: '9.6 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-26',
    icon: <Beaker className="h-5 w-5 text-coral-600 dark:text-coral-400" />,
    region: 'Coral Reefs',
    buoys: 'B002, B014, B015',
    timeframe: '2021-2023',
    frequency: '15 Minutes'
  },
  {
    id: 'complete-multi',
    name: 'Complete Multiparameter Dataset',
    description: 'Complete dataset with all parameters (temperature, salinity, pH, dissolved oxygen) from our global network.',
    category: 'all',
    size: '78.6 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-28',
    icon: <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Global',
    buoys: 'All',
    timeframe: '2020-2023',
    frequency: 'Hourly'
  },
]

export default function BrowseDataPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtersVisible, setFiltersVisible] = useState(false)
  
  // Filter datasets based on category and search
  const filteredDatasets = ALL_DATASETS.filter(dataset => {
    const matchesCategory = selectedCategory === 'all' || dataset.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })
  
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
                Browse Datasets
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Explore our comprehensive collection of ocean monitoring data
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-10 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 dark:focus:ring-ocean-400"
              />
            </div>
            
            <button 
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-ocean-100 dark:bg-ocean-900 text-ocean-800 dark:text-ocean-100 hover:bg-ocean-200 dark:hover:bg-ocean-800 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters</span>
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${filtersVisible ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {filtersVisible && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top duration-200">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Category</div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category.id 
                        ? 'bg-ocean-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } transition-colors`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {filteredDatasets.length} {filteredDatasets.length === 1 ? 'dataset' : 'datasets'} found
              </h2>
            </div>
            
            <div className="space-y-6">
              {filteredDatasets.map(dataset => (
                <div key={dataset.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 mr-4">
                        {dataset.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{dataset.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{dataset.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Region</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.region}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Buoys</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.buoys}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Timeframe</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.timeframe}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Frequency</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.frequency}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Size</div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.size}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Format</div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.format}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Updated</div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.lastUpdated}</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 sm:mt-0 flex space-x-2">
                            <Link 
                              href={`/data/download?dataset=${dataset.id}`} 
                              className="inline-flex items-center px-4 py-2 rounded-md bg-ocean-600 hover:bg-ocean-700 text-white transition-colors"
                            >
                              <ArrowDownToLine className="h-4 w-4 mr-2" />
                              <span>Download</span>
                            </Link>
                            <Link 
                              href={`/data/api?dataset=${dataset.id}`} 
                              className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <span>API Access</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredDatasets.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-10 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No datasets match your search criteria. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 