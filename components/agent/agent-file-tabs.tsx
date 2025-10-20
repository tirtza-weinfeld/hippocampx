"use client"

import { FileTab } from './agent-file-tab'
import { useProblemState } from './problem-state-context'

type FileTabsProps = {
  files: string[]
  fileSectionMap: Record<string, string[]>
}

export function FileTabs({ files, fileSectionMap }: FileTabsProps) {
  const { activeFile, setActiveFile, activeSection } = useProblemState()

  if (files.length <= 1) return null

  return (
    <div className="flex gap-2 px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex-wrap">
      {files.map(file => {
        const hasActiveSection = fileSectionMap[file]?.includes(activeSection)

        return (
          <FileTab
            key={file}
            file={file}
            isActive={activeFile === file}
            className={hasActiveSection ? '' : 'opacity-50'}
            onClick={() => setActiveFile(file)}
          />
        )
      })}
    </div>
  )
}
