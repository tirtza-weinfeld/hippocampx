import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { newTooltipifyJSX } from '@/components/mdx/code/new-tooltipify-jsx';
import { newRenderTooltipContent } from '@/components/mdx/code/new-render-tooltip-content';

// Minimal Popover mock for integration (if needed)
// If you want to use the real Popover, comment this out
// vi.mock('@/components/ui/popover', () => ({
//   Popover: ({ children }: any) => <div>{children}</div>,
//   PopoverTrigger: ({ children }: any) => <button>{children}</button>,
//   PopoverContent: ({ children }: any) => <div data-testid="popover-content">{children}</div>,
// }));

describe('newTooltipifyJSX integration', () => {
  it('shows tooltip content on trigger interaction', async () => {
    const qname = 'maximum_subarray:maximum_subarray';
    const kind = 'function';

    const renderContent = (qname: string, kind?: string) => (
      <div data-testid="tooltip-content">
        Testing tooltip for {qname} ({kind})
      </div>
    );

    // Render a span with new tooltip attributes
    const jsx = (
      <span data-tooltip-symbol={qname} data-tooltip-kind={kind}>
        maximum_subarray
      </span>
    );
    
    const tree = newTooltipifyJSX(jsx, renderContent);
    render(<>{tree}</>);
    
    // Find the trigger and simulate a click (Radix Popover opens on click by default)
    const trigger = screen.getByText('maximum_subarray');
    fireEvent.click(trigger);
    
    // Wait for the tooltip content to appear
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });
  });

  it('works with real tooltip content', async () => {
    const qname = 'maximum_subarray:maximum_subarray';
    const kind = 'function';

    // Render a span with new tooltip attributes using real content renderer
    const jsx = (
      <span data-tooltip-symbol={qname} data-tooltip-kind={kind}>
        maximum_subarray
      </span>
    );
    
    const tree = newTooltipifyJSX(jsx, (qname, kind) => newRenderTooltipContent(qname, kind));
    render(<>{tree}</>);
    
    // Find the trigger and simulate a click
    const trigger = screen.getByText('maximum_subarray');
    fireEvent.click(trigger);
    
    // Wait for tooltip content to appear - it should show "Symbol not found" for test data
    await waitFor(() => {
      expect(screen.getByText(/Symbol not found/)).toBeInTheDocument();
    });
  });
});