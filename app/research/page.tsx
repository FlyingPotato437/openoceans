'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, Users, BookOpen, ArrowUpRight, BookMarked, BarChart3, FlaskConical, ExternalLink, Image as ImageIcon } from 'lucide-react'

// Research projects data
const RESEARCH_PROJECTS = [
  {
    id: 'coral-bleaching',
    title: 'Coral Reef Bleaching Early Warning System',
    description: 'Developing an AI-powered early warning system for detecting and predicting coral bleaching events based on temperature anomalies and other environmental factors.',
    image: '/images/coral-reef.jpg',
    status: 'Active',
    partners: ['REEFlect Foundation', 'University of Queensland', 'NOAA'],
    publications: 2,
    link: '/research/coral-bleaching'
  },
  {
    id: 'ocean-acidification',
    title: 'Global Ocean Acidification Monitoring',
    description: 'Tracking pH changes across the global ocean to understand the pace and impacts of ocean acidification on marine ecosystems and carbon cycling.',
    image: '/images/beach-sunset.jpg',
    status: 'Active',
    partners: ['Global Ocean Observing System', 'Scripps Institution of Oceanography'],
    publications: 5,
    link: '/research/ocean-acidification'
  },
  {
    id: 'marine-heatwaves',
    title: 'Marine Heatwave Dynamics and Ecosystem Impacts',
    description: 'Investigating the frequency, intensity, and ecological impacts of marine heatwaves in a changing climate.',
    image: '/images/iceberg.jpg',
    status: 'Active',
    partners: ['Woods Hole Oceanographic Institution', 'REEFlect Foundation'],
    publications: 3,
    link: '/research/marine-heatwaves'
  },
  {
    id: 'oxygen-decline',
    title: 'Deoxygenation Trends in Coastal Waters',
    description: 'Monitoring dissolved oxygen levels in coastal regions to track the expansion of hypoxic zones and their effects on marine life.',
    image: '/images/algae-water.jpg',
    status: 'Active',
    partners: ['Coastal Ocean Observation Lab', 'University of Washington'],
    publications: 1,
    link: '/research/oxygen-decline'
  }
]

// Recent publications data
const RECENT_PUBLICATIONS = [
  {
    title: 'Early Detection of Coral Bleaching Events Using Multi-Parameter Buoy Data and Machine Learning',
    authors: 'Chen, E., Rodriguez, M., Johnson, A., et al.',
    journal: 'Journal of Marine Conservation',
    year: 2023,
    doi: '10.1234/jmc.2023.001',
    link: 'https://doi.org/10.1234/jmc.2023.001'
  },
  {
    title: 'Spatial and Temporal Patterns in Ocean Acidification: Insights from the OpenOcean Monitoring Network',
    authors: 'Wilson, J., Ahmed, S., Garcia, L., et al.',
    journal: 'Global Biogeochemical Cycles',
    year: 2023,
    doi: '10.1234/gbc.2023.005',
    link: 'https://doi.org/10.1234/gbc.2023.005'
  },
  {
    title: 'REEFlect: A Novel Approach to Coral Reef Monitoring Using IoT and Open Data',
    authors: 'Rodriguez, M., Chen, E., Wilson, J., et al.',
    journal: 'Environmental Monitoring and Technology',
    year: 2022,
    doi: '10.1234/emt.2022.012',
    link: 'https://doi.org/10.1234/emt.2022.012'
  },
  {
    title: 'Marine Heatwaves in the Indo-Pacific: Frequency, Duration, and Ecological Consequences',
    authors: 'Johnson, A., Wilson, J., Lee, K., et al.',
    journal: 'Frontiers in Marine Science',
    year: 2022,
    doi: '10.1234/fms.2022.008',
    link: 'https://doi.org/10.1234/fms.2022.008'
  }
]

