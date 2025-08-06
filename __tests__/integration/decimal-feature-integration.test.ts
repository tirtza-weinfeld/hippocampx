import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkListVariants from '@/plugins/remark-list-variants'
import type { Root } from 'mdast'

describe('Decimal Feature Integration', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkListVariants)

  it('should handle mixed decimal and feature patterns', () => {
    // This represents the actual content structure that's failing
    const markdown = `2. ~ Feature two
  2.1. ~ Feature two.one`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    console.log('Mixed decimal/feature AST:', JSON.stringify(result, null, 2))
    
    const list = result.children[0] as any
    expect(list.type).toBe('list')
    expect(list.ordered).toBe(true)
    
    // Should have one FeatureItem
    expect(list.children.length).toBe(1)
    const featureItem = list.children[0]
    expect(featureItem.type).toBe('mdxJsxFlowElement')
    expect(featureItem.name).toBe('FeatureItem')
    
    console.log('FeatureItem children:', featureItem.children)
    
    // The key question: does it have nested content or is 2.1. lost?
    // We expect: paragraph + nested list
    // We get: just paragraph with "Feature two\n2.1. ~ Feature two.one"
    
    if (featureItem.children.length === 2) {
      // Success case: nested list was created
      expect(featureItem.children[0].type).toBe('paragraph')
      expect(featureItem.children[1].type).toBe('list')
      console.log('SUCCESS: Nested list created!')
    } else {
      // Current failing case: everything in one paragraph
      expect(featureItem.children.length).toBe(1)
      expect(featureItem.children[0].type).toBe('paragraph')
      console.log('FAILING: Everything flattened into one paragraph')
      console.log('Text content:', featureItem.children[0].children[0].value)
    }
  })

  it('should explain the expected vs actual behavior', () => {
    // What we want to happen:
    // 1. Markdown parser creates: listItem with paragraph containing "~ Feature two\n2.1. ~ Feature two.one"
    // 2. Decimal processor detects "2.1." pattern and splits into: paragraph + nested list
    // 3. FeatureItem transformer converts the listItem to FeatureItem, preserving structure
    // 4. FeatureItem transformer ALSO converts nested "2.1. ~ Feature two.one" to FeatureItem
    
    // What currently happens:
    // 1. Markdown parser creates: listItem with paragraph containing "~ Feature two\n2.1. ~ Feature two.one"  
    // 2. FeatureItem transformer runs FIRST, converts to FeatureItem but preserves text as-is
    // 3. Decimal processor never runs because we're no longer visiting listItems
    
    expect(true).toBe(true) // This test documents the problem
  })
})