import { Metadata } from 'next'

// SEO Metadata for Map Page
export const metadata: Metadata = {
  title: 'Interactive Buoy Map | OpenOcean Data Platform',
  description: 'Explore OpenOcean\'s global network of smart buoys on an interactive map. View live statuses, locations, and select buoys for detailed oceanographic data.',
  keywords: ['interactive map', 'buoy network', 'ocean data map', 'live buoy status', 'marine monitoring locations', 'oceanographic map', 'OpenOcean map'],
  openGraph: {
    title: 'Interactive Buoy Map | OpenOcean',
    description: 'Visualize our global smart buoy network. Track live ocean data points and explore marine environments interactively.',
    images: [
      {
        url: '/images/openocean-og-map.jpg', // Replace with a specific OG image for the map page
        width: 1200,
        height: 630,
        alt: 'OpenOcean Interactive Buoy Map',
      },
    ],
  },
  twitter: {
    title: 'OpenOcean Buoy Map | Live Data Visualization',
    description: 'Explore real-time ocean data on our interactive map. Discover buoy locations and statuses worldwide.',
    images: [
      {
        url: '/images/openocean-twitter-map.jpg', // Replace with a specific Twitter card image for the map page
        alt: 'OpenOcean Interactive Map of Smart Buoys',
      },
    ],
  },
}; 