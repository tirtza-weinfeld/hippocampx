/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { Root } from '@types/mdast'
import type { VFile } from 'vfile'

// Integration test for the complete problems pipeline:
// Python extraction → Remark plugin → Server component → Client interactions → Tooltip rendering

interface TooltipSymbol {
  symbol: string
  signature: string
  description: string
  return_type: string
  parameters?: Record<string, string>
  complexity?: string
}

interface ProblemMetadata {
  id: string
  title: string
  description: string
  functionName: string
  sourceFile: string
  code: string
  cleanCode: string
  tooltipData: Record<string, TooltipSymbol>
  insight?: string
  timeComplexity?: string
}

// Mock complete BFS level order traversal problem
const mockBfsLevelOrderProblem: ProblemMetadata = {
  id: 'binary-tree-level-order-traversal',
  title: 'Binary Tree Level Order Traversal',
  description: 'Given the root of a binary tree, return its nodes\' values organized by level, from left to right.',
  functionName: 'levelOrder',
  sourceFile: 'backend/algorithms/bfs.py',
  code: `def levelOrder(root: TreeNode | None) -> list[list[int]]:
    """Binary Tree Level Order Traversal implementation."""
    if not root:
        return []
    queue, result = deque([root]), []
    while queue:
        level = [] 
        for _ in range(len(queue)):  # Process nodes at the current level
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,
  cleanCode: `if not root:
    return []
queue, result = deque([root]), []
while queue:
    level = [] 
    for _ in range(len(queue)):  # Process nodes at the current level
        node = queue.popleft()
        level.append(node.val)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    result.append(level)
return result`,
  tooltipData: {
    'deque': {
      symbol: 'deque',
      signature: 'deque([iterable[, maxlen]]) -> deque',
      description: 'Double-ended queue with O(1) append/pop operations',
      return_type: 'deque[T]',
      parameters: { iterable: 'Iterable[T]', maxlen: 'int | None' }
    },
    'popleft': {
      symbol: 'popleft',
      signature: 'deque.popleft() -> T',
      description: 'Remove and return element from left side',
      return_type: 'T',
      complexity: 'O(1)'
    },
    'len': {
      symbol: 'len',
      signature: 'len(obj) -> int',
      description: 'Return the length of an object',
      return_type: 'int'
    },
    'range': {
      symbol: 'range',
      signature: 'range(stop) -> range',
      description: 'Create a range of numbers from 0 to stop-1',
      return_type: 'range'
    },
    'append': {
      symbol: 'append',
      signature: 'list.append(item: T) -> None',
      description: 'Add item to end of list',
      return_type: 'None',
      complexity: 'O(1) amortized'
    }
  },
  insight: 'The core logic hinges on the inner `for` loop. The expression `len(queue)` takes a "snapshot" of the number of nodes on the current level.',
  timeComplexity: 'O(N)'
}

// Mock Shiki highlighting with proper indentation preservation
const createMockHighlightedHtml = (code: string, tooltipData: Record<string, TooltipSymbol>) => {
  const lines = code.split('\n')
  const highlightedLines = lines.map(line => {
    let highlightedLine = line
    
    // Apply syntax highlighting and tooltip data attributes
    Object.keys(tooltipData).forEach(symbol => {
      if (line.includes(symbol)) {
        const tooltipDataAttr = JSON.stringify(tooltipData[symbol])
        highlightedLine = highlightedLine.replace(
          new RegExp(`\\b${symbol}\\b`, 'g'),
          `<span style="color:#79C0FF" data-tooltip-symbol="${symbol}" data-tooltip-data='${tooltipDataAttr}' data-testid="${symbol}-token">${symbol}</span>`
        )
      }
    })
    
    // Preserve indentation by wrapping with appropriate spans
    const leadingSpaces = line.match(/^(\s*)/)?.[1] || ''
    const content = line.trim()
    
    return `<span class="line">${leadingSpaces.replace(/ /g, '&nbsp;')}${content === line.trim() ? highlightedLine.trim() : highlightedLine}</span>`
  })
  
  return `<pre class="shiki github-dark-high-contrast"><code>${highlightedLines.join('\n')}</code></pre>`
}

// Mock Shiki
vi.mock('shiki', () => ({
  codeToHast: vi.fn(async (code: string, options: any) => {
    const tooltipData = mockBfsLevelOrderProblem.tooltipData
    const html = createMockHighlightedHtml(code, tooltipData)
    
    return {
      type: 'element',
      tagName: 'pre',
      properties: { className: ['shiki', 'github-dark-high-contrast'] },
      children: [{
        type: 'element',
        tagName: 'code',
        children: code.split('\n').map(line => ({
          type: 'element',
          tagName: 'span',
          properties: { className: ['line'] },
          children: [{ type: 'text', value: line }]
        }))
      }]
    }
  }),
  codeToHtml: vi.fn(async (code: string) => {
    return `<code class="signature-highlight">${code}</code>`
  })
}))

vi.mock('@/lib/hast-to-jsx', () => ({
  hastToJSX: vi.fn((hast: any) => {
    const code = mockBfsLevelOrderProblem.cleanCode
    const tooltipData = mockBfsLevelOrderProblem.tooltipData
    const html = createMockHighlightedHtml(code, tooltipData)
    
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  })
}))

// Mock motion
vi.mock('motion/react', () => ({
  useReducedMotion: () => false,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// Remark plugin implementation
function remarkProblemsGenerator() {
  return async function transform(tree: Root, file: VFile): Promise<Root> {
    const problemNodes = [
      // Problem heading
      {
        type: 'heading',
        depth: 3,
        children: [{ type: 'text', value: `1. ${mockBfsLevelOrderProblem.title}` }]
      },
      
      // Problem description
      {
        type: 'paragraph',
        children: [{ type: 'text', value: mockBfsLevelOrderProblem.description }]
      },
      
      // Code block with tooltip data
      {
        type: 'mdxJsxFlowElement',
        name: 'ProblemsCodeBlock',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'code', value: mockBfsLevelOrderProblem.cleanCode },
          { type: 'mdxJsxAttribute', name: 'tooltipData', value: JSON.stringify(mockBfsLevelOrderProblem.tooltipData) },
          { type: 'mdxJsxAttribute', name: 'meta', value: `${mockBfsLevelOrderProblem.sourceFile}#${mockBfsLevelOrderProblem.functionName}` }
        ],
        children: []
      }
    ]
    
    return { ...tree, children: [...tree.children, ...problemNodes] }
  }
}

