import React, { isValidElement, cloneElement, ReactElement, JSXElementConstructor } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

// Process expression tooltips only (not line range tooltips)
export function processExpressionTooltips(
  node: React.ReactNode,
  renderContent: (symbol: string, parent?: string, path?: string[]) => React.ReactNode
): React.ReactNode {
  if (Array.isArray(node)) {
    return node.map((child, i) =>
      React.isValidElement(child)
        ? React.cloneElement(
            processExpressionTooltips(child, renderContent) as React.ReactElement,
            { key: child.key ?? i }
          )
        : processExpressionTooltips(child, renderContent)
    );
  }
  
  if (!isValidElement(node)) return node;

  // Use a more specific ReactElement type
  const element = node as ReactElement<Record<string, unknown>, string | JSXElementConstructor<unknown>>;
  const { children, ...restProps } = element.props;
  const props: Record<string, unknown> = { ...restProps };
  
  const symbol = props['data-tooltip-symbol'] as string | undefined;
  const parent = props['data-tooltip-parent'] as string | undefined;
  const pathString = props['data-tooltip-path'] as string | undefined;
  const path = pathString ? JSON.parse(pathString) as string[] : undefined;

  // Handle expression tooltips
  const expression = props['data-expression-tooltip'] as string | undefined;
  const comment = props['data-expression-comment'] as string | undefined;
  const tooltipType = props['data-expression-type'] as string | undefined;

  // Explicitly cast children to React.ReactNode for recursion
  const processedChildren = processExpressionTooltips(children as React.ReactNode, renderContent) as React.ReactNode;

  // Skip line range tooltips completely - they are handled separately
  if (props['data-line-range-type'] === 'line_range') {
    return cloneElement(element, props, processedChildren);
  }

  // Skip elements that have been processed by line range processor
  if (props['data-processed'] === 'true' || props['data-grouped'] === 'true') {
    return cloneElement(element, props, processedChildren);
  }

  // Handle symbol tooltips
  if (symbol) {
    // Remove tooltip attributes from the span
    delete props['data-tooltip-symbol'];
    delete props['data-tooltip-parent'];
    delete props['data-tooltip-path'];
    // Remove the tooltip-symbol class
    if (typeof props.class === 'string') {
      props.class = props.class
        .split(' ')
        .filter((cls) => cls !== 'tooltip-symbol')
        .join(' ');
    }

    return (
      <Popover>
        <PopoverTrigger className="">
          {cloneElement(element, props, processedChildren)}
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-96 overflow-y-auto">
          {renderContent(symbol, parent, path)}
        </PopoverContent>
      </Popover>
    );
  }

  // Handle expression tooltips with comment
  if (expression && comment && tooltipType === 'expression') {
    // Remove expression tooltip attributes from the span
    delete props['data-expression-tooltip'];
    delete props['data-expression-comment'];
    delete props['data-expression-type'];
    // Remove the tooltip-symbol and expression-tooltip classes
    if (typeof props.class === 'string') {
      props.class = props.class
        .split(' ')
        .filter((cls) => cls !== 'tooltip-symbol' && cls !== 'expression-tooltip')
        .join(' ');
    }

    return (
      <Popover>
        <PopoverTrigger className="">
          {cloneElement(element, props, processedChildren)}
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-96 overflow-y-auto">
          <div className="min-w-[220px] max-w-[400px]">
            <div className="mb-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Expression
              </h3>
              <div className="font-mono text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                {expression}
              </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {comment}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Handle expression tooltips with just data-expression-tooltip (no comment required)
  if (expression && !comment && !tooltipType) {
    // Remove expression tooltip attributes from the span
    delete props['data-expression-tooltip'];
    // Keep the tooltip-expression class for styling
    
    return (
      <Popover>
        <PopoverTrigger className="">
          {cloneElement(element, props, processedChildren)}
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-96 overflow-y-auto">
          <div className="min-w-[220px] max-w-[400px]">
            <div className="mb-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Expression Tooltip
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                This is an interactive code expression.
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Recursively process children
  return cloneElement(element, props, processedChildren);
} 