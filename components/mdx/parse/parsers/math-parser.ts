import type { ParsedToken, MathToken, MathDisplayToken } from '../types'

export class MathParser {
  private text: string
  private position: number

  constructor(text: string) {
    this.text = text
    this.position = 0
  }

  parse(): ParsedToken[] {
    const tokens: ParsedToken[] = []

    while (this.position < this.text.length) {
      const token = this.parseNext()
      if (token) {
        tokens.push(token)
      } else {
        // If no math token found, consume one character
        this.position++
      }
    }

    return tokens
  }

  private parseNext(): ParsedToken | null {
    const remaining = this.text.slice(this.position)

    // Try display math first ($$...$$), then inline math ($...$)
    return this.parseDisplayMath(remaining) || this.parseInlineMath(remaining)
  }

  private parseDisplayMath(text: string): MathDisplayToken | null {
    // Match display math: $$...$$
    const displayMatch = text.match(/^\$\$((?:[^$]|\$(?!\$))+)\$\$/)
    if (!displayMatch) return null

    const [fullMatch, latex] = displayMatch
    const start = this.position
    this.position += fullMatch.length

    return {
      type: 'mathDisplay',
      content: fullMatch,
      latex: latex.trim(),
      start,
      end: this.position
    }
  }

  private parseInlineMath(text: string): MathToken | null {
    // Match inline math: $...$ (but not $$)
    const inlineMatch = text.match(/^\$([^$]+)\$(?!\$)/)
    if (!inlineMatch) return null

    const [fullMatch, latex] = inlineMatch
    const start = this.position
    this.position += fullMatch.length

    return {
      type: 'math',
      content: fullMatch,
      latex: latex.trim(),
      start,
      end: this.position
    }
  }

  // Static method to extract math tokens from text and return remaining text
  static extractMathTokens(text: string): { tokens: (MathToken | MathDisplayToken)[]; remaining: string } {
    const parser = new MathParser(text)
    const allTokens = parser.parse()
    const mathTokens = allTokens.filter(token => token.type === 'math' || token.type === 'mathDisplay') as (MathToken | MathDisplayToken)[]

    // Build remaining text by skipping over math token ranges
    // Sort tokens by start position in reverse order to maintain correct positions
    const sortedTokens = [...mathTokens].sort((a, b) => b.start - a.start)
    let remaining = text

    // Remove math expressions from right to left to preserve positions
    sortedTokens.forEach(token => {
      remaining = remaining.slice(0, token.start) + remaining.slice(token.end)
    })

    return { tokens: mathTokens, remaining }
  }

  // Static method to check if text contains math expressions
  static hasMath(text: string): boolean {
    return /\$\$?[^$]+\$\$?/.test(text)
  }
}