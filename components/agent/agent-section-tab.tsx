"use client"

import { cn } from "@/lib/utils"
import { BookText, Code2, Lightbulb, Clock, Variable, Calculator } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import type { LucideIcon } from 'lucide-react'

export type SectionType = 'definition' | 'codeSnippet' | 'intuition' | 'timeComplexity' | 'keyVariables' | 'keyExpressions'

type SectionColorConfig = {
  active: string
  text: string
  border: string
  icon: string
  tooltip: string
  hover: string
}

const SECTION_CONFIG: Record<SectionType, { label: string; icon: LucideIcon; colors: SectionColorConfig }> = {
  definition: {
    label: 'Definition',
    icon: BookText,
    colors: {
      active: 'bg-blue-50 dark:bg-blue-950/50',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      tooltip: 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-950/30'
    }
  },
  codeSnippet: {
    label: 'Code',
    icon: Code2,
    colors: {
      active: 'bg-green-50 dark:bg-green-950/50',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      tooltip: 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100',
      hover: 'hover:bg-green-100 dark:hover:bg-green-950/30'
    }
  },
  intuition: {
    label: 'Intuition',
    icon: Lightbulb,
    colors: {
      active: 'bg-yellow-50 dark:bg-yellow-950/50',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      tooltip: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100',
      hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-950/30'
    }
  },
  timeComplexity: {
    label: 'Time Complexity',
    icon: Clock,
    colors: {
      active: 'bg-orange-50 dark:bg-orange-950/50',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'text-orange-600 dark:text-orange-400',
      tooltip: 'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100',
      hover: 'hover:bg-orange-100 dark:hover:bg-orange-950/30'
    }
  },
  keyVariables: {
    label: 'Variables',
    icon: Variable,
    colors: {
      active: 'bg-purple-50 dark:bg-purple-950/50',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'text-purple-600 dark:text-purple-400',
      tooltip: 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100',
      hover: 'hover:bg-purple-100 dark:hover:bg-purple-950/30'
    }
  },
  keyExpressions: {
    label: 'Expressions',
    icon: Calculator,
    colors: {
      active: 'bg-cyan-50 dark:bg-cyan-950/50',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-200 dark:border-cyan-800',
      icon: 'text-cyan-600 dark:text-cyan-400',
      tooltip: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-900 dark:text-cyan-100',
      hover: 'hover:bg-cyan-50/50 dark:hover:bg-cyan-950/30'
    }
  }
}

type SectionTabProps = {
  section: string
  isActive: boolean
  onClick: () => void
  className?: string
}

export function SectionTab({ section, isActive, onClick, className }: SectionTabProps) {
  const config = SECTION_CONFIG[section as SectionType]
  const Icon = config?.icon
  const label = config?.label ?? section
  const colors = config?.colors

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          aria-current={isActive}
          aria-label={label}
          className={cn(
            "rounded-none!",
            "rounded-t-lg!",
            "px-2 pb-1 pt-1.5 text-sm font-medium transition-all duration-200",
            "border border-transparent",
            "flex items-center justify-center",
            isActive && colors && `${colors.active} ${colors.text} ${colors.border}`,
        
            colors?.hover,
            className
          )}
        >
          {Icon && <Icon className={cn("size-4", colors ? colors.icon : "")} />}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={0}
        className={colors ? colors.tooltip : ""}
      >
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
