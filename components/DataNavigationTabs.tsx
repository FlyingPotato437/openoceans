'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Database, Download, BarChart3, Search, Filter, SortAsc, Grid, List, Map, RefreshCw } from 'lucide-react'

interface DataNavigationTabsProps {
  currentTab: 'browse' | 'download' | 'api'
  onTabChange: (tab: 'browse' | 'download' | 'api') => void
  isLoading?: boolean
}

interface FilterOption {
  id: string
  label: string
  count: number
}

export default function DataNavigationTabs({ currentTab, onTabChange, isLoading = false }: DataNavigationTabsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOption, setSortOption] = useState('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Sync with URL parameters
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const view = searchParams.get('view') as 'grid' | 'list' | 'map'
    
    if (search) setSearchTerm(search)
    if (sort) setSortOption(sort)
    if (view) setViewMode(view)
  }, [searchParams])

  const tabs = [
    {
      id: 'browse' as const,
      label: 'Browse Data',
      icon: <Database className="h-4 w-4" />,
      description: 'Explore datasets and buoy data',
      badge: '24 active'
    },
    {
      id: 'download' as const,
      label: 'Download',
      icon: <Download className="h-4 w-4" />,
      description: 'Get data files',
      badge: null
    },
    {
      id: 'api' as const,
      label: 'API Access',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Programmatic access',
      badge: 'New'
    }
  ]

  const filterOptions: FilterOption[] = [
    { id: 'temperature', label: 'Temperature Data', count: 12 },
    { id: 'salinity', label: 'Salinity Data', count: 8 },
    { id: 'ph', label: 'pH Levels', count: 15 },
    { id: 'coral', label: 'Coral Reef Data', count: 6 },
    { id: 'current', label: 'Ocean Currents', count: 4 }
  ]

  const sortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'size', label: 'File Size' },
    { id: 'name', label: 'Name A-Z' }
  ]

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    router.push(`?${newParams.toString()}`, { scroll: false })
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    updateURL({ search: value })
  }

  const handleTabChange = (tab: 'browse' | 'download' | 'api') => {
    onTabChange(tab)
    router.push(`/data/${tab === 'browse' ? 'browse' : tab}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 hand-drawn-box">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Tab Navigation */}
        <div className="flex items-center justify-between py-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 blob-shape ${
                  currentTab === tab.id
                    ? 'bg-ocean-600 text-white shadow-lg transform scale-105 font-serif'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-handwritten'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full font-mono ${
                      currentTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-ocean-100 dark:bg-ocean-900 text-ocean-600 dark:text-ocean-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
                {currentTab === tab.id && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-ocean-600 rotate-45"></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-handwritten">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {/* Enhanced Controls for Browse Tab */}
        {currentTab === 'browse' && (
          <div className="pb-6 space-y-4">
            {/* Search and Quick Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search datasets, buoys, or data types..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 dark:bg-gray-700 dark:text-white font-handwritten"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 font-mono"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors font-handwritten blob-shape-alt"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>

                  {filterOpen && (
                    <div className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 hand-drawn-box-alt">
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3 font-serif">Filter by Type</h3>
                        <div className="space-y-2">
                          {filterOptions.map((option) => (
                            <label key={option.id} className="flex items-center justify-between cursor-pointer">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 font-handwritten">{option.label}</span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">({option.count})</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value)
                    updateURL({ sort: e.target.value })
                  }}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-white font-handwritten"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  {[
                    { mode: 'grid' as const, icon: <Grid className="h-4 w-4" /> },
                    { mode: 'list' as const, icon: <List className="h-4 w-4" /> },
                    { mode: 'map' as const, icon: <Map className="h-4 w-4" /> }
                  ].map(({ mode, icon }) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setViewMode(mode)
                        updateURL({ view: mode })
                      }}
                      className={`px-3 py-3 transition-colors ${
                        viewMode === mode
                          ? 'bg-ocean-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {searchTerm && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-handwritten">Active filters:</span>
                <span className="px-3 py-1 bg-ocean-100 dark:bg-ocean-900 text-ocean-700 dark:text-ocean-300 rounded-full text-sm flex items-center gap-1 font-mono doodle-border">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => handleSearch('')}
                    className="ml-1 text-ocean-500 hover:text-ocean-700"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tab Description */}
        <div className="pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-handwritten">
            {tabs.find(tab => tab.id === currentTab)?.description}
          </p>
        </div>
      </div>

      {/* Close filter dropdown when clicking outside */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setFilterOpen(false)}
        />
      )}
    </div>
  )
} 