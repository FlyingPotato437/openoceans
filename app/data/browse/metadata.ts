import { Metadata } from 'next'

// SEO Metadata for Browse Data Page
export const metadata: Metadata = {
  title: 'Browse Buoy Data | OpenOcean Data Platform',
  description: 'Search, filter, and browse live and historical data from OpenOcean\'s global network of smart buoys. Explore datasets for temperature, salinity, waves, and more.',
  keywords: ['browse ocean data', 'buoy data search', 'oceanographic datasets', 'marine data explorer', 'filter buoy data', 'historical ocean data', 'OpenOcean browse'],
  openGraph: {
    title: 'Browse & Explore Buoy Data | OpenOcean',
    description: 'Discover detailed oceanographic data. Search and filter through OpenOcean\'s extensive buoy network.',
    images: [
      {
        url: '/images/openocean-og-browse.jpg', // Replace with a specific OG image for the browse page
        width: 1200,
        height: 630,
        alt: 'OpenOcean Data Browsing Interface',
      },
    ],
  },
  twitter: {
    title: 'OpenOcean | Browse Smart Buoy Data',
    description: 'Easily search and explore live and historical data from our global buoy network.',
    images: [
      {
        url: '/images/openocean-twitter-browse.jpg', // Replace with a specific Twitter card image for the browse page
        alt: 'OpenOcean - Browsing Buoy Datasets',
      },
    ],
  },
}; 