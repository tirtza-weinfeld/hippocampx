import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, List, Heading, Parent } from 'mdast'
import type { Node } from 'unist'
import { extractTextFromHeading } from './mdx-text-extraction.js'


// Map component names to section types for data-item-type attribute
const COMPONENT_TO_SECTION_TYPE: Record<string, string> = {
  'ProblemIntuition': 'problem-intuition',
  // Add more mappings as needed
}


// Marking plugin that detects lists in specific sections BEFORE they're wrapped
// Adds data-item-type attribute to list items
// Does NOT transform - only marks for remark-list-variants to handle
// Must run BEFORE remark-section-wrapper in the plugin chain
export const remarkSectionList: Plugin<[], Root> = () => {

  // Extract component name from heading directive like [!(ProblemIntuition)] or [!collapsible(ProblemIntuition)]
  function extractComponentName(headingText: string): string | null {
    const match = headingText.match(/^\[!(?:collapsible)?(?::expand)?\(([^)]+)\)\]/)
    return match ? match[1] : null
  }

  // Extract content between current heading and next same/higher level heading
  function extractSectionContent(parent: Parent, headingIndex: number, currentDepth: number): Node[] {
    const content: Node[] = []
    let i = headingIndex + 1

    while (i < parent.children.length) {
      const node = parent.children[i]

      // Stop at next heading of same or higher level
      if (node.type === 'heading' && (node as Heading).depth <= currentDepth) {
        break
      }

      content.push(node)
      i++
    }

    return content
  }

  // Return transformer function that processes the tree
  const transformer = (tree: Root) => {
    // Find all headings with component directives and mark lists in their content
    visit(tree, 'heading', (node: Heading, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined) return

      // Extract heading text to check for component directive
      const headingText = extractTextFromHeading(node)
      const componentName = extractComponentName(headingText)

      if (!componentName) return

      // Check if this component name is mapped to a section type we care about
      const sectionType = COMPONENT_TO_SECTION_TYPE[componentName]
      if (!sectionType) return

      // Extract content that will be wrapped in this section
      const content = extractSectionContent(parent, index, node.depth)

      // Find all lists in the content and mark their items
      content.forEach(contentNode => {
        if (contentNode.type === 'list') {
          const listNode = contentNode as List
          listNode.children.forEach((listItem) => {
            if (!listItem.data) listItem.data = {}
            if (!listItem.data.hProperties) listItem.data.hProperties = {}

            // Add data-item-type attribute for remark-list-variants to process
            listItem.data.hProperties['data-item-type'] = sectionType
          })
        }
      })
    })
  }

  return transformer
}

export default remarkSectionList