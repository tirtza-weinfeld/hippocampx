"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Animation variants for table elements following motion.mdc patterns
function getTableVariants(shouldReduceMotion: boolean) {
  return {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  }
}

function getRowVariants(shouldReduceMotion: boolean) {
  return {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  }
}

function getCellVariants(shouldReduceMotion: boolean) {
  return {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.15,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  }
}

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ className, children }: TableProps) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={getTableVariants(shouldReduceMotion)}
      className="relative w-full my-8"
    >
      <div className="overflow-x-auto rounded-lg border border-sky-500/20 dark:border-sky-400/20 shadow-sm">
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
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.thead
      variants={getRowVariants(shouldReduceMotion)}
      className={cn(
        "bg-sky-50/50 dark:bg-sky-900/20",
        "[&_tr]:border-b [&_tr]:border-sky-500/20 dark:[&_tr]:border-sky-400/20",
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
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.tbody
      variants={getRowVariants(shouldReduceMotion)}
      className={cn(
        "divide-y divide-sky-500/20 dark:divide-sky-400/20",
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
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.tfoot
      variants={getRowVariants(shouldReduceMotion)}
      className={cn(
        "bg-sky-50/50 dark:bg-sky-800/50",
        "border-t border-sky-500/20 dark:border-sky-400/20",
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
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.tr
      variants={getCellVariants(shouldReduceMotion)}
      className={cn(
        "hover:bg-sky-50/50 dark:hover:bg-sky-800/50",
        "data-[state=selected]:bg-blue-50 dark:data-[state=selected]:bg-blue-900/20",
        "border-b border-sky-500/20 dark:border-sky-400/20",
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
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.th
      variants={getCellVariants(shouldReduceMotion)}
      className={cn(
        "h-12 px-4 text-left align-middle",
        "font-semibold text-sky-900 dark:text-sky-100",
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
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.td
      variants={getCellVariants(shouldReduceMotion)}
      className={cn(
        "p-4 align-middle",
        "text-sky-700 dark:text-sky-300",
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
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.caption
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
        delay: shouldReduceMotion ? 0 : 0.1,
        ease: [0.4, 0, 0.2, 1] as const
      }}
      className={cn(
        "mt-4 text-sm text-sky-500 dark:text-sky-400",
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
