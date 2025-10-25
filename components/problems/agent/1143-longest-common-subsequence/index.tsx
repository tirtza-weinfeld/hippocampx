import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetTopDownSuffix = lazy(() => import('./sections/codeSnippet-top-down-suffix.mdx'))
const CodeSnippetBottomUpSuffix = lazy(() => import('./sections/codeSnippet-bottom-up-suffix.mdx'))
const CodeSnippetBottomUpPrefix1d = lazy(() => import('./sections/codeSnippet-bottom-up-prefix-1d.mdx'))

export default async function Problem1143LongestCommonSubsequence() {
  return (
    <AgentCard
      id="1143-longest-common-subsequence"
      title="Longest Common Subsequence"
      difficulty="medium"
      topics={["dynamic-programming"]}
      solutionFiles={["top-down-suffix.py","bottom-up-suffix.py","bottom-up-prefix-1d.py"]}
      defaultFile="top-down-suffix.py"
      fileSectionMap={{"top-down-suffix.py":["definition","codeSnippet"],"bottom-up-suffix.py":["definition","codeSnippet"],"bottom-up-prefix-1d.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/longest-common-subsequence"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="top-down-suffix.py">
          <CodeSnippetTopDownSuffix />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bottom-up-suffix.py">
          <CodeSnippetBottomUpSuffix />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bottom-up-prefix-1d.py">
          <CodeSnippetBottomUpPrefix1d />
        </AgentSection>
    </AgentCard>
  )
}
