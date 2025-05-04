"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme as useNextTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ThemeToggleProps {
  side?: "top" | "right" | "bottom" | "left"
}

export function ThemeToggle({ side = "top" }: ThemeToggleProps) {
  const { theme, setTheme } = useNextTheme()
  const [mounted, setMounted] = React.useState(false)

  // Toggle theme with smooth transition
  const toggleTheme = React.useCallback(() => {
    // Add a class to the body for transition
    document.documentElement.classList.add("theme-transition")

    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // Also set cookie for server-side access
    document.cookie = `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year expiry

    // Remove the transition class after the transition completes
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 300)
  }, [theme, setTheme])

  // Only render after mounting to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full transition-colors hover:bg-accent"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 text-muted-foreground" />
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full transition-colors hover:bg-accent"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side}>{theme === "dark" ? "Light mode" : "Dark mode"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
