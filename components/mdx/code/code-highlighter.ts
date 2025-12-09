'use server'
import { cache } from 'react'
import { codeToHast } from 'shiki'
import { transformerCodeTooltipSource } from './transformers/meta-tooltip';
import { transformerExpressionTooltips } from './transformers/meta-tooltip-expressions';
import { transformerInlineCommentTooltips } from './transformers/meta-tooltip-comments-inline';
// import { transformerAddIds } from './transformers/meta-add-ids';
import { hastToJSX } from './hast-to-tsx';
// import { getTooltipContent } from './tooltip-content';
import { transformerMetaHighlight } from './transformers/meta-highlight';
import { transformerMetaWordHighlight } from './transformers/meta-highlight-word';
// import { transformerMetaAddIds } from './transformers/meta-auto-link';
import usesData from '@/lib/extracted-metadata/uses.json';
import expressionsData from '@/lib/extracted-metadata/expressions.json';
import commentsInlineData from '@/lib/extracted-metadata/comments-inline.json';
import lspData from '@/lib/extracted-metadata/lsp_index.json';
import symbolTags from '@/lib/extracted-metadata/symbol_tags.json';
import type { UsesData, LspData, ExpressionsData, CommentsInlineData, SymbolTagsData } from './transformers/types';


/**
 * Applies syntax highlighting and tooltip data attributes to code using Shiki and custom transformers.
 *
 * This function is the core of the tooltip system's highlighting pipeline:
 * 1. **Shiki Processing**: Converts code to HAST (Hyperscript Abstract Syntax Tree) with syntax highlighting
 * 2. **Transformer Chain**: Applies custom transformers that add tooltip data attributes to matching symbols
 * 3. **JSX Conversion**: Converts HAST to JSX elements for React rendering
 *
 * The transformer chain runs in priority order:
 * - Line/word highlighting (visual effects)
 * - Expression tooltips (lower priority - complex expressions)
 * - Symbol tooltips (higher priority - functions, variables, parameters)
 *
 * @param code - Raw source code to highlight
 * @param lang - Programming language for syntax highlighting
 * @param meta - Optional meta attributes (e.g., "source=file.py:function highlight=3-5")
 * @param transformers - Whether to apply tooltip transformers (default: true)
 * @param isInline - Whether this is inline code (affects JSX conversion)
 * @returns JSX elements with syntax highlighting and tooltip data attributes
 *
 * @example
 * ```typescript
 * const highlighted = await highlightCode(
 *   'def binary_search(arr, target): pass',
 *   'python',
 *   'source=algorithm.py:binary_search'
 * );
 * ```
 */
const highlightCode = cache(async(code: string, lang: string, meta?: string, transformers: boolean = true, isInline: boolean = false) => {
  // const tooltipContent = await getTooltipContent()

  const hast = await codeToHast(code, {
    lang: lang,
    meta: { __raw: meta },
    themes: {
      light: 'light-plus',
      dark: 'dark-plus',
    },
    colorReplacements: {
      'light-plus': {
        '#ffffff': 'var(--bg-background)'
      },
      'dark-plus': {
      }
    },
    defaultColor: 'light-dark()',
    transformers: transformers ? [

      transformerExpressionTooltips(expressionsData as ExpressionsData, lspData as LspData),
      transformerCodeTooltipSource(usesData as UsesData, lspData as LspData, symbolTags as SymbolTagsData),
      transformerInlineCommentTooltips(commentsInlineData as CommentsInlineData, lspData as LspData),
      transformerMetaHighlight({className: 'line-highlight'}),
      transformerMetaWordHighlight({className: 'word-highlight'}),
    ] : [],

  })

  return hastToJSX(hast, isInline)

})

export default highlightCode
