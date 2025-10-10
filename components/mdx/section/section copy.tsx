"use client"

import type { ReactNode } from "react"
import * as motion from "motion/react-client"
import { useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export interface SectionProps {
  children: ReactNode
  className?: string
}

export function Section({ children, className }: SectionProps) {
  const [header, content] = children as [ReactNode, ReactNode]
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: "easeOut"
      }}
      className={cn(
        "section-wrapper",
        "relative",
        "my-6",
        "rounded-xl",
        "bg-linear-to-br from-white/80 via-gray-50/40 to-white/80",
        "dark:from-gray-900/80 dark:via-gray-800/40 dark:to-gray-900/80",
        "backdrop-blur-sm",
        "border border-gray-200/50 dark:border-gray-700/50",
        "shadow-sm hover:shadow-md",
        "transition-shadow duration-300",
        className
      )}
    >
      {header}
      {content}
    </motion.section>
  )
}
