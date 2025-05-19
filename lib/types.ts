export interface Location {
  lat: number;
  lng: number;
}

export interface BuoyDataMetrics {
  waterTemp?: number;
  salinity?: number;
  waveHeight?: number;
  turbidity?: number;
  chlorophyll?: number;
  ph?: number;
  dissolvedOxygen?: number;
  conductivity?: number;
  pressure?: number;
  currentSpeed?: number;
  currentDirection?: number;
  airTemp?: number;
  humidity?: number;
  windSpeed?: number;
  windDirection?: number;
  batteryLevel?: number;
}

export type BuoyStatus = 'Online' | 'Offline' | 'Warning' | 'Maintenance';

export interface Buoy {
  id: string;
  name: string;
  status: BuoyStatus;
  location: Location;
  lastTransmission?: string;
  imageUrl?: string;
  tags?: string[];
  data: BuoyDataMetrics;
  notes?: string;
  depth?: string;
  type?: string; // Added based on previous lint error feedback
}
