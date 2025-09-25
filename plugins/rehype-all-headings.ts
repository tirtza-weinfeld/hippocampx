import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'

interface HeadingElement extends Element {
  tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

function extractTextContent(node: any): string {
  if (node.type === 'text') {
    return node.value || ''
  }
  
  if (node.children && Array.isArray(node.children)) {
    return node.children
      .map((child: any) => extractTextContent(child))
      .join('')
      .trim()
  }
  
  return ''
}

function isHeadingElement(node: any): node is HeadingElement {
  return (
    node.type === 'element' &&
    typeof node.tagName === 'string' &&
    /^h[1-6]$/.test(node.tagName)
  )
}

export const rehypeAllHeadings: Plugin<[], Root> = () => {
  return (tree) => {
    const slugger = new GithubSlugger()
    
    console.log('=== rehypeAllHeadings: Starting ===')
    
    // Deep traversal to find ALL headings, regardless of nesting
    visit(tree, (node) => {
      // Log JSX components to see if they exist
      if (node.type === 'mdxJsxFlowElement') {
        console.log('Found JSX component:', {
          type: node.type,
          name: (node as any).name,
          children: (node as any).children?.length
        })
      }
      
      // Log all nodes to see what we're getting
      if (node.type === 'element' || node.type === 'mdxJsxFlowElement') {
        const tagName = (node as any).tagName || (node as any).name
        if (/^h[1-6]$/.test(tagName)) {
          console.log('Found heading:', {
            type: node.type,
            tagName: tagName,
            properties: (node as any).properties,
            children: (node as any).children
          })
        }
      }
      
      if (isHeadingElement(node)) {
        console.log('Processing heading:', node.tagName)
        
        // Extract text content for slug generation
        const textContent = extractTextContent(node)
        console.log('Text content:', textContent)
        
        if (!textContent) {
          console.log('No text content, skipping')
          return // Skip headings with no text
        }
        
        const slug = slugger.slug(textContent)
        console.log('Generated slug:', slug)
        
        // Add id if not already present
        if (!node.properties) {
          node.properties = {}
        }
        
        if (!node.properties.id) {
          node.properties.id = slug
          console.log('Added id:', slug)
        }
        
        // Wrap content in anchor link (behavior: 'wrap' style)
        if (node.children && node.children.length > 0) {
          const anchorNode: Element = {
            type: 'element',
            tagName: 'a',
            properties: {
              href: `#${slug}`,
              className: ['anchor']
            },
            children: [...node.children] // Copy existing children
          }
          
          // Replace children with anchor wrapper
          node.children = [anchorNode]
          console.log('Wrapped in anchor')
        }
      }
    })
    
    console.log('=== rehypeAllHeadings: Done ===')
  }
}

export default rehypeAllHeadings