"use client"

import { createContext, useSyncExternalStore } from "react"
import { MascotIcon } from "./mascot-types"

function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silently fail
  }
}

function createPersistedStore<T>(key: string, defaultValue: T) {
  let value = defaultValue
  const listeners = new Set<() => void>()

  // Initialize from localStorage (client-only)
  if (typeof window !== 'undefined') {
    value = getStoredValue(key, defaultValue)
  }

  return {
    getSnapshot: () => value,
    getServerSnapshot: () => defaultValue, // Always return default on server
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setValue: (newValue: T) => {
      value = newValue
      setStoredValue(key, newValue)
      listeners.forEach(listener => listener())
    }
  }
}

const iconStore = createPersistedStore<MascotIcon>("problems-mascot-icon", "turing")
const stayOpenStore = createPersistedStore<boolean>("problems-mascot-stay-open", false)

const MascotSettingsContext = createContext<{
  selectedIcon: MascotIcon
  stayOpen: boolean
  setSelectedIcon: (icon: MascotIcon) => void
  setStayOpen: (value: boolean) => void
}>({
  selectedIcon: "turing",
  stayOpen: false,
  setSelectedIcon: () => {},
  setStayOpen: () => {}
})

export function MascotSettingsProvider({ children }: { children: React.ReactNode }) {
  const selectedIcon = useSyncExternalStore(iconStore.subscribe, iconStore.getSnapshot, iconStore.getServerSnapshot)
  const stayOpen = useSyncExternalStore(stayOpenStore.subscribe, stayOpenStore.getSnapshot, stayOpenStore.getServerSnapshot)

  return (
    <MascotSettingsContext value={{
      selectedIcon,
      stayOpen,
      setSelectedIcon: iconStore.setValue,
      setStayOpen: stayOpenStore.setValue
    }}>
      {children}
    </MascotSettingsContext>
  )
}

export { MascotSettingsContext }