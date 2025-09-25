import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, List, ListItem, Text, Parent, Node, RootContent } from 'mdast'
import type { VFile } from 'vfile'

interface MdxJsxFlowElement {
  type: 'mdxJsxFlowElement'
  name: string
  attributes: MdxJsxAttribute[]
  children: Node[]
}

interface MdxJsxAttribute {
  type: 'mdxJsxAttribute'
  name: string
  value: MdxJsxAttributeValue
}

interface MdxJsxAttributeValue {
  type: 'mdxJsxAttributeValueExpression'
  value: string
  data: {
    estree: {
      type: 'Program'
      body: Array<{
        type: 'ExpressionStatement'
        expression: {
          type: 'Literal'
          value: string | number | boolean
          raw: string
        }
      }>
    }
  }
}

// Clean plugin that ONLY transforms lists based on data attributes set by other plugins
// This is the single transformation plugin that handles all list types
const remarkListVariants: Plugin<[], Root> = () => {
  
  return (tree: Root, file: VFile) => {
    // Recursive function to process nodes and track nesting level
    function processNode(node: Node, parent: Parent, index: number | undefined, currentLevel: number): void {
      if (node.type === 'list') {
        const list = node as List
        if (!parent || index === undefined) return
        
        // Transform this list with the current level
        if (list.ordered) {
          transformOrderedList(list, file, parent, index, currentLevel)
        } else {
          transformUnorderedList(list, parent, index, currentLevel)
        }
        
        // Process children with the same level (list items don't increase level)
        if (list.children) {
          list.children.forEach((child, childIndex) => {
            processNode(child, list, childIndex, currentLevel)
          })
        }
      } else if (node.type === 'listItem') {
        const listItem = node as ListItem
        // Process listItem children, incrementing level for nested lists
        if (listItem.children) {
          listItem.children.forEach((child: Node, childIndex: number) => {
            if (child.type === 'list') {
              // Nested list gets incremented level
              processNode(child, listItem, childIndex, currentLevel + 1)
            } else {
              // Other children keep the same level
              processNode(child, listItem, childIndex, currentLevel)
            }
          })
        }
      } else if ('children' in node) {
        // Process other nodes recursively without changing level
        const parentNode = node as Parent
        if (parentNode.children) {
          parentNode.children.forEach((child: Node, childIndex: number) => {
            processNode(child, parentNode, childIndex, currentLevel)
          })
        }
      }
    }
    
    // Start processing from the root with level 1
    if (tree.children) {
      tree.children.forEach((child, index) => {
        processNode(child, tree, index, 1)
      })
    }
  }
}

// Helper function to extract original numbers from source text
function extractOriginalNumbers(list: List, file: VFile): number[] {
  if (!file.value || typeof file.value !== 'string') {
    return list.children.map((_, i) => i + 1)
  }
  
  const sourceLines = file.value.split('\n')
  const originalNumbers: number[] = []
  
  list.children.forEach((listItem: ListItem) => {
    if (listItem.position) {
      const startLine = listItem.position.start.line - 1
      if (startLine >= 0 && startLine < sourceLines.length) {
        const sourceLine = sourceLines[startLine]
        const numberMatch = sourceLine.match(/^\s*(\d+(?:\.\d+)?)\.\s/)
        if (numberMatch) {
          const num = numberMatch[1]
          originalNumbers.push(num.includes('.') ? parseFloat(num) : parseInt(num, 10))
        } else {
          originalNumbers.push(0)
        }
      } else {
        originalNumbers.push(0)
      }
    } else {
      originalNumbers.push(0)
    }
  })
  
  return originalNumbers
}

// Helper function to detect restart points in numbering
function detectRestartPoints(originalNumbers: number[]): number[] {
  const restartPoints: number[] = []
  
  for (let i = 0; i < originalNumbers.length; i++) {
    const currentNumber = originalNumbers[i]
    if (currentNumber === 1 && i > 0) {
      // Check if this is a restart (1 after higher numbers)
      let isRestart = false
      for (let j = i - 1; j >= 0; j--) {
        if (originalNumbers[j] > 1) {
          isRestart = true
          break
        }
      }
      if (isRestart) {
        restartPoints.push(i)
      }
    }
  }
  
  return restartPoints
}

// Helper function to calculate display number for an item
function calculateDisplayNumber(
  itemIndex: number, 
  originalNumbers: number[], 
  restartPoints: number[]
): string {
  const originalNumber = originalNumbers[itemIndex]
  
  // Handle decimal numbers (like 2.1)
  if (originalNumber && originalNumber.toString().includes('.')) {
    return originalNumber.toString()
  }
  
  // Handle restart numbering
  if (restartPoints.includes(itemIndex)) {
    return '1'
  }
  
  // Handle items after restart points
  if (restartPoints.length > 0) {
    let mostRecentRestart = -1
    for (const restartPoint of restartPoints) {
      if (restartPoint < itemIndex && restartPoint > mostRecentRestart) {
        mostRecentRestart = restartPoint
      }
    }
    
    if (mostRecentRestart !== -1) {
      const positionInSequence = itemIndex - mostRecentRestart + 1
      return positionInSequence.toString()
    }
  }
  
  // Handle explicit start numbers or normal sequential
  if (originalNumber > 0) {
    return originalNumber.toString()
  }
  
  // Fallback to sequential
  return (itemIndex + 1).toString()
}

