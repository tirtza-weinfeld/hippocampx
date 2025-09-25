import type { Heading, Text, Strong, Emphasis, Node } from 'mdast'

interface InlineMathNode extends Node {
  type: 'inlineMath'
  value: string
}

interface ParentNode extends Node {
  children: Node[]
}

type MdastNode = Text | InlineMathNode | Strong | Emphasis | ParentNode

/**
 * Extracts text content from a heading node for display purposes (TOC, etc.)
 * Preserves original math notation for readable display.
 * 
 * @param node - The heading node to extract text from
 * @returns Text string with original math notation preserved
 */
export function extractDisplayTextFromHeading(node: Heading): string {
  const textParts: string[] = []

  function visitTextNodes(node: MdastNode) {
    if (node.type === 'text') {
      const textNode = node as Text
      const text = (textNode.value || '').trim()
      if (text) {
        textParts.push(text)
      }
    } else if (node.type === 'inlineMath') {
      const mathNode = node as InlineMathNode
      // Keep original math content for display - wrap in $ for TOC rendering
      const mathContent = (mathNode.value || '').trim()
      if (mathContent) {
        textParts.push(`$${mathContent}$`)
      }
    } else if (node.type === 'strong' || node.type === 'emphasis') {
      const parentNode = node as ParentNode
      // Handle styled text (including data-step attributes)
      const styledText = extractTextFromChildren(parentNode.children || [], false) // false = don't clean math
      if (styledText) {
        textParts.push(styledText)
      }
    } else if ('children' in node && Array.isArray(node.children)) {
      // Recursively process children
      node.children.forEach((child: Node) =>
        visitTextNodes(child as MdastNode)
      )
    }
  }
  
  // Process all children of the heading
  node.children.forEach((child) => visitTextNodes(child as MdastNode))
  
  // Join with spaces to ensure proper word boundaries
  return textParts.join(' ').trim()
}

/**
 * Extracts text content from a heading node, handling various node types
 * and ensuring proper spacing for slug generation.
 * 
 * Handles:
 * - Regular text nodes
 * - Inline math nodes (inlineMath) - cleaned for slug generation
 * - Styled text nodes (strong, emphasis) with data-step attributes
 * - Proper spacing between different node types for slug generation
 * 
 * @param node - The heading node to extract text from
 * @returns Clean text string with proper spacing for slug generation
 */
export function extractTextFromHeading(node: Heading): string {
  const textParts: string[] = []

  function visitTextNodes(node: MdastNode) {
    if (node.type === 'text') {
      const textNode = node as Text
      const text = (textNode.value || '').trim()
      if (text) {
        textParts.push(text)
      }
    } else if (node.type === 'inlineMath') {
      const mathNode = node as InlineMathNode
      // Extract math content and clean it for slug generation
      const mathContent = cleanMathForSlug((mathNode.value || '').trim())
      if (mathContent) {
        textParts.push(mathContent)
      }
    } else if (node.type === 'strong' || node.type === 'emphasis') {
      const parentNode = node as ParentNode
      // Handle styled text (including data-step attributes)
      // Extract text from children and treat as separate word(s)
      const styledText = extractTextFromChildren(parentNode.children || [], true) // true = clean math
      if (styledText) {
        textParts.push(styledText)
      }
    } else if ('children' in node && Array.isArray(node.children)) {
      // Recursively process children
      node.children.forEach((child: Node) =>
        visitTextNodes(child as MdastNode)
      )
    }
  }
  
  // Process all children of the heading
  node.children.forEach((child) => visitTextNodes(child as MdastNode))
  
  // Join with spaces to ensure proper word boundaries for slug generation
  return textParts.join(' ').trim()
}

/**
 * Helper function to extract text from an array of child nodes
 * @param children - Array of child nodes
 * @param cleanMath - Whether to clean math content for slug generation (true) or preserve for display (false)
 */
function extractTextFromChildren(children: Node[], cleanMath: boolean = true): string {
  const textParts: string[] = []
  
  children.forEach(child => {
    if (child.type === 'text') {
      const textNode = child as Text
      const text = (textNode.value || '').trim()
      if (text) {
        textParts.push(text)
      }
    } else if (child.type === 'inlineMath') {
      const mathNode = child as InlineMathNode
      const mathContent = cleanMath
        ? cleanMathForSlug((mathNode.value || '').trim())
        : `$${(mathNode.value || '').trim()}$` // Wrap in $ for TOC rendering when not cleaning
      if (mathContent) {
        textParts.push(mathContent)
      }
    } else if ('children' in child && Array.isArray(child.children)) {
      const nestedText = extractTextFromChildren(child.children, cleanMath)
      if (nestedText) {
        textParts.push(nestedText)
      }
    }
  })
  
  return textParts.join(' ').trim()
}

/**
 * Cleans math content for slug generation by removing LaTeX commands
 * and other characters that interfere with slug generation
 * 
 * @param mathContent - Raw math content from inlineMath node
 * @returns Cleaned content suitable for slug generation
 */
function cleanMathForSlug(mathContent: string): string {
  return mathContent
    // Remove backslashes (LaTeX commands like \log, \sum, etc.)
    .replace(/\\/g, '')
    // Remove curly braces
    .replace(/[{}]/g, '')
    // Remove parentheses, brackets, and other punctuation that creates word breaks
    .replace(/[(),[\]]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, '')
    // Keep only alphanumeric characters and basic symbols
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim()
}