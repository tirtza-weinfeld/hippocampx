"use client"

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react"
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

// useSyncExternalStore for window size - must cache snapshot
let cachedWindowSize = { width: 0, height: 0 }

function subscribeWindowSize(callback: () => void) {
  window.addEventListener("resize", callback)
  return () => window.removeEventListener("resize", callback)
}

function getWindowSizeSnapshot() {
  const width = window.innerWidth
  const height = window.innerHeight
  if (cachedWindowSize.width !== width || cachedWindowSize.height !== height) {
    cachedWindowSize = { width, height }
  }
  return cachedWindowSize
}

const serverSnapshot = { width: 0, height: 0 }
function getWindowSizeServerSnapshot() {
  return serverSnapshot
}

export function SparklesCore({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleColor = "#FFF",
  particleDensity = 10,
}: SparklesProps) {
  const windowSize = useSyncExternalStore(
    subscribeWindowSize,
    getWindowSizeSnapshot,
    getWindowSizeServerSnapshot
  )

  const particleRef = useRef<HTMLCanvasElement>(null)

  // Derive particles from window size - use useMemo instead of state
  const particles = useMemo(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return []

    const particleCount = Math.min(
      Math.floor((windowSize.width * windowSize.height) / 10000) * particleDensity,
      500
    )
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * windowSize.width,
      y: Math.random() * windowSize.height,
      size: Math.random() * (maxSize - minSize) + minSize,
      velocity: {
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
      },
    }))
  }, [windowSize.width, windowSize.height, minSize, maxSize, particleDensity])

  // Store mutable particle positions in ref for animation
  const particlePositions = useRef<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    // Initialize positions from particles
    particlePositions.current = particles.map((p) => ({ x: p.x, y: p.y }))
  }, [particles])

  useEffect(() => {
    if (!particleRef.current || particles.length === 0) return

    const ctx = particleRef.current.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let lastTime = 0

    function animate(time: number) {
      if (!ctx) return

      if (lastTime === 0) {
        lastTime = time
      }
      const deltaTime = time - lastTime
      lastTime = time

      ctx.clearRect(0, 0, windowSize.width, windowSize.height)
      ctx.fillStyle = background
      ctx.fillRect(0, 0, windowSize.width, windowSize.height)

      particles.forEach((particle, i) => {
        const pos = particlePositions.current[i]
        if (!pos) return

        // Update position using ref (mutable)
        pos.x += particle.velocity.x * deltaTime * 0.1
        pos.y += particle.velocity.y * deltaTime * 0.1

        // Wrap around screen
        if (pos.x < 0) pos.x = windowSize.width
        if (pos.x > windowSize.width) pos.x = 0
        if (pos.y < 0) pos.y = windowSize.height
        if (pos.y > windowSize.height) pos.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, particle.size, 0, Math.PI * 2)
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
