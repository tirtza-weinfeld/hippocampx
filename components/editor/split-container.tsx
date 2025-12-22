'use client'

import React from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { EditorTabBar } from './editor-tab-bar'
import { CodePanel } from './code-panel'
import type { EditorGroup, CodeFile, EditorActions } from './types'

interface SplitContainerProps {
  groups: EditorGroup[]
  direction: 'horizontal' | 'vertical'
  files: Map<string, CodeFile>
  actions: EditorActions
  activeGroupId: string
  showLineNumbers: boolean
  fontSize: number
  theme: 'light' | 'dark' | 'auto'
}

export function SplitContainer({
  groups,
  direction,
  files,
  actions,
  activeGroupId,
  showLineNumbers,
  fontSize,
}: SplitContainerProps) {
  if (groups.length === 1) {
    const group = groups[0]
    const activeTab = group.tabs.find(t => t.id === group.activeTabId)
    const activeFile = activeTab ? files.get(activeTab.fileId) : null

    return (
      <div className="flex flex-col h-full">
        <EditorTabBar 
          group={group}
          files={files}
          actions={actions}
          isActive={group.id === activeGroupId}
          totalGroups={groups.length}
        />
        <div className="flex-1 min-h-0">
          <CodePanel
            file={activeFile}
            showLineNumbers={showLineNumbers}
            fontSize={fontSize}
          />
        </div>
      </div>
    )
  }

  return (
    <ResizablePanelGroup
      orientation={direction}
      className="h-full"
    >
      {groups.map((group, index) => (
        <React.Fragment key={group.id}>
          <ResizablePanel defaultSize={100 / groups.length}>
            <div className="flex flex-col h-full">
              <EditorTabBar 
                group={group}
                files={files}
                actions={actions}
                isActive={group.id === activeGroupId}
                totalGroups={groups.length}
              />
              <div className="flex-1 min-h-0">
                <CodePanel
                  file={group.activeTabId ? files.get(
                    group.tabs.find(t => t.id === group.activeTabId)?.fileId || ''
                  ) : null}
                  showLineNumbers={showLineNumbers}
                  fontSize={fontSize}
                />
              </div>
            </div>
          </ResizablePanel>
          {index < groups.length - 1 && (
            <ResizableHandle withHandle />
          )}
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  )
}