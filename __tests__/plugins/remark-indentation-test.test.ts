import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkListVariants from '@/plugins/remark-list-variants'
import type { Root, Paragraph, Text } from 'mdast'

describe('indentation preservation test', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkListVariants)

  it('should preserve indentation in raw markdown text', () => {
    // Test with actual preserved indentation
    const markdownWithIndentation = `~ Feature one
  ~ Nested feature
~ Feature two`

    console.log('Original markdown:', JSON.stringify(markdownWithIndentation))
    
    const tree = processor.parse(markdownWithIndentation)
    console.log('Parsed tree before plugin:', JSON.stringify(tree, null, 2))

    // Check what the paragraph contains
    const paragraph = tree.children[0] as Paragraph
    const textNode = paragraph.children[0] as Text
    console.log('Text node value:', JSON.stringify(textNode.value))
    
    const result = processor.runSync(tree) as Root
    console.log('Final result:', JSON.stringify(result, null, 2))
  })
})