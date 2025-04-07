'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ArrowUpRight, Layers, ZoomIn, ZoomOut, Crosshair, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// Import custom marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'

// Fix the default icon issue in Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

// Define custom buoy icon
const createBuoyIcon = (status: 'active' | 'warning' | 'offline' = 'active') => {
  const colors = {
    active: '#10b981', // Green
    warning: '#f59e0b', // Amber
    offline: '#ef4444'  // Red
  }
  
  return L.divIcon({
    className: 'custom-buoy-marker',
    html: `
      <div style="position: relative; display: flex; justify-content: center; align-items: center;">
        <div style="
          width: 14px;
          height: 14px;
          background-color: ${colors[status]};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 5px rgba(0,0,0,0.2);
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: ${colors[status]}33;
          animation: pulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}

type Buoy = {
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
}

type MapProps = {
  buoyData?: Buoy[]
  onBuoySelected?: (buoy: Buoy) => void
  className?: string
}

export default function Map({ buoyData = [], onBuoySelected, className }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapMode, setMapMode] = useState<'satellite' | 'terrain' | 'ocean'>('ocean')
  const markersRef = useRef<{ [key: string]: L.Marker }>({})
  
  const initializeMap = useCallback(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 3,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: false
      })
      
      // Add ocean-styled base layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map)
      
      // Add attribution in bottom right
      L.control.attribution({
        position: 'bottomright'
      }).addTo(map)
      
      mapRef.current = map
      setMapLoaded(true)
    }
  }, [])
  
  const updateMapLayer = useCallback(() => {
    if (!mapRef.current) return
    
    // Remove all existing tile layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapRef.current?.removeLayer(layer)
      }
    })
    
    // Add the selected layer
    switch (mapMode) {
      case 'satellite':
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(mapRef.current)
        break
      case 'terrain':
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }).addTo(mapRef.current)
        break
      case 'ocean':
      default:
        L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
        }).addTo(mapRef.current)
        L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
        }).addTo(mapRef.current)
        break
    }
  }, [mapMode])
  
  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !buoyData.length) return
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      mapRef.current?.removeLayer(marker)
    })
    markersRef.current = {}
    
    // Add new markers
    buoyData.forEach(buoy => {
      const icon = createBuoyIcon(buoy.status || 'active')
      const marker = L.marker([buoy.location.lat, buoy.location.lng], { icon })
        .addTo(mapRef.current!)
        .bindTooltip(`
          <div class="px-2 py-1">
            <div class="font-semibold">${buoy.name}</div>
            <div class="text-xs opacity-75">${buoy.id}</div>
          </div>
        `, { direction: 'top', offset: [0, -10] })
      
      // Handle click events
      marker.on('click', () => {
        if (onBuoySelected) {
          onBuoySelected(buoy)
        }
      })
      
      markersRef.current[buoy.id] = marker
    })
  }, [buoyData, onBuoySelected])
  
  useEffect(() => {
    initializeMap()
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [initializeMap])
  
  useEffect(() => {
    if (mapLoaded) {
      updateMapLayer()
    }
  }, [mapLoaded, updateMapLayer])
  
  useEffect(() => {
    if (mapLoaded) {
      updateMarkers()
    }
  }, [mapLoaded, buoyData, updateMarkers])
  
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }
  
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }
  
  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 3)
    }
  }
  
  return (
    <div className={cn("relative w-full h-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800", className)}>
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
        </div>
        
        {/* Layer Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
          <div className="relative" data-headlessui-state="">
            <button
              className="flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md"
              aria-label="Map layers"
            >
              <Layers className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Reset View */}
        <button
          onClick={handleResetView}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Reset view"
        >
          <Crosshair className="h-5 w-5" />
        </button>
      </div>
      
      {/* Map Layers Dropdown */}
      <div className="absolute top-4 left-4 z-[400] bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-3 py-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
          Map Style
        </div>
        <div className="p-2 space-y-1">
          <LayerButton 
            active={mapMode === 'ocean'} 
            onClick={() => setMapMode('ocean')}
            label="Ocean"
          />
          <LayerButton 
            active={mapMode === 'satellite'} 
            onClick={() => setMapMode('satellite')}
            label="Satellite"
          />
          <LayerButton 
            active={mapMode === 'terrain'} 
            onClick={() => setMapMode('terrain')}
            label="Terrain"
          />
        </div>
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md p-3 max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Buoy Status</span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-seagrass-500 border border-white dark:border-gray-700"></div>
            <span className="text-gray-600 dark:text-gray-400">Active - Normal operation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500 border border-white dark:border-gray-700"></div>
            <span className="text-gray-600 dark:text-gray-400">Warning - Needs attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500 border border-white dark:border-gray-700"></div>
            <span className="text-gray-600 dark:text-gray-400">Offline - Not transmitting</span>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <a 
            href="#" 
            className="text-xs text-ocean-600 dark:text-ocean-400 flex items-center gap-1 hover:underline"
          >
            <span>View buoy info guide</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

function LayerButton({ 
  active, 
  onClick,
  label
}: { 
  active: boolean; 
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-3 py-1.5 text-sm rounded-md transition-colors",
        active 
          ? "bg-ocean-100 dark:bg-ocean-900/40 text-ocean-700 dark:text-ocean-400" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      )}
    >
      {label}
    </button>
  )
} 