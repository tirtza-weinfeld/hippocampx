// plugins/toc-plugin.ts
import type { Plugin } from 'unified'
import type { Parent, Node } from 'unist'
import type { Heading, Text, Strong, Emphasis } from 'mdast'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import { extractTextFromHeading, extractDisplayTextFromHeading } from './mdx-text-extraction.js'
import { isValidColorName, getStepColor } from './lib/step-colors.js'

interface TocHeading {
  text: string
  id: string
  level: number
  richContent?: TocRichContent[] // New: structured content for rendering
}

interface TocRichContent {
  type: 'text' | 'math' | 'styled-math'
  content: string
  stepColor?: string // For styled content
}

interface InlineMathNode {
  type: 'inlineMath'
  value: string
}

const TOC_HEADING = 'Table of Contents'
const RESIZABLE_TOC_HEADING = 'Resizable Table of Contents'

/**
 * Extract step color from styled node using the same logic as remarkTypography
 */
function extractStepColorFromStyledNode(node: Parent): string | undefined {
  if (node.children.length === 0) return undefined

  const firstChild = node.children[0]
  if (firstChild.type !== 'text') return undefined

  const textNode = firstChild as Text
  const stepMatch = textNode.value.match(/^\[([^!]+)!\](.*)$/)
  if (stepMatch === null) return undefined

  const [, stepOrColor] = stepMatch

  if (/^\d+$/.test(stepOrColor)) {
    return getStepColor(parseInt(stepOrColor, 10))
  }
  if (isValidColorName(stepOrColor)) {
    return stepOrColor
  }

  return undefined
}

/**
 * Extract rich content from a heading node for TOC rendering
 * Applies typography processing inline to ensure consistency
 */
function extractRichContentFromHeading(node: Heading): TocRichContent[] {
  const richContent: TocRichContent[] = []
  
  function processNode(node: Node, parentStepColor?: string) {
    if (node.type === 'text') {
      const textNode = node as Text
      let text = (textNode.value || '').trim()
      // Clean up step syntax from text content
      text = text.replace(/^\[([^!]+)!\]/, '').trim()
      if (text) {
        richContent.push({ type: 'text', content: text })
      }
    } else if (node.type === 'inlineMath') {
      const mathNode = node as InlineMathNode
      const mathContent = (mathNode.value || '').trim()
      if (mathContent) {
        if (parentStepColor) {
          richContent.push({
            type: 'styled-math',
            content: mathContent,
            stepColor: parentStepColor
          })
        } else {
          richContent.push({ type: 'math', content: mathContent })
        }
      }
    } else if (node.type === 'strong' || node.type === 'emphasis') {
      const styledNode = node as Strong | Emphasis
      // Extract step color using the same logic as remarkTypography
      const stepColor = (styledNode.data?.hProperties?.['data-step'] as string) ||
                       extractStepColorFromStyledNode(styledNode)

      styledNode.children.forEach((child: Node) => processNode(child, stepColor))
    } else if ('children' in node && Array.isArray(node.children)) {
      const parentNode = node as Parent
      parentNode.children.forEach((child: Node) => processNode(child, parentStepColor))
    }
  }
  
  node.children.forEach((child: Node) => processNode(child))
  return richContent
}


