import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { Root } from 'mdast'

describe('Debug decimal parsing', () => {
  const processor = unified().use(remarkParse)

  it('should show how decimal numbered lists parse', () => {
    const markdown = `1. ~ Feature one
2. ~ Feature two
  2.1. ~ Feature two.one
3. ~ Feature three`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    console.log('Decimal list raw parse:', JSON.stringify(result, null, 2))
    
    const list = result.children[0] as any
    console.log('List has', list.children.length, 'items')
    
    const secondItem = list.children[1]
    console.log('Second item children:', secondItem.children.length)
    
    secondItem.children.forEach((child: any, index: number) => {
      console.log(`Child ${index}:`, child.type, child.type === 'paragraph' ? child.children[0].value : '')
    })
  })

  it('should check different indentation styles', () => {
    const markdown1 = `2. ~ Feature two
   2.1. ~ Feature two.one`

    const markdown2 = `2. ~ Feature two
  2.1. ~ Feature two.one`
  
    const markdown3 = `2. ~ Feature two
    2.1. ~ Feature two.one`

    console.log('\n=== 3 spaces ===')
    const result1 = processor.runSync(processor.parse(markdown1)) as Root
    console.log(JSON.stringify(result1.children[0], null, 2))
    
    console.log('\n=== 2 spaces ===')
    const result2 = processor.runSync(processor.parse(markdown2)) as Root  
    console.log(JSON.stringify(result2.children[0], null, 2))
    
    console.log('\n=== 4 spaces ===')
    const result3 = processor.runSync(processor.parse(markdown3)) as Root
    console.log(JSON.stringify(result3.children[0], null, 2))
  })
})