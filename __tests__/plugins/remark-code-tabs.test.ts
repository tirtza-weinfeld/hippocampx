import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import type { Root } from 'mdast'
import remarkCodeTabs from '@/plugins/remark-code-tabs'
import { VFile } from 'vfile'
import { describe, it, expect } from 'vitest'

function processMarkdown(content: string): Root {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkCodeTabs)

  const file = new VFile({ value: content })
  const tree = processor.parse(file) as Root
  return processor.runSync(tree, file) as Root
}

function findJSXElements(tree: Root, name?: string): any[] {
  const elements: any[] = []

  function visit(node: any) {
    if (node.type === 'mdxJsxFlowElement' && (!name || node.name === name)) {
      elements.push(node)
    }
    if (node.children) {
      node.children.forEach(visit)
    }
  }

  visit(tree)
  return elements
}

describe('remark-code-tabs plugin', () => {
  it('should transform [!CodeTabs] heading into CodeTabs with CodeTabsList and CodeTab children', () => {
    const content = `### [!CodeTabs] Code Snippet

\`\`\`python meta="source=problems/347-top-k-frequent-elements/heap.py"
def topKFrequent(nums, k):
    pass
\`\`\`

\`\`\`python meta="source=problems/347-top-k-frequent-elements/heap-nlargest.py"
def topKFrequent2(nums, k):
    pass
\`\`\`
`

    const tree = processMarkdown(content)
    console.log('Full tree:', JSON.stringify(tree, null, 2))

    const codeTabs = findJSXElements(tree, 'CodeTabs')

    expect(codeTabs).toHaveLength(1)

    const codeTabsNode = codeTabs[0]
    console.log('CodeTabs node:', JSON.stringify(codeTabsNode, null, 2))

    // Check defaultFile attribute
    const defaultFileAttr = codeTabsNode.attributes.find((a: any) => a.name === 'defaultFile')
    expect(defaultFileAttr?.value).toBe('heap.py')

    // Check children: should have CodeTabsList + 2 CodeTab components
    expect(codeTabsNode.children).toHaveLength(3)

    // First child should be CodeTabsList
    const codeTabsList = codeTabsNode.children[0]
    expect(codeTabsList.name).toBe('CodeTabsList')

    // CodeTabsList should have 2 CodeTabTrigger children
    expect(codeTabsList.children).toHaveLength(2)
    expect(codeTabsList.children[0].name).toBe('CodeTabTrigger')
    expect(codeTabsList.children[1].name).toBe('CodeTabTrigger')

    // Check CodeTabTrigger file attributes
    const trigger1FileAttr = codeTabsList.children[0].attributes.find((a: any) => a.name === 'file')
    expect(trigger1FileAttr?.value).toBe('heap.py')

    const trigger2FileAttr = codeTabsList.children[1].attributes.find((a: any) => a.name === 'file')
    expect(trigger2FileAttr?.value).toBe('heap-nlargest.py')

    // Remaining children should be CodeTab components
    expect(codeTabsNode.children[1].name).toBe('CodeTab')
    expect(codeTabsNode.children[2].name).toBe('CodeTab')

    // Check CodeTab file attributes
    const codeTab1FileAttr = codeTabsNode.children[1].attributes.find((a: any) => a.name === 'file')
    expect(codeTab1FileAttr?.value).toBe('heap.py')

    const codeTab2FileAttr = codeTabsNode.children[2].attributes.find((a: any) => a.name === 'file')
    expect(codeTab2FileAttr?.value).toBe('heap-nlargest.py')

    // Check that code blocks are inside CodeTab children
    expect(codeTabsNode.children[1].children[0].type).toBe('code')
    expect(codeTabsNode.children[2].children[0].type).toBe('code')
  })

  it('should preserve heading text after [!CodeTabs] marker', () => {
    const content = `### [!CodeTabs] Code Snippet

\`\`\`python meta="source=problems/test.py"
def test():
    pass
\`\`\`
`

    const tree = processMarkdown(content)

    // Find the heading node
    const headings: any[] = []
    function findHeadings(node: any) {
      if (node.type === 'heading') {
        headings.push(node)
      }
      if (node.children) {
        node.children.forEach(findHeadings)
      }
    }
    findHeadings(tree)

    // Should have preserved heading with text "Code Snippet"
    expect(headings).toHaveLength(1)
    expect(headings[0].depth).toBe(3)
    expect(headings[0].children).toHaveLength(1)
    expect(headings[0].children[0].type).toBe('text')
    expect(headings[0].children[0].value).toBe('Code Snippet')
  })

  it('should not preserve heading when only [!CodeTabs] marker exists', () => {
    const content = `### [!CodeTabs]

\`\`\`python meta="source=problems/test.py"
def test():
    pass
\`\`\`
`

    const tree = processMarkdown(content)

    // Find headings
    const headings: any[] = []
    function findHeadings(node: any) {
      if (node.type === 'heading') {
        headings.push(node)
      }
      if (node.children) {
        node.children.forEach(findHeadings)
      }
    }
    findHeadings(tree)

    // Should not have any preserved heading (marker only, no text)
    expect(headings).toHaveLength(0)
  })
})
