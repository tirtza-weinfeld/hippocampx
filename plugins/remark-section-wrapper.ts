import type { Heading, Parent, RootContent, Text } from 'mdast'
import type { Plugin } from 'unified'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import { extractTextFromHeading } from './mdx-text-extraction.js'

interface PluginOptions {
  depths?: number[]  // Which heading levels to wrap (default: [2, 3, 4, 5, 6])
}

interface MdxJsxAttribute {
  type: 'mdxJsxAttribute'
  name: string
  value: string | number | boolean | null
}

interface MdxJsxFlowElement extends Node {
  type: 'mdxJsxFlowElement'
  name: string
  attributes: MdxJsxAttribute[]
  children: RootContent[]
}

export const remarkSectionWrapper: Plugin<[PluginOptions?]> = (options) => {
  const { depths = [2, 3, 4, 5, 6] } = options ?? {}

  return (tree: Node) => {
    const slugger = new GithubSlugger()

    // Collect all headings first, then process them in reverse order (deepest/rightmost first)
    // This ensures nested sections are wrapped before their parent sections
    const headings: Array<{ node: Heading; index: number; parent: Parent }> = []

    visit(tree, 'heading', (node: Heading, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined) return
      if (!depths.includes(node.depth)) return
      headings.push({ node, index, parent })
    })

    // Process headings in reverse order to handle nesting correctly
    for (let i = headings.length - 1; i >= 0; i--) {
      const { node, parent } = headings[i]

      // Re-find the index since previous operations may have changed it
      const index = parent.children.indexOf(node as unknown as RootContent)
      if (index === -1) continue // Node was already processed/removed

      // Only process headings at specified depths
      if (!depths.includes(node.depth)) continue

      // Extract heading text to check for collapsible directive
      const headingText = extractTextFromHeading(node)


      // Skip TOC headings - they're handled by toc-plugin
      const lowerHeadingText = headingText.toLowerCase()
      if (lowerHeadingText === 'table of contents' || lowerHeadingText === 'resizable table of contents') {
        continue
      }

      // Check for specialized component directives with format:
      // [!collapsible(ComponentName)] or [!(ComponentName)] or [!collapsible:expand(ComponentName)]
      const specializedMatch = headingText.match(/^\[!(?:collapsible(?::expand)?)?\(([^)]+)\)\]\s*(.*)/i)

      // Check for regular [!collapsible] or [!collapsible:expand] directive
      const collapsibleMatch = !specializedMatch
        ? headingText.match(/^\[!collapsible(?::expand)?\]\s*(.*)/i)
        : null

      // Determine if this should be collapsible:
      // - If it has [!collapsible] or [!collapsible:expand] directive
      // - OR if it's a specialized component with "collapsible" in the directive
      const isCollapsible = !!collapsibleMatch || (!!specializedMatch && headingText.match(/^\[!collapsible/i))
      const isExpanded = headingText.match(/^\[!collapsible:expand/i) !== null

      // Extract custom component name from specialized match
      const customComponentName = specializedMatch ? specializedMatch[1] : null

      const cleanHeadingText = specializedMatch
        ? specializedMatch[2]
        : collapsibleMatch
          ? collapsibleMatch[1]
          : headingText


      // Remove the directive from heading content if present
      if (isCollapsible || customComponentName) {
        updateHeadingContent(node, cleanHeadingText.trim())
      }

      // Generate slug for the cleaned heading text
      const finalHeadingText = (isCollapsible || customComponentName) ? extractTextFromHeading(node) : headingText
      const customId = slugger.slug(finalHeadingText)


      // Set ID on heading node for proper anchor links
      if (!node.data) node.data = {}
      if (!node.data.hProperties) node.data.hProperties = {}
      node.data.hProperties.id = customId

      // Extract section content until next heading of same/higher level
      const content = extractSectionContent(parent, index, node.depth)

      // Determine header and content component names
      const headerComponentName = customComponentName ? `${customComponentName}Header` : 'SectionHeader'
      const contentComponentName = customComponentName ? `${customComponentName}Content` : 'SectionContent'


      // For custom components, create a completely fresh heading node
      // This avoids any cached references or position data that might point to original source
      let headingNode: Heading = node
      if (customComponentName) {
        headingNode = {
          type: 'heading',
          depth: node.depth,
          children: [{ type: 'text', value: cleanHeadingText.trim() }]
        }
        // Copy ID data if it exists, but nothing else
        if (node.data.hProperties.id) {
          headingNode.data = {
            hProperties: {
              id: node.data.hProperties.id
            }
          }
        }
      }

      // Create header wrapper with heading as child
      const sectionHeader: MdxJsxFlowElement = {
        type: 'mdxJsxFlowElement',
        name: headerComponentName,
        attributes: [],
        children: [headingNode]
      }

      // Create content wrapper with content as children
      const sectionContent: MdxJsxFlowElement = {
        type: 'mdxJsxFlowElement',
        name: contentComponentName,
        attributes: [],
        children: content
      }

      // Determine which component to use and build children array
      const componentName = isCollapsible ? 'CollapsibleSection' : 'Section'
      const sectionChildren: RootContent[] = [
        sectionHeader as unknown as RootContent,
        sectionContent as unknown as RootContent
      ]

      // Add expand attribute as third child for CollapsibleSection if expanded
      if (isCollapsible && isExpanded) {
        const expandText: Text = {
          type: 'text',
          value: 'true'
        }
        sectionChildren.push(expandText as unknown as RootContent)
      }

      // Create Section or CollapsibleSection wrapper with depth attribute
      const sectionWrapper: MdxJsxFlowElement = {
        type: 'mdxJsxFlowElement',
        name: componentName,
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'data-depth',
            value: node.depth
          }
        ],
        children: sectionChildren
      }

      // Replace heading and content with section wrapper
      parent.children.splice(index, content.length + 1, sectionWrapper as unknown as RootContent)
    }
  }
}

