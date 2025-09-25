import type { ShikiTransformer } from '@shikijs/types'
import { getStepColor, isValidColorName, type ColorName } from '@/lib/step-colors'

interface HighlightedWord {
  word: string
  step?: number
  color?: ColorName
}

export function parseMetaHighlightWords(meta: string): HighlightedWord[] {
  if (!meta)
    return []

  // Match formats: /[step!]word/, /[color!]word/, and /word/
  // Updated regex to use ! instead of :
  const match = Array.from(meta.matchAll(/\/(?:\[([^!\]]+)!\])?((?:\\.|[^/])+)\//g))

  return match
    .map(v => {
      const stepOrColor = v[1]
      const word = v[2].replace(/\\(.)/g, '$1') // Escape backslashes
      
      let step: number | undefined
      let color: ColorName | undefined
      
      if (stepOrColor) {
        // Check if it's a number (step) or color name
        const stepNumber = parseInt(stepOrColor, 10)
        if (!isNaN(stepNumber)) {
          step = stepNumber
          color = getStepColor(stepNumber)
        } else if (isValidColorName(stepOrColor)) {
          color = stepOrColor
        }
      }
       else {
        // Default color for /word/ syntax
        color = 'blue'
      }
      
      return { word, step, color }
    })
}

export interface TransformerMetaWordHighlightOptions {
  /**
   * Class for highlighted words
   *
   * @default 'highlighted-word'
   */
  className?: string
}

/**
 * Allow using `/word/`, `/[step!]word/`, or `/[color!]word/` in the code snippet meta to mark highlighted words.
 * Uses data-step attribute with color name for styling consistency with typography.
 */
export function transformerMetaWordHighlight(
  options: TransformerMetaWordHighlightOptions = {},
): ShikiTransformer {
  const {
    className = 'highlighted-word',
  } = options

  return {
    name: 'transformers:meta-word-highlight',
    preprocess(code, options) {
      if (!this.options.meta?.__raw)
        return

      const highlightedWords = parseMetaHighlightWords(this.options.meta.__raw)
      options.decorations ||= []
      for (const { word, color } of highlightedWords) {
        const indexes = findAllSubstringIndexes(code, word)
        for (const index of indexes) {
          options.decorations.push({
            start: index,
            end: index + word.length,
            properties: {
              class: ` ${className}`,
              'data-step': color,
              // ...(color !== undefined && { 'data-step': color }),

            },
          })
        }
      }
    },
  }
}

export function findAllSubstringIndexes(str: string, substr: string): number[] {
  const indexes: number[] = []
  
  // Create regex with word boundaries to match whole words only
  // Escape special regex characters in the substring
  const escapedSubstr = substr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\b${escapedSubstr}\\b`, 'g')
  
  let match: RegExpExecArray | null
  while ((match = regex.exec(str)) !== null) {
    indexes.push(match.index)
    // Prevent infinite loop on zero-length matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++
    }
  }
  
  return indexes
}