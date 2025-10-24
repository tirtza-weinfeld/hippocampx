import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const KeyVariablesSolution = lazy(() => import('./sections/keyVariables-solution.mdx'))

export default async function Problem1631PathWithMinimumEffort() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="1631-path-with-minimum-effort"
      title="Path With Minimum Effort"
      difficulty="medium"
      topics={["dijkstra"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","keyVariables"]}}
      leetcodeUrl="https://leetcode.com/problems/path-with-minimum-effort"
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
  </Suspense>
  )
}
