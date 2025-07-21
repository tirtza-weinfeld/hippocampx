// import React from 'react';
// import { describe, it, expect, beforeEach, vi } from 'vitest';
// import { render, screen } from '@testing-library/react';
// import { tooltipifyJSX } from '@/components/mdx/code/tooltipify-jsx';

// // Mock the Popover components to avoid complex rendering issues in tests
// vi.mock('@/components/ui/popover', () => ({
//   Popover: ({ children }: { children: React.ReactNode }) => <div data-testid="popover">{children}</div>,
//   PopoverTrigger: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
//     <button data-testid="popover-trigger" {...props}>
//       {children}
//     </button>
//   ),
//   PopoverContent: ({ children }: { children: React.ReactNode }) => (
//     <div data-testid="popover-content">{children}</div>
//   ),
// }));

// describe('Line Range Highlighting', () => {
//   beforeEach(() => {
//     // Clear any previous renders
//     document.body.innerHTML = '';
//   });

//   describe('groupLineRanges - Detection Phase', () => {
//     it('should detect single line range element', () => {
//       const jsx = (
//         <span data-tooltip-type="line_range" data-tooltip-expression="@line[6-7]" data-tooltip-comment="Test comment">
//           test content
//         </span>
//       );

//       // Test that groupLineRanges creates a unified popover trigger
//       const result = tooltipifyJSX(jsx, () => <div>tooltip</div>);
      
//       render(<>{result}</>);
      
//       // Should still find the content inside the grouped container
//       expect(screen.getByText('test content')).toBeInTheDocument();
      
//       // Check that line range element is wrapped in a Popover
//       const content = screen.getByText('test content');
//       expect(content.closest('[data-testid="popover"]')).toBeInTheDocument();
//     });
//   });

//   describe('Visual Appearance', () => {
//     it('should render line range highlights with correct CSS classes', () => {
//       // Create a mock JSX tree with line range highlights
//       const jsx = (
//         <div>
//           <span className="line-range-highlight" data-line-range="6-7" data-expression="test1">
//             if a[mid] &lt; x:
//           </span>
//           <span className="line-range-highlight" data-line-range="6-7" data-expression="test1">
//             lo = mid + 1
//           </span>
//           <span className="line-range-highlight" data-line-range="8-9" data-expression="test2">
//             else:
//           </span>
//           <span className="line-range-highlight" data-line-range="8-9" data-expression="test2">
//             hi = mid
//           </span>
//         </div>
//       );

//       const tree = tooltipifyJSX(jsx, () => 
//         <div data-testid="tooltip-content">Tooltip</div>
//       );

//       render(<>{tree}</>);

//       // Check that line range highlights are present
//       const highlights = screen.getAllByText(/if a\[mid\]|lo = mid \+ 1|else:|hi = mid/);
//       expect(highlights).toHaveLength(4);

//       // Check that each highlight has the correct class
//       highlights.forEach(highlight => {
//         expect(highlight).toHaveClass('line-range-highlight');
//       });
//     });

//     it('should preserve data attributes on line range highlights', () => {
//       const jsx = (
//         <span 
//           className="line-range-highlight" 
//           data-line-range="6-7" 
//           data-expression="test1"
//           data-tooltip-symbol="mid"
//         >
//           if a[mid] &lt; x:
//         </span>
//       );

//       const tree = tooltipifyJSX(jsx, () => 
//         <div data-testid="tooltip-content">Tooltip</div>
//       );

//       render(<>{tree}</>);

//       const highlight = screen.getByText(/if a\[mid\]/);
//       expect(highlight).toHaveAttribute('data-line-range', '6-7');
//       expect(highlight).toHaveAttribute('data-expression', 'test1');
//       expect(highlight).toHaveAttribute('data-tooltip-symbol', 'mid');
//     });
//   });

//   describe('Tooltip Integration', () => {
//     it('should render tooltips for symbols within line range highlights', () => {
//       const jsx = (
//         <span 
//           className="line-range-highlight" 
//           data-line-range="6-7" 
//           data-expression="test1"
//         >
//           if a[<span data-tooltip-symbol="mid">mid</span>] &lt; x:
//         </span>
//       );

//       const tree = tooltipifyJSX(jsx, () => 
//         <div data-testid="tooltip-content">Tooltip</div>
//       );

//       render(<>{tree}</>);

//       // Check that the tooltip trigger is present
//       const tooltipTrigger = screen.getByText('mid');
//       expect(tooltipTrigger).toBeInTheDocument();
//       expect(tooltipTrigger.closest('button')).toHaveAttribute('data-testid', 'popover-trigger');
//     });

//     it('should handle multiple tooltips within the same line range', () => {
//       const jsx = (
//         <div>
//           <span className="line-range-highlight" data-line-range="6-7" data-expression="test1">
//             if a[<span data-tooltip-symbol="mid">mid</span>] &lt; <span data-tooltip-symbol="x">x</span>:
//           </span>
//           <span className="line-range-highlight" data-line-range="6-7" data-expression="test1">
//             <span data-tooltip-symbol="lo">lo</span> = <span data-tooltip-symbol="mid">mid</span> + 1
//           </span>
//         </div>
//       );

