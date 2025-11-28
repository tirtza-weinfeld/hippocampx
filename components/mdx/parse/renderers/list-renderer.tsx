"use client"

import type { ListToken, ListItemToken } from '../types'
import { OrderedList } from '@/components/mdx/list/ordered-list'
import { UnorderedList } from '@/components/mdx/list/unordered-list'
import ListItem from '@/components/mdx/list/list-item'
import CollapsibleListItem from '@/components/mdx/list/collapsible-list-item'
import { InlineRenderer } from './inline-renderer'

interface ListRendererProps {
  token: ListToken
}

export function ListRenderer({ token }: ListRendererProps) {
  const ListComponent = token.ordered ? OrderedList : UnorderedList

  return (
    <ListComponent>
      {token.items.map((item, index) => (
        <ListItemRenderer key={index} token={item} />
      ))}
    </ListComponent>
  )
}

interface ListItemRendererProps {
  token: ListItemToken
}

export function ListItemRenderer({ token }: ListItemRendererProps) {
  // Render collapsible list item if isCollapsible is true
  if (token.isCollapsible && token.collapsibleTitle) {
    return (
      <CollapsibleListItem
        level={token.level}
        displayNumber={token.displayNumber}
        headerItem={token.headerItem}
        marker={token.marker}
        title={token.collapsibleTitle}
      >
        <InlineRenderer tokens={token.children} />
      </CollapsibleListItem>
    )
  }

  // Render regular list item
  return (
    <ListItem
      level={token.level}
      displayNumber={token.displayNumber}
      headerItem={token.headerItem}
      marker={token.marker}
    >
      <InlineRenderer tokens={token.children} />
    </ListItem>
  )
}