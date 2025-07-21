import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Root, Element } from 'hast';

// Mock the transformer function
const mockTooltipifyJSX = vi.fn((jsx: unknown) => jsx);

vi.mock('@/components/mdx/code/tooltipify-jsx', () => ({
  tooltipifyJSX: mockTooltipifyJSX,
}));

// Import the actual transformer
import { metaTooltip } from '@/components/mdx/code/transformers/meta-tooltip';

describe('metaTooltip Transformer', () => {
  beforeEach(() => {
    mockTooltipifyJSX.mockClear();
  });

  it('should process line range highlighting metadata', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          properties: {
            className: ['shiki'],
            'data-line-range': '6-7',
            'data-expression': 'if-block',
          },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'if a[mid] < x:\n  lo = mid + 1',
                },
              ],
            },
          ],
        },
      ],
    };

    // Apply the transformer
    metaTooltip()(tree);

    // Verify that tooltipifyJSX was called
    expect(mockTooltipifyJSX).toHaveBeenCalled();
  });

  it('should handle multiple line range highlights', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          properties: {
            className: ['shiki'],
            'data-line-range': '6-7',
            'data-expression': 'if-block',
          },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'if a[mid] < x:\n  lo = mid + 1',
                },
              ],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'pre',
          properties: {
            className: ['shiki'],
            'data-line-range': '8-9',
            'data-expression': 'else-block',
          },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'else:\n  hi = mid',
                },
              ],
            },
          ],
        },
      ],
    };

    // Apply the transformer
    metaTooltip()(tree);

    // Verify that tooltipifyJSX was called for each pre element
    expect(mockTooltipifyJSX).toHaveBeenCalledTimes(2);
  });

  it('should preserve existing properties and classes', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          properties: {
            className: ['shiki', 'language-python'],
            'data-line-range': '6-7',
            'data-expression': 'if-block',
            'data-lang': 'python',
          },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {
                className: ['language-python'],
              },
              children: [
                {
                  type: 'text',
                  value: 'if a[mid] < x:',
                },
              ],
            },
          ],
        },
      ],
    };

    // Apply the transformer
    metaTooltip()(tree);

    // Verify that the pre element still has its original properties
    const preElement = tree.children[0] as Element;
    expect(preElement.properties?.className).toContain('shiki');
    expect(preElement.properties?.className).toContain('language-python');
    expect(preElement.properties?.['data-lang']).toBe('python');
  });

  it('should handle elements without line range metadata', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          properties: {
            className: ['shiki'],
          },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'print("Hello, World!")',
                },
              ],
            },
          ],
        },
      ],
    };

    // Apply the transformer
    metaTooltip()(tree);

    // Verify that tooltipifyJSX was not called for elements without line range metadata
    expect(mockTooltipifyJSX).not.toHaveBeenCalled();
  });

  it('should handle nested elements correctly', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'pre',
              properties: {
                className: ['shiki'],
                'data-line-range': '6-7',
                'data-expression': 'if-block',
              },
              children: [
                {
                  type: 'element',
                  tagName: 'code',
                  properties: {},
                  children: [
                    {
                      type: 'text',
                      value: 'if a[mid] < x:',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    // Apply the transformer
    metaTooltip()(tree);

    // Verify that tooltipifyJSX was called for the nested pre element
    expect(mockTooltipifyJSX).toHaveBeenCalledTimes(1);
  });

  it('should handle mixed content with and without line range metadata', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          properties: {
            className: ['shiki'],
            'data-line-range': '6-7',
            'data-expression': 'if-block',
          },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'if a[mid] < x:',
                },
              ],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            {
              type: 'text',
              value: 'This is a paragraph.',
            },
          ],
        },
        {
          type: 'element',
          tagName: 'pre',
          properties: {
            className: ['shiki'],
          },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: 'print("No line range")',
                },
              ],
            },
          ],
        },
      ],
    };

    // Apply the transformer
    metaTooltip()(tree);

    // Verify that tooltipifyJSX was called only once (for the element with line range metadata)
    expect(mockTooltipifyJSX).toHaveBeenCalledTimes(1);
  });
}); 