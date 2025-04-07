'use client'

import { useEffect, useRef } from 'react'

export default function GlobeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const containerWidth = canvas.parentElement?.clientWidth || 400
      canvas.width = containerWidth
      canvas.height = containerWidth
    }
    
    setCanvasDimensions()
    window.addEventListener('resize', setCanvasDimensions)
    
    // Globe parameters
    const radius = canvas.width * 0.4
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    // Animation parameters
    let rotation = 0
    let dots: {x: number, y: number, size: number, color: string, speed: number}[] = []
    
    // Generate random dots representing data points/buoys
    const generateDots = () => {
      dots = []
      const numDots = 12
      
      for (let i = 0; i < numDots; i++) {
        // Random position on the globe
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 0.8 * radius + 0.1 * radius
        
        dots.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          size: 2 + Math.random() * 4,
          color: i % 2 === 0 ? '#14b8a6' : '#0ea5e9',
          speed: 0.01 + Math.random() * 0.02
        })
      }
    }
    
    generateDots()
    
    // Draw the globe and animate
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw globe circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Draw latitude lines
      const numLatitudes = 6
      for (let i = 1; i < numLatitudes; i++) {
        const latRadius = (radius / numLatitudes) * i
        ctx.beginPath()
        ctx.arc(centerX, centerY, latRadius, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)'
        ctx.lineWidth = 1
        ctx.stroke()
      }
      
      // Draw longitude lines (rotating with animation)
      const numLongitudes = 8
      for (let i = 0; i < numLongitudes; i++) {
        const angle = (i / numLongitudes) * Math.PI * 2 + rotation
        
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - radius)
        ctx.quadraticCurveTo(
          centerX + Math.cos(angle) * radius * 0.5,
          centerY,
          centerX,
          centerY + radius
        )
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)'
        ctx.lineWidth = 1
        ctx.stroke()
      }
      
      // Draw and animate dots
      dots.forEach(dot => {
        // Calculate position relative to center
        const dx = dot.x - centerX
        const dy = dot.y - centerY
        
        // Calculate angle and distance from center
        const angle = Math.atan2(dy, dx)
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Update position (rotate around center)
        const newAngle = angle + dot.speed
        dot.x = centerX + Math.cos(newAngle) * distance
        dot.y = centerY + Math.sin(newAngle) * distance
        
        // Draw dot
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
        ctx.fillStyle = dot.color
        ctx.fill()
        
        // Draw glow effect
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size * 2, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          dot.x, dot.y, dot.size * 0.5,
          dot.x, dot.y, dot.size * 2
        )
        gradient.addColorStop(0, `${dot.color}99`)
        gradient.addColorStop(1, `${dot.color}00`)
        ctx.fillStyle = gradient
        ctx.fill()
      })
      
      // Update rotation for next frame
      rotation += 0.002
      
      // Continue animation
      requestAnimationFrame(animate)
    }
    
    // Start animation
    const animationId = requestAnimationFrame(animate)
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', setCanvasDimensions)
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  return (
    <div className="w-full aspect-square">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full rounded-full" 
        style={{ filter: 'drop-shadow(0 0 10px rgba(20, 184, 166, 0.2))' }}
      />
    </div>
  )
} 