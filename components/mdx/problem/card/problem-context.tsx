"use client"

import { createContext, useContext, useState, useCallback } from 'react'

/**
 * Global context type for managing expansion state of all problem cards on a page.
 *
 * Provides centralized state management for multiple problem cards, enabling
 * individual toggle, expand all, and collapse all functionality.
 */
export type ProblemCardContextType = {
  expandedProblems: Set<string>
  toggleProblem: (id: string) => void
  expandAll: () => void
  collapseAll: () => void
  isExpanded: (id: string) => boolean
  allProblemIds: Set<string>
  registerProblem: (id: string) => void
  unregisterProblem: (id: string) => void
}

/**
 * Default context value with error-throwing functions to enforce proper usage.
 */
const defaultContext: ProblemCardContextType = {
  expandedProblems: new Set(),
  toggleProblem: () => {
    throw new Error('ProblemCard components must be used within ProblemCardProvider')
  },
  expandAll: () => {
    throw new Error('ProblemCard components must be used within ProblemCardProvider')
  },
  collapseAll: () => {
    throw new Error('ProblemCard components must be used within ProblemCardProvider')
  },
  isExpanded: () => {
    throw new Error('ProblemCard components must be used within ProblemCardProvider')
  },
  allProblemIds: new Set(),
  registerProblem: () => {
    throw new Error('ProblemCard components must be used within ProblemCardProvider')
  },
  unregisterProblem: () => {
    throw new Error('ProblemCard components must be used within ProblemCardProvider')
  },
}

/**
 * React context for managing global problem card expansion state.
 */
export const ProblemCardContext = createContext<ProblemCardContextType>(defaultContext)

/**
 * Provider component for problem card state management.
 *
 * Wrap this around a group of problem cards to enable coordinated expansion state.
 * By default, all problems start collapsed (defaultExpanded = false).
 *
 * @param problemIds - Optional array of problem IDs to pre-register (avoids mount bottleneck)
 * @param defaultExpanded - Whether problems start expanded (default: false)
 */
export function ProblemCardProvider({ children, defaultExpanded = false, problemIds }: {
  children: React.ReactNode
  defaultExpanded?: boolean
  problemIds?: string[]
}) {
  // Initialize with pre-registered problem IDs if provided
  const [allProblemIds, setAllProblemIds] = useState<Set<string>>(() =>
    problemIds ? new Set(problemIds) : new Set()
  )

  const [expandedProblems, setExpandedProblems] = useState<Set<string>>(() =>
    defaultExpanded && problemIds ? new Set(problemIds) : new Set()
  )

  const registerProblem = useCallback((id: string) => {
    // Only register if not already in the pre-registered set
    setAllProblemIds(prev => {
      if (prev.has(id)) return prev
      return new Set([...prev, id])
    })
    if (defaultExpanded) {
      setExpandedProblems(prev => {
        if (prev.has(id)) return prev
        return new Set([...prev, id])
      })
    }
  }, [defaultExpanded])

  const unregisterProblem = useCallback((id: string) => {
    setAllProblemIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setExpandedProblems(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const toggleProblem = useCallback((id: string) => {
    setExpandedProblems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setExpandedProblems(new Set(allProblemIds))
  }, [allProblemIds])

  const collapseAll = useCallback(() => {
    setExpandedProblems(new Set())
  }, [])

  const isExpanded = useCallback((id: string) => {
    return expandedProblems.has(id)
  }, [expandedProblems])

  return (
    <ProblemCardContext.Provider value={{
      expandedProblems,
      toggleProblem,
      expandAll,
      collapseAll,
      isExpanded,
      allProblemIds,
      registerProblem,
      unregisterProblem
    }}>
      <div className="flex flex-col">
        {children}
      </div>
    </ProblemCardContext.Provider>
  )
}

/**
 * Hook to access problem card expansion context.
 *
 * @returns The problem context with expansion state and controls
 * @throws Error if used outside of ProblemCardProvider
 */
export function useProblemCardContext(): ProblemCardContextType {
  const context = useContext(ProblemCardContext)
  return context
}
