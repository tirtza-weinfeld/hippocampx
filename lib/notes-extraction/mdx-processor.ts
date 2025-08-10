import fs from 'fs'
import path from 'path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import type { Heading, Code, Paragraph } from 'mdast'

import type { NotesContent, CodeBlock, SearchableSection, LeetCodeProblem } from './types'
import { extractKeyTerms, extractNotations, extractCategories } from './content-extractor'

// Import the same plugins used in next.config.ts
// Let's simplify and not include the problematic plugins for now
// import remarkSmartCodeImport from '../../plugins/remark-smart-code-import/index.js'
// import remarkListVariants from '../../plugins/remark-list-variants.js'
// import { remarkGithubAlerts } from '../../plugins/remark-github-alerts.js'
// import remarkInjectToc from '../../plugins/toc-plugin.js'

/**
 * Extract LeetCode problems from raw MDX content
 */
function extractLeetCodeProblems(content: string): LeetCodeProblem[] {
  const problems: LeetCodeProblem[] = []
  const lines = content.split('\n')
  let currentSection = ''
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Track current section by looking for headings
    const headingMatch = trimmedLine.match(/^#{1,6}\s+(.+)/)
    if (headingMatch) {
      currentSection = headingMatch[1].trim()
    }
    
    // Look for LeetCode links in various formats
    let problemNumber = ""
    let problemName = ""
    let problemUrl = ""
    
    // Format 1: [36. Valid Sudoku](https://leetcode.com/problems/valid-sudoku/)
    let match = trimmedLine.match(/\[(\d+)\.\s*([^\]]+)\]\(https:\/\/leetcode\.com\/problems\/([^)]+)\)/)
    if (match) {
      [, problemNumber, problemName, ] = match
      problemUrl = `https://leetcode.com/problems/${match[3]}`
    } else {
      // Format 2: **[LeetCode 325: Maximum Size Subarray Sum Equals k](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/)**
      // Format 3: [LeetCode 1293](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/)
      match = trimmedLine.match(/\*?\*?\[(?:LeetCode\s+)?(\d+)(?:[\.\s:\-]+([^\]]*))?\]\((https:\/\/leetcode\.com\/problems\/[^)]+)\)/)
      if (match) {
        [, problemNumber, problemName = "", problemUrl] = match
        // If no name captured, extract from URL slug
        if (!problemName.trim()) {
          const urlParts = problemUrl.split('/')
          const slug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]
          problemName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }
      } else {
        // Format 4: // *[1345. Jump Game IV](https://leetcode.com/problems/jump-game-iv/)*
        match = trimmedLine.match(/\/\/\s*\*?\[(\d+)\.\s*([^\]]+)\]\((https:\/\/leetcode\.com\/problems\/[^)]+)\)/)
        if (match) {
          [, problemNumber, problemName, problemUrl] = match
        }
      }
    }
    
    if (problemNumber && problemName && problemUrl) {
      problems.push({
        number: problemNumber,
        name: problemName.trim(),
        url: problemUrl,
        section: currentSection || 'Problems',
      })
    }
  }
  
  return problems
}

/**
 * Extract text content from MDX nodes recursively
 */
function extractTextFromNode(node: any): string {
  let text = ''
  
  if (node.type === 'text') {
    text += node.value + ' '
  } else if (node.type === 'inlineCode') {
    text += node.value + ' '
  } else if (node.children) {
    for (const child of node.children) {
      text += extractTextFromNode(child)
    }
  }
  
  return text
}

/**
 * Process a single MDX file through the remark pipeline to extract content
 */
