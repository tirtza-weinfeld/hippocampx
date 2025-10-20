"use client"

import { Suspense, useState } from 'react'
import { ChevronsDown, ChevronsUp, X, Target, Hash, ArrowUpDown, ArrowUp, ArrowDown, BookOpen, Clock, TrendingUp, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MascotDropdown, MascotDropdownTrigger, MascotDropdownContent, MascotDropdownCheckboxItem } from '@/components/problems/mascot/mascot-dropdown'
import { useProblemCardContext } from './problem-context'
import { useFilterState, useFilterActions, useFilterMetadata, useFilteredCards } from './filter-context'

const DIFFICULTY_COLORS: Record<string, string> = {
  all: 'blue',
  easy: 'green',
  medium: 'amber',
  hard: 'rose',
}

type FilterHeaderProps = {
  className?: string
}

/**
 * Header component for problem cards with expand/collapse and filtering.
 * Uses Suspense boundaries for instant page loads.
 */
export function ProblemCardFilterHeader({ className }: FilterHeaderProps) {
  return (
    <div className={cn("w-full", className)}>
      <Suspense fallback={<FilterHeaderSkeleton />}>
        <FilterHeaderContent />
      </Suspense>
    </div>
  )
}

/**
 * Main header content with expand/collapse and filtering controls.
 */
