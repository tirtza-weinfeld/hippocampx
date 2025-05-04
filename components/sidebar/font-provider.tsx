"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type Font =
  | "inter"
  | "dancing-script"
  | "pacifico"
  | "great-vibes"
  | "satisfy"
  | "tangerine"
  | "allura"
  | "kaushan-script"
  | "sacramento"
  | "roboto"
  | "open-sans"
  | "montserrat"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultFont?: Font
  storageKey?: string
  fontStorageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  font: Font
  setFont: (font: Font) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  font: "inter",
  setFont: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultFont = "inter",
  storageKey = "theme",
  fontStorageKey = "font",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [font, setFont] = useState<Font>(defaultFont)

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey)
    const savedFont = localStorage.getItem(fontStorageKey)

    if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
      setTheme(savedTheme as Theme)
    } else {
      setTheme(defaultTheme)
    }

    if (savedFont) {
      setFont(savedFont as Font)
    } else {
      setFont(defaultFont)
    }
  }, [defaultTheme, defaultFont, storageKey, fontStorageKey])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  useEffect(() => {
    document.documentElement.style.setProperty("--font-family", getFontFamily(font))
    localStorage.setItem(fontStorageKey, font)

    // Add a class to trigger a re-render of text elements
    document.documentElement.classList.add("font-transition")
    setTimeout(() => {
      document.documentElement.classList.remove("font-transition")
    }, 300)
  }, [font, fontStorageKey])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
    font,
    setFont: (font: Font) => {
      setFont(font)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

function getFontFamily(font: Font): string {
  switch (font) {
    case "dancing-script":
      return "'Dancing Script', cursive"
    case "pacifico":
      return "'Pacifico', cursive"
    case "great-vibes":
      return "'Great Vibes', cursive"
    case "satisfy":
      return "'Satisfy', cursive"
    case "tangerine":
      return "'Tangerine', cursive"
    case "allura":
      return "'Allura', cursive"
    case "kaushan-script":
      return "'Kaushan Script', cursive"
    case "sacramento":
      return "'Sacramento', cursive"
    case "roboto":
      return "'Roboto', sans-serif"
    case "open-sans":
      return "'Open Sans', sans-serif"
    case "montserrat":
      return "'Montserrat', sans-serif"
    case "inter":
    default:
      return "var(--font-sans)"
  }
}
