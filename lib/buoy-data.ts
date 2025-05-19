import { Buoy, BuoyStatus } from './types';

export const BUOY_DATA: Buoy[] = [
  {
    id: 'B01',
    name: 'Los Angeles Coastal Monitor',
    status: 'Online' as BuoyStatus,
    location: { lat: 33.95, lng: -118.45 }, // Los Angeles - Offshore Santa Monica Bay
    lastTransmission: '2024-07-29T14:30:00Z',
    imageUrl: '/buoys/Buoy1.png',
    tags: ['Coastal', 'Research', 'California Current'],
    data: {
      waterTemp: 20.5,
      waveHeight: 1.2,
      salinity: 33.8,
      ph: 8.1,
      dissolvedOxygen: 6.5,
      conductivity: 45.2,
      turbidity: 0.8,
    },
    notes: 'Monitoring coastal conditions off Los Angeles. Vital for tracking urban runoff impact.',
    depth: '20m',
    type: 'Coastal Standard'
  },
  {
    id: 'B02',
    name: 'San Diego Marine Reserve Buoy',
    status: 'Online' as BuoyStatus,
    location: { lat: 32.70, lng: -117.25 }, // San Diego - Offshore Point Loma
    lastTransmission: '2024-07-29T14:25:00Z',
    imageUrl: '/buoys/Buoy2.png',
    tags: ['Marine Reserve', 'Kelp Forest', 'Southern California Bight'],
    data: {
      waterTemp: 19.8,
      waveHeight: 0.9,
      salinity: 33.5,
      ph: 8.0,
      dissolvedOxygen: 6.8,
      conductivity: 45.0,
      turbidity: 0.5,
    },
    notes: 'Positioned near the San Diego-La Jolla Underwater Park. Monitors kelp forest health.',
    depth: '25m',
    type: 'Reef Monitoring'
  },
  {
    id: 'B03',
    name: 'Accra Gulf Stream Sentry',
    status: 'Warning' as BuoyStatus, 
    location: { lat: 5.50, lng: -0.20 }, // Accra, Ghana - Offshore
    lastTransmission: '2024-07-29T12:00:00Z',
    imageUrl: '/buoys/Buoy3.png',
    tags: ['Tropical', 'Gulf of Guinea', 'Upwelling'],
    data: {
      waterTemp: 27.5,
      waveHeight: 1.5,
      salinity: 35.0,
      ph: 8.1,
      dissolvedOxygen: 5.9,
      conductivity: 48.0,
      turbidity: 1.0,
    },
    notes: 'Monitoring upwelling events and water quality along the Ghanaian coast, near Accra.',
    depth: '30m',
    type: 'Tropical Standard'
  }
];
