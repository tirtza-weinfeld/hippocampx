/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { BundledLanguage } from 'shiki'

interface SyntaxHighlightedSignatureProps {
  readonly signature: string
  readonly language: BundledLanguage
  readonly className?: string
}

// Mock Shiki codeToHtml function
const mockCodeToHtml = vi.fn()
vi.mock('shiki', () => ({
  codeToHtml: mockCodeToHtml
}))

// SyntaxHighlightedSignature implementation
async function SyntaxHighlightedSignature({ 
  signature, 
  language, 
  className 
}: SyntaxHighlightedSignatureProps) {
  const { codeToHtml } = await import('shiki')
  
  const highlightedCode = await codeToHtml(signature, {
    lang: language,
    themes: {
      light: 'github-light-default',
      dark: 'github-dark-high-contrast'
    },
    transformers: [{
      name: 'tooltip-signature-cleaner',
      pre(node) {
        // Remove pre wrapper for inline display
        return false
      },
      code(node) {
        // Apply tooltip-specific classes
        node.properties.className = [
          ...(Array.isArray(node.properties.className) ? node.properties.className : []),
          className || '',
          'signature-highlight'
        ].filter(Boolean)
        return node
      }
    }]
  })
  
  // Return just the code content without pre wrapper
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
      data-testid="syntax-highlighted-signature"
    />
  )
}

