import React, { Suspense } from 'react'
import CodeBlock, { CodeBlockSkeleton } from '@/components/mdx/code/code-block'

/**
 * Normalize code by cleaning up excessive newlines
 * Converts 3+ consecutive newlines to 2 newlines (1 blank line)
 */
function normalizeCode(code: string): string {
  return code.trim().replace(/\n{3,}/g, '\n\n')
}

/**
 * Server component that pre-renders CodeBlocks for problem solutions.
 * This allows CodeBlock (async server component) to be used within client components
 * via the composition pattern.
 */
export async function ProblemSolutionsServer({ code, meta, }: { code: string, meta: string }) {

  const cleanedCode = normalizeCode(code)

  return (
    <Suspense fallback={<CodeBlockSkeleton />}>
      <CodeBlock className="language-python" meta={meta}>
        {cleanedCode}
      </CodeBlock>
    </Suspense>
  )

}
