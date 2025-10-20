"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, Target, Hash, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw, BookOpen, Clock, TrendingUp } from "lucide-react"
import { useState } from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

const DIFFICULTY_COLORS: Record<string, string> = {
  all: "blue",
  easy: "emerald",
  medium: "amber",
  hard: "rose",
}

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
}

export function AgentFilterHeader({ filters, onFiltersChange, topics, stats }: AgentFilterHeaderProps) {
  const [isResetting, setIsResetting] = useState(false)

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
    <div className="flex flex-col gap-3 w-full mb-4">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg text-center p-1.5">
          <div className="flex items-center justify-center gap-1">
            <BookOpen className="text-blue-600 h-3 w-3" />
            <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">
              {stats.totalFiltered !== stats.total && <span>{stats.totalFiltered}/</span>}
              {stats.total}
            </span>
          </div>
        </div>

        <div className="bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-lg text-center p-1.5">
          <div className="flex items-center justify-center gap-1">
            <Target className="text-emerald-600 h-3 w-3" />
            <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">{stats.easy}</span>
          </div>
        </div>

        <div className="bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-lg text-center p-1.5">
          <div className="flex items-center justify-center gap-1">
            <Clock className="text-amber-600 h-3 w-3" />
            <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">{stats.medium}</span>
          </div>
        </div>

        <div className="bg-linear-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 rounded-lg text-center p-1.5">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="text-rose-600 h-3 w-3" />
            <span className="font-bold text-rose-700 dark:text-rose-300 text-sm">{stats.hard}</span>
          </div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex gap-2 items-center w-full">
        {/* Search Input */}
        <div className="relative flex-1">
          <Input
            placeholder="Search by id, title..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="h-10 bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-lg focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFilter("search", "")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-background/95 backdrop-blur-md rounded-lg border border-border/20 shadow-lg px-3 py-2">
          {/* Difficulty Dropdown */}
          <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger
              className={cn(
                "h-7 w-7 p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer",
                "transition-all duration-200 rounded-md relative",
                `from-${DIFFICULTY_COLORS[filters.difficulty]}-50 to-${DIFFICULTY_COLORS[filters.difficulty]}-100`,
                `dark:from-${DIFFICULTY_COLORS[filters.difficulty]}-950 dark:to-${DIFFICULTY_COLORS[filters.difficulty]}-900`,
                `text-${DIFFICULTY_COLORS[filters.difficulty]}-700 dark:text-${DIFFICULTY_COLORS[filters.difficulty]}-300`
              )}
            >
              <Target className="h-4 w-4" />
              {filters.difficulty !== "all" && (
                <div className={cn(
                  "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-background",
                  `bg-${DIFFICULTY_COLORS[filters.difficulty]}-500`
                )} />
              )}
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                className="z-50 min-w-[160px] overflow-hidden rounded-lg border border-border/20 bg-popover/95 backdrop-blur-xl shadow-xl p-1"
                sideOffset={4}
              >
                {["all", "easy", "medium", "hard"].map((difficulty) => (
                  <DropdownMenuPrimitive.CheckboxItem
                    key={difficulty}
                    checked={filters.difficulty === difficulty}
                    onCheckedChange={() => updateFilter("difficulty", difficulty)}
                    className="relative flex cursor-pointer select-none items-center gap-2 py-2.5 pr-3 pl-8 text-sm rounded mx-1 hover:bg-accent transition-colors"
                  >
                    <span className="absolute left-2 flex size-3.5 items-center justify-center">
                      <DropdownMenuPrimitive.ItemIndicator>
                        <Target className="size-4" />
                      </DropdownMenuPrimitive.ItemIndicator>
                    </span>
                    {difficulty === "all" ? "All Difficulties" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </DropdownMenuPrimitive.CheckboxItem>
                ))}
              </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Root>

          {/* Topic Dropdown */}
          <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger
              className="h-7 w-7 p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer rounded-md relative from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 text-purple-700 dark:text-purple-300 transition-all duration-200"
            >
              <Hash className="h-4 w-4" />
              {filters.topic !== "all" && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-500 rounded-full border border-background" />
              )}
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                className="z-50 max-w-[220px] max-h-[240px] overflow-y-auto rounded-lg border border-border/20 bg-popover/95 backdrop-blur-xl shadow-xl p-1"
                sideOffset={4}
              >
                {["all", ...topics].map((topic) => (
                  <DropdownMenuPrimitive.CheckboxItem
                    key={topic}
                    checked={filters.topic === topic}
                    onCheckedChange={() => updateFilter("topic", topic)}
                    className="relative flex cursor-pointer select-none items-center gap-2 py-2.5 pr-3 pl-8 text-sm rounded mx-1 hover:bg-accent transition-colors"
                  >
                    <span className="absolute left-2 flex size-3.5 items-center justify-center">
                      <DropdownMenuPrimitive.ItemIndicator>
                        <Hash className="size-4" />
                      </DropdownMenuPrimitive.ItemIndicator>
                    </span>
                    {topic}
                  </DropdownMenuPrimitive.CheckboxItem>
                ))}
              </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Root>

          {/* Sort By Dropdown */}
          <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger
              className="h-7 w-7 p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer rounded-md relative from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50 text-indigo-700 dark:text-indigo-300 transition-all duration-200"
            >
              <ArrowUpDown className="h-4 w-4" />
              {filters.sort !== "number" && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border border-background" />
              )}
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                className="z-50 min-w-[160px] overflow-hidden rounded-lg border border-border/20 bg-popover/95 backdrop-blur-xl shadow-xl p-1"
                sideOffset={4}
              >
                {[
                  { value: "number", label: "Number" },
                  { value: "difficulty", label: "Difficulty" },
                  { value: "alpha", label: "Alphabetical" },
                  { value: "date-updated", label: "Date Updated" },
                  { value: "date-created", label: "Date Created" },
                ].map((sort) => (
                  <DropdownMenuPrimitive.CheckboxItem
                    key={sort.value}
                    checked={filters.sort === sort.value}
                    onCheckedChange={() => updateFilter("sort", sort.value)}
                    className="relative flex cursor-pointer select-none items-center gap-2 py-2.5 pr-3 pl-8 text-sm rounded mx-1 hover:bg-accent transition-colors"
                  >
                    <span className="absolute left-2 flex size-3.5 items-center justify-center">
                      <DropdownMenuPrimitive.ItemIndicator>
                        <ArrowUpDown className="size-4" />
                      </DropdownMenuPrimitive.ItemIndicator>
                    </span>
                    {sort.label}
                  </DropdownMenuPrimitive.CheckboxItem>
                ))}
              </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Root>

          {/* Sort Order Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFilter("order", filters.order === "asc" ? "desc" : "asc")}
            className="h-7 w-7 p-0 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-muted-foreground"
          >
            {filters.order === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </Button>

          {/* Reset Button */}
          <div className="relative ml-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={!hasActiveFilters}
              className="h-7 w-7 p-0 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 text-muted-foreground disabled:opacity-30"
            >
              <RotateCcw
                className={cn("h-4 w-4 transition-transform duration-300", isResetting && "rotate-180")}
                onTransitionEnd={handleResetAnimationEnd}
              />
            </Button>
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-background">
                {activeFilterCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
