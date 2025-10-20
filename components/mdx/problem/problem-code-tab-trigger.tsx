"use client"

import React, { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useCodeTabs } from '../code/code-tabs-context'

type ProblemCodeTabTriggerProps = {
  file: string
  className?: string
}

export function ProblemCodeTabTrigger({ file, className }: ProblemCodeTabTriggerProps) {
  const { activeFile, setActiveFile } = useCodeTabs()
  const isActive = activeFile === file
  const shouldReduceMotion = useReducedMotion()

  const fileLabel = useMemo(() => {
    return file.replace(/\.[^/.]+$/, '')
  }, [file])

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 500, damping: 35, mass: 0.5 }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveFile(file)}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap',
        'rounded-t-md px-4 py-2',
        'text-sm font-semibold tracking-wide',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'text-blue-700 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
        className
      )}
      type="button"
    >
      {isActive && (
        <motion.div
          layoutId="activeCodeTab"
          className={cn(
            'absolute inset-0 rounded-t-md',
            'bg-white dark:bg-gray-950',
            'shadow-md shadow-gray-200/50 dark:shadow-black/30',
            'border-t-2 border-blue-500'
          )}
          transition={springTransition}
        />
      )}
      <span className="relative z-10">{fileLabel}</span>
    </button>
  )
}
