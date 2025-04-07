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
      <section className="bg-gradient-to-br from-ocean-50 via-ocean-100 to-ocean-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              About <span className="text-ocean-600 dark:text-ocean-400">OpenOcean</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Creating a global network of smart ocean monitoring buoys in collaboration with REEFlect
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a href="#mission" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-ocean-600 dark:text-ocean-400 px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Globe className="w-5 h-5" />
                <span>Our Mission</span>
              </a>
              <a href="#team" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-ocean-600 dark:text-ocean-400 px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Users className="w-5 h-5" />
                <span>The Team</span>
              </a>
              <a href="#technology" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-ocean-600 dark:text-ocean-400 px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Cpu className="w-5 h-5" />
                <span>Technology</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <section ref={missionRef} id="mission" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900 text-ocean-600 dark:text-ocean-400 text-sm font-medium mb-4">
              <Globe className="w-4 h-4 mr-2" />
              Our Mission
            </div>
            
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Monitoring and Protecting Our Oceans
            </h2>
            
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p>
                OpenOcean is dedicated to advancing our understanding of ocean health through a comprehensive network of smart monitoring buoys deployed across the world's oceans. Our mission is to collect, analyze, and share critical ocean data to support scientific research, conservation efforts, and environmental policy-making.
              </p>
              
              <p>
                In collaboration with REEFlect, our specialized coral reef monitoring program, we place particular emphasis on vulnerable marine ecosystems like coral reefs, gathering real-time data on parameters such as temperature, salinity, pH levels, and dissolved oxygen to track the health of these vital habitats.
              </p>
              
              <h3>Our Goals</h3>
              
              <ul>
                <li>Deploy a global network of smart buoys to monitor ocean health in real-time</li>
                <li>Make ocean data accessible to researchers, conservationists, and the public</li>
                <li>Develop early warning systems for coral bleaching events and other marine stressors</li>
                <li>Create open-source tools for oceanic data visualization and analysis</li>
                <li>Support evidence-based marine conservation and policy initiatives</li>
              </ul>
              
              <p>
                By combining cutting-edge technology with scientific expertise, OpenOcean aims to be at the forefront of ocean monitoring and conservation, creating a comprehensive database of ocean health metrics that will inform conservation efforts for generations to come.
              </p>
            </div>
            
            <div className="relative h-80 rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-ocean-500/20 to-ocean-600/20">
              {!imageErrors['coral-reef'] ? (
                <Image 
                  src="/images/coral-reef.jpg" 
                  alt="Coral reef monitoring"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform hover:scale-105 duration-700"
                  onError={() => handleImageError('coral-reef')}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-ocean-600 dark:text-ocean-400">
                  <Globe className="w-16 h-16 mb-2 opacity-70" />
                  <p className="text-center text-lg font-medium">Coral Reef Monitoring</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-lg font-medium">REEFlect Monitoring Station</p>
                  <p className="text-sm opacity-80">Great Barrier Reef, Australia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section ref={teamRef} id="team" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900 text-ocean-600 dark:text-ocean-400 text-sm font-medium mb-4">
              <Users className="w-4 h-4 mr-2" />
              The Team
            </div>
            
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Meet the Ocean Experts
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-10">
              OpenOcean brings together leading marine scientists, engineers, conservationists, and data specialists united by a passion for ocean health and conservation.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-ocean-100 dark:bg-ocean-900/40 flex items-center justify-center">
                      {!imageErrors['srikanth'] ? (
                        <Image 
                          src="/images/beach-sunset.jpg" 
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
                      <p className="text-ocean-600 dark:text-ocean-400">Co-Founder & CEO</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Dublin High School student and tech enthusiast passionate about ocean conservation. Co-founded REEFlect to develop advanced smart buoys for coral reef monitoring.
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-ocean-100 dark:bg-ocean-900/40 flex items-center justify-center">
                      {!imageErrors['krishiv'] ? (
                        <Image 
                          src="/images/algae-water.jpg" 
                          alt="Krishiv Jaini"
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={() => handleImageError('krishiv')}
                        />
                      ) : (
                        <User className="w-8 h-8 text-ocean-500 dark:text-ocean-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Krishiv Jaini</h3>
                      <p className="text-ocean-600 dark:text-ocean-400">Co-Founder & CTO</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Dublin High School student with expertise in software development and sensor technology. Co-founded REEFlect with a mission to protect marine ecosystems.
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-ocean-100 dark:bg-ocean-900/40 flex items-center justify-center">
                      {!imageErrors['team3'] ? (
                        <Image 
                          src="https://source.unsplash.com/random/200x200?woman,scientist" 
                          alt="Dr. Aisha Johnson"
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={() => handleImageError('team3')}
                        />
                      ) : (
                        <User className="w-8 h-8 text-ocean-500 dark:text-ocean-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dr. Aisha Johnson</h3>
                      <p className="text-ocean-600 dark:text-ocean-400">Data Science Director</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Leading our data analytics team with expertise in machine learning and oceanographic data modeling.
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-ocean-100 dark:bg-ocean-900/40 flex items-center justify-center">
                      {!imageErrors['team4'] ? (
                        <Image 
                          src="https://source.unsplash.com/random/200x200?man,scientist,researcher" 
                          alt="Dr. James Wilson"
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={() => handleImageError('team4')}
                        />
                      ) : (
                        <User className="w-8 h-8 text-ocean-500 dark:text-ocean-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dr. James Wilson</h3>
                      <p className="text-ocean-600 dark:text-ocean-400">Conservation Director</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Environmental policy expert with a focus on translating ocean data into conservation action and policy.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/careers" className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-300 font-medium">
                <span>Join our team</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section ref={technologyRef} id="technology" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900 text-ocean-600 dark:text-ocean-400 text-sm font-medium mb-4">
              <Cpu className="w-4 h-4 mr-2" />
              Technology
            </div>
            
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Smart Buoys & Data Systems
            </h2>
            
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p>
                Our smart buoy network represents the cutting edge of ocean monitoring technology. Each buoy is equipped with a suite of sensors that measure key water quality parameters and oceanographic conditions in real-time.
              </p>
              
              <h3>The REEFlect Partnership</h3>
              
              <p>
                Through our partnership with REEFlect, we've developed specialized monitoring systems specifically designed for coral reef environments. These advanced buoys incorporate REEFlect's proprietary sensors capable of detecting subtle changes in water conditions that may impact coral health.
              </p>
              
              <div className="not-prose bg-ocean-50 dark:bg-gray-800 rounded-xl p-6 my-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-40 h-40 flex-shrink-0 bg-ocean-100 dark:bg-ocean-900/30 rounded-lg flex items-center justify-center">
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
                      <span className="text-ocean-500 dark:text-ocean-400 font-bold text-2xl">REEFlect</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">REEFlect Technology</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                      REEFlect specializes in coral reef monitoring technology, providing advanced sensors and data analytics for tracking reef health and predicting potential bleaching events.
                    </p>
                    <a 
                      href="https://reeflect.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-300 text-sm font-medium"
                    >
                      <span>Visit REEFlect website</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
              
              <h3>Smart Buoy Features</h3>
              
              <ul>
                <li><strong>Sensor Suite:</strong> Measures temperature, salinity, pH, dissolved oxygen, turbidity, and more</li>
                <li><strong>Solar Powered:</strong> Self-sustaining energy system with battery backup</li>
                <li><strong>Satellite Connectivity:</strong> Real-time data transmission to our cloud platform</li>
                <li><strong>Weather Resistant:</strong> Designed to withstand extreme marine conditions</li>
                <li><strong>Anti-fouling System:</strong> Prevents biological growth that could interfere with readings</li>
                <li><strong>Open Data Protocol:</strong> Standardized data formats for easy integration with research platforms</li>
              </ul>
              
              <h3>Data Platform</h3>
              
              <p>
                Our cloud-based data platform collects, processes, and stores all the data from our buoy network. Using advanced analytics and machine learning, we can identify patterns, detect anomalies, and generate insights that would be impossible through manual analysis.
              </p>
              
              <p>
                All data is made available through our open API, allowing researchers, conservationists, and other stakeholders to access and utilize this valuable information in their own work.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-64 rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-ocean-500/20 to-ocean-600/20">
                {!imageErrors['buoy-diagram'] ? (
                  <Image 
                    src="/images/buoy-navigation.jpg" 
                    alt="Smart buoy diagram"
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={() => handleImageError('buoy-diagram')}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-16 h-16 text-ocean-600/50 dark:text-ocean-400/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white font-medium">Smart Buoy Diagram</span>
                </div>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-ocean-500/20 to-ocean-600/20">
                {!imageErrors['data-dashboard'] ? (
                  <Image 
                    src="/images/iceberg.jpg" 
                    alt="OpenOcean data dashboard"
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={() => handleImageError('data-dashboard')}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-16 h-16 text-ocean-600/50 dark:text-ocean-400/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white font-medium">Data Dashboard</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/map" className="inline-flex items-center px-6 py-3 rounded-lg bg-ocean-600 hover:bg-ocean-700 text-white font-medium transition-colors">
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