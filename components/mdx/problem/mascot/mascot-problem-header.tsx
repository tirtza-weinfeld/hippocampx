"use client"

import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/mdx/links"
import { cn } from "@/lib/utils"

interface MascotProblemHeaderProps {
  title: string
  problemNumber?: string | null
  difficulty: string
  topics?: string[]
  leetcode?: string
  className?: string
}

export function MascotProblemHeader({
  title,
  problemNumber,
  difficulty,
  topics = [],
  leetcode,
  className
}: MascotProblemHeaderProps) {
  const fullTitle = problemNumber ? `${problemNumber}. ${title}` : title

  return (
    <div className={cn("space-y-3", className)}>
      {/* Title and LeetCode Link */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-tight">
          {fullTitle}
        </h3>
        {leetcode && (
          <Link
            href={leetcode}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View on LeetCode →
          </Link>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Difficulty Badge */}
        <Badge
          variant="secondary"
          className={cn(
            "text-xs",
            difficulty === 'easy' && 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
            difficulty === 'medium' && 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
            difficulty === 'hard' && 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
          )}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>

        {/* Topic Badges */}
        {topics.map((topic) => (
          <Badge
            key={topic}
            variant="outline"
            className="text-xs bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800"
          >
            {topic}
          </Badge>
        ))}
      </div>
    </div>
  )
}
