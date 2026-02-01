"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, Target, Hash, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw, BookOpen, Zap, TrendingUp, ChevronsDown, ChevronsUp } from "lucide-react"
import { useState } from "react"
import { Dropdown, DropdownItem } from "./dropdown"
import { AgentTooltip } from "./agent-tooltip"



// const DIFFICULTY_COLORS: Record<string, string> = {
//   all: "blue",
//   easy: "emerald",
//   medium: "amber",
//   hard: "rose",
// }

type FilterState = {
  search: string
  difficulty: "all" | "easy" | "medium" | "hard"
  topic: string
  sort: "number" | "difficulty" | "alpha" | "date-created" | "date-updated"
  order: "asc" | "desc"
}

type AgentFilterHeaderProps = {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  topics: string[]
  stats: {
    total: number
    totalFiltered: number
    easy: number
    medium: number
    hard: number
  }
  hasExpandedProblems: boolean
  onToggleExpandAll: () => void
}

export function AgentFilterHeader({ filters, onFiltersChange, topics, stats, hasExpandedProblems, onToggleExpandAll }: AgentFilterHeaderProps) {
  const [isResetting, setIsResetting] = useState(false)
  const [topicSearch, setTopicSearch] = useState("")

  const filteredTopics = topicSearch
    ? topics.filter((t) => t.toLowerCase().includes(topicSearch.toLowerCase()))
    : topics

  function updateFilter(key: keyof FilterState, value: string) {
    onFiltersChange({ ...filters, [key]: value })
  }

  function handleReset() {
    setIsResetting(true)
    onFiltersChange({
      ...filters,
      search: "",
      difficulty: "all",
      topic: "all",
    })
  }

  function handleResetAnimationEnd() {
    setIsResetting(false)
  }

  const hasActiveFilters =
    filters.search !== "" ||
    filters.difficulty !== "all" ||
    filters.topic !== "all"

  const activeFilterCount =
    (filters.search !== "" ? 1 : 0) +
    (filters.difficulty !== "all" ? 1 : 0) +
    (filters.topic !== "all" ? 1 : 0)

  return (
    <div className="sticky top-0 z-20 bg-background/98 backdrop-blur-xl border-b border-border/20 pb-3 mb-3 pt-2 @container">
      <div className="flex flex-col gap-2.5 w-full">
        {/* Stats Row - Compact */}
        <div className="grid grid-cols-4 gap-2 h-[42px]">
          <div className=" group relative bg-background/40 backdrop-blur-sm rounded-xl px-3 border border-blue-200/30 dark:border-blue-800/30 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-200 flex items-center">
            <div className="flex items-center gap-2.5 w-full">
              <div className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 flex-shrink-0">
                <BookOpen className="text-blue-600 dark:text-blue-400 h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-blue-700 dark:text-blue-300 tabular-nums leading-none mb-0.5">
                  {stats.totalFiltered !== stats.total && <span className="text-xs text-blue-600/50 dark:text-blue-400/50">{stats.totalFiltered}/</span>}
                  {stats.total}
                </div>
                <span className="text-[9px] hidden @sm:block font-medium text-blue-600/50 dark:text-blue-400/50 uppercase tracking-wider leading-none">Total</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-background/40 backdrop-blur-sm rounded-xl px-3 border border-emerald-200/30 dark:border-emerald-800/30 hover:border-emerald-300/50 dark:hover:border-emerald-700/50 transition-all duration-200 flex items-center">
            <div className="flex items-center gap-2.5 w-full">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 flex-shrink-0">
                <Target className="text-emerald-600 dark:text-emerald-400 h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300 tabular-nums leading-none mb-0.5">
                  {stats.easy}
                </div>
                <span className="text-[9px] hidden @sm:block font-medium text-emerald-600/50 dark:text-emerald-400/50 uppercase tracking-wider leading-none">Easy</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-background/40 backdrop-blur-sm rounded-xl px-3 border border-amber-200/30 dark:border-amber-800/30 hover:border-amber-300/50 dark:hover:border-amber-700/50 transition-all duration-200 flex items-center">
            <div className="flex items-center gap-2.5 w-full">
              <div className="p-1.5 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 flex-shrink-0">
                <Zap className="text-amber-600 dark:text-amber-400 h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-amber-700 dark:text-amber-300 tabular-nums leading-none mb-0.5">
                  {stats.medium}
                </div>
                <span className="text-[9px] hidden @sm:block font-medium text-amber-600/50 dark:text-amber-400/50 uppercase tracking-wider leading-none">Medium</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-background/40 backdrop-blur-sm rounded-xl px-3 border border-rose-200/30 dark:border-rose-800/30 hover:border-rose-300/50 dark:hover:border-rose-700/50 transition-all duration-200 flex items-center">
            <div className="flex items-center gap-2.5 w-full">
              <div className="p-1.5 rounded-lg bg-rose-500/10 dark:bg-rose-400/10 flex-shrink-0">
                <TrendingUp className="text-rose-600 dark:text-rose-400 h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-rose-700 dark:text-rose-300 tabular-nums leading-none mb-0.5">
                  {stats.hard}
                </div>
                <span className="text-[9px] hidden @sm:block  font-medium text-rose-600/50 dark:text-rose-400/50 uppercase tracking-wider leading-none">Hard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex gap-1 @lg:gap-2.5 items-stretch w-full ">
        {/* Search Input */}
        <div className="relative flex-1 ml-0 @lg:ml-1">
          <Input
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className=" h-full bg-background/95 backdrop-blur-md border border-border/30 shadow-md hover:shadow-lg focus-visible:shadow-xl focus-visible:border-primary/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 transition-all duration-200 pl-4 pr-10 text-sm placeholder:text-muted-foreground/60 outline-none"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFilter("search", "")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 rounded-lg"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1 @lg:gap-2.5 bg-background/95 backdrop-blur-md rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all duration-200 @lg:px-3.5 py-1" data-filter-controls>
          {/* Difficulty Dropdown */}
            <Dropdown
              align="center"
              centerContainerSelector="[data-filter-controls]"
              tooltipContent="Filter by difficulty"
              tooltipSide="top"
              tooltipClassName="bg-blue-500/5 text-blue-500 fill-blue-500"
              trigger={
                <div
                className={cn(
                           "h-8 w-8 p-0 border border-border/20  flex items-center justify-center cursor-pointer",
                    "transition-all duration-200 rounded-lg relative hover:scale-105 hover:shadow-sm active:scale-95",
                  "bg-linear-to-r hover:bg-linear-to-l",
                  filters.difficulty === "all" && "from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 text-blue-700 dark:text-blue-300",
                  filters.difficulty === "easy" && "from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 text-emerald-700 dark:text-emerald-300 ring-2 ring-offset-1 ring-offset-background ring-emerald-500/30",
                  filters.difficulty === "medium" && "from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 text-amber-700 dark:text-amber-300 ring-2 ring-offset-1 ring-offset-background ring-amber-500/30",
                  filters.difficulty === "hard" && "from-rose-50 to-rose-100 dark:from-rose-950/50 dark:to-rose-900/50 text-rose-700 dark:text-rose-300 ring-2 ring-offset-1 ring-offset-background ring-rose-500/30",
                )}
                  // className={cn(
                  //   "h-8 w-8 p-0 border border-border/20 bg-gradient-to-br flex items-center justify-center cursor-pointer",
                  //   "transition-all duration-200 rounded-lg relative hover:scale-105 hover:shadow-sm active:scale-95",
                  //   `from-${DIFFICULTY_COLORS[filters.difficulty]}-50 to-${DIFFICULTY_COLORS[filters.difficulty]}-100`,
                  //   `dark:from-${DIFFICULTY_COLORS[filters.difficulty]}-950 dark:to-${DIFFICULTY_COLORS[filters.difficulty]}-900`,
                  //   `text-${DIFFICULTY_COLORS[filters.difficulty]}-700 dark:text-${DIFFICULTY_COLORS[filters.difficulty]}-300`,
                  //   filters.difficulty !== "all" && "ring-2 ring-offset-1 ring-offset-background ring-current/30"
                  // )}
                >
                  <Target className="h-4 w-4 " />
                  {filters.difficulty !== "all" && (
                    <div className={cn(
                      "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background shadow-sm",
                      filters.difficulty === "easy" && "bg-emerald-500 dark:bg-emerald-900",
                      filters.difficulty === "medium" && "bg-amber-500 dark:bg-amber-900",
                      filters.difficulty === "hard" && "bg-rose-500 dark:bg-rose-900",
                    )} />
                  )}
                </div>
              }
            >
            <DropdownItem
              checked={filters.difficulty === "all"}
              onSelect={() => updateFilter("difficulty", "all")}
              icon={<Target className="size-4 text-blue-600 dark:text-blue-400" />}
              className="text-foreground/90 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:text-blue-700 dark:hover:text-blue-300"
            >
              All Difficulties
            </DropdownItem>
            <DropdownItem
              checked={filters.difficulty === "easy"}
              onSelect={() => updateFilter("difficulty", "easy")}
              icon={<Target className="size-4 text-emerald-600 dark:text-emerald-400" />}
              className={cn(
                "text-foreground/90 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 dark:hover:text-emerald-300",
                filters.difficulty === "easy" && "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold"
              )}
            >
              Easy
            </DropdownItem>
            <DropdownItem
              checked={filters.difficulty === "medium"}
              onSelect={() => updateFilter("difficulty", "medium")}
              icon={<Target className="size-4 text-amber-600 dark:text-amber-400" />}
              className={cn(
                "text-foreground/90 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-300",
                filters.difficulty === "medium" && "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 font-semibold"
              )}
            >
              Medium
            </DropdownItem>
            <DropdownItem
              checked={filters.difficulty === "hard"}
              onSelect={() => updateFilter("difficulty", "hard")}
              icon={<Target className="size-4 text-rose-600 dark:text-rose-400" />}
              className={cn(
                "text-foreground/90 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 hover:text-rose-700 dark:hover:text-rose-300",
                filters.difficulty === "hard" && "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-semibold"
              )}
            >
              Hard
            </DropdownItem>
            </Dropdown>

          {/* Topic Dropdown */}
            <Dropdown
            align="center"
            centerContainerSelector="[data-filter-controls]"
            tooltipContent="Filter by topic"
            tooltipSide="top"
            tooltipClassName="bg-purple-500/5 text-purple-500 "
            searchable
            searchValue={topicSearch}
            onSearchChange={setTopicSearch}
            searchPlaceholder="Search topics..."
            trigger={
              <div className={cn(
                "h-8 w-8 p-0 border border-border/20 bg-gradient-to-br flex items-center justify-center cursor-pointer rounded-lg relative",
                "from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 text-purple-700 dark:text-purple-300",
                "transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95",
                filters.topic !== "all" && "ring-2 ring-offset-1 ring-offset-background ring-purple-500/30"
              )}>
                <Hash className="h-4 w-4" />
                {filters.topic !== "all" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-background shadow-sm" />
                )}
              </div>
            }
            className="max-w-[240px] max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50 hover:scrollbar-thumb-border"
          >
            {["all", ...filteredTopics].map((topic) => (
              <DropdownItem
                key={topic}
                checked={filters.topic === topic}
                onSelect={() => updateFilter("topic", topic)}
                icon={<Hash className="size-4 text-purple-600 dark:text-purple-400" />}
                className={cn(
                  "text-foreground/90 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:text-purple-700 dark:hover:text-purple-300",
                  filters.topic === topic && topic !== "all" && "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 font-semibold"
                )}
              >
                {topic}
              </DropdownItem>
            ))}
            </Dropdown>

          {/* Sort By Dropdown */}
            <Dropdown
            align="center"
            centerContainerSelector="[data-filter-controls]"
            tooltipContent="Sort problems"
            tooltipSide="top"
            tooltipClassName="bg-indigo-500/5 text-indigo-500 fill-indigo-500"
            trigger={
              <div className={cn(
                "h-8 w-8 p-0 border border-border/20 bg-gradient-to-br flex items-center justify-center cursor-pointer rounded-lg relative",
                "from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50 text-indigo-700 dark:text-indigo-300",
                "transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95",
                filters.sort !== "number" && "ring-2 ring-offset-1 ring-offset-background ring-indigo-500/30"
              )}>
                <ArrowUpDown className="h-4 w-4" />
                {filters.sort !== "number" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-background shadow-sm" />
                )}
              </div>
            }
          >
            {[
              { value: "number", label: "Number" },
              { value: "difficulty", label: "Difficulty" },
              { value: "alpha", label: "Alphabetical" },
              { value: "date-updated", label: "Date Updated" },
              { value: "date-created", label: "Date Created" },
            ].map((sort) => (
              <DropdownItem
                key={sort.value}
                checked={filters.sort === sort.value}
                onSelect={() => updateFilter("sort", sort.value)}
                icon={<ArrowUpDown className="size-4 text-indigo-600 dark:text-indigo-400" />}
                className={cn(
                  "text-foreground/90 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-700 dark:hover:text-indigo-300",
                  filters.sort === sort.value && "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-semibold"
                )}
              >
                {sort.label}
              </DropdownItem>
            ))}
            </Dropdown>

          {/* Sort Order Toggle */}
          <AgentTooltip content={filters.order === "asc" ? "Ascending order" : "Descending order"} side="top">
            <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFilter("order", filters.order === "asc" ? "desc" : "asc")}
            className="h-8 w-8 p-0 rounded-lg border border-border/20 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 hover:shadow-sm active:scale-95 transition-all duration-200 text-indigo-700 dark:text-indigo-300"
          >
            {filters.order === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </Button>
          </AgentTooltip>

          {/* Reset Button */}
          <AgentTooltip
            content={hasActiveFilters ? `Clear ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''}` : "No active filters"}
            side="top"
            className="bg-red-500/5 text-red-500 fill-red-500"
          >
            <div className="relative ml-0.5">
              <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={!hasActiveFilters}
              className={cn(
                "h-8 w-8 p-0 rounded-lg border border-border/20 bg-gradient-to-br transition-all duration-200",
                hasActiveFilters
                  ? "from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/70 dark:hover:to-red-800/70 hover:text-red-600 dark:hover:text-red-400 text-red-700 dark:text-red-300 hover:scale-105 hover:shadow-sm active:scale-95"
                  : "from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 text-muted-foreground/40 cursor-not-allowed"
              )}
            >
              <RotateCcw
                className={cn("h-4 w-4 transition-transform duration-300", isResetting && "rotate-180")}
                onTransitionEnd={handleResetAnimationEnd}
              />
            </Button>
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-background shadow-sm">
                {activeFilterCount}
              </div>
            )}
            </div>
          </AgentTooltip>

          {/* Toggle Expand/Collapse All Button */}
          <AgentTooltip
            content={hasExpandedProblems ? "Collapse all problems" : "Expand all problems"}
            side="top"
            className={
              cn(hasExpandedProblems ? "bg-orange-500/5 text-orange-500 fill-orange-500" : "bg-green-500/5 text-green-500 fill-green-500")
            }
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpandAll}
              disabled={stats.totalFiltered === 0}
              className={cn(
                "h-8 w-8 p-0 rounded-lg border border-border/20 bg-gradient-to-br transition-all duration-200",
                stats.totalFiltered === 0
                  ? "from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 text-muted-foreground/40 cursor-not-allowed"
                  : hasExpandedProblems
                    ? "from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-900/70 dark:hover:to-orange-800/70 hover:text-orange-600 dark:hover:text-orange-400 text-orange-700 dark:text-orange-300 hover:scale-105 hover:shadow-sm active:scale-95"
                    : "from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/70 dark:hover:to-green-800/70 hover:text-green-600 dark:hover:text-green-400 text-green-700 dark:text-green-300 hover:scale-105 hover:shadow-sm active:scale-95"
              )}
            >
              {hasExpandedProblems ? (
                <ChevronsUp className="h-4 w-4" />
              ) : (
                <ChevronsDown className="h-4 w-4" />
              )}
            </Button>
          </AgentTooltip>
        </div>
      </div>
    </div>
    </div>
  )
}
