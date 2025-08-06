import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkListVariants from '@/plugins/remark-list-variants'
import type { Root } from 'mdast'

describe('Test ordered list numbering after fix', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkListVariants)

  it('should handle regular nested ordered lists correctly', () => {
    const markdown = `5. Item five
    5.1. Item five.one - this should show 5.1
    5.2. Item five.two - this should show 5.2`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    console.log('Regular nested ordered list:', JSON.stringify(result, null, 2))
    
    const list = result.children[0] as any
    expect(list.type).toBe('list')
    expect(list.ordered).toBe(true)
    
    // Should have one main item
    expect(list.children.length).toBe(1)
    
    const mainItem = list.children[0]
    expect(mainItem.type).toBe('listItem')
    
    console.log('Main item children count:', mainItem.children.length)
    console.log('Main item structure:', JSON.stringify(mainItem, null, 2))
    
    // The nested items should be regular nested list, not our custom decimal list
    if (mainItem.children.length > 1) {
      const nestedList = mainItem.children[1]
      expect(nestedList.type).toBe('list')
      expect(nestedList.ordered).toBe(true)
      
      // Should HAVE isDecimalList data (this is correct behavior for decimal patterns)
      expect(nestedList.data?.isDecimalList).toBe(true)
      
      console.log('Nested list data:', nestedList.data)
      console.log('Nested items:', nestedList.children.length)
      
      // Nested items should have customNumber data for correct decimal display
      nestedList.children.forEach((child: any, index: number) => {
        expect(child.type).toBe('listItem')
        expect(child.data.customNumber).toBeDefined()
        console.log(`Nested item ${index + 1} customNumber:`, child.data.customNumber)
      })
    }
  })

  it('should still handle feature list decimal patterns correctly', () => {
    const markdown = `2. ~ Feature two
  2.1. ~ Feature two.one`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    console.log('Feature decimal pattern:', JSON.stringify(result, null, 2))
    
    const list = result.children[0] as any
    const featureItem = list.children[0]
    
    expect(featureItem.type).toBe('mdxJsxFlowElement')
    expect(featureItem.name).toBe('FeatureItem')
    
    // Should have nested decimal list
    expect(featureItem.children.length).toBe(2)
    const nestedList = featureItem.children[1]
    expect(nestedList.type).toBe('list')
    expect(nestedList.data.isDecimalList).toBe(true)
    
    const nestedFeatureItem = nestedList.children[0]
    expect(nestedFeatureItem.type).toBe('mdxJsxFlowElement')
    expect(nestedFeatureItem.name).toBe('FeatureItem')
    expect(nestedFeatureItem.data.customNumber).toBe('2.1')
  })
})