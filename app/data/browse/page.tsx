'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { metadata } from './metadata'
import { useRouter } from 'next/navigation'
import { Search, ArrowDownToLine, ChevronLeft, AlertTriangle, CheckCircle, MapPin, Thermometer, Waves as WavesIcon, Droplet as SalinityIcon, Zap as PHIcon, Wind as OxygenIcon, ArrowRight, List, LayoutGrid, Map as MapIcon } from 'lucide-react'
import { useSimulatedBuoyData } from '@/lib/hooks/useSimulatedBuoyData'
import { Buoy, BuoyStatus, BuoyDataMetrics } from '@/lib/types'

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="text-center py-10">Loading Map...</div>,
});

type BuoyMapDisplayDataForBrowse = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  mappedStatus?: 'active' | 'warning' | 'offline' | 'maintenance' | 'inactive';
  originalStatus?: BuoyStatus;
  type?: string;
  fullMetrics?: BuoyDataMetrics;
};

const getStatusIconAndColor = (status: BuoyStatus) => {
  switch (status.toLowerCase()) {
    case 'online':
      return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, color: 'text-green-500' };
    case 'warning':
      return { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, color: 'text-yellow-500' };
    case 'offline':
      return { icon: <AlertTriangle className="h-5 w-5 text-red-500" />, color: 'text-red-500' };
    default:
      return { icon: <CheckCircle className="h-5 w-5 text-gray-500" />, color: 'text-gray-500' };
  }
};

// Helper function to map BuoyStatus to the icon status string
const mapBuoyStatusToIconStatus = (status: BuoyStatus | undefined): 'active' | 'warning' | 'offline' | 'maintenance' | 'inactive' => {
  if (!status) return 'inactive';
  switch (status) {
    case 'Online': return 'active';
    case 'Offline': return 'offline';
    case 'Warning': return 'warning';
    case 'Maintenance': return 'maintenance';
    default: return 'inactive';
  }
};

