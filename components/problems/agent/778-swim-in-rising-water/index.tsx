import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const KeyVariablesSolution = lazy(() => import('./sections/keyVariables-solution.mdx'))

export default async function Problem778SwimInRisingWater() {
  return (
    <AgentCard
      id="778-swim-in-rising-water"
      title="Swim in Rising Water"
      difficulty="hard"
      topics={["dijkstra"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","keyVariables"]}}
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>

        <AgentSection section="keyVariables" file="solution.py">
          <KeyVariablesSolution />
        </AgentSection>
    </AgentCard>
  )
}
