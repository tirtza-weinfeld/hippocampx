import { describe, it, expect } from 'vitest'
import { InlineParser } from '@/components/mdx/parse/parsers'
import type { TextToken } from '@/components/mdx/parse/types'

describe('InlineParser', () => {
  it('should parse plain text correctly', () => {
    const parser = new InlineParser('Just plain text')
    const tokens = parser.parse()

    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe('text')
    expect(tokens[0].content).toBe('Just plain text')
  })

  it('should parse bold text correctly', () => {
    const parser = new InlineParser('This has **bold text** in it')
    const tokens = parser.parse()

    expect(tokens).toHaveLength(3)
    expect(tokens[0].type).toBe('text')
    expect(tokens[0].content).toBe('This has ')

    expect(tokens[1].type).toBe('strong')
    expect(tokens[1].content).toBe('bold text')

    expect(tokens[2].type).toBe('text')
    expect(tokens[2].content).toBe(' in it')
  })

  it('should NOT parse step syntax in plain text', () => {
    const parser = new InlineParser('This has [19!]step colored text')
    const tokens = parser.parse()

    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe('text')
    expect(tokens[0].content).toBe('This has [19!]step colored text')
    expect(tokens[0].stepData).toBeUndefined()
  })

  it('should NOT parse step syntax with color names in plain text', () => {
    const parser = new InlineParser('This has [red!]red colored text')
    const tokens = parser.parse()

    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe('text')
    expect(tokens[0].content).toBe('This has [red!]red colored text')
    expect(tokens[0].stepData).toBeUndefined()
  })

  it('should parse inline code correctly', () => {
    const parser = new InlineParser('This has `inline code` in it')
    const tokens = parser.parse()

    expect(tokens).toHaveLength(3)
    expect(tokens[1].type).toBe('inlineCode')
    expect(tokens[1].content).toBe('inline code')
  })

  it('should parse inline code with step syntax', () => {
    const parser = new InlineParser('Code: `[3!]colored code`')
    const tokens = parser.parse()

    expect(tokens).toHaveLength(2)
    expect(tokens[1].type).toBe('inlineCode')
    expect(tokens[1].content).toBe('colored code')
    expect(tokens[1].stepData?.step).toBe('3')
    expect(tokens[1].stepData?.color).toBe('amber')
  })

  it('should parse links correctly', () => {
    const parser = new InlineParser('Check out [this link](https://example.com)')
    const tokens = parser.parse()

    expect(tokens).toHaveLength(2)
    expect(tokens[0].content).toBe('Check out ')

    expect(tokens[1].type).toBe('link')
    expect(tokens[1].content).toBe('this link')
    expect((tokens[1] as any).href).toBe('https://example.com')
  })

  it('should parse bold text with step syntax', () => {
    const parser = new InlineParser('**[5!]This is bold with step color**')
    const tokens = parser.parse()

    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe('strong')
    expect(tokens[0].content).toBe('This is bold with step color')
    expect(tokens[0].stepData?.step).toBe('5')
    expect(tokens[0].stepData?.color).toBe('lime')
  })

  it('should parse complex real-world problem text correctly', () => {
    const problemText = "Given a partially filled 9×9 board with digits `$1$–$9$` and `$.$` for empty cells, determine if it is valid - [19!]no duplicates in any row, column, or 3×3 sub-box."

    const parser = new InlineParser(problemText)
    const tokens = parser.parse()

    // Should parse inline code elements
    const codeTokens = tokens.filter(t => t.type === 'inlineCode')
    expect(codeTokens.length).toBeGreaterThan(0)

    // Step syntax in plain text should NOT be processed - it should remain as plain text
    const stepTokens = tokens.filter(t => t.type === 'text' && t.content.includes('[19!]'))
    expect(stepTokens.length).toBeGreaterThan(0)
    expect(stepTokens[0].content).toContain('[19!]no duplicates')
  })

  it('should handle mixed formatting correctly', () => {
    const parser = new InlineParser('Text with **bold** and *italic* and `code` and [1!]steps')
    const tokens = parser.parse()

    const boldToken = tokens.find(t => t.type === 'strong')
    const italicToken = tokens.find(t => t.type === 'emphasis')
    const codeToken = tokens.find(t => t.type === 'inlineCode')

    expect(boldToken).toBeDefined()
    expect(italicToken).toBeDefined()
    expect(codeToken).toBeDefined()

    // Step syntax in plain text should NOT be processed
    const textWithStepSyntax = tokens.find(t => t.type === 'text' && t.content.includes('[1!]'))
    expect(textWithStepSyntax).toBeDefined()
    expect(textWithStepSyntax?.content).toContain('[1!]steps')
  })

  it('should handle square brackets without step syntax correctly', () => {
    const parser = new InlineParser('occurrence of s[r] was before l')
    const tokens = parser.parse()

    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe('text')
    expect(tokens[0].content).toBe('occurrence of s[r] was before l')
  })

  it('should not parse square brackets without exclamation mark as step syntax', () => {
    const parser = new InlineParser('array[index] and object[key] should remain intact')
    const tokens = parser.parse()

    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe('text')
    expect(tokens[0].content).toBe('array[index] and object[key] should remain intact')
    expect((tokens[0] as TextToken).stepData).toBeUndefined()
  })
})