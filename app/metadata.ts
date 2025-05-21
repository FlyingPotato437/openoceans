import { Metadata } from 'next'

// SEO Metadata for Homepage
export const metadata: Metadata = {
  title: 'OpenOcean | Live Ocean Data & Research Platform',
  description: 'Explore real-time oceanographic data from a global network of smart buoys. Access free datasets on temperature, salinity, wave height, and more for research and conservation.',
  keywords: ['live ocean data', 'oceanographic research', 'smart buoys', 'marine data', 'sea temperature', 'wave height data', 'ocean conservation', 'environmental monitoring', 'OpenOcean'],
  openGraph: {
    title: 'OpenOcean | Live Ocean Data & Research Platform',
    description: 'Dive into real-time ocean data. OpenOcean provides free access to vital marine information from our global buoy network.',
    images: [
      {
        url: '/images/openocean-og-homepage.jpg', // Replace with a specific OG image for the homepage
        width: 1200,
        height: 630,
        alt: 'OpenOcean Platform - Live Ocean Data Visualization',
      },
    ],
  },
  twitter: {
    title: 'OpenOcean | Live Ocean Data & Research Platform',
    description: 'Explore real-time ocean data for research and conservation with OpenOcean. Free access to our global smart buoy network.',
    images: [
      {
        url: '/images/openocean-twitter-homepage.jpg', // Replace with a specific Twitter card image for the homepage
        alt: 'OpenOcean Platform - Smart Buoy Network',
      },
    ],
  },
}; 