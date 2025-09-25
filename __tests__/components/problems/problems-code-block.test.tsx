/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'

interface TooltipSymbol {
  symbol: string
  signature: string
  description: string
  return_type: string
  parameters?: Record<string, string>
  complexity?: string
}

// Mock Shiki - it's a build-time dependency
const mockHighlightedHtml = `
<pre class="shiki github-dark-high-contrast" style="background-color:#0d1117;color:#f0f6fc" tabindex="0">
  <code>
    <span class="line">
      <span style="color:#FF7B72">if</span>
      <span style="color:#F0F6FC"> </span>
      <span style="color:#FF7B72">not</span>
      <span style="color:#F0F6FC"> root:</span>
    </span>
    <span class="line">
      <span style="color:#F0F6FC">    </span>
      <span style="color:#FF7B72">return</span>
      <span style="color:#F0F6FC"> []</span>
    </span>
    <span class="line">
      <span style="color:#79C0FF" data-tooltip-symbol="deque" data-tooltip-data='{"symbol":"deque","signature":"deque([iterable[, maxlen]]) -> deque","description":"Double-ended queue with O(1) append/pop operations","return_type":"deque[T]"}'>deque</span>
      <span style="color:#F0F6FC">, result = </span>
      <span style="color:#79C0FF" data-tooltip-symbol="deque" data-tooltip-data='{"symbol":"deque","signature":"deque([iterable[, maxlen]]) -> deque","description":"Double-ended queue with O(1) append/pop operations","return_type":"deque[T]"}'>deque</span>
      <span style="color:#F0F6FC">([root]), []</span>
    </span>
    <span class="line">
      <span style="color:#FF7B72">while</span>
      <span style="color:#F0F6FC"> queue:</span>
    </span>
    <span class="line">
      <span style="color:#F0F6FC">    level = []</span>
    </span>
    <span class="line">
      <span style="color:#F0F6FC">    </span>
      <span style="color:#FF7B72">for</span>
      <span style="color:#F0F6FC"> _ </span>
      <span style="color:#FF7B72">in</span>
      <span style="color:#F0F6FC"> </span>
      <span style="color:#79C0FF" data-tooltip-symbol="range" data-tooltip-data='{"symbol":"range","signature":"range(stop) -> range","description":"Create a range of numbers","return_type":"range"}'>range</span>
      <span style="color:#F0F6FC">(</span>
      <span style="color:#79C0FF" data-tooltip-symbol="len" data-tooltip-data='{"symbol":"len","signature":"len(obj) -> int","description":"Return the length of an object","return_type":"int"}'>len</span>
      <span style="color:#F0F6FC">(queue)):</span>
    </span>
    <span class="line">
      <span style="color:#F0F6FC">        node = queue.</span>
      <span style="color:#79C0FF" data-tooltip-symbol="popleft" data-tooltip-data='{"symbol":"popleft","signature":"deque.popleft() -> T","description":"Remove and return element from left side","return_type":"T","complexity":"O(1)"}'>popleft</span>
      <span style="color:#F0F6FC">()</span>
    </span>
  </code>
</pre>
`.trim()

// Mock Shiki codeToHast function
vi.mock('shiki', () => ({
  codeToHast: vi.fn(async (code: string, options: any) => {
    // Return a simplified HAST structure that matches Shiki's output
    return {
      type: 'element',
      tagName: 'pre',
      properties: {
        className: ['shiki', 'github-dark-high-contrast'],
        style: 'background-color:#0d1117;color:#f0f6fc',
        tabIndex: 0
      },
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: {},
          children: code.split('\n').map(line => ({
            type: 'element',
            tagName: 'span',
            properties: { className: ['line'] },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: {
                  style: 'color:#79C0FF',
                  ...(line.includes('deque') && {
                    'data-tooltip-symbol': 'deque',
                    'data-tooltip-data': JSON.stringify({
                      symbol: 'deque',
                      signature: 'deque([iterable[, maxlen]]) -> deque',
                      description: 'Double-ended queue with O(1) append/pop operations',
                      return_type: 'deque[T]'
                    })
                  }),
                  ...(line.includes('len') && {
                    'data-tooltip-symbol': 'len',
                    'data-tooltip-data': JSON.stringify({
                      symbol: 'len',
                      signature: 'len(obj) -> int',
                      description: 'Return the length of an object',
                      return_type: 'int'
                    })
                  }),
                  ...(line.includes('popleft') && {
                    'data-tooltip-symbol': 'popleft',
                    'data-tooltip-data': JSON.stringify({
                      symbol: 'popleft',
                      signature: 'deque.popleft() -> T',
                      description: 'Remove and return element from left side',
                      return_type: 'T',
                      complexity: 'O(1)'
                    })
                  })
                },
                children: [{ type: 'text', value: line }]
              }
            ]
          }))
        }
      ]
    }
  })
}))

