import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const IntuitionSolution = lazy(() => import('./sections/intuition-solution.mdx'))

export default async function Problem1514PathWithMaximumProbability() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="1514-path-with-maximum-probability"
      title="Path with Maximum Probability"
      difficulty="medium"
      topics={["bellman-ford"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","intuition"]}}
      leetcodeUrl="https://leetcode.com/problems/path-with-maximum-probability"
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
    </AgentCard>
  </Suspense>
  )
}
