import type { Plugin } from 'unified'
import type { Node, Parent } from 'unist'
import type { Heading } from 'mdast'
import { visit } from 'unist-util-visit'

export const remarkHeaders: Plugin = () => (tree: Node) => {
  // Build parent-child map first
  const parentMap = new WeakMap<Node, Parent>()
  
  visit(tree, (node: Node, index: number | undefined, parent: Parent | undefined) => {
    if (parent) {
      parentMap.set(node, parent)
    }
  })
  
  // Now process headings with parent context
  visit(tree, 'heading', (node: Heading, index: number | undefined, parent: Parent | undefined) => {
    if (!parent || index === undefined) return
    
    // Find if this heading is inside a problem wrapper
    const problemWrapper = findProblemWrapper(node, parentMap)
    if (!problemWrapper) return
    
    const problemType = problemWrapper.data?.hProperties?.['data-problem']
    if (!problemType) return
    
    // Add problem type to heading's data properties
    if (!node.data) node.data = {}
    if (!node.data.hProperties) node.data.hProperties = {}
    node.data.hProperties['data-problem'] = problemType
  })
}

function findProblemWrapper(node: Node, parentMap: WeakMap<Node, Parent>): any {
  // Walk up the tree to find a problem wrapper
  let current: Node | undefined = node
  while (current) {
    if (
      current.type === 'paragraph' &&
      (current.data as any)?.hProperties?.['data-problem']
    ) {
      return current
    }
    current = parentMap.get(current)
  }
  return null
}

