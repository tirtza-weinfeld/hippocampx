"use client"

import type { ParsedToken, StrongToken, EmphasisToken, InlineCodeToken, LinkToken, MathToken, MathDisplayToken, ListToken, StepData, Token } from '../types'
import { Strong, Em } from '@/components/mdx/typography'
import { LinkRenderer } from './link-renderer'
import { InlineCodeClient } from '@/components/mdx/code/code-inline-client'
import { MathRenderer } from './math-renderer'
import { ListRenderer } from './list-renderer'

interface InlineRendererProps {
  tokens: ParsedToken[]
}

export function InlineRenderer({ tokens }: InlineRendererProps) {
  return (
    <>
      {tokens.map((token, index) => renderToken(token, index))}
    </>
  )
}

function renderToken(token: ParsedToken, key: number): React.ReactNode {
  switch (token.type) {
    case 'text':
      return renderText(token.content, token.stepData, key)

    case 'strong':
      return renderStrong(token as StrongToken, key)

    case 'emphasis':
      return renderEmphasis(token as EmphasisToken, key)

    case 'inlineCode':
      return renderInlineCode(token as InlineCodeToken, key)

    case 'link':
      return renderLink(token as LinkToken, key)

    case 'math':
      return renderInlineMath(token as MathToken, key)

    case 'mathDisplay':
      return renderDisplayMath(token as MathDisplayToken, key)

    case 'list':
      return renderList(token as ListToken, key)

    case 'listItem':
      // List items should be rendered within their parent list
      return null

    default:
      // Fallback for any unknown token types
      return String((token as Token).content || '')
  }
}

function renderText(content: string, stepData: StepData | undefined, key: number) {
  if (stepData) {
    return (
      <span key={key} data-step={stepData.color}>
        {content}
      </span>
    )
  }
  return content
}

function renderStrong(token: StrongToken, key: number) {
  const props: Record<string, string> = {}
  if (token.stepData) {
    props['data-step'] = token.stepData.color
  }

  return (
    <Strong key={key} {...props}>
      <InlineRenderer tokens={token.children as ParsedToken[]} />
    </Strong>
  )
}

function renderEmphasis(token: EmphasisToken, key: number) {
  const props: Record<string, string> = {}
  if (token.stepData) {
    props['data-step'] = token.stepData.color
  }

  return (
    <Em key={key} {...props}>
      <InlineRenderer tokens={token.children as ParsedToken[]} />
    </Em>
  )
}

function renderInlineCode(token: InlineCodeToken, key: number) {
  const props: Record<string, string | boolean> = {}
  const hasStep = !!token.stepData

  if (token.stepData) {
    props['data-step'] = token.stepData.color
  }

  return (
    <InlineCodeClient key={key} highlighted={hasStep} {...props}>
      {token.content}
    </InlineCodeClient>
  )
}

function renderLink(token: LinkToken, key: number) {
  // For now, render simple text content to avoid recursive parsing issues
  const linkText = extractTextContent(token.children)

  return (
    <LinkRenderer key={key} href={token.href}>
      {linkText}
    </LinkRenderer>
  )
}

// Helper function to extract plain text from tokens (avoiding recursion)
function extractTextContent(tokens: (Token | string)[]): string {
  return tokens.map(token => {
    if (typeof token === 'string') return token
    if ('content' in token && token.content) return token.content
    if ('children' in token && token.children && Array.isArray(token.children)) {
      return extractTextContent(token.children)
    }
    return ''
  }).join('')
}

function renderInlineMath(token: MathToken, key: number) {
  return (
    <MathRenderer key={key} latex={token.latex} display={false} />
  )
}

function renderDisplayMath(token: MathDisplayToken, key: number) {
  return (
    <MathRenderer key={key} latex={token.latex} display={true} />
  )
}

function renderList(token: ListToken, key: number) {
  return (
    <ListRenderer key={key} token={token} />
  )
}