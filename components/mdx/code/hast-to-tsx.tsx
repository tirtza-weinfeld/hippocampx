import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import type { Element, Root } from 'hast'
import { customComponents } from '@/mdx-components'


  
export function hastToJSX(hast: Root | Element) {
  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components: {
        span: customComponents['span']
    }
  })
}