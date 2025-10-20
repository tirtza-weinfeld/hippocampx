"use client"

import { type ReactNode, Suspense } from 'react'
import { Activity } from 'react'
import { useProblemState } from './problem-state-context'

type AgentSectionProps = {
  children: ReactNode
  section: string
  file?: string
}

/**
 * Wrapper for MDX section content with Activity-based visibility.
 * Reads activeFile and activeSection from ProblemStateContext.
 * Activity preserves state when switching between sections/files.
 */
export function AgentSection({
  children,
  section,
  file
}: AgentSectionProps) {
  const { activeFile, activeSection } = useProblemState()

  // Determine visibility
  const isVisible =
    section === activeSection &&
    (!file || file === activeFile)

  return (
    <Activity mode={isVisible ? 'visible' : 'hidden'}>
      {/* <Suspense fallback={
        <div className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Loading...
        </div>
      }> */}
        <div className="px-5 py-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {children}
        </div>
      {/* </Suspense> */}
    </Activity>
  )
}
