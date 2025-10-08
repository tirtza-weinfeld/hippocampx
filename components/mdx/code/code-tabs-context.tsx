"use client"

import { createContext, useContext } from 'react'

export type CodeTabsContextType = {
  activeFile: string
  setActiveFile: (file: string) => void
}

const defaultContext: CodeTabsContextType = {
  activeFile: '',
  setActiveFile: () => {
    throw new Error('CodeTabs components must be used within CodeTabs')
  }
}

export const CodeTabsContext = createContext<CodeTabsContextType>(defaultContext)

export function useCodeTabs(): CodeTabsContextType {
  const context = useContext(CodeTabsContext)
  return context
}
