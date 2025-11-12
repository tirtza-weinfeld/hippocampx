"use client"

import { type ReactNode } from 'react'
import { Activity } from 'react'
import { AgentHeader } from './agent-header'
import { useProblemsExpand } from './problems-expand-context'
import type { Problem } from '@/lib/db/schema-problems'

type AgentCardShellProps = {
  children: ReactNode
  problem: Problem
}

/**
 * Client wrapper for problem cards.
 * Header renders instantly from problem metadata.
 * Content (children) streams in when ready, wrapped in Suspense by parent.
 */
export function AgentCardShell({ children, problem }: AgentCardShellProps) {
  const { isExpanded, toggle } = useProblemsExpand()
  const expanded = isExpanded(problem.slug)

  return (
    <div className="relative rounded-md overflow-hidden bg-gray-50/80 dark:bg-gray-950/30 shadow-md mb-4">
      {/* Header renders IMMEDIATELY - no waiting for solutions */}
      <AgentHeader
        title={problem.title}
        id={problem.slug}
        leetcodeUrl={problem.leetcode_url || ''}
        difficulty={problem.difficulty}
        isExpanded={expanded}
        onToggle={() => toggle(problem.slug)}
      />

      <Activity mode={expanded ? 'visible' : 'hidden'}>
        {children}
      </Activity>
    </div>
  )
}
