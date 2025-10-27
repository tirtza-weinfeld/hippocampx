import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetVector = lazy(() => import('./sections/codeSnippet-vector.mdx'))
const IntuitionVector = lazy(() => import('./sections/intuition-vector.mdx'))
const TimeComplexityVector = lazy(() => import('./sections/timeComplexity-vector.mdx'))
const CodeSnippetScalar = lazy(() => import('./sections/codeSnippet-scalar.mdx'))
const IntuitionScalar = lazy(() => import('./sections/intuition-scalar.mdx'))

export default async function Problem256PaintHouse() {
  return (
    <AgentCard
      id="256-paint-house"
      title="Paint House"
      difficulty="medium"
      topics={["dp"]}
      solutionFiles={["vector.py","scalar.py"]}
      defaultFile="vector.py"
      fileSectionMap={{"vector.py":["definition","codeSnippet","intuition","timeComplexity"],"scalar.py":["definition","codeSnippet","intuition"]}}
      leetcodeUrl="https://leetcode.com/problems/paint-house/"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="vector.py">
          <CodeSnippetVector />
        </AgentSection>

        <AgentSection section="intuition" file="vector.py">
          <IntuitionVector />
        </AgentSection>

        <AgentSection section="timeComplexity" file="vector.py">
          <TimeComplexityVector />
        </AgentSection>

        <AgentSection section="codeSnippet" file="scalar.py">
          <CodeSnippetScalar />
        </AgentSection>

        <AgentSection section="intuition" file="scalar.py">
          <IntuitionScalar />
        </AgentSection>
    </AgentCard>
  )
}
