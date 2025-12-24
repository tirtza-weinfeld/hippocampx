import type { Heading, Parent, RootContent } from 'mdast'
import type { Plugin } from 'unified'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import { extractTextFromHeading } from './mdx-text-extraction.js'

interface PluginOptions {
  componentPath?: string
}

interface MdxJsxAttribute {
  type: 'mdxJsxAttribute'
  name: string
  value: string | null
}

interface MdxJsxFlowElement extends Node {
  type: 'mdxJsxFlowElement'
  name: string
  attributes: MdxJsxAttribute[]
  children: RootContent[]
}


export const remarkHeaderSection: Plugin<[PluginOptions?]> = () => {
  return (tree: Node) => {
    
    visit(tree, 'heading', (node: Heading, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined) return
      
      // Extract heading text
      const headingText = extractTextFromHeading(node)
      
      // Check if heading starts with "[!" pattern
      const componentMatch = headingText.match(/^\[!(\w+)\]\s*(.*)/)
      if (!componentMatch) return
      
      const [, componentName, remainingText] = componentMatch
      
      // Update the heading by removing just the component directive prefix
      // while preserving any other content (including potential math expressions)
      updateHeadingContent(node, remainingText.trim())
      
      // Set a custom ID to prevent rehype-slug from generating a duplicated one
      const cleanText = extractTextFromHeading(node)
      const slugger = new GithubSlugger()
      const customId = slugger.slug(cleanText)
      
      if (!node.data) node.data = {}
      if (!node.data.hProperties) node.data.hProperties = {}
      node.data.hProperties.id = customId

      // Add component prop to the heading node
      node.data.hProperties['component'] = `${componentName}Header`
      
      // Find content after this heading until the next heading of same or higher level
      const content = extractSectionContent(parent, index, node.depth)
      
      // Create section wrapper component
      const sectionWrapper: MdxJsxFlowElement = {
        type: 'mdxJsxFlowElement',
        name: componentName,
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'data-section-type',
            value: componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
          }
        ],
        children: [node, ...content]
      }
      
      // Replace the heading and content with the section wrapper
      parent.children.splice(index, content.length + 1, sectionWrapper as unknown as RootContent)
    })
  }
}


function updateHeadingContent(node: Heading, newText: string) {
  if (!newText) {
    // If no new text, remove the component directive from existing content
    removeComponentDirective(node)
    return
  }
  
  // Check if we have any non-text children (like inlineMath nodes) that we should preserve
  const nonTextChildren = node.children.filter(child => child.type !== 'text')
  
  if (nonTextChildren.length > 0) {
    // We have math or other nodes - preserve them and just update the text part
    removeComponentDirective(node)
  } else {
    // Only text content - safe to replace completely
    node.children = [{ type: 'text', value: newText }]
  }
}

function removeComponentDirective(node: Heading) {
  // Remove the [!...] part from the first text node
  if (node.children.length > 0 && node.children[0].type === 'text') {
    const textNode = node.children[0]
    // Remove component directive but preserve single trailing space for proper spacing with following nodes
    textNode.value = textNode.value.replace(/^\[!\w+\]\s*/, '')
    
    // Only trim leading spaces, normalize trailing spaces to single space if there are following nodes
    if (textNode.value.length > 0) {
      textNode.value = textNode.value.replace(/^\s+/, '')
      
      // If there are following nodes (like math) and current text has trailing spaces,
      // normalize to exactly one space for consistent spacing
      if (node.children.length > 1 && textNode.value.match(/\s+$/)) {
        textNode.value = textNode.value.replace(/\s+$/, ' ')
      }
    }
  }
}

function extractSectionContent(parent: Parent, headingIndex: number, currentDepth: number): RootContent[] {
  const content = []
  let i = headingIndex + 1
  
  // Collect content until we hit another heading of the same or higher level
  while (i < parent.children.length) {
    const node = parent.children[i]
    
    // Stop if we hit another heading of the same or higher level
    if (node.type === 'heading' && node.depth <= currentDepth) {
      break
    }
    
    content.push(node)
    i++
  }
  
  return content
}

export default remarkHeaderSection
