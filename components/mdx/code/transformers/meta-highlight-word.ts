import type { ShikiTransformer } from 'shiki'

interface HighlightWord {
  word: string;
  step?: number;
}

export function parseMetaHighlightWords(meta: string): HighlightWord[] {
  if (!meta)
    return []

  // https://regex101.com/r/BHS5fd/1
  const match = Array.from(meta.matchAll(/\/((?:\\.|[^/])+)\//g))

  return match
    // Escape backslashes and parse step numbers
    .map(v => {
      const content = v[1].replace(/\\(.)/g, '$1')
      const [word, step] = content.split(':')
      return {
        word,
        step: step ? parseInt(step, 10) : undefined
      }
    })
}

export interface TransformerMetaWordHighlightOptions {
  /**
   * Class for highlighted words
   *
   * @default 'highlighted-word'
   */
  className?: string
  /**
   * Tooltip content map for words that should have tooltips
   */
  tooltipMap?: Record<string, string>
}

/**
 * Allow using `/word/` or `/word:step/` in the code snippet meta to mark highlighted words.
 * If tooltipMap is provided, words that exist in both highlighting and tooltip map will get both features.
 */
export function transformerMetaWordHighlight(
  options: TransformerMetaWordHighlightOptions = {},
): ShikiTransformer {
  const {
    className = 'highlighted-word',
    tooltipMap = {},
  } = options

  return {
    name: 'transformers:meta-word-highlight',
    preprocess(code, options) {
      if (!this.options.meta?.__raw)
        return

      const words = parseMetaHighlightWords(this.options.meta.__raw)
      options.decorations ||= []
      for (const { word, step } of words) {
        const indexes = findAllSubstringIndexes(code, word)
        for (const index of indexes) {
          const classes = [className]
          const properties: Record<string, string> = {}
    
          if (step !== undefined) {
            classes.push(`step-${step} code-step`)
            properties['data-step'] = step.toString()
          }

          // Check if this word also has tooltip content
          const normalizedWord = word.toLowerCase()
          if (tooltipMap[normalizedWord]) {
            classes.push('hasToolTip')
            properties['data-tooltip'] = normalizedWord
            properties['data-has-highlight'] = 'true'
          }

          options.decorations.push({
            start: index,
            end: index + word.length,
            properties: {
              class: classes,
              ...properties,
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