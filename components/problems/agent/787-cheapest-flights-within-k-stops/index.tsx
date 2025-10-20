import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetDijkstra = lazy(() => import('./sections/codeSnippet-dijkstra.mdx'))
const KeyVariablesDijkstra = lazy(() => import('./sections/keyVariables-dijkstra.mdx'))
const CodeSnippetBellmanFord = lazy(() => import('./sections/codeSnippet-bellman_ford.mdx'))
const TimeComplexityBellmanFord = lazy(() => import('./sections/timeComplexity-bellman_ford.mdx'))

export default async function Problem787CheapestFlightsWithinKStops() {
  return (
    <AgentCard
      id="787-cheapest-flights-within-k-stops"
      title="Cheapest Flights Within K Stops"
      difficulty="medium"
      topics={["dijkstra","bfs"]}
      solutionFiles={["dijkstra.py","bellman_ford.py"]}
      defaultFile="dijkstra.py"
      fileSectionMap={{"dijkstra.py":["definition","codeSnippet","keyVariables"],"bellman_ford.py":["definition","codeSnippet","timeComplexity"]}}
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="dijkstra.py">
          <CodeSnippetDijkstra />
        </AgentSection>

        <AgentSection section="keyVariables" file="dijkstra.py">
          <KeyVariablesDijkstra />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bellman_ford.py">
          <CodeSnippetBellmanFord />
        </AgentSection>

        <AgentSection section="timeComplexity" file="bellman_ford.py">
          <TimeComplexityBellmanFord />
        </AgentSection>
    </AgentCard>
  )
}
