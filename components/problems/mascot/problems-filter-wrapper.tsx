'use client'

import { use } from 'react'
import { ProblemsStateContext, ProblemsActionsContext } from './mascot-context'
import { ProblemsFilters } from './problems-filters'
import { ProblemsList } from './problems-list'
import { ProblemsStats } from './problems-stats'
import { Problem } from './mascot-types'

/**
 * Client component that handles filtering logic and wraps server-rendered problem cards.
 * Server components (ProblemCard with solutions) are passed as children.
 */
export function ProblemsFilterWrapper({
  problems,
  uniqueTopics,
  timeComplexities,
  problemCardsMap,
}: {
  problems: Array<{ slug: string; problem: Problem }>
  uniqueTopics: string[]
  timeComplexities: Record<string, string>
  problemCardsMap: Record<string, React.ReactNode>
}) {
  const {
    searchQuery,
    difficultyFilter,
    topicFilter,
    sortBy,
    sortOrder,
    expandedProblems,
  } = use(ProblemsStateContext)
  const { toggleAllProblems } = use(ProblemsActionsContext)

  // Helper function to clean text for searching
  function cleanTextForSearch(text: string): string {
    return text
      .replace(/`/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
  }

  // Filter problems
  const filteredProblems = problems.filter(({ slug, problem }) => {
    const searchTerm = searchQuery.toLowerCase()

    const matchesSearch =
      !searchQuery ||
      slug?.toLowerCase().includes(searchTerm) ||
      cleanTextForSearch(problem.title || '').includes(searchTerm) ||
      cleanTextForSearch(problem.definition || '').includes(searchTerm) ||
      problem.topics?.some((topic) => cleanTextForSearch(topic || '').includes(searchTerm)) ||
      Object.values(problem.solutions || {}).some(
        (solution) =>
          cleanTextForSearch(solution.title || '').includes(searchTerm) ||
          cleanTextForSearch(solution.code || '').includes(searchTerm)
      )

    const matchesDifficulty =
      difficultyFilter === 'all' || problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()

    const matchesTopic =
      topicFilter === 'all' ||
      (problem.topics &&
        Array.isArray(problem.topics) &&
        problem.topics.some((topic) => topic?.toLowerCase() === topicFilter.toLowerCase()))

    return matchesSearch && matchesDifficulty && matchesTopic
  })

  // Sort problems
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    let comparison = 0

    if (sortBy === 'number') {
      const numA = parseInt(a.slug.match(/^(\d+)-/)?.[1] || '0', 10)
      const numB = parseInt(b.slug.match(/^(\d+)-/)?.[1] || '0', 10)
      comparison = numA - numB
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
      comparison = difficultyOrder[a.problem.difficulty] - difficultyOrder[b.problem.difficulty]
    } else if (sortBy === 'date-updated') {
      const dateA = new Date(a.problem.time_stamps?.updated_at || 0).getTime()
      const dateB = new Date(b.problem.time_stamps?.updated_at || 0).getTime()
      comparison = dateB - dateA
    } else if (sortBy === 'date-created') {
      const dateA = new Date(a.problem.time_stamps?.created_at || 0).getTime()
      const dateB = new Date(b.problem.time_stamps?.created_at || 0).getTime()
      comparison = dateB - dateA
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Stats
  const total = problems.length
  const totalFiltered = sortedProblems.length
  const easy = sortedProblems.filter((p) => p.problem.difficulty === 'easy').length
  const medium = sortedProblems.filter((p) => p.problem.difficulty === 'medium').length
  const hard = sortedProblems.filter((p) => p.problem.difficulty === 'hard').length

  // Expansion state
  const expandedCount = sortedProblems.filter((p) => expandedProblems?.includes(p.slug) ?? false).length

  function handleToggleAll() {
    toggleAllProblems(sortedProblems.map((p) => p.slug))
  }

  // Get filtered and sorted children from the map
  const sortedChildren = sortedProblems
    .map(({ slug }) => problemCardsMap[slug])
    .filter((child): child is React.ReactNode => child !== undefined)

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="transition-all duration-300 ease-out flex flex-col">
        <ProblemsStats
          total={total}
          totalFiltered={totalFiltered}
          easy={easy}
          medium={medium}
          hard={hard}
        />

        <ProblemsFilters
          uniqueTopics={uniqueTopics}
          totalProblems={sortedProblems.length}
          expandedCount={expandedCount}
          onToggleAll={handleToggleAll}
        />
      </div>

      <ProblemsList isEmpty={sortedProblems.length === 0}>{sortedChildren}</ProblemsList>
    </div>
  )
}
