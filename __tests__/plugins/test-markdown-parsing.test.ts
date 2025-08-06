import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { Root } from '@types/mdast'

describe('markdown parsing test', () => {
  const processor = unified().use(remarkParse)

  it('should see how normal indented lists are parsed', () => {
    const markdown = `- Feature one
  - Nested feature
- Feature two`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root

    console.log('Normal indented list AST:', JSON.stringify(result, null, 2))
  })

  it('should see how tilde lines are parsed', () => {
    const markdown = `~ Feature one
  ~ Nested feature
~ Feature two`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root

    console.log('Tilde lines AST:', JSON.stringify(result, null, 2))
  })
})