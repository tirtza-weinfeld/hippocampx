"use client"

import { useSyncExternalStore } from "react"
import { SparklesCore } from "./sparkles"

const SPARKLES_EVENT = "sparkles-state-change"
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeSparkles(callback: () => void) {
  function handleEvent() {
    callback()
  }
  window.addEventListener(SPARKLES_EVENT, handleEvent)
  return () => window.removeEventListener(SPARKLES_EVENT, handleEvent)
}

function getSparklesSnapshot() {
  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches
  if (prefersReducedMotion) return false

  const sparklesEnabled = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sparkles="))
    ?.split("=")[1]
  return sparklesEnabled === "true"
}

function getSparklesServerSnapshot() {
  return false
}

export function SparklesBackground() {
  const enabled = useSyncExternalStore(
    subscribeSparkles,
    getSparklesSnapshot,
    getSparklesServerSnapshot
  )

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
