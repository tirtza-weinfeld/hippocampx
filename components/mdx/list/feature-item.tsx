"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FeatureItemProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  displayNumber?: string
  isOrdered?: boolean
}

// Animation variants for feature items
const featureItemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
}

export default function FeatureItem({
  children,
  className = "",
  displayNumber,
  isOrdered = false,
  ...props
}: FeatureItemProps) {

  return (
    <motion.li
      variants={featureItemVariants}
      whileHover={{ x: 4, scale: 1.02 }}
      data-item-type="feature"
      className={cn(
        "feature-item",
        "flex items-start gap-3",
        "text-gray-700 dark:text-gray-300",
        "leading-relaxed",
        "py-3 px-4",
        // "rounded-r-lg",
        "relative",
        // Enhanced gradient background for feature items
        "bg-linear-to-r from-sky-50/90 via-blue-50/50 to-transparent",
        "dark:from-emerald-900/10 dark:via-teal-900/10 dark:to-transparent",
        // Enhanced border for feature items
        // "border-2 border-emerald-200/60 dark:border-emerald-700/50",
        // Enhanced shadow for feature items
        "shadow-sm shadow-emerald-100/50 dark:shadow-emerald-900/20",
        "backdrop-blur-sm",
        "transition-all duration-300",
        // Enhanced hover effects
        "hover:shadow-xl hover:shadow-sky-200/60 dark:hover:shadow-sky-800/30",
        "hover:border-sky-300/80 dark:hover:border-sky-600/70",
        "hover:bg-linear-to-r hover:from-sky-100/90 hover:via-blue-50/70 hover:to-sky-100/90",
        "dark:hover:from-sky-900/30 dark:hover:via-sky-900/20 dark:hover:to-transparent",
        className
      )}
      {...props}
    >
     
      {
        isOrdered && displayNumber && (

          <motion.div
            whileHover={{ scale: 1.3, rotate: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "flex items-center justify-center flex-shrink-0 mt-0.5",
              "w-7 h-7 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg "  // Square for ordered lists
            )}
          >
            {/* Gradient number for ordered lists */}
            <span
              className="text-white font-bold text-sm flex items-center justify-center"
              aria-hidden="true"
            >
              {displayNumber}
            </span>
          </motion.div>
        )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        {children}
      </div>

      {/* Subtle glow effect on the left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-emerald-400 via-sky-400 to-emerald-500 
        rounded-r-md opacity-60"
        aria-hidden="true"
      />
    </motion.li>
  )
}