"use client"

import { cn } from "@/lib/utils"

type FileTabProps = {
  file: string
  isActive: boolean
  onClick: () => void
  className?: string
}

export function FileTab({ file, isActive, onClick, className }: FileTabProps) {
  return (
    <button
      onClick={onClick}
      aria-current={isActive}
      className={cn(
        "rounded-none!",
        "rounded-t-lg! ",
        "px-1 pb-1 pt-1.5 text-sm font-medium transition-all duration-200",
        "border border-transparent",
        isActive
          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
        className
      )}
    >
      {file}
    </button>
  )
}
