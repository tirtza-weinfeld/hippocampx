import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const IntuitionSolution = lazy(() => import('./sections/intuition-solution.mdx'))
const TimeComplexitySolution = lazy(() => import('./sections/timeComplexity-solution.mdx'))

export default async function Problem416PartitionEqualSubsetSum() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="416-partition-equal-subset-sum"
      title="Partition Equal Subset Sum"
      difficulty="medium"
      topics={["dynamic-programming"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","intuition","timeComplexity"]}}
      leetcodeUrl="https://leetcode.com/problems/partition-equal-subset-sum"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>

        <AgentSection section="intuition" file="solution.py">
          <IntuitionSolution />
        </AgentSection>

        <AgentSection section="timeComplexity" file="solution.py">
          <TimeComplexitySolution />
        </AgentSection>
    </AgentCard>
  </Suspense>
  )
}
