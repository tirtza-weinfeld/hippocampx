import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const CodeSnippetRank = lazy(() => import('./sections/codeSnippet-rank.mdx'))

export default async function Problem684RedundantConnection() {
  return (
    <AgentCard
      id="684-redundant-connection"
      title="Redundant Connection"
      difficulty="medium"
      topics={["dsu"]}
      solutionFiles={["solution.py","rank.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet"],"rank.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/redundant-connection"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>

        <AgentSection section="codeSnippet" file="rank.py">
          <CodeSnippetRank />
        </AgentSection>
    </AgentCard>
  )
}
