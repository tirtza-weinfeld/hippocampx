"use client"

import { type ReactNode } from 'react'
import { ProblemStateProvider } from './problem-state-context'
import { SectionTabs } from './agent-section-tabs'
import { FileTabs } from './agent-file-tabs'
import type { SectionType } from './agent-section-tab'

type AgentCardShellContentProps = {
  children: ReactNode
  solutionFiles: string[]
  defaultFile: string
  fileSectionMap: Record<string, SectionType[]>
}

/**
 * Client component that wraps tabs and content sections.
 * Receives metadata from server component, manages tab state.
 */
export function AgentCardShellContent({
  children,
  solutionFiles,
  defaultFile,
  fileSectionMap
}: AgentCardShellContentProps) {
  return (
    <ProblemStateProvider defaultFile={defaultFile}>
      <SectionTabs fileSectionMap={fileSectionMap} />
      <FileTabs files={solutionFiles} fileSectionMap={fileSectionMap} />
      {children}
    </ProblemStateProvider>
  )
}
