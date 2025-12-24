

import type { ReactNode } from 'react'
import { InlineParser, MathParser, BlockParser } from './parsers'
import { InlineRenderer, BlockRenderer } from './renderers'
import InlineCode from '../code/code-inline'
import type { ParsedToken } from './types'

interface MarkdownRendererProps {
  children: ReactNode
  className?: string
}

export function MarkdownRenderer({ children, className }: MarkdownRendererProps) {
  // Handle array children (e.g., [' ', content]) by filtering and joining
  let text: string
  if (typeof children === 'string') {
    text = children
  } else if (Array.isArray(children)) {
    // Filter out empty strings and whitespace-only strings, then join without separator
    text = children
      .filter((child): child is string => typeof child === 'string' && child.trim() !== '')
      .join('')
  } else {
    // Non-string, non-array children can't be parsed as markdown
    return null
  }

  if (!text) return null

  // Check if the text is inline code with language/meta attributes or step syntax
  const codeMatch = text.match(/^\[((?:[^"\]]+|"[^"]*")*)\](.+)$/)
  if (codeMatch && (codeMatch[1].includes('=') || codeMatch[1].includes('!'))) {
    return <InlineCode>{text}</InlineCode>
  }

  // Check if the text contains block-level content (headers, lists, or fenced code blocks)
  const hasHeaders = /^#{1,6}\s/m.test(text)
  const hasLists = /^[ \t]*[-*+]\s|^\d+\.\s/m.test(text)
  const hasCodeBlocks = /^[ \t]*```/m.test(text)

  if (hasHeaders || hasLists || hasCodeBlocks) {
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
    // Extract math tokens and replace with placeholders
    const mathParser = new MathParser(text)
    const allParsedTokens = mathParser.parse()
    const mathTokens = allParsedTokens.filter(t => t.type === 'math' || t.type === 'mathDisplay')
    const sortedMath = [...mathTokens].sort((a, b) => b.start - a.start) // reverse order for replacement

    // Create placeholder map
    const placeholderMap = new Map<string, ParsedToken>()
    let textWithPlaceholders = text

    // Replace math expressions with unique placeholders (from right to left)
    sortedMath.forEach((mathToken, index) => {
      const placeholder = `___MATH${sortedMath.length - 1 - index}___`
      placeholderMap.set(placeholder, mathToken)
      textWithPlaceholders =
        textWithPlaceholders.slice(0, mathToken.start) +
        placeholder +
        textWithPlaceholders.slice(mathToken.end)
    })

    // Parse the text with placeholders
    const parser = new InlineParser(textWithPlaceholders)
    const tokensWithPlaceholders = parser.parse()

    // Recursively replace placeholders with math tokens
    function replaceInTokens(tokens: ParsedToken[]): ParsedToken[] {
      const result: ParsedToken[] = []

      for (const token of tokens) {
        if (token.type === 'text' && token.content.includes('___MATH')) {
          // Split text token by placeholders
          const parts = token.content.split(/(___MATH\d+___)/)
          let position = token.start

          for (const part of parts) {
            if (part.startsWith('___MATH')) {
              const mathToken = placeholderMap.get(part)
              if (mathToken) {
                result.push(mathToken)
                position = mathToken.end
              }
            } else if (part) {
              result.push({
                type: 'text',
                content: part,
                start: position,
                end: position + part.length
              } as ParsedToken)
              position += part.length
            }
          }
        } else if ('children' in token && Array.isArray(token.children) && token.children.length > 0) {
          result.push({
            ...token,
            children: replaceInTokens(token.children as ParsedToken[])
          } as ParsedToken)
        } else {
          result.push(token)
        }
      }

      return result
    }

    const allTokens = replaceInTokens(tokensWithPlaceholders)

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
  if (typeof children !== 'string') return null
  if (!children) return null

  const text = children

  const parser = new InlineParser(text)
  const tokens = parser.parse()

  return (
    <span className={className}>
      <InlineRenderer tokens={tokens} />
    </span>
  )
}