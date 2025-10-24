"use client"

import type { ReactNode } from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type TooltipSide = "top" | "right" | "bottom" | "left"

type AgentTooltipProps = {
  readonly children: ReactNode
  readonly content: string
  readonly side?: TooltipSide
  readonly className?: string
  readonly sideOffset?: number
}

/**
 * Modern tooltip component matching agent dialog/dropdown design language.
 *
 * Features:
 * - Glassmorphic backdrop blur effect
 * - Subtle shadow and ring for depth
 * - Matches dropdown and dialog styling
 * - Built on Radix UI primitives for accessibility
 *
 * Usage:
 * ```tsx
 * <AgentTooltip content="Filter by difficulty" side="top">
 *   <button>Hover me</button>
 * </AgentTooltip>
 * ```
 */
export function AgentTooltip({
  children,
  content,
  side = "bottom",
  className,
  sideOffset = 8
}: AgentTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={sideOffset}
        className={cn(
          // Modern glassmorphic design matching agent components
          "bg-popover/95 backdrop-blur-xl",
          "border border-border/50 shadow-2xl ring-1 ring-black/5 dark:ring-white/5",
          "rounded-xl",
          "px-3 py-2",
          "text-xs font-medium text-foreground/90",
          "max-w-xs",
          // Smooth transitions
          "transition-all duration-200",
          className
        )}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
