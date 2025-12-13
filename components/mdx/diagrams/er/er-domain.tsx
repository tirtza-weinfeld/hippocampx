"use client"

import type { DomainLayout } from './types'

interface ERDomainProps {
  layout: DomainLayout
}

export function ERDomain({ layout }: ERDomainProps) {
  const { domain, bounds, colorIndex } = layout
  const colorIdx = colorIndex % 6

  if (bounds.width === 0 || bounds.height === 0) {
    return null
  }

  return (
    <g>
      <rect
        data-er-domain={colorIdx}
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={bounds.height}
        rx={12}
        ry={12}
      />
      <text
        className={`er-domain-label-${colorIdx} pointer-events-auto cursor-pointer hover:opacity-70 active:opacity-50`}
        x={bounds.x + 12}
        y={bounds.y + 20}
        fontSize={14}
        fontWeight={600}
        onClick={(e) => {
          console.log('copied domain name', domain.name)

          e.stopPropagation()
          void navigator.clipboard.writeText(domain.name)
        }}
      >
        {domain.name}
      </text>
    </g>
  )
}
