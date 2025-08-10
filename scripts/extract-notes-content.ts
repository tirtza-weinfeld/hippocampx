#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { fileURLToPath } from 'url'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import type { Root, Heading, Text, Code, Paragraph } from 'mdast'
import type { VFile } from 'vfile'

// Import the same plugins used in next.config.ts
import remarkSmartCodeImport from '../plugins/remark-smart-code-import/index.js'
import remarkListVariants from '../plugins/remark-list-variants.js'
import { remarkGithubAlerts } from '../plugins/remark-github-alerts.js'
import remarkInjectToc from '../plugins/toc-plugin.js'

interface CodeBlock {
  language: string
  content: string
  originalMeta?: string
  fileSource?: string
  functionName?: string
  className?: string
  methodName?: string
}

interface NotesContent {
  title: string
  route: string
  filePath: string
  headings: string[]
  text: string
  codeBlocks: CodeBlock[]
  keyTerms: string[]
  complexity: string[]
  categories: string[]
}

interface NotesDictionary {
  [key: string]: NotesContent
}

/**
 * Extract text content from MDX nodes
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
 * Extract key terms, algorithms, and concepts from text content dynamically
 */
function extractKeyTerms(text: string, title: string, headings: string[]): string[] {
  const terms = new Set<string>()
  
  // Add the title as a key term
  if (title) {
    terms.add(title.toLowerCase())
    // Also add individual words from title
    title.split(/\s+/).forEach(word => {
      const cleaned = word.replace(/[^\w-]/g, '').toLowerCase()
      if (cleaned.length > 2) {
        terms.add(cleaned)
      }
    })
  }
  
  // Add headings as key terms
  headings.forEach(heading => {
    const cleaned = heading.replace(/[^\w\s-]/g, '').toLowerCase()
    terms.add(cleaned)
    // Also add individual words from headings
    cleaned.split(/\s+/).forEach(word => {
      if (word.length > 2) {
        terms.add(word)
      }
    })
  })
  
  // Extract commonly mentioned technical terms
  const technicalTerms = [
    // Data structures
    /\b(array|list|vector|stack|queue|heap|tree|graph|trie|hash|map)\b/gi,
    // Algorithm types
    /\b(search|sort|traversal|recursive|iterative|greedy|dynamic)\b/gi,
    // Complexity terms
    /\b(linear|logarithmic|quadratic|polynomial|exponential|constant)\b/gi,
    // Programming concepts
    /\b(pointer|index|window|prefix|suffix|substring|subarray)\b/gi,
    // Mathematical terms
    /\b(maximum|minimum|optimal|distance|path|weight|cost)\b/gi,
  ]
  
  for (const pattern of technicalTerms) {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(match => terms.add(match.toLowerCase().trim()))
    }
  }
  
  // Extract capitalized terms (likely algorithm names or proper nouns)
  const capitalizedTerms = text.match(/\b[A-Z][a-z]+(?:[- ]?[A-Z][a-z]+)*\b/g)
  if (capitalizedTerms) {
    capitalizedTerms.forEach(term => {
      if (term.length > 2 && !['The', 'And', 'For', 'With'].includes(term)) {
        terms.add(term.toLowerCase())
      }
    })
  }
  
  // Extract function names from code (camelCase or snake_case)
  const functionNames = text.match(/\b[a-z][a-zA-Z0-9_]*[A-Z][a-zA-Z0-9_]*\b|\b[a-z][a-z0-9]*_[a-z0-9_]+\b/g)
  if (functionNames) {
    functionNames.forEach(name => terms.add(name.toLowerCase()))
  }
  
  return Array.from(terms)
}

/**
 * Extract complexity notations from text
 */
