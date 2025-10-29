/**
 * Shared types for the tooltip transformer system.
 * Consolidates interfaces used across multiple transformer files.
 */

/**
 * Structure representing a symbol definition from LSP (Language Server Protocol) index.
 * Used for function scope detection and filtering tooltip symbols by context.
 */
export interface LspSymbol {
  /** Symbol name (function name, class name, etc.) */
  name: string;
  /** Detailed symbol information from LSP */
  detail: string;
  /** LSP symbol kind number (function=12, class=5, variable=13, etc.) */
  kind: number;
  /** Full range of the symbol definition in source code */
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  /** Range of just the symbol name */
  nameRange: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  /** Nested symbols (parameters, local variables, etc.) */
  children: LspSymbol[];
}

/**
 * Structure representing a document in the LSP index.
 */
export interface LspDocument {
  /** File path/URI (e.g., "algorithm.py") */
  uri: string;
  /** All symbols defined in this document */
  symbols: LspSymbol[];
}

/**
 * Root structure of the LSP index containing all analyzed documents.
 */
export interface LspIndex {
  documents: LspDocument[];
}

/**
 * Structure representing a symbol usage from uses.json metadata files.
 * Each entry represents where a symbol (function, variable, parameter) is used in source code.
 */
export interface SymbolUse {
  /** Full range of the symbol including any surrounding context */
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  /** Precise range of just the symbol name for tooltip targeting */
  nameRange: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  /** Qualified name used for metadata lookup (e.g., "function_name:function_name.parameter") */
  qname: string;
  /** Symbol type classification ("function", "variable", "parameter", etc.) */
  kind: string | null;
}

/**
 * Structure for expression entries from expressions.json metadata files.
 * Represents complex expressions that deserve tooltips (e.g., "arr[mid]", "left <= right").
 */
export interface ExpressionUse {
  /** Full range of the expression including context */
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  /** Precise range of the expression for tooltip targeting */
  nameRange: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  /** Qualified name used for metadata lookup (e.g., "binary_search:arr[mid]") */
  qname: string;
  /** Expression type classification (usually null for expressions) */
  kind: string | null;
}

/**
 * Structure for symbol metadata from symbol_tags.json files.
 * Contains tooltip content and metadata for each symbol.
 */
export interface SymbolMetadata {
  kind: 'function' | 'method' | 'class' | 'parameter' | 'variable' | 'expression';
  name: string;
  args?: string[];
  definition?: string;
  difficulty?: string;
  intuition?: string;
  leetcode?: string;
  returns?: { label: string; summary?: string };
  time_complexity?: string;
  title?: string;
  topics?: string[];
  variables?: string[];
  label?: string;
  summary?: string;
}

/** Symbol usage data indexed by filename */
export type UsesData = Record<string, SymbolUse[]>;
/** Expression usage data indexed by filename */
export type ExpressionsData = Record<string, ExpressionUse[]>;
/** Inline comments data indexed by filename - array of line numbers (in cleaned code coordinates) */
export type CommentsInlineData = Record<string, number[]>;
/** LSP symbol definition data */
export type LspData = LspIndex;
/** Symbol metadata indexed by qualified name */
export type SymbolTagsData = Record<string, SymbolMetadata>;