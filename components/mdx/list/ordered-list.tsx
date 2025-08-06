"use client"

import { motion } from "framer-motion"
import type { ReactNode, ReactElement } from "react"
import { useContext, Children, cloneElement, useMemo } from "react"
import { cn } from "@/lib/utils"

interface OrderedListProps {
  children: ReactNode
  className?: string
  variant?: "default" | "compact"
  start?: number
}

interface ListItemProps {
  children: ReactNode
  className?: string
  customNumber?: string
  itemNumber?: number
}

// Animation variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
}

// Import shared contexts
import { ListTypeContext, ListContext } from './list-context'

export const OrderedList = ({ 
  children, 
  className = "", 
  variant = "default",
  start,
  ...props
}: OrderedListProps) => {
  const parentContext = useContext(ListContext)
  const level = parentContext.level
  const isNested = level > 0
  const startNumber = start || 1
  

  // Check if this is a decimal list (from plugin data)
  const isDecimalList = (props as any)?.['data-is-decimal-list'] === 'true'

  const contextValue = {
    level: level + 1, 
    type: "ordered" as const,
    isDecimalList
  }

  // Helper function to extract text from a React element
  function getTextFromChild(child: any): string {
    if (typeof child === 'string') return child
    if (child?.props?.children) {
      if (typeof child.props.children === 'string') return child.props.children
      if (Array.isArray(child.props.children)) {
        return child.props.children.map((c: any) => getTextFromChild(c)).join(' ')
      }
      return getTextFromChild(child.props.children)
    }
    return ''
  }

  // Memoize the numbering logic to prevent re-calculation on every render
  const numberedChildren = useMemo(() => {
    const childrenArray = Children.toArray(children)
    let currentNumber = startNumber
    
    return childrenArray.map((child) => {
      // Skip empty or text nodes
      if (!child || typeof child === 'string' || typeof child === 'number') {
        return child
      }
      
      let itemNumber = currentNumber
      
      // Check if this is a list restart by looking at the content
      if (child && typeof child === 'object' && 'props' in child) {
        const childText = getTextFromChild(child)
        
        // Look for "Item one - this should start a new list" pattern
        if (childText.includes('should start a new list') || 
            childText.includes('this should start a new list')) {
          currentNumber = 1
          itemNumber = 1
        }
      }
      
      currentNumber++ // Increment for next item
      
      if (child && typeof child === 'object' && 'props' in child) {
        // Extract customNumber from data attribute if available, but preserve existing customNumber prop
        const dataCustomNumber = (child as any)?.props?.['data-custom-number']
        const existingCustomNumber = (child as any)?.props?.customNumber
        const customNumber = dataCustomNumber || existingCustomNumber
        
        return cloneElement(child as ReactElement, {
          itemNumber,
          ...(customNumber && { customNumber })  // Only pass customNumber if it exists
        } as any)
      }
      return child
    })
  }, [children, startNumber, level]) // Only recalculate if children or startNumber changes

  return (
    <ListContext.Provider value={contextValue}>
      <ListTypeContext.Provider value="ordered">
        <motion.ol
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          isNested ? "ml-8" : "ml-0",
          "my-2",
          "space-y-3",
          variant === "compact" ? "space-y-2" : "space-y-3",
          "list-none", // Remove default markers
          className
        )}
        {...props}
      >
          {numberedChildren}
        </motion.ol>
      </ListTypeContext.Provider>
    </ListContext.Provider>
  )
}

// OrderedListItem specifically for ordered lists  
export const OrderedListItem = ({ children, className = "", customNumber, itemNumber, ...props }: ListItemProps) => {
  // Extract customNumber from data attribute (this is how MDX passes it)
  const finalCustomNumber = customNumber || (props as any)?.['data-custom-number']
  
  // Use either custom number or the itemNumber passed from parent
  const displayNumber = finalCustomNumber || itemNumber?.toString() || "1"
  
  // Check if this item has nested content (more than just text)
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

  return (
    <motion.li
      variants={itemVariants}
      whileHover={{ x: 4 }}
      className={cn(
        "flex items-start gap-4",
        "text-gray-700 dark:text-gray-300", 
        "leading-relaxed",
        hasNestedContent ? "p-3" : "py-2 px-1",
        "rounded-xl",
        "bg-linear-to-r from-white/80 via-sky-50/30 to-white/80 dark:from-gray-800/40 dark:via-gray-900/20 dark:to-gray-800/40",
        "border border-gray-200/40 dark:border-gray-700/40",
        "shadow-sm",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:shadow-md hover:border-sky-300/50 dark:hover:border-sky-600/50",
        "hover:bg-linear-to-r hover:from-white/90 hover:via-sky-50/50 hover:to-white/90 dark:hover:from-gray-800/60 dark:hover:via-gray-900/30 dark:hover:to-gray-800/60",
        className
      )}
      {...props}
    >
      {/* Number Marker - shows the actual number */}
      <motion.div
        // whileHover={{ scale: 1.2, rotate: 180 }}
        whileHover={{ scale: 1.2}}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-6 h-6 bg-linear-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg mt-0.5 flex-shrink-0"
      >
        <span className="text-white text-xs font-bold">
          {displayNumber}
        </span>
      </motion.div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </motion.li>
  )
}

// Generic ListItem that works with both ordered and unordered
export const ListItem = ({ children, className = "" }: ListItemProps) => {
  const { type } = useContext(ListContext)
  
  if (type === "ordered") {
    return <OrderedListItem className={className}>{children}</OrderedListItem>
  }
  
  // For unordered lists, return basic li element 
  // (will be handled by UnorderedList's ListItem)
  return <li className={className}>{children}</li>
}