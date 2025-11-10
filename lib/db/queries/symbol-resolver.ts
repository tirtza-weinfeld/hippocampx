/**
 * Smart Symbol Query Parser
 *
 * Resolves partial symbol queries with context-based disambiguation.
 *
 * Query formats supported:
 * - "dp" → find all dp symbols (with context)
 * - "1235:dp" → find dp in problem 1235
 * - "1235:top_down.py:dp" → find dp in specific file
 * - "maximum_profit_in_job_scheduling.dp" → find dp in specific function
 * - "1235:top_down.py:maximum_profit_in_job_scheduling.dp" → fully qualified
 */

export interface SymbolQueryContext {
  problemSlug?: string;      // e.g., "1235-maximum-profit-in-job-scheduling"
  problemNumber?: string;    // e.g., "1235"
  solutionFile?: string;     // e.g., "top_down.py"
  functionName?: string;     // e.g., "maximum_profit_in_job_scheduling"
}

export interface ParsedSymbolQuery {
  pattern: string;           // SQL LIKE pattern
  exactMatch: string | null; // Exact qname if fully qualified
  segments: string[];        // Query segments split by :
  needsContext: boolean;     // Whether context is required for disambiguation
}

/**
 * Parse a symbol query into a structured format for database querying
 */
export function parseSymbolQuery(
  query: string,
  context?: SymbolQueryContext
): ParsedSymbolQuery {
  // Handle empty query
  if (!query.trim()) {
    throw new Error('Symbol query cannot be empty');
  }

  const segments = query.split(':').map(s => s.trim());

  // Case 1: Fully qualified qname (4 segments: problem:file:function.symbol)
  // Example: "1235:top_down.py:maximum_profit_in_job_scheduling.dp"
  if (segments.length >= 3 && segments[segments.length - 1].includes('.')) {
    return {
      pattern: query,
      exactMatch: query,
      segments,
      needsContext: false,
    };
  }

  // Case 2: Function-qualified symbol (function.symbol)
  // Example: "maximum_profit_in_job_scheduling.dp"
  if (segments.length === 1 && query.includes('.')) {
    const pattern = context?.problemNumber && context?.solutionFile
      ? `${context.problemNumber}:${context.solutionFile}:${query}`
      : `%:${query}`;

    return {
      pattern,
      exactMatch: null,
      segments: [query],
      needsContext: !context?.problemNumber || !context?.solutionFile,
    };
  }

  // Case 3: Problem + symbol (1235:dp)
  if (segments.length === 2) {
    const [problemPart, symbolPart] = segments;
    const pattern = `${problemPart}:%:${symbolPart}`;

    return {
      pattern,
      exactMatch: null,
      segments,
      needsContext: false,
    };
  }

  // Case 4: Problem + file + symbol (1235:top_down.py:dp)
  if (segments.length === 3) {
    const pattern = `${segments[0]}:${segments[1]}:%${segments[2]}`;

    return {
      pattern,
      exactMatch: null,
      segments,
      needsContext: false,
    };
  }

  // Case 5: Just symbol name (dp) - needs context
  if (segments.length === 1) {
    const symbolName = segments[0];

    // Build pattern based on available context
    if (context?.problemNumber && context?.solutionFile && context?.functionName) {
      const pattern = `${context.problemNumber}:${context.solutionFile}:${context.functionName}.${symbolName}`;
      return {
        pattern,
        exactMatch: pattern,
        segments,
        needsContext: false,
      };
    }

    if (context?.problemNumber && context?.solutionFile) {
      const pattern = `${context.problemNumber}:${context.solutionFile}:%${symbolName}`;
      return {
        pattern,
        exactMatch: null,
        segments,
        needsContext: false,
      };
    }

    if (context?.problemNumber) {
      const pattern = `${context.problemNumber}:%${symbolName}`;
      return {
        pattern,
        exactMatch: null,
        segments,
        needsContext: false,
      };
    }

    // No context - will return multiple results
    return {
      pattern: `%.${symbolName}`,
      exactMatch: null,
      segments,
      needsContext: true,
    };
  }

  throw new Error(`Invalid symbol query format: ${query}`);
}

/**
 * Extract problem number from slug
 * Example: "1235-maximum-profit-in-job-scheduling" → "1235"
 */
export function extractProblemNumber(slug: string): string {
  const match = slug.match(/^(\d+)/);
  return match ? match[1] : slug;
}

/**
 * Build a fully qualified qname
 */
export function buildQname(
  problemNumber: string,
  fileName: string,
  symbolPath: string
): string {
  return `${problemNumber}:${fileName}:${symbolPath}`;
}
