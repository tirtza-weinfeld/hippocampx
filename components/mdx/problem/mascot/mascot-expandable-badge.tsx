"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Activity } from "react"
import { useState } from "react"

interface MascotExpandableBadgeProps {
  /**
   * Content shown in the badge (e.g., "O(n)")
   */
  badge: React.ReactNode
  /**
   * Full content shown when expanded (e.g., detailed explanation)
   */
  children: React.ReactNode
  className?: string
}

/**
 * Expandable badge component for mascot cards
 * - Shows compact info in badge
 * - Click to expand and show full details
 * - Uses Activity for efficient show/hide
 */
export function MascotExpandableBadge({
  badge,
  children,
  className
}: MascotExpandableBadgeProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={cn("space-y-2", className)}>
      <Badge
        variant="outline"
        className={cn(
          "text-xs bg-linear-to-r hover:bg-linear-to-l transition-colors shrink-0 border-none",
          "from-sky-400/10 via-sky-400/10 to-sky-400/10",
          "cursor-pointer hover:from-sky-400/20 hover:to-sky-400/20"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {badge}
      </Badge>

      <Activity mode={expanded ? 'visible' : 'hidden'}>
        <div className="text-sm text-muted-foreground p-3 bg-sky-50/50 dark:bg-sky-950/20 rounded-md">
          {children}
        </div>
      </Activity>
    </div>
  )
}
