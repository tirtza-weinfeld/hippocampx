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

    case 'codeBlock':
      return (
        <pre key={key} className="overflow-x-auto rounded-md 
        
        my-4  bg-gray-100 shadow-2xl dark:bg-gray-800
        p-4 text-sm">
          <code className={token.language ? `language-${token.language}` : undefined}>
            {token.content}
          </code>
        </pre>
      )

    default:
      // For non-block tokens, use inline renderer
      return <InlineRenderer key={key} tokens={[token]} />
  }
}