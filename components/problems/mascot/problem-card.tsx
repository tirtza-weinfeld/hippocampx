'use client'

import { use } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/components/mdx/links'
import { MarkdownRenderer } from '@/components/mdx/parse'
import { cn } from '@/lib/utils'
import { ProblemsStateContext, ProblemsActionsContext, MascotActionsContext, MascotStateContext } from './mascot-context'
import { MascotSettingsContext } from './mascot-settings-context'
import { Problem } from './mascot-types'
import { Activity } from 'react'

export function ProblemCard({
  problem,
  slug,
  timeComplexity,
  children,
}: {
  problem: Problem
  slug: string
  timeComplexity?: string
  children?: React.ReactNode
}) {
  const { expandedProblems } = use(ProblemsStateContext)
  const { toggleProblemExpansion } = use(ProblemsActionsContext)
  const { setIsOpen } = use(MascotActionsContext)
  const { stayOpen } = use(MascotSettingsContext)
  const { isFullscreen } = use(MascotStateContext)

  const isExpanded = expandedProblems?.includes(slug) ?? false
  const problemNumber = slug.match(/^(\d+)-/)?.[1]
  const title = `${problemNumber}. ${problem.title}`

  function handleProblemLinkClick() {
    if (!stayOpen) {
      setIsOpen(false)
    }
  }

  return (
    <div
      className={cn(
        'group relative hover:backdrop-blur-sm rounded-xl',
        'hover:shadow-lg transition-all duration-300 hover:scale-[1.01]',
        'bg-linear-to-r',
        'from-sky-50/10 to-blue-500/10 via-sky-400/10',
        'dark:from-sky-950/10 dark:via-sky-900/10 dark:to-sky-900/10',
        'hover:bg-linear-to-l',
        'transition-all duration-300 ease-in-out',
        isExpanded ? 'p-5' : 'p-3'
      )}
      style={{
        display: 'grid',
        gridTemplateRows: isExpanded ? 'auto 1fr' : 'auto 0fr',
        gap: isExpanded ? '1rem' : '0',
      }}
      aria-expanded={isExpanded}
    >
      {/* Always visible header */}
      <div className="flex items-center gap-3">
        {/* Expand/Collapse Button */}
        <button
          onClick={() => toggleProblemExpansion(slug)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleProblemExpansion(slug)
            }
          }}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md
            hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all duration-200
            text-muted-foreground hover:text-sky-600 dark:hover:text-sky-400
            focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:bg-sky-100 dark:focus:bg-sky-900/50"
          aria-label={isExpanded ? 'Collapse problem' : 'Expand problem'}
          aria-expanded={isExpanded}
          aria-controls={`problem-content-${slug}`}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          ) : (
            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
          )}
        </button>

        {/* Problem Title */}
        <Link
          href={`/problems/${slug}`}
          onClick={handleProblemLinkClick}
          className="font-semibold text-lg leading-tight hover:text-primary transition-colors
            group-hover:text-primary line-clamp-2 flex-1
            [&>.link-marker]:hidden [&_.link-marker]:hidden"
        >
          {title}
        </Link>
      </div>

      {/* Collapsible content */}
      <div id={`problem-content-${slug}`} className="overflow-hidden">
        <div className="space-y-4">
          {/* Description */}
          <div className="text-sm text-muted-foreground leading-relaxed">
            <MarkdownRenderer>{problem.definition}</MarkdownRenderer>
          </div>

          {/* Server-rendered solutions - only displayed when expanded */}
          <Activity mode={isFullscreen ? "visible" : "hidden"}> {children} </Activity>

          {/* Topics and LeetCode Link */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-none hover:scrollbar-thin">
              <Badge
                variant="secondary"
                className={cn(
                  'text-xs bg-linear-to-r hover:bg-linear-to-l transition-all duration-200',
                  problem.difficulty === 'easy' &&
                    'from-green-300 dark:from-green-950 to-sky-200 dark:to-sky-900',
                  problem.difficulty === 'medium' &&
                    'from-amber-300 dark:from-amber-800 to-sky-200 dark:to-sky-900',
                  problem.difficulty === 'hard' &&
                    'from-rose-300 dark:from-rose-950 to-sky-200 dark:to-sky-900'
                )}
              >
                <Link href={problem.leetcode} onClick={handleProblemLinkClick}>
                  LeetCode
                </Link>
              </Badge>

              {timeComplexity && (
                <Badge
                  variant="outline"
                  className="text-xs bg-linear-to-r hover:bg-linear-to-l
                    from-sky-400/10 via-sky-400/10 to-sky-400/10 transition-colors shrink-0 border-none"
                >
                  <MarkdownRenderer>{timeComplexity}</MarkdownRenderer>
                </Badge>
              )}

              {problem.topics &&
                problem.topics.map((topic) => (
                  <Badge
                    key={`${slug}-${topic}`}
                    variant="outline"
                    className="text-xs bg-linear-to-r hover:bg-linear-to-l
                      hover:backdrop-blur-sm transition-all duration-300
                      from-sky-400/10 via-sky-400/10 to-sky-400/10 transition-colors shrink-0 border-none"
                  >
                    {topic}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
