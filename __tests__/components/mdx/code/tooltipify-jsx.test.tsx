import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { tooltipifyJSX } from '@/components/mdx/code/tooltipify-jsx';

// Minimal Popover mock for integration (if needed)
// If you want to use the real Popover, comment this out
// vi.mock('@/components/ui/popover', () => ({
//   Popover: ({ children }: any) => <div>{children}</div>,
//   PopoverTrigger: ({ children }: any) => <button>{children}</button>,
//   PopoverContent: ({ children }: any) => <div data-testid="popover-content">{children}</div>,
// }));

describe('tooltipifyJSX integration', () => {
  it('shows tooltip content on trigger interaction', async () => {
    const symbol = 'maxSubArrayLen';
    const parent = undefined;
    const tooltipContent = {
      maxSubArrayLen: {
        name: 'maxSubArrayLen',
        type: 'function',
        language: 'python',
        file: 'code/prefix_sum.py',
        line: 8,
        signature: 'def maxSubArrayLen(nums: list[int], k: int) -> int:',
        parameters: [],
        return_type: 'int',
        return_description: 'The length of the longest subarray with sum == k.',
        description: 'Find the maximum length of a subarray that sums to exactly k.',
        code: 'def maxSubArrayLen(nums: list[int], k: int) -> int:\n    ...',
      },
    };
    // Render a span with tooltip attributes
    const jsx = (
      <span data-tooltip-symbol={symbol}>maxSubArrayLen</span>
    );
    const tree = tooltipifyJSX(jsx, (symbol, parent, path) =>
      <div data-testid="tooltip-content">Tooltip for {symbol}</div>
    );
    render(<>{tree}</>);
    // Find the trigger and simulate a click (Radix Popover opens on click by default)
    const trigger = screen.getByText('maxSubArrayLen');
    fireEvent.click(trigger);
    // Wait for the tooltip content to appear
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });
  });
}); 