function updateHeadingContent(node: Heading, newText: string): void {
  if (!newText) {
    removeCollapsibleDirective(node)
    return
  }

  // Check if we have any non-text children (like inlineMath nodes) that we should preserve
  const nonTextChildren = node.children.filter(child => child.type !== 'text')

  if (nonTextChildren.length > 0) {
    // We have math or other nodes - preserve them and just update the text part
    removeCollapsibleDirective(node)
  } else {
    // Only text content - modify the existing text node in place
    const firstChild = node.children[0]
    if (firstChild.type === 'text') {
      firstChild.value = newText
    } else {
      // Fallback: create new text node if needed
      node.children = [{ type: 'text', value: newText }]
    }
  }
}

function removeCollapsibleDirective(node: Heading): void {
  // Remove the [!collapsible], [!collapsible:expand], or specialized component directives from the first text node
  const firstChild = node.children[0]
  if (firstChild.type === 'text') {
    const textNode = firstChild
    // Remove component directive (including specialized format) but preserve single trailing space for proper spacing with following nodes
    textNode.value = textNode.value.replace(/^\[!(?:collapsible(?::expand)?)?\(?(?:[^)]+)?\)?\]\s*/i, '')

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
  const content: RootContent[] = []
  let i = headingIndex + 1

  while (i < parent.children.length) {
    const node = parent.children[i]

    // Stop at next heading of same or higher level
    if (node.type === 'heading' && node.depth <= currentDepth) {
      break
    }

    // Stop at TOC-related MDX components
    if ('type' in node && (node as { type: string }).type === 'mdxJsxFlowElement') {
      const componentName = (node as { name?: string }).name

      // Always stop at TOC components
      if (componentName === 'TableOfContents' || componentName === 'ResizableWrapper') {
        break
      }

      // For Section/CollapsibleSection components, check depth to allow proper nesting
      // Stop only if the wrapped section is same or higher level (depth <= currentDepth)
      if (componentName === 'Section' || componentName === 'CollapsibleSection') {
        const jsxElement = node as unknown as MdxJsxFlowElement
        const depthAttr = jsxElement.attributes.find((attr: MdxJsxAttribute) => attr.name === 'data-depth')
        const wrappedDepth = depthAttr ? Number(depthAttr.value) : undefined

        // If we can determine the depth and it's same or higher level, stop
        // Otherwise continue (to capture child sections)
        if (wrappedDepth !== undefined && wrappedDepth <= currentDepth) {
          break
        }
      }
    }

    content.push(node)
    i++
  }

  return content
}

export default remarkSectionWrapper
