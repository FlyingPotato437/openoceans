'use client';

import { useState, useEffect } from 'react';
import { BUOY_DATA as initialBuoyData } from '@/lib/buoy-data';
import { Buoy, BuoyStatus, BuoyDataMetrics } from '@/lib/types';

// Helper function to generate small random fluctuations
const fluctuate = (value: number, amount: number): number => {
  return parseFloat((value + (Math.random() - 0.5) * amount).toFixed(1));
};

const getRandomStatus = (currentStatus: BuoyStatus): BuoyStatus => {
  // Chance to change status
  if (Math.random() < 0.05) { // 5% chance to consider a status change
    const randomRoll = Math.random();
    let newStatus: BuoyStatus;

    if (randomRoll < 0.75) { // 75% chance for 'Online'
      newStatus = 'Online';
    } else if (randomRoll < 0.90) { // 15% chance for 'Warning'
      newStatus = 'Warning';
    } else if (randomRoll < 0.97) { // 7% chance for 'Maintenance'
      newStatus = 'Maintenance';
    } else { // 3% chance for 'Offline'
      newStatus = 'Offline';
    }

    if (newStatus !== currentStatus) {
      return newStatus;
    }
  }

  // Increased chance to revert to Online if not already Online
  if (currentStatus !== 'Online' && Math.random() < 0.25) { // 25% chance to try to go back Online
    return 'Online';
  }

  return currentStatus; // Otherwise, keep the current status
};

export const useSimulatedBuoyData = (intervalMs: number = 3000): Buoy[] => {
  // Deep clone initial data to prevent modifying the original constant
  const [buoys, setBuoys] = useState<Buoy[]>(() => 
    JSON.parse(JSON.stringify(initialBuoyData))
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBuoys(prevBuoys =>
        prevBuoys.map(buoy => {
          const newMetrics: BuoyDataMetrics = {
            ...buoy.data,
            waterTemp: fluctuate(buoy.data.waterTemp || 20, 0.5), // Default to 20 if undefined
            waveHeight: Math.max(0, fluctuate(buoy.data.waveHeight || 1, 0.2)), // Ensure non-negative
            salinity: fluctuate(buoy.data.salinity || 35, 0.1),
            ph: fluctuate(buoy.data.ph || 8, 0.05),
            dissolvedOxygen: fluctuate(buoy.data.dissolvedOxygen || 6, 0.2),
            // Add other metrics if needed
          };
          
          return {
            ...buoy,
            data: newMetrics,
            status: getRandomStatus(buoy.status),
            lastTransmission: new Date().toISOString(),
          };
        })
      );
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return buoys;
}; 