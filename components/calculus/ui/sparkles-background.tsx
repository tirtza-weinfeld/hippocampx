"use client"

import { useEffect, useState } from "react"
import { SparklesCore } from "./sparkles"

export function SparklesBackground() {
  const [enabled, setEnabled] = useState(false) // Default to false, will be updated in useEffect

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Initialize from cookie, but respect prefers-reduced-motion
    const sparklesEnabled = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sparkles="))
      ?.split("=")[1]
    
    // Only enable if explicitly set to true in cookie AND not prefers-reduced-motion
    setEnabled(sparklesEnabled === "true" && !prefersReducedMotion)

    // Listen for sparkles state changes
    const handleSparklesChange = (event: CustomEvent<{ enabled: boolean }>) => {
      // Only allow enabling if not prefers-reduced-motion
      if (!prefersReducedMotion) {
        setEnabled(event.detail.enabled)
      }
    }

    window.addEventListener("sparkles-state-change", handleSparklesChange as EventListener)

    return () => {
      window.removeEventListener("sparkles-state-change", handleSparklesChange as EventListener)
    }
  }, [])

  if (!enabled) return null

  return (
    <div className="absolute inset-0 w-64 h-full">
      <SparklesCore
        id="nav-sparkles"
        className="absolute inset-0"
        background="transparent"
        minSize={0.4}
        maxSize={1}
        particleColor="#7C3AED"
        particleDensity={10}
      />
    </div>
  )
} 