"use client"

import type { ReactNode } from "react"
import { useState, Activity } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CollapsibleSectionProps {
  children: ReactNode
  defaultExpanded?: boolean
  className?: string
}

export function CollapsibleSection({
  children,
  defaultExpanded = false,
  className
}: CollapsibleSectionProps) {
  const [header, content] = children as [ReactNode, ReactNode]
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const shouldReduceMotion = useReducedMotion()

  function handleToggle() {
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: isExpanded
          ? shouldReduceMotion
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 30px -5px rgba(20, 184, 166, 0.2)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
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
                "0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
            }
      }
      className={cn(
        "collapsible-section",
        "relative",
        "my-6",
        "rounded-xl",
        "border-2",
        "bg-linear-to-br from-white/90 via-gray-50/60 to-white/90",
        "dark:from-gray-900/90 dark:via-gray-800/60 dark:to-gray-900/90",
        "border-gray-200/60 dark:border-gray-700/60",
        "backdrop-blur-sm",
        "overflow-hidden",
        "transition-colors duration-300",
        // Gradient border on expand
        isExpanded && [
          "border-teal-500/30 dark:border-teal-500/20",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-linear-to-br before:from-teal-500/10 before:via-transparent before:to-sky-500/10",
          "before:-z-10"
        ],
        className
      )}
      data-expanded={isExpanded}
    >
      {/* Header with toggle button */}
      <button
        onClick={handleToggle}
        className={cn(
          "w-full",
          "flex items-center gap-3",
          "px-6 py-4",
          "text-left",
          "group",
          "transition-colors duration-200",
          "hover:bg-gray-50/50 dark:hover:bg-gray-800/50",
          "border-b border-gray-200/60 dark:border-gray-700/60",
          !isExpanded && "border-transparent"
        )}
        aria-expanded={isExpanded}
      >
        {/* Chevron icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: "easeInOut"
          }}
          className={cn(
            "flex-shrink-0",
            "rounded-full",
            "p-1.5",
            "bg-gray-100 dark:bg-gray-800",
            "text-gray-600 dark:text-gray-400",
            "group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30",
            "group-hover:text-teal-600 dark:group-hover:text-teal-400",
            "transition-colors duration-200"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>

        {/* Header content */}
        <div className="flex-1 min-w-0">{header}</div>
      </button>

      {/* Content with Activity for state preservation */}
      <Activity mode={isExpanded ? "visible" : "hidden"}>
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: "easeInOut"
          }}
        >
          {content}
        </motion.div>
      </Activity>
    </motion.section>
  )
}