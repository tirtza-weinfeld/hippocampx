import type { ShikiTransformer, ShikiTransformerContext } from 'shiki';
import { Element } from 'hast';
import type { SymbolMetadata } from '@/lib/types';

interface SymbolHierarchy {
  symbol: string;
  parent?: string;
  parameters: string[];
  children: string[];
}

export function transformerCodeTooltipWords(tooltipMap: Record<string, SymbolMetadata>): ShikiTransformer {
  // Build complete hierarchical mapping
  const hierarchyMap = new Map<string, SymbolHierarchy>();
  for (const [symbol, meta] of Object.entries(tooltipMap)) {
    hierarchyMap.set(symbol, {
      symbol,
      parent: meta.parent,
      parameters: meta.parameters?.map(p => p.name) || [],
      children: []
    });
  }
  for (const [symbol, hierarchy] of hierarchyMap) {
    if (hierarchy.parent && hierarchyMap.has(hierarchy.parent)) {
      hierarchyMap.get(hierarchy.parent)!.children.push(symbol);
    }
  }

  // Build parameter-to-parent mapping scoped by parent symbol
  const parameterToParent: Record<string, Set<string>> = {};
  for (const [symbol, meta] of Object.entries(tooltipMap)) {
    if (meta.parameters) {
      for (const param of meta.parameters) {
        if (!parameterToParent[param.name]) parameterToParent[param.name] = new Set();
        parameterToParent[param.name].add(symbol);
      }
    }
  }

  // Build parameter resolution map: parameter -> full hierarchical path (scoped)
  const parameterToHierarchy: Record<string, { symbol: string; path: string[] }[]> = {};
  function buildParameterMap(symbol: string, path: string[] = []) {
    const hierarchy = hierarchyMap.get(symbol);
    if (!hierarchy) return;
    const currentPath = [...path, symbol];
    for (const param of hierarchy.parameters) {
      if (!parameterToHierarchy[param]) parameterToHierarchy[param] = [];
      parameterToHierarchy[param].push({ symbol, path: currentPath });
    }
    for (const child of hierarchy.children) {
      buildParameterMap(child, currentPath);
    }
  }
  for (const [symbol, hierarchy] of hierarchyMap) {
    if (!hierarchy.parent) {
      buildParameterMap(symbol);
    }
  }

  // Collect all function/method/class names for fast lookup
  const allSymbolNames = new Set(Object.keys(tooltipMap).map(k => k.toLowerCase()));

  return {
    name: 'data-tooltip-symbol',
    
    preprocess(code, options) {
      options.decorations ||= [];
      // --- NEW: Build function code regions ---
      const functionRegions: Record<string, { start: number; end: number }> = {};
      for (const [symbol, meta] of Object.entries(tooltipMap)) {
        if (meta.signature) {
          // Find the first occurrence of the function signature in the code
          const sig = meta.signature.replace(/\s+/g, ' ').trim();
          const regex = new RegExp(sig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
          const match = regex.exec(code);
          if (match) {
            const start = match.index;
            // Heuristic: function region ends at the start of the next function or end of file
            let end = code.length;
            for (const [otherSymbol, otherMeta] of Object.entries(tooltipMap)) {
              if (otherSymbol !== symbol && otherMeta.signature) {
                const otherSig = otherMeta.signature.replace(/\s+/g, ' ').trim();
                const otherRegex = new RegExp(otherSig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                const otherMatch = otherRegex.exec(code);
                if (otherMatch && otherMatch.index > start && otherMatch.index < end) {
                  end = otherMatch.index;
                }
              }
            }
            functionRegions[symbol] = { start, end };
          }
        }
      }
      // --- END NEW ---
      // Find all occurrences of function/method/class names (whole word only)
      for (const symbolName of Object.keys(tooltipMap)) {
        const indexes = findAllWordIndexes(code, symbolName);
        for (const index of indexes) {
          options.decorations.push({
            start: index,
            end: index + symbolName.length,
            properties: {
              'data-tooltip-symbol': symbolName,
              class: 'tooltip-symbol',
            },
          });
        }
      }
      // --- UPDATED: Parameter tooltips scoped to parent function region ---
      for (const [paramName, parentSymbols] of Object.entries(parameterToHierarchy)) {
        for (const { symbol, path } of parentSymbols) {
          const region = functionRegions[symbol];
          if (!region) continue;
          const indexes = findAllWordIndexes(code.slice(region.start, region.end), paramName);
          for (const relIndex of indexes) {
            const index = region.start + relIndex;
            options.decorations.push({
              start: index,
              end: index + paramName.length,
              properties: {
                'data-tooltip-symbol': paramName,
                'data-tooltip-parent': symbol,
                'data-tooltip-path': JSON.stringify(path),
                class: 'tooltip-symbol',
              },
            });
          }
        }
      }
    },
    
    span(this: ShikiTransformerContext, node: Element) {
      // This method is kept for backward compatibility but the main work is done in preprocess
      if (!Array.isArray(node.children) || node.children.length !== 1) return;
      const textNode = node.children[0];
      if (!textNode || textNode.type !== 'text') return;
      const value = textNode.value;
      const key = value.trim().toLowerCase();
      
      // Always add tooltip for function/method/class names
      if (allSymbolNames.has(key)) {
        node.properties = node.properties || {};
        node.properties['data-tooltip-symbol'] = value.trim();
        node.properties['class'] = [
          ...(Array.isArray(node.properties['class']) ? node.properties['class'] : []),
          'tooltip-symbol',
        ];
        return;
      }
      
      // Parameter (with full hierarchical path, scoped by parent symbol)
      if (parameterToHierarchy[value.trim()]) {
        // Try to find the correct parent symbol for this parameter in the current context
        // (In Shiki, we don't have AST context, so we fallback to the first match)
        const { symbol, path } = parameterToHierarchy[value.trim()][0];
        node.properties = node.properties || {};
        node.properties['data-tooltip-symbol'] = value.trim();
        node.properties['data-tooltip-parent'] = symbol;
        node.properties['data-tooltip-path'] = JSON.stringify(path);
        node.properties['class'] = [
          ...(Array.isArray(node.properties['class']) ? node.properties['class'] : []),
          'tooltip-symbol',
        ];
      }
    },
  };
}

// Use regex to match only whole words (word boundaries)
export function findAllWordIndexes(str: string, word: string): number[] {
  const indexes: number[] = [];
  if (!word) return indexes;
  // Escape regex special chars in word
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'g');
  let match;
  while ((match = regex.exec(str)) !== null) {
    indexes.push(match.index);
  }
  return indexes;
}