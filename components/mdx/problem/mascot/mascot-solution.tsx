"use client"

import { cn } from "@/lib/utils"

interface MascotSolutionProps {
  /**
   * Solution title (e.g., "Binary Search Solution")
   */
  title?: string
  /**
   * Children contain: intuition section, time complexity badge, code block, variables, etc.
   */
  children: React.ReactNode
  className?: string
}

/**
 * Wrapper component for a single solution in mascot cards
 * Groups together: intuition, time complexity, variables, code
 * Used when problem has multiple solutions (similar to tutorial CodeTabs)
 */
export function MascotSolution({
  title,
  children,
  className
}: MascotSolutionProps) {
  return (
    <div className={cn("space-y-3 border-l-2 border-sky-200 dark:border-sky-800 pl-4", className)}>
      {title && (
        <h4 className="text-sm font-semibold text-sky-700 dark:text-sky-300">
          {title}
        </h4>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}
