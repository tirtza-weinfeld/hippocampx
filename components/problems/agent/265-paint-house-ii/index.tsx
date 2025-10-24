import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetBottomUp = lazy(() => import('./sections/codeSnippet-bottom-up.mdx'))
const CodeSnippetTopDown = lazy(() => import('./sections/codeSnippet-top-down.mdx'))

export default async function Problem265PaintHouseIi() {
  return (
    <AgentCard
      id="265-paint-house-ii"
      title="Paint House II"
      difficulty="hard"
      topics={["dynamic-programming"]}
      solutionFiles={["bottom-up.py","top-down.py"]}
      defaultFile="bottom-up.py"
      fileSectionMap={{"bottom-up.py":["definition","codeSnippet"],"top-down.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/paint-house-ii/description/"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bottom-up.py">
          <CodeSnippetBottomUp />
        </AgentSection>

        <AgentSection section="codeSnippet" file="top-down.py">
          <CodeSnippetTopDown />
        </AgentSection>
    </AgentCard>
  )
}
