"use client"

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

type ProblemCodeTabsProps = {
  children: React.ReactNode
  className?: string
}

export function ProblemCodeTabs({ children,  className }: ProblemCodeTabsProps) {

  return (
      <div
        className={cn(
          'flex flex-col',
          'rounded-lg overflow-hidden',
          'bg-gradient-to-br from-white via-gray-50 to-gray-100',
          'dark:from-gray-950 dark:via-gray-900 dark:to-gray-950',
          'border border-gray-200/80 dark:border-gray-800/80',
          'shadow-lg shadow-gray-200/50 dark:shadow-black/20',
          'my-6',
          className
        )}
      >
        <motion.div
          initial={false}
          className="relative w-full"
        >
          {children}
        </motion.div>
      </div>
  )
}
