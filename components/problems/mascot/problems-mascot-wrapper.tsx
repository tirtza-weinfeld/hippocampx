import React from 'react'
import { ProblemsMascot } from './problems-mascot'
import { ProblemSolutionsServer } from './problem-solutions-server'
import METADATA from '@/lib/extracted-metadata/problems_metadata.json'
import STATS from '@/lib/extracted-metadata/stats.json'
import { Problems } from './mascot-types'

/**
 * Server component wrapper that pre-renders all CodeBlocks for problems
 * before passing them to the client component mascot.
 * This enables the use of async server components (CodeBlock) within
 * client components (ProblemsView) via the composition pattern.
 */
export async function ProblemsMascotWrapper() {
  const problems = METADATA.problems as unknown as Problems
  const stats = STATS

  // Pre-render all solution CodeBlocks for all problems
  const preRenderedSolutions: Record<string, React.ReactNode> = {}

  // const problemEntries = Object.entries(problems)

  // await Promise.all(
  //   problemEntries.map(async ([slug, problem]) => {
  //     if (problem.solutions && Object.keys(problem.solutions).length > 0) {
  //       preRenderedSolutions[slug] = await ProblemSolutionsServer({
  //         solutions: problem.solutions,
  //         problemSlug: slug,
  //       })
  //     }
  //   })
  // )

  return (
    <ProblemsMascot
      problems={problems}
      timeComplexities={stats.time_complexity as unknown as Record<string, string>}
      topics={stats.topics as unknown as Record<string, string[]>}
      preRenderedSolutions={preRenderedSolutions}
    />
  )
}
