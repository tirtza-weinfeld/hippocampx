/**
 * Math Notation Converter
 *
 * Converts Unicode mathematical notation to KaTeX syntax for consistent rendering.
 * Handles summations, products, big-O notation, fractions, and various mathematical symbols.
 */

export interface MathConversionOptions {
  /** Whether to wrap output in $ delimiters */
  wrapInDelimiters?: boolean;
  /** Whether to preserve existing KaTeX syntax */
  preserveExisting?: boolean;
}

export class MathNotationConverter {
  private static readonly UNICODE_TO_LATEX_MAP = new Map([
    // Greek letters
    ['α', '\\alpha'], ['β', '\\beta'], ['γ', '\\gamma'], ['δ', '\\delta'],
    ['ε', '\\epsilon'], ['ζ', '\\zeta'], ['η', '\\eta'], ['θ', '\\theta'],
    ['ι', '\\iota'], ['κ', '\\kappa'], ['λ', '\\lambda'], ['μ', '\\mu'],
    ['ν', '\\nu'], ['ξ', '\\xi'], ['π', '\\pi'], ['ρ', '\\rho'],
    ['σ', '\\sigma'], ['τ', '\\tau'], ['υ', '\\upsilon'], ['φ', '\\phi'],
    ['χ', '\\chi'], ['ψ', '\\psi'], ['ω', '\\omega'],
    ['Α', '\\Alpha'], ['Β', '\\Beta'], ['Γ', '\\Gamma'], ['Δ', '\\Delta'],
    ['Ε', '\\Epsilon'], ['Ζ', '\\Zeta'], ['Η', '\\Eta'], ['Θ', '\\Theta'],
    ['Ι', '\\Iota'], ['Κ', '\\Kappa'], ['Λ', '\\Lambda'], ['Μ', '\\Mu'],
    ['Ν', '\\Nu'], ['Ξ', '\\Xi'], ['Π', '\\Pi'], ['Ρ', '\\Rho'],
    ['Σ', '\\Sigma'], ['Τ', '\\Tau'], ['Υ', '\\Upsilon'], ['Φ', '\\Phi'],
    ['Χ', '\\Chi'], ['Ψ', '\\Psi'], ['Ω', '\\Omega'],

    // Mathematical operators
    ['≤', '\\leq'], ['≥', '\\geq'], ['≠', '\\neq'], ['≈', '\\approx'],
    ['≡', '\\equiv'], ['∈', '\\in'], ['∉', '\\notin'], ['⊆', '\\subseteq'],
    ['⊊', '\\subset'], ['⊇', '\\supseteq'], ['⊋', '\\supset'], ['∪', '\\cup'],
    ['∩', '\\cap'], ['∅', '\\emptyset'], ['∞', '\\infty'], ['∂', '\\partial'],
    ['∇', '\\nabla'], ['∆', '\\Delta'], ['∫', '\\int'], ['∮', '\\oint'],
    ['∑', '\\sum'], ['∏', '\\prod'], ['∐', '\\coprod'], ['⋃', '\\bigcup'], ['⋂', '\\bigcap'],
    ['⋁', '\\bigvee'], ['⋀', '\\bigwedge'], ['⊕', '\\oplus'], ['⊗', '\\otimes'],
    ['⊙', '\\odot'], ['±', '\\pm'], ['∓', '\\mp'], ['×', '\\times'],
    ['÷', '\\div'], ['∗', '\\ast'], ['∘', '\\circ'], ['∙', '\\bullet'],
    ['√', '\\sqrt'], ['∝', '\\propto'], ['∴', '\\therefore'], ['∵', '\\because'],

    // Arrows
    ['→', '\\rightarrow'], ['←', '\\leftarrow'], ['↑', '\\uparrow'],
    ['↓', '\\downarrow'], ['↔', '\\leftrightarrow'], ['⇒', '\\Rightarrow'],
    ['⇐', '\\Leftarrow'], ['⇔', '\\Leftrightarrow'], ['↗', '\\nearrow'],
    ['↘', '\\searrow'], ['↙', '\\swarrow'], ['↖', '\\nwarrow'],

    // Floor/ceiling
    ['⌊', '\\lfloor'], ['⌋', '\\rfloor'], ['⌈', '\\lceil'], ['⌉', '\\rceil'],

    // Logic
    ['∧', '\\land'], ['∨', '\\lor'], ['¬', '\\neg'], ['∀', '\\forall'],
    ['∃', '\\exists'], ['∄', '\\nexists'], ['⊤', '\\top'], ['⊥', '\\bot'],

    // Sets
    ['ℕ', '\\mathbb{N}'], ['ℤ', '\\mathbb{Z}'], ['ℚ', '\\mathbb{Q}'],
    ['ℝ', '\\mathbb{R}'], ['ℂ', '\\mathbb{C}'], ['ℙ', '\\mathbb{P}'],

    // Misc
    ['°', '^\\circ'], ['′', '\\prime'], ['″', '\\prime\\prime'],
    ['‴', '\\prime\\prime\\prime'], ['ℓ', '\\ell'], ['℘', '\\wp'],
    ['ℜ', '\\Re'], ['ℑ', '\\Im'], ['⊥', '\\perp'], ['∥', '\\parallel'],
  ]);

