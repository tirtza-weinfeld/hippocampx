import type { ShikiTransformer } from '@shikijs/types'

interface HighlightedWord {
  word: string
  step?: number
}

export function parseMetaHighlightWords(meta: string): HighlightedWord[] {
  if (!meta)
    return []

  // Match both formats: /[step:]word/ and /word/
  // https://regex101.com/r/BHS5fd/1 (updated for new format)
  const match = Array.from(meta.matchAll(/\/(?:\[(\d+):\])?((?:\\.|[^/])+)\//g))

  return match
    .map(v => ({
      step: v[1] ? parseInt(v[1], 10) : undefined,
      word: v[2].replace(/\\(.)/g, '$1'), // Escape backslashes
    }))
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
 * Allow using `/word/` or `/[step:]word/` in the code snippet meta to mark highlighted words.
 * When step is provided, the class will be `{className}-{step}`.
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
      for (const { word, step } of highlightedWords) {
        const indexes = findAllSubstringIndexes(code, word)
        for (const index of indexes) {
          const classWithStep = step !== undefined ? `${className} step-${step}` : className
          options.decorations.push({
            start: index,
            end: index + word.length,
            properties: {
              class: ` ${classWithStep}`,
            },
          })
        }
      }
    },
  }
}

export function findAllSubstringIndexes(str: string, substr: string): number[] {
  const indexes: number[] = []
  let cursor = 0
  while (true) {
    const index = str.indexOf(substr, cursor)
    if (index === -1 || index >= str.length)
      break
    if (index < cursor)
      break
    indexes.push(index)
    cursor = index + substr.length
  }
  return indexes
}