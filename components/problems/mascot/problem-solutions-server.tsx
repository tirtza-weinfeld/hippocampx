import React from 'react'
import CodeBlock from '@/components/mdx/code/code-block'
import { Solution } from './mascot-types'

/**
 * Normalize code by cleaning up excessive newlines
 * Converts 3+ consecutive newlines to 2 newlines (1 blank line)
 */
function normalizeCode(code: string): string {
  return code.trim().replace(/\n{3,}/g, '\n\n')
}

/**
 * Server component that pre-renders CodeBlocks for problem solutions.
 * This allows CodeBlock (async server component) to be used within client components
 * via the composition pattern.
 */
export async function ProblemSolutionsServer({
  solutions,
  problemSlug,
}: {
  solutions: Record<string, Solution>
  problemSlug: string
}) {
  const solutionEntries = Object.entries(solutions)

  const renderedSolutions = await Promise.all(
    solutionEntries.map(async ([key, solution], index) => {
      // problems/1-two-sum/solution.py
      const meta = `"source=problems/${problemSlug}/solution.py"`
      const cleanedCode = normalizeCode(solution.code)
      return (
        <div key={`problem/${problemSlug}-solution-${index}.py`}>
          <h3>{solution.title}</h3>
          <CodeBlock className="language-python" meta={meta}>
            {cleanedCode}
          </CodeBlock>
        </div>
      )
    })
  )

  return <>{renderedSolutions}</>
}
