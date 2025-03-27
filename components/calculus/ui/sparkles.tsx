"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface SparklesProps {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleColor?: string
  particleDensity?: number
}

export const SparklesCore = ({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleColor = "#FFF",
  particleDensity = 10,
}: SparklesProps) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; velocity: { x: number; y: number } }>>([])
  const particleRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return

    const particleCount = Math.min(Math.floor((windowSize.width * windowSize.height) / 10000) * particleDensity, 500)
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * windowSize.width,
      y: Math.random() * windowSize.height,
      size: Math.random() * (maxSize - minSize) + minSize,
      velocity: {
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
      },
    }))

    setParticles(newParticles)
  }, [windowSize, minSize, maxSize, particleDensity])

  useEffect(() => {
    if (!particleRef.current || particles.length === 0) return

    const ctx = particleRef.current.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (lastTime === 0) {
        lastTime = time
      }
      const deltaTime = time - lastTime
      lastTime = time

      ctx.clearRect(0, 0, windowSize.width, windowSize.height)
      ctx.fillStyle = background
      ctx.fillRect(0, 0, windowSize.width, windowSize.height)

      particles.forEach((particle) => {
        // Update particle position
        particle.x += particle.velocity.x * deltaTime * 0.1
        particle.y += particle.velocity.y * deltaTime * 0.1

        // Wrap particles around the screen
        if (particle.x < 0) particle.x = windowSize.width
        if (particle.x > windowSize.width) particle.x = 0
        if (particle.y < 0) particle.y = windowSize.height
        if (particle.y > windowSize.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [particles, windowSize, background, particleColor])

  return (
    <canvas
      id={id}
      ref={particleRef}
      width={windowSize.width}
      height={windowSize.height}
      className={cn("absolute inset-0", className)}
    />
  )
}