describe('SyntaxHighlightedSignature', () => {
  const mockHighlightedHtml = `
<code class="signature-highlight custom-class">
  <span style="color:#FF7B72">def</span>
  <span style="color:#F0F6FC"> </span>
  <span style="color:#79C0FF">deque</span>
  <span style="color:#F0F6FC">(</span>
  <span style="color:#79C0FF">iterable</span>
  <span style="color:#F0F6FC">=</span>
  <span style="color:#FF7B72">None</span>
  <span style="color:#F0F6FC">, </span>
  <span style="color:#79C0FF">maxlen</span>
  <span style="color:#F0F6FC">=</span>
  <span style="color:#FF7B72">None</span>
  <span style="color:#F0F6FC">) -&gt; </span>
  <span style="color:#79C0FF">deque</span>
</code>
`.trim()

  beforeEach(() => {
    vi.clearAllMocks()
    mockCodeToHtml.mockResolvedValue(mockHighlightedHtml)
  })

  it('should render syntax highlighted signature', async () => {
    const signature = 'deque([iterable[, maxlen]]) -> deque'
    
    const component = await SyntaxHighlightedSignature({
      signature,
      language: 'python',
      className: 'custom-class'
    })
    
    render(component)
    
    expect(screen.getByTestId('syntax-highlighted-signature')).toBeInTheDocument()
    expect(screen.getByTestId('syntax-highlighted-signature')).toHaveClass('custom-class')
  })

  it('should call Shiki with correct parameters', async () => {
    const signature = 'deque([iterable[, maxlen]]) -> deque'
    
    await SyntaxHighlightedSignature({
      signature,
      language: 'python',
      className: 'test-class'
    })
    
    expect(mockCodeToHtml).toHaveBeenCalledWith(signature, {
      lang: 'python',
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-high-contrast'
      },
      transformers: [{
        name: 'tooltip-signature-cleaner',
        pre: expect.any(Function),
        code: expect.any(Function)
      }]
    })
  })

  it('should configure themes for light and dark modes', async () => {
    const signature = 'len(obj) -> int'
    
    await SyntaxHighlightedSignature({
      signature,
      language: 'python'
    })
    
    const call = mockCodeToHtml.mock.calls[0]
    expect(call[1].themes).toEqual({
      light: 'github-light-default',
      dark: 'github-dark-high-contrast'
    })
  })

  it('should use pre transformer to remove wrapper', async () => {
    const signature = 'list.append(item: T) -> None'
    
    await SyntaxHighlightedSignature({
      signature,
      language: 'python'
    })
    
    const transformer = mockCodeToHtml.mock.calls[0][1].transformers[0]
    expect(transformer.name).toBe('tooltip-signature-cleaner')
    expect(transformer.pre()).toBe(false)
  })

  it('should apply custom classes through code transformer', async () => {
    const signature = 'range(start, stop, step) -> range'
    
    await SyntaxHighlightedSignature({
      signature,
      language: 'python',
      className: 'custom-tooltip-signature'
    })
    
    const transformer = mockCodeToHtml.mock.calls[0][1].transformers[0]
    
    // Test the code transformer behavior
    const mockNode = {
      properties: {
        className: ['existing-class']
      }
    }
    
    const result = transformer.code(mockNode)
    expect(result.properties.className).toEqual([
      'existing-class',
      'custom-tooltip-signature',
      'signature-highlight'
    ])
  })

  it('should handle node without existing className', async () => {
    await SyntaxHighlightedSignature({
      signature: 'test() -> None',
      language: 'python',
      className: 'new-class'
    })
    
    const transformer = mockCodeToHtml.mock.calls[0][1].transformers[0]
    
    const mockNode = {
      properties: {
        className: undefined
      }
    }
    
    const result = transformer.code(mockNode)
    expect(result.properties.className).toEqual([
      'new-class',
      'signature-highlight'
    ])
  })

  it('should work without custom className', async () => {
    await SyntaxHighlightedSignature({
      signature: 'dict.get(key, default) -> Any',
      language: 'python'
    })
    
    const transformer = mockCodeToHtml.mock.calls[0][1].transformers[0]
    
    const mockNode = {
      properties: {
        className: []
      }
    }
    
    const result = transformer.code(mockNode)
    expect(result.properties.className).toEqual(['signature-highlight'])
  })

  it('should render highlighted HTML content', async () => {
    const signature = 'deque.popleft() -> T'
    
    const component = await SyntaxHighlightedSignature({
      signature,
      language: 'python',
      className: 'signature-class'
    })
    
    render(component)
    
    const element = screen.getByTestId('syntax-highlighted-signature')
    expect(element.innerHTML).toBe(mockHighlightedHtml)
  })

  it('should support different programming languages', async () => {
    const jsSignature = 'Array.prototype.push(...items) => number'
    
    await SyntaxHighlightedSignature({
      signature: jsSignature,
      language: 'javascript',
      className: 'js-signature'
    })
    
    expect(mockCodeToHtml).toHaveBeenCalledWith(
      jsSignature,
      expect.objectContaining({
        lang: 'javascript'
      })
    )
  })

  it('should handle TypeScript signatures', async () => {
    const tsSignature = 'function map<T, U>(array: T[], fn: (item: T) => U): U[]'
    
    await SyntaxHighlightedSignature({
      signature: tsSignature,
      language: 'typescript',
      className: 'ts-signature'
    })
    
    expect(mockCodeToHtml).toHaveBeenCalledWith(
      tsSignature,
      expect.objectContaining({
        lang: 'typescript'
      })
    )
  })

  it('should handle complex Python signatures with generics', async () => {
    const complexSignature = 'Callable[[T, K], V] | None'
    
    await SyntaxHighlightedSignature({
      signature: complexSignature,
      language: 'python',
      className: 'complex-signature'
    })
    
    expect(mockCodeToHtml).toHaveBeenCalledWith(complexSignature, expect.any(Object))
  })

  it('should handle method signatures correctly', async () => {
    const methodSignature = 'self.process_data(data: Dict[str, Any]) -> Optional[Result]'
    
    const component = await SyntaxHighlightedSignature({
      signature: methodSignature,
      language: 'python',
      className: 'method-signature'
    })
    
    render(component)
    
    expect(screen.getByTestId('syntax-highlighted-signature')).toHaveClass('method-signature')
    expect(mockCodeToHtml).toHaveBeenCalledWith(methodSignature, expect.any(Object))
  })

  it('should handle signatures with special characters', async () => {
    const specialSignature = '__init__(self, *args, **kwargs) -> None'
    
    await SyntaxHighlightedSignature({
      signature: specialSignature,
      language: 'python'
    })
    
    expect(mockCodeToHtml).toHaveBeenCalledWith(specialSignature, expect.any(Object))
  })

  it('should preserve signature formatting', async () => {
    const formattedSignature = `Union[
    List[int],
    Dict[str, Any],
    None
]`
    
    await SyntaxHighlightedSignature({
      signature: formattedSignature,
      language: 'python',
      className: 'multiline-signature'
    })
    
    expect(mockCodeToHtml).toHaveBeenCalledWith(formattedSignature, expect.any(Object))
  })

  it('should handle empty signature gracefully', async () => {
    const component = await SyntaxHighlightedSignature({
      signature: '',
      language: 'python',
      className: 'empty-signature'
    })
    
    render(component)
    
    expect(screen.getByTestId('syntax-highlighted-signature')).toBeInTheDocument()
    expect(mockCodeToHtml).toHaveBeenCalledWith('', expect.any(Object))
  })

  it('should filter out empty class names correctly', async () => {
    await SyntaxHighlightedSignature({
      signature: 'test() -> None',
      language: 'python',
      className: ''
    })
    
    const transformer = mockCodeToHtml.mock.calls[0][1].transformers[0]
    
    const mockNode = {
      properties: {
        className: []
      }
    }
    
    const result = transformer.code(mockNode)
    expect(result.properties.className).toEqual(['signature-highlight'])
  })

  it('should be compatible with Server Components (async)', async () => {
    // Test that the component is async and can be awaited
    const signature = 'async def process() -> Awaitable[Result]'
    
    const componentPromise = SyntaxHighlightedSignature({
      signature,
      language: 'python',
      className: 'async-signature'
    })
    
    expect(componentPromise).toBeInstanceOf(Promise)
    
    const component = await componentPromise
    render(component)
    
    expect(screen.getByTestId('syntax-highlighted-signature')).toBeInTheDocument()
  })
})