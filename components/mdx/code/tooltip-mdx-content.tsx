import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import { remarkTypography } from '@/plugins/remark-typography'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import type { Root as HastRoot } from 'hast'
import { customComponents } from '@/mdx-components'

/**
 * Server component that processes tooltip markdown content using the same
 * remark/rehype plugins and custom components as the main MDX system.
 */

interface TooltipMDXContentProps {
  children: string
  className?: string
}

// Create processor with basic plugins only - tooltips should be simple
const tooltipProcessor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkGfm) 
  .use(remarkTypography)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex, {
    throwOnError: false,
    displayMode: false,
    strict: false,
    trust: true
  })

/**
 * Processes plain markdown content using the same plugins and custom components 
 * as the main MDX system. This ensures consistent styling and behavior.
 */
export function TooltipMDXContentSync({ children, className = '' }: TooltipMDXContentProps) {
  if (!children.trim()) {
    return null
  }

  try {
    // Process plain markdown through the unified pipeline
    const mdast = tooltipProcessor.parse(children)
    const hastTree = tooltipProcessor.runSync(mdast, children) as HastRoot
    
    // Convert HAST to React elements using the same custom components as main MDX
    const reactElement = toJsxRuntime(hastTree, {
      Fragment,
      jsx,
      jsxs,
      components: {
        ...customComponents,
        // Override pre/code for inline tooltips to avoid nesting issues
        pre: ({ children, ...props }) => <span {...props}>{children}</span>,
      }
    }) as React.ReactElement
    
    return (
      <div className={className}>
        {reactElement}
      </div>
    )
  } catch (error) {
    // Fallback to raw content if processing fails
    console.warn('Tooltip markdown processing failed:', error)
    return (
      <div className={className}>
        {children}
      </div>
    )
  }
}

// Alias for the sync version since async MDX evaluation doesn't work for plain markdown
export const TooltipMDXContent = TooltipMDXContentSync