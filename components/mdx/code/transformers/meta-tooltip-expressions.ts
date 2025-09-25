import type { ShikiTransformer } from 'shiki';
import type { 
  LspData, 
  ExpressionsData 
} from './types';
import { getFunctionRange, isWithinRange, getCharacterOffset } from './utils';

/**
 * Shiki transformer that adds tooltip data attributes to complex expressions in code blocks.
 * 
 * This transformer processes code blocks with `source=` meta attributes to add interactive
 * tooltips to complex expressions that deserve explanation (e.g., "arr[mid]", "left <= right").
 * 
 * **Priority**: Lower priority than symbol tooltips (runs first, can be overridden by symbols)
 * 
 * The transformer works by:
 * 1. **Meta Parsing**: Extracts source file and optional function name from meta attributes
 * 2. **Expression Lookup**: Finds expression usages from pre-extracted metadata (expressions.json)
 * 3. **Scope Filtering**: When function is specified, filters expressions to only that function's scope
 * 4. **Position Adjustment**: Adjusts line numbers relative to the displayed code snippet
 * 5. **Decoration Addition**: Adds `data-tooltip-symbol` attributes for tooltipifyJSX processing
 * 
 * @param expressionsData - Expression usage data indexed by filename from expressions.json
 * @param lspData - Optional LSP symbol definitions for scope filtering from lsp_index.json
 * @returns Shiki transformer that processes code blocks with expression tooltip attributes
 * 
 * @example
 * ```mdx
 * ```python source=algorithm.py:binary_search
 * def binary_search(arr, target):
 *     mid = (left + right) // 2  # "(left + right) // 2" gets expression tooltip
 *     if arr[mid] == target:     # "arr[mid]" gets expression tooltip
 *         return mid
 * ```
 * ```
 */
export function transformerExpressionTooltips(expressionsData: ExpressionsData, lspData?: LspData): ShikiTransformer {
  return {
    name: 'meta-tooltip-expressions',
    
    preprocess(code, options) {
      const rawMeta = options.meta?.__raw;
      if (!rawMeta) return;
      
      const sourceMatch = rawMeta.match(/source=([^\s]+)/);
      if (!sourceMatch) return;
      
      const sourceSpec = sourceMatch[1];
      const [sourceFile, functionName] = sourceSpec.includes(':') 
        ? sourceSpec.split(':')
        : [sourceSpec, undefined];
      
      let expressionUses = expressionsData[sourceFile];
      if (!expressionUses) return;
      
      if (functionName && lspData) {
        const functionRange = getFunctionRange(lspData, sourceFile, functionName);
        if (functionRange) {
          const functionStartLine = functionRange.start.line;
          expressionUses = expressionUses
            .filter(use => isWithinRange(use.range, functionRange))
            .map(use => ({
              ...use,
              nameRange: {
                start: {
                  line: use.nameRange.start.line - functionStartLine,
                  character: use.nameRange.start.character
                },
                end: {
                  line: use.nameRange.end.line - functionStartLine,
                  character: use.nameRange.end.character
                }
              }
            }));
        }
      }
      
      options.decorations ||= [];
      const lines = code.split('\n');
      
      for (const expressionUse of expressionUses) {
        const startOffset = getCharacterOffset(lines, expressionUse.nameRange.start.line, expressionUse.nameRange.start.character);
        const endOffset = getCharacterOffset(lines, expressionUse.nameRange.end.line, expressionUse.nameRange.end.character);
        
        if (startOffset !== -1 && endOffset !== -1 && startOffset < endOffset) {
          options.decorations.unshift({
            start: startOffset,
            end: endOffset,
            properties: {
              'data-tooltip-symbol': expressionUse.qname,
              'class': 'tooltip-symbol expression-symbol',
            },
          });
        }
      }
    },
  };
}

