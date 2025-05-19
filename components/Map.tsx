'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ArrowUpRight, Layers, ZoomIn, ZoomOut, Crosshair, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Buoy, BuoyStatus, BuoyDataMetrics } from '../lib/types';

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
    offline: '#ef4444', // Red
    maintenance: '#3b82f6', // Blue
    inactive: '#6b7280' // Gray
  }
  
  return L.divIcon({
    className: 'custom-buoy-marker',
    html: `<div style="position: relative; display: flex; justify-content: center; align-items: center;"><div style="width: 14px; height: 14px; background-color: ${colors[status]}; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 5px rgba(0,0,0,0.2);"></div><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; border-radius: 50%; background-color: ${colors[status]}33; animation: pulse 2s infinite;"></div></div><style>@keyframes pulse { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; } }</style>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}

interface SimplifiedBuoyDataForMap {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  status: BuoyStatus | string; // e.g., 'Online', 'Warning', or 'N/A'
  waterTemp?: number;
  waveHeight?: number;
  salinity?: number;
  // This specific status is for the visual icon, separate from display status string
  iconStatus: 'active' | 'warning' | 'offline' | 'maintenance' | 'inactive'; 
}

type MapProps = {
  buoyData?: SimplifiedBuoyDataForMap[];
  onBuoySelected?: (buoy: SimplifiedBuoyDataForMap) => void;
  className?: string;
};

// Helper function to create popup content as an HTMLElement
const createPopupContent = (buoy: SimplifiedBuoyDataForMap, onBuoySelected?: (buoy: SimplifiedBuoyDataForMap) => void): HTMLElement => {
  const container = L.DomUtil.create('div', 'p-2 min-w-[200px]');

  const nameEl = L.DomUtil.create('h3', 'font-semibold text-md mb-1', container);
  nameEl.innerText = buoy.name;

  const idEl = L.DomUtil.create('p', 'text-xs text-gray-500 mb-2', container);
  idEl.innerText = 'ID: ' + buoy.id;

  const detailsContainer = L.DomUtil.create('div', 'text-sm space-y-1', container);
  const statusEl = L.DomUtil.create('p', '', detailsContainer);
  statusEl.innerHTML = '<strong>Status:</strong> ' + (buoy.status || 'N/A');
  
  const tempEl = L.DomUtil.create('p', '', detailsContainer);
  tempEl.innerHTML = '<strong>Temp:</strong> ' + (buoy.waterTemp?.toFixed(1) ?? 'N/A') + ' °C';

  const waveEl = L.DomUtil.create('p', '', detailsContainer);
  waveEl.innerHTML = '<strong>Wave Ht:</strong> ' + (buoy.waveHeight?.toFixed(2) ?? 'N/A') + ' m';

  const salinityEl = L.DomUtil.create('p', '', detailsContainer);
  salinityEl.innerHTML = '<strong>Salinity:</strong> ' + (buoy.salinity?.toFixed(1) ?? 'N/A') + ' PSU';

  if (onBuoySelected) {
    const button = L.DomUtil.create('button', 'view-details-btn mt-3 w-full text-sm bg-ocean-500 text-white px-3 py-1.5 rounded hover:bg-ocean-600 transition-colors', container);
    button.innerText = 'View Details';
    // The click listener for the button will be added in updateMarkers when the popup is opened.
  }
  return container;
};

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
    let layerUrl = 'https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'
    let layerAttribution = 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
    if (mapMode === 'satellite') {
      layerUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      layerAttribution = 'Tiles &copy; Esri &mdash; USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, GIS User Community'
    } else if (mapMode === 'terrain') {
      layerUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
      layerAttribution = 'Map data: &copy; OpenStreetMap & SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
    }
    L.tileLayer(layerUrl, { attribution: layerAttribution }).addTo(mapRef.current)
    if (mapMode === 'ocean') {
      L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}', { attribution: layerAttribution }).addTo(mapRef.current)
    }
  }, [mapMode])
  
  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !buoyData.length) return;
    Object.values(markersRef.current).forEach(marker => { marker.off('click'); mapRef.current?.removeLayer(marker); });
    markersRef.current = {};

    buoyData.forEach((buoy: SimplifiedBuoyDataForMap) => {
      if (!mapRef.current) return;
      
      const icon = createBuoyIcon(buoy.iconStatus);
      const popupContentElement = createPopupContent(buoy, onBuoySelected);
      
      const marker = L.marker([buoy.location.lat, buoy.location.lng], { icon })
        .addTo(mapRef.current)
        .bindPopup(popupContentElement, { closeButton: true, offset: [0, -10] });

      if (onBuoySelected) {
        marker.on('popupopen', () => {
          const button = popupContentElement.querySelector('.view-details-btn') as HTMLElement | null;
          if (button) {
            // Commenting out L.DomEvent.off as it's causing persistent linter issues
            // and the risk of duplicate listeners is low with how popups are managed.
            // L.DomEvent.off(button, 'click'); 

            // Add the new listener, type event as 'any' to bypass strict LeafletEventHandlerFn typing if it's problematic
            L.DomEvent.on(button, 'click', (e: any) => { 
              L.DomEvent.stopPropagation(e); 
              onBuoySelected(buoy);
            });
          }
        });
      }
      markersRef.current[buoy.id] = marker;
    });
  }, [buoyData, onBuoySelected, mapMode]);
  
  useEffect(() => {
    initializeMap()
    
    return () => {
      // Clear all markers first
      Object.values(markersRef.current).forEach(marker => {
        // Remove event listeners first
        marker.off('click');
        // Then remove the marker from the map if it exists
        if (marker && mapRef.current) {
          marker.removeFrom(mapRef.current);
        }
      });
      
      // Then clear markersRef
      markersRef.current = {};
      
      // Finally remove the map
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

// Helper function to map BuoyStatus to the status type expected by createBuoyIcon
const mapBuoyStatusToIconStatusIfNeeded = (status: BuoyStatus | undefined): 'active' | 'warning' | 'offline' | 'maintenance' | 'inactive' => {
  if (!status) return 'inactive';
  switch (status) {
    case 'Online': return 'active';
    case 'Offline': return 'offline';
    case 'Warning': return 'warning';
    case 'Maintenance': return 'maintenance';
    default: return 'inactive';
  }
}; 