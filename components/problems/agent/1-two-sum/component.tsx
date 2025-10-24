import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const TimeComplexitySolution = lazy(() => import('./sections/timeComplexity-solution.mdx'))

export default async function Problem1TwoSum() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="1-two-sum"
      title="Two Sum"
      difficulty="easy"
      topics={["hash-table","k-sum"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","timeComplexity"]}}
      leetcodeUrl="https://leetcode.com/problems/two-sum"
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
