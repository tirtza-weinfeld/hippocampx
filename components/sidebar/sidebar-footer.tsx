"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InfinityFontSelector } from "./infinity-font-selector"
import { ThemeToggle } from "@/components/theme/theme-toggle"
// import { SparklesToggle } from "@/components/sidebar/sparkles-toggle"

type SidebarFooterProps = {
  readonly isExpanded: boolean
  readonly isMobile?: boolean
  readonly onSearchClick: () => void
}

export function SidebarFooter({ isExpanded, isMobile = false, onSearchClick }: SidebarFooterProps) {
  const searchButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={onSearchClick}
      className="size-9 rounded-full transition-colors hover:bg-sidebar-hover"
      aria-label="Search"
    >
      <Search className="size-5 text-sidebar-active" />
    </Button>
  )

  if (isMobile) {
    return (
      <footer className="shrink-0 border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between">
          <InfinityFontSelector />
          {/* <SparklesToggle side="top" /> */}
          {searchButton}
          <ThemeToggle side="top" />
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-sidebar-border p-3">
      <div className={cn("flex items-center", isExpanded ? "justify-between" : "flex-col gap-3")}>
        <InfinityFontSelector />
        {/* <SparklesToggle side={isExpanded ? "top" : "right"} /> */}

        <Tooltip>
          <TooltipTrigger asChild>{searchButton}</TooltipTrigger>
          <TooltipContent side={isExpanded ? "top" : "right"}>
            <div className="flex items-center gap-2">
              <span>Search</span>
              <kbd className="rounded border bg-muted px-1 text-xs">⌘K</kbd>
            </div>
          </TooltipContent>
        </Tooltip>

        <ThemeToggle side={isExpanded ? "top" : "right"} />
      </div>
    </footer>
  )
}
