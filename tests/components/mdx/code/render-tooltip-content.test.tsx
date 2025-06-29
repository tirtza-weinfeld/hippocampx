import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { renderTooltipContent } from '@/components/mdx/code/render-tooltip-content';
import type { SymbolMetadata } from '@/lib/types';

// Mock the highlightCode function to return synchronously in tests
vi.mock('@/components/mdx/code/code-highlighter', () => ({
  default: vi.fn().mockResolvedValue('<span class="hljs-keyword">def</span> <span class="hljs-title">maxSubArrayLen</span>')
}));

const TOOLTIP_CONTENT: Record<string, SymbolMetadata> = {
  maxSubArrayLen: {
    name: 'maxSubArrayLen',
    type: 'function',
    language: 'python',
    file: 'code/prefix_sum.py',
    line: 8,
    signature: 'def maxSubArrayLen(nums: list[int], k: int) -> int:',
    parameters: [
      { name: 'nums', type: 'list[int]', description: 'List of integers.', default: null },
      { name: 'k', type: 'int', description: 'Target sum.', default: null }
    ],
    return_type: 'int',
    return_description: 'The length of the longest subarray with sum == k.',
    description: 'Find the maximum length of a subarray that sums to exactly k.',
    code: '', // Empty to avoid triggering async component
  }
};

describe('renderTooltipContent', () => {
  it('renders function symbol tooltip with correct structure and no duplicates', () => {
    const { container, getByText } = render(
      <>{renderTooltipContent('maxSubArrayLen', undefined, TOOLTIP_CONTENT)}</>
    );
    // Header
    expect(getByText('maxSubArrayLen')).toBeInTheDocument();
    // Type
    expect(getByText('function')).toBeInTheDocument();
    // Signature
    expect(getByText(TOOLTIP_CONTENT.maxSubArrayLen.signature)).toBeInTheDocument();
    // Description (should only appear once)
    const descs = container.querySelectorAll('div, span, p');
    const descCount = Array.from(descs).filter(el => el.textContent === TOOLTIP_CONTENT.maxSubArrayLen.description).length;
    expect(descCount).toBe(1);
    // Parameters
    expect(getByText('Parameters:')).toBeInTheDocument();
    expect(getByText('nums')).toBeInTheDocument();
    expect(getByText('k')).toBeInTheDocument();
    // Returns
    expect(getByText('Returns:')).toBeInTheDocument();
    expect(getByText('int')).toBeInTheDocument();
  });

  it('renders parameter tooltip in VS Code style', () => {
    const { container } = render(
      <>{renderTooltipContent('nums', 'maxSubArrayLen', TOOLTIP_CONTENT)}</>
    );
    // Header: (parameter) nums: list[int]
    const headerFound = Array.from(container.querySelectorAll('div, span, p')).some(
      el => el.textContent === '(parameter) nums: list[int]'
    );
    expect(headerFound).toBe(true);
    // Description: nums: List of integers.
    const descFound = Array.from(container.querySelectorAll('div, span, p')).some(
      el => el.textContent === 'nums: List of integers.'
    );
    expect(descFound).toBe(true);
    // Should not have duplicate 'parameter' or 'description'
    const paramLabels = Array.from(container.querySelectorAll('div, span, p')).filter(el => el.textContent === '(parameter) nums: list[int]').length;
    expect(paramLabels).toBe(1);
    const descCount = Array.from(container.querySelectorAll('div, span, p')).filter(el => el.textContent === 'nums: List of integers.').length;
    expect(descCount).toBe(1);
  });

  it('renders both function and parameter tooltips with correct content and structure', () => {
    const { getByText } = render(
      <>
        {renderTooltipContent('maxSubArrayLen', undefined, TOOLTIP_CONTENT)}
        {renderTooltipContent('nums', 'maxSubArrayLen', TOOLTIP_CONTENT)}
      </>
    );
    // Function tooltip header and description
    expect(getByText((content) => content.includes('maxSubArrayLen'))).toBeInTheDocument();
    expect(getByText((content) => content.includes('Find the maximum length of a subarray that sums to exactly k.'))).toBeInTheDocument();
    // Parameter tooltip header and description
    expect(getByText((content) => content.includes('(parameter) nums: list[int]'))).toBeInTheDocument();
    expect(getByText((content) => content.includes('nums: List of integers.'))).toBeInTheDocument();
  });
}); 