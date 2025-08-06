"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useContext, useMemo, Children } from "react"
import { cn } from "@/lib/utils"
import { ListContext } from './list-context'
import { Minus, Star, Sparkles, ArrowRight, Shapes, Triangle } from "lucide-react"

interface ListItemProps {
  children: ReactNode
  className?: string
  itemNumber?: number
  customNumber?: string
}

// Animation variants for regular list items
const listItemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 28,
    },
  },
}

// Icon system for unordered lists (different shapes by nesting level)
const getUnorderedIcon = (level: number) => {
  const icons = [
    { Icon: Shapes, gradient: "from-sky-500 to-cyan-500" },
    { Icon: Minus, gradient: "from-teal-500 to-emerald-500" },
    { Icon: ArrowRight, gradient: "from-blue-500 to-indigo-500" },
    { Icon: Triangle, gradient: "from-purple-500 to-pink-500" },
    { Icon: Star, gradient: "from-cyan-500 to-blue-500" },
    { Icon: Sparkles, gradient: "from-emerald-500 to-teal-500" },
  ] as const
  
  const safeLevel = Math.max(0, level)
  return icons[safeLevel % icons.length] || icons[0]
}

// Utility to detect if content looks like a header (ends with colon)
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

export const ListItem = ({ 
  children, 
  className = "",
  itemNumber,
  customNumber,
  ...props 
}: ListItemProps) => {
  const { type: listType, level } = useContext(ListContext)
  const isInOrderedList = listType === 'ordered'
  
  // For ordered lists, determine the display number
  const displayNumber = customNumber || itemNumber?.toString() || "1"
  
  // For unordered lists, get the appropriate icon
  const { Icon, gradient } = getUnorderedIcon(level - 1)
  
  // Check if this item has nested content for conditional padding
  const hasNestedContent = useMemo(() => {
    const childrenArray = Children.toArray(children)
    return childrenArray.some(child => {
      if (typeof child === 'object' && child !== null && 'type' in child) {
        return ['ul', 'ol', 'div', 'blockquote'].includes((child as any).type) ||
               ((child as any).props?.children && 
                Array.isArray((child as any).props.children) && 
                (child as any).props.children.length > 1)
      }
      return false
    })
  }, [children])
  
  // Special styling for header items (text ending with colon)
  if (isHeaderItem(children)) {
    return (
      <motion.li
        variants={listItemVariants}
        className={cn(
          "text-gray-700 dark:text-gray-300",
          "leading-relaxed",
          "mb-2",
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3 mb-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md",
              isInOrderedList
                ? "rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500"
                : "rounded-full bg-gradient-to-br " + gradient
            )}
          >
            {isInOrderedList ? (
              <span className="text-white text-xs font-bold">
                {displayNumber}
              </span>
            ) : (
              <Icon className="w-2.5 h-2.5 text-white" fill="currentColor" />
            )}
          </motion.div>
          <div className="flex-1 font-medium">{children}</div>
        </div>
      </motion.li>
    )
  }

  // Regular list item
  return (
    <motion.li
      variants={listItemVariants}
      whileHover={{ x: 3, scale: 1.01 }}
      className={cn(
        "flex items-start gap-3",
        "text-gray-700 dark:text-gray-300",
        "leading-relaxed",
        hasNestedContent ? "p-3" : "py-2 px-1", // Adaptive padding like OrderedListItem
        "rounded-xl",
        "bg-gradient-to-r from-white/80 via-sky-50/30 to-white/80 dark:from-gray-800/40 dark:via-gray-900/20 dark:to-gray-800/40",
        "border border-gray-200/40 dark:border-gray-700/40",
        "shadow-sm",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:shadow-md hover:border-sky-300/50 dark:hover:border-sky-600/50",
        "hover:bg-gradient-to-r hover:from-white/90 hover:via-sky-50/50 hover:to-white/90 dark:hover:from-gray-800/60 dark:hover:via-gray-900/30 dark:hover:to-gray-800/60",
        className
      )}
      {...props}
    >
      {/* Icon/Number - adapts to list type */}
      <motion.div
        whileHover={{ scale: 1.2, rotate: isInOrderedList ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg",
          isInOrderedList
            ? "w-6 h-6 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500" // Numbers in circles
            : "w-6 h-6 rounded-full bg-gradient-to-r " + gradient // Shapes in circles
        )}
      >
        {isInOrderedList ? (
          /* Display number for ordered lists */
          <span className="text-white text-xs font-bold">
            {displayNumber}
          </span>
        ) : (
          /* Display shape icon for unordered lists */
          <Icon className="w-3 h-3 text-white" fill="currentColor" />
        )}
      </motion.div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </motion.li>
  )
}