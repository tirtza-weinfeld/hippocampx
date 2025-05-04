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
        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
        isActive ? "bg-muted" : "hover:bg-muted/50",
      )}
      onClick={onClick}
    >
      <div className={cn("h-2 w-2 rounded-full", color)} />
      <span>{title}</span>
      <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-xs">{count}</span>
    </button>
  )
}
