'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import CopyCode from './copy-code'

export interface TabbedCodeTab {
  label: string
  code: string
  language: string
}

export interface TabbedCodeBlockProps {
  tabs: TabbedCodeTab[]
  className?: string
}

export default function TabbedCodeBlock({ tabs, className }: TabbedCodeBlockProps) {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]?.label ?? '')
  const shouldReduceMotion = useReducedMotion()

  const handleTabChange = (tabLabel: string) => {
    setSelectedTab(tabLabel)
  }

  const selectedTabData = tabs.find(tab => tab.label === selectedTab)

  if (!selectedTabData) return (
    <div className="rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8 shadow-2xl text-center text-gray-500 dark:text-gray-400">
      No code available.
    </div>
  )

  return (
    <div className={cn('w-full max-w-3xl mx-auto my-8', className)}>
      {/* Tab Navigation */}
      <div className="relative flex justify-center">
        <div
          role="tablist"
          className="relative flex gap-2 px-2 pb-0 rounded-t-lg bg-gray-100 dark:bg-gray-800 border-t border-x border-gray-200 dark:border-gray-700"
          aria-label="Code tabs"
        >
          {tabs.map(tab => (
            <button
              key={tab.label}
              role="tab"
              id={`tab-${tab.label}`}
              aria-selected={selectedTab === tab.label}
              aria-controls={`tabpanel-${tab.label}`}
              className={cn(
                'relative px-4 text-sm font-semibold transition-all duration-200 rounded-t-md',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                selectedTab === tab.label
                  ? 'text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border-t-2 border-x border-blue-500 border-b-0 pt-2 pb-0'
                  : 'text-gray-600 dark:text-gray-400 bg-transparent hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 py-2'
              )}
              onClick={() => handleTabChange(tab.label)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          {selectedTabData && (
            <motion.div
              key={selectedTabData.label}
              role="tabpanel"
              id={`tabpanel-${selectedTabData.label}`}
              aria-labelledby={`tab-${selectedTabData.label}`}
              className="outline-none"
              layout
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="shadow-lg rounded-b-lg dark:bg-gray-900 bg-white border-x border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="relative">
                  <CopyCode
                    className="absolute top-2 right-2 z-10"
                    code={selectedTabData.code}
                  />
                  <div className="overflow-x-auto py-4 md:py-6 text-sm leading-relaxed">
                    <pre className={`language-${selectedTabData.language} bg-transparent p-0 m-0 font-mono`}>
                      <code className={`language-${selectedTabData.language} whitespace-pre-wrap break-words`}>
                        {selectedTabData.code || 'No code.'}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 