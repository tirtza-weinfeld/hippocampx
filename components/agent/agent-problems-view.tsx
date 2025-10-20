"use client"

import { type ReactNode, useState, useMemo, use } from 'react'
import { Activity } from 'react'
import { AgentFilterHeader } from './agent-filter-header'

export type AgentMetadata = {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  topics: string[]
  createdAt: string
  updatedAt: string
}

type FilterState = {
  search: string
  difficulty: "all" | "easy" | "medium" | "hard"
  topic: string
  sort: "number" | "difficulty" | "alpha" | "date-created" | "date-updated"
  order: "asc" | "desc"
}

type AgentProblemsViewProps = {
  metadata: AgentMetadata[] // Streamed, non-blocking
  problemComponents: Record<string, ReactNode> // Problem ID -> Component mapping
}

/**
 * Client wrapper that manages filtering/sorting state.
 * Problems are server-rendered components mapped by ID for O(1) lookup.
 * Uses React 19 use() to unwrap promise without blocking parent render.
 */
export function AgentProblemsView({ metadata, problemComponents }: AgentProblemsViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    difficulty: "all",
    topic: "all",
    sort: "number",
    order: "asc",
  })

  // Extract unique topics from metadata
  const uniqueTopics = useMemo(() => {
    const topicsSet = new Set<string>()
    metadata.forEach(m => m.topics.forEach(t => topicsSet.add(t)))
    return Array.from(topicsSet).sort()
  }, [metadata])

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    // Filter
    const filtered = metadata.filter(m => {
      // Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesId = m.id.toLowerCase().includes(searchLower)
        const matchesTitle = m.title.toLowerCase().includes(searchLower)
        if (!matchesId && !matchesTitle) return false
      }

      // Difficulty
      if (filters.difficulty !== "all" && m.difficulty !== filters.difficulty) {
        return false
      }

      // Topic
      if (filters.topic !== "all" && !m.topics.includes(filters.topic)) {
        return false
      }

      return true
    })

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0

      if (filters.sort === "number") {
        const numA = parseInt(a.id.match(/^(\d+)-/)?.[1] || "0", 10)
        const numB = parseInt(b.id.match(/^(\d+)-/)?.[1] || "0", 10)
        comparison = numA - numB
      } else if (filters.sort === "difficulty") {
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
        comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      } else if (filters.sort === "alpha") {
        comparison = a.title.localeCompare(b.title)
      } else if (filters.sort === "date-created") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        comparison = dateB - dateA
      } else if (filters.sort === "date-updated") {
        const dateA = new Date(a.updatedAt).getTime()
        const dateB = new Date(b.updatedAt).getTime()
        comparison = dateB - dateA
      }

      return filters.order === "asc" ? comparison : -comparison
    })

    return sorted
  }, [metadata, filters])

  // Calculate stats
  const stats = useMemo(() => ({
    total: metadata.length,
    totalFiltered: filteredAndSorted.length,
    easy: filteredAndSorted.filter(m => m.difficulty === "easy").length,
    medium: filteredAndSorted.filter(m => m.difficulty === "medium").length,
    hard: filteredAndSorted.filter(m => m.difficulty === "hard").length,
  }), [metadata, filteredAndSorted])

  // Create visibility map
  const visibleIds = useMemo(() => {
    return new Set(filteredAndSorted.map(m => m.id))
  }, [filteredAndSorted])

  // Create order map for CSS order property
  const orderMap = useMemo(() => {
    const map: Record<string, number> = {}
    filteredAndSorted.forEach((m, index) => {
      map[m.id] = index
    })
    return map
  }, [filteredAndSorted])

  return (
    <div className="flex flex-col w-full">
      <AgentFilterHeader
        filters={filters}
        onFiltersChange={setFilters}
        topics={uniqueTopics}
        stats={stats}
      />

      <div className="flex flex-col gap-0">
        {/*
          Map over filtered/sorted metadata and render corresponding problem component.
          Activity handles visibility, CSS order handles sort order.
          O(1) lookup from problemComponents object.
        */}
        {filteredAndSorted.map((meta, index) => {
          return (
            <Activity
              key={meta.id}
              mode="visible"
            >
              <div style={{ order: index }}>
                {problemComponents[meta.id]}
              </div>
            </Activity>
          )
        })}
      </div>
    </div>
  )
}