const remarkInjectToc: Plugin<[], Parent> = () => (tree) => {
  const slugger = new GithubSlugger()
  const headings: TocHeading[] = []

  // Use state object to help ESLint track mutations in callbacks
  const state = {
    tocHeadingIndex: -1,
    tocParent: null as Parent | null,
    isResizableLayout: false,
    h1Index: -1,
  }

  // First pass: collect all headings and find the TOC heading
  visit(tree, 'heading', (node: Heading, index, parent) => {
    // Extract text for display (preserves math notation) and for slug generation
    let displayText = extractDisplayTextFromHeading(node)
    let slugText = extractTextFromHeading(node)

    // Clean collapsible and specialized component directives from TOC entries
    // Matches: [!collapsible], [!collapsible:expand], [!(ComponentName)], [!collapsible(ComponentName)], etc.
    const directiveMatch = displayText.match(/^\[!(?:collapsible(?::expand)?)?\(?(?:[^)]+)?\)?\]\s*(.*)/i)
    if (directiveMatch) {
      displayText = directiveMatch[1].trim()
      slugText = slugText.replace(/^\[!(?:collapsible(?::expand)?)?\(?(?:[^)]+)?\)?\]\s*/i, '').trim()
    }

    // Extract rich content AFTER cleaning directives
    // Create a temporary cleaned node for rich content extraction
    const cleanedNode = structuredClone(node)
    if (cleanedNode.children.length > 0 && cleanedNode.children[0].type === 'text') {
      cleanedNode.children[0].value = cleanedNode.children[0].value.replace(/^\[!(?:collapsible(?::expand)?)?\(?(?:[^)]+)?\)?\]\s*/i, '')
    }
    const richContent = extractRichContentFromHeading(cleanedNode)

    if (!displayText || !slugText) return

    // Find and store the H1 index
    if (node.depth === 1 && state.h1Index === -1) {
      state.h1Index = index
    }

    // Check if this is the TOC heading (regular or resizable)
    if (displayText.toLowerCase() === TOC_HEADING.toLowerCase() && node.depth === 2) {
      state.tocHeadingIndex = index
      state.tocParent = parent
      state.isResizableLayout = false
      return
    }

    if (displayText.toLowerCase() === RESIZABLE_TOC_HEADING.toLowerCase() && node.depth === 2) {
      state.tocHeadingIndex = index
      state.tocParent = parent
      state.isResizableLayout = true
      return // Don't include "Resizable Table of Contents" in the TOC itself
    }

    // Collect other headings (skip the TOC heading itself)
    // Use displayText for TOC display (preserves math notation) and slugText for URL generation
    headings.push({
      text: displayText, // Display text with original math notation
      id: slugger.slug(slugText), // Slug from cleaned text
      level: node.depth,
      richContent: richContent // Rich content for proper rendering
    })
  })

  // Second pass: replace the TOC heading with the component
  if (state.tocHeadingIndex !== -1 && state.tocParent && headings.length > 0) {
    const componentName = state.isResizableLayout ? 'ResizableWrapper' : 'TableOfContents'

    if (state.isResizableLayout) {
      // For resizable layout, we want to wrap content starting from the H1.
      // The Resizable TOC heading itself will be removed from the flow.

      // Determine the starting index for content. It should be the H1.
      // Fallback to the TOC heading index if H1 isn't found before it.
      const contentStartIndex = state.h1Index !== -1 && state.h1Index < state.tocHeadingIndex ? state.h1Index : state.tocHeadingIndex

      // Grab all nodes from the start index to the end.
      const nodesToWrapAndFilter = state.tocParent.children.slice(contentStartIndex)

      // Filter out the 'Resizable Table of Contents' node from this selection.
      const contentToWrap = nodesToWrapAndFilter.filter((_node, index) => {
        // The actual index of the TOC heading in the original `children` array is `state.tocHeadingIndex`.
        // Its index inside our `nodesToWrapAndFilter` slice is `state.tocHeadingIndex - contentStartIndex`.
        return contentStartIndex + index !== state.tocHeadingIndex
      })

      const jsxNode = {
        type: 'mdxJsxFlowElement',
        name: componentName,
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'headings',
            value: JSON.stringify(headings)
          },
          {
            type: 'mdxJsxAttribute',
            name: 'className',
            value: 'min-h-[600px] rounded-lg '
          }
        ],
        children: contentToWrap
      }

      // Remove everything from the content start index onwards from the original tree
      state.tocParent.children.splice(contentStartIndex)

      // Add the new ResizableWrapper that contains the wrapped content
      state.tocParent.children.push(jsxNode)
    } else {
      // For regular TOC, just replace the heading
      const jsxNode = {
        type: 'mdxJsxFlowElement',
        name: componentName,
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'headings',
            value: JSON.stringify(headings)
          }
        ],
        children: []
      }

      state.tocParent.children.splice(state.tocHeadingIndex, 1, jsxNode)
    }
  }
}

export default remarkInjectToc