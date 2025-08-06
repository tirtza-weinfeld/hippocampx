import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { Root } from 'mdast'

describe('Debug nested feature parsing', () => {
  const processor = unified().use(remarkParse)

  it('should show how nested feature items are parsed BEFORE plugin transformation', () => {
    const markdown = `- ~ Feature one
- ~ Feature two
  - ~ Feature two.one
- ~ Feature three`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    console.log('Raw markdown AST (before plugin):', JSON.stringify(result, null, 2))
    
    const list = result.children[0] as any
    console.log('List has', list.children.length, 'top-level items')
    
    // Check the second item which should have the nested content
    const secondItem = list.children[1]
    console.log('Second item structure:', JSON.stringify(secondItem, null, 2))
    
    // Look for nested lists
    secondItem.children.forEach((child: any, index: number) => {
      console.log(`Second item child ${index}:`, child.type)
      if (child.type === 'list') {
        console.log('Found nested list with', child.children.length, 'items')
        child.children.forEach((nestedItem: any, nestedIndex: number) => {
          console.log(`Nested item ${nestedIndex}:`, JSON.stringify(nestedItem, null, 2))
        })
      }
    })
  })
})