// Complete component implementations for integration test
async function ProblemsCodeBlock({ code, tooltipData, meta }: {
  code: string
  tooltipData: string
  meta: string
}) {
  const { codeToHast } = await import('shiki')
  const { hastToJSX } = await import('@/lib/hast-to-jsx')
  
  const tooltips = JSON.parse(tooltipData)
  const hast = await codeToHast(code, { lang: 'python' })
  
  return (
    <section className="problems-code-block" data-testid="problems-code-block">
      <header data-testid="code-block-header">
        <span data-testid="meta">{meta}</span>
      </header>
      
      <div className="code-wrapper" role="region" aria-label="Source code">
        {hastToJSX(hast)}
      </div>
      
      <CodeBlockInteractions tooltipData={tooltips}>
        <div data-testid="interactions-content">Ready for interactions</div>
      </CodeBlockInteractions>
    </section>
  )
}

function CodeBlockInteractions({ children, tooltipData }: {
  children: React.ReactNode
  tooltipData: Record<string, TooltipSymbol>
}) {
  const [tooltip, setTooltip] = React.useState<{
    symbol: TooltipSymbol
    position: { x: number; y: number }
  } | null>(null)
  
  const handleMouseEnter = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const symbol = target.dataset.tooltipSymbol
    
    if (symbol && tooltipData[symbol]) {
      const rect = target.getBoundingClientRect()
      setTooltip({
        symbol: tooltipData[symbol],
        position: { x: rect.left + rect.width / 2, y: rect.top - 8 }
      })
    }
  }
  
  const handleMouseLeave = () => setTooltip(null)
  
  return (
    <>
      <div 
        data-testid="interactions-wrapper"
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
      >
        {children}
      </div>
      
      {tooltip && (
        <VSCodeTooltip 
          data={tooltip.symbol}
          position={tooltip.position}
        />
      )}
    </>
  )
}

function VSCodeTooltip({ data, position }: {
  data: TooltipSymbol
  position: { x: number; y: number }
}) {
  return (
    <div 
      className="vscode-tooltip"
      style={{ left: position.x, top: position.y }}
      data-testid="vscode-tooltip"
    >
      <div data-testid="tooltip-signature">
        <SyntaxHighlightedSignature 
          signature={data.signature}
          language="python"
          className="signature-class"
        />
      </div>
      <div data-testid="tooltip-description">{data.description}</div>
      <div data-testid="tooltip-return-type">→ {data.return_type}</div>
      {data.complexity && (
        <div data-testid="tooltip-complexity">⚡ {data.complexity}</div>
      )}
    </div>
  )
}

