import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, List } from 'mdast'
import type { Node } from 'unist'



interface MdxJsxAttribute {
  type: 'mdxJsxAttribute'
  name: string
  value: string | null
}

interface MdxJsxFlowElement extends Node {
  type: 'mdxJsxFlowElement'
  name: string
  attributes: MdxJsxAttribute[]
  children: Node[]
}

const SECTION_TYPES = new Set([
  'problem-intuition',
])


// Marking plugin that detects lists in Problem intuition sections
// Adds data-item-type="problem-intuition" attribute to list items
// Does NOT transform - only marks for remark-list-variants to handle
export const remarkSectionList: Plugin<[], Root> = () => {
  
  // Function to check if a node is a section with data-section-type
  const getSectionType = (node: Node): string | null => {
    if (node.type === 'mdxJsxFlowElement') {
      // Check attributes array for data-section-type
      const sectionNode = node as MdxJsxFlowElement
      const dataSectionType = sectionNode.attributes?.find((attr: MdxJsxAttribute) =>
        attr.name === 'data-section-type'
      )
      if (dataSectionType) {
        // console.log('dataSectionType', dataSectionType)
        return dataSectionType.value
      }
    }
    return null
  }
  
  // Return transformer function that processes the tree
  const transformer = (tree: Root) => {
    // Find all sections with data-section-type and mark their lists
    visit(tree, 'mdxJsxFlowElement', (sectionNode: Node) => {
      const sectionType = getSectionType(sectionNode)
      const section = sectionNode as MdxJsxFlowElement

      if (sectionType && section.children) {
        // Check if this is a Problem intuition section
        // if (sectionType === 'problem-intuition') {
        if (SECTION_TYPES.has(sectionType)) {
          // Find all lists within this section and mark them
          visit(section, 'list', (listNode: List) => {
            // Mark each list item with problem-intuition type
            listNode.children.forEach((listItem) => {
              if (!listItem.data) listItem.data = {}
              if (!listItem.data.hProperties) listItem.data.hProperties = {}
              
              // Add data-item-type attribute for remark-list-variants to process
              // listItem.data.hProperties['data-item-type'] = 'problem-intuition'
              listItem.data.hProperties['data-item-type'] = sectionType
            })
          })
        }
        // Add more section types here as needed:
        // else if (sectionType === 'some-other-section') {
        //   // Mark lists in other section types
        // }
      }
    })
  }

  return transformer
}

export default remarkSectionList