import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Test providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  )
}

// Custom render function with providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Mock factories
export const mockCodeBlock = (children: React.ReactNode, className?: string, meta?: string) => 
  React.createElement('div', {
    className: 'shadow-2xl rounded-md dark:bg-gray-800 bg-gray-100 p-4 my-4',
    'data-testid': 'code-block',
  }, [
    React.createElement('div', {
      key: 'relative',
      className: 'relative',
    }, [
      React.createElement('button', {
        key: 'copy-button',
        'data-testid': 'copy-button',
        className: 'absolute top-0 right-0',
        onClick: () => {
          navigator.clipboard.writeText(children as string)
        },
      }, 'Copy'),
      React.createElement('div', {
        key: 'content',
        className: 'overflow-x-auto py-8',
        'data-testid': 'tooltipified-code',
      }, children),
    ]),
  ])

// Common test data
export const testCode = {
  python: {
    simple: 'def test():\n    pass',
    complex: `def complex_function(param1: str, param2: int) -> bool:
    """
    A complex function with multiple parameters and return type.
    """
    if param1 and param2 > 0:
        return True
    return False`,
    lruCache: `class LRUCache:
    def get(self, key: int) -> int:
        """
        When an item is accessed, it becomes the most recently used.
        """
        if (val := self.cache.get(key)) is None:
            return -1
        self.cache.move_to_end(key)
        return val`,
  },
  javascript: {
    simple: 'function test() { return true; }',
    complex: `function complexFunction(param1, param2) {
  // Complex function with JSDoc
  if (param1 && param2 > 0) {
    return true;
  }
  return false;
}`,
  },
}

// Mock setup helpers
export const mockClipboard = () => {
  const writeText = vi.fn()
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    writable: true,
  })
  return { writeText }
}

export const mockNextNavigation = () => {
  const push = vi.fn()
  const replace = vi.fn()
  const router = { push, replace, prefetch: vi.fn(), back: vi.fn() }
  
  vi.mock('next/navigation', () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
  }))
  
  return { push, replace, router }
}