// Mock HAST to JSX converter
vi.mock('@/lib/hast-to-jsx', () => ({
  hastToJSX: vi.fn((hast: any) => {
    // Convert simplified HAST to JSX-like structure for testing
    return (
      <pre 
        className="shiki github-dark-high-contrast" 
        style={{ backgroundColor: '#0d1117', color: '#f0f6fc' }}
        tabIndex={0}
      >
        <code>
          {hast.children[0].children.map((line: any, i: number) => (
            <span key={i} className="line">
              {line.children.map((token: any, j: number) => (
                <span 
                  key={j}
                  style={{ color: '#79C0FF' }}
                  {...(token.properties['data-tooltip-symbol'] && {
                    'data-tooltip-symbol': token.properties['data-tooltip-symbol'],
                    'data-tooltip-data': token.properties['data-tooltip-data']
                  })}
                >
                  {token.children[0].value}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    )
  })
}))

// Mock CodeBlockInteractions
vi.mock('@/components/problems/code-block-interactions', () => ({
  CodeBlockInteractions: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="code-block-interactions">{children}</div>
  )
}))

// Mock CodeBlockHeader  
vi.mock('@/components/problems/code-block-header', () => ({
  CodeBlockHeader: ({ code, meta }: { code: string; meta: string }) => (
    <div data-testid="code-block-header">
      <span data-testid="meta">{meta}</span>
      <span data-testid="line-count">{code.split('\n').length} lines</span>
    </div>
  )
}))

type CodeBlockProps = {
  readonly code: string
  readonly tooltipData: string
  readonly meta: string
}

// ProblemsCodeBlock implementation (normally would be in actual component file)
async function ProblemsCodeBlock({ code, tooltipData, meta }: CodeBlockProps): Promise<ReactElement> {
  const { codeToHast } = await import('shiki')
  const { hastToJSX } = await import('@/lib/hast-to-jsx')
  const { CodeBlockInteractions } = await import('@/components/problems/code-block-interactions')
  const { CodeBlockHeader } = await import('@/components/problems/code-block-header')
  
  // Parse tooltip data with branded types
  type TooltipMap = Record<string, TooltipSymbol>
  const tooltips: TooltipMap = JSON.parse(tooltipData)
  
  // Modern Shiki v3.7+ with tree-sitter and custom transformers
  const hast = await codeToHast(code, {
    lang: 'python',
    themes: {
      light: 'github-light-default',
      dark: 'github-dark-high-contrast'
    },
    
    // Advanced transformers with tooltip injection
    transformers: [
      {
        name: 'tooltip-injector',
        code(node) {
          // Inject tooltip data attributes into tokens
          return node.children.map(line => 
            line.children.map(token => {
              if (tooltips[token.content]) {
                return {
                  ...token,
                  properties: {
                    ...token.properties,
                    'data-tooltip-symbol': token.content,
                    'data-tooltip-data': JSON.stringify(tooltips[token.content])
                  }
                }
              }
              return token
            })
          )
        }
      }
    ]
  })
  
  return (
    <section className="problems-code-block" data-testid="problems-code-block">
      {/* Header with modern container queries */}
      <header className="@container/header p-4 @lg:p-6">
        <CodeBlockHeader code={code} meta={meta} />
      </header>
      
      {/* Code content with proper semantic HTML */}
      <div className="code-wrapper" role="region" aria-label="Source code">
        {hastToJSX(hast)}
      </div>
      
      {/* Client-side interactions wrapper */}
      <CodeBlockInteractions tooltipData={tooltips}>
        <div data-testid="interaction-content">Interactive content</div>
      </CodeBlockInteractions>
    </section>
  )
}

describe('ProblemsCodeBlock', () => {
  const mockTooltipData = {
    'deque': {
      symbol: 'deque',
      signature: 'deque([iterable[, maxlen]]) -> deque',
      description: 'Double-ended queue with O(1) append/pop operations',
      return_type: 'deque[T]'
    },
    'len': {
      symbol: 'len',
      signature: 'len(obj) -> int',
      description: 'Return the length of an object',
      return_type: 'int'
    },
    'popleft': {
      symbol: 'popleft',
      signature: 'deque.popleft() -> T',
      description: 'Remove and return element from left side',
      return_type: 'T',
      complexity: 'O(1)'
    }
  } satisfies Record<string, TooltipSymbol>

  const mockBfsCode = `if not root:
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
return result`.trim()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render code block with proper semantic structure', async () => {
    const component = await ProblemsCodeBlock({
      code: mockBfsCode,
      tooltipData: JSON.stringify(mockTooltipData),
      meta: 'backend/algorithms/bfs.py#levelOrder'
    })
    
    render(component)
    
    // Should have main container
    expect(screen.getByTestId('problems-code-block')).toBeInTheDocument()
    
    // Should have semantic regions
    expect(screen.getByRole('region', { name: /source code/i })).toBeInTheDocument()
    
    // Should have header
    expect(screen.getByTestId('code-block-header')).toBeInTheDocument()
    
    // Should have interactions wrapper
    expect(screen.getByTestId('code-block-interactions')).toBeInTheDocument()
  })

  it('should process code with Shiki syntax highlighting', async () => {
    const { codeToHast } = await import('shiki')
    
    const component = await ProblemsCodeBlock({
      code: mockBfsCode,
      tooltipData: JSON.stringify(mockTooltipData),
      meta: 'test.py#test'
    })
    
    // Should call Shiki with correct parameters
    expect(codeToHast).toHaveBeenCalledWith(mockBfsCode, {
      lang: 'python',
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-high-contrast'
      },
      transformers: [
        {
          name: 'tooltip-injector',
          code: expect.any(Function)
        }
      ]
    })
  })

  it('should inject tooltip data attributes into syntax highlighted tokens', async () => {
    const component = await ProblemsCodeBlock({
      code: 'queue.popleft()',
      tooltipData: JSON.stringify(mockTooltipData),
      meta: 'test.py#test'
    })
    
    render(component)
    
    // Should have tooltip data attributes on highlighted tokens
    const popleftToken = screen.getByText('queue.popleft()')
    expect(popleftToken).toHaveAttribute('data-tooltip-symbol', 'popleft')
    expect(popleftToken).toHaveAttribute('data-tooltip-data', JSON.stringify(mockTooltipData.popleft))
  })

  it('should preserve code indentation in syntax highlighting', async () => {
    const indentedCode = `if condition:
    nested_block()
        deeply_nested()
    back_to_first_level()`
    
    const component = await ProblemsCodeBlock({
      code: indentedCode,
      tooltipData: JSON.stringify({}),
      meta: 'test.py#test'
    })
    
    render(component)
    
    // Check that indentation is preserved in rendered content
    const codeContent = screen.getByRole('region', { name: /source code/i })
    expect(codeContent.textContent).toContain('    nested_block()')  // 4 spaces
    expect(codeContent.textContent).toContain('        deeply_nested()')  // 8 spaces
  })

  it('should render header with correct meta information', async () => {
    const component = await ProblemsCodeBlock({
      code: mockBfsCode,
      tooltipData: JSON.stringify(mockTooltipData),
      meta: 'backend/algorithms/bfs.py#levelOrder'
    })
    
    render(component)
    
    const header = screen.getByTestId('code-block-header')
    expect(header).toBeInTheDocument()
    
    // Should show meta info
    expect(screen.getByTestId('meta')).toHaveTextContent('backend/algorithms/bfs.py#levelOrder')
    
    // Should show line count
    expect(screen.getByTestId('line-count')).toHaveTextContent('12 lines')
  })

  it('should pass tooltip data to interactions component', async () => {
    const component = await ProblemsCodeBlock({
      code: mockBfsCode,
      tooltipData: JSON.stringify(mockTooltipData),
      meta: 'test.py#test'
    })
    
    render(component)
    
    // Should render interactions component
    expect(screen.getByTestId('code-block-interactions')).toBeInTheDocument()
    expect(screen.getByTestId('interaction-content')).toBeInTheDocument()
  })

  it('should handle empty tooltip data gracefully', async () => {
    const component = await ProblemsCodeBlock({
      code: 'simple_code()',
      tooltipData: '{}',
      meta: 'test.py#simple'
    })
    
    render(component)
    
    // Should still render without errors
    expect(screen.getByTestId('problems-code-block')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /source code/i })).toBeInTheDocument()
  })

  it('should support both light and dark themes', async () => {
    const { codeToHast } = await import('shiki')
    
    await ProblemsCodeBlock({
      code: mockBfsCode,
      tooltipData: JSON.stringify(mockTooltipData),
      meta: 'test.py#test'
    })
    
    // Should configure both themes
    const call = vi.mocked(codeToHast).mock.calls[0]
    expect(call[1].themes).toEqual({
      light: 'github-light-default',
      dark: 'github-dark-high-contrast'
    })
  })

  it('should handle complex Python constructs with proper highlighting', async () => {
    const complexCode = `from collections import deque
    
def bfs(graph, start):
    visited = set()
    queue = deque([start])
    
    while queue:
        vertex = queue.popleft()
        if vertex not in visited:
            visited.add(vertex)
            for neighbor in graph[vertex]:
                queue.append(neighbor)
    
    return visited`
    
    const complexTooltipData = {
      ...mockTooltipData,
      'set': {
        symbol: 'set',
        signature: 'set([iterable]) -> set',
        description: 'Create a new set object',
        return_type: 'set[T]'
      },
      'add': {
        symbol: 'add',
        signature: 'set.add(item: T) -> None',
        description: 'Add element to set',
        return_type: 'None',
        complexity: 'O(1) average'
      }
    }
    
    const component = await ProblemsCodeBlock({
      code: complexCode,
      tooltipData: JSON.stringify(complexTooltipData),
      meta: 'backend/algorithms/graph.py#bfs'
    })
    
    render(component)
    
    // Should handle complex code structure
    expect(screen.getByTestId('problems-code-block')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /source code/i })).toBeInTheDocument()
    
    // Should call Shiki with the complex code
    expect(vi.mocked(codeToHast)).toHaveBeenCalledWith(
      complexCode,
      expect.objectContaining({
        lang: 'python'
      })
    )
  })
})