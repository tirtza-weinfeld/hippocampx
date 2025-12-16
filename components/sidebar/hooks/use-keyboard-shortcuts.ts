"use client"

import { useEffect, useEffectEvent } from "react"

type KeyboardShortcutsOptions = {
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  toggleSearch: () => void
  isMobile: boolean
}

export function useKeyboardShortcuts({
  toggleSidebar,
  toggleMobileSidebar,
  toggleSearch,
  isMobile,
}: KeyboardShortcutsOptions) {
  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "b") {
      e.preventDefault()
      if (!isMobile) {
        toggleSidebar()
      } else {
        toggleMobileSidebar()
      }
    }

    if (((e.metaKey || e.ctrlKey) && e.key === "k") || e.key === "/") {
      e.preventDefault()
      toggleSearch()
    }
  })

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      onKeyDown(e)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])
}
