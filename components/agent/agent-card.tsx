"use client"

import { Suspense, type ReactNode } from 'react'
import { Activity } from 'react'
import { ProblemStateProvider } from './problem-state-context'
import { AgentHeader } from './agent-header'
import { FileTabs } from './agent-file-tabs'
import { SectionTabs } from './agent-section-tabs'
import { useProblemState } from './problem-state-context'

type AgentCardProps = {
  children: ReactNode
  id: string
  title: string
  difficulty: string
  topics: string[]
  solutionFiles: string[]
  defaultFile: string
  fileSectionMap: Record<string, string[]>
}

export function AgentCard({
  children,
  id,
  title,
  difficulty,
  topics,
  solutionFiles,
  defaultFile,
  fileSectionMap
}: AgentCardProps) {
  return (
    <ProblemStateProvider defaultFile={defaultFile}>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 shadow-md mb-4">
        <AgentHeader title={title} id={id} />

        <ExpandedContent
          solutionFiles={solutionFiles}
          fileSectionMap={fileSectionMap}
        >
          <Suspense fallback={<div>Loading Sections...</div>}>
            {children}
          </Suspense>
        </ExpandedContent>
      </div>
    </ProblemStateProvider>
  )
}

type ExpandedContentProps = {
  children: ReactNode
  solutionFiles: string[]
  fileSectionMap: Record<string, string[]>
}

function ExpandedContent({
  children,
  solutionFiles,
  fileSectionMap
}: ExpandedContentProps) {
  const { isExpanded } = useProblemState()

  return (
    <Activity mode={isExpanded ? 'visible' : 'hidden'}>
      <FileTabs files={solutionFiles} fileSectionMap={fileSectionMap} />
      <SectionTabs fileSectionMap={fileSectionMap} />
      {children}
    </Activity>
  )
}
