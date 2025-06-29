import type { Plugin } from 'unified'
import type { Parent, Literal } from 'unist'
import { visit } from 'unist-util-visit'
import fs from 'fs'
import path from 'path'

// Types for symbol metadata
interface SymbolMetadata {
  name: string
  type: 'function' | 'class' | 'method'
  language: string
  file: string
  line: number
  signature: string
  description: string
  code: string
  parent?: string
}

interface MetadataStore {
  [key: string]: SymbolMetadata
}

// Types for AST nodes
interface CodeNode extends Literal {
  type: 'code'
  lang?: string
  value: string
  meta?: string
}

interface TextNode extends Literal {
  type: 'text'
  value: string
}

interface MdxJsxElement extends Parent {
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement'
  name: string
  attributes: Array<{
    type: 'mdxJsxAttribute'
    name: string
    value: string | number | boolean
  }>
  children: Literal[]
}

// Global metadata store
let metadataStore: MetadataStore = {}

// Load metadata from JSON file
function loadMetadata(metadataPath: string = 'public/code_metadata.json'): MetadataStore {
  try {
    const fullPath = path.resolve(process.cwd(), metadataPath)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.warn(`Failed to load metadata from ${metadataPath}:`, error)
  }
  return {}
}

// Parse code content to find symbols
function findSymbolsInCode(code: string, language?: string): Array<{ name: string; start: number; end: number }> {
  const symbols: Array<{ name: string; start: number; end: number }> = []
  
  // For Python, look for function/class/method definitions
  if (language === 'python' || !language) {
    // Match function definitions: def function_name(...)
    const functionRegex = /\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g
    let match
    while ((match = functionRegex.exec(code)) !== null) {
      symbols.push({
        name: match[1],
        start: match.index,
        end: match.index + match[0].length
      })
    }
    
    // Match class definitions: class ClassName(...)
    const classRegex = /\bclass\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[:\(]/g
    while ((match = classRegex.exec(code)) !== null) {
      symbols.push({
        name: match[1],
        start: match.index,
        end: match.index + match[0].length
      })
    }
    
    // Match method calls: object.method_name(...)
    const methodRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g
    while ((match = methodRegex.exec(code)) !== null) {
      symbols.push({
        name: `${match[1]}.${match[2]}`,
        start: match.index,
        end: match.index + match[0].length
      })
    }
  }
  
  return symbols
}

// Create tooltip component for a symbol
function createTooltipComponent(symbolName: string, metadata: SymbolMetadata): MdxJsxElement {
  return {
    type: 'mdxJsxTextElement',
    name: 'CodeTooltip',
    attributes: [
      {
        type: 'mdxJsxAttribute',
        name: 'symbolName',
        value: symbolName
      },
      {
        type: 'mdxJsxAttribute',
        name: 'metadata',
        value: JSON.stringify(metadata)
      }
    ],
    children: [
      {
        type: 'text',
        value: symbolName
      }
    ]
  }
}

// Process code block content and create tooltip components
function processCodeBlock(node: CodeNode): (TextNode | MdxJsxElement)[] {
  if (!node.value || !node.lang) return []
  
  const symbols = findSymbolsInCode(node.value, node.lang)
  if (symbols.length === 0) return []
  
  // Sort symbols by start position (ascending)
  symbols.sort((a, b) => a.start - b.start)
  
  const components: (TextNode | MdxJsxElement)[] = []
  let lastIndex = 0
  
  for (const symbol of symbols) {
    const metadata = metadataStore[symbol.name]
    if (!metadata) continue
    
    // Add text before the symbol
    if (symbol.start > lastIndex) {
      const beforeText = node.value.substring(lastIndex, symbol.start)
      if (beforeText) {
        components.push({
          type: 'text',
          value: beforeText
        } as TextNode)
      }
    }
    
    // Add the tooltip component
    components.push(createTooltipComponent(symbol.name, metadata))
    
    lastIndex = symbol.end
  }
  
  // Add remaining text
  if (lastIndex < node.value.length) {
    const afterText = node.value.substring(lastIndex)
    if (afterText) {
      components.push({
        type: 'text',
        value: afterText
      } as TextNode)
    }
  }
  
  return components
}

// Main plugin function
const remarkCodeTooltip: Plugin<[{ metadataPath?: string }], Parent> = (options = {}) => {
  const { metadataPath } = options
  
  return (tree) => {
    // Load metadata at the start
    metadataStore = loadMetadata(metadataPath)
    
    // Visit all code blocks
    visit(tree, 'code', (node: CodeNode, index, parent) => {
      if (!parent) return
      
      const tooltipComponents = processCodeBlock(node)
      if (tooltipComponents.length > 0) {
        // Replace the code node with the processed components
        ;(parent as Parent).children.splice(index, 1, ...tooltipComponents)
      }
    })
  }
}

export default remarkCodeTooltip