function extractComplexity(text: string): string[] {
  const complexityPatterns = [
    /O\([^)]+\)/g,
    /Ω\([^)]+\)/g,
    /Θ\([^)]+\)/g,
    /\$O\([^)]+\)\$/g,
    /\$\\?O\([^)]+\)\$/g,
  ]
  
  const complexities = new Set<string>()
  
  for (const pattern of complexityPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      for (const match of matches) {
        // Clean up LaTeX formatting
        const cleaned = match.replace(/\$|\\?/g, '').trim()
        complexities.add(cleaned)
      }
    }
  }
  
  return Array.from(complexities)
}

/**
 * Determine categories based on file path
 */
function determineCategories(filePath: string): string[] {
  const categories = new Set<string>()
  
  // Path-based categories (use folder name)
  const pathSegments = filePath.split('/')
  const folderName = pathSegments[pathSegments.length - 2] // Get folder name before page.mdx
  
  if (folderName && folderName !== 'notes') {
    categories.add(folderName)
  }
  
  return Array.from(categories)
}

/**
 * Process a single MDX file through the remark pipeline
 */
async function processMarkdownFile(filePath: string): Promise<NotesContent | null> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Create the same processor used in next.config.ts
    const processor = unified()
      .use(remarkParse)
      .use(remarkSmartCodeImport) // This resolves the file= imports!
      .use(remarkMath)
      .use(remarkListVariants)
      .use(remarkGfm)
      .use(remarkInjectToc)
      .use(remarkGithubAlerts)
    
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
        
        // Also include code content in searchable text
        textContent += code.value + ' '
      }
    })
    
    // Generate route from file path
    const relativePath = path.relative(process.cwd(), filePath)
    const route = '/' + relativePath
      .replace(/^app\//, '')
      .replace(/\/page\.mdx$/, '')
    
    // Extract key terms, complexity, and categories
    const fullText = title + ' ' + headings.join(' ') + ' ' + textContent
    const keyTerms = extractKeyTerms(fullText, title, headings)
    const complexity = extractComplexity(fullText)
    const categories = determineCategories(filePath)
    
    return {
      title: title || path.basename(path.dirname(filePath)),
      route,
      filePath: relativePath,
      headings,
      text: textContent.trim(),
      codeBlocks,
      keyTerms,
      complexity,
      categories,
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error)
    return null
  }
}

/**
 * Main extraction function
 */
async function extractNotesContent(): Promise<void> {
  try {
    // Find all MDX files in the notes directory
    const notesDir = path.join(process.cwd(), 'app/notes')
    const mdxFiles = await glob('**/page.mdx', { cwd: notesDir, absolute: true })
    
    console.log(`Found ${mdxFiles.length} MDX files to process...`)
    
    const dictionary: NotesDictionary = {}
    
    // Process each file
    for (const filePath of mdxFiles) {
      console.log(`Processing: ${path.relative(process.cwd(), filePath)}`)
      
      const content = await processMarkdownFile(filePath)
      if (content) {
        // Use the folder name as the key
        const key = path.basename(path.dirname(filePath))
        dictionary[key] = content
        
        console.log(`  ✓ Extracted: ${content.title}`)
        console.log(`    - ${content.headings.length} headings`)
        console.log(`    - ${content.codeBlocks.length} code blocks`)
        console.log(`    - ${content.keyTerms.length} key terms: ${content.keyTerms.join(', ')}`)
        console.log(`    - Categories: ${content.categories.join(', ')}`)
      }
    }
    
    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), 'lib/extracted-metadata')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // Write the dictionary to JSON
    const outputPath = path.join(outputDir, 'notes_dictionary.json')
    fs.writeFileSync(outputPath, JSON.stringify(dictionary, null, 2))
    
    console.log(`\n✅ Successfully extracted content for ${Object.keys(dictionary).length} notes`)
    console.log(`📝 Output written to: ${path.relative(process.cwd(), outputPath)}`)
    
  } catch (error) {
    console.error('Error during extraction:', error)
    process.exit(1)
  }
}

// Run the extraction if this is the main module
const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) {
  extractNotesContent()
}

export { extractNotesContent }