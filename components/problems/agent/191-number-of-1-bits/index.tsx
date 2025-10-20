import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetBitCount = lazy(() => import('./sections/codeSnippet-bit_count.mdx'))
const CodeSnippetBrianKernighan = lazy(() => import('./sections/codeSnippet-brian-kernighan.mdx'))
const IntuitionBrianKernighan = lazy(() => import('./sections/intuition-brian-kernighan.mdx'))
const TimeComplexityBrianKernighan = lazy(() => import('./sections/timeComplexity-brian-kernighan.mdx'))

export default async function Problem191NumberOf1Bits() {
  return (
    <AgentCard
      id="191-number-of-1-bits"
      title="Number of 1 Bits"
      difficulty="easy"
      topics={["bit-manipulation"]}
      solutionFiles={["bit_count.py","brian-kernighan.py"]}
      defaultFile="bit_count.py"
      fileSectionMap={{"bit_count.py":["definition","codeSnippet"],"brian-kernighan.py":["definition","codeSnippet","intuition","timeComplexity"]}}
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bit_count.py">
          <CodeSnippetBitCount />
        </AgentSection>

        <AgentSection section="codeSnippet" file="brian-kernighan.py">
          <CodeSnippetBrianKernighan />
        </AgentSection>

        <AgentSection section="intuition" file="brian-kernighan.py">
          <IntuitionBrianKernighan />
        </AgentSection>

        <AgentSection section="timeComplexity" file="brian-kernighan.py">
          <TimeComplexityBrianKernighan />
        </AgentSection>
    </AgentCard>
  )
}