// Helper function to clean text content from number prefixes and handle colons
function cleanTextContent(listItem: ListItem): { hasTrailingColon: boolean } {
  let hasTrailingColon = false
  let isFirstTextNode = true

  visit(listItem, 'text', (textNode: Text, _index, parent) => {
    const textContent = textNode.value.trim()

    // Only process number prefixes for the very first text node in a list item
    // and only if it's not inside a link or other inline element
    const isInLink = parent && (parent.type === 'link' || parent.type === 'linkReference')

    if (isFirstTextNode && !isInLink) {
      // Check for number prefix first - only at the very beginning of the list item
      const numberMatch = textContent.match(/^(\d+(?:\.\d+)?)\.\s+(.*)/)
      if (numberMatch) {
        const cleanedText = numberMatch[2]
        if (cleanedText.endsWith(':')) {
          hasTrailingColon = true
          textNode.value = cleanedText.slice(0, -1).trim()
        } else {
          textNode.value = cleanedText
        }
        isFirstTextNode = false
        return
      }
    }

    // Handle trailing colons for any text node
    if (textContent.endsWith(':')) {
      hasTrailingColon = true
      textNode.value = textContent.slice(0, -1).trim()
    }

    isFirstTextNode = false
  })

  return { hasTrailingColon }
}

// Helper function to determine component type based on data attributes
function getComponentType(listItem: ListItem): string {
  const itemType = listItem.data?.hProperties?.['data-item-type']
  
  switch(itemType) {
    case 'problem-intuition':
      return 'ProblemIntuitionItem'
    case 'problem-topics':
      return 'ProblemTopicsItem'
    case 'problem-difficulty':
      return 'ProblemDifficultyItem'
    case 'feature':
      return 'FeatureItem'
    default:
      return 'ListItem'
  }
}



// Helper function to create JSX attribute
function createJSXAttribute(name: string, value: string | number | boolean) {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: value.toString(),
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'Literal',
                value: typeof value === 'boolean' ? value : (typeof value === 'string' ? value : value),
                raw: typeof value === 'boolean' ? value.toString() : (typeof value === 'string' ? `"${value}"` : value.toString())
              }
            }
          ]
        }
      }
    }
  }
}

// Transform ordered lists to OrderedList JSX components with proper numbering
function transformOrderedList(list: List, file: VFile, parent: Parent, index: number, nestingLevel: number) {
  const originalNumbers = extractOriginalNumbers(list, file)
  const restartPoints = detectRestartPoints(originalNumbers)
  
  // Use the provided nesting level
  const level = nestingLevel
  
  const transformedItems = list.children.map((listItem: ListItem, i) => {
    // Clean number prefixes from text content and check for trailing colon
    const { hasTrailingColon } = cleanTextContent(listItem)
    
    // Calculate display properties
    const displayNumber = calculateDisplayNumber(i, originalNumbers, restartPoints)
    const componentName = getComponentType(listItem)
    
    // Create attributes
    const attributes = [
      createJSXAttribute('level', level),
      createJSXAttribute('displayNumber', displayNumber)
    ]
    
    // Add headerItem attribute if there was a trailing colon
    if (hasTrailingColon) {
      attributes.push(createJSXAttribute('headerItem', true))
    }
    
    
    return {
      type: 'mdxJsxFlowElement',
      name: componentName,
      attributes,
      children: listItem.children
    } as MdxJsxFlowElement
  })

  // Create OrderedList JSX element
  const orderedListElement: MdxJsxFlowElement = {
    type: 'mdxJsxFlowElement',
    name: 'OrderedList',
    attributes: [],
    children: transformedItems
  }
  
  parent.children[index] = orderedListElement as RootContent
}

// Transform unordered lists to UnorderedList JSX components
function transformUnorderedList(list: List, parent: Parent, index: number, nestingLevel: number) {
  // Use the provided nesting level
  const level = nestingLevel
  
  const transformedItems = list.children.map((listItem: ListItem) => {
    // Clean text content and check for trailing colon
    const { hasTrailingColon } = cleanTextContent(listItem)
    
    const componentName = getComponentType(listItem)
    
    const attributes = [createJSXAttribute('level', level)]
    // Note: No displayNumber for unordered lists - components will show icons
    
    // Add headerItem attribute if there was a trailing colon
    if (hasTrailingColon) {
      attributes.push(createJSXAttribute('headerItem', true))
    }
    
    
    return {
      type: 'mdxJsxFlowElement',
      name: componentName,
      attributes,
      children: listItem.children
    } as MdxJsxFlowElement
  })

  const unorderedListElement: MdxJsxFlowElement = {
    type: 'mdxJsxFlowElement',
    name: 'UnorderedList',
    attributes: [],
    children: transformedItems
  }
  
  parent.children[index] = unorderedListElement as RootContent
}

export default remarkListVariants