'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CarouselImage {
  src: string
  alt: string
}

const carouselImages: CarouselImage[] = [
  { src: '/misc/reeflect1.png', alt: 'Buoy Array Deployment' },
  { src: '/misc/reeflect3.png', alt: 'Sensor Pod Close-up' },
  { src: '/misc/reeflect4.webp', alt: 'Data Visualization Interface' },
]

const ReeflectCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="relative w-[clamp(300px,80%,480px)] h-auto aspect-[4/3] rounded-xl overflow-hidden shadow-2xl group transform hover:scale-105 transition-all duration-500 ease-out hand-drawn-box-alt mx-auto">
      {carouselImages.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          layout="fill"
          objectFit="cover"
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-80 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-white dark:text-gray-100 text-shadow">
          REEFlect Efforts: {carouselImages[currentIndex].alt}
        </p>
      </div>
    </div>
  )
}

export default ReeflectCarousel
