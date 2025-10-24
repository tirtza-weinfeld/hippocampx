import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const TimeComplexitySolution = lazy(() => import('./sections/timeComplexity-solution.mdx'))

export default async function Problem743NetworkDelayTime() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="743-network-delay-time"
      title="Network Delay Time"
      difficulty="medium"
      topics={["dijkstra"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","timeComplexity"]}}
      leetcodeUrl="https://leetcode.com/problems/network-delay-time"
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
