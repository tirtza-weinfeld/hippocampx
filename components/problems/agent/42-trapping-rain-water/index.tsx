import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetTwoPointer = lazy(() => import('./sections/codeSnippet-two-pointer.mdx'))
const IntuitionTwoPointer = lazy(() => import('./sections/intuition-two-pointer.mdx'))
const TimeComplexityTwoPointer = lazy(() => import('./sections/timeComplexity-two-pointer.mdx'))
const CodeSnippetForwardFillWithTailClosure = lazy(() => import('./sections/codeSnippet-forward-fill-with-tail-closure.mdx'))
const TimeComplexityForwardFillWithTailClosure = lazy(() => import('./sections/timeComplexity-forward-fill-with-tail-closure.mdx'))

export default async function Problem42TrappingRainWater() {
  return (
    <AgentCard
      id="42-trapping-rain-water"
      title="Trapping Rain Water"
      difficulty="hard"
      topics={["TODO"]}
      solutionFiles={["two-pointer.py","forward-fill-with-tail-closure.py"]}
      defaultFile="two-pointer.py"
      fileSectionMap={{"two-pointer.py":["definition","codeSnippet","intuition","timeComplexity"],"forward-fill-with-tail-closure.py":["definition","codeSnippet","timeComplexity"]}}
      leetcodeUrl="https://leetcode.com/problems/trapping-rain-water/"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="two-pointer.py">
          <CodeSnippetTwoPointer />
        </AgentSection>

        <AgentSection section="intuition" file="two-pointer.py">
          <IntuitionTwoPointer />
        </AgentSection>

        <AgentSection section="timeComplexity" file="two-pointer.py">
          <TimeComplexityTwoPointer />
        </AgentSection>

        <AgentSection section="codeSnippet" file="forward-fill-with-tail-closure.py">
          <CodeSnippetForwardFillWithTailClosure />
        </AgentSection>

        <AgentSection section="timeComplexity" file="forward-fill-with-tail-closure.py">
          <TimeComplexityForwardFillWithTailClosure />
        </AgentSection>
    </AgentCard>
  )
}
