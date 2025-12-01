"use client"

import { useSyncExternalStore, useCallback } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SparklesToggleProps {
  side?: "top" | "right" | "bottom" | "left"
}

// Custom event for sparkles state changes
const SPARKLES_EVENT = "sparkles-state-change"
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

// useSyncExternalStore for reduced motion preference
function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener("change", callback)
  return () => mediaQuery.removeEventListener("change", callback)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getReducedMotionServerSnapshot() {
  return false
}

// useSyncExternalStore for sparkles enabled state (cookie + event)
function subscribeSparkles(callback: () => void) {
  function handleEvent() {
    callback()
  }
  window.addEventListener(SPARKLES_EVENT, handleEvent)
  window.addEventListener("storage", handleEvent)
  return () => {
    window.removeEventListener(SPARKLES_EVENT, handleEvent)
    window.removeEventListener("storage", handleEvent)
  }
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

export function SparklesToggle({ side = "top" }: SparklesToggleProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )

  const enabled = useSyncExternalStore(
    subscribeSparkles,
    getSparklesSnapshot,
    getSparklesServerSnapshot
  )

  const toggleSparkles = useCallback(function handleToggle() {
    if (prefersReducedMotion) return

    const newValue = !enabled
    document.cookie = `sparkles=${newValue}; path=/; max-age=${60 * 60 * 24 * 365}`
    window.dispatchEvent(new CustomEvent(SPARKLES_EVENT, { detail: { enabled: newValue } }))
  }, [prefersReducedMotion, enabled])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSparkles}
            className="h-9 w-9 rounded-full transition-colors hover:bg-accent"
            aria-label={enabled ? "Disable sparkles" : "Enable sparkles"}
            disabled={prefersReducedMotion}
          >
            <Sparkles className={`h-5 w-5 ${enabled ? "text-primary" : "text-muted-foreground"}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side}>
          {prefersReducedMotion
            ? "Sparkles disabled (reduced motion enabled)"
            : enabled
              ? "Disable sparkles"
              : "Enable sparkles"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
