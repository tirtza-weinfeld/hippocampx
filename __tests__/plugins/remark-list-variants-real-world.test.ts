import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkListVariants from '@/plugins/remark-list-variants'
import type { Root } from 'mdast'

describe('remark-list-variants - Real World Cases', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkListVariants)

  describe('Complex markdown content preservation', () => {
    it('should preserve complex markdown with tooltips and code in feature items', () => {
      const markdown = `- ~ A single shelf *[8:]starts* at a *[8:]reshelving basket* \`$🧺  _📘..._📕 👵$\` and *[2:]ends* right next to the *[2:]librarian's chair*.`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      console.log('Complex content AST:', JSON.stringify(result, null, 2))
      
      const list = result.children[0] as any
      expect(list.type).toBe('list')
      
      const featureItem = list.children[0]
      expect(featureItem.type).toBe('mdxJsxFlowElement')
      expect(featureItem.name).toBe('FeatureItem')
      
      // The paragraph should contain the complex markdown structure, not just plain text
      const paragraph = featureItem.children[0]
      expect(paragraph.type).toBe('paragraph')
      
      console.log('Complex paragraph children:', paragraph.children)
      
      // Should have multiple children: text, emphasis (with tooltips), inlineCode, etc.
      // NOT just a single text node
      expect(paragraph.children.length).toBeGreaterThan(1)
    })

    it('should handle ordered feature lists with nested items', () => {
      const markdown = `1. ~ Feature one
2. ~ Feature two
   2.1. ~ Feature two.one
3. ~ Feature three`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      console.log('Ordered nested AST:', JSON.stringify(result, null, 2))
      
      const list = result.children[0] as any
      expect(list.type).toBe('list')
      expect(list.ordered).toBe(true)
      
      // Should have 3 top-level items
      expect(list.children.length).toBe(3)
      
      // Check the second item has nested content
      const secondItem = list.children[1]
      expect(secondItem.type).toBe('mdxJsxFlowElement')
      expect(secondItem.name).toBe('FeatureItem')
      
      console.log('Second item children count:', secondItem.children.length)
      console.log('Second item structure:', JSON.stringify(secondItem, null, 2))
      
      // Should have paragraph + nested list
      expect(secondItem.children.length).toBe(2)
      expect(secondItem.children[1].type).toBe('list')
    })
  })

  describe('Exact page.mdx content', () => {
    it('should handle the unordered feature section exactly as written', () => {
      const markdown = `## Unordered Feature List

- ~ Feature one
- ~ Feature two
  - ~ Feature two.one
- ~ Feature three
- ~ Feature four
- ~ A single shelf *[8:]starts* at a *[8:]reshelving basket* \`$🧺  _📘..._📕 👵$\` and *[2:]ends* right next to the *[2:]librarian's chair*.
- ~ A single shelf *[8:]starts* at a *[8:]reshelving basket* \`$🧺  _📘..._📕 👵$\` and *[2:]ends* right next to the *[2:]librarian's chair*.`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      console.log('Full unordered section AST:', JSON.stringify(result, null, 2))
      
      const list = result.children.find(child => child.type === 'list') as any
      expect(list).toBeDefined()
      expect(list.ordered).toBe(false)
      
      console.log('Total feature items:', list.children.length)
      
      // Should have 6 feature items
      expect(list.children.length).toBe(6)
      
      // Check the complex content items (last two)
      const complexItem1 = list.children[4]
      const complexItem2 = list.children[5]
      
      console.log('Complex item 1 paragraph:', JSON.stringify(complexItem1.children[0], null, 2))
      console.log('Complex item 2 paragraph:', JSON.stringify(complexItem2.children[0], null, 2))
    })

    it('should handle the ordered feature section exactly as written', () => {
      const markdown = `## Ordered Feature List
1. ~ Feature one
2. ~ Feature two
  2.1. ~ Feature two.one
3. ~ Feature three
4. ~ Feature four
5. ~ A single shelf *[8:]starts* at a *[8:]reshelving basket* \`$🧺  _📘..._📕 👵$\` and *[2:]ends* right next to the *[2:]librarian's chair*.
6. ~ A single shelf *[8:]starts* at a *[8:]reshelving basket* \`$🧺  _📘..._📕 👵$\` and *[2:]ends* right next to the *[2:]librarian's chair*.`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      console.log('Full ordered section AST:', JSON.stringify(result, null, 2))
      
      const list = result.children.find(child => child.type === 'list') as any
      expect(list).toBeDefined()
      expect(list.ordered).toBe(true)
      
      console.log('Total ordered feature items:', list.children.length)
      
      // Should have 6 feature items
      expect(list.children.length).toBe(6)
      
      // Check the second item has nested decimal content
      const secondItem = list.children[1]
      console.log('Second ordered item structure:', JSON.stringify(secondItem, null, 2))
      
      // This should have the nested 2.1. item
      expect(secondItem.children.length).toBe(2)
    })
  })
})