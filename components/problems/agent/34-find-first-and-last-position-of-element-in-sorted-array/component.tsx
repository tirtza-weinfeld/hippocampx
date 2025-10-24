import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))

export default async function Problem34FindFirstAndLastPositionOfElementInSortedArray() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="34-find-first-and-last-position-of-element-in-sorted-array"
      title="Find First and Last Position of Element in Sorted Array"
      difficulty="medium"
      topics={["binary-search"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>
    </AgentCard>
  </Suspense>
  )
}
