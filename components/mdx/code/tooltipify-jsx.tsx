import React, { isValidElement, cloneElement, ReactElement, JSXElementConstructor } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';


/**
 * Recursively processes a React node tree to add interactive tooltip functionality.
 * 
 * This function traverses JSX elements looking for tooltip data attributes and wraps
 * them in Radix UI Popover components to create interactive code tooltips. It handles
 * nested tooltips by using overlay techniques for expressions containing other tooltipable elements.
 * 
 * @param node - The React node to process (can be element, array, or primitive)
 * @param renderContent - Callback function that generates tooltip content for a qname
 *   - qname: The qualified name from data-tooltip-symbol attribute (e.g., "koko_eating_bananas:koko_eating_bananas.h")
 * 
 * @returns The processed React node with tooltip functionality added
 * 
 * @example
 * ```tsx
 * const tooltippedCode = tooltipifyJSX(
 *   highlightedCode,
 *   (qname) => renderTooltipContent(qname, metadata)
 * );
 * ```
 * 
 * Key features:
 * - Processes children first to allow nested tooltips to work properly
 * - Removes tooltip data attributes from final rendered elements
 * - Applies hover effects and styling based on tooltip type (function, class, parameter, etc.)
 */
export function tooltipifyJSX(
  node: React.ReactNode,
  renderContent: (qname: string) => React.ReactNode
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

  const element = node as ReactElement<Record<string, unknown>, string | JSXElementConstructor<unknown>>;
  const { children, ...restProps } = element.props;
  const props: Record<string, unknown> = { ...restProps };
  const qname = props['data-tooltip-symbol'] as string | undefined;

  const processedChildren = tooltipifyJSX(children as React.ReactNode, renderContent) as React.ReactNode;

  if (qname) {
    // Remove tooltip attributes from the span
    delete props['data-tooltip-symbol'];
    // Remove the tooltip-symbol class
    if (typeof props.class === 'string') {
      props.class = props.class
        .split(' ')
        .filter((cls) => cls !== 'tooltip-symbol')
        .join(' ');
    }

   
    return (
      <Popover modal={false}>
        <PopoverTrigger asChild>
          {cloneElement(element, {
            ...props,
            className: cn(
              props.className as string,
              "cursor-pointer px-1.5 transition-all duration-300 hover:bg-gray-200/30 dark:hover:bg-gray-800/30 rounded-md"
            )
          }, processedChildren)}
        </PopoverTrigger>
        {/* <PopoverContent className="w-[90vw]  max-h-96 rounded-xl overflow-y-auto p-0 "> */}
        <PopoverContent className="w-96 max-h-96 rounded-xl overflow-y-auto p-0 ">
          
          {renderContent(qname)}
        </PopoverContent>
      </Popover>
    );
  }

  // Recursively process children
  return cloneElement(element, props, processedChildren);
}
