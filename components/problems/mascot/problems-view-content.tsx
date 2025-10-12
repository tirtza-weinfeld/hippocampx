import React, { Suspense } from 'react'
// import METADATA from '@/lib/extracted-metadata/problems_metadata.json'
// import STATS from '@/lib/extracted-metadata/stats.json'
// import { Problems } from './mascot-types'
import { ProblemsFilterWrapper } from './problems-filter-wrapper'
import { ProblemCard } from './problem-card'
import { ProblemSolutionsServer } from './problem-solutions-server'
import { getProblems, getTimeComplexities, getTopics } from './data'
import { ProblemCode } from './problem-code'

/**
 * Server component that fetches problem data independently.
 * Creates server components for each problem card with Suspense boundaries.
 * No blocking Promise.all - each code snippet streams independently!
 */
export async function ProblemsViewContent() {

  const problems = await getProblems()
  const timeComplexities = await getTimeComplexities()
  const topics = await getTopics()

  // Fetch data independently in this server component
  // const problems = METADATA.problems as unknown as Problems
  // const stats = STATS
  // const timeComplexities = stats.time_complexity as unknown as Record<string, string>
  // const topics = stats.topics as unknown as Record<string, string[]>


  // Prepare problem data for client filtering component
  const problemsArray = Object.entries(problems).map(([slug, problem]) => ({
    slug,
    problem,
  }))

  const uniqueTopics = Object.keys(topics).sort()

  // Create server components for each problem card
  // Each card wraps its solutions in Suspense for independent streaming
  const problemCards = problemsArray.map(({ slug, problem }) => (
    <ProblemCard
      key={slug}
      slug={slug}
      problem={problem}
      timeComplexity={timeComplexities[slug]}
    >
      {/* {problem.solutions && Object.keys(problem.solutions).length > 0 && ProblemCode(slug, problem.solutions)} */}
    </ProblemCard>
  ))

  return (
    // <div>{problemCards}</div>
    <ProblemsFilterWrapper
      problems={problemsArray}
      uniqueTopics={uniqueTopics}
      timeComplexities={timeComplexities}
    >
      {problemCards}
    </ProblemsFilterWrapper>
  )
}


