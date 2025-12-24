"use client"

import { createContext, useSyncExternalStore, use, startTransition } from "react"
// import { ViewTransition } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import type { ReactNode } from "react"
import type { FontKey } from "@/lib/fonts"
// import { usePathname } from 'next/navigation'
// import { useSelectedLayoutSegment } from 'next/navigation'

type ExtendedThemeProviderProps = ThemeProviderProps & {
  children: ReactNode
  defaultFont?: FontKey
  fontStorageKey?: string
}

type ThemeContextType = {
  font: FontKey
  setFont: (font: FontKey) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function createFontStore(storageKey: string, defaultFont: FontKey) {
  let listeners: Array<() => void> = []
  let currentFont = defaultFont

  return {
    subscribe(listener: () => void) {
      listeners.push(listener)
      return () => {
        listeners = listeners.filter(l => l !== listener)
      }
    },
    getSnapshot() {
      return currentFont
    },
    getServerSnapshot() {
      return defaultFont
    },
    setFont(newFont: FontKey) {
      localStorage.setItem(storageKey, newFont)
      document.cookie = `${storageKey}=${newFont}; path=/; max-age=${60 * 60 * 24 * 365}`
      startTransition(() => {
        currentFont = newFont
        document.documentElement.style.setProperty("--font-family", `var(--font-${newFont})`)
        listeners.forEach(l => l())
      })
    },
    init() {
      const saved = localStorage.getItem(storageKey) as FontKey | null
      if (saved) {
        currentFont = saved
        document.documentElement.style.setProperty("--font-family", `var(--font-${saved})`)
      }
    }
  }
}

export function ThemeProvider({
  children,
  defaultFont = "inter",
  fontStorageKey = "font",
  ...props
}: ExtendedThemeProviderProps) {

   // const segment = useSelectedLayoutSegment()
  // const pathname = usePathname() 
  // const route = pathname.slice(1) 

  
  const store = useSyncExternalStore(
    (onStoreChange) => {
      const fontStore = createFontStore(fontStorageKey, defaultFont)
      fontStore.init()
      return fontStore.subscribe(onStoreChange)
    },
    () => (localStorage.getItem(fontStorageKey) ?? defaultFont) as FontKey,
    () => defaultFont
  )

  const setFont = (newFont: FontKey) => {
    localStorage.setItem(fontStorageKey, newFont)
    document.cookie = `${fontStorageKey}=${newFont}; path=/; max-age=${60 * 60 * 24 * 365}`
    startTransition(() => {
      document.documentElement.style.setProperty("--font-family", `var(--font-${newFont})`)
      window.dispatchEvent(new StorageEvent("storage", { key: fontStorageKey }))
    })
  }

  return (
    <ThemeContext.Provider value={{ font: store, setFont }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={props.defaultTheme || "system"}
        enableSystem
        // enableColorScheme={false}
        storageKey="theme"
        {...props}
      >
        {/* <ViewTransition
          enter={{ default: "page-enter" }}
          exit={{ default: "page-exit" }}
          update={{ default: "theme-update" }}
        > */}
          {/* <div className="min-h-screen w-full "data-route={segment ?? undefined} > */}
          {/* <div className="min-h-screen w-full "data-route={route} > */}
          <div className="min-h-screen w-full ">
            {children}
          </div>
        {/* </ViewTransition> */}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = use(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

