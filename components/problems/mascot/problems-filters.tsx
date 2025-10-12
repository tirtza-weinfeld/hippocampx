'use client'

import { use, useState } from 'react'
import {
  RotateCcw,
  X,
  Target,
  Hash,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MascotDropdown, MascotDropdownTrigger, MascotDropdownContent, MascotDropdownCheckboxItem } from './mascot-dropdown'
import { ProblemsStateContext, ProblemsActionsContext } from './mascot-context'

const DIFFICULTY_COLORS: Record<string, string> = {
  all: 'blue',
  easy: 'green',
  medium: 'amber',
  hard: 'rose',
}

export function ProblemsFilters({
  uniqueTopics,
  totalProblems,
  expandedCount,
  onToggleAll,
}: {
  uniqueTopics: string[]
  totalProblems: number
  expandedCount: number
  onToggleAll: () => void
}) {
  const {
    searchQuery,
    difficultyFilter,
    topicFilter,
    hasActiveFilters,
    activeFilterCount,
    sortBy,
    sortOrder,
  } = use(ProblemsStateContext)
  const {
    setSearchQuery,
    setDifficultyFilter,
    setTopicFilter,
    resetFilters,
    setSortBy,
    setSortOrder,
  } = use(ProblemsActionsContext)

  const [isResetting, setIsResetting] = useState(false)

  function handleResetFilters() {
    setIsResetting(true)
    resetFilters()
  }

  function handleResetAnimationEnd() {
    setIsResetting(false)
  }

  const expandAllState =
    expandedCount === 0 ? 'none' : expandedCount === totalProblems ? 'all' : 'some'

  return (
    <div className="col-span-full flex gap-2 h-10 items-center justify-end overflow-hidden">
      {/* Search input */}
      <div className="relative flex-1 ml-1">
        <Input
          placeholder="Search by name, code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 bg-background/80 backdrop-blur-sm border-border/50
            focus:border-primary/50 rounded-lg
            focus:ring-1 focus:ring-primary/20 transition-all duration-200"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0
              hover:bg-destructive/10 hover:text-destructive transition-colors
              shadow-sm backdrop-blur-sm border-border/50"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 bg-linear-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-md rounded-lg border border-border/20 shadow-lg shadow-black/5 px-3 py-2 max-w-full">
        {/* Difficulty dropdown */}
        <MascotDropdown>
          <MascotDropdownTrigger>
            <div
              className={cn(
                'h-7 w-7 p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer',
                'transition-all duration-200 rounded-md relative',
                'bg-linear-to-r hover:bg-linear-to-l',
                `from-${DIFFICULTY_COLORS[difficultyFilter]}-50 to-${DIFFICULTY_COLORS[difficultyFilter]}-100
                 dark:from-${DIFFICULTY_COLORS[difficultyFilter]}-950 dark:to-${DIFFICULTY_COLORS[difficultyFilter]}-900
                 text-${DIFFICULTY_COLORS[difficultyFilter]}-700 dark:text-${DIFFICULTY_COLORS[difficultyFilter]}-300
                 hover:text-${DIFFICULTY_COLORS[difficultyFilter]}-600 dark:hover:text-${DIFFICULTY_COLORS[difficultyFilter]}-400`
              )}
            >
              <Target className="h-4 w-4" />
              {difficultyFilter !== 'all' && (
                <div
                  className={cn(
                    `absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-background`,
                    `bg-${DIFFICULTY_COLORS[difficultyFilter]}-500 dark:bg-${DIFFICULTY_COLORS[difficultyFilter]}-300`
                  )}
                />
              )}
            </div>
          </MascotDropdownTrigger>
          <MascotDropdownContent className="min-w-[160px] py-2 right-0">
            {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
              <MascotDropdownCheckboxItem
                key={difficulty}
                onClick={() => setDifficultyFilter(difficulty)}
                checked={difficultyFilter === difficulty}
                className={difficulty}
                Indicator={Target}
              >
                {difficulty === 'all'
                  ? 'All Difficulties'
                  : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </MascotDropdownCheckboxItem>
            ))}
          </MascotDropdownContent>
        </MascotDropdown>

        {/* Topic dropdown */}
        <MascotDropdown>
          <MascotDropdownTrigger>
            <div
              className={`h-7 w-7 p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer
                hover:bg-linear-to-r hover:from-purple-50 hover:to-purple-100
                dark:hover:from-purple-950/50 dark:hover:to-purple-900/50
                transition-all duration-200 rounded-md relative ring-0 focus:ring-2 focus:ring-purple-500/50
                bg-linear-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 text-purple-700 dark:text-purple-300`}
            >
              <Hash className="h-4 w-4" />
              {topicFilter !== 'all' && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-500 rounded-full border border-background" />
              )}
            </div>
          </MascotDropdownTrigger>
          <MascotDropdownContent className="max-w-[220px] max-h-[240px] overflow-y-auto py-2 right-0">
            {['all', ...uniqueTopics].map((topic) => (
              <MascotDropdownCheckboxItem
                key={topic}
                onClick={() => setTopicFilter(topic)}
                checked={topicFilter === topic}
                className="topics"
                Indicator={Hash}
              >
                {topic}
              </MascotDropdownCheckboxItem>
            ))}
          </MascotDropdownContent>
        </MascotDropdown>

        {/* Sort By dropdown */}
        <MascotDropdown>
          <MascotDropdownTrigger>
            <div
              className={cn(
                'h-7 w-7 p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer',
                'transition-all duration-200 rounded-md relative',
                'bg-linear-to-r hover:bg-linear-to-l',
                'from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50',
                'text-indigo-700 dark:text-indigo-300',
                'hover:text-indigo-600 dark:hover:text-indigo-400'
              )}
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortBy !== 'number' && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 dark:bg-indigo-300 rounded-full border border-background" />
              )}
            </div>
          </MascotDropdownTrigger>
          <MascotDropdownContent className="min-w-[160px] py-2 right-0">
            {[
              { value: 'number', label: 'Number' },
              { value: 'difficulty', label: 'Difficulty' },
              { value: 'date-updated', label: 'Date Updated' },
              { value: 'date-created', label: 'Date Created' },
            ].map((sort) => (
              <MascotDropdownCheckboxItem
                key={sort.value}
                onClick={() =>
                  setSortBy(sort.value as 'number' | 'difficulty' | 'date-updated' | 'date-created')
                }
                checked={sortBy === sort.value}
                className="indigo"
                Indicator={ArrowUpDown}
              >
                {sort.label}
              </MascotDropdownCheckboxItem>
            ))}
          </MascotDropdownContent>
        </MascotDropdown>

        {/* Sort Order toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className={cn(
            'h-7 w-7 p-0 hover:bg-linear-to-r hover:from-indigo-50 hover:to-indigo-100 dark:hover:from-indigo-950/50 dark:hover:to-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 rounded-md ring-0 focus:ring-2 focus:ring-indigo-500/50 text-muted-foreground'
          )}
          title={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
          aria-label={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
        >
          {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </Button>

        {/* Reset button */}
        <div className="relative ml-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            className={cn(
              'h-7 w-7 p-0 hover:bg-linear-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-950/50 dark:hover:to-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 rounded-md ring-0 focus:ring-2 focus:ring-red-500/50 text-muted-foreground'
            )}
            title={`Clear ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''}`}
          >
            <RotateCcw
              className={`h-4 w-4 transition-transform duration-300 transform-gpu ${
                isResetting ? 'rotate-180' : 'rotate-0'
              }`}
              style={{ transformOrigin: 'center' }}
              onTransitionEnd={handleResetAnimationEnd}
            />
          </Button>
          {hasActiveFilters && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-background">
              {activeFilterCount}
            </div>
          )}
        </div>

        {/* Expand All/Collapse All button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleAll}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggleAll()
              }
            }}
            className={cn(
              'h-7 w-7 p-0 hover:bg-linear-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/50 dark:hover:to-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-md ring-0 focus:ring-2 focus:ring-blue-500/50 text-muted-foreground'
            )}
            title={expandAllState === 'all' ? 'Collapse all problems' : 'Expand all problems'}
            aria-label={expandAllState === 'all' ? 'Collapse all problems' : 'Expand all problems'}
          >
            {expandAllState === 'all' ? (
              <ChevronUp className="h-4 w-4" />
            ) : expandAllState === 'some' ? (
              <ChevronsDown className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {expandAllState === 'some' && (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-background">
              ≈
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
