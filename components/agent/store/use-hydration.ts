"use client"

import { useEffect } from 'react'
import { useAgentDialogStore } from './agent-dialog-store'

/**
 * Hook to handle Zustand store hydration from sessionStorage.
 * Triggers rehydration once on mount to restore persisted state.
 */
export function useHydration() {
  useEffect(() => {
    // Manually trigger hydration from sessionStorage
    useAgentDialogStore.persist.rehydrate()
  }, [])
}
