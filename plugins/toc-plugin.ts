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
  if (!node.children || node.children.length === 0) return undefined
  
  const firstChild = node.children[0]
  if (firstChild.type !== 'text') return undefined
  
  const textNode = firstChild as Text
  const text = textNode.value as string
  const stepMatch = text.match(/^\[([^!]+)!\](.*)$/)
  if (!stepMatch) return undefined
  
  const [, stepOrColor] = stepMatch
  
  // Determine step value
  if (/^\d+$/.test(stepOrColor)) {
    const stepNumber = parseInt(stepOrColor, 10)
    return getStepColor(stepNumber)
  } else if (isValidColorName(stepOrColor)) {
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

      if (styledNode.children && Array.isArray(styledNode.children)) {
        styledNode.children.forEach((child: Node) => processNode(child, stepColor))
      }
    } else if ('children' in node && Array.isArray(node.children)) {
      const parentNode = node as Parent
      parentNode.children.forEach((child: Node) => processNode(child, parentStepColor))
    }
  }
  
  node.children.forEach((child: Node) => processNode(child))
  return richContent
}


const remarkInjectToc: Plugin<[], Parent> = () => (tree) => {
  // console.log('--- TOC Plugin Start ---')
  // console.log(JSON.stringify(tree, null, 2))

  const slugger = new GithubSlugger()
  const headings: TocHeading[] = []
  let tocHeadingIndex = -1
  let tocParent: Parent | null = null
  let isResizableLayout = false
  let h1Index = -1

  // console.log('TOC Plugin starting...')

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
      const textNode = cleanedNode.children[0] as Text
      textNode.value = textNode.value.replace(/^\[!(?:collapsible(?::expand)?)?\(?(?:[^)]+)?\)?\]\s*/i, '')
    }
    const richContent = extractRichContentFromHeading(cleanedNode)

    if (!displayText || !slugText) return

    // Find and store the H1 index
    if (node.depth === 1 && h1Index === -1) {
      h1Index = index
    }

    // Check if this is the TOC heading (regular or resizable)
    if (displayText.toLowerCase() === TOC_HEADING.toLowerCase() && node.depth === 2) {
      tocHeadingIndex = index
      tocParent = parent
      isResizableLayout = false
      return
    }

    if (displayText.toLowerCase() === RESIZABLE_TOC_HEADING.toLowerCase() && node.depth === 2) {
      tocHeadingIndex = index
      tocParent = parent
      isResizableLayout = true
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

  // console.log('Collected headings:', headings)
  // console.log('TOC heading index:', tocHeadingIndex)

  // Second pass: replace the TOC heading with the component
  if (tocHeadingIndex !== -1 && tocParent && headings.length > 0) {
    const componentName = isResizableLayout ? 'ResizableWrapper' : 'TableOfContents'
    
    if (isResizableLayout) {
      // For resizable layout, we want to wrap content starting from the H1.
      // The Resizable TOC heading itself will be removed from the flow.

      // Determine the starting index for content. It should be the H1.
      // Fallback to the TOC heading index if H1 isn't found before it.
      const contentStartIndex = h1Index !== -1 && h1Index < tocHeadingIndex ? h1Index : tocHeadingIndex

      // Grab all nodes from the start index to the end.
      const nodesToWrapAndFilter = (tocParent as Parent).children.slice(contentStartIndex)
      
      // Filter out the 'Resizable Table of Contents' node from this selection.
      const contentToWrap = nodesToWrapAndFilter.filter((node, index) => {
        // The actual index of the TOC heading in the original `children` array is `tocHeadingIndex`.
        // Its index inside our `nodesToWrapAndFilter` slice is `tocHeadingIndex - contentStartIndex`.
        return contentStartIndex + index !== tocHeadingIndex
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
      ;(tocParent as Parent).children.splice(contentStartIndex)
      
      // Add the new ResizableWrapper that contains the wrapped content
      ;(tocParent as Parent).children.push(jsxNode)
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
      
      ;(tocParent as Parent).children.splice(tocHeadingIndex, 1, jsxNode)
    }
  } else {
    // console.log('Not injecting component - conditions not met')
  }
}

export default remarkInjectToc