'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'
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
const createBuoyIcon = (status: 'active' | 'warning' | 'offline' | 'maintenance' | 'inactive' = 'active') => {
  const colors = {
    active: '#10b981', // Green
    warning: '#f59e0b', // Amber
    offline: '#ef4444',  // Red
    maintenance: '#3b82f6', // Blue
    inactive: '#6b7280' // Gray
  }
  
  return L.divIcon({
    className: 'custom-buoy-marker',
    html: `
      <div style="position: relative; display: flex; justify-content: center; align-items: center;">
        <div style="
          width: 12px;
          height: 12px;
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
          width: 24px;
          height: 24px;
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
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  })
}

type MiniMapProps = {
  location: {
    lat: number
    lng: number
  }
  status?: 'active' | 'warning' | 'offline' | 'maintenance' | 'inactive'
  className?: string
  height?: string
}

export default function MiniMap({ location, status = 'active', className, height = 'h-40' }: MiniMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  const initializeMap = useCallback(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.lat, location.lng],
        zoom: 9,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false
      })
      
      // Add ocean-styled base layer
      L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
      }).addTo(map)
      
      // Add the buoy marker
      const icon = createBuoyIcon(status)
      L.marker([location.lat, location.lng], { icon }).addTo(map)
      
      mapRef.current = map
      setMapLoaded(true)
    }
  }, [location, status])
  
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
    if (mapRef.current && mapLoaded) {
      mapRef.current.setView([location.lat, location.lng], 9)
    }
  }, [location, mapLoaded])
  
  return (
    <div className={cn(`relative w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ${height}`, className)}>
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Coordinates Display */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded shadow-sm">
        <span className="font-medium">Lat: {location.lat.toFixed(6)}</span>
        <span className="font-medium">Lng: {location.lng.toFixed(6)}</span>
      </div>
    </div>
  )
} 