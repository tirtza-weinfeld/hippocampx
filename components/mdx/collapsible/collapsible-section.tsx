"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

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
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={{
        closed: {
          boxShadow: shouldReduceMotion
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
          borderColor: "rgba(229, 231, 235, 0.6)"
        },
        open: {
          boxShadow: shouldReduceMotion
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 30px -5px rgba(20, 184, 166, 0.2)",
          borderColor: "rgba(94, 234, 212, 0.5)"
        }
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: "easeInOut"
      }}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 40px -5px rgba(20, 184, 166, 0.25)",
              borderColor: "rgba(94, 234, 212, 0.7)"
            }
      }
      className={cn(
        "collapsible-section",
        "group",
        "relative",
        "my-8",
        "rounded-2xl",
        "border-2",
        "bg-linear-to-br from-white/90 via-gray-50/60 to-white/90",
        "dark:from-gray-900/90 dark:via-gray-800/60 dark:to-gray-900/90",
        "dark:border-gray-700/60",
        "backdrop-blur-md",
        "overflow-hidden",
        "transition-colors duration-300",
        // Subtle gradient border effect
        "before:absolute before:inset-0 before:rounded-2xl",
        "before:p-[2px] before:bg-linear-to-br before:from-teal-500/20 before:via-sky-500/10 before:to-teal-500/20",
        "before:-z-10 before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",
        className
      )}
      data-collapsible-open={isOpen}
    >
      {/* Ambient background glow */}
      <motion.div
        className="absolute inset-0 -z-20 bg-linear-to-br from-teal-500/5 via-transparent to-sky-500/5 opacity-0 transition-opacity duration-500"
        animate={{ opacity: isOpen ? 1 : 0 }}
      />

      <CollapsibleContext.Provider value={{ isOpen, setIsOpen }}>
        {children}
      </CollapsibleContext.Provider>
    </motion.div>
  )
}

