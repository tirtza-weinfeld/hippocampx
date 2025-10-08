"use client"

import type { ReactNode } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { useCollapsibleContext } from "./collapsible-section"

export interface CollapsibleSectionContentProps {
  children: ReactNode
  className?: string
}

const contentVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeInOut"
      },
      opacity: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeInOut"
      },
      opacity: {
        duration: 0.25,
        delay: 0.1,
        ease: "easeIn"
      }
    }
  }
} as const

export function CollapsibleSectionContent({
  children,
  className
}: CollapsibleSectionContentProps) {
  const { isOpen } = useCollapsibleContext()
  const shouldReduceMotion = useReducedMotion()

  const variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : contentVariants

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="collapsible-content"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={variants}
          className={cn(
            "overflow-hidden",
            "border-t border-gray-200/60 dark:border-gray-700/60"
          )}
        >
          <div
            className={cn(
              "px-6 py-5",
              "prose prose-gray dark:prose-invert max-w-none",
              "text-gray-700 dark:text-gray-300",
              className
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
