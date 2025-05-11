'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Globe, Users, Cpu, ArrowRight, ExternalLink, User, Image as ImageIcon } from 'lucide-react'

export default function AboutPage() {
  const missionRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const technologyRef = useRef<HTMLDivElement>(null)
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})
  
  useEffect(() => {
    // Handle scroll to section based on hash
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#mission' && missionRef.current) {
        missionRef.current.scrollIntoView({ behavior: 'smooth' })
      } else if (hash === '#team' && teamRef.current) {
        teamRef.current.scrollIntoView({ behavior: 'smooth' })
      } else if (hash === '#technology' && technologyRef.current) {
        technologyRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
    
    // Initial check for hash
    handleHashChange()
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleImageError = (imageName: string) => {
    setImageErrors(prev => ({...prev, [imageName]: true}))
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-br from-ocean-800 to-ocean-950 py-24 pt-32 border-b-4 border-ocean-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise-pattern.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[5%] w-72 h-72 rounded-full bg-gradient-to-br from-ocean-300/10 to-transparent blur-3xl animate-pulse-slow pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[10%] w-52 h-52 rounded-full bg-gradient-to-br from-blue-300/10 to-transparent blur-3xl animate-float pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="annotation text-ocean-200 rotate-1 mb-3">Our story</div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-bold text-white mb-6">
              About <span className="font-serif text-ocean-400 bg-clip-text text-transparent bg-gradient-to-r from-ocean-400 to-teal-400 relative">
                OpenOcean
                <span className="absolute bottom-2 left-0 w-full h-1 bg-ocean-400/30 -z-10 rotate-1"></span>
              </span>
            </h1>
            <p className="text-xl text-ocean-100 mb-10 font-handwritten leading-relaxed">
              Creating a global network of smart ocean monitoring buoys in collaboration with REEFlect
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a href="#mission" className="inline-flex items-center gap-2 bg-ocean-700/30 text-ocean-200 hover:text-white px-6 py-3 rounded blob-shape border border-ocean-600/50 hover:border-ocean-500 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 font-handwritten text-lg">
                <Globe className="w-5 h-5" />
                <span>Our Mission</span>
              </a>
              <a href="#team" className="inline-flex items-center gap-2 bg-ocean-700/30 text-ocean-200 hover:text-white px-6 py-3 rounded blob-shape-alt border border-ocean-600/50 hover:border-ocean-500 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 font-handwritten text-lg">
                <Users className="w-5 h-5" />
                <span>The Team</span>
              </a>
              <a href="#technology" className="inline-flex items-center gap-2 bg-ocean-700/30 text-ocean-200 hover:text-white px-6 py-3 rounded blob-shape border border-ocean-600/50 hover:border-ocean-500 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 font-handwritten text-lg">
                <Cpu className="w-5 h-5" />
                <span>Technology</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <section ref={missionRef} id="mission" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900/60 text-ocean-600 dark:text-ocean-400 text-sm font-handwritten mb-4 border border-ocean-200 dark:border-ocean-800 transform -rotate-1">
              <Globe className="w-4 h-4 mr-2" />
              Our Mission
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-ocean-600 to-ocean-800 dark:from-ocean-400 dark:to-ocean-300 brush-bg">
              Monitoring and Protecting Our Oceans
            </h2>
            
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 font-handwritten leading-relaxed">
                OpenOcean is dedicated to advancing our understanding of ocean health through a comprehensive network of smart monitoring buoys deployed across the world's oceans. Our mission is to collect, analyze, and share critical ocean data to support scientific research, conservation efforts, and environmental policy-making.
              </p>
              
              <p className="text-lg text-gray-700 dark:text-gray-300">
                In collaboration with REEFlect, our specialized coral reef monitoring program, we place particular emphasis on vulnerable marine ecosystems like coral reefs, gathering real-time data on parameters such as temperature, salinity, pH levels, and dissolved oxygen to track the health of these vital habitats.
              </p>
              
              <h3 className="text-2xl font-serif italic font-bold text-ocean-700 dark:text-ocean-400 mt-8 mb-4 organic-underline inline-block">Our Goals</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text">Deploy a global network of smart buoys to monitor ocean health in real-time</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text">Make ocean data accessible to researchers, conservationists, and the public</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text">Develop early warning systems for coral bleaching events and other marine stressors</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text">Create open-source tools for oceanic data visualization and analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text">Support evidence-based marine conservation and policy initiatives</span>
                </li>
              </ul>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mt-6 font-handwritten leading-relaxed">
                By combining cutting-edge technology with scientific expertise, OpenOcean aims to be at the forefront of ocean monitoring and conservation, creating a comprehensive database of ocean health metrics that will inform conservation efforts for generations to come.
              </p>
            </div>
            
            <div className="relative h-80 hand-drawn-box overflow-hidden shadow-xl bg-gradient-to-r from-ocean-500/80 to-ocean-600/80 border border-ocean-600/30 transform transition-all duration-500 hover:scale-[1.01] mt-10">
              {!imageErrors['coral-reef'] ? (
                <Image 
                  src="/images/coral-reef.jpg" 
                  alt="Coral reef monitoring"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform hover:scale-105 duration-700 mix-blend-overlay opacity-90"
                  onError={() => handleImageError('coral-reef')}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-ocean-100">
                  <Globe className="w-16 h-16 mb-2 opacity-70" />
                  <p className="text-center text-lg font-medium font-handwritten">Coral Reef Monitoring</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-xl font-medium font-serif italic">REEFlect Monitoring Station</p>
                  <p className="text-sm opacity-80 font-handwritten">Great Barrier Reef, Australia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section ref={teamRef} id="team" className="py-20 bg-gradient-to-b from-ocean-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900/60 text-ocean-600 dark:text-ocean-400 text-sm font-handwritten mb-4 border border-ocean-200 dark:border-ocean-800">
              <Users className="w-4 h-4 mr-2" />
              The Team
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-ocean-600 to-ocean-800 dark:from-ocean-400 dark:to-ocean-300 brush-bg">
              Meet the Ocean Expert
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 font-handwritten leading-relaxed">
              OpenOcean is led by a passionate individual dedicated to ocean health and conservation, bringing together expertise in marine science, engineering, and data analysis. We are always looking to expand our team with like-minded experts.
            </p>
            
            <div className="grid grid-cols-1 gap-6 mb-12 justify-items-center">
              <div className="bg-white dark:bg-gray-900 rounded overflow-hidden transition-all duration-300 hover:shadow-glow-sm hover:-translate-y-1 border border-ocean-200 dark:border-ocean-800/50 shadow-lg max-w-md">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-ocean-100 dark:bg-ocean-900/40 flex items-center justify-center border-2 border-ocean-300 dark:border-ocean-700">
                      {!imageErrors['srikanth'] ? (
                        <Image 
                          src="https://source.unsplash.com/random/200x200?portrait,professional" 
                          alt="Srikanth Samy"
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={() => handleImageError('srikanth')}
                        />
                      ) : (
                        <User className="w-8 h-8 text-ocean-500 dark:text-ocean-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Srikanth Samy</h3>
                      <p className="text-ocean-600 dark:text-ocean-400 font-medium">Head, Founder & CEO</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-handwritten leading-relaxed">
                    Dublin High School student and tech enthusiast passionate about ocean conservation. Co-founded REEFlect to develop advanced smart buoys for coral reef monitoring.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/careers" className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-300 font-medium bg-ocean-50 dark:bg-ocean-900/30 px-4 py-2 rounded border border-ocean-200 dark:border-ocean-800 transition-colors hover:bg-ocean-100 dark:hover:bg-ocean-900/60">
                <span>Join our team</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section ref={technologyRef} id="technology" className="py-20 bg-gradient-to-b from-white to-ocean-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900/60 text-ocean-600 dark:text-ocean-400 text-sm font-handwritten mb-4 border border-ocean-200 dark:border-ocean-800">
              <Cpu className="w-4 h-4 mr-2" />
              Technology
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-ocean-600 to-ocean-800 dark:from-ocean-400 dark:to-ocean-300 brush-bg">
              Smart Buoys & Data Systems
            </h2>
            
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 font-handwritten leading-relaxed">
                Our smart buoy network represents the cutting edge of ocean monitoring technology. Each buoy is equipped with a suite of sensors that measure key water quality parameters and oceanographic conditions in real-time.
              </p>
              
              <h3 className="text-2xl font-serif italic font-bold text-ocean-700 dark:text-ocean-400 mt-8 mb-4 organic-underline inline-block">The REEFlect Partnership</h3>
              
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Through our partnership with REEFlect, we've developed specialized monitoring systems specifically designed for coral reef environments. These advanced buoys incorporate REEFlect's proprietary sensors capable of detecting subtle changes in water conditions that may impact coral health.
              </p>
              
              <div className="not-prose bg-gradient-to-br from-ocean-50 to-ocean-100 dark:from-gray-900 dark:to-gray-800 rounded shadow-lg border border-ocean-200 dark:border-ocean-800/50 p-6 my-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-40 h-40 flex-shrink-0 bg-ocean-200/50 dark:bg-ocean-900/30 rounded flex items-center justify-center border border-ocean-300/50 dark:border-ocean-700/50 shadow-inner">
                    {!imageErrors['reeflect-logo'] ? (
                      <Image 
                        src="/images/buoy-solar.jpg" 
                        alt="REEFlect Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                        className="p-3"
                        onError={() => handleImageError('reeflect-logo')}
                      />
                    ) : (
                      <span className="text-ocean-600 dark:text-ocean-400 font-bold text-2xl">REEFlect</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">REEFlect Technology</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 font-handwritten leading-relaxed">
                      REEFlect specializes in coral reef monitoring technology, providing advanced sensors and data analytics for tracking reef health and predicting potential bleaching events.
                    </p>
                    <a 
                      href="https://reeflect.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-300 text-sm font-medium bg-white/80 dark:bg-gray-800/50 px-3 py-1.5 rounded border border-ocean-200 dark:border-ocean-800/50 transition-colors hover:bg-white dark:hover:bg-gray-800"
                    >
                      <span>Visit REEFlect website</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-serif italic font-bold text-ocean-700 dark:text-ocean-400 mt-8 mb-4 organic-underline inline-block">Smart Buoy Features</h3>
              
              <ul className="space-y-3 mt-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text"><strong className="text-ocean-700 dark:text-ocean-400">Sensor Suite:</strong> Measures temperature, salinity, pH, dissolved oxygen, turbidity, and more</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text"><strong className="text-ocean-700 dark:text-ocean-400">Solar Powered:</strong> Self-sustaining energy system with battery backup</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text"><strong className="text-ocean-700 dark:text-ocean-400">Satellite Connectivity:</strong> Real-time data transmission to our cloud platform</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text"><strong className="text-ocean-700 dark:text-ocean-400">Weather Resistant:</strong> Designed to withstand extreme marine conditions</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text"><strong className="text-ocean-700 dark:text-ocean-400">Anti-fouling System:</strong> Prevents biological growth that could interfere with readings</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ocean-100 dark:bg-ocean-900/60 flex items-center justify-center mr-3 mt-0.5 border border-ocean-200 dark:border-ocean-700 doodle-border">
                    <div className="w-2 h-2 rounded-full bg-ocean-600 dark:bg-ocean-400"></div>
                  </div>
                  <span className="wavy-text"><strong className="text-ocean-700 dark:text-ocean-400">Open Data Protocol:</strong> Standardized data formats for easy integration with research platforms</span>
                </li>
              </ul>
              
              <h3 className="text-2xl font-serif italic font-bold text-ocean-700 dark:text-ocean-400 mt-8 mb-4 organic-underline inline-block">Data Platform</h3>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 font-handwritten leading-relaxed">
                Our cloud-based data platform collects, processes, and stores all the data from our buoy network. Using advanced analytics and machine learning, we can identify patterns, detect anomalies, and generate insights that would be impossible through manual analysis.
              </p>
              
              <p className="text-lg text-gray-700 dark:text-gray-300">
                All data is made available through our open API, allowing researchers, conservationists, and other stakeholders to access and utilize this valuable information in their own work.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-64 rounded overflow-hidden shadow-xl bg-gradient-to-r from-ocean-500/80 to-ocean-600/80 border border-ocean-600/30 transform transition-all duration-500 hover:scale-[1.02]">
                {!imageErrors['buoy-diagram'] ? (
                  <Image 
                    src="/images/buoy-navigation.jpg" 
                    alt="Smart buoy diagram"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="mix-blend-overlay opacity-90"
                    onError={() => handleImageError('buoy-diagram')}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-16 h-16 text-ocean-100/70" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <span className="text-white font-medium text-lg">Smart Buoy Diagram</span>
                </div>
              </div>
              <div className="relative h-64 rounded overflow-hidden shadow-xl bg-gradient-to-r from-ocean-500/80 to-ocean-600/80 border border-ocean-600/30 transform transition-all duration-500 hover:scale-[1.02]">
                {!imageErrors['data-dashboard'] ? (
                  <Image 
                    src="/images/iceberg.jpg" 
                    alt="OpenOcean data dashboard"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="mix-blend-overlay opacity-90"
                    onError={() => handleImageError('data-dashboard')}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-16 h-16 text-ocean-100/70" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <span className="text-white font-medium text-lg">Data Dashboard</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/map" className="inline-flex items-center px-6 py-3 rounded bg-ocean-600 hover:bg-ocean-700 text-white font-medium transition-all duration-300 border border-ocean-500 hover:border-ocean-400 shadow-glow-sm hover:shadow-glow-md">
                <span>Explore Our Buoy Network</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 