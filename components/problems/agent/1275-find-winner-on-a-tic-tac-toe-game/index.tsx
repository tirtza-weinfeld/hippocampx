import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))

export default async function Problem1275FindWinnerOnATicTacToeGame() {
  return (
    <AgentCard
      id="1275-find-winner-on-a-tic-tac-toe-game"
      title="Find Winner on a Tic Tac Toe Game"
      difficulty="easy"
      topics={["game","matrix","simulation"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/find-winner-on-a-tic-tac-toe-game"
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
