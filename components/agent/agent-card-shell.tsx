"use client"

import { type ReactNode } from 'react'
import { Activity } from 'react'
import { AgentHeader } from './agent-header'
import { useAgentDialogStore } from './store/agent-dialog-store'
import type { Problem } from '@/lib/db/schema'

type AgentCardShellProps = {
  children: ReactNode
  problem: Problem
  timeComplexityBadge?: ReactNode
}

/**
 * Client wrapper for problem cards.
 * Header renders instantly from problem metadata.
 * Content (children) streams in when ready, wrapped in Suspense by parent.
 */
export function AgentCardShell({ children, problem, timeComplexityBadge }: AgentCardShellProps) {
  // Use derived selector - only re-render when THIS card's state changes
  const expanded = useAgentDialogStore((state) => state.expandedIds.includes(problem.slug))
  const toggleExpanded = useAgentDialogStore((state) => state.toggleExpanded)

  return (
    <div className="relative rounded-md overflow-hidden bg-gray-50/80 dark:bg-gray-950/30 shadow-md mb-4">
      {/* Header renders IMMEDIATELY - no waiting for solutions */}
      <AgentHeader
        title={problem.title}
        id={problem.slug}
        leetcodeUrl={problem.leetcode_url || ''}
        difficulty={problem.difficulty}
        isExpanded={expanded}
        onToggle={() => toggleExpanded(problem.slug)}
        topics={problem.topics || []}
        timeComplexityBadge={timeComplexityBadge}
      />

      <Activity mode={expanded ? 'visible' : 'hidden'}>
        {children}
      </Activity>
    </div>
  )
}
