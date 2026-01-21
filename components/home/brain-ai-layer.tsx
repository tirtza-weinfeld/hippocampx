"use client"

import { cn } from "@/lib/utils"

const BRAIN_AI_PAIRS = [
  {
    brain: "Basal Ganglia",
    ai: "MoE Router",
    label: "Action Selection",
    color: "indigo",
  },
  {
    brain: "Neurons",
    ai: "SwiGLU",
    label: "Gated Activation",
    color: "teal",
  },
  {
    brain: "Neocortex",
    ai: "Embeddings",
    label: "Distributed Representation",
    color: "violet",
  },
] as const

type BrainAILayerProps = {
  readonly variant?: "sides" | "stacked" | "minimal"
  readonly showLabels?: boolean
  readonly className?: string
}

export function BrainAILayer({
  variant = "sides",
  showLabels = true,
  className,
}: BrainAILayerProps) {
  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {BRAIN_AI_PAIRS.map((pair, i) => (
          <div
            key={pair.label}
            className="group/pair flex flex-col items-center gap-1 transition-all duration-500"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <span
              className={cn(
                "text-xs font-medium transition-all duration-500",
                `text-${pair.color}-500/40 group-hover/pair:text-${pair.color}-500`
              )}
            >
              {pair.brain}
            </span>
            {showLabels && (
              <span className="text-[10px] text-muted-foreground/50">
                {pair.label}
              </span>
            )}
            <span
              className={cn(
                "text-xs font-medium transition-all duration-500",
                `text-${pair.color}-500/40 group-hover/pair:text-${pair.color}-500`
              )}
            >
              {pair.ai}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {BRAIN_AI_PAIRS.map((pair, i) => (
          <div
            key={pair.label}
            className="group/pair flex items-center justify-between gap-4 transition-all duration-500"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <span
              className={cn(
                "text-xs font-medium transition-all duration-500",
                `text-${pair.color}-500/40 group-hover/pair:text-${pair.color}-500`
              )}
            >
              {pair.brain}
            </span>
            <span
              className={cn(
                "text-xs font-medium transition-all duration-500",
                `text-${pair.color}-500/40 group-hover/pair:text-${pair.color}-500`
              )}
            >
              {pair.ai}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Default: sides variant
  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {BRAIN_AI_PAIRS.map((pair, i) => (
        <div
          key={pair.label}
          className="group/pair flex items-center justify-between px-4 sm:px-8 md:px-16 py-2 transition-all duration-500"
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          {/* Brain side */}
          <span
            className={cn(
              "text-[10px] sm:text-xs font-medium transition-all duration-500",
              `text-${pair.color}-500/30 group-hover/pair:text-${pair.color}-500/70`,
              "group-hover/pair:translate-x-1"
            )}
          >
            {pair.brain}
          </span>

          {/* Label (center) */}
          {showLabels && (
            <span
              className={cn(
                "text-[8px] sm:text-[10px] font-medium transition-all duration-500",
                "text-muted-foreground/0 group-hover/pair:text-muted-foreground/60"
              )}
            >
              {pair.label}
            </span>
          )}

          {/* AI side */}
          <span
            className={cn(
              "text-[10px] sm:text-xs font-medium transition-all duration-500",
              `text-${pair.color}-500/30 group-hover/pair:text-${pair.color}-500/70`,
              "group-hover/pair:-translate-x-1"
            )}
          >
            {pair.ai}
          </span>
        </div>
      ))}
    </div>
  )
}
