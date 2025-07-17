// import { render } from '@testing-library/react'
// import { processLineRangeTooltips } from '@/components/mdx/code/line-range-tooltips'
// import React from 'react'
// import { describe, it, expect } from 'vitest'

// describe('Line Range Tooltip Grouping', () => {
//   it('groups consecutive line range elements with same expression', () => {
//     // Create test elements that simulate line range tooltips
//     const testElements = [
//       React.createElement('span', {
//         'data-line-range-type': 'line_range',
//         'data-line-range-expression': '@line[1-3]',
//         'data-line-range-comment': 'This is a test comment',
//         className: 'line-range-highlight'
//       }, 'line 1'),
//       React.createElement('span', {
//         'data-line-range-type': 'line_range',
//         'data-line-range-expression': '@line[1-3]',
//         'data-line-range-comment': 'This is a test comment',
//         className: 'line-range-highlight'
//       }, 'line 2'),
//       React.createElement('span', {
//         'data-line-range-type': 'line_range',
//         'data-line-range-expression': '@line[1-3]',
//         'data-line-range-comment': 'This is a test comment',
//         className: 'line-range-highlight'
//       }, 'line 3'),
//       React.createElement('span', {}, 'normal text')
//     ]

//     const result = processLineRangeTooltips(testElements)
    
//     // Render the result to inspect the HTML structure
//     const { container } = render(<div>{result}</div>)
    
//     // Debug: log the HTML to see what's actually rendered
//     console.log('Rendered HTML:', container.innerHTML)
    
//     // Should have one unified popover trigger for the grouped elements
//     const popoverTriggers = container.querySelectorAll('.line-range-group')
//     console.log('Found popover triggers:', popoverTriggers.length)
//     expect(popoverTriggers.length).toBe(1)
    
//     // The grouped elements should not have individual tooltip attributes
//     const lineRangeElements = container.querySelectorAll('.line-range-highlight')
//     expect(lineRangeElements.length).toBe(3)
    
//     // Check that tooltip attributes are stripped from individual elements
//     lineRangeElements.forEach(element => {
//       expect(element).not.toHaveAttribute('data-line-range-type')
//       expect(element).not.toHaveAttribute('data-line-range-expression')
//       expect(element).not.toHaveAttribute('data-line-range-comment')
//     })
    
//     // Check that the unified container exists
//     const unifiedContainer = container.querySelector('.line-range-unified-container')
//     expect(unifiedContainer).toBeInTheDocument()
//   })

//   it('does not group line range elements with different expressions', () => {
//     const testElements = [
//       React.createElement('span', {
//         'data-line-range-type': 'line_range',
//         'data-line-range-expression': '@line[1-2]',
//         'data-line-range-comment': 'First group',
//         className: 'line-range-highlight'
//       }, 'line 1'),
//       React.createElement('span', {
//         'data-line-range-type': 'line_range',
//         'data-line-range-expression': '@line[1-2]',
//         'data-line-range-comment': 'First group',
//         className: 'line-range-highlight'
//       }, 'line 2'),
//       React.createElement('span', {
//         'data-line-range-type': 'line_range',
//         'data-line-range-expression': '@line[3-4]',
//         'data-line-range-comment': 'Second group',
//         className: 'line-range-highlight'
//       }, 'line 3'),
//       React.createElement('span', {
//         'data-line-range-type': 'line_range',
//         'data-line-range-expression': '@line[3-4]',
//         'data-line-range-comment': 'Second group',
//         className: 'line-range-highlight'
//       }, 'line 4')
//     ]

//     const result = processLineRangeTooltips(testElements)
//     const { container } = render(<div>{result}</div>)
    
//     // Should have two separate popover triggers (one for each group)
//     const popoverTriggers = container.querySelectorAll('.line-range-group')
//     expect(popoverTriggers.length).toBe(2)
//   })
// }) 