import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { Root } from 'mdast'

describe('Nested List Structure', () => {
  const processor = unified().use(remarkParse)

  it('should show how properly nested unordered lists parse', () => {
    const markdown = `- Binary searching the answer space, (the eating speed \`k\`)
    - hi
        - hi2 
        - hi3
        - hi4
            - hi5
                - hi6
                    - hi7
                        - hi8

- hi-1
    - hi-1.1`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    console.log('Nested unordered list raw parse:', JSON.stringify(result, null, 2))
    
    // Count total lists
    const lists = result.children.filter(child => child.type === 'list')
    console.log('Total lists found:', lists.length)
    
    lists.forEach((list, index) => {
      console.log(`List ${index}:`, {
        ordered: list.ordered,
        children: list.children.length,
        start: (list as any).start
      })
    })
  })

  it('should show how properly nested ordered lists parse', () => {
    const markdown = `1. First level
    1.1. Second level
        1.1.1. Third level
            1.1.1.1. Fourth level
2. Back to first level
    2.1. Second level again`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    console.log('Nested ordered list raw parse:', JSON.stringify(result, null, 2))
    
    // Count total lists
    const lists = result.children.filter(child => child.type === 'list')
    console.log('Total lists found:', lists.length)
    
    lists.forEach((list, index) => {
      console.log(`List ${index}:`, {
        ordered: list.ordered,
        children: list.children.length,
        start: (list as any).start
      })
    })
  })

  it('should show mixed nested lists', () => {
    const markdown = `1. Ordered item
    - Unordered nested
        - More nested
2. Another ordered
    - More unordered`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    console.log('Mixed nested list raw parse:', JSON.stringify(result, null, 2))
    
    // Count total lists
    const lists = result.children.filter(child => child.type === 'list')
    console.log('Total lists found:', lists.length)
    
    lists.forEach((list, index) => {
      console.log(`List ${index}:`, {
        ordered: list.ordered,
        children: list.children.length,
        start: (list as any).start
      })
    })
  })
})
