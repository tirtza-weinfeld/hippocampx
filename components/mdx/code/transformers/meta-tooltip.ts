import type { ShikiTransformer, ShikiTransformerContext } from 'shiki';
import { Element } from 'hast';
import type { SymbolMetadata } from '@/lib/types';

interface SymbolHierarchy {
  symbol: string;
  parent?: string;
  parameters: string[];
  variables: string[];
  expressions: string[];
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
      variables: meta.variables?.map(v => v.name) || [],
      expressions: meta.expressions?.map(e => e.expression) || [],
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
    if (meta.variables) {
      for (const variable of meta.variables) {
        if (!parameterToParent[variable.name]) parameterToParent[variable.name] = new Set();
        parameterToParent[variable.name].add(symbol);
      }
    }
    if (meta.expressions && Array.isArray(meta.expressions)) {
      for (const expression of meta.expressions) {
        if (!parameterToParent[expression.expression]) parameterToParent[expression.expression] = new Set();
        parameterToParent[expression.expression].add(symbol);
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
    for (const variable of hierarchy.variables) {
      if (!parameterToHierarchy[variable]) parameterToHierarchy[variable] = [];
      parameterToHierarchy[variable].push({ symbol, path: currentPath });
    }
    for (const expression of hierarchy.expressions) {
      if (!parameterToHierarchy[expression]) parameterToHierarchy[expression] = [];
      parameterToHierarchy[expression].push({ symbol, path: currentPath });
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

  // Collect all function/method/class names for fast lookup (case-sensitive)
  const allSymbolNames = new Set(Object.keys(tooltipMap));

  return {
    name: 'data-tooltip-symbol',
    
    preprocess(code, options) {
      options.decorations ||= [];
      
      // Build class regions to determine which class each method belongs to
      const classRegions: Record<string, { start: number; end: number }> = {};
      for (const [symbol, meta] of Object.entries(tooltipMap)) {
        if (meta.type === 'class' && meta.signature) {
          const sig = meta.signature.replace(/\s+/g, ' ').trim();
          const regex = new RegExp(sig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
          const match = regex.exec(code);
          if (match) {
            const start = match.index;
            // Find the end of this class by looking for the next class or end of file
            let end = code.length;
            for (const [otherSymbol, otherMeta] of Object.entries(tooltipMap)) {
              if (otherSymbol !== symbol && otherMeta.type === 'class' && otherMeta.signature) {
                const otherSig = otherMeta.signature.replace(/\s+/g, ' ').trim();
                const otherRegex = new RegExp(otherSig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                const otherMatch = otherRegex.exec(code);
                if (otherMatch && otherMatch.index > start && otherMatch.index < end) {
                  end = otherMatch.index;
                }
              }
            }
            classRegions[symbol] = { start, end };
          }
        }
      }
      
      // Build function code regions for function-scoped parameter tooltips
      const functionRegions: Record<string, { start: number; end: number }> = {};
      for (const [symbol, meta] of Object.entries(tooltipMap)) {
        if (meta.signature) {
          // Extract just the function definition line (without docstring)
          const sig = meta.signature.replace(/\s+/g, ' ').trim();
          
          // Create a more flexible regex that matches the function signature
          // but allows for whitespace variations and doesn't require exact match after the colon
          const escapedSig = sig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const flexibleRegex = new RegExp(escapedSig.replace(/:\\s*$/, ':\\s*'), 'g');
          
          const match = flexibleRegex.exec(code);
          if (match) {
            const start = match.index;
            // Heuristic: function region ends at the start of the next function or end of file
            let end = code.length;
            for (const [otherSymbol, otherMeta] of Object.entries(tooltipMap)) {
              if (otherSymbol !== symbol && otherMeta.signature) {
                const otherSig = otherMeta.signature.replace(/\s+/g, ' ').trim();
                const otherEscapedSig = otherSig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const otherFlexibleRegex = new RegExp(otherEscapedSig.replace(/:\\s*$/, ':\\s*'), 'g');
                const otherMatch = otherFlexibleRegex.exec(code);
                if (otherMatch && otherMatch.index > start && otherMatch.index < end) {
                  end = otherMatch.index;
                }
              }
            }
            functionRegions[symbol] = { start, end };
          } else {
            // Function signature not found - this is normal for functions not in current code block
          }
        }
      }
      
      // Find all occurrences of function/method/class names (whole word only)
      for (const symbolName of Object.keys(tooltipMap)) {
        const indexes = findAllWordIndexes(code, symbolName);
        for (const index of indexes) {
          options.decorations.push({
            start: index,
            end: index + symbolName.length,
            properties: {
              'data-tooltip-symbol': symbolName,
              'data-tooltip-type': tooltipMap[symbolName].type,
              class: 'tooltip-symbol',
            },
          });
        }
      }
      
      // FIXED: Context-aware method name tooltips - only within the correct class
      for (const [fullSymbolName, meta] of Object.entries(tooltipMap)) {
        if (meta.parent && meta.type === 'method' && classRegions[meta.parent]) {
          const shortName = meta.name;
          const classRegion = classRegions[meta.parent];
          
          // Only look for method names within this class's region
          const classCode = code.slice(classRegion.start, classRegion.end);
          const indexes = findAllWordIndexes(classCode, shortName);
          
          for (const relativeIndex of indexes) {
            const absoluteIndex = classRegion.start + relativeIndex;
            
            options.decorations.push({
              start: absoluteIndex,
              end: absoluteIndex + shortName.length,
              properties: {
                'data-tooltip-symbol': fullSymbolName,
                'data-tooltip-type': meta.type,
                class: 'tooltip-symbol',
              },
            });
          }
        }
      }
      
      // Parameter, variable, and expression tooltips scoped to parent function region
      for (const [symbolName, parentSymbols] of Object.entries(parameterToHierarchy)) {
        for (const { symbol, path } of parentSymbols) {
          const region = functionRegions[symbol];
          // FIXED: Only apply tooltips if the parent function is actually in this code block
          if (!region) {
            continue;
          }
          
          // Check if this is an expression by looking up the parent's expressions
          const parentMeta = tooltipMap[symbol];
          const isExpression = parentMeta?.expressions?.some(e => e.expression === symbolName);
          const isParameter = parentMeta?.parameters?.some(p => p.name === symbolName);
          const isVariable = parentMeta?.variables?.some(v => v.name === symbolName);
          
          // Determine the type
          let tooltipType: string;
          if (isExpression) {
            tooltipType = 'expression';
          } else if (isParameter) {
            tooltipType = 'parameter';
          } else if (isVariable) {
            tooltipType = 'variable';
          } else {
            tooltipType = 'unknown';
          }
          
          let indexes: number[];
          if (isExpression) {
            // For expressions, use substring search (not word boundaries)
            indexes = findAllSubstringIndexes(code.slice(region.start, region.end), symbolName);
          } else {
            // For parameters and variables, use word boundary search
            indexes = findAllWordIndexes(code.slice(region.start, region.end), symbolName);
          }
          
          for (const relIndex of indexes) {
            const index = region.start + relIndex;
            options.decorations.push({
              start: index,
              end: index + symbolName.length,
              properties: {
                'data-tooltip-symbol': symbolName,
                'data-tooltip-type': tooltipType,
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
      const value = textNode.value.trim();
      
      // Always add tooltip for function/method/class names (case-sensitive)
      if (allSymbolNames.has(value)) {
        node.properties = node.properties || {};
        node.properties['data-tooltip-symbol'] = value;
        node.properties['data-tooltip-type'] = tooltipMap[value]?.type || 'unknown';
        node.properties['class'] = [
          ...(Array.isArray(node.properties['class']) ? node.properties['class'] : []),
          'tooltip-symbol',
        ];
        return;
      }
      
      // DISABLED: Parameter fallback - now handled properly in preprocess with function scoping
      // The old fallback logic was applying parameter tooltips to all occurrences of parameter names
      // regardless of function context, which caused incorrect tooltips to appear
      // if (parameterToHierarchy[value.trim()]) {
      //   const { symbol, path } = parameterToHierarchy[value.trim()][0];
      //   node.properties = node.properties || {};
      //   node.properties['data-tooltip-symbol'] = value.trim();
      //   node.properties['data-tooltip-parent'] = symbol;
      //   node.properties['data-tooltip-path'] = JSON.stringify(path);
      //   node.properties['class'] = [
      //     ...(Array.isArray(node.properties['class']) ? node.properties['class'] : []),
      //     'tooltip-symbol',
      //   ];
      // }
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

// Use regex to match substrings (no word boundaries)
export function findAllSubstringIndexes(str: string, substring: string): number[] {
  const indexes: number[] = [];
  if (!substring) return indexes;
  // Escape regex special chars in substring
  const escaped = substring.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'g');
  let match;
  while ((match = regex.exec(str)) !== null) {
    indexes.push(match.index);
  }
  return indexes;
}