export default function BrowseDataPage() {
  const allSimulatedBuoys = useSimulatedBuoyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const router = useRouter();

  const filteredBuoys = useMemo(() => {
    return allSimulatedBuoys.filter(buoy => 
      buoy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buoy.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allSimulatedBuoys]);

  // Transform Buoy[] to SimplifiedBuoyDataForMap[] for the MapComponent
  const mapBuoysForDisplay = useMemo(() => {
    return filteredBuoys.map(buoy => ({
      id: buoy.id,
      name: buoy.name,
      location: buoy.location,
      status: buoy.status, // Display status for popup
      waterTemp: buoy.data.waterTemp,
      waveHeight: buoy.data.waveHeight,
      salinity: buoy.data.salinity,
      iconStatus: mapBuoyStatusToIconStatus(buoy.status) // For marker icon
      // No longer using BuoyMapDisplayDataForBrowse explicitly if SimplifiedBuoyDataForMap is the target
    }));
  }, [filteredBuoys]);

  const browsePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: metadata.title as string,
    description: metadata.description as string,
    url: 'https://openocean.org/data/browse',
    isPartOf: {
      '@type': 'WebSite',
      url: 'https://openocean.org/'
    },
    // You could potentially add schema for a SearchAction here if the page itself is a primary search interface
    // or Dataset schema if the page lists datasets.
  };

  const handleBuoySelectOnMap = (buoy: { id: string }) => { // Expects an object with id from MapComponent
    router.push(`/buoy/${buoy.id}`);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {filteredBuoys.map((buoy: Buoy) => {
        const { icon: statusIcon } = getStatusIconAndColor(buoy.status);
        return (
          <div 
            key={`grid-${buoy.id}`} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-rotate-1 hover:scale-[1.02] border border-gray-200 dark:border-gray-700/80 group"
          >
            {buoy.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden">
                <Image 
                  src={buoy.imageUrl}
                  alt={buoy.name}
                  fill
                  style={{objectFit: 'cover'}}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-md backdrop-blur-sm flex items-center gap-1.5">
                  {statusIcon}
                  {buoy.status}
                </div>
              </div>
            )}
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-serif truncate" title={buoy.name}>{buoy.name}</h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <MapPin className="h-4 w-4 mr-1.5 text-ocean-500" />
                <span>{buoy.location.lat.toFixed(2)}, {buoy.location.lng.toFixed(2)}</span>
                {buoy.depth && <span className="ml-2">Depth: {buoy.depth}</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4 text-gray-700 dark:text-gray-300 flex-grow">
                  <div className="flex items-center">
                      <Thermometer className="h-4 w-4 mr-1.5 text-red-500" />
                      <span>Temp: {buoy.data.waterTemp ?? 'N/A'}°C</span>
                  </div>
                  <div className="flex items-center">
                      <WavesIcon className="h-4 w-4 mr-1.5 text-blue-500" />
                      <span>Wave H: {buoy.data.waveHeight ?? 'N/A'}m</span>
                  </div>
                  <div className="flex items-center">
                      <SalinityIcon className="h-4 w-4 mr-1.5 text-teal-500" />
                      <span>Salinity: {buoy.data.salinity ?? 'N/A'} PSU</span>
                  </div>
                  <div className="flex items-center">
                      <PHIcon className="h-4 w-4 mr-1.5 text-purple-500" />
                      <span>pH: {buoy.data.ph ?? 'N/A'}</span>
                  </div>
                    <div className="flex items-center">
                      <OxygenIcon className="h-4 w-4 mr-1.5 text-cyan-500" />
                      <span>Oxygen: {buoy.data.dissolvedOxygen ?? 'N/A'} mg/L</span>
                  </div>
              </div>

              {buoy.notes && 
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic line-clamp-2">Note: {buoy.notes}</p>
              }
              
              <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700/50">
                <Link href={`/buoy/${buoy.id}`} className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-ocean-600 hover:bg-ocean-700 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                  View Details
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredBuoys.map((buoy: Buoy) => {
        const { icon: statusIcon, color: statusColor } = getStatusIconAndColor(buoy.status);
        return (
          <div key={`list-${buoy.id}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 border border-gray-200 dark:border-gray-700/80 hover:shadow-xl transition-shadow duration-200">
            {buoy.imageUrl && (
              <div className="relative w-full md:w-32 h-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={buoy.imageUrl} alt={buoy.name} fill style={{objectFit: 'cover'}} />
              </div>
            )}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif truncate" title={buoy.name}>{buoy.name}</h2>
                <div className={`flex items-center text-sm ${statusColor} font-medium px-2 py-0.5 rounded-full bg-opacity-20`}>
                  {statusIcon}
                  <span className="ml-1.5">{buoy.status}</span>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <MapPin className="h-3 w-3 mr-1 text-ocean-500" />
                <span>{buoy.location.lat.toFixed(2)}, {buoy.location.lng.toFixed(2)}</span>
                {buoy.depth && <span className="ml-2">Depth: {buoy.depth}</span>}
                {buoy.lastTransmission && <span className="ml-2">Last Tx: {new Date(buoy.lastTransmission).toLocaleDateString()}</span>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-300 mb-3">
                <span>Temp: {buoy.data.waterTemp ?? 'N/A'}°C</span>
                <span>Wave: {buoy.data.waveHeight ?? 'N/A'}m</span>
                <span>Salinity: {buoy.data.salinity ?? 'N/A'} PSU</span>
                <span>pH: {buoy.data.ph ?? 'N/A'}</span>
                <span>Oxygen: {buoy.data.dissolvedOxygen ?? 'N/A'} mg/L</span>
              </div>
              {buoy.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 italic line-clamp-1">Note: {buoy.notes}</p>}
            </div>
            <div className="w-full md:w-auto mt-3 md:mt-0 md:ml-4 flex-shrink-0">
              <Link href={`/buoy/${buoy.id}`} className="inline-flex items-center justify-center w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-ocean-600 hover:bg-ocean-700 rounded-lg transition-colors">
                View Details
                <ArrowRight className="h-3 w-3 ml-1.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMapView = () => (
    <div className="h-[600px] md:h-[700px] w-full rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700/80">
      <MapComponent 
        buoyData={mapBuoysForDisplay} 
        onBuoySelected={handleBuoySelectOnMap}
      />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-ocean-50 via-ocean-100 to-ocean-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(browsePageSchema) }}
        key="browsepage-jsonld"
      />
      <section className="py-12 pt-28 md:pt-32 bg-white dark:bg-gray-800/50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/data" className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:underline mb-6 text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Data Overview
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
                Browse Buoy Data
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Explore real-time and historical data from our network of smart buoys.
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
              {([
                { mode: 'grid', label: 'Grid', icon: <LayoutGrid className="h-5 w-5" /> },
                { mode: 'list', label: 'List', icon: <List className="h-5 w-5" /> },
                { mode: 'map', label: 'Map', icon: <MapIcon className="h-5 w-5" /> },
              ] as { mode: 'grid' | 'list' | 'map'; label: string; icon: React.ReactElement }[]).map(item => (
                <button
                  key={item.mode}
                  onClick={() => setViewMode(item.mode)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors
                    ${viewMode === item.mode 
                      ? 'bg-ocean-600 text-white shadow'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}
                  `}
                  aria-label={`Switch to ${item.label} view`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md backdrop-blur-sm border border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search by buoy name..." 
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 dark:bg-gray-700 dark:text-white transition-colors duration-150"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          {filteredBuoys.length > 0 ? (
            <> 
              {viewMode === 'grid' && renderGridView()}
              {viewMode === 'list' && renderListView()}
              {viewMode === 'map' && renderMapView()}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Buoys Found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your search for "{searchTerm}" did not match any buoys.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}