  private static readonly SUBSCRIPT_MAP = new Map([
    ['₀', '0'], ['₁', '1'], ['₂', '2'], ['₃', '3'], ['₄', '4'],
    ['₅', '5'], ['₆', '6'], ['₇', '7'], ['₈', '8'], ['₉', '9'],
    ['ₐ', 'a'], ['ₑ', 'e'], ['ᵢ', 'i'], ['ⱼ', 'j'], ['ₖ', 'k'],
    ['ₗ', 'l'], ['ₘ', 'm'], ['ₙ', 'n'], ['ₒ', 'o'], ['ₚ', 'p'],
    ['ᵣ', 'r'], ['ₛ', 's'], ['ₜ', 't'], ['ᵤ', 'u'], ['ᵥ', 'v'],
    ['ₓ', 'x'], ['ᵧ', 'y'], ['ᵦ', 'β'], ['ᵨ', 'ρ'], ['ᵩ', 'φ'],
    ['ᵪ', 'χ'], ['₊', '+'], ['₋', '-'], ['₌', '='], ['₍', '('], ['₎', ')'],
  ]);

  private static readonly SUPERSCRIPT_MAP = new Map([
    ['⁰', '0'], ['¹', '1'], ['²', '2'], ['³', '3'], ['⁴', '4'],
    ['⁵', '5'], ['⁶', '6'], ['⁷', '7'], ['⁸', '8'], ['⁹', '9'],
    ['ᵃ', 'a'], ['ᵇ', 'b'], ['ᶜ', 'c'], ['ᵈ', 'd'], ['ᵉ', 'e'],
    ['ᶠ', 'f'], ['ᵍ', 'g'], ['ʰ', 'h'], ['ⁱ', 'i'], ['ʲ', 'j'],
    ['ᵏ', 'k'], ['ˡ', 'l'], ['ᵐ', 'm'], ['ⁿ', 'n'], ['ᵒ', 'o'],
    ['ᵖ', 'p'], ['ʳ', 'r'], ['ˢ', 's'], ['ᵗ', 't'], ['ᵘ', 'u'],
    ['ᵛ', 'v'], ['ʷ', 'w'], ['ˣ', 'x'], ['ʸ', 'y'], ['ᶻ', 'z'],
    ['ᴬ', 'A'], ['ᴮ', 'B'], ['ᴰ', 'D'], ['ᴱ', 'E'], ['ᴳ', 'G'],
    ['ᴴ', 'H'], ['ᴵ', 'I'], ['ᴶ', 'J'], ['ᴷ', 'K'], ['ᴸ', 'L'],
    ['ᴹ', 'M'], ['ᴺ', 'N'], ['ᴼ', 'O'], ['ᴾ', 'P'], ['ᴿ', 'R'],
    ['ᵀ', 'T'], ['ᵁ', 'U'], ['ⱽ', 'V'], ['ᵂ', 'W'], ['⁺', '+'],
    ['⁻', '-'], ['⁼', '='], ['⁽', '('], ['⁾', ')'], ['ᵅ', 'α'],
    ['ᵝ', 'β'], ['ᵞ', 'γ'], ['ᵟ', 'δ'], ['ᵋ', 'ε'], ['ᶿ', 'θ'],
    ['ᶥ', 'ι'], ['ᶲ', 'φ'], ['ᵡ', 'χ'],
  ]);

