import type { Strong, Emphasis, InlineCode } from 'mdast'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'
import { isValidColorName, getStepColor } from './lib/step-colors.js'

interface HastData {
  hProperties?: Record<string, string>
}

const remarkTypography: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'strong' || node.type === 'emphasis' || node.type === 'inlineCode') {
        transformStepSyntax(node)
      }
    })
  }
}

function transformStepSyntax(node: Strong | Emphasis | InlineCode): void {
  let text: string
  let updateText: (content: string) => void

  if (node.type === 'inlineCode') {
    text = node.value
    updateText = (content) => {
      node.value = content
    }
  } else {
    if (node.children.length === 0) return

    const firstChild = node.children[0]
    if (firstChild.type !== 'text') return

    text = firstChild.value
    updateText = (content) => {
      firstChild.value = content
    }
  }

  const stepMatch = text.match(/^\[([^!]+)!\](.*)$/)
  if (stepMatch === null) return

  const [, stepOrColor, content] = stepMatch

  let stepValue: string | undefined

  if (/^\d+$/.test(stepOrColor)) {
    const stepNumber = parseInt(stepOrColor, 10)
    stepValue = getStepColor(stepNumber)
  } else if (isValidColorName(stepOrColor)) {
    stepValue = stepOrColor
  }

  if (stepValue === undefined) return

  updateText(content)

  const data = (node.data ?? {}) as HastData
  node.data = data
  data.hProperties = data.hProperties ?? {}
  data.hProperties['data-step'] = stepValue
}

export default remarkTypography
