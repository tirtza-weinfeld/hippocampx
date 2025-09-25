import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import type { Root, List } from 'mdast'
import { remarkSectionList } from '@/plugins/remark-section-list'

// Test helper to process MDX content
const processMarkdown = async (content: string) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkSectionList)
  
  const tree = processor.parse(content)
  return processor.run(tree)
}

// Helper to find lists in AST
const findLists = (tree: Root): List[] => {
  const lists: List[] = []
  
  const visit = (node: any) => {
    if (node.type === 'list') {
      lists.push(node)
    }
    if (node.children) {
      node.children.forEach(visit)
    }
  }
  
  visit(tree)
  return lists
}

describe('remark-section-list plugin', () => {
  it('should add data attributes to lists in problem-intuition sections', async () => {
    const content = `
<section data-section-type="problem-intuition">

- First intuition point
- Second intuition point

</section>
    `
    
    const tree = await processMarkdown(content) as Root
    const lists = findLists(tree)
    
    expect(lists).toHaveLength(1)
    expect(lists[0].data?.hProperties?.['data-section-list-type']).toBe('problem-intuition')
  })

  it('should add data attributes to lists in problem-topics sections', async () => {
    const content = `
<section data-section-type="problem-topics">

- Topic one
- Topic two
- Topic three

</section>
    `
    
    const tree = await processMarkdown(content) as Root
    const lists = findLists(tree)
    
    expect(lists).toHaveLength(1)
    expect(lists[0].data?.hProperties?.['data-section-list-type']).toBe('problem-topics')
  })

  it('should not modify lists outside of known sections', async () => {
    const content = `
<section data-section-type="unknown-section">

- Regular list item
- Another item

</section>

<section>

- List without section type
- Another item

</section>

- Standalone list item
- Another standalone item
    `
    
    const tree = await processMarkdown(content) as Root
    const lists = findLists(tree)
    
    expect(lists).toHaveLength(3)
    
    // None of the lists should have data attributes
    lists.forEach(list => {
      expect(list.data?.hProperties?.['data-section-list-type']).toBeUndefined()
    })
  })

  it('should handle multiple lists in the same section', async () => {
    const content = `
<section data-section-type="problem-intuition">

First list:
- Point one
- Point two

Second list:
- Point three  
- Point four

</section>
    `
    
    const tree = await processMarkdown(content) as Root
    const lists = findLists(tree)
    
    expect(lists).toHaveLength(2)
    lists.forEach(list => {
      expect(list.data?.hProperties?.['data-section-list-type']).toBe('problem-intuition')
    })
  })

  it('should handle nested sections correctly', async () => {
    const content = `
<section data-section-type="problem-intuition">

- Outer list item

<section data-section-type="problem-topics">

- Inner list item
- Another inner item

</section>

- Back to outer list

</section>
    `
    
    const tree = await processMarkdown(content) as Root
    const lists = findLists(tree)
    
    expect(lists).toHaveLength(2)
    
    // Both lists should be marked as problem-intuition and problem-topics respectively
    const listTypes = lists.map(list => list.data?.hProperties?.['data-section-list-type'])
    expect(listTypes).toContain('problem-intuition')
    expect(listTypes).toContain('problem-topics')
  })

  it('should handle ordered lists in sections', async () => {
    const content = `
<section data-section-type="problem-intuition">

1. First step
2. Second step
3. Third step

</section>
    `
    
    const tree = await processMarkdown(content) as Root
    const lists = findLists(tree)
    
    expect(lists).toHaveLength(1)
    expect(lists[0].ordered).toBe(true)
    expect(lists[0].data?.hProperties?.['data-section-list-type']).toBe('problem-intuition')
  })

  it('should only process known custom list components', async () => {
    const content = `
<section data-section-type="unknown-custom-type">

- This should not get marked
- Because component does not exist

</section>
    `
    
    const tree = await processMarkdown(content) as Root
    const lists = findLists(tree)
    
    expect(lists).toHaveLength(1)
    expect(lists[0].data?.hProperties?.['data-section-list-type']).toBeUndefined()
  })

  it('should properly convert kebab-case section types to component names', async () => {
    // This test verifies the internal logic by testing with known components
    const content = `
<section data-section-type="problem-intuition">

- Should be marked because ProblemIntuitionList exists

</section>

<section data-section-type="problem-topics">

- Should be marked because ProblemTopicsList exists

</section>
    `
    
    const tree = await processMarkdown(content) as Root
    const lists = findLists(tree)
    
    expect(lists).toHaveLength(2)
    expect(lists[0].data?.hProperties?.['data-section-list-type']).toBe('problem-intuition')
    expect(lists[1].data?.hProperties?.['data-section-list-type']).toBe('problem-topics')
  })

  it('should handle empty sections without errors', async () => {
    const content = `
<section data-section-type="problem-intuition">

</section>
    `
    
    const tree = await processMarkdown(content) as Root
    const lists = findLists(tree)
    
    expect(lists).toHaveLength(0)
  })
})