import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSweepLine = lazy(() => import('./sections/codeSnippet-sweep-line.mdx'))
const CodeSnippetIntervalSortAndScan = lazy(() => import('./sections/codeSnippet-Interval-sort-and-scan.mdx'))

export default async function Problem252MeetingRooms() {
  return (
    <AgentCard
      id="252-meeting-rooms"
      title="Meeting Rooms"
      difficulty="easy"
      topics={["sort","sweep-line","interval"]}
      solutionFiles={["sweep-line.py","Interval-sort-and-scan.py"]}
      defaultFile="sweep-line.py"
      fileSectionMap={{"sweep-line.py":["definition","codeSnippet"],"Interval-sort-and-scan.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/meeting-rooms/"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="sweep-line.py">
          <CodeSnippetSweepLine />
        </AgentSection>

        <AgentSection section="codeSnippet" file="Interval-sort-and-scan.py">
          <CodeSnippetIntervalSortAndScan />
        </AgentSection>
    </AgentCard>
  )
}