  /**
   * Convert Unicode mathematical notation to KaTeX syntax
   */
  static convert(input: string, options: MathConversionOptions = {}): string {
    const {
      wrapInDelimiters = true,
      preserveExisting = true
    } = options;

    let result = input;

    // Skip if already in KaTeX format and preserveExisting is true
    if (preserveExisting && (result.includes('\\') || result.match(/\$.*\$/))) {
      return result;
    }

    // Step 1: Convert floor and ceiling functions first (to avoid conflicts)
    result = result.replace(/⌊([^⌋]*)⌋/g, '\\lfloor $1 \\rfloor');
    result = result.replace(/⌈([^⌉]*)⌉/g, '\\lceil $1 \\rceil');

    // Step 2: Handle summation/product notation BEFORE converting Unicode symbols
    result = this.convertSummationNotation(result);

    // Step 3: Convert Unicode symbols to LaTeX
    for (const [unicode, latex] of this.UNICODE_TO_LATEX_MAP) {
      result = result.replace(new RegExp(unicode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), latex);
    }

    // Step 4: Convert subscripts and superscripts AFTER Unicode conversion
    result = this.convertSubscripts(result);
    result = this.convertSuperscripts(result);

    // Step 4: Convert fractions: a/b → \frac{a}{b} (but be careful with complex expressions)
    result = result.replace(
      /([a-zA-Z0-9_{}\\]+)\s*\/\s*([a-zA-Z0-9_{}\\]+)/g,
      '\\frac{$1}{$2}'
    );

    // Step 5: Convert Big-O notation with multiplication: O(m * n * k) or O(m × n × k)
    result = result.replace(
      /O\(([^)]*(?:\*|\\times)[^)]*)\)/g,
      (match, expression) => {
        const expr = expression
          .replace(/\s*(?:\*|\\times)\s*/g, ' \\times ')
          .replace(/\s+/g, ' ')
          .trim();
        return `O(${expr})`;
      }
    );

    // Step 6: Convert Big-O notation with log: O(n log m)
    result = result.replace(
      /O\(([^)]*)\s+log\s+([^)]*)\)/g,
      'O($1 \\log $2)'
    );

    // Step 7: Convert standalone log notation
    result = result.replace(/\blog\s+([a-zA-Z0-9_]+)/g, '\\log $1');

    // Convert absolute value notation for simple cases only
    // Avoid converting |piles| or other simple variable names
    result = result.replace(/\|([a-zA-Z0-9_]+(?:\s*[+\-*/]\s*[a-zA-Z0-9_]+)*)\|/g, (match, content) => {
      // Only convert if it's not a simple variable name or array reference
      if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(content.trim())) {
        return match; // Keep as-is for simple variables like |piles|
      }
      return `\\left| ${content} \\right|`;
    });

    // Convert matrix notation [a b; c d]
    result = result.replace(
      /\[([^\]]+)\]/g,
      (match, content) => {
        if (content.includes(';')) {
          const rows = content.split(';').map((row: string) => row.trim().replace(/\s+/g, ' & '));
          return `\\begin{bmatrix} ${rows.join(' \\\\ ')} \\end{bmatrix}`;
        }
        return match;
      }
    );

    // Convert vector notation
    result = result.replace(/\vec\{([^}]+)\}/g, '\\vec{$1}');
    result = result.replace(/([a-zA-Z])⃗/g, '\\vec{$1}');

    // Clean up extra spaces
    result = result.replace(/\s+/g, ' ').trim();

    // Wrap in delimiters if requested
    if (wrapInDelimiters && !result.startsWith('$')) {
      result = `$${result}$`;
    }

    return result;
  }

  private static convertSummationNotation(text: string): string {
    let result = text;

    // Handle patterns like ∑ᵢ₌₁^|piles| → ∑_{i=1}^{|piles|}
    // Match: ∑ (Unicode) + subscript variable + = + lower bound + optional ^ + upper bound
    result = result.replace(
      /∑([ᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵧ][₌][₀₁₂₃₄₅₆₇₈₉]+)(\^?)([^∑\s≤≥<>=]*?)(?=\s|[≤≥<>=]|$)/g,
      (_match, subscriptPart, _caretSymbol, upperBound) => {
        // Parse the subscript part (variable = lower)
        const subChars = subscriptPart.split('');
        const variable = this.SUBSCRIPT_MAP.get(subChars[0]) || subChars[0];
        // Skip the equals sign (₌)
        const lowerChars = subChars.slice(2);
        const lower = lowerChars.map((char: string) => this.SUBSCRIPT_MAP.get(char) || char).join('');

        // Clean up the upper bound (don't include the ^ if it was captured separately)
        const upper = upperBound.trim();

        return `\\sum_{${variable}=${lower}}^{${upper}}`;
      }
    );

    return result;
  }

  private static convertSubscripts(text: string): string {
    let result = text;

    // Convert subscript patterns like x₁ → x_{1} or xᵢ → x_{i}
    // But avoid unnecessary braces for single characters
    result = result.replace(
      /([a-zA-Z0-9])([₀₁₂₃₄₅₆₇₈₉ₐₑᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵧᵦᵨᵩᵪ₊₋₌₍₎]+)/g,
      (_match, base, subscript) => {
        const converted = subscript.split('').map((char: string) =>
          this.SUBSCRIPT_MAP.get(char) || char
        ).join('');
        // Only use braces if more than one character or special characters
        if (converted.length === 1 && /^[a-zA-Z0-9]$/.test(converted)) {
          return `${base}_${converted}`;
        }
        return `${base}_{${converted}}`;
      }
    );

    return result;
  }

  private static convertSuperscripts(text: string): string {
    let result = text;

    // Convert superscript patterns like x² → x^{2} or xⁿ → x^{n}
    result = result.replace(
      /([a-zA-Z0-9])([⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻᴬᴮᴰᴱᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᴿᵀᵁⱽᵂ⁺⁻⁼⁽⁾ᵅᵝᵞᵟᵋᶿᶥᶲᵡ]+)/g,
      (_match, base, superscript) => {
        const converted = superscript.split('').map((char: string) =>
          this.SUPERSCRIPT_MAP.get(char) || char
        ).join('');
        return `${base}^{${converted}}`;
      }
    );

    return result;
  }


  /**
   * Convert multiple expressions in a text block
   */
  static convertText(text: string, options: MathConversionOptions = {}): string {
    // Split by lines and convert each math expression
    return text.split('\n').map(line => {
      // Look for inline math patterns
      if (this.containsMathNotation(line)) {
        return this.convertInlineExpressions(line, options);
      }
      return line;
    }).join('\n');
  }

  /**
   * Convert inline math expressions within text, leaving regular text unchanged
   */
  static convertInlineExpressions(text: string, options: MathConversionOptions = {}): string {
    const { preserveExisting = true } = options;

    // Skip if already has KaTeX
    if (preserveExisting && (text.includes('\\') || text.match(/\$.*\$/))) {
      return text;
    }

    // More intelligent approach: identify complete mathematical contexts
    let result = text;

    // Pattern 1: Complex mathematical expressions (summations, products with bounds and inequalities)
    result = result.replace(
      /(∑[^∑∏]*[≤≥<>=][^.!?]*)/g,
      (match) => {
        const converted = this.convert(match.trim(), { wrapInDelimiters: false, preserveExisting: false });
        return `$${converted}$`;
      }
    );

    // Pattern 2: Mathematical expressions within ** bold ** text
    result = result.replace(
      /\*\*([^*]+(?:[∑∏∈∉⊆⊊⊇⊋∪∩∅∞≤≥≠≈≡ℕℤℚℝℂℙ⌊⌋⌈⌉₀₁₂₃₄₅₆₇₈₉ₐₑᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵧ⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ])[^*]*?)\*\*/g,
      (match, content) => {
        if (this.containsMathNotation(content)) {
          const converted = this.convert(content.trim(), { wrapInDelimiters: false, preserveExisting: false });
          return `**$${converted}$**`;
        }
        return match;
      }
    );

    // Pattern 3: Big-O notation (standalone)
    result = result.replace(
      /\bO\([^)]+\)/g,
      (match) => {
        const converted = this.convert(match, { wrapInDelimiters: false, preserveExisting: false });
        return `$${converted}$`;
      }
    );

    // Pattern 4: Floor/ceiling expressions (standalone)
    result = result.replace(
      /(?<!\$)(?:⌊[^⌋]*⌋|⌈[^⌉]*⌉)(?!\$)/g,
      (match) => {
        const converted = this.convert(match, { wrapInDelimiters: false, preserveExisting: false });
        return `$${converted}$`;
      }
    );

    // Pattern 5: Variables with subscripts/superscripts (when standalone or in mathematical context)
    result = result.replace(
      /(?<!\$)\b([a-zA-Z])([₀₁₂₃₄₅₆₇₈₉ₐₑᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵧᵦᵨᵩᵪ₊₋₌₍₎⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻᴬᴮᴰᴱᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᴿᵀᵁⱽᵂ⁺⁻⁼⁽⁾ᵅᵝᵞᵟᵋᶿᶥᶲᵡ]+)(?!\$)/g,
      (match) => {
        const converted = this.convert(match, { wrapInDelimiters: false, preserveExisting: false });
        return `$${converted}$`;
      }
    );

    // Pattern 6: Set notation symbols (when standalone)
    result = result.replace(
      /(?<!\$)\b([ℕℤℚℝℂℙ])(?!\$)/g,
      (match) => {
        const converted = this.convert(match, { wrapInDelimiters: false, preserveExisting: false });
        return `$${converted}$`;
      }
    );

    // Pattern 7: Mathematical operators (when in clear mathematical context)
    result = result.replace(
      /(?<!\$)([≤≥≠≈≡∈∉⊆⊊⊇⊋])(?!\$)/g,
      (match) => {
        const converted = this.convert(match, { wrapInDelimiters: false, preserveExisting: false });
        return `$${converted}$`;
      }
    );

    return result;
  }

  /**
   * Check if text contains mathematical notation
   */
  static containsMathNotation(text: string): boolean {
    const mathPatterns = [
      /[∑∏∫∮]/,                    // Summation, product, integral symbols
      /[≤≥≠≈≡∈∉⊆⊊⊇⊋]/,           // Comparison and set symbols
      /[₀₁₂₃₄₅₆₇₈₉ₐₑᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵧ]/, // Subscripts
      /[⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ]/, // Superscripts
      /[⌊⌋⌈⌉]/,                   // Floor/ceiling
      /[αβγδεζηθικλμνξπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΠΡΣΤΥΦΧΨΩ]/, // Greek letters
      /O\([^)]*(?:\*|×)[^)]*\)/,   // Big-O notation
      /\w+\s+log\s+\w+/,           // Logarithmic expressions
    ];

    return mathPatterns.some(pattern => pattern.test(text));
  }
}

// Convenience function for direct usage
export function convertMathNotation(text: string, options?: MathConversionOptions): string {
  return MathNotationConverter.convert(text, options);
}

export function convertMathText(text: string, options?: MathConversionOptions): string {
  return MathNotationConverter.convertText(text, options);
}