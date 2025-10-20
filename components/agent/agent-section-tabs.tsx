"use client"

import { SectionTab } from './agent-section-tab'
import { useProblemState } from './problem-state-context'
import { useMemo } from 'react'

type SectionTabsProps = {
  fileSectionMap: Record<string, string[]>
}

export function SectionTabs({ fileSectionMap }: SectionTabsProps) {
  const { activeSection, setActiveSection, activeFile } = useProblemState()

  // Derive unique sections from fileSectionMap
  const allSections = useMemo(() => {
    const sectionsSet = new Set<string>()
    Object.values(fileSectionMap).forEach(sections => {
      sections.forEach(section => sectionsSet.add(section))
    })
    return Array.from(sectionsSet)
  }, [fileSectionMap])

  return (
    <div className="flex gap-2 px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex-wrap">
      {allSections.map(section => {
        const hasInActiveFile = fileSectionMap[activeFile]?.includes(section)

        return (
          <SectionTab
            key={section}
            section={section}
            isActive={activeSection === section}
            className={hasInActiveFile ? '' : 'opacity-50'}
            onClick={() => setActiveSection(section)}
          />
        )
      })}
    </div>
  )
}
