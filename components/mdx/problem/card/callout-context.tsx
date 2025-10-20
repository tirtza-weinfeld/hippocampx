"use client"

import { createContext, useContext } from 'react'

/**
 * Represents the available tab types for problem card callouts.
 *
 * Defines the different information categories that can be displayed
 * in callout components for algorithmic problem explanations.
 */
export type CalloutTab = "intuition" | "timeComplexity" | "keyVariables" | "keyExpressions"  
| "definition" | "codeSnippet"

/**
 * Context type for managing callout component state.
 *
 * Provides state management for interactive problem callouts, including
 * which tab is active, which file is displayed, and dialog visibility.
 *
 * @property activeTab - Currently selected callout tab
 * @property setActiveTab - Function to update the active tab
 * @property activeFile - Currently displayed file name
 * @property setActiveFile - Function to update the active file
 * @property displayDialog - Whether the callout dialog is visible
 * @property setDisplayDialog - Function to toggle dialog visibility
 */
export type CalloutContextType = {
  activeTab: CalloutTab
  setActiveTab: (tab: CalloutTab) => void;
  activeFile: string
  setActiveFile: (file: string) => void;
  displayDialog: boolean
  setDisplayDialog: (display: boolean) => void;
  files: string[]
  setFiles: (files: string[]) => void;
  fabButtons: React.ReactNode
  setFabButtons: (fabButtons: React.ReactNode) => void;
}

/**
 * Default context value with error-throwing setters.
 *
 * Provides initial state and enforces that callout components must be used
 * within a proper CalloutContext provider. Setter functions throw errors
 * when called outside of the provider to prevent incorrect usage.
 */
const defaultContext: CalloutContextType = {
  activeTab: 'intuition',
  setActiveTab: () => {
    throw new Error('Callout components must be used within Callout')
  },
  activeFile: '',
  setActiveFile: () => {
    throw new Error('Callout components must be used within Callout')
  },
  displayDialog: false,
  setDisplayDialog: () => {
    throw new Error('Callout components must be used within Callout')
  },
  files: [],
  setFiles: () => {
    throw new Error('Callout components must be used within Callout')
  },
  fabButtons: null,
  setFabButtons: () => {
    throw new Error('Callout components must be used within Callout')
  }
}

/**
 * React context for managing problem card callout state.
 *
 * Provides shared state for all callout-related components, enabling
 * coordination between tabs, file displays, and dialog visibility.
 */
export const CalloutContext = createContext<CalloutContextType>(defaultContext)

/**
 * Hook to access callout context state and controls.
 *
 * Provides access to the current callout state including active tab,
 * active file, and dialog visibility, along with their setter functions.
 *
 * @returns The current callout context value
 * @throws Error if used outside of CalloutContext provider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { activeTab, setActiveTab } = useCalloutContext()
 *   // Use context values...
 * }
 * ```
 */
export function useCalloutContext(): CalloutContextType {
  const context = useContext(CalloutContext)
  return context
}
