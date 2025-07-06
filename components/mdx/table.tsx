"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Animation variants for table elements
const tableVariants = {
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

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

const cellVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ className, children }: TableProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className="relative w-full my-8"
    >
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table
          className={cn(
            "w-full caption-bottom text-sm",
            "bg-white dark:bg-gray-900",
            className
          )}
        >
          {children}
        </table>
      </div>
    </motion.div>
  )
}

interface TableHeaderProps {
  children: ReactNode
  className?: string
}

export function TableHeader({ className, children }: TableHeaderProps) {
  return (
    <motion.thead
      variants={rowVariants}
      className={cn(
        "bg-gray-50 dark:bg-gray-800",
        "[&_tr]:border-b [&_tr]:border-gray-200 dark:[&_tr]:border-gray-700",
        className
      )}
    >
      {children}
    </motion.thead>
  )
}

interface TableBodyProps {
  children: ReactNode
  className?: string
}

export function TableBody({ className, children }: TableBodyProps) {
  return (
    <motion.tbody
      variants={rowVariants}
      className={cn(
        "divide-y divide-gray-200 dark:divide-gray-700",
        "[&_tr:last-child]:border-0",
        className
      )}
    >
      {children}
    </motion.tbody>
  )
}

interface TableFooterProps {
  children: ReactNode
  className?: string
}

export function TableFooter({ className, children }: TableFooterProps) {
  return (
    <motion.tfoot
      variants={rowVariants}
      className={cn(
        "bg-gray-50/50 dark:bg-gray-800/50",
        "border-t border-gray-200 dark:border-gray-700",
        "font-medium",
        "[&>tr]:last:border-b-0",
        className
      )}
    >
      {children}
    </motion.tfoot>
  )
}

interface TableRowProps {
  children: ReactNode
  className?: string
}

export function TableRow({ className, children }: TableRowProps) {
  return (
    <motion.tr
      variants={cellVariants}
      className={cn(
        "hover:bg-gray-50/50 dark:hover:bg-gray-800/50",
        "data-[state=selected]:bg-blue-50 dark:data-[state=selected]:bg-blue-900/20",
        "border-b border-gray-200 dark:border-gray-700",
        "transition-colors duration-200",
        className
      )}
    >
      {children}
    </motion.tr>
  )
}

interface TableHeadProps {
  children: ReactNode
  className?: string
}

export function TableHead({ className, children }: TableHeadProps) {
  return (
    <motion.th
      variants={cellVariants}
      className={cn(
        "h-12 px-4 text-left align-middle",
        "font-semibold text-gray-900 dark:text-gray-100",
        "whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
    >
      {children}
    </motion.th>
  )
}

interface TableCellProps {
  children: ReactNode
  className?: string
}

export function TableCell({ className, children }: TableCellProps) {
  return (
    <motion.td
      variants={cellVariants}
      className={cn(
        "p-4 align-middle",
        "text-gray-700 dark:text-gray-300",
        "whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
    >
      {children}
    </motion.td>
  )
}

interface TableCaptionProps {
  children: ReactNode
  className?: string
}

export function TableCaption({ className, children }: TableCaptionProps) {
  return (
    <motion.caption
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn(
        "mt-4 text-sm text-gray-500 dark:text-gray-400",
        "text-center italic",
        className
      )}
    >
      {children}
    </motion.caption>
  )
}

// Export all table components
export {
  Table as table,
  TableHeader as thead,
  TableBody as tbody,
  TableFooter as tfoot,
  TableRow as tr,
  TableHead as th,
  TableCell as td,
  TableCaption as caption,
}
