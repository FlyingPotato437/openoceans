"use client"

import { useState } from 'react'
import { ArrowUpRight, Thermometer, Droplet, Beaker, Waves, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BuoyCardProps = {
  className?: string
  id: string
  name: string
  location: string
  temperature: number
  onViewDetails?: () => void
} | {
  className?: string
  buoy: {
    id: string
    name: string
    location: {
      lat: number
      lng: number
    }
    data: {
      temperature: number
      salinity: number
      ph: number
      dissolved_oxygen: number
    }
  }
  isSelected?: boolean
  onClick?: () => void
}

export function BuoyCard(props: BuoyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract props based on format
  const hasBuoyObject = 'buoy' in props;
  
  const id = hasBuoyObject ? props.buoy.id : props.id;
  const name = hasBuoyObject ? props.buoy.name : props.name;
  const location = hasBuoyObject 
    ? `${props.buoy.location.lat.toFixed(2)}, ${props.buoy.location.lng.toFixed(2)}` 
    : props.location;
  const temperature = hasBuoyObject ? props.buoy.data.temperature : props.temperature;
  
  const isSelected = hasBuoyObject ? props.isSelected : false;
  const onClick = hasBuoyObject 
    ? props.onClick 
    : props.onViewDetails;
  
  const temperatureColor = getTemperatureColor(temperature);
  const statusColor = getStatusIndicatorColor(temperature);

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300",
        isHovered ? "shadow-md transform -translate-y-1 border-gray-300 dark:border-gray-600" : "",
        isSelected ? "ring-2 ring-ocean-500 dark:ring-ocean-400" : "",
        props.className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status indicator dot */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <span className="flex h-2.5 w-2.5 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusColor}`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColor}`}></span>
        </span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Live</span>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className="inline-block">ID: {id}</span>
            <span className="mx-2">•</span>
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <MetricCard 
            icon={<Thermometer className="h-4 w-4 text-orange-500 dark:text-orange-400" />}
            label="Temperature"
            value={`${temperature.toFixed(1)}°C`}
            color={temperatureColor}
          />
          
          {hasBuoyObject && (
            <MetricCard 
              icon={<Droplet className="h-4 w-4 text-blue-500 dark:text-blue-400" />}
              label="Salinity"
              value={`${props.buoy.data.salinity.toFixed(1)} PSU`}
              color="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30"
            />
          )}
          
          {hasBuoyObject && (
            <MetricCard 
              icon={<Beaker className="h-4 w-4 text-purple-500 dark:text-purple-400" />}
              label="pH"
              value={props.buoy.data.ph.toFixed(1)}
              color="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30"
            />
          )}
          
          {hasBuoyObject && (
            <MetricCard 
              icon={<Waves className="h-4 w-4 text-teal-500 dark:text-teal-400" />}
              label="Dissolved O₂"
              value={`${props.buoy.data.dissolved_oxygen.toFixed(1)} mg/L`}
              color="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30"
            />
          )}
        </div>
        
        <button
          onClick={onClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-ocean-50 hover:bg-ocean-100 dark:bg-ocean-900/30 dark:hover:bg-ocean-900/50 text-ocean-600 dark:text-ocean-400 rounded-lg font-medium transition-colors border border-ocean-200 dark:border-ocean-800/50"
        >
          <span>View Details</span>
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  color: string 
}) {
  return (
    <div className={`${color} rounded-lg p-3 flex flex-col border border-gray-100 dark:border-gray-700`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <span className="text-base font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  )
}

function getTemperatureColor(temperature: number): string {
  if (temperature > 28) return 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30';
  if (temperature > 25) return 'bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30';
  if (temperature > 20) return 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30';
  if (temperature > 15) return 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30';
  return 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30';
}

function getStatusIndicatorColor(temperature: number): string {
  if (temperature > 28) return 'bg-red-500';
  if (temperature > 25) return 'bg-orange-500';
  if (temperature > 20) return 'bg-green-500';
  if (temperature > 15) return 'bg-blue-500';
  return 'bg-purple-500';
} 