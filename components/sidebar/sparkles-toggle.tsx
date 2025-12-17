"use client"

import { useEffect } from "react"
import { useReducedMotion } from "motion/react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useSparklesStore } from "./store/sparkles-store"

interface SparklesToggleProps {
  side?: "top" | "right" | "bottom" | "left"
}

function getTooltipText(enabled: boolean, reducedMotion: boolean) {
  if (reducedMotion) return "Sparkles shown static (reduced motion)"
  if (enabled) return "Disable sparkles"
  return "Enable sparkles"
}

export function SparklesToggle({ side = "top" }: SparklesToggleProps) {
  const reducedMotion = useReducedMotion() ?? false
  const { enabled, toggle } = useSparklesStore()

  useEffect(() => {
    void useSparklesStore.persist.rehydrate()
  }, [])

  const isActive = enabled || reducedMotion

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="size-9 rounded-full transition-colors hover:bg-accent"
          aria-label={getTooltipText(enabled, reducedMotion)}
        >
          <Sparkles className={`size-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>
        {getTooltipText(enabled, reducedMotion)}
      </TooltipContent>
    </Tooltip>
  )
}
