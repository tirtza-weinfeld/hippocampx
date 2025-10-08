"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export interface CollapsibleSectionProps {
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function CollapsibleSection({
  children,
  defaultOpen = false,
  className
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={cn(
        "collapsible-section",
        "my-8",
        "rounded-xl",
        "border border-gray-200/60 dark:border-gray-700/60",
        "bg-linear-to-br from-white/80 via-gray-50/50 to-white/80",
        "dark:from-gray-900/80 dark:via-gray-800/50 dark:to-gray-900/80",
        "shadow-lg shadow-gray-200/50 dark:shadow-gray-950/50",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:shadow-xl hover:shadow-gray-300/60 dark:hover:shadow-gray-950/60",
        "hover:border-teal-300/50 dark:hover:border-teal-600/50",
        className
      )}
      data-collapsible-open={isOpen}
    >
      <CollapsibleContext.Provider value={{ isOpen, setIsOpen }}>
        {children}
      </CollapsibleContext.Provider>
    </div>
  )
}

// Create context for sharing state between header and content
import { createContext, useContext } from "react"

interface CollapsibleContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null)

export function useCollapsibleContext(): CollapsibleContextValue {
  const context = useContext(CollapsibleContext)
  if (!context) {
    throw new Error("useCollapsibleContext must be used within CollapsibleSection")
  }
  return context
}
