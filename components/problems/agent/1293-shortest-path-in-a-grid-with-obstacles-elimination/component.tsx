import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetDijkstra = lazy(() => import('./sections/codeSnippet-dijkstra.mdx'))
const KeyVariablesDijkstra = lazy(() => import('./sections/keyVariables-dijkstra.mdx'))
const KeyExpressionsDijkstra = lazy(() => import('./sections/keyExpressions-dijkstra.mdx'))
const CodeSnippetAStar = lazy(() => import('./sections/codeSnippet-a_star.mdx'))
const TimeComplexityAStar = lazy(() => import('./sections/timeComplexity-a_star.mdx'))
const KeyVariablesAStar = lazy(() => import('./sections/keyVariables-a_star.mdx'))
const KeyExpressionsAStar = lazy(() => import('./sections/keyExpressions-a_star.mdx'))
const CodeSnippetBfs = lazy(() => import('./sections/codeSnippet-bfs.mdx'))
const IntuitionBfs = lazy(() => import('./sections/intuition-bfs.mdx'))
const TimeComplexityBfs = lazy(() => import('./sections/timeComplexity-bfs.mdx'))
const KeyVariablesBfs = lazy(() => import('./sections/keyVariables-bfs.mdx'))

export default async function Problem1293ShortestPathInAGridWithObstaclesElimination() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="1293-shortest-path-in-a-grid-with-obstacles-elimination"
      title="Shortest Path in a Grid with Obstacles Elimination"
      difficulty="hard"
      topics={["bfs"]}
      solutionFiles={["dijkstra.py","a_star.py","bfs.py"]}
      defaultFile="dijkstra.py"
      fileSectionMap={{"dijkstra.py":["definition","codeSnippet","keyVariables","keyExpressions"],"a_star.py":["definition","codeSnippet","timeComplexity","keyVariables","keyExpressions"],"bfs.py":["definition","codeSnippet","intuition","timeComplexity","keyVariables"]}}
      leetcodeUrl="https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination"
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

        <AgentSection section="keyExpressions" file="dijkstra.py">
          <KeyExpressionsDijkstra />
        </AgentSection>

        <AgentSection section="codeSnippet" file="a_star.py">
          <CodeSnippetAStar />
        </AgentSection>

        <AgentSection section="timeComplexity" file="a_star.py">
          <TimeComplexityAStar />
        </AgentSection>

        <AgentSection section="keyVariables" file="a_star.py">
          <KeyVariablesAStar />
        </AgentSection>

        <AgentSection section="keyExpressions" file="a_star.py">
          <KeyExpressionsAStar />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bfs.py">
          <CodeSnippetBfs />
        </AgentSection>

        <AgentSection section="intuition" file="bfs.py">
          <IntuitionBfs />
        </AgentSection>

        <AgentSection section="timeComplexity" file="bfs.py">
          <TimeComplexityBfs />
        </AgentSection>

        <AgentSection section="keyVariables" file="bfs.py">
          <KeyVariablesBfs />
        </AgentSection>
    </AgentCard>
  </Suspense>
  )
}
