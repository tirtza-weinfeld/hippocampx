

import type { ReactNode } from 'react'
import { InlineParser, MathParser, BlockParser } from './parsers'
import { InlineRenderer, BlockRenderer } from './renderers'
import InlineCode from '../code/code-inline'

interface MarkdownRendererProps {
  children: ReactNode
  className?: string
}

export function MarkdownRenderer({ children, className }: MarkdownRendererProps) {
  const text = typeof children === 'string' ? children : String(children || '')

  if (!text) return null

  // Check if the text is inline code with language/meta attributes or step syntax
  const codeMatch = text.match(/^\[((?:[^"\]]+|"[^"]*")*)\](.+)$/)
  if (codeMatch && (codeMatch[1].includes('=') || codeMatch[1].includes('!'))) {
    return <InlineCode>{text}</InlineCode>
  }

  // Check if the text contains block-level content (lists or fenced code blocks)
  const hasLists = /^[ \t]*[-*+]\s|^\d+\.\s/m.test(text)
  const hasCodeBlocks = /^[ \t]*```/m.test(text)

  if (hasLists || hasCodeBlocks) {
    // Use block parser for block-level content
    const blockParser = new BlockParser(text)
    const tokens = blockParser.parse()

    return (
      <div className={className}>
        <BlockRenderer tokens={tokens} />
      </div>
    )
  }

  // Check if text contains math expressions
  if (MathParser.hasMath(text)) {
    // Extract math tokens first to protect them from markdown parsing
    const { tokens: mathTokens, remaining } = MathParser.extractMathTokens(text)

    // Parse the remaining text (without math) for inline markdown
    const parser = new InlineParser(remaining)
    const inlineTokens = parser.parse()

    // Adjust inline token positions to account for removed math content
    const adjustedInlineTokens = inlineTokens.map(token => {
      // Find how many math tokens come before this token's original position in the remaining text
      let adjustment = 0

      for (const mathToken of mathTokens) {
        if (mathToken.start <= token.start + adjustment) {
          adjustment += mathToken.content.length
        }
      }

      return {
        ...token,
        start: token.start + adjustment,
        end: token.end + adjustment
      }
    })

    // Merge and sort all tokens by their original position
    const allTokens = [...adjustedInlineTokens, ...mathTokens].sort((a, b) => a.start - b.start)

    return (
      <span className={className}>
        <InlineRenderer tokens={allTokens} />
      </span>
    )
  }

  // No math expressions, use standard inline parsing
  const parser = new InlineParser(text)
  const tokens = parser.parse()

  return (
    <span className={className}>
      <InlineRenderer tokens={tokens} />
    </span>
  )
}

// Export a simpler version that just handles inline elements without math extraction
export function SimpleMarkdownRenderer({ children, className }: MarkdownRendererProps) {
  const text = typeof children === 'string' ? children : String(children || '')

  if (!text) return null

  const parser = new InlineParser(text)
  const tokens = parser.parse()

  return (
    <span className={className}>
      <InlineRenderer tokens={tokens} />
    </span>
  )
}