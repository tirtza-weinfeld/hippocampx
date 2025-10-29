"use client"

import { Suspense, type ReactNode } from 'react'
import { Activity } from 'react'
import { ProblemStateProvider } from './problem-state-context'
import { AgentHeader } from './agent-header'
import { FileTabs } from './agent-file-tabs'
import { SectionTabs } from './agent-section-tabs'
import { useProblemState } from './problem-state-context'
import { SectionType } from './agent-section-tab'


type AgentCardProps = {
  children: ReactNode
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  topics: string[]
  solutionFiles: string[]
  defaultFile: string
  fileSectionMap: Record<string, SectionType[]>
  leetcodeUrl: string
}

export function AgentCard({
  children,
  id,
  title,
  difficulty,
  topics,
  solutionFiles,
  defaultFile,
  fileSectionMap,
  leetcodeUrl
}: AgentCardProps) {
  return (
    <ProblemStateProvider defaultFile={defaultFile}>
      <div className="relative rounded-md  overflow-hidden
       bg-gray-50/80 dark:bg-gray-950/30 shadow-md  mb-4 ">
        <AgentHeader
          title={title}
          id={id}
          leetcodeUrl={leetcodeUrl}
          difficulty={difficulty}
        />

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
  fileSectionMap: Record<string, SectionType[]>
}

function ExpandedContent({
  children,
  solutionFiles,
  fileSectionMap
}: ExpandedContentProps) {
  const { isExpanded } = useProblemState()

  return (
    <Activity mode={isExpanded ? 'visible' : 'hidden'}>
      <SectionTabs fileSectionMap={fileSectionMap} />
      <FileTabs files={solutionFiles} fileSectionMap={fileSectionMap} />
      {children}
    </Activity>
  )
}


export function AgentCardSkeleton() {
  return (
    <div className="relative rounded-md  overflow-hidden
       bg-gray-50/80 dark:bg-gray-50/80 shadow-md  mb-4 ">
      <div className="animate-pulse">
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-800"></div>
      </div>
    </div>
  )
}