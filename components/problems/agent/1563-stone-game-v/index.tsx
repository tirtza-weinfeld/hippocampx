import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetBottomUp = lazy(() => import('./sections/codeSnippet-bottom-up.mdx'))
const IntuitionBottomUp = lazy(() => import('./sections/intuition-bottom-up.mdx'))
const TimeComplexityBottomUp = lazy(() => import('./sections/timeComplexity-bottom-up.mdx'))
const CodeSnippetTopDown = lazy(() => import('./sections/codeSnippet-top-down.mdx'))

export default async function Problem1563StoneGameV() {
  return (
    <AgentCard
      id="1563-stone-game-v"
      title="Stone Game V"
      difficulty="hard"
      topics={["dp","game"]}
      solutionFiles={["bottom-up.py","top-down.py"]}
      defaultFile="bottom-up.py"
      fileSectionMap={{"bottom-up.py":["definition","codeSnippet","intuition","timeComplexity"],"top-down.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/stone-game-v/"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bottom-up.py">
          <CodeSnippetBottomUp />
        </AgentSection>

        <AgentSection section="intuition" file="bottom-up.py">
          <IntuitionBottomUp />
        </AgentSection>

        <AgentSection section="timeComplexity" file="bottom-up.py">
          <TimeComplexityBottomUp />
        </AgentSection>

        <AgentSection section="codeSnippet" file="top-down.py">
          <CodeSnippetTopDown />
        </AgentSection>
    </AgentCard>
  )
}