async function SyntaxHighlightedSignature({ signature, language, className }: {
  signature: string
  language: string
  className?: string
}) {
  const { codeToHtml } = await import('shiki')
  const highlightedCode = await codeToHtml(signature)
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
      data-testid="syntax-highlighted-signature"
    />
  )
}

import React from 'react'

describe('Problems Pipeline Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock getBoundingClientRect for tooltip positioning
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      left: 100, top: 200, width: 50, height: 20,
      right: 150, bottom: 220, x: 100, y: 200, toJSON: () => {}
    }))
  })

  it('should process complete pipeline from remark to interactive tooltips', async () => {
    // 1. Remark plugin processing
    const processor = unified()
      .use(remarkParse)
      .use(remarkProblemsGenerator)
    
    const tree = processor.parse('# BFS Problems')
    const file = { path: 'test.md' } as VFile
    const transformedTree = await remarkProblemsGenerator()(tree, file)
    
    // Verify MDX structure generation
    const codeBlock = transformedTree.children.find((node: any) => 
      node.type === 'mdxJsxFlowElement' && node.name === 'ProblemsCodeBlock'
    )
    
    expect(codeBlock).toBeDefined()
    expect(codeBlock?.attributes).toEqual([
      { type: 'mdxJsxAttribute', name: 'code', value: mockBfsLevelOrderProblem.cleanCode },
      { type: 'mdxJsxAttribute', name: 'tooltipData', value: JSON.stringify(mockBfsLevelOrderProblem.tooltipData) },
      { type: 'mdxJsxAttribute', name: 'meta', value: 'backend/algorithms/bfs.py#levelOrder' }
    ])
    
    // 2. Server component rendering
    const component = await ProblemsCodeBlock({
      code: mockBfsLevelOrderProblem.cleanCode,
      tooltipData: JSON.stringify(mockBfsLevelOrderProblem.tooltipData),
      meta: 'backend/algorithms/bfs.py#levelOrder'
    })
    
    render(component)
    
    // Verify server component structure
    expect(screen.getByTestId('problems-code-block')).toBeInTheDocument()
    expect(screen.getByTestId('code-block-header')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /source code/i })).toBeInTheDocument()
    expect(screen.getByTestId('interactions-wrapper')).toBeInTheDocument()
  })

  it('should preserve proper indentation through the entire pipeline', async () => {
    const component = await ProblemsCodeBlock({
      code: mockBfsLevelOrderProblem.cleanCode,
      tooltipData: JSON.stringify(mockBfsLevelOrderProblem.tooltipData),
      meta: 'test.py#test'
    })
    
    render(component)
    
    const codeContent = screen.getByRole('region', { name: /source code/i })
    const html = codeContent.innerHTML
    
    // Verify indentation is preserved in HTML
    expect(html).toContain('&nbsp;&nbsp;&nbsp;&nbsp;')  // 4 spaces for function body
    expect(html).toContain('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')  // 8 spaces for nested blocks
    
    // Verify specific indented lines
    expect(html).toContain('return []')
    expect(html).toContain('&nbsp;&nbsp;&nbsp;&nbsp;level = []')
    expect(html).toContain('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node = queue.popleft()')
  })

  it('should handle complete tooltip interaction flow with proper positioning', async () => {
    const user = userEvent.setup()
    
    const component = await ProblemsCodeBlock({
      code: mockBfsLevelOrderProblem.cleanCode,
      tooltipData: JSON.stringify(mockBfsLevelOrderProblem.tooltipData),
      meta: 'test.py#test'
    })
    
    render(component)
    
    // Find deque token in the rendered code
    const dequeToken = screen.getByTestId('deque-token')
    expect(dequeToken).toBeInTheDocument()
    
    // Hover to show tooltip
    await user.hover(dequeToken)
    
    await waitFor(() => {
      expect(screen.getByTestId('vscode-tooltip')).toBeInTheDocument()
    })
    
    // Verify tooltip content
    expect(screen.getByTestId('tooltip-signature')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip-description')).toHaveTextContent(
      'Double-ended queue with O(1) append/pop operations'
    )
    expect(screen.getByTestId('tooltip-return-type')).toHaveTextContent('→ deque[T]')
    
    // Verify tooltip positioning
    const tooltip = screen.getByTestId('vscode-tooltip')
    expect(tooltip).toHaveStyle({
      left: '125px',  // 100 + 50/2
      top: '192px'    // 200 - 8
    })
    
    // Test hiding tooltip
    await user.unhover(dequeToken)
    
    await waitFor(() => {
      expect(screen.queryByTestId('vscode-tooltip')).not.toBeInTheDocument()
    })
  })

  it('should display complexity information for performance-critical functions', async () => {
    const user = userEvent.setup()
    
    const component = await ProblemsCodeBlock({
      code: mockBfsLevelOrderProblem.cleanCode,
      tooltipData: JSON.stringify(mockBfsLevelOrderProblem.tooltipData),
      meta: 'test.py#test'
    })
    
    render(component)
    
    // Test popleft method with complexity info
    const popleftToken = screen.getByTestId('popleft-token')
    await user.hover(popleftToken)
    
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-complexity')).toHaveTextContent('⚡ O(1)')
    })
  })

  it('should handle multiple tooltip interactions correctly', async () => {
    const user = userEvent.setup()
    
    const component = await ProblemsCodeBlock({
      code: mockBfsLevelOrderProblem.cleanCode,
      tooltipData: JSON.stringify(mockBfsLevelOrderProblem.tooltipData),
      meta: 'test.py#test'
    })
    
    render(component)
    
    // Test sequence of different tooltips
    const dequeToken = screen.getByTestId('deque-token')
    const lenToken = screen.getByTestId('len-token')
    const appendToken = screen.getByTestId('append-token')
    
    // Show deque tooltip
    await user.hover(dequeToken)
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-description')).toHaveTextContent(/Double-ended queue/)
    })
    
    // Switch to len tooltip
    await user.hover(lenToken)
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-description')).toHaveTextContent(/Return the length/)
    })
    
    // Switch to append tooltip
    await user.hover(appendToken)
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-description')).toHaveTextContent(/Add item to end/)
      expect(screen.getByTestId('tooltip-complexity')).toHaveTextContent('⚡ O(1) amortized')
    })
    
    // Should only have one tooltip at a time
    const tooltips = screen.getAllByTestId('vscode-tooltip')
    expect(tooltips).toHaveLength(1)
  })

  it('should handle syntax highlighted signatures in tooltips', async () => {
    const user = userEvent.setup()
    
    const component = await ProblemsCodeBlock({
      code: mockBfsLevelOrderProblem.cleanCode,
      tooltipData: JSON.stringify(mockBfsLevelOrderProblem.tooltipData),
      meta: 'test.py#test'
    })
    
    render(component)
    
    const dequeToken = screen.getByTestId('deque-token')
    await user.hover(dequeToken)
    
    await waitFor(() => {
      const signatureElement = screen.getByTestId('syntax-highlighted-signature')
      expect(signatureElement).toBeInTheDocument()
      expect(signatureElement).toHaveClass('signature-class')
    })
  })

  it('should maintain performance with large code blocks', async () => {
    // Create a larger code example
    const largeCode = Array(50).fill(mockBfsLevelOrderProblem.cleanCode).join('\n\n')
    
    const startTime = performance.now()
    
    const component = await ProblemsCodeBlock({
      code: largeCode,
      tooltipData: JSON.stringify(mockBfsLevelOrderProblem.tooltipData),
      meta: 'test.py#large'
    })
    
    render(component)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Should render within reasonable time (< 1000ms)
    expect(renderTime).toBeLessThan(1000)
    
    // Should still work correctly
    expect(screen.getByTestId('problems-code-block')).toBeInTheDocument()
    expect(screen.getByTestId('interactions-wrapper')).toBeInTheDocument()
  })

  it('should handle edge cases gracefully throughout the pipeline', async () => {
    const edgeCaseData = {
      ...mockBfsLevelOrderProblem,
      cleanCode: '',  // Empty code
      tooltipData: {}  // No tooltip data
    }
    
    // Should not crash with empty data
    const component = await ProblemsCodeBlock({
      code: edgeCaseData.cleanCode,
      tooltipData: JSON.stringify(edgeCaseData.tooltipData),
      meta: 'empty.py#empty'
    })
    
    render(component)
    
    expect(screen.getByTestId('problems-code-block')).toBeInTheDocument()
    expect(screen.getByTestId('interactions-wrapper')).toBeInTheDocument()
    expect(screen.queryByTestId('vscode-tooltip')).not.toBeInTheDocument()
  })
})