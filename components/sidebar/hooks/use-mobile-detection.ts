"use client"

import { useEffect, useSyncExternalStore } from "react"
import { MOBILE_BREAKPOINT } from "../constants"

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback)
  return () => window.removeEventListener("resize", callback)
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false
}

export function useMobileDetection() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useBodyScrollLock(isMobile: boolean, isMobileOpen: boolean) {
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      document.body.classList.add("overflow-hidden")
      return () => {
        document.body.classList.remove("overflow-hidden")
      }
    }
  }, [isMobile, isMobileOpen])
}
