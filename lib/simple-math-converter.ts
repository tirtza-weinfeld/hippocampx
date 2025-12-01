/**
 * Math Notation Converter
 *
 * Handles mathematical notation patterns:
 * - Big-O notation: O(N), O(m * n), O(n log m), O(M * N * 3^L)
 * - Simple fractions: p/k
 * - Exponentials: 3^L
 * - Mathematical expressions in bold: **k∈ℕ**
 * - Set notation symbols: ∈, ℕ, ℤ, ℚ, ℝ, etc.
 */

export interface MathOptions {
  /** Whether to preserve existing KaTeX syntax */
  preserveExisting?: boolean;
}

export class MathConverter {
  // Unicode mathematical symbols to LaTeX mapping
  private static readonly UNICODE_TO_LATEX = new Map([
    // Set symbols
    ['∈', '\\in'], ['∉', '\\notin'], ['⊆', '\\subseteq'], ['⊊', '\\subset'],
    ['⊇', '\\supseteq'], ['⊋', '\\supset'], ['∪', '\\cup'], ['∩', '\\cap'],
    ['∅', '\\emptyset'], ['∞', '\\infty'],

    // Number sets
    ['ℕ', '\\mathbb{N}'], ['ℤ', '\\mathbb{Z}'], ['ℚ', '\\mathbb{Q}'],
    ['ℝ', '\\mathbb{R}'], ['ℂ', '\\mathbb{C}'], ['ℙ', '\\mathbb{P}'],

    // Comparison operators
    ['≤', '\\leq'], ['≥', '\\geq'], ['≠', '\\neq'], ['≈', '\\approx'],
    ['≡', '\\equiv'],

    // Other symbols
    ['×', '\\times'], ['÷', '\\div'], ['±', '\\pm'], ['√', '\\sqrt'],
  ]);

  /**
   * Convert mathematical notation to KaTeX format
   */
  static convert(text: string, options: MathOptions = {}): string {
    const { preserveExisting = true } = options;

    // Skip if already has KaTeX syntax
    if (preserveExisting && (text.includes('\\') || text.includes('$'))) {
      return text;
    }

    let result = text;

    // Convert mathematical expressions in bold first: **k∈ℕ** → **$k \in \mathbb{N}$**
    result = this.convertBoldMathExpressions(result);

    // Convert Big-O notation patterns
    result = this.convertBigO(result);

    // Convert simple fractions
    result = this.convertSimpleFractions(result);

    // Convert standalone mathematical symbols
    result = this.convertMathSymbols(result);

    return result;
  }

  /**
   * Convert mathematical expressions within bold markers
   */
  private static convertBoldMathExpressions(text: string): string {
    return text.replace(/\*\*([^*]+)\*\*/g, (_, content) => {
      if (this.containsMathSymbols(content as string)) {
        const converted = this.convertMathSymbols(content as string);
        return `**$${converted}$**`;
      }
      return `**${content}**`;
    });
  }

  /**
   * Convert Big-O notation patterns
   */
  private static convertBigO(text: string): string {
    return text.replace(/\bO\(([^)]+)\)/g, (_, expression) => {
      let expr = (expression as string).trim();

      // Handle multiplication: * → \times
      expr = expr.replace(/\s*\*\s*/g, ' \\times ');

      // Handle log: log → \log
      expr = expr.replace(/\blog\b/g, '\\log');

      // Handle exponentiation: 3^L → 3^{L}
      expr = expr.replace(/(\w+)\^(\w+)/g, '$1^{$2}');

      // Clean up extra spaces
      expr = expr.replace(/\s+/g, ' ').trim();

      return `$O(${expr})$`;
    });
  }

  /**
   * Convert simple fractions like p/k
   */
  private static convertSimpleFractions(text: string): string {
    // Convert simple fractions: letter/letter (not already in math mode)
    return text.replace(/(?<!\$)\b([a-zA-Z])\s*\/\s*([a-zA-Z])\b(?!\$)/g, '$\\frac{$1}{$2}$');
  }

  /**
   * Convert mathematical Unicode symbols to LaTeX
   */
  private static convertMathSymbols(text: string): string {
    let result = text;

    for (const [unicode, latex] of this.UNICODE_TO_LATEX) {
      result = result.replace(new RegExp(unicode, 'g'), latex);
    }

    return result;
  }

  /**
   * Check if text contains mathematical symbols
   */
  private static containsMathSymbols(text: string): boolean {
    return Array.from(this.UNICODE_TO_LATEX.keys()).some(symbol => text.includes(symbol));
  }

  /**
   * Convert text with multiple lines, handling each line separately
   */
  static convertText(text: string, options: MathOptions = {}): string {
    return text.split('\n').map(line => this.convert(line, options)).join('\n');
  }

  /**
   * Check if text contains mathematical notation that we can handle
   */
  static containsMathNotation(text: string): boolean {
    const patterns = [
      /\bO\([^)]+\)/,                    // Big-O notation
      /\b[a-zA-Z]\s*\/\s*[a-zA-Z]\b/,   // Simple fractions
      /\*\*[^*]*[∈∉⊆⊊⊇⊋∪∩∅∞ℕℤℚℝℂℙ≤≥≠≈≡×÷±√][^*]*\*\*/, // Bold math expressions
    ];

    return patterns.some(pattern => pattern.test(text)) || this.containsMathSymbols(text);
  }
}

// Convenience function
export function convertMath(text: string, options?: MathOptions): string {
  return MathConverter.convert(text, options);
}