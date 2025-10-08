"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { CodeTabsContext } from './code-tabs-context'

type CodeTabsProps = {
  children: React.ReactNode
  defaultFile?: string
  className?: string
}

export function CodeTabs({ children, defaultFile = '', className }: CodeTabsProps) {
  const [activeFile, setActiveFile] = useState(defaultFile)
  const [height, setHeight] = useState<number | 'auto'>('auto')
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!containerRef.current) return

    const updateHeight = () => {
      const container = containerRef.current
      if (!container) return

      const activeTab = container.querySelector('[aria-hidden="false"]')
      if (activeTab) {
        const newHeight = (activeTab as HTMLElement).offsetHeight
        setHeight(newHeight)
      }
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    const container = containerRef.current
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [activeFile])

  const heightTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1] as const
      }

  return (
    <CodeTabsContext.Provider value={{ activeFile, setActiveFile }}>
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
          ref={containerRef}
          initial={false}
          animate={{ height }}
          transition={heightTransition}
          className="relative w-full"
          style={{ minHeight: '100px' }}
        >
          {children}
        </motion.div>
      </div>
    </CodeTabsContext.Provider>
  )
}
