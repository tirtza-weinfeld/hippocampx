import type { ParsedToken, StepData, TextToken, StrongToken, EmphasisToken, InlineCodeToken, LinkToken } from '../types'
import { isValidColorName, getStepColor } from '@/lib/step-colors'

export class InlineParser {
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
        // If no specific token is found, consume one character as text
        this.parseText(1)
      }
    }

    return tokens
  }

  private parseNext(): ParsedToken | null {
    const remaining = this.text.slice(this.position)

    // Try to parse in order of precedence
    return this.parseStepSyntax(remaining) ||
           this.parseLink(remaining) ||
           this.parseInlineCode(remaining) ||
           this.parseStrong(remaining) ||
           this.parseEmphasis(remaining) ||
           this.parseText()
  }

  private parseStepSyntax(text: string): TextToken | null {
    const stepMatch = text.match(/^\[([^!]+)!\]\(([^)]+)\)/)
    if (!stepMatch) return null

    const [fullMatch, stepOrColor, content] = stepMatch
    const start = this.position
    this.position += fullMatch.length

    // Determine step value
    let stepData: StepData | undefined

    if (/^\d+$/.test(stepOrColor)) {
      // Numeric step - convert to color
      const stepNumber = parseInt(stepOrColor, 10)
      const color = getStepColor(stepNumber)
      stepData = {
        step: stepOrColor,
        color
      }
    } else if (isValidColorName(stepOrColor)) {
      // Color name
      stepData = {
        step: stepOrColor,
        color: stepOrColor
      }
    }

    return {
      type: 'text',
      content,
      stepData,
      start,
      end: this.position
    }
  }

  private parseLink(text: string): LinkToken | null {
    const linkMatch = text.match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (!linkMatch) return null

    const [fullMatch, linkText, href] = linkMatch

    // Skip if this looks like step syntax: [color!]
    if (linkText.endsWith('!')) {
      return null
    }
    const start = this.position
    this.position += fullMatch.length

    // Parse children tokens within link text
    const childParser = new InlineParser(linkText)
    const children = childParser.parse()

    return {
      type: 'link',
      content: linkText,
      href,
      children,
      start,
      end: this.position
    }
  }

  private parseInlineCode(text: string): InlineCodeToken | null {
    const codeMatch = text.match(/^`([^`]+)`/)
    if (!codeMatch) return null

    const [fullMatch, codeContent] = codeMatch
    const start = this.position
    this.position += fullMatch.length

    // Check for step syntax: [1!]content or [red!]content
    const { content, stepData } = this.extractStepSyntax(codeContent)

    return {
      type: 'inlineCode',
      content,
      stepData,
      start,
      end: this.position
    }
  }

  private parseStrong(text: string): StrongToken | null {
    const strongMatch = text.match(/^\*\*([^*]+)\*\*/)
    if (!strongMatch) return null

    const [fullMatch, strongContent] = strongMatch
    const start = this.position
    this.position += fullMatch.length

    // Check for step syntax
    const { content, stepData } = this.extractStepSyntax(strongContent)

    // Parse children tokens within strong text
    const childParser = new InlineParser(content)
    const children = childParser.parse()

    return {
      type: 'strong',
      content,
      children,
      stepData,
      start,
      end: this.position
    }
  }

  private parseEmphasis(text: string): EmphasisToken | null {
    // Check if this starts with a single asterisk (not double)
    if (!text.startsWith('*') || text.startsWith('**')) {
      return null
    }

    // Find the matching closing asterisk, accounting for nested emphasis
    // We need to count nested single asterisks properly
    let i = 1 // Start after the opening asterisk
    let emphasisContent = ''

    while (i < text.length) {
      const char = text[i]
      const nextChar = i + 1 < text.length ? text[i + 1] : ''
      const prevChar = i > 0 ? text[i - 1] : ''

      if (char === '*') {
        // Skip double asterisks (strong tags) - they don't interfere with emphasis
        if (nextChar === '*') {
          i += 2
          continue
        }

        // Also skip if we're at the end of a double asterisk
        if (prevChar === '*') {
          i++
          continue
        }

        // This is a single asterisk
        // We found a potential closing asterisk
        // We need to look ahead to see if this closes our emphasis or opens a nested one

        // Count how many asterisks follow this one
        let asteriskCount = 1
        let j = i + 1
        while (j < text.length && text[j] === '*') {
          asteriskCount++
          j++
        }

        // If there's an odd number of asterisks ahead, this might be a nested opening
        // For now, let's use a simpler heuristic: if the next non-asterisk char looks like
        // it could start emphasis content (not whitespace, not punctuation that typically ends emphasis)
        // and we can find another closing asterisk later, treat this as opening nested emphasis

        // For simplicity, let's just look for the last single asterisk in the remaining text
        // that could close our emphasis
        let foundClosing = false
        for (let k = text.length - 1; k > i; k--) {
          if (text[k] === '*' &&
              (k + 1 >= text.length || text[k + 1] !== '*') &&
              (k === 0 || text[k - 1] !== '*')) {
            // Found a potential closing asterisk
            emphasisContent = text.slice(1, k)
            i = k
            foundClosing = true
            break
          }
        }

        if (foundClosing) {
          break
        } else {
          // No closing found after this, so this must be the closing
          emphasisContent = text.slice(1, i)
          break
        }
      }

      i++
    }

    // If we didn't find a closing asterisk, this isn't valid emphasis
    if (emphasisContent === '') {
      return null
    }

    const fullMatch = text.slice(0, i + 1)
    const start = this.position
    this.position += fullMatch.length

    // Check for step syntax
    const { content, stepData } = this.extractStepSyntax(emphasisContent)

    // Parse children tokens within emphasis text
    const childParser = new InlineParser(content)
    const children = childParser.parse()

    return {
      type: 'emphasis',
      content,
      children,
      stepData,
      start,
      end: this.position
    }
  }

  private parseText(minLength?: number): TextToken | null {
    const remaining = this.text.slice(this.position)
    if (!remaining) return null

    // Find the next special character that might start special syntax
    let nextSpecial = -1

    for (let i = 0; i < remaining.length; i++) {
      const char = remaining[i]
      const substring = remaining.slice(i)

      if (char === '*' || char === '`' || char === '$') {
        nextSpecial = i
        break
      }

      // Only treat [ as special if it's followed by link syntax
      // Note: [color!] step syntax without parentheses is NOT parsed in plain text
      // It's only extracted inside formatted elements (emphasis, strong, code)
      if (char === '[') {
        if (substring.match(/^\[([^\]]+)\]\([^)]+\)/)) {
          nextSpecial = i
          break
        }
      }
    }

    const textLength = nextSpecial === -1 ? remaining.length : nextSpecial

    // Ensure we consume at least the minimum length
    const actualLength = minLength ? Math.max(textLength, minLength) : textLength

    if (actualLength === 0) return null

    const start = this.position
    const textContent = remaining.slice(0, actualLength)
    this.position += actualLength

    return {
      type: 'text',
      content: textContent,
      start,
      end: this.position
    }
  }

  private extractStepSyntax(text: string): { content: string; stepData?: StepData } {
    // Check for step syntax: [1!]content or [red!]content
    const stepMatch = text.match(/^\[([^!]+)!\](.*)$/)
    if (!stepMatch) {
      return { content: text }
    }

    const [, stepOrColor, content] = stepMatch

    // Determine step value
    let stepData: StepData | undefined

    if (/^\d+$/.test(stepOrColor)) {
      // Numeric step - convert to color
      const stepNumber = parseInt(stepOrColor, 10)
      const color = getStepColor(stepNumber)
      stepData = {
        step: stepOrColor,
        color
      }
    } else if (isValidColorName(stepOrColor)) {
      // Color name
      stepData = {
        step: stepOrColor,
        color: stepOrColor
      }
    }

    return {
      content,
      stepData
    }
  }
}