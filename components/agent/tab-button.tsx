"use client"

type Section = 'definition' | 'codeSnippet' | 'intuition' | 'timeComplexity' | 'keyExpressions'

type TabButtonProps = {
  section: Section
}

export function TabButton({ section }: TabButtonProps) {
  // TODO: Get active section from Card state
  const active = false

  const handleClick = () => {
    // TODO: Update Card state
  }

  return (
    <button
      onClick={handleClick}
      aria-current={active}
    >
      {section}
    </button>
  )
}
