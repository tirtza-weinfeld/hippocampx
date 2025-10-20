"use client"

type HeaderButtonProps = {
  expanded?: boolean
  onToggle?: () => void
}

export function HeaderButton({ expanded, onToggle }: HeaderButtonProps) {
  return (
    <button onClick={onToggle}>
      {expanded ? 'Collapse' : 'Expand'}
    </button>
  )
}
