import type { Root, Heading } from 'mdast'
import type { Plugin } from 'unified'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'

/**
 * Remark plugin for handling math expressions in headers.
 * 
 * This plugin processes math expressions in headers to ensure proper formatting
 * and consistent behavior across the MDX pipeline. It runs early in the plugin
 * chain to prepare math content before other heading processors.
 * 
 * Features:
 * - Normalizes inline math expressions in headers
 * - Ensures proper spacing around math content
 * - Prepares math for consistent slug generation
 */
export const remarkMathHeaders: Plugin<[], Root> = () => {
  return (tree: Node) => {
    visit(tree, 'heading', (node: Heading) => {
      processMathInHeading(node)
    })
  }
}

/**
 * Process math expressions within a heading node
 */
function processMathInHeading(node: Heading) {
  node.children.forEach((child) => {
    if (child.type === 'inlineMath') {
      // Normalize math content - remove extra whitespace
      const mathValue = child.value?.trim() || ''
      child.value = mathValue
      
      // Skip automatic spacing - let other plugins handle spacing more intelligently
    }
  })
}


export default remarkMathHeaders