import { Metadata } from 'next'

// SEO Metadata for Research Page
export const metadata: Metadata = {
  title: 'Ocean Research & Publications | OpenOcean Initiative',
  description: 'Explore current oceanographic research projects, scientific publications, and collaborative studies powered by OpenOcean\'s data. Focus on coral bleaching, acidification, and marine heatwaves.',
  keywords: ['ocean research', 'marine science', 'oceanographic publications', 'coral reef research', 'ocean acidification studies', 'marine heatwaves', 'OpenOcean research', 'scientific collaboration'],
  openGraph: {
    title: 'Ocean Research & Publications | OpenOcean',
    description: 'Dive into OpenOcean\'s scientific research, focusing on critical marine issues and data-driven discoveries.',
    images: [
      {
        url: '/images/openocean-og-research.jpg', // Replace with a specific OG image for the research page
        width: 1200,
        height: 630,
        alt: 'OpenOcean Research and Scientific Publications',
      },
    ],
  },
  twitter: {
    title: 'OpenOcean | Scientific Research & Marine Studies',
    description: 'Discover cutting-edge ocean research and publications from the OpenOcean initiative.',
    images: [
      {
        url: '/images/openocean-twitter-research.jpg', // Replace with a specific Twitter card image for the research page
        alt: 'OpenOcean - Advancing Marine Science',
      },
    ],
  },
}; 