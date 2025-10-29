import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const IntuitionSolution = lazy(() => import('./sections/intuition-solution.mdx'))
const TimeComplexitySolution = lazy(() => import('./sections/timeComplexity-solution.mdx'))
const CodeSnippetSimilar = lazy(() => import('./sections/codeSnippet-similar.mdx'))

export default async function Problem102BinaryTreeLevelOrderTraversal() {
  return (
    <AgentCard
      id="102-binary-tree-level-order-traversal"
      title="Binary Tree Level Order Traversal"
      difficulty="medium"
      topics={["binary-tree","bfs"]}
      solutionFiles={["solution.py","similar.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","intuition","timeComplexity"],"similar.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/binary-tree-level-order-traversal"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>

        <AgentSection section="intuition" file="solution.py">
          <IntuitionSolution />
        </AgentSection>

        <AgentSection section="timeComplexity" file="solution.py">
          <TimeComplexitySolution />
        </AgentSection>

        <AgentSection section="codeSnippet" file="similar.py">
          <CodeSnippetSimilar />
        </AgentSection>
    </AgentCard>
  )
}
