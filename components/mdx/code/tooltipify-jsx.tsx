import React, { isValidElement, cloneElement, ReactElement, JSXElementConstructor } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

// You may want to pass in a function to render the popover content for a symbol/parent
export function tooltipifyJSX(
  node: React.ReactNode,
  renderContent: (symbol: string, parent?: string, path?: string[]) => React.ReactNode
): React.ReactNode {
  if (Array.isArray(node)) {
    return node.map((child, i) =>
      React.isValidElement(child)
        ? React.cloneElement(
            tooltipifyJSX(child, renderContent) as React.ReactElement,
            { key: child.key ?? i }
          )
        : tooltipifyJSX(child, renderContent)
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

  // Explicitly cast children to React.ReactNode for recursion
  const processedChildren = tooltipifyJSX(children as React.ReactNode, renderContent) as React.ReactNode;

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
        <PopoverTrigger>
          {cloneElement(element, props, processedChildren)}
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-96 overflow-y-auto">
          {renderContent(symbol, parent, path)}
        </PopoverContent>
      </Popover>
    );
  }

  // Recursively process children
  return cloneElement(element, props, processedChildren);
}
