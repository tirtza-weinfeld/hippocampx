"use client"

import { createContext, use, type ReactNode, useState } from 'react'

type ProblemState = {
  isExpanded: boolean
  setExpanded: (expanded: boolean) => void
  activeFile: string
  setActiveFile: (file: string) => void
  activeSection: string
  setActiveSection: (section: string) => void
}

const ProblemStateContext = createContext<ProblemState | null>(null)

type ProblemStateProviderProps = {
  children: ReactNode
  defaultFile: string
  defaultSection?: string
}

export function ProblemStateProvider({
  children,
  defaultFile,
  defaultSection = 'code'
}: ProblemStateProviderProps) {
  const [isExpanded, setExpanded] = useState(false)
  const [activeFile, setActiveFile] = useState(defaultFile)
  const [activeSection, setActiveSection] = useState(defaultSection)

  return (
    <ProblemStateContext value={{
      isExpanded,
      setExpanded,
      activeFile,
      setActiveFile,
      activeSection,
      setActiveSection
    }}>
      {children}
    </ProblemStateContext>
  )
}

export function useProblemState() {
  const context = use(ProblemStateContext)
  if (!context) {
    throw new Error('useProblemState must be used within ProblemStateProvider')
  }
  return context
}
