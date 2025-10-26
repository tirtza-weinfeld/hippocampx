import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const IntuitionSolution = lazy(() => import('./sections/intuition-solution.mdx'))
const KeyExpressionsSolution = lazy(() => import('./sections/keyExpressions-solution.mdx'))

export default async function Problem312BurstBalloons() {
  return (
    <AgentCard
      id="312-burst-balloons"
      title="Burst Balloons"
      difficulty="hard"
      topics={["dp","interval-dp"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","intuition","keyExpressions"]}}
      leetcodeUrl="https://leetcode.com/problems/burst-balloons"
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
