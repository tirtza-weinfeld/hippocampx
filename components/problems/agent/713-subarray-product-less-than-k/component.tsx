import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const TimeComplexitySolution = lazy(() => import('./sections/timeComplexity-solution.mdx'))

export default async function Problem713SubarrayProductLessThanK() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="713-subarray-product-less-than-k"
      title="Number of Subarrays with Product Less Than K"
      difficulty="medium"
      topics={["sliding-window"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","timeComplexity"]}}
      leetcodeUrl="https://leetcode.com/problems/subarray-product-less-than-k"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>

        <AgentSection section="timeComplexity" file="solution.py">
          <TimeComplexitySolution />
        </AgentSection>
    </AgentCard>
  </Suspense>
  )
}
