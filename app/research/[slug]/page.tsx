'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, FileText, Users, Calendar, ExternalLink, Download, BookOpen, BarChart3, LinkIcon, ImageIcon } from 'lucide-react'
import React from 'react'

// Research project data (in a real app, this would be fetched from a database)
const RESEARCH_PROJECTS = {
  'coral-bleaching': {
    title: 'Coral Reef Bleaching Early Warning System',
    description: 'Developing an AI-powered early warning system for detecting and predicting coral bleaching events based on temperature anomalies and other environmental factors.',
    fullDescription: `
      <p>Coral bleaching is a severe threat to reef ecosystems worldwide, driven primarily by rising ocean temperatures associated with climate change. This research project aims to create an early warning system that can predict bleaching events weeks to months in advance, providing critical time for conservation interventions.</p>
      
      <p>The OpenOcean buoy network, in collaboration with REEFlect, collects continuous temperature, pH, dissolved oxygen, and light data from key reef locations globally. This high-frequency monitoring provides the foundation for our predictive models.</p>
      
      <p>Our approach combines physical oceanographic modeling with machine learning algorithms trained on historical bleaching events. The system integrates satellite data with in-situ measurements to create comprehensive forecasts that account for both large-scale oceanic patterns and local conditions.</p>
      
      <p>Initial testing in the Great Barrier Reef has demonstrated the ability to predict moderate bleaching events up to 3 weeks in advance with 78% accuracy. Ongoing work focuses on extending the prediction window and incorporating additional environmental parameters to improve performance.</p>
    `,
    image: '/images/coral-reef.jpg',
    status: 'Active',
    startDate: 'March 2022',
    endDate: 'Ongoing',
    partners: ['REEFlect Foundation', 'University of Queensland', 'NOAA'],
    funding: '$1.2M USD',
    primaryInvestigator: 'Dr. Maria Rodriguez',
    publications: [
      {
        title: 'Early Detection of Coral Bleaching Events Using Multi-Parameter Buoy Data and Machine Learning',
        authors: 'Chen, E., Rodriguez, M., Johnson, A., et al.',
        journal: 'Journal of Marine Conservation',
        year: 2023,
        doi: '10.1234/jmc.2023.001',
        link: 'https://doi.org/10.1234/jmc.2023.001'
      },
      {
        title: 'REEFlect: A Novel Approach to Coral Reef Monitoring Using IoT and Open Data',
        authors: 'Rodriguez, M., Chen, E., Wilson, J., et al.',
        journal: 'Environmental Monitoring and Technology',
        year: 2022,
        doi: '10.1234/emt.2022.012',
        link: 'https://doi.org/10.1234/emt.2022.012'
      }
    ],
    resources: [
      {
        name: 'Project Data Repository',
        description: 'Access all raw data collected from our monitoring stations',
        link: 'https://data.openocean.org/coral-bleaching'
      },
      {
        name: 'Prediction Model (GitHub)',
        description: 'Open-source codebase for our prediction algorithms',
        link: 'https://github.com/openocean/coral-bleaching-prediction'
      },
      {
        name: 'Technical Documentation',
        description: 'Methods, calibration protocols, and API documentation',
        link: 'https://docs.openocean.org/coral-bleaching'
      }
    ]
  },
  'ocean-acidification': {
    title: 'Global Ocean Acidification Monitoring',
    description: 'Tracking pH changes across the global ocean to understand the pace and impacts of ocean acidification on marine ecosystems and carbon cycling.',
    fullDescription: `
      <p>Ocean acidification, often called "climate change's evil twin," is a direct consequence of increasing atmospheric CO₂ levels. As the ocean absorbs carbon dioxide, seawater chemistry changes, resulting in decreased pH and carbonate ion concentration, which threatens marine organisms with calcium carbonate structures.</p>
      
      <p>This project establishes a global network of high-precision pH sensors on OpenOcean buoys to create the most comprehensive real-time monitoring system for ocean acidification to date. The unprecedented spatial coverage allows us to map acidification rates across different marine environments and identify regional hotspots.</p>
      
      <p>We are particularly focused on correlating acidification rates with biological impacts on keystone species, including corals, mollusks, and plankton. Laboratory studies combined with in-situ observations allow us to establish threshold values for ecosystem impacts and develop acidification vulnerability indices for different marine regions.</p>
      
      <p>The project also advances sensor technology, with new calibration methods that improve pH measurement precision to ±0.005 units over extended deployments - a significant improvement over previous capabilities.</p>
    `,
    image: '/images/beach-sunset.jpg',
    status: 'Active',
    startDate: 'January 2021',
    endDate: 'December 2025',
    partners: ['Global Ocean Observing System', 'Scripps Institution of Oceanography'],
    funding: '$2.8M USD',
    primaryInvestigator: 'Dr. James Wilson',
    publications: [
      {
        title: 'Spatial and Temporal Patterns in Ocean Acidification: Insights from the OpenOcean Monitoring Network',
        authors: 'Wilson, J., Ahmed, S., Garcia, L., et al.',
        journal: 'Global Biogeochemical Cycles',
        year: 2023,
        doi: '10.1234/gbc.2023.005',
        link: 'https://doi.org/10.1234/gbc.2023.005'
      },
      {
        title: 'Improved Calibration Methods for Long-term pH Monitoring in Variable Coastal Environments',
        authors: 'Wilson, J., Chen, E., et al.',
        journal: 'Marine Chemistry',
        year: 2022,
        doi: '10.1234/mc.2022.008',
        link: 'https://doi.org/10.1234/mc.2022.008'
      },
      {
        title: 'Regional Differences in Ocean Acidification Rates and Ecosystem Sensitivity',
        authors: 'Ahmed, S., Wilson, J., et al.',
        journal: 'Science of the Total Environment',
        year: 2022,
        doi: '10.1234/ste.2022.045',
        link: 'https://doi.org/10.1234/ste.2022.045'
      }
    ],
    resources: [
      {
        name: 'Acidification Data Dashboard',
        description: 'Interactive visualization of global pH trends',
        link: 'https://dashboard.openocean.org/acidification'
      },
      {
        name: 'Sensor Specifications and Protocols',
        description: 'Technical documentation for pH sensors used in this project',
        link: 'https://docs.openocean.org/acidification/sensors'
      }
    ]
  },
  'marine-heatwaves': {
    title: 'Marine Heatwave Dynamics and Ecosystem Impacts',
    description: 'Investigating the frequency, intensity, and ecological impacts of marine heatwaves in a changing climate.',
    fullDescription: `
      <p>Marine heatwaves (MHWs) are prolonged periods of anomalously warm ocean temperatures that can dramatically impact marine ecosystems. This project focuses on understanding the physical drivers of MHWs, predicting their occurrence, and quantifying their ecological impacts across different marine ecosystems.</p>
      
      <p>Using OpenOcean's high-resolution temperature monitoring network, we're able to track the development and progression of MHWs with unprecedented detail. This data is combined with atmospheric observations and ocean circulation models to identify the mechanisms that trigger and sustain these extreme events.</p>
      
      <p>A key innovation in our approach is the integration of biological monitoring with physical data. Through partnerships with marine research institutions, we conduct rapid ecological assessments during MHW events to document real-time impacts on biodiversity, fisheries, and ecosystem function.</p>
      
      <p>The project has already documented several MHWs since its inception, including a major event in the North Pacific during summer 2022 that persisted for 47 days and reached 3.8°C above climatological norms. Our ecosystem surveys revealed significant impacts on seabird populations and commercial fisheries throughout the affected region.</p>
    `,
    image: '/images/iceberg.jpg',
    status: 'Active',
    startDate: 'June 2022',
    endDate: 'May 2025',
    partners: ['Woods Hole Oceanographic Institution', 'REEFlect Foundation'],
    funding: '$1.5M USD',
    primaryInvestigator: 'Dr. Aisha Johnson',
    publications: [
      {
        title: 'Marine Heatwaves in the Indo-Pacific: Frequency, Duration, and Ecological Consequences',
        authors: 'Johnson, A., Wilson, J., Lee, K., et al.',
        journal: 'Frontiers in Marine Science',
        year: 2022,
        doi: '10.1234/fms.2022.008',
        link: 'https://doi.org/10.1234/fms.2022.008'
      },
      {
        title: 'Ecological Impacts of the 2022 North Pacific Marine Heatwave',
        authors: 'Johnson, A., Smith, P., et al.',
        journal: 'Nature Climate Change',
        year: 2023,
        doi: '10.1234/ncc.2023.012',
        link: 'https://doi.org/10.1234/ncc.2023.012'
      }
    ],
    resources: [
      {
        name: 'Marine Heatwave Tracker',
        description: 'Real-time monitoring of active marine heatwaves globally',
        link: 'https://mhw.openocean.org'
      },
      {
        name: 'Impact Assessment Protocols',
        description: 'Standardized methods for ecological impact assessments',
        link: 'https://docs.openocean.org/mhw/protocols'
      }
    ]
  },
  'oxygen-decline': {
    title: 'Deoxygenation Trends in Coastal Waters',
    description: 'Monitoring dissolved oxygen levels in coastal regions to track the expansion of hypoxic zones and their effects on marine life.',
    fullDescription: `
      <p>Ocean deoxygenation is an emerging threat to marine ecosystems worldwide, with potential to devastate fisheries and alter marine food webs. This project establishes a comprehensive monitoring network specifically designed to track oxygen levels in vulnerable coastal regions, where human impacts intersect with natural processes.</p>
      
      <p>Our network of oxygen sensors provides continuous high-resolution data that allows us to characterize daily, seasonal, and interannual oxygen dynamics. This detailed picture reveals patterns that sporadic sampling cannot detect, such as brief hypoxic events that can still significantly impact marine life.</p>
      
      <p>A major focus of this work is understanding the complex interplay between nutrient pollution, warming waters, and changing circulation patterns in driving coastal deoxygenation. We combine our observational network with biogeochemical modeling to disentangle these factors and project future conditions under different management and climate scenarios.</p>
      
      <p>The project also employs novel mobile sensing platforms, including autonomous underwater vehicles equipped with oxygen sensors, to map the three-dimensional structure of low-oxygen zones and track their evolution through time. This approach has revealed complex spatial patterns that fixed monitoring stations alone cannot capture.</p>
    `,
    image: '/images/algae-water.jpg',
    status: 'Active',
    startDate: 'September 2022',
    endDate: 'August 2026',
    partners: ['Coastal Ocean Observation Lab', 'University of Washington'],
    funding: '$1.7M USD',
    primaryInvestigator: 'Dr. Sophia Chen',
    publications: [
      {
        title: 'High-Frequency Monitoring Reveals Episodic Hypoxia in Urbanized Estuaries',
        authors: 'Chen, S., Kim, J., et al.',
        journal: 'Estuarine, Coastal and Shelf Science',
        year: 2023,
        doi: '10.1234/ecss.2023.016',
        link: 'https://doi.org/10.1234/ecss.2023.016'
      }
    ],
    resources: [
      {
        name: 'Oxygen Data Portal',
        description: 'Access to raw and processed dissolved oxygen data',
        link: 'https://data.openocean.org/oxygen'
      },
      {
        name: 'Hypoxia Risk Assessment Tool',
        description: 'Interactive tool for evaluating hypoxia risk in coastal areas',
        link: 'https://tools.openocean.org/hypoxia-risk'
      }
    ]
  }
}

