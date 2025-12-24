"use client"

import type { ParsedToken, HeadingToken, ParagraphToken } from '../types'
import { InlineRenderer } from './inline-renderer'
import { ListRenderer } from './list-renderer'
import { H1, H2, H3, H4, H5, H6 } from '@/components/mdx/typography'

interface BlockRendererProps {
  tokens: ParsedToken[]
}

export function BlockRenderer({ tokens }: BlockRendererProps) {
  return (
    <>
      {tokens.map((token, index) => renderBlockToken(token, index))}
    </>
  )
}

function renderBlockToken(token: ParsedToken, key: number): React.ReactNode {
  switch (token.type) {
    case 'heading':
      return renderHeading(token, key)

    case 'paragraph':
      return renderParagraph(token, key)

    case 'list':
      return <ListRenderer key={key} token={token} />

    case 'codeBlock':
      return (
        <pre key={key} className="overflow-x-auto rounded-md my-4 bg-gray-100 shadow-2xl dark:bg-gray-800 p-4 text-sm">
          <code className={token.language ? `language-${token.language}` : undefined}>
            {token.content}
          </code>
        </pre>
      )

    case 'mathDisplay':
      return <InlineRenderer key={key} tokens={[token]} />

    default:
      // For non-block tokens, use inline renderer
      return <InlineRenderer key={key} tokens={[token]} />
  }
}

function renderParagraph(token: ParagraphToken, key: number): React.ReactNode {
  return (
    <p key={key} className="mb-4">
      <InlineRenderer tokens={token.children} />
    </p>
  )
}

function renderHeading(token: HeadingToken, key: number): React.ReactNode {
  const content = <InlineRenderer tokens={token.children} />

  switch (token.level) {
    case 1:
      return <H1 key={key}>{content}</H1>
    case 2:
      return <H2 key={key}>{content}</H2>
    case 3:
      return <H3 key={key}>{content}</H3>
    case 4:
      return <H4 key={key}>{content}</H4>
    case 5:
      return <H5 key={key}>{content}</H5>
    case 6:
      return <H6 key={key}>{content}</H6>
  }
}