//       const tree = tooltipifyJSX(jsx, () => 
//         <div data-testid="tooltip-content">Tooltip</div>
//       );

//       render(<>{tree}</>);

//       // Check that all tooltip triggers are present
//       const tooltipTriggers = screen.getAllByText(/mid|x|lo/);
//       expect(tooltipTriggers.length).toBeGreaterThan(0);

//       // Verify each trigger is a button (popover trigger)
//       tooltipTriggers.forEach(trigger => {
//         expect(trigger.closest('button')).toHaveAttribute('data-testid', 'popover-trigger');
//       });
//     });
//   });

//   describe('Expression-based Tooltips', () => {
//     it('should render expression tooltips with correct styling', () => {
//       const jsx = (
//         <span 
//           className="line-range-highlight" 
//           data-line-range="5-5" 
//           data-expression="(lo + hi) // 2"
//         >
//           <span data-tooltip-expression="(lo + hi) // 2" className="tooltip-expression">
//             (lo + hi) // 2
//           </span>
//         </span>
//       );

//       const tree = tooltipifyJSX(jsx, () => 
//         <div data-testid="tooltip-content">Expression tooltip</div>
//       );

//       render(<>{tree}</>);

//       const expressionTrigger = screen.getByText('(lo + hi) // 2');
//       expect(expressionTrigger).toHaveClass('tooltip-expression');
//       expect(expressionTrigger.closest('button')).toHaveAttribute('data-testid', 'popover-trigger');
//     });
//   });

//   describe('Complex Scenarios', () => {
//     it('should handle mixed content with line ranges, tooltips, and expressions', () => {
//       const jsx = (
//         <div>
//           <span 
//             data-tooltip-type="line_range" 
//             data-tooltip-expression="@line[6-7]" 
//             data-tooltip-comment="If condition block"
//             className="line-range-highlight"
//           >
//             if a[<span data-tooltip-symbol="mid">mid</span>] &lt; <span data-tooltip-symbol="x">x</span>:
//           </span>
//           <span 
//             data-tooltip-type="line_range" 
//             data-tooltip-expression="@line[6-7]" 
//             data-tooltip-comment="If condition block"
//             className="line-range-highlight"
//           >
//             <span data-tooltip-symbol="lo">lo</span> = <span data-tooltip-symbol="mid">mid</span> + 1
//           </span>
//           <span 
//             data-tooltip-type="line_range" 
//             data-tooltip-expression="@line[8-9]" 
//             data-tooltip-comment="Else block"
//             className="line-range-highlight"
//           >
//             else:
//           </span>
//           <span 
//             data-tooltip-type="line_range" 
//             data-tooltip-expression="@line[8-9]" 
//             data-tooltip-comment="Else block"
//             className="line-range-highlight"
//           >
//             <span data-tooltip-symbol="hi">hi</span> = <span data-tooltip-symbol="mid">mid</span>
//           </span>
//         </div>
//       );

//       const tree = tooltipifyJSX(jsx, () => 
//         <div data-testid="tooltip-content">Tooltip</div>
//       );

//       render(<>{tree}</>);

//       // With grouping, we should have 2 unified containers (one for each line range expression)
//       // instead of 4 separate elements
//       const popoverTriggers = screen.getAllByTestId('popover-trigger');
//       expect(popoverTriggers).toHaveLength(2); // Two groups: @line[6-7] and @line[8-9]

//       // Check that content is still present (now grouped)
//       expect(screen.getByText(/if a\[/)).toBeInTheDocument();
//       expect(screen.getByText(/lo = mid \+ 1/)).toBeInTheDocument();
//       expect(screen.getByText('else:')).toBeInTheDocument();
//       expect(screen.getByText(/hi = mid/)).toBeInTheDocument();

//       // Check that all tooltip triggers for symbols are present
//       const tooltipTriggers = screen.getAllByText(/mid|x|lo|hi/);
//       expect(tooltipTriggers.length).toBeGreaterThan(0);

//       // Verify each tooltip trigger is a button
//       tooltipTriggers.forEach(trigger => {
//         expect(trigger.closest('button')).toHaveAttribute('data-testid', 'popover-trigger');
//       });
//     });
//   });

//   describe('CSS Class Verification', () => {
//     it('should apply correct CSS classes for visual styling', () => {
//       const jsx = (
//         <span className="line-range-highlight" data-line-range="6-7" data-expression="test">
//           Test content
//         </span>
//       );

//       const tree = tooltipifyJSX(jsx, () => 
//         <div data-testid="tooltip-content">Tooltip</div>
//       );

//       render(<>{tree}</>);

//       const highlight = screen.getByText('Test content');
      
//       // These classes should be present for proper styling
//       expect(highlight).toHaveClass('line-range-highlight');
//       expect(highlight).toHaveAttribute('data-line-range');
//       expect(highlight).toHaveAttribute('data-expression');
//     });
//   });
// }); 