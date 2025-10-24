import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetBottomup = lazy(() => import('./sections/codeSnippet-bottomup.mdx'))
const CodeSnippetTopdown = lazy(() => import('./sections/codeSnippet-topdown.mdx'))

export default async function Problem70ClimbingStairs() {
  return (
    <AgentCard
      id="70-climbing-stairs"
      title="Climbing Stairs"
      difficulty="easy"
      topics={["dynamic-programming"]}
      solutionFiles={["bottomup.py","topdown.py"]}
      defaultFile="bottomup.py"
      fileSectionMap={{"bottomup.py":["definition","codeSnippet"],"topdown.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/climbing-stairs"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bottomup.py">
          <CodeSnippetBottomup />
        </AgentSection>

        <AgentSection section="codeSnippet" file="topdown.py">
          <CodeSnippetTopdown />
        </AgentSection>
    </AgentCard>
  )
}
