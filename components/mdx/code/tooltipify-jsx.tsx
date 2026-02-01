import { isValidElement, cloneElement, type ReactNode, type ReactElement } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type ElementProps = Record<string, unknown>
type RenderContent = (qname: string) => ReactNode

/**
 * Recursively processes a React node tree to add interactive tooltip functionality.
 *
 * Traverses JSX elements looking for `data-tooltip-symbol` attributes and wraps
 * them in Radix UI Popover components. Handles nested tooltips by processing
 * children first.
 */
export const tooltipifyJSX = (
  node: ReactNode,
  renderContent: RenderContent
): ReactNode => {
  if (Array.isArray(node)) {
    return node.map((child: ReactNode, i: number): ReactNode => {
      const processed = tooltipifyJSX(child, renderContent)
      if (!isValidElement(processed)) return processed
      const key: string | number = isValidElement(child) && child.key != null
        ? child.key
        : i
      return cloneElement(processed, { key })
    })
  }

  if (!isValidElement(node)) return node

  const element = node as ReactElement<ElementProps>
  const { children, ...restProps } = element.props
  const props: ElementProps = { ...restProps }
  const qname = props['data-tooltip-symbol'] as string | undefined

  const processedChildren = tooltipifyJSX(children as ReactNode, renderContent)

  if (!qname) {
    return cloneElement(element, props, processedChildren)
  }

  const isCommentSymbol =
    typeof props.className === 'string' &&
    props.className.includes('comment-symbol')

  if (isCommentSymbol) {
    return (
      <Popover modal={false}>
        <PopoverTrigger asChild>
          <span className="group relative">
            {cloneElement(
              element,
              {
                ...props,
                className: cn(
                  props.className as string,
                  'cursor-pointer rounded-md transition-colors duration-200',
                  'hover:bg-green-500/10'
                )
              },
              processedChildren
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent className="max-h-96 w-96 overflow-y-auto rounded-lg border-none p-0">
          {renderContent(qname)}
        </PopoverContent>
      </Popover>
    )
  }

  // Remove tooltip attributes from the element
  delete props['data-tooltip-symbol']

  // Remove the tooltip-symbol class if present
  if (typeof props.class === 'string') {
    props.class = props.class
      .split(' ')
      .filter((cls) => cls !== 'tooltip-symbol')
      .join(' ')
  }

  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        {cloneElement(
          element,
          {
            ...props,
            className: cn(
              props.className as string,
              'cursor-pointer rounded-md transition-colors duration-300',
              'hover:bg-gray-200/30 dark:hover:bg-gray-800/30'
            )
          },
          processedChildren
        )}
      </PopoverTrigger>
      <PopoverContent className="max-h-96 w-96 overflow-y-auto rounded-lg border-none p-0">
        {renderContent(qname)}
      </PopoverContent>
    </Popover>
  )
}
