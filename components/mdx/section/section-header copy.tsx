import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface SectionHeaderProps {
  children: ReactNode
  className?: string
}

export function SectionHeader({ children, className }: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "section-header",
        "relative",
        "px-6 pt-5 pb-3",
        "border-b border-gray-200/60 dark:border-gray-700/60",
        // Gradient text effect
        "bg-clip-text",
        // Typography
        "[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:tracking-tight",
        "[&>h2]:text-xl [&>h2]:font-semibold [&>h2]:tracking-tight",
        "[&>h3]:text-lg [&>h3]:font-semibold",
        "[&>h1]:text-gray-900 [&>h1]:dark:text-gray-100",
        "[&>h2]:text-gray-900 [&>h2]:dark:text-gray-100",
        "[&>h3]:text-gray-800 [&>h3]:dark:text-gray-200",
        // Subtle gradient accent
        "before:absolute before:inset-x-0 before:bottom-0 before:h-px",
        "before:bg-linear-to-r before:from-transparent before:via-teal-500/30 before:to-transparent",
        className
      )}
    >
      {children}
    </header>
  )
}
