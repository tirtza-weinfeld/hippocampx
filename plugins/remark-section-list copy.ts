import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, List } from 'mdast'

// Marking plugin that detects lists in Problem intuition sections
// Adds data-item-type="problem-intuition" attribute to list items
// Does NOT transform - only marks for remark-list-variants to handle
export const remarkSectionList: Plugin<[], Root> = () => {
  
  // Function to check if a node is a section with data-section-type
  const getSectionType = (node: any): string | null => {
    if (node.type === 'mdxJsxFlowElement') {
      // Check attributes array for data-section-type
      const dataSectionType = node.attributes?.find((attr: any) => 
        attr.name === 'data-section-type'
      )
      if (dataSectionType) {
        return dataSectionType.value
      }
    }
    return null
  }
  
  // Return transformer function that processes the tree
  const transformer = (tree: Root) => {
    // Find all sections with data-section-type and mark their lists
    visit(tree, 'mdxJsxFlowElement', (sectionNode: any) => {
      const sectionType = getSectionType(sectionNode)
      
      if (sectionType && sectionNode.children) {
        // Check if this is a Problem intuition section
        if (sectionType === 'problem-intuition') {
          // Find all lists within this section and mark them
          visit(sectionNode, 'list', (listNode: List) => {
            // Mark each list item with problem-intuition type
            listNode.children.forEach((listItem) => {
              if (!listItem.data) listItem.data = {}
              if (!listItem.data.hProperties) listItem.data.hProperties = {}
              
              // Add data-item-type attribute for remark-list-variants to process
              listItem.data.hProperties['data-item-type'] = 'problem-intuition'
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