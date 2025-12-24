import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, ListItem, Paragraph } from 'mdast'

// Plugin that ONLY detects feature/task patterns and adds data attributes + strips prefixes
// NO AST transformations - just marking and cleaning
const remarkFeatureList: Plugin<[], Root> = () => {
  
  // Helper function to reconstruct markdown text from paragraph children
  const reconstructMarkdownFromParagraph = (paragraph: Paragraph): string => {
    let result = ''
    
    for (const child of paragraph.children) {
      switch (child.type) {
        case 'text':
          result += child.value
          break
        case 'emphasis':
          result += '*'
          for (const emphChild of child.children) {
            if (emphChild.type === 'text') {
              result += emphChild.value
            } else if (emphChild.type === 'inlineCode') {
              result += '`' + emphChild.value + '`'
            }
          }
          result += '*'
          break
        case 'strong':
          result += '**'
          for (const strongChild of child.children) {
            if (strongChild.type === 'text') {
              result += strongChild.value
            } else if (strongChild.type === 'inlineCode') {
              result += '`' + strongChild.value + '`'
            }
          }
          result += '**'
          break
        case 'inlineCode':
          result += '`' + child.value + '`'
          break
        case 'link':
          result += '['
          for (const linkChild of child.children) {
            if (linkChild.type === 'text') {
              result += linkChild.value
            }
          }
          result += '](' + child.url + ')'
          break
        default:
          if ('value' in child && typeof child.value === 'string') {
            result += child.value
          }
      }
    }
    
    return result
  }

  return (tree: Root) => {
    // Detect and mark feature patterns: "~ Feature text"
    visit(tree, 'listItem', (listItem: ListItem, index, parent) => {
      if (!parent || index === undefined) return

      const paragraph = listItem.children[0]
      if (paragraph.type !== 'paragraph') return

      const fullText = reconstructMarkdownFromParagraph(paragraph)
      const text = fullText.trim()
      
      // Detect feature pattern: "~ Feature text"
      const featureMatch = text.match(/^~\s+(.+)/)
      if (featureMatch) {
        // Mark parent list as feature list
        if (!parent.data) parent.data = {}
        if (!parent.data.hProperties) parent.data.hProperties = {}
        parent.data.hProperties['data-list-type'] = 'feature'
        
        // Mark this item as feature item
        if (!listItem.data) listItem.data = {}
        if (!listItem.data.hProperties) listItem.data.hProperties = {}
        listItem.data.hProperties['data-item-type'] = 'feature'
        
        // Strip ~ prefix from first text node
        const updatedChildren = listItem.children.map((child, childIndex) => {
          if (childIndex === 0 && child.type === 'paragraph') {
            const updatedParagraphChildren = child.children.map((pChild, pIndex) => {
              if (pIndex === 0 && pChild.type === 'text' && pChild.value.trim().startsWith('~')) {
                return {
                  ...pChild,
                  value: pChild.value.replace(/^\s*~\s+/, '')
                }
              }
              return pChild
            })
            
            return {
              ...child,
              children: updatedParagraphChildren
            }
          }
          return child
        })
        
        listItem.children = updatedChildren
        return
      }
      
      // Detect task patterns: "[ ] Task text" or "[x] Task text"
      const taskMatch = text.match(/^\[([x\sX-])\]\s+(.+)/)
      if (taskMatch) {
        const [, checkState] = taskMatch
        const isChecked = checkState.toLowerCase() === 'x' || checkState === '-'
        
        // Mark parent list as task list
        if (!parent.data) parent.data = {}
        if (!parent.data.hProperties) parent.data.hProperties = {}
        parent.data.hProperties['data-list-type'] = 'task'
        
        // Mark this item as task item
        if (!listItem.data) listItem.data = {}
        if (!listItem.data.hProperties) listItem.data.hProperties = {}
        listItem.data.hProperties['data-item-type'] = 'task'
        listItem.data.hProperties['data-task-checked'] = isChecked.toString()
        
        // Strip [ ] prefix from first text node
        const updatedChildren = listItem.children.map((child, childIndex) => {
          if (childIndex === 0 && child.type === 'paragraph') {
            const updatedParagraphChildren = child.children.map((pChild, pIndex) => {
              if (pIndex === 0 && pChild.type === 'text' && pChild.value.trim().match(/^\[([x\sX-])\]/)) {
                return {
                  ...pChild,
                  value: pChild.value.replace(/^\s*\[([x\sX-])\]\s+/, '')
                }
              }
              return pChild
            })
            
            return {
              ...child,
              children: updatedParagraphChildren
            }
          }
          return child
        })
        
        listItem.children = updatedChildren
      }
    })
  }
}

export default remarkFeatureList