"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export type Font =
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

type ExtendedThemeProviderProps = ThemeProviderProps & {
  children: React.ReactNode
  defaultFont?: Font
  fontStorageKey?: string
}

type ThemeContextType = {
  font: Font
  setFont: (font: Font) => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultFont = "inter",
  fontStorageKey = "font",
  ...props
}: ExtendedThemeProviderProps) {
  const [font, setFontState] = React.useState<Font>(defaultFont)

  // Update font and save to both cookie and localStorage
  const setFont = React.useCallback(
    (newFont: Font) => {
      setFontState(newFont)

      // Save to localStorage as fallback
      localStorage.setItem(fontStorageKey, newFont)

      // Save to cookie for server-side access
      document.cookie = `${fontStorageKey}=${newFont}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year expiry

      // Add a class to trigger a re-render of text elements
      document.documentElement.style.setProperty("--font-family", getFontFamily(newFont))
      document.documentElement.classList.add("font-transition")
      setTimeout(() => {
        document.documentElement.classList.remove("font-transition")
      }, 300)
    },
    [fontStorageKey],
  )

  // Set initial font on mount
  React.useEffect(() => {
    document.documentElement.style.setProperty("--font-family", getFontFamily(font))

    // Check if we need to load from localStorage (only if different from prop)
    const savedFont = localStorage.getItem(fontStorageKey)
    if (savedFont && savedFont !== defaultFont) {
      setFontState(savedFont as Font)
      document.documentElement.style.setProperty("--font-family", getFontFamily(savedFont as Font))
    }
  }, [font, fontStorageKey, defaultFont])

  return (
    <ThemeContext.Provider value={{ font, setFont }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={props.defaultTheme || "system"}
        enableSystem
        disableTransitionOnChange={false}
        storageKey="theme"
        {...props}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
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
