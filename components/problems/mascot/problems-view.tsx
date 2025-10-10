'use client'

import { useState, useRef, use } from 'react'
import { BookOpen, Clock, Target, TrendingUp, X, RotateCcw, Hash, ChevronDown, ChevronRight, ChevronUp, ChevronsDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/mdx/links'
import { Problems } from './mascot-types'
import { MarkdownRenderer } from '@/components/mdx/parse'
import { cn } from '@/lib/utils'
import { MascotDropdown, MascotDropdownTrigger, MascotDropdownContent, MascotDropdownCheckboxItem } from './mascot-dropdown'
import {
  MascotActionsContext,
  ProblemsStateContext,
  ProblemsActionsContext,
  ScrollActionsContext
} from './mascot-context'
import { MascotSettingsContext } from './mascot-settings-context'
// import CodeBlock from '@/components/mdx/code/code-block'



const DIFFICULTY_COLORS: Record<string, string> = {
  all: 'blue',
  easy: 'green',
  medium: 'amber',
  hard: 'rose',
}


export function ProblemsView({ problems: problemsData, time_complexities, topics }: { problems: Problems, time_complexities: Record<string, string>, topics: Record<string, string[]> }) {

  const { stayOpen } = use(MascotSettingsContext)
  const { setIsOpen } = use(MascotActionsContext)
  const {
    searchQuery,
    difficultyFilter,
    topicFilter,
    expandedProblems,
    hasActiveFilters,
    activeFilterCount,
    sortBy,
    sortOrder,
  } = use(ProblemsStateContext)
  const {
    setSearchQuery,
    setDifficultyFilter,
    setTopicFilter,
    toggleProblemExpansion,
    toggleAllProblems,
    resetFilters,
    setSortBy,
    setSortOrder,
  } = use(ProblemsActionsContext)
  const { getScrollPosition, setScrollPosition } = use(ScrollActionsContext)

  // UI state
  const [isResetting, setIsResetting] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Ref-based scroll tracking (no re-renders, no jitter)
  const scrollPosRef = useRef(getScrollPosition())

  // Scroll position is saved via handleScrollContainerBlur when user stops interacting
  // and persisted through the reducer + localStorage pattern



  function handleResetFilters() {
    // Start rotation animation
    setIsResetting(true)

    // Reset all filters using context
    resetFilters()
  }

  // Handle animation end declaratively
  function handleResetAnimationEnd() {
    setIsResetting(false)
  }

  // Smart auto-close logic for problem navigation
  function handleProblemLinkClick() {
    // Only close dialog if user hasn't pinned it open
    if (!stayOpen) {
      setIsOpen(false)
    }
  }


  // Clean scroll handling with immediate position saving
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    // Update ref immediately (no re-renders, no jitter)
    scrollPosRef.current = e.currentTarget.scrollTop
    // Save position immediately to context/localStorage
    setScrollPosition(e.currentTarget.scrollTop)
  }

  // Restore scroll position when ref is set
  function setScrollRef(element: HTMLDivElement | null) {
    scrollContainerRef.current = element
    const savedScrollPosition = getScrollPosition()
    if (element && savedScrollPosition > 0) {
      requestAnimationFrame(() => {
        if (element) {
          element.scrollTop = savedScrollPosition
          scrollPosRef.current = savedScrollPosition
        }
      })
    }
  }







  const processedProblems = Object.entries(problemsData).map(([slug, problem]) => ({
    ...problem,
    slug,
    title: `${slug.match(/^(\d+)-/)?.[1]}. ${problem.title}`,
  }))

  const uniqueTopics = Object.keys(topics).sort()


  // Helper function to clean text for searching (remove code formatting)
  function cleanTextForSearch(text: string): string {
    return text
      .replace(/`/g, '') // Remove backticks
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
      .trim()
      .toLowerCase()
  }

  // Filter problems with robust filtering
  const filteredProblems = processedProblems.filter(problem => {
    const searchTerm = searchQuery.toLowerCase()

    // Search filter - includes slug, title, definition, topics, solution titles, and code
    const matchesSearch = !searchQuery ||
      problem.slug?.toLowerCase().includes(searchTerm) ||
      cleanTextForSearch(problem.title || '').includes(searchTerm) ||
      cleanTextForSearch(problem.definition || '').includes(searchTerm) ||
      problem.topics?.some(topic => cleanTextForSearch(topic || '').includes(searchTerm)) ||
      Object.values(problem.solutions || {}).some(solution =>
        cleanTextForSearch(solution.title || '').includes(searchTerm) ||
        cleanTextForSearch(solution.code || '').includes(searchTerm)

      )



    // Difficulty filter
    const matchesDifficulty = difficultyFilter === 'all' ||
      problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()

    // Topic filter
    const matchesTopic = topicFilter === 'all' ||
      (problem.topics && Array.isArray(problem.topics) &&
        problem.topics.some(topic => topic?.toLowerCase() === topicFilter.toLowerCase()))

    return matchesSearch && matchesDifficulty && matchesTopic
  })

  // Sort problems based on sortBy and sortOrder
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    let comparison = 0

    if (sortBy === 'number') {
      const numA = parseInt(a.slug.match(/^(\d+)-/)?.[1] || '0', 10)
      const numB = parseInt(b.slug.match(/^(\d+)-/)?.[1] || '0', 10)
      comparison = numA - numB
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
      comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
    } else if (sortBy === 'date') {
      const dateA = new Date(a.time_stamps?.updated_at || 0).getTime()
      const dateB = new Date(b.time_stamps?.updated_at || 0).getTime()
      comparison = dateB - dateA // newest first by default
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Get expand/collapse all button state
  const totalProblems = sortedProblems.length
  const expandedCount = sortedProblems.filter(p =>
    expandedProblems?.includes(p.slug) ?? false
  ).length

  const expandAllState = expandedCount === 0 ? 'none' :
    expandedCount === totalProblems ? 'all' : 'some'

  // Wrapper for toggleAllProblems that passes the current filtered problem slugs
  function handleToggleAllProblems() {
    toggleAllProblems(sortedProblems.map(p => p.slug))
  }

  // Statistics
  const total = sortedProblems.length
  const easy = sortedProblems.filter(p => p.difficulty === 'easy').length
  const medium = sortedProblems.filter(p => p.difficulty === 'medium').length
  const hard = sortedProblems.filter(p => p.difficulty === 'hard').length
  const topTopics = uniqueTopics.slice(0, 3)

  const stats = { total, easy, medium, hard, topTopics }


  return (
    <div className="flex flex-col h-full w-full relative 
  
    ">

      <div
        className={cn(
          "transition-all duration-300 ease-out",
          "flex flex-col"
        )}

      >

        {/* Stats - Compact when in compact mode */}
        <div className={cn(
          "transition-all duration-300 ease-out mb-2 ",
          " grid  grid-cols-4 gap-2",
        )}>

          <div className={
            cn(
              "bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
              "rounded-lg text-center transition-all duration-300",
              "p-1.5",
            )}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="text-blue-600 h-3 w-3" />
              <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">
                {stats.total !== processedProblems.length && <span>{stats.total}/</span>}
                {processedProblems.length}
              </span>
            </div>
          </div>

          <div className={
            cn(
              "bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900",
              "rounded-lg text-center transition-all duration-300",
              "p-1.5",
            )}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="text-emerald-600 h-3 w-3" />
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                {stats.easy}
              </span>
            </div>
          </div>
          <div className={
            cn(
              "bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900",
              "rounded-lg text-center transition-all duration-300",
              "p-1.5",
            )}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="text-amber-600 h-3 w-3" />
              <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">
                {stats.medium}
              </span>
            </div>
          </div>
          <div className={
            cn(
              "bg-linear-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900",
              "rounded-lg text-center transition-all duration-300",
              "p-1.5",
            )}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="text-rose-600 h-3 w-3" />
              <span className="font-bold text-rose-700 dark:text-rose-300 text-sm">
                {stats.hard}
              </span>
            </div>
          </div>


        </div>


        {/* Compact filters when in compact mode */}
        <div className="col-span-full flex gap-2 h-10 items-center justify-end overflow-hidden
     
        ">

          {/* Search input */}
          <div className="relative flex-1 ml-1 ">
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
            <Input
              placeholder="Search by name, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" h-10 bg-background/80 backdrop-blur-sm border-border/50 
              focus:border-primary/50 rounded-lg
               focus:ring-1 focus:ring-primary/20 transition-all duration-200 
               
               "
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 
                hover:bg-destructive/10 hover:text-destructive transition-colors
                shadow-sm backdrop-blur-sm border-border/50
                "
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 bg-linear-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-md rounded-lg border border-border/20 shadow-lg shadow-black/5 px-3 py-2 max-w-full">


            {/* Custom difficulty dropdown */}
            <MascotDropdown>
              <MascotDropdownTrigger>
                <div className={cn(
                  "h-7 w-7 p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer",
                  "transition-all duration-200 rounded-md relative  ",
                  "relative",
                  "bg-linear-to-r hover:bg-linear-to-l",
                  `from-${DIFFICULTY_COLORS[difficultyFilter]}-50 to-${DIFFICULTY_COLORS[difficultyFilter]}-100
                   dark:from-${DIFFICULTY_COLORS[difficultyFilter]}-950 dark:to-${DIFFICULTY_COLORS[difficultyFilter]}-900 
                   text-${DIFFICULTY_COLORS[difficultyFilter]}-700 dark:text-${DIFFICULTY_COLORS[difficultyFilter]}-300 
                   hover:text-${DIFFICULTY_COLORS[difficultyFilter]}-600 dark:hover:text-${DIFFICULTY_COLORS[difficultyFilter]}-400`,
                  // `focus-visible:ring-${DIFFICULTY_COLORS[difficultyFilter]}-500`,


                )}>
                  <Target className="h-4 w-4" />
                  {difficultyFilter !== 'all' && (
                    <div className={cn(`
                      absolute -top-0.5 
                      -right-0.5 w-2.5 h-2.5 rounded-full border border-background`,
                      `bg-${DIFFICULTY_COLORS[difficultyFilter]}-500 dark:bg-${DIFFICULTY_COLORS[difficultyFilter]}-300`,


                    )} />
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



                    {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </MascotDropdownCheckboxItem>
                ))}
              </MascotDropdownContent>
            </MascotDropdown>

            {/* Custom topic dropdown */}
            <MascotDropdown>
              <MascotDropdownTrigger>
                <div className={`
                      h-7 w-7 p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer
                      hover:bg-linear-to-r hover:from-purple-50 hover:to-purple-100
                      dark:hover:from-purple-950/50 dark:hover:to-purple-900/50
                      transition-all duration-200 rounded-md relative ring-0 focus:ring-2 focus:ring-purple-500/50
                       bg-linear-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 text-purple-700 dark:text-purple-300'}
                    `}>
                  <Hash className="h-4 w-4" />
                  {topicFilter !== 'all' && (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-500 rounded-full border border-background" />
                  )}
                </div>
              </MascotDropdownTrigger>
              <MascotDropdownContent className="max-w-[220px] max-h-[240px] overflow-y-auto py-2 right-0">

                {['all', ...uniqueTopics].map(topic => (
                  <MascotDropdownCheckboxItem
                    key={topic}
                    onClick={() => setTopicFilter(topic)}
                    checked={topicFilter === topic}
                    className="topics"
                    Indicator={Hash}



                  >
                    {/* <Hash className="h-4 w-4 "/> */}

                    {topic}
                  </MascotDropdownCheckboxItem>
                ))}
              </MascotDropdownContent>
            </MascotDropdown>

            {/* Sort By dropdown */}
            <MascotDropdown>
              <MascotDropdownTrigger>
                <div className={cn(
                  "h-7 w-7 p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer",
                  "transition-all duration-200 rounded-md relative",
                  "bg-linear-to-r hover:bg-linear-to-l",
                  "from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50",
                  "text-indigo-700 dark:text-indigo-300",
                  "hover:text-indigo-600 dark:hover:text-indigo-400"
                )}>
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
                  { value: 'date', label: 'Date Updated' }
                ].map((sort) => (
                  <MascotDropdownCheckboxItem
                    key={sort.value}
                    onClick={() => setSortBy(sort.value as 'number' | 'difficulty' | 'date')}
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
                "h-7 w-7 p-0 hover:bg-linear-to-r hover:from-indigo-50 hover:to-indigo-100 dark:hover:from-indigo-950/50 dark:hover:to-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 rounded-md ring-0 focus:ring-2 focus:ring-indigo-500/50 text-muted-foreground",
              )}
              title={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
              aria-label={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
            >
              {sortOrder === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>

            {/* Reset button */}
            {/* {hasActiveFilters && ( */}
            <div className="relative ml-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
                className={cn(
                  "h-7 w-7 p-0 hover:bg-linear-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-950/50 dark:hover:to-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 rounded-md ring-0 focus:ring-2 focus:ring-red-500/50 text-muted-foreground ",
                )}
                title={`Clear ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''}`}
              >
                <RotateCcw
                  className={`h-4 w-4 transition-transform duration-300 transform-gpu ${isResetting ? 'rotate-180' : 'rotate-0'}`}
                  style={{ transformOrigin: 'center' }}
                  onTransitionEnd={handleResetAnimationEnd}
                />
              </Button>
              {hasActiveFilters && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-background">
                {activeFilterCount}
              </div>}
            </div>

            {/* Expand All/Collapse All button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleAllProblems}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleToggleAllProblems()
                  }
                }}
                className={cn(
                  "h-7 w-7 p-0 hover:bg-linear-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/50 dark:hover:to-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-md ring-0 focus:ring-2 focus:ring-blue-500/50 text-muted-foreground",
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
            {/* )} */}
          </div>



        </div>
      </div>












      {/* Scrollable Problems List */}
      <div
        ref={setScrollRef}
        className=" flex-1 px-4 mt-4 overflow-y-auto scroll-smooth scrollbar-thin
         scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground"
        style={{
          scrollBehavior: 'auto', // Changed to 'auto' for instant restoration
          overscrollBehavior: 'contain'
        }}
        onScroll={handleScroll}
        tabIndex={-1}
      >
        <div className="space-y-4 group/problems">
          {sortedProblems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl bg-linear-to-r from-sky-500  via-blue-300 to-sky-100
               hover:bg-linear-to-l bg-clip-text text-transparent mb-6 
               group-hover/problems:animate-pulse-rotate transition-all duration-500
               ">🔍</div>
              <h3 className="text-xl font-semibold mb-3">No problems found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <RotateCcw
                    className={`h-4 w-4 mr-2 transition-transform duration-300 transform-gpu ${isResetting ? 'rotate-180' : 'rotate-0'}`}
                    style={{ transformOrigin: 'center' }}
                    onTransitionEnd={handleResetAnimationEnd}
                  />
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            sortedProblems.map((problem, index) => {
              const isExpanded = expandedProblems?.includes(problem.slug) ?? false



              return (
                <div
                  key={`${problem.slug}-${index}`}
                  className={cn(
                    "group relative hover:backdrop-blur-sm rounded-xl",
                    "hover:shadow-lg transition-all duration-300 hover:scale-[1.01]",
                    "bg-linear-to-r ",
                    "from-sky-50/10 to-blue-500/10 via-sky-400/10",
                    "dark:from-sky-950/10 dark:via-sky-900/10 dark:to-sky-900/10",
                    "hover:bg-linear-to-l",
                    "transition-all duration-300 ease-in-out",
                    isExpanded ? "p-5" : "p-3"
                  )}
                  style={{
                    display: 'grid',
                    gridTemplateRows: isExpanded ? 'auto 1fr' : 'auto 0fr',
                    gap: isExpanded ? '1rem' : '0'
                  }}
                  aria-expanded={isExpanded}
                >
                  {/* Always visible header */}
                  <div className="flex items-center gap-3">
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => {
                        console.log('Button clicked for:', problem.slug)
                        toggleProblemExpansion(problem.slug)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          // console.log('Key pressed for:', problem.slug)
                          toggleProblemExpansion(problem.slug)
                        }
                      }}
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md
                      hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all duration-200
                      text-muted-foreground hover:text-sky-600 dark:hover:text-sky-400
                      focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:bg-sky-100 dark:focus:bg-sky-900/50"
                      aria-label={isExpanded ? 'Collapse problem' : 'Expand problem'}
                      aria-expanded={isExpanded}
                      aria-controls={`problem-content-${problem.slug}`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                      )}
                    </button>

                    {/* Problem Title (always visible, remains as link) */}
                    <Link
                      href={`/problems/${problem.slug}`}
                      onClick={handleProblemLinkClick}
                      className="font-semibold text-lg leading-tight hover:text-primary transition-colors
                      group-hover:text-primary line-clamp-2 flex-1
                      [&>.link-marker]:hidden [&_.link-marker]:hidden"
                    >
                      {problem.title}

                    </Link>
                  </div>

                  {/* Collapsible content */}
                  <div
                    id={`problem-content-${problem.slug}`}
                    className="overflow-hidden"
                  >

                    <div className="space-y-4">
                      {/* {Object.values(problem.solutions).map((solution) => {
                        const meta = `source=problems/${problem.slug}/${solution.title}`
                        return (
                          <div key={solution.title}>
                            <h3>{solution.title}</h3>
                            <CodeBlock className="language-python" meta={meta}>
                              ```python  ${meta}
                              {solution.code}
                              ```
                            </CodeBlock>
                          </div>
                        )
                      })} */}
                      {/* Description */}
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        <MarkdownRenderer>
                          {problem.definition}
                        </MarkdownRenderer>

                      </div>

                      {/* Topics and LeetCode Link */}
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-none hover:scrollbar-thin">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs bg-linear-to-r hover:bg-linear-to-l transition-all duration-200",
                              problem.difficulty === 'easy' && "from-green-300 dark:from-green-950 to-sky-200 dark:to-sky-900",
                              problem.difficulty === 'medium' && "from-amber-300 dark:from-amber-800 to-sky-200   dark:to-sky-900",
                              problem.difficulty === 'hard' && "from-rose-300 dark:from-rose-950 to-sky-200 dark:to-sky-900",
                            )}
                          >
                            <Link
                              href={problem.leetcode}
                              onClick={handleProblemLinkClick}
                            >
                              LeetCode
                            </Link>
                          </Badge>

                          {time_complexities[problem.slug] && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-linear-to-r hover:bg-linear-to-l
                              from-sky-400/10 via-sky-400/10 to-sky-400/10 transition-colors shrink-0 border-none"
                            >
                              <MarkdownRenderer >
                                {time_complexities[problem.slug]?.[0] || ''}
                              </MarkdownRenderer>
                            </Badge>
                          )}

                          {problem.topics && problem.topics.map((topic) => (
                            <Badge
                              key={topic}
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
            })
          )}
        </div>
      </div>
    </div>
  )
}