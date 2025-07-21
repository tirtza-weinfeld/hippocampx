import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
// NOTE: mdast types are deprecated or not found. Use unist types and minimal inline types for compatibility.
import type { Node, Parent } from 'unist'
// Minimal types for List, ListItem, Text, Paragraph
interface List extends Parent {
  type: 'list'
  ordered?: boolean
  children: ListItem[]
}
interface ListItem extends Parent {
  type: 'listItem'
  children: Paragraph[]
}
interface Paragraph extends Parent {
  type: 'paragraph'
  children: Text[]
}
interface Text extends Node {
  type: 'text'
  value: string
}

interface ListVariant {
  pattern: RegExp
  component: string
  prefixRemover?: RegExp
  attributes?: Array<{ name: string; value: string }>
}

// Modern list variant definitions
const LIST_VARIANTS: ListVariant[] = [
  {
    pattern: /^--\s+/,
    component: 'CompactList',
    prefixRemover: /^--\s*/,
  },
  {
    pattern: /^!!\s+/,
    component: 'FeatureList', 
    prefixRemover: /^!!\s*/,
  },
  {
    pattern: /^\+\+\s+/,
    component: 'TimelineList',
    prefixRemover: /^\+\+\s*/,
  },
  {
    pattern: /^::\s+/,
    component: 'MinimalList',
    prefixRemover: /^::\s*/,
  },
  {
    pattern: /^\[\s*\]\s+/,
    component: 'TaskList',
    prefixRemover: /^\[\s*\]\s*/,
  },
  {
    pattern: /^\[x\]\s+/i,
    component: 'TaskList',
    prefixRemover: /^\[x\]\s*/i,
    attributes: [{ name: 'completed', value: 'true' }],
  },
]

const ORDERED_VARIANTS: ListVariant[] = [
  {
    pattern: /^-\d+\.\s+/,
    component: 'OrderedList',
    prefixRemover: /^-\d+\.\s*/,
    attributes: [{ name: 'variant', value: 'compact' }],
  },
]

// Minimal Root type for mdast/unified compatibility
interface Root extends Parent {
  type: 'root'
  children: Array<Node>
}

// Utility functions
const getFirstTextContent = (node: List): string | null => {
  const firstItem = node.children[0] as ListItem
  if (!firstItem?.children[0]) return null
  
  const firstParagraph = firstItem.children[0] as Paragraph
  const firstText = firstParagraph?.children[0] as Text
  
  return firstText?.type === 'text' ? firstText.value.trim() : null
}

const createJsxElement = (
  component: string, 
  children: any[], 
  attributes: Array<{ name: string; value: string }> = []
) => ({
  type: 'mdxJsxFlowElement' as const,
  name: component,
  attributes: attributes.map(attr => ({
    type: 'mdxJsxAttribute' as const,
    name: attr.name,
    value: attr.value,
  })),
  children,
  data: { _mdxExplicitJsx: true },
})

const cleanTextNodes = (node: List, remover: RegExp) => {
  visit(node, 'text', (textNode: Text) => {
    textNode.value = textNode.value.replace(remover, '')
  })
}

// Helper: Detect pseudo-lists (consecutive lines with the same prefix)
function transformPseudoLists(tree: Root) {
  const newChildren: Node[] = []
  let currentVariant: ListVariant | null = null
  let currentItems: { value: string; position: any }[] = []

  function flush() {
    if (currentVariant && currentItems.length > 0) {
      const listItems = currentItems.map(item => ({
        type: 'mdxJsxFlowElement',
        name: 'ListItem',
        attributes: [],
        children: [
          { type: 'text', value: item.value.replace(currentVariant!.prefixRemover!, '') }
        ],
        data: { _mdxExplicitJsx: true },
        position: item.position,
      }))
      const jsxElement = createJsxElement(
        currentVariant.component,
        listItems,
        currentVariant.attributes
      )
      newChildren.push(jsxElement)
      currentVariant = null
      currentItems = []
    }
  }

  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i]
    if (
      node.type === 'paragraph' &&
      'children' in node &&
      Array.isArray((node as Parent).children) &&
      (node as Parent).children[0]?.type === 'text'
    ) {
      const text = ((node as Parent).children[0] as Text).value
      const variant = LIST_VARIANTS.find(v => v.pattern.test(text))
      if (variant) {
        if (!currentVariant || variant !== currentVariant) {
          flush()
          currentVariant = variant
        }
        currentItems.push({ value: text, position: node.position })
        continue
      }
    }
    flush()
    newChildren.push(node)
  }
  flush()
  tree.children = newChildren
}

// Main plugin implementation
const remarkListVariants: Plugin<[], Root> = () => {
  return (tree) => {
    // First, transform pseudo-lists
    transformPseudoLists(tree)
    // Then, process unordered and ordered lists as before
    // Process unordered lists
    visit(tree, 'list', (node: List, index, parent) => {
      if (!parent || index === undefined || node.ordered) return
      const parentNode = parent as Parent

      const firstTextContent = getFirstTextContent(node)
      if (!firstTextContent) return

      // Find matching variant
      const variant = LIST_VARIANTS.find(v => v.pattern.test(firstTextContent))
      if (!variant) return

      // Clean prefixes if needed
      if (variant.prefixRemover) {
        cleanTextNodes(node, variant.prefixRemover)
      }

      // Create JSX element
      const jsxElement = createJsxElement(
        variant.component,
        node.children,
        variant.attributes
      )

      // Replace node
      parentNode.children[index] = jsxElement
    })

    // Process ordered lists
    visit(tree, 'list', (node: List, index, parent) => {
      if (!parent || index === undefined || !node.ordered) return
      const parentNode = parent as Parent

      const firstTextContent = getFirstTextContent(node)
      if (!firstTextContent) return

      // Find matching ordered variant
      const variant = ORDERED_VARIANTS.find(v => v.pattern.test(firstTextContent))
      if (!variant) return

      // Clean prefixes if needed
      if (variant.prefixRemover) {
        cleanTextNodes(node, variant.prefixRemover)
      }

      // Create JSX element
      const jsxElement = createJsxElement(
        variant.component,
        node.children,
        variant.attributes
      )

      // Replace node
      parentNode.children[index] = jsxElement
    })
  }
}

export default remarkListVariants