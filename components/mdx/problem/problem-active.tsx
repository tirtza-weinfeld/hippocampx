"use client"

import React, { Activity } from 'react'
import { useCodeTabs } from '../code/code-tabs-context'

type ProblemActiveProps = {
  file: string
  children: React.ReactNode
  className?: string
}

/**
 * ProblemSolution component wraps an individual solution's metadata and code.
 * It only renders its children when it's the active solution in the group.
 * Uses the same CodeTabsContext as CodeTab components for synchronization.
 *
 * Usage in MDX:
 * <ProblemSolution file="heap.py">
 *   <ProblemTimeComplexity>...</ProblemTimeComplexity>
 *   <ProblemKeyVariables>...</ProblemKeyVariables>
 *   <CodeTab file="heap.py">...</CodeTab>
 * </ProblemSolution>
 */
export function ProblemActive({ file, children, className }: ProblemActiveProps) {
  
  const { activeFile } = useCodeTabs()
  const isActive = activeFile === file


  return (
    <Activity mode={isActive ? "visible" : "hidden"}>
      <div className={className} >
        {children}
      </div>
    </Activity>
  )
}
