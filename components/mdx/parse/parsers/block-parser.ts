import type { ParsedToken, ListToken, ListItemToken, CodeBlockToken } from '../types'
import { InlineParser } from './inline-parser'
import { cleanTextContent, calculateDisplayNumber } from '@/lib/list-processing-utils'

// Collapsible item patterns - each with pattern and default title
const COLLAPSIBLE_PATTERNS = [
  { pattern: /^(Collapsible):\s*(.*)/, defaultTitle: 'Collapsible' },
  { pattern: /^(Deep Dive):\s*(.*)/, defaultTitle: 'Deep Dive' },
  { pattern: /^(Example):\s*(.*)/, defaultTitle: 'Example' }
] as const

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

  private extractMarker(line: string): string {
    const trimmed = line.trim()

    // Match ordered list markers: 1., 2), 1), etc.
    const orderedMatch = trimmed.match(/^(\d+(?:\.\d+)?[.)])/)
    if (orderedMatch) {
      return orderedMatch[1]
    }

    // Match unordered list markers: -, +, *
    const unorderedMatch = trimmed.match(/^([-+*])/)
    if (unorderedMatch) {
      return unorderedMatch[1]
    }

    return '-' // Default fallback
  }

  private detectCollapsible(content: string): { isCollapsible: boolean; title: string | null; cleanedContent: string } {
    const trimmedContent = content.trim()

    // Check all collapsible patterns
    for (const { pattern, defaultTitle } of COLLAPSIBLE_PATTERNS) {
      const match = trimmedContent.match(pattern)
      if (match) {
        // Use provided text or fallback to default title
        const title = match[2].trim() || defaultTitle
        return {
          isCollapsible: true,
          title,
          cleanedContent: '' // Content is removed for collapsible items
        }
      }
    }

    return {
      isCollapsible: false,
      title: null,
      cleanedContent: trimmedContent
    }
  }


  private isListItemAtLevel(line: string, baseIndent: number): boolean {
    const trimmed = line.trim()
    const currentIndent = this.getIndentationLevel(line)

    // Must be a list marker and at the expected indentation level
    const isListMarker = /^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)
    return isListMarker && currentIndent === baseIndent
  }

  private extractNumberFromMarker(marker: string): number {
    const numberMatch = marker.match(/^(\d+(?:\.\d+)?)/)
    if (numberMatch) {
      const num = numberMatch[1]
      return num.includes('.') ? parseFloat(num) : parseInt(num, 10)
    }
    return 0
  }

  private detectRestartPoints(originalNumbers: number[]): number[] {
    const restartPoints: number[] = []

    for (let i = 0; i < originalNumbers.length; i++) {
      const currentNumber = originalNumbers[i]
      if (currentNumber === 1 && i > 0) {
        // Check if this is a restart (1 after higher numbers)
        let isRestart = false
        for (let j = i - 1; j >= 0; j--) {
          if (originalNumbers[j] > 1) {
            isRestart = true
            break
          }
        }
        if (isRestart) {
          restartPoints.push(i)
        }
      }
    }

    return restartPoints
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

    // Calculate display numbers for ordered lists
    if (ordered && items.length > 0) {
      // Extract original numbers from markers
      const originalNumbers = items.map(item =>
        item.marker ? this.extractNumberFromMarker(item.marker) : 0
      )

      // Detect restart points
      const restartPoints = this.detectRestartPoints(originalNumbers)

      // Calculate and assign display numbers
      items.forEach((item, index) => {
        item.displayNumber = calculateDisplayNumber(index, originalNumbers, restartPoints)
      })
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

    // Extract marker from the line
    const marker = this.extractMarker(line)

    // Extract content after the list marker
    const markerMatch = trimmed.match(/^(?:\d+(?:\.\d+)?[.)]|[-*+])\s(.*)/)
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

    // Detect collapsible patterns before cleaning
    const collapsibleInfo = this.detectCollapsible(fullContent)

    // Only clean if there's actual content and it's not collapsible
    let cleanedText = fullContent
    let hasTrailingColon = false

    if (fullContent && !collapsibleInfo.isCollapsible) {
      const cleaned = cleanTextContent(fullContent)
      cleanedText = cleaned.cleanedText
      hasTrailingColon = cleaned.hasTrailingColon
    } else if (collapsibleInfo.isCollapsible) {
      cleanedText = collapsibleInfo.cleanedContent
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
      marker,
      isCollapsible: collapsibleInfo.isCollapsible,
      collapsibleTitle: collapsibleInfo.title || undefined,
      start,
      end: this.position
    }
  }

}