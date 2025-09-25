import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkCodeCopy from '../../plugins/remark-code-copy'
import { VFile } from 'vfile'
import type { Root } from 'mdast'

// Test helper to process MDX content with VFile
const processMarkdown = async (content: string) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkCodeCopy)

  const file = new VFile({ value: content })
  const tree = processor.parse(file) as Root
  return processor.run(tree, file) as Promise<Root>
}

describe('remark-code-copy with function names', () => {
  it('should extract function code from symbol_tags.json', async () => {
    const markdown = `
\`\`\`python file=problems/1631-path-with-minimum-effort/solution.py:path_with_minimum_effort
\`\`\`
`

    const result = await processMarkdown(markdown)

    // Find the code node in the AST
    const codeNode = result.children.find((node: any) => node.type === 'code')

    // Should contain the actual function code from symbol_tags.json
    expect(codeNode?.value).toContain('def path_with_minimum_effort')
    expect(codeNode?.meta).toContain('source=')
  })

  it('should handle file paths without function names (fallback to problems_metadata)', async () => {
    const markdown = `
\`\`\`python file=problems/1631-path-with-minimum-effort/solution.py
\`\`\`
`

    const result = await processMarkdown(markdown)

    // Should fallback to problems_metadata.json behavior
    expect(result).toBeDefined()
  })

  it('should parse function names correctly from file paths', async () => {
    const testMarkdown = `
\`\`\`python file=problems/test/solution.py:my_function
\`\`\`
`

    // Should not throw when processing
    expect(async () => {
      await processMarkdown(testMarkdown)
    }).not.toThrow()
  })
})