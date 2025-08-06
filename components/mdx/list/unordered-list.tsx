"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useContext, createContext } from "react"
import { Minus, Star, Sparkles, ArrowRight, Shapes, Triangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListProps {
  children: ReactNode
  className?: string
}

interface ListItemProps {
  children: ReactNode
  className?: string
}

// Modern animation variants optimized for React 19+ performance
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
} as const

const itemVariants = {
  hidden: { 
    opacity: 0, 
    x: -24, 
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 28,
      mass: 0.9,
    },
  },
} as const

// Modern icon system for different list levels with type safety
const getUnorderedIcon = (level: number) => {
  const icons = [
    { Icon: Shapes, gradient: "from-sky-500 to-cyan-500" },
    { Icon: Minus, gradient: "from-teal-500 to-emerald-500" },
    { Icon: ArrowRight, gradient: "from-blue-500 to-indigo-500" },
    { Icon: Triangle, gradient: "from-teal-500 to-emerald-500" },
    { Icon: Star, gradient: "from-cyan-500 to-blue-500" },
    { Icon: Sparkles, gradient: "from-emerald-500 to-teal-500" },
  ] as const
  
  // Ensure we always return a valid icon with proper bounds checking
  const safeLevel = Math.max(0, level)
  return icons[safeLevel % icons.length] || icons[0]
}

// Import shared contexts
import { ListTypeContext, ListContext } from './list-context'

// Utility to determine if content is a header item (ends with colon)
const isHeaderItem = (children: ReactNode): boolean => {
  if (typeof children === 'string') {
    return children.trim().endsWith(':') && children.trim().length < 100
  }
  
  if (Array.isArray(children) && children.length === 1) {
    const child = children[0]
    if (typeof child === 'string') {
      return child.trim().endsWith(':') && child.trim().length < 100
    }
    
    // Check for bold text that ends with colon
    if (child && typeof child === 'object' && 'props' in child && child.props?.children) {
      const text = child.props.children
      if (typeof text === 'string') {
        return text.trim().endsWith(':') && text.trim().length < 100
      }
    }
  }
  
  return false
}

export const UnorderedList = ({ children, className = "", ...props }: ListProps & any) => {
  const parentContext = useContext(ListContext)
  const level = parentContext.level
  const isNested = level > 0
  
  // Check if this is a feature list (from plugin data)
  const isFeatureList = (props as any)?.['data-list-type'] === 'feature'
  const listType = isFeatureList ? "FeatureList" : "unordered"

  return (
    <ListContext.Provider value={{ level: level + 1, type: "unordered", isDecimalList: false }}>
      <ListTypeContext.Provider value={listType}>
        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            isNested ? "mt-3 mb-3 ml-4" : "mb-8 ml-0",
            isFeatureList ? "space-y-3" : "space-y-3", // Same spacing for now
            // Modern Tailwind v4+ with container queries
            "container-type-inline-size",
            "@md:space-y-4",
            className
          )}
          {...props}
        >
          {children}
        </motion.ul>
      </ListTypeContext.Provider>
    </ListContext.Provider>
  )
}

export const ListItem = ({ children, className = "" }: ListItemProps) => {
  const { level, type } = useContext(ListContext)
  
  // Only handle unordered list items in this component
  if (type !== "unordered") {
    return <li className={className}>{children}</li>
  }

  const { Icon, gradient } = getUnorderedIcon(level - 1)

  // If this looks like a header item, style it as a section header
  if (isHeaderItem(children)) {
    return (
      <motion.li
        variants={itemVariants}
        className={cn(
          "text-gray-700 dark:text-gray-300",
          "leading-relaxed",
          "mb-2",
          className
        )}
      >
        <div className="flex items-start gap-3 mb-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "w-5 h-5",
              "bg-linear-to-r", gradient,
              "rounded-full",
              "flex items-center justify-center",
              "shadow-md",
              "mt-0.5",
              "flex-shrink-0"
            )}
          >
            <Icon className="w-2.5 h-2.5 text-white" fill="currentColor" />
          </motion.div>
          <div className="flex-1 font-medium">{children}</div>
        </div>
      </motion.li>
    )
  }

  return (
    <motion.li
      variants={itemVariants}
      whileHover={{ scale: 1.01, x: 2 }}
      className={cn(
        "flex items-start gap-4",
        "text-gray-700 dark:text-gray-300",
        "leading-relaxed",
        "p-3",
        "rounded-xl",
        "bg-gradient-to-r from-white/80 via-sky-50/50 to-white/80 dark:from-gray-800/50 dark:via-gray-900/30 dark:to-gray-800/50",
        "border border-gray-200/50 dark:border-gray-700/50",
        "shadow-sm",
        "backdrop-blur-sm",
        className
      )}
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 180 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "w-6 h-6",
          "bg-gradient-to-r", gradient,
          "rounded-full",
          "flex items-center justify-center",
          "shadow-lg",
          "mt-0.5",
          "flex-shrink-0"
        )}
      >
        <Icon className="w-3 h-3 text-white" fill="currentColor" />
      </motion.div>

      <div className="flex-1 min-w-0">{children}</div>
    </motion.li>
  )
}