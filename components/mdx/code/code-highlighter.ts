import { cacheLife } from 'next/cache'
import { codeToHast } from 'shiki'
import type { Element, Root } from 'hast'
import { transformerCodeTooltipSource } from './transformers/meta-tooltip';
import { transformerExpressionTooltips } from './transformers/meta-tooltip-expressions';
import { transformerInlineCommentTooltips } from './transformers/meta-tooltip-comments-inline';
import { hastToJSX } from './hast-to-tsx';
import { transformerMetaHighlight } from './transformers/meta-highlight';
import { transformerMetaWordHighlight } from './transformers/meta-highlight-word';
import usesData from '@/lib/extracted-metadata/uses.json';
import expressionsData from '@/lib/extracted-metadata/expressions.json';
import commentsInlineData from '@/lib/extracted-metadata/comments-inline.json';
import lspData from '@/lib/extracted-metadata/lsp_index.json';
import symbolTags from '@/lib/extracted-metadata/symbol_tags.json';
import type { UsesData, LspData, ExpressionsData, CommentsInlineData, SymbolTagsData } from './transformers/types';

/**
 * Cached function that generates HAST with syntax highlighting and tooltip decorations.
 * Returns serializable HAST (JSON), not JSX.
 */
async function getHighlightedHast(code: string, lang: string, meta: string | undefined, applyTransformers: boolean): Promise<Root | Element> {
  'use cache'
  cacheLife('max')

  return codeToHast(code, {
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
    transformers: applyTransformers ? [
      transformerExpressionTooltips(expressionsData as ExpressionsData, lspData as LspData),
      transformerCodeTooltipSource(usesData as UsesData, lspData as LspData, symbolTags as SymbolTagsData),
      transformerInlineCommentTooltips(commentsInlineData as CommentsInlineData, lspData as LspData),
      transformerMetaHighlight({className: 'line-highlight'}),
      transformerMetaWordHighlight({className: 'word-highlight'}),
    ] : [],
  })
}

/**
 * Applies syntax highlighting and tooltip data attributes to code using Shiki and custom transformers.
 *
 * This function is the core of the tooltip system's highlighting pipeline:
 * 1. **Shiki Processing**: Converts code to HAST (Hyperscript Abstract Syntax Tree) with syntax highlighting
 * 2. **Transformer Chain**: Applies custom transformers that add tooltip data attributes to matching symbols
 * 3. **JSX Conversion**: Converts HAST to JSX elements for React rendering
 *
 * @param code - Raw source code to highlight
 * @param lang - Programming language for syntax highlighting
 * @param meta - Optional meta attributes (e.g., "source=file.py:function highlight=3-5")
 * @param transformers - Whether to apply tooltip transformers (default: true)
 * @param isInline - Whether this is inline code (affects JSX conversion)
 * @returns JSX elements with syntax highlighting and tooltip data attributes
 */
export default async function highlightCode(code: string, lang: string, meta?: string, transformers: boolean = true, isInline: boolean = false) {
  // Get cached HAST (serializable JSON)
  const hast = await getHighlightedHast(code, lang, meta, transformers)
  // Convert to JSX outside cache boundary
  return hastToJSX(hast, isInline)
}
