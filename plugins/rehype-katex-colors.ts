import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * Rehype plugin that transforms KaTeX inline color styles to data-step attributes.
 * Must run after rehype-katex.
 *
 * Converts: style="color: red" → data-step="red"
 */
const rehypeKatexColors: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      const style = node.properties.style

      if (typeof style !== 'string') return
      if (!style.includes('color')) return

      const match = style.match(/color:\s*(\w+)/)
      if (!match) return

      const colorName = match[1]

      node.properties['dataStep'] = colorName
      delete node.properties.style
    })
  }
}

export default rehypeKatexColors
