import type { ShikiTransformer } from 'shiki'
import type { ColorName } from '@/lib/step-colors'
import { isValidColorName, getStepColor, isValidStepNumber } from '@/lib/step-colors'

export interface LineHighlight {
  line: number
  stepColor?: ColorName
}

export function parseMetaHighlightString(meta: string): LineHighlight[] | null {
  if (!meta)
    return null
  
  const match = meta.match(/\{([^}]+)\}/)
  if (!match)
    return null

  const parts = match[1].split(',')
  const results: LineHighlight[] = []

  for (const part of parts) {
    const trimmed = part.trim()
    
    // Check if this part has a step specification like [red!]1-3, [1!]5, etc.
    // Only allow step colors before line numbers/ranges, not arbitrary text
    const stepMatch = trimmed.match(/^\[([a-zA-Z0-9]+)!\](\d+(?:-\d+)?)$/)
    // console.log(stepMatch)
    
    if (stepMatch) {
      const stepSpec = stepMatch[1]
      const lineSpec = stepMatch[2]
      // console.log(stepSpec, lineSpec)
      let stepColor: ColorName | undefined
      
      // Check if stepSpec is a number (step number) or color name
      const stepNumber = Number.parseInt(stepSpec, 10)
      if (!Number.isNaN(stepNumber) && isValidStepNumber(stepNumber)) {
        stepColor = getStepColor(stepNumber)
        // console.log(stepColor)
      } else if (isValidColorName(stepSpec)) {
        stepColor = stepSpec
      } else {
        continue // Skip invalid step specifications
      }
      
      // Parse line specification
      const lines = parseLineSpec(lineSpec)
      for (const line of lines) {
        results.push({ line, stepColor })
        // console.log(line, stepColor)
      }
    } else {
      // Regular line specification without step color
      const lines = parseLineSpec(trimmed)
      for (const line of lines) {
        results.push({ line })
      }
    }
  }

  return results.length > 0 ? results : null
}

function parseLineSpec(spec: string): number[] {
  const num = spec.split('-').map(v => Number.parseInt(v.trim(), 10))
  if (num.length === 1) {
    return [num[0]]
  }
  return Array.from({ length: num[1] - num[0] + 1 }, (_, i) => i + num[0])
}

export interface TransformerMetaHighlightOptions {
  /**
   * Class for highlighted lines
   *
   * @default 'highlighted'
   */
  className?: string
}

const symbol = Symbol('highlighted-lines')

/**
 * Allow using `{1,3-5,[red!]6-8}` in the code snippet meta to mark highlighted lines with optional step colors.
 */
export function transformerMetaHighlight(
  options: TransformerMetaHighlightOptions = {},
): ShikiTransformer {
  const {
    className = 'highlighted',
  } = options

  return {
    name: 'transformers:meta-highlight',
    line(node, line) {
      if (!this.options.meta?.__raw) {
        return
      }
      const meta = this.meta as {
        [symbol]: LineHighlight[] | null
      }

      meta[symbol] ??= parseMetaHighlightString(this.options.meta.__raw)
      const highlights: LineHighlight[] = meta[symbol] ?? []

      const highlight = highlights.find(h => h.line === line)
      if (highlight) {
        this.addClassToHast(node, className)
        
        // Add step color data attribute if specified
        if (highlight.stepColor) {
          node.properties = node.properties || {}
          node.properties['data-step'] = highlight.stepColor
        }
      }
      return node
    },
  }
}