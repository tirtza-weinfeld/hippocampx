import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const TimeComplexitySolution = lazy(() => import('./sections/timeComplexity-solution.mdx'))
const KeyExpressionsSolution = lazy(() => import('./sections/keyExpressions-solution.mdx'))

export default async function Problem215KthLargestElementInAnArray() {
  return (
    <AgentCard
      id="215-kth-largest-element-in-an-array"
      title="Kth Largest Element In An Array"
      difficulty="medium"
      topics={["heap","min-heap"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","timeComplexity","keyExpressions"]}}
      leetcodeUrl="https://leetcode.com/problems/kth-largest-element-in-an-array"
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

        <AgentSection section="keyExpressions" file="solution.py">
          <KeyExpressionsSolution />
        </AgentSection>
    </AgentCard>
  )
}
