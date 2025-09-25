// Types for the tooltip system using extracted metadata

// Matches the structure of tooltip_symbol_tags.json
export interface TooltipSymbolMetadata {
  args?: Record<string, {
    label: string
    documentation?: string
  }>
  returns?: {
    label: string
    documentation?: string
  }
  summary?: string // Formatted tooltip content with title, definition, etc.
}

// For the transformer's internal use
export interface SymbolMatch {
  key: string // The key from tooltip_symbol_tags.json
  symbol: string // The symbol name that was matched
  metadata: TooltipSymbolMetadata
  matchType: 'exact' | 'suffix' | 'fuzzy'
  confidence: number // 0-1 score for fuzzy matches
}

// Data structure for client-side tooltip rendering
export interface TooltipData {
  symbol: string
  key: string
  content: {
    summary?: string
    args?: Record<string, { label: string; documentation?: string }>
    returns?: { label: string; documentation?: string }
  }
  // Server-computed, client-consumed
  position?: {
    type: 'function' | 'parameter' | 'return' | 'variable'
    context?: string // Parent function/class name
  }
}