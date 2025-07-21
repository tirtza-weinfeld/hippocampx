import { vi } from 'vitest'
import React from 'react'

// Mock factory for CodeBlock component
export const createMockCodeBlock = () => {
  return vi.fn(({ children, className, meta }: { 
    children: React.ReactNode
    className?: string
    meta?: string 
  }) => {
    return React.createElement('div', {
      className: 'shadow-2xl rounded-md dark:bg-gray-800 bg-gray-100 p-4 my-4',
      'data-testid': 'code-block',
      'data-language': className,
      'data-meta': meta,
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
  })
}

// Mock factory for MDX components
export const createMockMdxComponents = () => ({
  Alert: vi.fn(({ children, type = 'info' }: { children: React.ReactNode, type?: string }) => 
    React.createElement('div', {
      'data-testid': `alert-${type}`,
      className: `alert alert-${type}`,
    }, children)
  ),
  
  InlineMath: vi.fn(({ children }: { children: string }) =>
    React.createElement('span', {
      'data-testid': 'inline-math',
      className: 'inline-math',
    }, children)
  ),

  Table: vi.fn(({ children }: { children: React.ReactNode }) =>
    React.createElement('table', {
      'data-testid': 'mdx-table',
      className: 'mdx-table',
    }, children)
  ),

  List: vi.fn(({ children, ordered = false }: { children: React.ReactNode, ordered?: boolean }) =>
    React.createElement(ordered ? 'ol' : 'ul', {
      'data-testid': `mdx-${ordered ? 'ordered' : 'unordered'}-list`,
      className: 'mdx-list',
    }, children)
  ),
})

// Mock factory for Next.js components
export const createMockNextComponents = () => ({
  Image: vi.fn(({ src, alt, ...props }) =>
    React.createElement('img', {
      src,
      alt,
      'data-testid': 'next-image',
      ...props,
    })
  ),
  
  Link: vi.fn(({ href, children, ...props }) =>
    React.createElement('a', {
      href,
      'data-testid': 'next-link',
      ...props,
    }, children)
  ),
})

// Mock factory for Radix UI components
export const createMockRadixComponents = () => ({
  Dialog: {
    Root: vi.fn(({ children }) => React.createElement('div', { 'data-testid': 'dialog-root' }, children)),
    Trigger: vi.fn(({ children }) => React.createElement('button', { 'data-testid': 'dialog-trigger' }, children)),
    Content: vi.fn(({ children }) => React.createElement('div', { 'data-testid': 'dialog-content', role: 'dialog' }, children)),
  },
  
  Tooltip: {
    Provider: vi.fn(({ children }) => React.createElement('div', { 'data-testid': 'tooltip-provider' }, children)),
    Root: vi.fn(({ children }) => React.createElement('div', { 'data-testid': 'tooltip-root' }, children)),
    Trigger: vi.fn(({ children }) => React.createElement('span', { 'data-testid': 'tooltip-trigger' }, children)),
    Content: vi.fn(({ children }) => React.createElement('div', { 'data-testid': 'tooltip-content' }, children)),
  },
})

// Environment setup helpers
export const setupTestEnvironment = () => {
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
}