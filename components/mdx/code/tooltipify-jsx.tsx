import React, { isValidElement, cloneElement, ReactElement, JSXElementConstructor } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Function to get background color class based on tooltip type
function getTooltipBgColor(type: string | undefined): string {
  switch (type) {
    case 'method':
    case 'function':
      return 'hover:bg-yellow-200/20 dark:hover:bg-yellow-800/10';
    case 'class':
      return 'hover:bg-sky-200/30 dark:hover:bg-sky-800/10';
    case 'parameter':
      return 'hover:bg-blue-200/30 dark:hover:bg-blue-800/20';
    case 'variable':
      return 'hover:bg-purple-200/30 dark:hover:bg-purple-800/20';
    case 'expression':
      return 'hover:bg-cyan-200/30 dark:hover:bg-cyan-800/30';
    default:
      return 'hover:bg-gray-200/50 dark:hover:bg-gray-800/50';
  }
}

// You may want to pass in a function to render the popover content for a symbol/parent
// Helper function to check if a React node contains nested tooltip elements
function hasNestedTooltips(node: React.ReactNode): boolean {
  if (!React.isValidElement(node)) return false;
  
  const element = node as ReactElement<Record<string, unknown>, string | JSXElementConstructor<unknown>>;
  if (element.props['data-tooltip-symbol']) return true;
  
  const children = element.props.children as React.ReactNode;
  if (Array.isArray(children)) {
    return children.some(child => hasNestedTooltips(child));
  }
  
  return hasNestedTooltips(children);
}

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

  // IMPORTANT: Process children FIRST to allow nested tooltips to work
  // This ensures that nested symbol tooltips (like triangle, r, c, dp) are processed
  // before parent expression tooltips, preventing conflicts
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

    // Check if this element contains nested tooltips
    const hasNested = hasNestedTooltips(processedChildren);
    
    if (hasNested && type === 'expression') {
      // For expressions with nested tooltips, create a container where only empty space triggers the tooltip
      return (
        <div className="inline-block relative">
          {/* Invisible overlay that captures clicks only on empty space */}
          <Popover modal={false}>
            <PopoverTrigger asChild>
              <div className={cn(
                "absolute inset-0 cursor-pointer transition-all duration-300",
                getTooltipBgColor(type),
                "rounded-md -z-10"
              )} />
            </PopoverTrigger>
            <PopoverContent className="w-96 max-h-96 overflow-y-auto">
              {renderContent(symbol, parent, path)}
            </PopoverContent>
          </Popover>
          {/* The actual content with nested tooltips on top */}
          {cloneElement(element, {
            ...props,
            className: cn(props.className as string, "relative z-10")
          }, processedChildren)}
        </div>
      );
    }

    // Regular tooltip without nested interference
    return (
      <Popover modal={false}>
        <PopoverTrigger asChild>
          {cloneElement(element, {
            ...props,
            className: cn(
              props.className as string,
              `cursor-pointer px-1.5 transition-all duration-300 ${getTooltipBgColor(type)}`,
              "rounded-md"
            )
          }, processedChildren)}
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
