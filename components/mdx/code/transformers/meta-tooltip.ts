import type { ShikiTransformer } from 'shiki';
import type { SymbolMetadata } from '@/lib/types';

interface FunctionScope {
  name: string;
  start: number;
  end: number;
  parameters: Set<string>;
  variables: Set<string>;
  expressions: Map<string, string>; // expression -> full symbol name
}

export function transformerCodeTooltipWords(tooltipMap: Record<string, SymbolMetadata>): ShikiTransformer {
  return {
    name: 'meta-tooltip',
    
    preprocess(code, options) {
      options.decorations ||= [];
      
      // Build function scopes from the code
      const scopes = buildFunctionScopes(code, tooltipMap);
      
      // Process top-level symbols (functions, classes, methods)
      processTopLevelSymbols(code, tooltipMap, options.decorations);
      
      // Process function-scoped elements (parameters, variables, expressions)
      processScopedElements(code, scopes, tooltipMap, options.decorations);
    },
  };
}

function buildFunctionScopes(code: string, tooltipMap: Record<string, SymbolMetadata>): FunctionScope[] {
  const scopes: FunctionScope[] = [];
  
  for (const [symbolName, metadata] of Object.entries(tooltipMap)) {
    if (!metadata.signature || metadata.type === 'class') continue;
    
    const functionMatch = findFunctionInCode(code, metadata.signature);
    if (!functionMatch) continue;
    
    const scope: FunctionScope = {
      name: symbolName,
      start: functionMatch.start,
      end: functionMatch.end,
      parameters: new Set(),
      variables: new Set(),
      expressions: new Map(),
    };
    
    // Add parameters with descriptions
    if (metadata.parameters) {
      for (const param of metadata.parameters) {
        if (param.description?.trim()) {
          scope.parameters.add(param.name);
        }
      }
    }
    
    // Add variables
    if (metadata.variables) {
      for (const variable of metadata.variables) {
        scope.variables.add(variable.name);
      }
    }
    
    // Add expressions
    if (metadata.expressions) {
      for (const expr of metadata.expressions) {
        scope.expressions.set(expr.expression, symbolName);
      }
    }
    
    scopes.push(scope);
  }
  
  return scopes.sort((a, b) => a.start - b.start);
}

function findFunctionInCode(code: string, signature: string): { start: number; end: number } | null {
  // Clean and normalize the signature
  const cleanSig = signature.replace(/\s+/g, ' ').trim();
  const escapedSig = escapeRegExp(cleanSig);
  
  // Create flexible regex that allows for whitespace variations
  const regex = new RegExp(escapedSig.replace(/:\\s*$/, ':\\s*'));
  const match = regex.exec(code);
  
  if (!match) return null;
  
  const start = match.index;
  
  // Find the end of the function by looking for the next function or end of file
  let end = code.length;
  const nextFunctionRegex = /^(def|class)\s+/gm;
  nextFunctionRegex.lastIndex = start + match[0].length;
  
  const nextMatch = nextFunctionRegex.exec(code);
  if (nextMatch) {
    end = nextMatch.index;
  }
  
  return { start, end };
}

function processTopLevelSymbols(
  code: string,
  tooltipMap: Record<string, SymbolMetadata>,
  decorations: any[]
) {
  for (const [symbolName, metadata] of Object.entries(tooltipMap)) {
    if (metadata.parent) {
      // For nested functions, only add tooltips if their parent function is present in the code
      const parentMetadata = tooltipMap[metadata.parent];
      if (!parentMetadata?.signature || !code.includes(parentMetadata.signature.split(':')[0])) {
        continue; // Skip if parent function is not in this code block
      }
      
      // Use short name for nested functions (e.g., "dp" instead of "DP.minimumTotal.dp")
      const shortName = metadata.name;
      const indexes = findWholeWordOccurrences(code, shortName);
      
      for (const index of indexes) {
        decorations.push({
          start: index,
          end: index + shortName.length,
          properties: {
            'data-tooltip-symbol': symbolName,
            'data-tooltip-type': metadata.type,
            'class': 'tooltip-symbol',
          },
        });
      }
    } else {
      // Top-level symbols (no parent)
      const indexes = findWholeWordOccurrences(code, symbolName);
      
      for (const index of indexes) {
        decorations.push({
          start: index,
          end: index + symbolName.length,
          properties: {
            'data-tooltip-symbol': symbolName,
            'data-tooltip-type': metadata.type,
            'class': 'tooltip-symbol',
          },
        });
      }
    }
  }
}

function processScopedElements(
  code: string,
  scopes: FunctionScope[],
  tooltipMap: Record<string, SymbolMetadata>,
  decorations: any[]
) {
  // Only process scopes that were actually found in the current code
  // This prevents variables from unrelated functions being applied to standalone code blocks
  for (const scope of scopes) {
    const scopeCode = code.slice(scope.start, scope.end);
    
    // Process parameters (only those with descriptions)
    for (const paramName of scope.parameters) {
      const indexes = findWholeWordOccurrences(scopeCode, paramName);
      for (const relativeIndex of indexes) {
        decorations.push({
          start: scope.start + relativeIndex,
          end: scope.start + relativeIndex + paramName.length,
          properties: {
            'data-tooltip-symbol': paramName,
            'data-tooltip-type': 'parameter',
            'data-tooltip-parent': scope.name,
            'class': 'tooltip-symbol',
          },
        });
      }
    }
    
    // Process variables
    for (const varName of scope.variables) {
      const indexes = findWholeWordOccurrences(scopeCode, varName);
      for (const relativeIndex of indexes) {
        decorations.push({
          start: scope.start + relativeIndex,
          end: scope.start + relativeIndex + varName.length,
          properties: {
            'data-tooltip-symbol': varName,
            'data-tooltip-type': 'variable',
            'data-tooltip-parent': scope.name,
            'class': 'tooltip-symbol',
          },
        });
      }
    }
    
    // Process expressions
    for (const [expression, parentSymbol] of scope.expressions) {
      const indexes = findSubstringOccurrences(scopeCode, expression);
      for (const relativeIndex of indexes) {
        decorations.push({
          start: scope.start + relativeIndex,
          end: scope.start + relativeIndex + expression.length,
          properties: {
            'data-tooltip-symbol': expression,
            'data-tooltip-type': 'expression',
            'data-tooltip-parent': parentSymbol,
            'class': 'tooltip-symbol',
          },
        });
      }
    }
  }
}

function findWholeWordOccurrences(text: string, word: string): number[] {
  const indexes: number[] = [];
  if (!word) return indexes;
  
  const escapedWord = escapeRegExp(word);
  const regex = new RegExp(`\\b${escapedWord}\\b`, 'g');
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    indexes.push(match.index);
  }
  
  return indexes;
}

function findSubstringOccurrences(text: string, substring: string): number[] {
  const indexes: number[] = [];
  if (!substring) return indexes;
  
  const escapedSubstring = escapeRegExp(substring);
  const regex = new RegExp(escapedSubstring, 'g');
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    indexes.push(match.index);
  }
  
  return indexes;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}