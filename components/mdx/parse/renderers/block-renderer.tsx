"use client"

import type { ParsedToken } from '../types'
import { InlineRenderer } from './inline-renderer'
import { ListRenderer } from './list-renderer'

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
    case 'list':
      return <ListRenderer key={key} token={token} />

    default:
      // For non-block tokens, use inline renderer
      return <InlineRenderer key={key} tokens={[token]} />
  }
}