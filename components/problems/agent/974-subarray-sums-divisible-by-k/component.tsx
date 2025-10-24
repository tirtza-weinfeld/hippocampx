import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))

export default async function Problem974SubarraySumsDivisibleByK() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="974-subarray-sums-divisible-by-k"
      title="Subarray Sums Divisible by K"
      difficulty="medium"
      topics={["prefix-sum"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/subarray-sums-divisible-by-k"
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
