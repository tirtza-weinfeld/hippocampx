"use client"

import { FileTab } from './agent-file-tab'
import { useProblemState } from './problem-state-context'
import { cn } from '@/lib/utils'
type FileTabsProps = {
  files: string[]
  fileSectionMap: Record<string, string[]>
  className?: string
}

export function FileTabs({ files, fileSectionMap, className }: FileTabsProps) {
  const { activeFile, setActiveFile, activeSection } = useProblemState()

  if (files.length <= 1) return null

  return (
    <div className={cn("overflow-x-auto overflow-y-hidden border-b border-gray-200 dark:border-gray-700", className)}>
      <div className="flex gap-1 px-5 pt-1 min-w-min  ">
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
    </div>
  )
}