export default function ResearchPage() {
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})
  
  const handleImageError = (imageId: string) => {
    setImageErrors(prev => ({...prev, [imageId]: true}))
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-br from-ocean-50 via-ocean-100 to-ocean-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Ocean <span className="text-ocean-600 dark:text-ocean-400">Research</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Advancing ocean science through open data, global monitoring, and cross-disciplinary collaboration
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-10">
              <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900 mr-4">
                <FlaskConical className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Current Research Projects
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {RESEARCH_PROJECTS.map((project) => (
                <Link key={project.id} href={project.link} className="group">
                  <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="relative h-48 bg-gradient-to-br from-ocean-500/20 to-ocean-600/20">
                      {!imageErrors[project.id] ? (
                        <Image 
                          src={project.image} 
                          alt={project.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="transition-transform group-hover:scale-105 duration-500"
                          onError={() => handleImageError(project.id)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-ocean-500/50 dark:text-ocean-400/50" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-ocean-600 text-white text-xs font-medium px-2 py-1 rounded">
                        {project.status}
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>
                            {project.partners.length} {project.partners.length === 1 ? 'Partner' : 'Partners'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{project.publications} Publications</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                        {project.description}
                      </p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex -space-x-2">
                          {project.partners.slice(0, 3).map((partner, index) => (
                            <div 
                              key={index}
                              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400"
                              title={partner}
                            >
                              {partner.charAt(0)}
                            </div>
                          ))}
                          {project.partners.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                              +{project.partners.length - 3}
                            </div>
                          )}
                        </div>
                        
                        <span className="inline-flex items-center text-ocean-600 dark:text-ocean-400 text-sm font-medium group-hover:underline">
                          <span>View project</span>
                          <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-10">
              <div className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-900 mr-4">
                <BookMarked className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Recent Publications
              </h2>
            </div>
            
            <div className="space-y-6">
              {RECENT_PUBLICATIONS.map((publication, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="flex-1">
                      <a 
                        href={publication.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start group"
                      >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors">
                          {publication.title}
                        </h3>
                        <ExternalLink className="h-4 w-4 ml-2 mt-1 text-gray-400 group-hover:text-ocean-600 dark:group-hover:text-ocean-400 flex-shrink-0" />
                      </a>
                      
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {publication.authors}
                      </p>
                      
                      <div className="flex items-center mt-3 text-sm">
                        <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-gray-500 dark:text-gray-400">
                          {publication.journal} ({publication.year})
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                      <a 
                        href={publication.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span>DOI: {publication.doi}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link 
                href="/research/publications" 
                className="inline-flex items-center px-6 py-3 rounded-lg border border-ocean-600 dark:border-ocean-400 text-ocean-600 dark:text-ocean-400 hover:bg-ocean-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span>View All Publications</span>
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-10">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Data-Driven Insights
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    REEFlect Coral Monitoring
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Our collaboration with REEFlect has enhanced our ability to detect early signs of coral bleaching through high-frequency temperature and pH monitoring at key reef sites.
                  </p>
                  <div className="relative h-48 rounded-lg overflow-hidden mt-4 bg-gradient-to-br from-ocean-500/20 to-ocean-600/20">
                    {!imageErrors['coral-monitoring'] ? (
                      <Image 
                        src="/images/coral-reef.jpg" 
                        alt="Coral monitoring visualization"
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={() => handleImageError('coral-monitoring')}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-ocean-500/50 dark:text-ocean-400/50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    Global Temperature Trends
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Our buoy network has captured significant warming trends across all major ocean basins, with the most pronounced changes in the North Atlantic and Western Pacific regions.
                  </p>
                  <div className="relative h-48 rounded-lg overflow-hidden mt-4 bg-gradient-to-br from-ocean-500/20 to-ocean-600/20">
                    {!imageErrors['temperature-trends'] ? (
                      <Image 
                        src="/images/iceberg.jpg" 
                        alt="Global temperature trends visualization"
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={() => handleImageError('temperature-trends')}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-ocean-500/50 dark:text-ocean-400/50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    Ocean Acidification Mapping
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Spatial and temporal mapping of pH changes reveals acidification hotspots and their correlation with marine ecosystem health and biodiversity metrics.
                  </p>
                  <div className="relative h-48 rounded-lg overflow-hidden mt-4 bg-gradient-to-br from-ocean-500/20 to-ocean-600/20">
                    {!imageErrors['acidification-map'] ? (
                      <Image 
                        src="/images/buoy-navigation.jpg" 
                        alt="Ocean acidification map"
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={() => handleImageError('acidification-map')}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-ocean-500/50 dark:text-ocean-400/50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-ocean-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-ocean-100 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900 text-ocean-600 dark:text-ocean-400 text-sm font-medium mb-4">
                    <Users className="w-4 h-4 mr-2" />
                    Research Collaboration
                  </div>
                  
                  <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                    Partner with OpenOcean and REEFlect
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We're actively seeking research partners to expand our monitoring network and develop new applications for our ocean data. Whether you're a research institution, conservation organization, or government agency, we welcome collaboration opportunities.
                  </p>
                  
                  <Link 
                    href="/about#contact" 
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-ocean-600 hover:bg-ocean-700 text-white transition-colors"
                  >
                    <span>Contact Research Team</span>
                  </Link>
                </div>
                
                <div className="bg-gradient-to-br from-ocean-600 to-ocean-800 dark:from-ocean-900 dark:to-ocean-800 p-8 flex items-center justify-center">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-4">
                      Research Access Program
                    </h4>
                    <ul className="space-y-3 text-white">
                      <li className="flex items-start">
                        <div className="rounded-full bg-white/20 p-1 mr-3 mt-0.5">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm">Free API access for academic researchers</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-white/20 p-1 mr-3 mt-0.5">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm">Grant partnerships for buoy deployment</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-white/20 p-1 mr-3 mt-0.5">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm">Collaborative publication opportunities</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-white/20 p-1 mr-3 mt-0.5">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm">Access to raw data and custom analysis</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 