"use client"

import { createContext, use, type ReactNode, useState } from 'react'

type ProblemsExpandState = {
  expandedIds: Set<string>
  toggle: (id: string) => void
  expandAll: (ids: string[]) => void
  collapseAll: () => void
  isExpanded: (id: string) => boolean
}

const ProblemsExpandContext = createContext<ProblemsExpandState | null>(null)

type ProblemsExpandProviderProps = {
  children: ReactNode
}

export function ProblemsExpandProvider({ children }: ProblemsExpandProviderProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // React Compiler handles memoization - no useCallback needed
  function toggle(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function expandAll(ids: string[]) {
    setExpandedIds(new Set(ids))
  }

  function collapseAll() {
    setExpandedIds(new Set())
  }

  function isExpanded(id: string) {
    return expandedIds.has(id)
  }

  return (
    <ProblemsExpandContext value={{
      expandedIds,
      toggle,
      expandAll,
      collapseAll,
      isExpanded
    }}>
      {children}
    </ProblemsExpandContext>
  )
}

export function useProblemsExpand() {
  const context = use(ProblemsExpandContext)
  if (!context) {
    throw new Error('useProblemsExpand must be used within ProblemsExpandProvider')
  }
  return context
}
