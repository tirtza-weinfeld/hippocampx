import type { ParsedToken, ListToken, ListItemToken, CodeBlockToken } from '../types'
import { InlineParser } from './inline-parser'
import { cleanTextContent } from '@/lib/list-processing-utils'

export class BlockParser {
  private lines: string[]
  private position: number

  constructor(text: string) {
    this.lines = text.split('\n')
    this.position = 0
  }

  parse(currentLevel: number = 1): ParsedToken[] {
    const tokens: ParsedToken[] = []

    while (this.position < this.lines.length) {
      const token = this.parseNext(currentLevel)
      if (token) {
        tokens.push(token)
        continue
      }

      // If no block element found, parse as inline content
      const line = this.lines[this.position]
      if (line.trim()) {
        const inlineParser = new InlineParser(line)
        const inlineTokens = inlineParser.parse()
        tokens.push(...inlineTokens)
      }
      this.position++
    }

    return tokens
  }

  private parseNext(currentLevel: number): ParsedToken | null {
    if (this.position >= this.lines.length) return null

    const currentLine = this.lines[this.position]

    // Check if this line starts a fenced code block
    if (this.isCodeBlockStart(currentLine)) {
      return this.parseCodeBlock()
    }

    // Check if this line starts a list
    if (this.isListStart(currentLine)) {
      return this.parseList(currentLevel)
    }

    return null
  }

  private isCodeBlockStart(line: string): boolean {
    return /^[ \t]*```/.test(line)
  }

  private parseCodeBlock(): CodeBlockToken {
    const start = this.position
    const openingLine = this.lines[this.position]

    // Extract language and meta from opening fence
    const match = openingLine.match(/^[ \t]*```(\w*)(.*)$/)
    const language = match?.[1] || undefined
    const meta = match?.[2]?.trim() || undefined

    this.position++

    // Collect content until closing fence
    const contentLines: string[] = []

    while (this.position < this.lines.length) {
      const line = this.lines[this.position]

      // Check for closing fence
      if (/^[ \t]*```\s*$/.test(line)) {
        this.position++
        break
      }

      contentLines.push(line)
      this.position++
    }

    return {
      type: 'codeBlock',
      content: contentLines.join('\n'),
      language,
      meta,
      start,
      end: this.position
    }
  }

  private isListStart(line: string): boolean {
    const trimmed = line.trim()
    return /^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)
  }

  private getIndentationLevel(line: string): number {
    const match = line.match(/^(\s*)/)
    return match ? match[1].length : 0
  }

  private calculateNestingLevel(currentIndent: number, baseIndent: number, currentLevel: number): number {
    // Calculate indentation difference
    const indentDiff = currentIndent - baseIndent

    if (indentDiff <= 0) return currentLevel

    // For nested lists, increment level by exactly 1
    // This matches the behavior of the remark plugin where nested lists
    // get currentLevel + 1 regardless of specific indentation amount
    return currentLevel + 1
  }

  private isListItemAtLevel(line: string, baseIndent: number): boolean {
    const trimmed = line.trim()
    const currentIndent = this.getIndentationLevel(line)

    // Must be a list marker and at the expected indentation level
    const isListMarker = /^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)
    return isListMarker && currentIndent === baseIndent
  }

  private parseList(currentLevel: number): ListToken {
    const start = this.position
    const firstLine = this.lines[this.position]
    const baseIndent = this.getIndentationLevel(firstLine)
    const trimmedFirstLine = firstLine.trim()
    const ordered = /^\d+\.\s/.test(trimmedFirstLine)

    const items: ListItemToken[] = []

    while (this.position < this.lines.length) {
      const line = this.lines[this.position]
      const trimmed = line.trim()

      // Empty line - continue but don't break the list
      if (!trimmed) {
        this.position++
        continue
      }

      // Check if this is a list item at our level
      if (this.isListItemAtLevel(line, baseIndent)) {
        const item = this.parseListItem(currentLevel, baseIndent)
        if (item) {
          items.push(item)
        }
      } else {
        // Check if this is a nested list at a deeper level
        const currentIndent = this.getIndentationLevel(line)
        if (currentIndent > baseIndent && this.isListStart(line)) {
          // This is a nested list that should be part of the previous item
          // If we have items, add it to the last item's children
          if (items.length > 0) {
            const nestedLevel = this.calculateNestingLevel(currentIndent, baseIndent, currentLevel)
            const nestedList = this.parseList(nestedLevel)

            // Add to the last item's children
            const lastItem = items[items.length - 1]
            lastItem.children.push(nestedList)
          } else {
            // No previous item, treat as independent list
            break
          }
        } else {
          // Not a list item at our level, end of list
          break
        }
      }
    }

    return {
      type: 'list',
      content: items.map(item => item.content).join('\n'),
      ordered,
      items,
      level: currentLevel,
      start,
      end: this.position
    }
  }

  private parseListItem(currentLevel: number, baseIndent: number): ListItemToken {
    const start = this.position
    const line = this.lines[this.position]
    const trimmed = line.trim()

    // Extract content after the list marker
    const markerMatch = trimmed.match(/^(?:\d+\.|\s*[-*+])\s(.*)/)
    const immediateContent = markerMatch ? markerMatch[1] : ''

    this.position++

    // Collect any continuation lines and nested content
    const allContent: string[] = [immediateContent]
    const nestedTokens: ParsedToken[] = []

    while (this.position < this.lines.length) {
      const nextLine = this.lines[this.position]
      const nextTrimmed = nextLine.trim()
      const nextIndent = this.getIndentationLevel(nextLine)

      // Empty line - include and continue
      if (!nextTrimmed) {
        this.position++
        continue
      }

      // If it's a list item at our base level, we're done with this item
      if (this.isListItemAtLevel(nextLine, baseIndent)) {
        break
      }

      // If it's indented more than our base level, it's part of this item
      if (nextIndent > baseIndent) {
        // Check if it's a nested list
        if (this.isListStart(nextLine)) {
          // Calculate the correct nesting level for the nested list
          const nestedLevel = this.calculateNestingLevel(nextIndent, baseIndent, currentLevel)
          const nestedList = this.parseList(nestedLevel)
          nestedTokens.push(nestedList)
        } else {
          // It's continuation content
          allContent.push(nextTrimmed)
          this.position++
        }
      } else {
        // Less indented or at a different level, end of this item
        break
      }
    }

    // Join all content and process it
    const fullContent = allContent.join(' ').trim()

    // Only clean if there's actual content
    let cleanedText = fullContent
    let hasTrailingColon = false

    if (fullContent) {
      const cleaned = cleanTextContent(fullContent)
      cleanedText = cleaned.cleanedText
      hasTrailingColon = cleaned.hasTrailingColon
    }

    // Parse the cleaned content as inline markdown
    const inlineTokens = cleanedText ? new InlineParser(cleanedText).parse() : []

    // Combine inline tokens with any nested tokens
    const allChildren = [...inlineTokens, ...nestedTokens]

    return {
      type: 'listItem',
      content: cleanedText || fullContent, // Use cleaned text for content
      children: allChildren,
      level: currentLevel,
      headerItem: hasTrailingColon,
      displayNumber: undefined, // Will be set later if needed
      start,
      end: this.position
    }
  }

}