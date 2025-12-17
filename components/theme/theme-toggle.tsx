"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme as useNextTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

interface ThemeToggleProps {
  side?: "top" | "right" | "bottom" | "left"
}

export function ThemeToggle({ side = "top" }: ThemeToggleProps) {
  const { theme, setTheme } = useNextTheme()
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

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
