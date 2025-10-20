import React from 'react'
import { ProblemsFilterWrapper } from './problems-filter-wrapper'
import { ProblemCard } from './problem-card'
import { ProblemCode } from './problem-code'
import { getProblems, getTimeComplexities, getTopics } from './data'
// import { CodeBlockSkeleton } from '@/components/mdx/code/code-block'

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

  // Create problem cards with code blocks
  const problemCardsMap: Record<string, React.ReactNode> = {}

  problemsArray.forEach(({ slug, problem }) => {
    problemCardsMap[slug] = (
      <ProblemCard
        key={slug}
        slug={slug}
        problem={problem}
        timeComplexity={timeComplexities[slug]}
      >
        {/* {problem.solutions && Object.keys(problem.solutions).length > 0 && <ProblemCode slug={slug} solutions={problem.solutions} />} */}
      
      </ProblemCard>

    )
  })

  return (
    <ProblemsFilterWrapper
      problems={problemsArray}
      uniqueTopics={uniqueTopics}
      timeComplexities={timeComplexities}
      problemCardsMap={problemCardsMap}
    />
  )
}


