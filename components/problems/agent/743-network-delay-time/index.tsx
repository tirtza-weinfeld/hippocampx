import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetDijkstra = lazy(() => import('./sections/codeSnippet-dijkstra.mdx'))
const IntuitionDijkstra = lazy(() => import('./sections/intuition-dijkstra.mdx'))
const TimeComplexityDijkstra = lazy(() => import('./sections/timeComplexity-dijkstra.mdx'))
const CodeSnippetDijkstraB = lazy(() => import('./sections/codeSnippet-dijkstra-b.mdx'))
const IntuitionDijkstraB = lazy(() => import('./sections/intuition-dijkstra-b.mdx'))
const TimeComplexityDijkstraB = lazy(() => import('./sections/timeComplexity-dijkstra-b.mdx'))

export default async function Problem743NetworkDelayTime() {
  return (
    <AgentCard
      id="743-network-delay-time"
      title="Network Delay Time"
      difficulty="medium"
      topics={["dijkstra"]}
      solutionFiles={["dijkstra.py","dijkstra-b.py"]}
      defaultFile="dijkstra.py"
      fileSectionMap={{"dijkstra.py":["definition","codeSnippet","intuition","timeComplexity"],"dijkstra-b.py":["definition","codeSnippet","intuition","timeComplexity"]}}
      leetcodeUrl="https://leetcode.com/problems/network-delay-time"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="dijkstra.py">
          <CodeSnippetDijkstra />
        </AgentSection>

        <AgentSection section="intuition" file="dijkstra.py">
          <IntuitionDijkstra />
        </AgentSection>

        <AgentSection section="timeComplexity" file="dijkstra.py">
          <TimeComplexityDijkstra />
        </AgentSection>

        <AgentSection section="codeSnippet" file="dijkstra-b.py">
          <CodeSnippetDijkstraB />
        </AgentSection>

        <AgentSection section="intuition" file="dijkstra-b.py">
          <IntuitionDijkstraB />
        </AgentSection>

        <AgentSection section="timeComplexity" file="dijkstra-b.py">
          <TimeComplexityDijkstraB />
        </AgentSection>
    </AgentCard>
  )
}
