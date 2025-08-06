import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Node, Parent } from 'unist'

// Modern TypeScript interfaces with better type safety
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

interface MDXJSXAttribute {
  type: 'mdxJsxAttribute'
  name: string
  value: string | null
}

interface MDXJSXElement extends Parent {
  type: 'mdxJsxFlowElement'
  name: string
  attributes: MDXJSXAttribute[]
  children: Node[]
  data?: { _mdxExplicitJsx: boolean }
}

interface ListVariant {
  pattern: RegExp
  component: string
  prefixRemover?: RegExp
  attributes?: Array<{ name: string; value: string | null }>
}

// Enhanced list variant definitions with modern patterns
const LIST_VARIANTS: readonly ListVariant[] = [
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
    component: 'CompactList',
    prefixRemover: /^::\s*/,
    attributes: [{ name: 'variant', value: 'minimal' }],
  },
  {
    pattern: /^\[\s*\]\s+/,
    component: 'TaskList',
    prefixRemover: /^\[\s*\]\s*/,
    attributes: [{ name: 'completed', value: null }],
  },
  {
    pattern: /^\[x\]\s+/i,
    component: 'TaskList',
    prefixRemover: /^\[x\]\s*/i,
    attributes: [{ name: 'completed', value: 'true' }],
  },
] as const

const ORDERED_VARIANTS: readonly ListVariant[] = [
  {
    pattern: /^-\d+\.\s+/,
    component: 'OrderedList',
    prefixRemover: /^-\d+\.\s*/,
    attributes: [{ name: 'variant', value: 'compact' }],
  },
] as const

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
  children: Node[], 
  attributes: Array<{ name: string; value: string | null }> = []
): MDXJSXElement => ({
  type: 'mdxJsxFlowElement',
  name: component,
  attributes: attributes.map(attr => ({
    type: 'mdxJsxAttribute',
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

  // Helper: Split multi-line text nodes into separate items
  function splitMultilineText(text: string, variant: ListVariant): { value: string; position: any }[] {
    const lines = text.split('\n').filter(line => line.trim())
    return lines
      .filter(line => variant.pattern.test(line))
      .map(line => ({ value: line, position: undefined }))
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
      // Check both unordered and ordered variants
      const variant = LIST_VARIANTS.find(v => v.pattern.test(text)) || 
                     ORDERED_VARIANTS.find(v => v.pattern.test(text))
      if (variant) {
        if (!currentVariant || variant !== currentVariant) {
          flush()
          currentVariant = variant
        }
        
        // Handle multi-line text nodes by splitting them
        if (text.includes('\n')) {
          const splitItems = splitMultilineText(text, variant)
          currentItems.push(...splitItems)
        } else {
          currentItems.push({ value: text, position: node.position })
        }
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