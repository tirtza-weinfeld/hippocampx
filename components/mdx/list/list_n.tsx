"use client"

import React, { Children, isValidElement, cloneElement } from "react"
import { motion } from "framer-motion"
import type { ReactNode, ReactElement, OlHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

// Animation variants for list elements
const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

interface UnorderedListProps {
  children: ReactNode
  className?: string
  level?: number
}

export function UnorderedList({ className, children, level = 1 }: UnorderedListProps) {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className={cn(
        "my-6 pl-6 space-y-2",
        level > 1 ? `ml-${Math.min(level * 4, 12)}` : "",
        className
      )}
    >
      {children}
    </motion.ul>
  )
}

interface OrderedListProps extends OlHTMLAttributes<HTMLOListElement> {
  children: ReactNode
  className?: string
  level?: number
  start?: number
}

export function OrderedList({ className, children, level = 1, start = 1 }: OrderedListProps) {
  // Use the start prop from MDX/HTML if present
  const startNum = typeof start === 'number' ? start : 1
  let itemIdx = 0
  const items = Children.toArray(children).map((child) => {
    if (
      isValidElement(child) &&
      (child.type === ListItem ||
        (typeof child.type === 'object' && 'displayName' in child.type && (child.type as { displayName?: string }).displayName === 'li'))
    ) {
      const numbered = cloneElement(child as ReactElement<ListItemProps>, { number: startNum + itemIdx })
      itemIdx++
      return numbered
    }
    return child
  })
  return (
    <motion.ol
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className={cn(
        "my-6 pl-6 space-y-2",
        level > 1 ? `ml-${Math.min(level * 4, 12)}` : "",
        className
      )}
    >
      {items}
    </motion.ol>
  )
}

interface ListItemProps {
  children: ReactNode
  className?: string
  number?: number
}

export function ListItem({ className, children, number }: ListItemProps) {
  const isOrdered = typeof number === "number"
  return (
    <motion.li
      variants={itemVariants}
      className={cn(
        "relative flex items-center gap-3",
        "text-gray-700 dark:text-gray-300",
        "leading-relaxed",
        className
      )}
    >
      {/* Bullet or number */}
      <div className="flex-shrink-0 flex items-center min-w-[1.5em] justify-center">
        {isOrdered ? (
          <span className={cn(
            "inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-semibold border border-teal-200 dark:border-teal-700",
            "select-none"
          )}>
            {number}
          </span>
        ) : (
          <span className="block w-2 h-2 bg-teal-500 dark:bg-teal-400 rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </motion.li>
  )
}

// Nested list support
interface NestedListProps {
  children: ReactNode
  className?: string
  level?: number
}

export function NestedUnorderedList({ className, children, level = 1 }: NestedListProps) {
  const indentClass = level > 1 ? `ml-${Math.min(level * 4, 12)}` : ""
  
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className={cn(
        "my-3 space-y-1",
        "list-none pl-0",
        indentClass,
        className
      )}
    >
      {children}
    </motion.ul>
  )
}

export function NestedOrderedList({ className, children, level = 1 }: NestedListProps) {
  const indentClass = level > 1 ? `ml-${Math.min(level * 4, 12)}` : ""
  
  return (
    <motion.ol
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className={cn(
        "my-3 space-y-1",
        "list-none pl-0",
        "counter-reset: nested-counter",
        indentClass,
        className
      )}
    >
      {children}
    </motion.ol>
  )
}

// Checkbox list item
interface CheckboxListItemProps {
  children: ReactNode
  className?: string
  checked?: boolean
}

export function CheckboxListItem({ className, children, checked = false }: CheckboxListItemProps) {
  return (
    <motion.li
      variants={itemVariants}
      className={cn(
        "relative flex items-start gap-3",
        "text-gray-700 dark:text-gray-300",
        "leading-relaxed",
        className
      )}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 mt-1">
        <div className={cn(
          "flex items-center justify-center",
          "w-5 h-5 rounded border-2",
          "transition-colors duration-200",
          checked 
            ? "bg-teal-500 border-teal-500 dark:bg-teal-400 dark:border-teal-400" 
            : "border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-400"
        )}>
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 text-white dark:text-gray-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </motion.svg>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </motion.li>
  )
}

// Export all list components
export {
  UnorderedList as ul,
  OrderedList as ol,
  ListItem as li,
}
