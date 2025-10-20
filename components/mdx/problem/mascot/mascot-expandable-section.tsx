"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useState, Activity } from "react"

interface MascotExpandableSectionProps {
  /**
   * Section title/header
   */
  title: React.ReactNode
  /**
   * Section content (shown when expanded)
   */
  children: React.ReactNode
  /**
   * Whether section starts expanded
   */
  defaultExpanded?: boolean
  className?: string
}

/**
 * Collapsible section component for mascot problem cards
 * - Click to expand/collapse
 * - Uses Activity for efficient rendering
 * - Follows existing CollapsibleSection pattern
 */
export function MascotExpandableSection({
  title,
  children,
  defaultExpanded = false,
  className
}: MascotExpandableSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative w-fit">
        <button
          className="absolute top-0 -right-10 rounded-full p-1 hover:bg-muted transition-colors"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              expanded ? 'rotate-180' : ''
            )}
          />
        </button>
        <div className="font-medium text-sm">{title}</div>
      </div>

      <Activity mode={expanded ? 'visible' : 'hidden'}>
        <div className="text-sm">
          {children}
        </div>
      </Activity>
    </div>
  )
}
