import type { Strong, Emphasis, InlineCode } from 'mdast'
import type { Plugin } from 'unified'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import { isValidColorName, getStepColor } from '../lib/step-colors'

export const remarkTypography: Plugin = () => (tree: Node) => {
  visit(tree, (node: Node) => {
    if (node.type === 'strong') {
      transformStepSyntax(node as Strong)
    }

    if (node.type === 'emphasis') {
      transformStepSyntax(node as Emphasis)
    }

    if (node.type === 'inlineCode') {
      transformStepSyntax(node as InlineCode)
    }
  })
}

function transformStepSyntax(node: Strong | Emphasis | InlineCode) {
  let text: string
  let updateText: (content: string) => void

  // Handle different node structures
  if (node.type === 'inlineCode') {
    // InlineCode has value directly on the node
    text = (node as InlineCode).value || ''
    updateText = (content: string) => {
      ;(node as InlineCode).value = content
    }
  } else {
    // Strong and Emphasis have children with text nodes
    const strongOrEmphasis = node as Strong | Emphasis
    if (!strongOrEmphasis.children || strongOrEmphasis.children.length === 0) return

    const firstChild = strongOrEmphasis.children[0]
    if (firstChild.type !== 'text') return

    text = firstChild.value as string
    updateText = (content: string) => {
      firstChild.value = content
    }
  }

  // Check for step syntax at the beginning: [1!]hi or [red!]hi
  const stepMatch = text.match(/^\[([^!]+)!\](.*)$/)
  if (!stepMatch) return

  const [, stepOrColor, content] = stepMatch

  // Determine step value
  let stepValue: string | null = null

  if (/^\d+$/.test(stepOrColor)) {
    // Numeric step - convert to color
    const stepNumber = parseInt(stepOrColor, 10)
    stepValue = getStepColor(stepNumber)
  } else if (isValidColorName(stepOrColor)) {
    // Color name
    stepValue = stepOrColor
  }

  if (!stepValue) return

  // Update the text content (remove step marker)
  updateText(content)

  // Add step data attribute
  if (!node.data) node.data = {}
  if (!node.data.hProperties) node.data.hProperties = {}
  node.data.hProperties['data-step'] = stepValue
}