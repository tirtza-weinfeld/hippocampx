"use client"

import { cn } from "@/lib/utils"

type SectionType = 'definition' | 'codeSnippet' | 'intuition' | 'timeComplexity' | 'keyVariables' | 'keyExpressions'

const SECTION_LABELS: Record<SectionType, string> = {
  definition: 'Definition',
  codeSnippet: 'Code',
  intuition: 'Intuition',
  timeComplexity: 'Time',
  keyVariables: 'Variables',
  keyExpressions: 'Expressions'
}

type SectionTabProps = {
  section: string
  isActive: boolean
  onClick: () => void
  className?: string
}

export function SectionTab({ section, isActive, onClick, className }: SectionTabProps) {
  return (
    <button
      onClick={onClick}
      aria-current={isActive}
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
        "border border-transparent",
        isActive
          ? "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
        className
      )}
    >
      {SECTION_LABELS[section as SectionType] ?? section}
    </button>
  )
}
