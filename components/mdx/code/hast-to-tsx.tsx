import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import type { Element, Root } from 'hast'
import type { ComponentPropsWithoutRef } from 'react'

// Helper to map 'class' to 'className' and preserve all data-* attributes
function mapProps(props: Record<string, unknown>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {}
  for (const key in props) {
    if (key === 'class') {
      mapped.className = props[key]
    } else if (key.startsWith('data-')) {
      mapped[key] = props[key]
    } else {
      mapped[key] = props[key]
    }
  }
  // if (props['data-tooltip-symbol']) {
  //   console.log('HAST-TO-JSX PROPS:', props)
  // }
  return mapped
}

export function hastToJSX(hast: Root | Element, isInline: boolean = false): React.ReactElement {
  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components: isInline ? {
      // Convert pre elements to span elements only for inline code
      // to fix HTML nesting issues (pre cannot be inside p elements)
      pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => (
        <span {...mapProps(props)}>{children}</span>
      ),
      span: ({ children, ...props }: ComponentPropsWithoutRef<'span'>) => (
        <span {...mapProps(props)}>{children}</span>
      ),
      code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => (
        <code {...mapProps(props)}>{children}</code>
      )
    } : {}
  }) as React.ReactElement
}