export async function processMdxFile(filePath: string): Promise<NotesContent | null> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Extract LeetCode problems from raw content first
    const leetcodeProblems = extractLeetCodeProblems(content)
    
    // Create a basic processor for now (we can add plugins later once imports are fixed)
    const processor = unified()
      .use(remarkParse)
      // .use(remarkSmartCodeImport) // TODO: Fix import and re-enable
      .use(remarkMath)
      // .use(remarkListVariants)
      .use(remarkGfm)
      // .use(remarkInjectToc)
      // .use(remarkGithubAlerts)
    
    const tree = processor.parse(content)
    await processor.run(tree)
    
    // Extract content from the processed tree
    let title = ''
    const headings: string[] = []
    let textContent = ''
    const codeBlocks: CodeBlock[] = []
    
    visit(tree, (node) => {
      if (node.type === 'heading') {
        const heading = node as Heading
        const headingText = extractTextFromNode(heading).trim()
        
        if (heading.depth === 1 && !title) {
          title = headingText
        }
        
        if (headingText) {
          headings.push(headingText)
        }
      } else if (node.type === 'paragraph') {
        const paragraph = node as Paragraph
        textContent += extractTextFromNode(paragraph) + ' '
      } else if (node.type === 'code') {
        const code = node as Code
        
        // Extract metadata about the code block
        const codeBlock: CodeBlock = {
          language: code.lang || 'text',
          content: code.value || '',
        }
        
        // Try to parse original file information from meta (before smart-code-import processed it)
        if (code.meta) {
          codeBlock.originalMeta = code.meta
          
          // Extract file source information if available
          const fileMatch = code.meta.match(/file=([^#\s]+)/)
          if (fileMatch) {
            codeBlock.fileSource = fileMatch[1]
          }
          
          // Extract function name
          const funcMatch = code.meta.match(/#func:(\w+)/)
          if (funcMatch) {
            codeBlock.functionName = funcMatch[1]
          }
          
          // Extract method name  
          const methodMatch = code.meta.match(/#method:(\w+)\.(\w+)/)
          if (methodMatch) {
            codeBlock.className = methodMatch[1]
            codeBlock.methodName = methodMatch[2]
          }
        }
        
        codeBlocks.push(codeBlock)
        
        // Include code content in searchable text, but filter out comments and docstrings
        const cleanedCode = removeCommentsAndDocstrings(code.value, code.lang || 'text')
        textContent += cleanedCode + ' '
      }
    })
    
    // Generate route from file path
    const relativePath = path.relative(process.cwd(), filePath)
    const route = '/' + relativePath
      .replace(/^app\//, '')
      .replace(/\/page\.mdx$/, '')
    
    // Extract key terms, notations, and categories using our generic extractors
    const fullText = title + ' ' + headings.join(' ') + ' ' + textContent
    const keyTerms = extractKeyTerms(fullText, title, headings)
    const notations = extractNotations(fullText)
    const categories = extractCategories(filePath)
    
    return {
      title: title || path.basename(path.dirname(filePath)),
      route,
      filePath: relativePath,
      headings,
      text: textContent.trim(),
      sections: [], // TODO: implement sections extraction
      codeBlocks,
      keyTerms,
      notations,
      categories,
      leetcodeProblems,
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error)
    return null
  }
}

/**
 * Remove comments and docstrings from code content
 * Only extracts the actual implementation code for searching
 */
function removeCommentsAndDocstrings(code: string, language: string): string {
  if (!code) return ''
  
  const lines = code.split('\n')
  const cleanedLines: string[] = []
  
  let inMultiLineComment = false
  let inDocstring = false
  let docstringDelimiter = ''
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Skip empty lines
    if (!trimmed) continue
    
    // Handle Python docstrings
    if (language === 'python' || language === 'py') {
      // Check for docstring start
      if ((trimmed.startsWith('"""') || trimmed.startsWith("'''")) && !inDocstring) {
        docstringDelimiter = trimmed.startsWith('"""') ? '"""' : "'''"
        // Single line docstring
        if (trimmed.length > 3 && trimmed.endsWith(docstringDelimiter) && trimmed !== docstringDelimiter) {
          continue // Skip entire line
        }
        inDocstring = true
        continue
      }
      
      // Check for docstring end
      if (inDocstring && trimmed.endsWith(docstringDelimiter)) {
        inDocstring = false
        continue
      }
      
      // Skip if inside docstring
      if (inDocstring) continue
      
      // Skip Python single-line comments
      if (trimmed.startsWith('#')) continue
    }
    
    // Handle JavaScript/TypeScript comments
    if (language === 'javascript' || language === 'js' || language === 'typescript' || language === 'ts') {
      // Multi-line comment start
      if (trimmed.includes('/*') && !inMultiLineComment) {
        inMultiLineComment = true
        // If comment ends on same line
        if (trimmed.includes('*/')) {
          inMultiLineComment = false
        }
        continue
      }
      
      // Multi-line comment end
      if (inMultiLineComment && trimmed.includes('*/')) {
        inMultiLineComment = false
        continue
      }
      
      // Skip if inside multi-line comment
      if (inMultiLineComment) continue
      
      // Skip single-line comments
      if (trimmed.startsWith('//')) continue
    }
    
    // Handle other common comment patterns
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('--')) {
      continue
    }
    
    // Keep the line if it's not a comment or docstring
    cleanedLines.push(line)
  }
  
  return cleanedLines.join('\n').trim()
}