export default function ResearchProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const [imageError, setImageError] = useState(false)
  const unwrappedParams = React.use(params)
  const { slug } = unwrappedParams
  
  const project = RESEARCH_PROJECTS[slug as keyof typeof RESEARCH_PROJECTS]
  
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="mb-8">The research project you're looking for doesn't exist or has been moved.</p>
          <Link href="/research" className="text-ocean-600 dark:text-ocean-400 hover:underline inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to Research</span>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Project Header */}
      <section className="bg-gradient-to-br from-ocean-50 via-ocean-100 to-ocean-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/research" className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:underline mb-6">
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Back to Research</span>
            </Link>
            
            <div className="flex items-center mb-4">
              <span className="px-3 py-1 bg-ocean-600 text-white text-sm font-medium rounded-full">
                {project.status}
              </span>
              <span className="mx-3 text-gray-400 dark:text-gray-500">•</span>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{project.startDate} - {project.endDate}</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {project.title}
            </h1>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Users className="h-4 w-4 mr-2 text-ocean-600 dark:text-ocean-400" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">PI: {project.primaryInvestigator}</span>
              </div>
              
              <div className="flex items-center text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                <BookOpen className="h-4 w-4 mr-2 text-ocean-600 dark:text-ocean-400" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">{project.publications.length} Publications</span>
              </div>
              
              <div className="flex items-center text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                <BarChart3 className="h-4 w-4 mr-2 text-ocean-600 dark:text-ocean-400" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">Funding: {project.funding}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Project Content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Overview</h2>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.fullDescription }}
                />
              </div>
              
              <div>
                <div className="sticky top-24">
                  <div className="relative rounded-xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-800 aspect-[4/3]">
                    {!imageError ? (
                      <Image 
                        src={project.image} 
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Partners</h3>
                    <ul className="space-y-3">
                      {project.partners.map((partner, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-ocean-100 dark:bg-ocean-900 flex items-center justify-center text-sm font-medium text-ocean-700 dark:text-ocean-300 mr-3">
                            {partner.charAt(0)}
                          </div>
                          <span className="text-gray-800 dark:text-gray-200">{partner}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Publications */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-ocean-600 dark:text-ocean-400" />
                <span>Publications</span>
              </h2>
              
              <div className="space-y-6">
                {project.publications.map((publication, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {publication.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{publication.authors}</p>
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span>{publication.journal}</span>
                      <span>•</span>
                      <span>{publication.year}</span>
                      <span>•</span>
                      <span className="font-mono">DOI: {publication.doi}</span>
                    </div>
                    <a 
                      href={publication.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:underline"
                    >
                      <span>View publication</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resources */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2 text-ocean-600 dark:text-ocean-400" />
                <span>Resources</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.resources.map((resource, index) => (
                  <a 
                    key={index}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-ocean-300 dark:hover:border-ocean-700 transition-colors group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-ocean-600 dark:group-hover:text-ocean-400">
                      {resource.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{resource.description}</p>
                    <div className="flex items-center text-ocean-600 dark:text-ocean-400 group-hover:underline">
                      <span>Access resource</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 