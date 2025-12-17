"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { useSparklesStore } from "./store/sparkles-store"

interface SparklesCoreProps {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleColor?: string
  particleDensity?: number
  animate?: boolean
}

interface Particle {
  x: number
  y: number
  size: number
  velocityX: number
  velocityY: number
}

function createParticles(width: number, height: number, minSize: number, maxSize: number, density: number): Particle[] {
  if (width === 0 || height === 0) return []

  const count = Math.min(Math.floor((width * height) / 10000) * density, 500)
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * (maxSize - minSize) + minSize,
    velocityX: (Math.random() - 0.5) * 0.3,
    velocityY: (Math.random() - 0.5) * 0.3,
  }))
}

function SparklesCore({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleColor = "oklch(0.5 0.25 300)",
  particleDensity = 10,
  animate = true,
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    particles: [] as Particle[],
    width: 0,
    height: 0,
    animationId: 0,
    lastTime: 0,
  })

  // Handle resize and particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const state = stateRef.current

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      state.width = width
      state.height = height
      canvas.width = width
      canvas.height = height
      state.particles = createParticles(width, height, minSize, maxSize, particleDensity)
    })

    // Initial size from parent
    const parent = canvas.parentElement
    if (parent) {
      state.width = parent.clientWidth
      state.height = parent.clientHeight
      canvas.width = state.width
      canvas.height = state.height
      state.particles = createParticles(state.width, state.height, minSize, maxSize, particleDensity)
      observer.observe(parent)
    }

    return () => observer.disconnect()
  }, [minSize, maxSize, particleDensity])

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const state = stateRef.current

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, state.width, state.height)
      ctx.fillStyle = background
      ctx.fillRect(0, 0, state.width, state.height)

      for (const p of state.particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()
      }
    }

    function loop(time: number) {
      if (state.lastTime === 0) state.lastTime = time
      const dt = time - state.lastTime
      state.lastTime = time

      for (const p of state.particles) {
        p.x += p.velocityX * dt * 0.1
        p.y += p.velocityY * dt * 0.1

        if (p.x < 0) p.x = state.width
        if (p.x > state.width) p.x = 0
        if (p.y < 0) p.y = state.height
        if (p.y > state.height) p.y = 0
      }

      draw()
      state.animationId = requestAnimationFrame(loop)
    }

    if (animate) {
      state.animationId = requestAnimationFrame(loop)
    } else {
      draw()
    }

    return () => {
      cancelAnimationFrame(state.animationId)
      state.lastTime = 0
    }
  }, [animate, background, particleColor])

  return (
    <canvas
      id={id}
      ref={canvasRef}
      className={cn("absolute inset-0", className)}
    />
  )
}

export function SparklesBackground() {
  const reducedMotion = useReducedMotion() ?? false
  const enabled = useSparklesStore((s) => s.enabled)

  useEffect(() => {
    void useSparklesStore.persist.rehydrate()
  }, [])

  if (!enabled) return null

  return (
    <div className="absolute inset-0 ">
      <SparklesCore
        id="nav-sparkles"
        className="absolute inset-0 "
        background="transparent"
        minSize={0.4}
        maxSize={1}
        particleColor="oklch(0.5 0.25 300)"
        particleDensity={10}
        animate={!reducedMotion}
      />
    </div>
  )
}
