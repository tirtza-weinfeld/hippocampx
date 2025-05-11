"use client"

import { cn } from "@/lib/utils"

interface SearchCategoryProps {
  title: string
  count: number
  color?: string
  isActive?: boolean
  onClick?: () => void
}

export function SearchCategory({ title, count, color = "bg-primary", isActive, onClick }: SearchCategoryProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
        isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted/50 text-muted-foreground",
      )}
      onClick={onClick}
    >
      <div className={cn("h-2 w-2 rounded-full", color)} />
      <span>{title}</span>
      <span className={cn("ml-auto rounded-full px-1.5 py-0.5 text-xs", isActive ? "bg-background/20" : "bg-muted")}>
        {count}
      </span>
    </button>
  )
}
