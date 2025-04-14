'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, ChevronDown, ArrowDownToLine, BarChart3, Waves, Droplet, Beaker, ArrowLeft, ThermometerSnowflake, Wind, Microscope, CloudLightning } from 'lucide-react'

// Sample dataset categories
const CATEGORIES = [
  { id: 'all', name: 'All Datasets' },
  { id: 'temperature', name: 'Temperature' },
  { id: 'salinity', name: 'Salinity' },
  { id: 'ph', name: 'pH Levels' },
  { id: 'oxygen', name: 'Dissolved Oxygen' },
  { id: 'reef', name: 'REEFlect Coral Data' },
  { id: 'currents', name: 'Ocean Currents' },
  { id: 'biodiversity', name: 'Marine Biodiversity' },
  { id: 'turbidity', name: 'Water Turbidity' },
  { id: 'chlorophyll', name: 'Chlorophyll' },
  { id: 'wave', name: 'Wave Dynamics' },
  { id: 'microplastics', name: 'Microplastics' }
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
    frequency: 'Hourly',
    image: '/images/temp-data.jpg'
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
    frequency: 'Hourly',
    image: '/images/temp-data.jpg'
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
    frequency: 'Hourly',
    image: '/images/salinity-data.jpg'
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
    frequency: 'Hourly',
    image: '/images/ph-data.jpg'
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
    frequency: 'Hourly',
    image: '/images/oxygen-data.jpg'
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
    frequency: 'Hourly',
    image: '/images/coral-data.jpg'
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
    frequency: '15 Minutes',
    image: '/images/coral-data.jpg'
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
    frequency: 'Hourly',
    image: '/images/complete-data.jpg'
  },
  {
    id: 'global-currents',
    name: 'Global Ocean Currents',
    description: 'Surface and deep-water current velocity and direction measurements from our global monitoring network.',
    category: 'currents',
    size: '31.2 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-25',
    icon: <Wind className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Global',
    buoys: 'All',
    timeframe: '2019-2023',
    frequency: '12 hours',
    image: '/images/currents-data.jpg'
  },
  {
    id: 'atlantic-currents',
    name: 'Atlantic Ocean Currents',
    description: 'Detailed current patterns for the Atlantic Ocean with Gulf Stream analysis and seasonal variations.',
    category: 'currents',
    size: '18.4 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-25',
    icon: <Wind className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Atlantic',
    buoys: 'B003, B007, B011',
    timeframe: '2019-2023',
    frequency: '12 hours',
    image: '/images/currents-data.jpg'
  },
  {
    id: 'marine-biodiversity',
    name: 'Marine Biodiversity Index',
    description: 'Species diversity and abundance data from our monitoring stations in biodiversity hotspots.',
    category: 'biodiversity',
    size: '19.8 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-24',
    icon: <Microscope className="h-5 w-5 text-green-600 dark:text-green-400" />,
    region: 'Global Hotspots',
    buoys: 'B002, B014, B015, B022',
    timeframe: '2021-2023',
    frequency: 'Monthly',
    image: '/images/biodiversity-data.jpg'
  },
  {
    id: 'reef-biodiversity',
    name: 'Coral Reef Biodiversity',
    description: 'Detailed species diversity and abundance data specifically from coral reef ecosystems.',
    category: 'biodiversity',
    size: '14.5 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-24',
    icon: <Microscope className="h-5 w-5 text-green-600 dark:text-green-400" />,
    region: 'Coral Reefs',
    buoys: 'B002, B014, B015',
    timeframe: '2021-2023',
    frequency: 'Monthly',
    image: '/images/biodiversity-data.jpg'
  },
  {
    id: 'global-turbidity',
    name: 'Global Water Turbidity',
    description: 'Water clarity and particle suspension measurements from coastal and river delta stations.',
    category: 'turbidity',
    size: '16.4 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-23',
    icon: <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Coastal, River Deltas',
    buoys: 'Coastal Network',
    timeframe: '2020-2023',
    frequency: 'Daily',
    image: '/images/turbidity-data.jpg'
  },
  {
    id: 'global-chlorophyll',
    name: 'Global Chlorophyll Concentrations',
    description: 'Phytoplankton activity indicators measured via chlorophyll concentrations across our global network.',
    category: 'chlorophyll',
    size: '21.7 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-22',
    icon: <Beaker className="h-5 w-5 text-green-600 dark:text-green-400" />,
    region: 'Global',
    buoys: 'All',
    timeframe: '2020-2023',
    frequency: '3 days',
    image: '/images/chlorophyll-data.jpg'
  },
  {
    id: 'upwelling-chlorophyll',
    name: 'Upwelling Zone Chlorophyll',
    description: 'High-resolution chlorophyll data from oceanic upwelling zones with productivity analysis.',
    category: 'chlorophyll',
    size: '16.2 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-22',
    icon: <Beaker className="h-5 w-5 text-green-600 dark:text-green-400" />,
    region: 'Upwelling Zones',
    buoys: 'B005, B008, B019',
    timeframe: '2020-2023',
    frequency: 'Daily',
    image: '/images/chlorophyll-data.jpg'
  },
  {
    id: 'global-wave',
    name: 'Global Wave Height & Frequency',
    description: 'Wave dynamics data including height, frequency, and direction from our open ocean stations.',
    category: 'wave',
    size: '25.9 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-21',
    icon: <Waves className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Open Ocean',
    buoys: 'Open Ocean Network',
    timeframe: '2019-2023',
    frequency: 'Hourly',
    image: '/images/wave-data.jpg'
  },
  {
    id: 'storm-wave',
    name: 'Storm-Generated Wave Data',
    description: 'Special dataset of wave measurements during major storm events with extreme condition analysis.',
    category: 'wave',
    size: '18.3 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-21',
    icon: <CloudLightning className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    region: 'Storm Regions',
    buoys: 'Storm-tracking Network',
    timeframe: '2019-2023',
    frequency: '15 Minutes',
    image: '/images/wave-data.jpg'
  },
  {
    id: 'global-microplastics',
    name: 'Global Microplastics Concentration',
    description: 'Measurements of microplastic particles in water samples from our global sensor network.',
    category: 'microplastics',
    size: '14.3 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-20',
    icon: <Microscope className="h-5 w-5 text-red-600 dark:text-red-400" />,
    region: 'Global Hotspots',
    buoys: 'Specialized Network',
    timeframe: '2021-2023',
    frequency: 'Weekly',
    image: '/images/microplastics-data.jpg'
  },
  {
    id: 'gyres-microplastics',
    name: 'Ocean Gyres Microplastics',
    description: 'Focused dataset on microplastic concentration in the five major ocean gyres with pollution tracking.',
    category: 'microplastics',
    size: '11.8 MB',
    format: 'CSV, JSON, Excel',
    lastUpdated: '2023-11-20',
    icon: <Microscope className="h-5 w-5 text-red-600 dark:text-red-400" />,
    region: 'Pacific, Atlantic Gyres',
    buoys: 'B006, B012, B017',
    timeframe: '2021-2023',
    frequency: 'Weekly',
    image: '/images/microplastics-data.jpg'
  }
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
      <div className="bg-gradient-to-br from-ocean-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 border-b-2 border-ocean-200 dark:border-ocean-800">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center mb-4">
            <Link href="/data" className="flex items-center text-ocean-700 hover:text-ocean-900 dark:text-ocean-300 dark:hover:text-ocean-100 mr-2 font-medium transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to Data</span>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-ocean-950 dark:text-ocean-50 tracking-tight">
                Browse Datasets
              </h1>
              <p className="text-ocean-700 dark:text-ocean-300 mt-1">
                Explore our comprehensive collection of ocean monitoring data
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-ocean-500 dark:text-ocean-400" />
              </div>
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-12 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-ocean-200 dark:border-ocean-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 dark:focus:ring-ocean-400 shadow-sm"
              />
            </div>
            
            <button 
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="inline-flex items-center px-5 py-3 rounded-lg bg-ocean-600 text-white hover:bg-ocean-700 dark:bg-ocean-700 dark:hover:bg-ocean-600 transition-colors shadow-md font-medium"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters</span>
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${filtersVisible ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {filtersVisible && (
            <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-ocean-200 dark:border-ocean-800 shadow-lg animate-in slide-in-from-top duration-200">
              <div className="text-sm font-medium text-ocean-800 dark:text-ocean-200 mb-3">Filter by Category</div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category.id 
                        ? 'bg-ocean-600 dark:bg-ocean-500 text-white shadow-md transform scale-105'
                        : 'bg-ocean-100 dark:bg-gray-700 text-ocean-800 dark:text-ocean-200 hover:bg-ocean-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mt-4">
              <div className="text-sm text-ocean-600 dark:text-ocean-400 mb-6 font-medium">
                Showing {filteredDatasets.length} datasets
            </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredDatasets.map(dataset => (
                  <div 
                    key={dataset.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-ocean-100 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-xl hover:border-ocean-300 dark:hover:border-ocean-600 transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 bg-gradient-to-r from-ocean-100 to-blue-100 dark:from-ocean-900 dark:to-blue-900">
                      <Image 
                        src={dataset.image}
                        alt={dataset.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="mix-blend-multiply dark:mix-blend-lighten"
                      />
                      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
                        <div className="rounded-full bg-ocean-100 dark:bg-ocean-800 p-1.5">
                        {dataset.icon}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-ocean-900 dark:text-ocean-100">{dataset.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-4 flex-1">{dataset.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-ocean-700 dark:text-ocean-300 mt-2 mb-4">
                        <div className="bg-ocean-50 dark:bg-gray-700 p-2 rounded-lg">
                          <span className="font-semibold">Region:</span> {dataset.region}
                        </div>
                        <div className="bg-ocean-50 dark:bg-gray-700 p-2 rounded-lg">
                          <span className="font-semibold">Time:</span> {dataset.timeframe}
                          </div>
                        <div className="bg-ocean-50 dark:bg-gray-700 p-2 rounded-lg">
                          <span className="font-semibold">Frequency:</span> {dataset.frequency}
                          </div>
                        <div className="bg-ocean-50 dark:bg-gray-700 p-2 rounded-lg">
                          <span className="font-semibold">Format:</span> {dataset.format}
                          </div>
                          </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t-2 border-ocean-100 dark:border-gray-700">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>{dataset.size}</span>
                          <span className="mx-2">•</span>
                          <span>Updated: {dataset.lastUpdated}</span>
                        </div>
                        
                            <Link 
                          href={`/data/download?dataset=${dataset.id.split('-')[0]}`} 
                          className="inline-flex items-center px-4 py-2 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg shadow-sm text-sm font-medium transition-colors"
                            >
                          <ArrowDownToLine className="h-3.5 w-3.5 mr-2" />
                              <span>Download</span>
                            </Link>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              
              {filteredDatasets.length === 0 && (
                <div className="bg-ocean-50 dark:bg-gray-800 rounded-lg p-12 text-center border-2 border-ocean-200 dark:border-ocean-800">
                  <p className="text-ocean-600 dark:text-ocean-300 font-medium">No datasets found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 