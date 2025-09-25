import type { LspData, LspSymbol } from './types';

/**
 * Finds the source code range for a specific function using LSP symbol data.
 * 
 * @param lspData - LSP index containing symbol definitions
 * @param fileName - Source file name to search in
 * @param functionName - Name of the function to find
 * @returns Function's range or null if not found
 */
export function getFunctionRange(lspData: LspData, fileName: string, functionName: string): { start: { line: number; character: number }; end: { line: number; character: number } } | null {
  // Find the document for this file
  const document = lspData.documents.find(doc => doc.uri === fileName);
  if (!document) return null;

  // Find the function symbol (search both top-level and nested)
  function findSymbol(symbols: LspSymbol[]): LspSymbol | null {
    for (const symbol of symbols) {
      if (symbol.name === functionName) {
        return symbol;
      }
      // Search nested symbols recursively
      const nestedResult = findSymbol(symbol.children);
      if (nestedResult) return nestedResult;
    }
    return null;
  }

  const functionSymbol = findSymbol(document.symbols);
  return functionSymbol?.range || null;
}

/**
 * Checks if a symbol's range is within a function's range.
 * 
 * @param symbolRange - Range of the symbol to check
 * @param functionRange - Range of the containing function
 * @returns true if symbol is within function scope
 */
export function isWithinRange(
  symbolRange: { start: { line: number; character: number }; end: { line: number; character: number } },
  functionRange: { start: { line: number; character: number }; end: { line: number; character: number } }
): boolean {
  // Check if symbol start is after or at function start
  const afterStart = symbolRange.start.line > functionRange.start.line || 
    (symbolRange.start.line === functionRange.start.line && 
     symbolRange.start.character >= functionRange.start.character);

  // Check if symbol end is before or at function end
  const beforeEnd = symbolRange.end.line < functionRange.end.line ||
    (symbolRange.end.line === functionRange.end.line &&
     symbolRange.end.character <= functionRange.end.character);

  return afterStart && beforeEnd;
}

/**
 * Converts line/character position to absolute character offset in code string.
 * Used by Shiki decorations which expect character positions, not line/column positions.
 * 
 * @param lines - Array of code lines
 * @param line - Zero-based line number
 * @param character - Zero-based character position within line
 * @returns Absolute character offset or -1 if invalid position
 */
export function getCharacterOffset(lines: string[], line: number, character: number): number {
  if (line < 0 || line >= lines.length) return -1;
  
  let offset = 0;
  
  // Add lengths of all previous lines (including newline characters)
  for (let i = 0; i < line; i++) {
    offset += lines[i].length + 1; // +1 for newline character
  }
  
  // Add character position within the target line
  const targetLine = lines[line];
  if (character < 0 || character > targetLine.length) return -1;
  
  return offset + character;
}