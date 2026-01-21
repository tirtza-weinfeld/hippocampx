"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ThemeToggleProps {
  side?: "top" | "right" | "bottom" | "left"
}

export function ThemeToggle({ side = "top" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
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
            aria-label="Toggle theme"
          >
            <Moon className="h-5 w-5 text-muted-foreground dark:hidden" />
            <Sun className="h-5 w-5 text-muted-foreground hidden dark:block" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side}>
          <span className="dark:hidden">Dark mode</span>
          <span className="hidden dark:block">Light mode</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
