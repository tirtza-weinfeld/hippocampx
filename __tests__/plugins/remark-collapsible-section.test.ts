import { describe, test, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { remarkCollapsibleSection } from '@/plugins/remark-collapsible-section'
import type { Root } from 'mdast'

function processMarkdown(markdown: string): Root {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkCollapsibleSection)

  const result = processor.parse(markdown)
  processor.runSync(result)

  return result as Root
}

describe('remarkCollapsibleSection', () => {
  test('transforms [!Collapsible] heading into collapsible section', () => {
    const markdown = `## [!Collapsible] Test Title

Content here`

    const result = processMarkdown(markdown)

    // Find the collapsible section in the AST
    const collapsibleSection = result.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSection'
    )

    expect(collapsibleSection).toBeDefined()
    expect(collapsibleSection).toMatchObject({
      type: 'mdxJsxFlowElement',
      name: 'CollapsibleSection',
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'defaultOpen',
          value: 'false'
        }
      ]
    })
  })

  test('creates CollapsibleSectionHeader with correct props', () => {
    const markdown = `## [!Collapsible] My Collapsible Section

Some content`

    const result = processMarkdown(markdown)

    const collapsibleSection = result.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSection'
    ) as any

    expect(collapsibleSection).toBeDefined()

    const header = collapsibleSection.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSectionHeader'
    )

    expect(header).toBeDefined()
    expect(header.attributes).toContainEqual({
      type: 'mdxJsxAttribute',
      name: 'as',
      value: 'h2'
    })
    expect(header.attributes).toContainEqual({
      type: 'mdxJsxAttribute',
      name: 'level',
      value: '2'
    })

    // Check that header has text content
    const textNode = header.children.find((child: any) => child.type === 'text')
    expect(textNode).toBeDefined()
    expect(textNode.value).toBe('My Collapsible Section')
  })

  test('creates CollapsibleSectionContent with section content', () => {
    const markdown = `## [!Collapsible] Title

Paragraph 1

Paragraph 2`

    const result = processMarkdown(markdown)

    const collapsibleSection = result.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSection'
    ) as any

    const content = collapsibleSection.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSectionContent'
    )

    expect(content).toBeDefined()
    expect(content.children.length).toBeGreaterThan(0)
  })

  test('generates slug ID from heading text', () => {
    const markdown = `## [!Collapsible] Section With Spaces

Content`

    const result = processMarkdown(markdown)

    const collapsibleSection = result.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSection'
    ) as any

    const header = collapsibleSection.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSectionHeader'
    )

    const idAttribute = header.attributes.find((attr: any) => attr.name === 'id')
    expect(idAttribute).toBeDefined()
    expect(idAttribute.value).toBe('section-with-spaces')
  })

  test('does not transform headings without [!Collapsible] marker', () => {
    const markdown = `## Regular Heading

Content`

    const result = processMarkdown(markdown)

    const collapsibleSection = result.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSection'
    )

    expect(collapsibleSection).toBeUndefined()

    // Regular heading should still exist
    const heading = result.children.find((node: any) => node.type === 'heading')
    expect(heading).toBeDefined()
  })

  test('handles different heading levels', () => {
    const markdown = `### [!Collapsible] H3 Collapsible

Content`

    const result = processMarkdown(markdown)

    const collapsibleSection = result.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSection'
    ) as any

    const header = collapsibleSection.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSectionHeader'
    )

    expect(header.attributes).toContainEqual({
      type: 'mdxJsxAttribute',
      name: 'as',
      value: 'h3'
    })
    expect(header.attributes).toContainEqual({
      type: 'mdxJsxAttribute',
      name: 'level',
      value: '3'
    })
  })

  test('captures content until next heading of same or higher level', () => {
    const markdown = `## [!Collapsible] Section 1

Paragraph 1

### Subsection

Subsection content

## Next Section

Other content`

    const result = processMarkdown(markdown)

    const collapsibleSection = result.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSection'
    ) as any

    const content = collapsibleSection.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSectionContent'
    )

    // Should contain paragraph, subsection heading, and subsection content
    expect(content.children.length).toBeGreaterThan(1)

    // Verify subsection heading is included
    const subsectionHeading = content.children.find(
      (node: any) => node.type === 'heading' && node.depth === 3
    )
    expect(subsectionHeading).toBeDefined()
  })

  test('removes [!Collapsible] marker from heading text', () => {
    const markdown = `## [!Collapsible] Clean Title

Content`

    const result = processMarkdown(markdown)

    const collapsibleSection = result.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSection'
    ) as any

    const header = collapsibleSection.children.find(
      (node: any) => node.type === 'mdxJsxFlowElement' && node.name === 'CollapsibleSectionHeader'
    )

    const textNode = header.children.find((child: any) => child.type === 'text')
    expect(textNode.value).toBe('Clean Title')
    expect(textNode.value).not.toContain('[!Collapsible]')
  })
})
