'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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

  const handleTabChange = useCallback((tabLabel: string) => {
    setSelectedTab(tabLabel)
  }, [])

  const selectedTabData = tabs.find(tab => tab.label === selectedTab)

  if (!selectedTabData) return (
    <div className="rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8 shadow-2xl text-center text-gray-500 dark:text-gray-400">
      No code available.
    </div>
  )

  return (
    <div className={cn('w-full max-w-3xl mx-auto my-8', className)}>
      {/* Tab Navigation */}
      <div className="relative mb-2 flex justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200/60 via-pink-100/40 to-amber-100/60 dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl blur-sm opacity-60 pointer-events-none" aria-hidden="true" />
        <div
          role="tablist"
          className="relative flex gap-2 px-2 py-1 rounded-xl bg-white/80 dark:bg-gray-900/80 shadow-lg border border-gray-200 dark:border-gray-700"
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
                'relative px-5 py-2 text-base font-semibold transition-all duration-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
                selectedTab === tab.label
                  ? 'text-amber-800 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-900/60 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 bg-transparent hover:bg-amber-50/60 dark:hover:bg-gray-800/40'
              )}
              onClick={() => handleTabChange(tab.label)}
            >
              {tab.label}
              {selectedTab === tab.label && (
                <motion.div
                  className="absolute left-0 right-0 bottom-0 h-1 rounded-b bg-gradient-to-r from-amber-400 via-pink-300 to-amber-500 dark:from-amber-700 dark:to-pink-700"
                  layoutId="activeTabUnderline"
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                />
              )}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="shadow-2xl rounded-2xl dark:bg-gray-900 bg-white/90 border border-gray-200 dark:border-gray-800 p-6 md:p-8 mt-2">
                <div className="relative">
                  <CopyCode
                    className="absolute top-2 right-2 z-10"
                    code={selectedTabData.code}
                  />
                  <div className="overflow-x-auto py-4 md:py-6 text-[1.05rem] leading-relaxed">
                    <pre className={`language-${selectedTabData.language} bg-transparent p-0 m-0`}>
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