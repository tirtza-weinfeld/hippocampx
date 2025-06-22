// plugins/toc-plugin.ts
import type { Plugin } from 'unified'
import type { Parent, Literal } from 'unist'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'

interface HeadingNode extends Parent {
  type: 'heading'
  depth: number
  children: Array<Literal>
}

interface TocHeading {
  text: string
  id: string
  level: number
}

const TOC_HEADING = 'Table of Contents'
const RESIZABLE_TOC_HEADING = 'Resizable Table of Contents'

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
  visit(tree, 'heading', (node: HeadingNode, index, parent) => {
    // Extract text from heading
    let text = ''
    for (const child of node.children) {
      if (child.type === 'text') {
        text += child.value
      }
    }
    text = text.trim()
    
    if (!text) return

    // Find and store the H1 index
    if (node.depth === 1 && h1Index === -1) {
      h1Index = index
    }

    // Check if this is the TOC heading (regular or resizable)
    if (text.toLowerCase() === TOC_HEADING.toLowerCase() && node.depth === 2) {
      tocHeadingIndex = index
      tocParent = parent
      isResizableLayout = false
      return
    }

    if (text.toLowerCase() === RESIZABLE_TOC_HEADING.toLowerCase() && node.depth === 2) {
      tocHeadingIndex = index
      tocParent = parent
      isResizableLayout = true
      return // Don't include "Resizable Table of Contents" in the TOC itself
    }

    // Collect other headings (skip the TOC heading itself)
    headings.push({
      text,
      id: slugger.slug(text),
      level: node.depth
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