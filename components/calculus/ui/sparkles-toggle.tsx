"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SparklesToggleProps {
  side?: "top" | "right" | "bottom" | "left"
}

// Create a custom event for sparkles state changes
const SPARKLES_EVENT = "sparkles-state-change"

export function SparklesToggle({ side = "top" }: SparklesToggleProps) {
  const [mounted, setMounted] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Initialize from cookie and check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const sparklesEnabled = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sparkles="))
      ?.split("=")[1]
    
    setEnabled(sparklesEnabled === "true" && !mediaQuery.matches)
    setMounted(true)

    // Listen for changes to prefers-reduced-motion
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
      if (e.matches) {
        // If reduced motion is enabled, disable sparkles
        setEnabled(false)
        document.cookie = `sparkles=false; path=/; max-age=${60 * 60 * 24 * 365}`
        window.dispatchEvent(new CustomEvent(SPARKLES_EVENT, { detail: { enabled: false } }))
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleSparkles = () => {
    if (prefersReducedMotion) return // Don't allow toggling if reduced motion is preferred

    const newValue = !enabled
    setEnabled(newValue)
    // Set cookie for persistence
    document.cookie = `sparkles=${newValue}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year expiry
    
    // Dispatch custom event for immediate UI update
    window.dispatchEvent(new CustomEvent(SPARKLES_EVENT, { detail: { enabled: newValue } }))
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full transition-colors hover:bg-accent"
        aria-label="Toggle sparkles"
        disabled={prefersReducedMotion}
      >
        <Sparkles className="h-5 w-5 text-muted-foreground" />
      </Button>
    )
  }

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