function FilterHeaderContent() {
  const { expandAll, collapseAll, expandedProblems, allProblemIds } = useProblemCardContext()
  const filterState = useFilterState()
  const filterActions = useFilterActions()
  const metadata = useFilterMetadata()
  const { stats } = useFilteredCards()
  const [isResetting, setIsResetting] = useState(false)

  const allExpanded = expandedProblems.size === allProblemIds.size && allProblemIds.size > 0
  const someExpanded = expandedProblems.size > 0 && expandedProblems.size < allProblemIds.size
  const Icon = allExpanded ? ChevronsUp : ChevronsDown

  // Calculate active filters
  const hasActiveFilters = filterState.search !== "" || filterState.difficulty !== "all" || filterState.topic !== "all"
  let activeFilterCount = 0
  if (filterState.search !== "") activeFilterCount++
  if (filterState.difficulty !== "all") activeFilterCount++
  if (filterState.topic !== "all") activeFilterCount++

  function handleExpandToggle(): void {
    if (allExpanded) {
      collapseAll()
    } else {
      expandAll()
    }
  }

  function handleResetFilters(): void {
    setIsResetting(true)
    filterActions.reset()
  }

  function handleResetAnimationEnd(): void {
    setIsResetting(false)
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Stats Row */}
      <Suspense fallback={<StatsSkeleton />}>
        <FilterStats
          total={stats.total}
          totalFiltered={stats.totalFiltered}
          easy={stats.easy}
          medium={stats.medium}
          hard={stats.hard}
        />
      </Suspense>

      {/* Controls Row */}
      <div className="flex gap-2 items-center w-full flex-wrap">
        {/* Search Input */}
        <Suspense fallback={<SearchSkeleton />}>
          <FilterSearch
            value={filterState.search}
            onChange={filterActions.setSearch}
          />
        </Suspense>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-linear-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-md rounded-lg border border-border/20 shadow-lg shadow-black/5 px-3 py-2">
          {/* Difficulty dropdown */}
          <MascotDropdown>
            <MascotDropdownTrigger>
              <div
                className={cn(
                  'h-7 w-7 p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer',
                  'transition-all duration-200 rounded-md relative',
                  'bg-linear-to-r hover:bg-linear-to-l',
                  `from-${DIFFICULTY_COLORS[filterState.difficulty]}-50 to-${DIFFICULTY_COLORS[filterState.difficulty]}-100
                   dark:from-${DIFFICULTY_COLORS[filterState.difficulty]}-950 dark:to-${DIFFICULTY_COLORS[filterState.difficulty]}-900
                   text-${DIFFICULTY_COLORS[filterState.difficulty]}-700 dark:text-${DIFFICULTY_COLORS[filterState.difficulty]}-300
                   hover:text-${DIFFICULTY_COLORS[filterState.difficulty]}-600 dark:hover:text-${DIFFICULTY_COLORS[filterState.difficulty]}-400`
                )}
              >
                <Target className="h-4 w-4" />
                {filterState.difficulty !== 'all' && (
                  <div
                    className={cn(
                      `absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-background`,
                      `bg-${DIFFICULTY_COLORS[filterState.difficulty]}-500 dark:bg-${DIFFICULTY_COLORS[filterState.difficulty]}-300`
                    )}
                  />
                )}
              </div>
            </MascotDropdownTrigger>
            <MascotDropdownContent className="min-w-[160px] py-2 right-0">
              {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                <MascotDropdownCheckboxItem
                  key={difficulty}
                  onClick={() => filterActions.setDifficulty(difficulty as typeof filterState.difficulty)}
                  checked={filterState.difficulty === difficulty}
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
                {filterState.topic !== 'all' && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-500 rounded-full border border-background" />
                )}
              </div>
            </MascotDropdownTrigger>
            <MascotDropdownContent className="max-w-[220px] max-h-[240px] overflow-y-auto py-2 right-0">
              {['all', ...metadata.allTopics].map((topic) => (
                <MascotDropdownCheckboxItem
                  key={topic}
                  onClick={() => filterActions.setTopic(topic)}
                  checked={filterState.topic === topic}
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
                {filterState.sort !== 'number' && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 dark:bg-indigo-300 rounded-full border border-background" />
                )}
              </div>
            </MascotDropdownTrigger>
            <MascotDropdownContent className="min-w-[160px] py-2 right-0">
              {[
                { value: 'number', label: 'Number' },
                { value: 'difficulty', label: 'Difficulty' },
                { value: 'alpha', label: 'Alphabetical' },
                { value: 'date-updated', label: 'Date Updated' },
                { value: 'date-created', label: 'Date Created' },
              ].map((sort) => (
                <MascotDropdownCheckboxItem
                  key={sort.value}
                  onClick={() => filterActions.setSort(sort.value as typeof filterState.sort)}
                  checked={filterState.sort === sort.value}
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
            onClick={() => filterActions.setOrder(filterState.order === 'asc' ? 'desc' : 'asc')}
            className={cn(
              'h-7 w-7 p-0 hover:bg-linear-to-r hover:from-indigo-50 hover:to-indigo-100 dark:hover:from-indigo-950/50 dark:hover:to-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 rounded-md ring-0 focus:ring-2 focus:ring-indigo-500/50 text-muted-foreground'
            )}
            title={filterState.order === 'asc' ? 'Sort ascending' : 'Sort descending'}
            aria-label={filterState.order === 'asc' ? 'Sort ascending' : 'Sort descending'}
          >
            {filterState.order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
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

          {/* Expand/Collapse All Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExpandToggle}
              disabled={allProblemIds.size === 0}
              className={cn(
                'h-7 w-7 p-0 hover:bg-linear-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/50 dark:hover:to-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-md ring-0 focus:ring-2 focus:ring-blue-500/50 text-muted-foreground disabled:opacity-50'
              )}
              title={allExpanded ? 'Collapse all' : 'Expand all'}
              aria-label={allExpanded ? 'Collapse all' : 'Expand all'}
            >
              <Icon className="h-4 w-4" />
            </Button>
            {someExpanded && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-background">
                ≈
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Stats display showing total, difficulty breakdown with icons (mascot style).
 */
function FilterStats({ total, totalFiltered, easy, medium, hard }: {
  total: number
  totalFiltered: number
  easy: number
  medium: number
  hard: number
}) {
  return (
    <div className={cn('transition-all duration-300 ease-out', 'grid grid-cols-4 gap-2')}>
      <div
        className={cn(
          'bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
          'rounded-lg text-center transition-all duration-300',
          'p-1.5'
        )}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <BookOpen className="text-blue-600 h-3 w-3" />
          <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">
            {totalFiltered !== total && <span>{totalFiltered}/</span>}
            {total}
          </span>
        </div>
      </div>

      <div
        className={cn(
          'bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
          'rounded-lg text-center transition-all duration-300',
          'p-1.5'
        )}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <Target className="text-emerald-600 h-3 w-3" />
          <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">{easy}</span>
        </div>
      </div>

      <div
        className={cn(
          'bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900',
          'rounded-lg text-center transition-all duration-300',
          'p-1.5'
        )}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <Clock className="text-amber-600 h-3 w-3" />
          <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">{medium}</span>
        </div>
      </div>

      <div
        className={cn(
          'bg-linear-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900',
          'rounded-lg text-center transition-all duration-300',
          'p-1.5'
        )}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <TrendingUp className="text-rose-600 h-3 w-3" />
          <span className="font-bold text-rose-700 dark:text-rose-300 text-sm">{hard}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Search input component with instant filtering (mascot style).
 */
function FilterSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative flex-1 ml-1">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by id, title..."
        className={cn(
          'h-10 bg-background/80 backdrop-blur-sm border-border/50',
          'focus:border-primary/50 rounded-lg',
          'focus:ring-1 focus:ring-primary/20 transition-all duration-200'
        )}
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors shadow-sm backdrop-blur-sm border-border/50"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

/**
 * Loading skeleton for the header.
 */
function FilterHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full animate-pulse">
      <div className="grid grid-cols-4 gap-2">
        <div className="h-16 bg-muted rounded-lg" />
        <div className="h-16 bg-muted rounded-lg" />
        <div className="h-16 bg-muted rounded-lg" />
        <div className="h-16 bg-muted rounded-lg" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-muted rounded-lg" />
        <div className="h-10 w-24 bg-muted rounded-lg" />
      </div>
    </div>
  )
}

/**
 * Loading skeleton for stats.
 */
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2 animate-pulse">
      <div className="h-16 bg-muted rounded-lg" />
      <div className="h-16 bg-muted rounded-lg" />
      <div className="h-16 bg-muted rounded-lg" />
      <div className="h-16 bg-muted rounded-lg" />
    </div>
  )
}

/**
 * Loading skeleton for search.
 */
function SearchSkeleton() {
  return <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse" />
}
