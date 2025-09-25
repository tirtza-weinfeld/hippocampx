import type { ShikiTransformer } from 'shiki';
import type { 
  UsesData, 
  LspData,
  SymbolTagsData 
} from './types';
import { getFunctionRange, isWithinRange, getCharacterOffset } from './utils';

/**
 * Shiki transformer that adds tooltip data attributes to symbol usages in code blocks.
 * 
 * This transformer processes code blocks with `source=` meta attributes to add interactive
 * tooltips to functions, variables, parameters, and other symbols. It works by:
 * 
 * 1. **Meta Parsing**: Extracts source file and optional function name from meta attributes
 * 2. **Symbol Lookup**: Finds symbol usages from pre-extracted metadata (uses.json)
 * 3. **Scope Filtering**: When function is specified, filters symbols to only that function's scope
 * 4. **Position Adjustment**: Adjusts line numbers relative to the displayed code snippet
 * 5. **Decoration Addition**: Adds `data-tooltip-symbol` attributes for tooltipifyJSX processing
 * 
 * Priority: Higher priority than expression tooltips (runs after, overrides overlapping ranges)
 * 
 * @param usesData - Symbol usage data indexed by filename from uses.json
 * @param lspData - Optional LSP symbol definitions for scope filtering from lsp_index.json
 * @param symbolTags - Symbol metadata for filtering which symbols get tooltips from symbol_tags.json
 * @returns Shiki transformer that processes code blocks with tooltip attributes
 * 
 * @example
 * ```mdx
 * ```python source=algorithm.py:binary_search
 * def binary_search(arr, target):  # arr and target get tooltip attributes
 *     return binary_search_impl()  # binary_search_impl gets tooltip attribute
 * ```
 * ```
 */
export function transformerCodeTooltipSource(usesData: UsesData, lspData: LspData | undefined, symbolTags: SymbolTagsData): ShikiTransformer {
  return {
    name: 'meta-tooltip-source',
    
    preprocess(code, options) {
      // Only process if this code block has a source= meta attribute
      const rawMeta = options.meta?.__raw;
      if (!rawMeta) return;
      
      // Parse source= from raw meta string
      const sourceMatch = rawMeta.match(/source=([^\s]+)/);
      if (!sourceMatch) return;
      
      const sourceSpec = sourceMatch[1];
      
      // Parse file and optional function: "file.py" or "file.py:function_name"
      const [sourceFile, functionName] = sourceSpec.includes(':') 
        ? sourceSpec.split(':')
        : [sourceSpec, undefined];
      
      // Get symbol uses for this source file  
      let symbolUses = usesData[sourceFile];
      if (!symbolUses) return;

      // If function name is specified and LSP data is available, filter to function scope
      if (functionName && lspData) {
        const functionRange = getFunctionRange(lspData, sourceFile, functionName);
        if (functionRange) {
          const functionStartLine = functionRange.start.line;
          symbolUses = symbolUses
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
      
      // Convert line-based positions to character offsets
      const lines = code.split('\n');
      
      for (const symbolUse of symbolUses) {
        // Skip builtin functions - they don't need tooltips
        // if (symbolUse.kind === 'builtin' || !symbolUse.kind ) {
        //   continue;
        // }
        
        const startOffset = getCharacterOffset(lines, symbolUse.nameRange.start.line, symbolUse.nameRange.start.character);
        const endOffset = getCharacterOffset(lines, symbolUse.nameRange.end.line, symbolUse.nameRange.end.character);
        
        if (startOffset !== -1 && endOffset !== -1 && startOffset < endOffset) {
          // Only add tooltip data attributes if symbol exists in symbol_tags.json
          if (symbolUse.qname in symbolTags) {
            const properties: Record<string, string> = {
              'data-tooltip-symbol': symbolUse.qname,
              'class': `tooltip-symbol ${symbolUse.kind}-symbol`,
            };
            
            options.decorations.push({
              start: startOffset,
              end: endOffset,
              properties,
            });
          }
        }
      }
    },
  };
}


