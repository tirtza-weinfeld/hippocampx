import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const IntuitionSolution = lazy(() => import('./sections/intuition-solution.mdx'))
const TimeComplexitySolution = lazy(() => import('./sections/timeComplexity-solution.mdx'))
const KeyVariablesSolution = lazy(() => import('./sections/keyVariables-solution.mdx'))
const KeyExpressionsSolution = lazy(() => import('./sections/keyExpressions-solution.mdx'))

export default async function Problem84LargestRectangleInHistogram() {
  return (
    <AgentCard
      id="84-largest-rectangle-in-histogram"
      title="Largest Rectangle in Histogram"
      difficulty="hard"
      topics={["stack"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","intuition","timeComplexity","keyVariables","keyExpressions"]}}
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

        <AgentSection section="keyVariables" file="solution.py">
          <KeyVariablesSolution />
        </AgentSection>

        <AgentSection section="keyExpressions" file="solution.py">
          <KeyExpressionsSolution />
        </AgentSection>
    </AgentCard>
  )
}
