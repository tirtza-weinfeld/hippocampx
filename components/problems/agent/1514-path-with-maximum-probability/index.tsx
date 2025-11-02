import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetBellmanFord = lazy(() => import('./sections/codeSnippet-bellman-ford.mdx'))
const IntuitionBellmanFord = lazy(() => import('./sections/intuition-bellman-ford.mdx'))
const CodeSnippetDijkstra = lazy(() => import('./sections/codeSnippet-dijkstra.mdx'))
const IntuitionDijkstra = lazy(() => import('./sections/intuition-dijkstra.mdx'))

export default async function Problem1514PathWithMaximumProbability() {
  return (
    <AgentCard
      id="1514-path-with-maximum-probability"
      title="Path with Maximum Probability"
      difficulty="medium"
      topics={["dijkstra","bellman-ford"]}
      solutionFiles={["bellman-ford.py","dijkstra.py"]}
      defaultFile="bellman-ford.py"
      fileSectionMap={{"bellman-ford.py":["definition","codeSnippet","intuition"],"dijkstra.py":["definition","codeSnippet","intuition"]}}
      leetcodeUrl="https://leetcode.com/problems/path-with-maximum-probability"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bellman-ford.py">
          <CodeSnippetBellmanFord />
        </AgentSection>

        <AgentSection section="intuition" file="bellman-ford.py">
          <IntuitionBellmanFord />
        </AgentSection>

        <AgentSection section="codeSnippet" file="dijkstra.py">
          <CodeSnippetDijkstra />
        </AgentSection>

        <AgentSection section="intuition" file="dijkstra.py">
          <IntuitionDijkstra />
        </AgentSection>
    </AgentCard>
  )
}
