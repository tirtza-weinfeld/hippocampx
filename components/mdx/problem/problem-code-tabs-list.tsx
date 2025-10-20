"use client"

import React from 'react'
import { cn } from '@/lib/utils'

type ProblemCodeTabsListProps = {
  children: React.ReactNode
  className?: string
}

export function ProblemCodeTabsList({ children, className }: ProblemCodeTabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center justify-start',
        'rounded-t-lg',
        'bg-gradient-to-b from-gray-100 to-gray-50',
        'dark:from-gray-800 dark:to-gray-900',
        'px-4 pt-3 pb-0',
        'gap-1',
        'border-b border-gray-200/80 dark:border-gray-700/80',
        className
      )}
    >
      {children}
    </div>
  )
}
