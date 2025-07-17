import React, { isValidElement } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

// Group line range elements with same expression into unified popover triggers
export function groupLineRanges(node: React.ReactNode): React.ReactNode {
  // Handle arrays of nodes
  if (Array.isArray(node)) {
    const processedArray = node.map((child) => groupLineRanges(child));
    
    // Group consecutive line range elements with same expression
    const grouped: React.ReactNode[] = [];
    let currentGroup: {
      expression: string;
      comment: string;
      startLine: string;
      endLine: string;
      elements: React.ReactElement[];
    } | null = null;
    
    for (const child of processedArray) {
      if (isValidElement(child)) {
        const props = child.props as Record<string, unknown>;
        
        if (props['data-line-range-type'] === 'line_range') {
          const expression = props['data-line-range-expression'] as string;
          const comment = props['data-line-range-comment'] as string;
          const startLine = props['data-line-range-start'] as string;
          const endLine = props['data-line-range-end'] as string;
          
          // If this is the same expression as current group, add to group
          if (currentGroup && currentGroup.expression === expression) {
            currentGroup.elements.push(child);
          } else {
            // Finalize current group if it exists
            if (currentGroup) {
              grouped.push(createLineRangeGroup(currentGroup));
            }
            // Start new group
            currentGroup = {
              expression,
              comment,
              startLine,
              endLine,
              elements: [child]
            };
          }
        } else {
          // Finalize current group if it exists
          if (currentGroup) {
            grouped.push(createLineRangeGroup(currentGroup));
            currentGroup = null;
          }
          grouped.push(child);
        }
      } else {
        // Finalize current group if it exists
        if (currentGroup) {
          grouped.push(createLineRangeGroup(currentGroup));
          currentGroup = null;
        }
        grouped.push(child);
      }
    }
    
    // Finalize any remaining group
    if (currentGroup) {
      grouped.push(createLineRangeGroup(currentGroup));
    }
    
    return grouped;
  }
  
  if (!isValidElement(node)) return node;
  
  // Process single element
  const element = node as React.ReactElement;
  const props = element.props as Record<string, unknown>;
  
  if (props['data-line-range-type'] === 'line_range') {
    const expression = props['data-line-range-expression'] as string;
    const comment = props['data-line-range-comment'] as string;
    const startLine = props['data-line-range-start'] as string;
    const endLine = props['data-line-range-end'] as string;
    
    return createLineRangeGroup({
      expression,
      comment,
      startLine,
      endLine,
      elements: [element]
    });
  }
  
  // Recursively process children
  const processedChildren = groupLineRanges((element.props as Record<string, unknown>).children as React.ReactNode);
  return React.cloneElement(element, element.props as Record<string, unknown>, processedChildren);
}

// Create a unified popover trigger for a group of line range elements
function createLineRangeGroup(group: {
  expression: string;
  comment: string;
  startLine: string;
  endLine: string;
  elements: React.ReactElement[];
}): React.ReactNode {
  // Strip all tooltip attributes from elements to prevent conflicts
  const cleanElements = group.elements.map((element, index) => {
    // Completely strip all tooltip attributes from the element and its children
    const cleanedElement = stripAllTooltipAttributes(element) as React.ReactElement;
    
    return React.cloneElement(cleanedElement, { 
      key: index
    });
  });
  
  // Wrap the entire group in a single Popover
  return (
    <Popover key={`line-range-${group.expression}`}>
      <PopoverTrigger className="line-range-group cursor-pointer">
        <span className="line-range-unified-container">
          {cleanElements}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-96 overflow-y-auto">
        <div className="min-w-[220px] max-w-[400px]">
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              Code Block
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Lines {group.startLine}-{group.endLine}
            </div>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {group.comment}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Helper function to completely strip ALL tooltip attributes from an element and its children
function stripAllTooltipAttributes(node: React.ReactNode): React.ReactNode {
  if (Array.isArray(node)) {
    return node.map(stripAllTooltipAttributes);
  }
  
  if (!isValidElement(node)) {
    return node;
  }
  
  // Get all props and manually remove tooltip-related ones
  const allProps = node.props as Record<string, unknown> & { 
    children?: React.ReactNode;
    className?: string;
  };
  
  // Create a clean props object without tooltip attributes
  const cleanProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(allProps)) {
    if (!key.startsWith('data-tooltip-') && !key.startsWith('data-expression-') && !key.startsWith('data-line-range-') && key !== 'data-line-range') {
      cleanProps[key] = value;
    }
  }
  
  // Remove tooltip-related CSS classes
  const className = allProps.className;
  const cleanClassName = className
    ? className.split(' ')
        .filter(cls => !cls.includes('tooltip-') && !cls.includes('expression-') && cls !== 'line-range-highlight')
        .join(' ')
    : undefined;
  
  const processedChildren = stripAllTooltipAttributes(allProps.children);
  
  // Create completely clean element with no tooltip attributes
  return React.cloneElement(node, {
    ...cleanProps,
    ...(cleanClassName && { className: cleanClassName }),
    ...({ 
      'data-processed': 'true', // Mark as processed to prevent re-processing
      'data-grouped': 'true' // Mark as grouped to prevent individual processing
    } as Record<string, unknown>)
  }, processedChildren);
}

// Main function to process line range tooltips
export function processLineRangeTooltips(node: React.ReactNode): React.ReactNode {
  return groupLineRanges(node);
} 