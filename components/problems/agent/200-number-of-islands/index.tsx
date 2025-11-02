import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetIterativeDfs = lazy(() => import('./sections/codeSnippet-iterative-dfs.mdx'))
const CodeSnippetBfs = lazy(() => import('./sections/codeSnippet-bfs.mdx'))
const IntuitionBfs = lazy(() => import('./sections/intuition-bfs.mdx'))
const TimeComplexityBfs = lazy(() => import('./sections/timeComplexity-bfs.mdx'))
const CodeSnippetDfs = lazy(() => import('./sections/codeSnippet-dfs.mdx'))

export default async function Problem200NumberOfIslands() {
  return (
    <AgentCard
      id="200-number-of-islands"
      title="Number of Islands"
      difficulty="medium"
      topics={["dfs","bfs"]}
      solutionFiles={["iterative-dfs.py","bfs.py","dfs.py"]}
      defaultFile="iterative-dfs.py"
      fileSectionMap={{"iterative-dfs.py":["definition","codeSnippet"],"bfs.py":["definition","codeSnippet","intuition","timeComplexity"],"dfs.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/number-of-islands"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="iterative-dfs.py">
          <CodeSnippetIterativeDfs />
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

        <AgentSection section="codeSnippet" file="dfs.py">
          <CodeSnippetDfs />
        </AgentSection>
    </AgentCard>
  )
}
