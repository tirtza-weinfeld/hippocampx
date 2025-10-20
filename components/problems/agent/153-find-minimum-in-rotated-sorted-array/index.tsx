import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const IntuitionSolution = lazy(() => import('./sections/intuition-solution.mdx'))
const KeyExpressionsSolution = lazy(() => import('./sections/keyExpressions-solution.mdx'))

export default async function Problem153FindMinimumInRotatedSortedArray() {
  return (
    <AgentCard
      id="153-find-minimum-in-rotated-sorted-array"
      title="Find Minimum in Rotated Sorted Array"
      difficulty="medium"
      topics={["binary-search"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","intuition","keyExpressions"]}}
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

        <AgentSection section="keyExpressions" file="solution.py">
          <KeyExpressionsSolution />
        </AgentSection>
    </AgentCard>
  )
}
