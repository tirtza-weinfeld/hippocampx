import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface SectionContentProps {
  children: ReactNode
  className?: string
}

export function SectionContent({ children, className }: SectionContentProps) {
  return (
    <div
      className={cn(
        "section-content",
        "px-6 py-5",
        "text-gray-700 dark:text-gray-300",
        "leading-relaxed",
        // Prose-like spacing
        "[&>p]:mb-4 [&>p:last-child]:mb-0",
        "[&>ul]:mb-4 [&>ul]:ml-6 [&>ul]:list-disc",
        "[&>ol]:mb-4 [&>ol]:ml-6 [&>ol]:list-decimal",
        "[&>pre]:mb-4 [&>pre]:rounded-lg [&>pre]:p-4",
        "[&>blockquote]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-teal-500/50 [&>blockquote]:pl-4 [&>blockquote]:italic",
        // Code styling
        "[&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:bg-gray-100 [&>code]:dark:bg-gray-800 [&>code]:text-sm [&>code]:font-mono",
        // Link styling
        "[&_a]:text-teal-600 [&_a]:dark:text-teal-400 [&_a]:underline [&_a]:decoration-teal-500/30 [&_a]:underline-offset-2",
        "[&_a:hover]:text-teal-700 [&_a:hover]:dark:text-teal-300 [&_a:hover]:decoration-teal-500/60",
        "[&_a]:transition-colors [&_a]:duration-200",
        className
      )}
    >
      {children}
    </div>
  )
}
