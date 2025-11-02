import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))

export default async function Problem348DesignTicTacToe() {
  return (
    <AgentCard
      id="348-design-tic-tac-toe"
      title="Design Tic-Tac-Toe"
      difficulty="medium"
      topics={["game","matrix","simulation"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/design-tic-tac-toe"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>
    </AgentCard>
  )
}
