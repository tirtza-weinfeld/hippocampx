import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, List, ListItem, Paragraph, Text, Blockquote } from 'mdast'
import type { VFile } from 'vfile'
import { unified } from 'unified'
import remarkParse from 'remark-parse'

// Plugin that processes ordered lists to handle custom numbering patterns
// Handles "1.1. Item" as nested lists with decimal numbering in SVG markers
const remarkListVariants: Plugin<[], Root> = () => {
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
            // Add more cases as needed for other inline elements
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
            // Add more cases as needed for other inline elements
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
        // Add more cases as needed
        default:
          // For unknown types, try to extract text if available
          if ('value' in child && typeof child.value === 'string') {
            result += child.value
          }
      }
    }
    
    return result
  }

  // Shared function to process feature list lines with proper nesting
  const createFeatureListFromLines = (featureLines: string[]): List => {
    const processedItems: ListItem[] = []
    const lineParser = unified().use(remarkParse)
    
    // Group lines into feature list items (~ line + continuation lines) with proper nesting
    let i = 0
    while (i < featureLines.length) {
      const line = featureLines[i]
      const trimmed = line.trim()
      
      if (trimmed.startsWith('~ ')) {
        // Start of a new feature item
        const featureItemLines = [line]
        const indentLevel = line.length - line.trimStart().length
        i++
        
        // Collect continuation lines until next ~ or end
        while (i < featureLines.length) {
          const nextLine = featureLines[i]
          const nextTrimmed = nextLine.trim()
          
          if (nextTrimmed.startsWith('~ ')) {
            // Next feature item found, stop collecting
            break
          } else if (nextTrimmed || nextLine.startsWith(' ') || nextLine.startsWith('\t')) {
            // Continuation line (non-empty or indented)
            featureItemLines.push(nextLine)
            i++
          } else {
            // Empty line - could be end of item or just spacing
            // For now, include it and let the parser handle it
            featureItemLines.push(nextLine)
            i++
          }
        }
        
        // Parse the complete feature item content
        const firstLine = featureItemLines[0]
        const trimmedFirstLine = firstLine.trim()
        const contentFromFirstLine = trimmedFirstLine.substring(2) // Remove "~ " from trimmed first line
        
        // For continuation lines, preserve their relative indentation but remove the base indentation
        const continuationLines = featureItemLines.slice(1).map(line => {
          if (line.trim()) {
            // Remove the same base indentation level as the first line
            const baseIndent = firstLine.length - firstLine.trimStart().length
            return line.substring(Math.min(baseIndent, line.length - line.trimStart().length))
          }
          return line
        })
        
        const content = [contentFromFirstLine, ...continuationLines].join('\n')
        

        
        // Parse as full markdown to allow nested lists and other structures
        let listItemChildren: any[]
        try {
          // Fix line structure to ensure proper markdown parsing
          const lines = content.split('\n')
          const processedLines = []
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const trimmed = line.trim()
            
            if (i === 0) {
              // First line: if it doesn't end with proper punctuation or break, add one
              processedLines.push(line)
            } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.match(/^\d+\. /)) {
              // This is a list marker line - normalize indentation for proper markdown parsing
              const currentIndent = line.length - line.trimStart().length
              const nestedListIndent = 2  // Markdown requires exactly 2 spaces for nested lists
              
              // DON'T add blank lines before nested lists within feature items
              // This ensures proper markdown parsing of nested lists
              
              // Always normalize to exactly 2 spaces for nested list items
              if (currentIndent > 0) {
                processedLines.push(' '.repeat(nestedListIndent) + trimmed)
              } else {
                // Top-level list item (shouldn't happen in feature content, but handle it)
                processedLines.push(trimmed)
              }
            } else if (trimmed.startsWith('*') && !trimmed.startsWith('* ')) {
              // This is emphasized text starting with *, not a list - keep as is
              processedLines.push(line)
            } else {
              // Regular continuation line
              processedLines.push(line)
            }
          }
          
          const tempMarkdown = processedLines.join('\n') + '\n'

          const tempTree = lineParser.parse(tempMarkdown) as Root
          

          
          // Use all the parsed children, not just the first paragraph
          listItemChildren = tempTree.children.length > 0 ? tempTree.children : [
            {
              type: 'paragraph',
              children: [{ type: 'text', value: content } as Text]
            } as Paragraph
          ]
        } catch (error) {
          listItemChildren = [
            {
              type: 'paragraph',
              children: [{ type: 'text', value: content } as Text]
            } as Paragraph
          ]
        }

        const listItem: ListItem = {
          type: 'listItem',
          children: listItemChildren
        }
        
        
        // Handle nesting - if indented, add to previous item
        if (indentLevel > 0 && processedItems.length > 0) {
          const previousItem = processedItems[processedItems.length - 1]
          
          // Create or find nested list in previous item
          let nestedList = previousItem.children.find(child => child.type === 'list') as List
          if (!nestedList) {
            nestedList = {
              type: 'list',
              ordered: false,
              children: [],
              data: {
                hProperties: {
                  'data-list-type': 'feature'
                }
              } as any
            }
            previousItem.children.push(nestedList)
          }
          
          nestedList.children.push(listItem)
        } else {
          processedItems.push(listItem)
        }
      } else {
        // Non-feature line in feature list context - skip or handle as needed
        i++
      }
    }
    
    return {
      type: 'list',
      ordered: false,
      children: processedItems,
      data: {
        hProperties: {
          'data-list-type': 'feature'
        }
      } as any
    }
  }

  // Return a transformer function that processes the tree
  const transformer = (tree: Root, file: VFile) => {
    
    // NEW: Detect and transform feature/task patterns in list items
    visit(tree, 'listItem', (listItem: ListItem, index, parent) => {
      if (!parent || index === undefined) return
      
      const paragraph = listItem.children[0]
      if (!paragraph || paragraph.type !== 'paragraph') return

      // Reconstruct full text from all paragraph children to handle cases where
      // content starts with emphasis/code (like "~  *[8:]starts*")
      const fullText = reconstructMarkdownFromParagraph(paragraph)
      const text = fullText.trim()
      
      // Detect feature pattern: "~ Feature text"
      const featureMatch = text.match(/^~\s+(.+)/)
      if (featureMatch) {
        // Preserve all original listItem children, but update the first paragraph
        const updatedChildren = listItem.children.map((child, childIndex) => {
          if (childIndex === 0 && child.type === 'paragraph') {
            // Update first paragraph: remove ~ prefix but preserve all other structure
            const updatedParagraphChildren = child.children.map((pChild, pIndex) => {
              if (pIndex === 0 && pChild.type === 'text' && pChild.value.trim().startsWith('~')) {
                // Remove the ~ prefix from the first text node
                return {
                  ...pChild,
                  value: pChild.value.replace(/^\s*~\s+/, '')
                }
              }
              // Preserve all other paragraph children (emphasis, code, etc.)
              return pChild
            })
            
            return {
              ...child,
              children: updatedParagraphChildren
            }
          }
          // Preserve all other children (nested lists, etc.)
          return child
        })
        
        // Check for decimal patterns in the updated paragraph text
        const firstParagraph = updatedChildren[0]
        if (firstParagraph && firstParagraph.type === 'paragraph') {
          const paragraphText = firstParagraph.children
            .map((c: any) => c.type === 'text' ? c.value : '')
            .join('')
          
          const lines = paragraphText.split('\n')
          const decimalLines: Array<{line: string, number: string, text: string}> = []
          const regularLines: string[] = []
          
          for (const line of lines) {
            const trimmedLine = line.trim()
            const decimalMatch = trimmedLine.match(/^(\d+\.\d+)\.\s+~\s+(.*)/);
            
            if (decimalMatch) {
              const [, number, itemText] = decimalMatch
              decimalLines.push({ line: trimmedLine, number, text: itemText })
            } else if (trimmedLine) {
              regularLines.push(line)
            }
          }
          
          // If we found decimal patterns, restructure the content
          if (decimalLines.length > 0) {
            // Update the main paragraph to only include non-decimal lines
            const mainText = regularLines.join('\n').trim()
            const updatedFirstParagraph = {
              ...firstParagraph,
              children: [
                {
                  type: 'text',
                  value: mainText
                } as any
              ]
            }
            
            // Create nested list for decimal feature items
            const nestedListItems = decimalLines.map(({ number, text }) => ({
              type: 'mdxJsxFlowElement',
              name: 'FeatureItem',
              attributes: [
                {
                  type: 'mdxJsxAttribute',
                  name: 'customNumber',
                  value: {
                    type: 'mdxJsxAttributeValueExpression',
                    value: `"${number}"`,
                    data: {
                      estree: {
                        type: 'Program',
                        body: [
                          {
                            type: 'ExpressionStatement',
                            expression: {
                              type: 'Literal',
                              value: number,
                              raw: `"${number}"`
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ],
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: text
                    }
                  ]
                }
              ],
              data: {
                customNumber: number,
                hProperties: {
                  'data-custom-number': number
                }
              }
            }))
            
            const nestedList = {
              type: 'list',
              ordered: true,
              children: nestedListItems,
              data: {
                isDecimalList: true,
                hProperties: {
                  'data-is-decimal-list': 'true'
                }
              }
            } as any
            
            // Replace the children with updated paragraph + nested list
            updatedChildren[0] = updatedFirstParagraph
            updatedChildren.push(nestedList)
          }
        }
        
        // Create FeatureItem JSX element with processed children
        const featureElement = {
          type: 'mdxJsxFlowElement',
          name: 'FeatureItem',
          attributes: [],
          children: updatedChildren
        }
        
        // Replace the listItem with FeatureItem
        parent.children[index] = featureElement as any
        return
      }
      
      // Detect task patterns: "[ ] Task text" or "[x] Task text"
      const taskMatch = text.match(/^\[([x\sX-])\]\s+(.+)/)
      if (taskMatch) {
        const [, checkState] = taskMatch
        const isChecked = checkState.toLowerCase() === 'x' || checkState === '-'
        
        // Preserve all original listItem children, but update the first paragraph
        const updatedChildren = listItem.children.map((child, childIndex) => {
          if (childIndex === 0 && child.type === 'paragraph') {
            // Update first paragraph: remove [ ] prefix but preserve all other structure
            const updatedParagraphChildren = child.children.map((pChild, pIndex) => {
              if (pIndex === 0 && pChild.type === 'text' && pChild.value.trim().match(/^\[([x\sX-])\]/)) {
                // Remove the [ ] prefix from the first text node
                return {
                  ...pChild,
                  value: pChild.value.replace(/^\s*\[([x\sX-])\]\s+/, '')
                }
              }
              // Preserve all other paragraph children (emphasis, code, etc.)
              return pChild
            })
            
            return {
              ...child,
              children: updatedParagraphChildren
            }
          }
          // Preserve all other children (nested lists, etc.)
          return child
        })
        
        // Create TaskItem JSX element with preserved children
        const taskElement = {
          type: 'mdxJsxFlowElement',
          name: 'TaskItem',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'checked',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: isChecked.toString(),
                data: {
                  estree: {
                    type: 'Program',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'Literal',
                          value: isChecked,
                          raw: isChecked.toString()
                        }
                      }
                    ]
                  }
                }
              }
            }
          ],
          children: updatedChildren
        }
        
        // Replace the listItem with TaskItem
        parent.children[index] = taskElement as any
        return
      }
      
      // If no special pattern, keep as regular ListItem (no transformation needed)
    })
    
    // Convert decimal patterns in paragraph text to nested lists
    // BUT only for regular listItems, not FeatureItems (they handle their own decimals)
    visit(tree, 'listItem', (listItem: ListItem, index, parent) => {
      // Skip if this listItem was already transformed to FeatureItem or TaskItem
      if (!parent || !parent.children || index === undefined || parent.children[index] !== listItem) {
        return // This listItem was replaced by FeatureItem/TaskItem, skip processing
      }
      const paragraph = listItem.children[0]
      if (!paragraph || paragraph.type !== 'paragraph') return

      const textNode = paragraph.children[0]
      if (!textNode || textNode.type !== 'text') return

      const text = textNode.value
      const lines = text.split('\n')
      
      // Check if we have decimal patterns in the text
      const decimalLines: Array<{line: string, number: string, text: string}> = []
      const regularLines: string[] = []
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        const decimalMatch = trimmedLine.match(/^(\d+\.\d+)\.\s+(.*)/)
        
        if (decimalMatch) {
          const [, number, itemText] = decimalMatch
          decimalLines.push({ line: trimmedLine, number, text: itemText })
        } else if (trimmedLine) {
          regularLines.push(trimmedLine)
        }
      }
      
      // If we found decimal patterns, restructure
      if (decimalLines.length > 0) {
        // Update the main text to only include non-decimal lines
        textNode.value = regularLines.join('\n').trim()
        
        // Create nested list for decimal items
        const nestedListItems: ListItem[] = decimalLines.map(({ number, text }) => ({
          type: 'listItem',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: text
                } as Text
              ]
            } as Paragraph
          ],
          data: {
            customNumber: number, // Store the decimal number for display
            hProperties: {
              'data-custom-number': number
            }
          } as any
        }))

        const nestedList: List = {
          type: 'list',
          ordered: true,
          children: nestedListItems,
          data: {
            isDecimalList: true, // Mark as decimal list for special handling
            hProperties: {
              'data-is-decimal-list': 'true'
            }
          } as any
        }

        // Add the nested list to the list item
        listItem.children.push(nestedList)
      }
    })

    // Helper function to process feature lists in paragraphs
    const processFeatureListParagraphs = (container: Root | Blockquote, file: VFile) => {
      visit(container, 'paragraph', (node: Paragraph, index, parent) => {
        if (!parent || index === undefined) return
        
        // Skip paragraphs inside blockquotes when processing at root level
        if (container.type === 'root' && parent.type === 'blockquote') {
          return
        }
        
        // Check if this paragraph contains feature list items (lines starting with ~)  
        const fullText = reconstructMarkdownFromParagraph(node)
        const lines = fullText.split('\n')
        const featureLines = lines.filter(line => line.trim().startsWith('~ '))
        
                if (featureLines.length > 0) {
          // Use position information to get original source with preserved indentation
          let originalLines = lines

          
          if (node.position && file.value) {
            const source = String(file.value)
            const sourceLines = source.split('\n')
            let startLine = node.position.start.line - 1 // Convert to 0-based
            let endLine = node.position.end.line - 1
            
            
                        // NEW APPROACH: Collect sibling AST nodes directly
            const siblingNodesToInclude: any[] = []
            
            for (let j = index + 1; j < parent.children.length; j++) {
              const siblingNode = parent.children[j]
              
              // Stop if we hit another feature list
              if (siblingNode.type === 'paragraph' && 
                  reconstructMarkdownFromParagraph(siblingNode as Paragraph).trim().startsWith('~ ')) {
                break
              }
              
              // Include paragraphs and lists as part of the feature item
              if (siblingNode.type === 'paragraph' || siblingNode.type === 'list') {
                siblingNodesToInclude.push(siblingNode)
              } else {
                // Hit something else, stop collecting
                break
              }
            }
            
            // Create feature list item directly from AST nodes
            if (siblingNodesToInclude.length > 0) {
              
              // Get the main paragraph content (without the ~ marker)
              const featureText = reconstructMarkdownFromParagraph(node)
              const cleanText = featureText.replace(/^~ /, '').trim()
              
              // Parse just the main text to get proper paragraph structure
              const lineParser = unified().use(remarkParse)
              const tempTree = lineParser.parse(cleanText + '\n') as Root
              const mainParagraph = tempTree.children.find(child => child.type === 'paragraph') as Paragraph
              
              // Create list item with main paragraph + sibling nodes
              const listItemChildren = mainParagraph ? [mainParagraph, ...siblingNodesToInclude] : siblingNodesToInclude
              
              const listItem: ListItem = {
                type: 'listItem',
                children: listItemChildren
              }
              
              
              const featureList = {
                type: 'list',
                ordered: false,
                children: [listItem],
                data: {
                  hProperties: {
                    'data-list-type': 'feature'
                  }
                }
              } as any
              
              // Replace this paragraph and remove sibling nodes  
              parent.children.splice(index, 1 + siblingNodesToInclude.length, featureList)
              
              return // Skip the original complex processing
            }
            
            // Fallback to original approach if no siblings
            let siblingNodesToIncludeCount = 0
            
            if (startLine >= 0 && endLine < sourceLines.length) {
              originalLines = sourceLines.slice(startLine, endLine + 1)
              
              // If we're processing content inside a blockquote, strip the '> ' prefixes
              if (container.type === 'blockquote') {
                originalLines = originalLines.map(line => {
                  if (line.startsWith('> ')) {
                    return line.substring(2)
                  } else if (line.startsWith('>')) {
                    return line.substring(1)
                  }
                  return line
                })
              }
              

              
              // Remove the sibling nodes that we included
              if (siblingNodesToIncludeCount > 0) {
                parent.children.splice(index + 1, siblingNodesToIncludeCount)
              }
            }
          }
          
          // Check if this paragraph contains mixed content (non-feature lines + feature lines)
          // But be smart about blockquote structure - don't treat content after empty lines as mixed
          const nonFeatureLines = originalLines.filter((line, index) => {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith('~ ')) return false
            
            // If we're in a blockquote and this line comes after feature lines + empty line(s),
            // it might be separate paragraph content, not mixed content
            if (container.type === 'blockquote') {
              // Check if there are any feature lines before this line
              const hasFeatureLinesAbove = originalLines.slice(0, index).some(prevLine => 
                prevLine.trim().startsWith('~ ')
              )
              
              if (hasFeatureLinesAbove) {
                // Check if there's an empty line separating this from feature content
                let separatorIndex = index - 1
                while (separatorIndex >= 0 && !originalLines[separatorIndex].trim()) {
                  separatorIndex--
                }
                
                // If the last non-empty line before this was a feature line, 
                // and there's empty line(s) in between, treat as separate content
                if (separatorIndex >= 0 && originalLines[separatorIndex].trim().startsWith('~ ')) {
                  return false // Don't treat as mixed content
                }
              }
            }
            
            return true // This is mixed content
          })
          
          // console.log('🐛 DEBUG: Non-feature lines detected:', nonFeatureLines.length, nonFeatureLines)
          
          if (nonFeatureLines.length > 0) {
            // Mixed content: split into separate elements
            const newElements: Array<Paragraph | List> = []
            
            // Parse each line and group consecutive similar types
            let currentParagraphLines: string[] = []
            let currentFeatureLines: string[] = []
            
            const flushParagraph = () => {
              if (currentParagraphLines.length > 0) {
                const paragraphText = currentParagraphLines.join('\n')
                // Parse the paragraph content to preserve inline formatting
                const lineParser = unified().use(remarkParse)
                try {
                  const tempTree = lineParser.parse(paragraphText + '\n') as Root
                  const tempParagraph = tempTree.children.find(child => child.type === 'paragraph') as Paragraph
                  if (tempParagraph) {
                    newElements.push(tempParagraph)
                  }
                } catch (error) {
                  // Fallback: create simple paragraph
                  newElements.push({
                    type: 'paragraph',
                    children: [{ type: 'text', value: paragraphText } as Text]
                  } as Paragraph)
                }
                currentParagraphLines = []
              }
            }
            
            const flushFeatureList = () => {
              if (currentFeatureLines.length > 0) {
                const featureList = createFeatureListFromLines(currentFeatureLines)
                newElements.push(featureList)
                currentFeatureLines = []
              }
            }
            
            // Process lines and group them
            let inFeatureListMode = false
            
            for (let i = 0; i < originalLines.length; i++) {
              const line = originalLines[i]
              const trimmed = line.trim()
              
              if (trimmed.startsWith('~ ')) {
                // Start of a new feature item
                flushParagraph()
                currentFeatureLines.push(line)
                inFeatureListMode = true
              } else if (inFeatureListMode) {
                // We're in feature list mode - be permissive about continuation lines
                const isEmptyLine = !trimmed
                
                if (isEmptyLine) {
                  // Check if this empty line separates feature content from regular paragraphs
                  let nextNonEmptyLineIndex = i + 1
                  while (nextNonEmptyLineIndex < originalLines.length && !originalLines[nextNonEmptyLineIndex].trim()) {
                    nextNonEmptyLineIndex++
                  }
                  const nextNonEmptyLine = nextNonEmptyLineIndex < originalLines.length ? originalLines[nextNonEmptyLineIndex] : null
                  
                  if (nextNonEmptyLine && !nextNonEmptyLine.trim().startsWith('~ ')) {
                    // Empty line followed by non-feature content - end feature mode
                    flushFeatureList()
                    inFeatureListMode = false
                  } else {
                    // Include empty line in feature content
                    currentFeatureLines.push(line)
                  }
                } else {
                  // Non-empty line - include as continuation
                  currentFeatureLines.push(line)
                }
              } else if (trimmed) {
                // Regular paragraph line
                currentParagraphLines.push(line)
              }
              // Skip empty lines when not in any mode
            }
            
            // Flush any remaining content
            flushParagraph()
            flushFeatureList()
            
            // Replace the current paragraph with the new elements
            parent.children.splice(index, 1, ...newElements)
            
          } else {
            // Pure feature list paragraph: use original lines with preserved indentation
            const featureList = createFeatureListFromLines(originalLines)
            
            // Replace this paragraph with the feature list
            parent.children[index] = featureList
            
          }
        }
      })
    }

    // Process feature lists in the root document
    processFeatureListParagraphs(tree, file)
    
    // Process feature lists inside blockquotes
    visit(tree, 'blockquote', (blockquote: Blockquote) => {
      processFeatureListParagraphs(blockquote, file)
    })

    // Handle regular start numbers for non-decimal lists AND detect restart patterns
    visit(tree, 'list', (node: List, index, parent) => {
      if (!parent || index === undefined || !node.ordered) return
      
      // console.log(`DEBUG: Processing ordered list with ${node.children.length} items`)  
      
      // Skip decimal lists (they have their own numbering)
      if ((node.data as any)?.isDecimalList) return
      // Skip feature lists
      if ((node.data as any)?.hProperties?.['data-list-type'] === 'feature') return

      // Analyze position info to reconstruct original numbering and detect restarts
      // console.log(`DEBUG: file.value type: ${typeof file.value}, has value: ${!!file.value}`)
      if (file.value && typeof file.value === 'string') {
        // console.log(`DEBUG: Source file length: ${file.value.length}`)
        const sourceLines = file.value.split('\n')
        // console.log(`DEBUG: Source lines: ${sourceLines.length}, first few: ${sourceLines.slice(0, 5).map(l => `"${l}"`).join(', ')}`)
        const originalNumbers: number[] = []
        
        // Extract original numbers from source positions
        node.children.forEach((listItem: ListItem) => {
          if (listItem.position) {
            const startLine = listItem.position.start.line - 1 // Convert to 0-based
            if (startLine >= 0 && startLine < sourceLines.length) {
              const sourceLine = sourceLines[startLine]
              const numberMatch = sourceLine.match(/^\s*(\d+)\.\s/)
              if (numberMatch) {
                originalNumbers.push(parseInt(numberMatch[1], 10))
              } else {
                originalNumbers.push(0) // Fallback
              }
            } else {
              originalNumbers.push(0) // Fallback
            }
          } else {
            originalNumbers.push(0) // Fallback
          }
        })
        
        // console.log('DEBUG: Original numbers from source:', originalNumbers)
        
        // Now detect restart patterns within this list
        for (let i = 0; i < originalNumbers.length; i++) {
          const currentNumber = originalNumbers[i]
          
          if (currentNumber === 1 && i > 0) {
            // Check if previous number was higher than 1
            let foundHigherPreviously = false
            for (let j = i - 1; j >= 0; j--) {
              if (originalNumbers[j] > 1) {
                foundHigherPreviously = true
                break
              }
            }
            
            if (foundHigherPreviously) {
              // Mark this as a restart point
              const listItem = node.children[i] as ListItem
              if (!listItem.data) listItem.data = {}
              if (!listItem.data.hProperties) listItem.data.hProperties = {}
              
              listItem.data.hProperties['data-restart-numbering'] = 'true'
              listItem.data.hProperties['data-item-number'] = '1'
              
              // Mark subsequent items in this restart sequence
              let restartSeqNumber = 2
              for (let k = i + 1; k < originalNumbers.length; k++) {
                // Stop if we hit another restart (another 1 after higher numbers)
                if (originalNumbers[k] === 1) {
                  let foundHigherBeforeThis = false
                  for (let m = k - 1; m >= 0; m--) {
                    if (originalNumbers[m] > 1) {
                      foundHigherBeforeThis = true
                      break
                    }
                  }
                  if (foundHigherBeforeThis) break // This is another restart
                }
                
                const nextItem = node.children[k] as ListItem
                if (!nextItem.data) nextItem.data = {}
                if (!nextItem.data.hProperties) nextItem.data.hProperties = {}
                
                nextItem.data.hProperties['data-item-number'] = restartSeqNumber.toString()
                restartSeqNumber++
              }
            }
          }
        }
      }

      // THIRD: Handle start numbers and clean prefixes (existing logic)
      const firstItem = node.children[0] as ListItem
      if (!firstItem?.children[0]) return
      
      const firstParagraph = firstItem.children[0] as Paragraph
      const firstText = firstParagraph?.children[0] as Text
      
      if (firstText?.type === 'text') {
        const text = firstText.value.trim()
        
        // Check for patterns like "5. Item text" (simple numbers only)
        const numberMatch = text.match(/^(\d+)\.\s+(.*)/)
        if (numberMatch) {
          const [, numberPart, textPart] = numberMatch
          
          const startNum = parseInt(numberPart, 10)
          if (startNum > 1) {
            if (!node.data) node.data = {}
            if (!node.data.hProperties) node.data.hProperties = {}
            node.data.hProperties.start = startNum
          }
          
          // Clean the number prefix from the text
          firstText.value = textPart
        }
      }
      
      // FOURTH: Clean number prefixes from ALL items (not just first)
      node.children.forEach((listItem: ListItem) => {
        const paragraph = listItem.children[0] as Paragraph
        const text = paragraph?.children[0] as Text
        
        if (text?.type === 'text') {
          const textContent = text.value.trim()
          const numberMatch = textContent.match(/^(\d+)\.\s+(.*)/)
          if (numberMatch) {
            const [, , textPart] = numberMatch
            text.value = textPart
          }
        }
      })
    })
  }

  return transformer
}

export default remarkListVariants