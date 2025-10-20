"use client"

import React, { useState } from 'react'
import { CodeTabsContext } from '../code/code-tabs-context'

type ProblemSolutionGroupProps = {
  children: React.ReactNode
  defaultFile?: string
  className?: string
}

/**
 * ProblemSolutionGroup wraps ActiveProblem components and manages
 * which solutions sections are currently active via CodeTabsContext.
 */
export function ProblemSolutionGroup({
  children,
  defaultFile = '',
  className
}: ProblemSolutionGroupProps) {
  const [activeFile, setActiveFile] = useState(defaultFile)

  return (
    <CodeTabsContext value={{ activeFile, setActiveFile }}>
      <div className={className}>
        {children}
      </div>
    </CodeTabsContext>
  )
}
