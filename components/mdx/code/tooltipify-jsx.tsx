import React, { isValidElement, cloneElement, ReactElement, JSXElementConstructor } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Function to get background color class based on tooltip type
function getTooltipBgColor(type: string | undefined): string {
  switch (type) {
    case 'method':
    case 'function':
      return 'hover:bg-yellow-200/20  dark:hover:bg-yellow-800/10';
    case 'class':
      return 'hover:bg-purple-200/30  dark:hover:bg-purple-800/10';
    case 'parameter':
      return ' hover:bg-blue-200/30 dark:hover:bg-blue-800/20';
    case 'variable':
      return ' hover:bg-purple-200/30 dark:hover:bg-purple-800/20';
    case 'expression':
      return ' hover:bg-cyan-200/30 dark:hover:bg-cyan-800/30  ';
    default:
      return ' hover:bg-gray-200/50  dark:hover:bg-gray-800/50';
  }
}

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
  const type = props['data-tooltip-type'] as string | undefined;

  // Explicitly cast children to React.ReactNode for recursion
  const processedChildren = tooltipifyJSX(children as React.ReactNode, renderContent) as React.ReactNode;

  if (symbol) {
        // Remove tooltip attributes from the span
    delete props['data-tooltip-symbol'];
    delete props['data-tooltip-parent'];
    delete props['data-tooltip-path'];
    // delete props['data-tooltip-type'];
    // Remove the tooltip-symbol class
    if (typeof props.class === 'string') {
      props.class = props.class
        .split(' ')
        .filter((cls) => cls !== 'tooltip-symbol')
        .join(' ');
    }

    return (
      <Popover>
        <PopoverTrigger asChild className={cn(`cursor-pointer  px-1.5  transition-all duration-300 ${getTooltipBgColor(type)}`
        ,
        "rounded-md",
        "[data-tooltip-type!=expression]:bg-red-00",


      
      )}>
          {cloneElement(element, props, processedChildren)}
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-96 overflow-y-auto 
        
        ">
          {renderContent(symbol, parent, path)}
        </PopoverContent>
      </Popover>
    );
  }

  // Recursively process children
  return cloneElement(element, props, processedChildren);
}
