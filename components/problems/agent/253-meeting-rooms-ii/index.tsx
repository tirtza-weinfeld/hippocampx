import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetTwoPointerIntervalSortAndScan = lazy(() => import('./sections/codeSnippet-two-pointer-interval-sort-and-scan.mdx'))
const IntuitionTwoPointerIntervalSortAndScan = lazy(() => import('./sections/intuition-two-pointer-interval-sort-and-scan.mdx'))
const TimeComplexityTwoPointerIntervalSortAndScan = lazy(() => import('./sections/timeComplexity-two-pointer-interval-sort-and-scan.mdx'))
const CodeSnippetSweepLine = lazy(() => import('./sections/codeSnippet-sweep-line.mdx'))
const IntuitionSweepLine = lazy(() => import('./sections/intuition-sweep-line.mdx'))
const TimeComplexitySweepLine = lazy(() => import('./sections/timeComplexity-sweep-line.mdx'))

export default async function Problem253MeetingRoomsIi() {
  return (
    <AgentCard
      id="253-meeting-rooms-ii"
      title="Meeting Rooms II"
      difficulty="medium"
      topics={["sort","sweep-line","interval"]}
      solutionFiles={["two-pointer-interval-sort-and-scan.py","sweep-line.py"]}
      defaultFile="two-pointer-interval-sort-and-scan.py"
      fileSectionMap={{"two-pointer-interval-sort-and-scan.py":["definition","codeSnippet","intuition","timeComplexity"],"sweep-line.py":["definition","codeSnippet","intuition","timeComplexity"]}}
      leetcodeUrl="https://leetcode.com/problems/meeting-rooms-ii"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="two-pointer-interval-sort-and-scan.py">
          <CodeSnippetTwoPointerIntervalSortAndScan />
        </AgentSection>

        <AgentSection section="intuition" file="two-pointer-interval-sort-and-scan.py">
          <IntuitionTwoPointerIntervalSortAndScan />
        </AgentSection>

        <AgentSection section="timeComplexity" file="two-pointer-interval-sort-and-scan.py">
          <TimeComplexityTwoPointerIntervalSortAndScan />
        </AgentSection>

        <AgentSection section="codeSnippet" file="sweep-line.py">
          <CodeSnippetSweepLine />
        </AgentSection>

        <AgentSection section="intuition" file="sweep-line.py">
          <IntuitionSweepLine />
        </AgentSection>

        <AgentSection section="timeComplexity" file="sweep-line.py">
          <TimeComplexitySweepLine />
        </AgentSection>
    </AgentCard>
  )
}
