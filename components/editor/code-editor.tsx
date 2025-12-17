'use client'

import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { cn } from '@/lib/utils'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { EditorTabBar } from './editor-tab-bar'
import { CodePanel } from './code-panel'
import type { 
  CodeFile, 
  EditorGroup, 
  EditorState
} from './types'

export interface CodeEditorProps {
  initialFiles?: CodeFile[]
  className?: string
  height?: string | number
  theme?: 'light' | 'dark' | 'auto'
  showLineNumbers?: boolean
  fontSize?: number
}

export function CodeEditor({ 
  initialFiles = [],
  className,
  height = '600px',
  showLineNumbers = true,
  fontSize = 14
}: CodeEditorProps) {
  const [editorState, setEditorState] = useState<EditorState>(() => {
    const files = new Map<string, CodeFile>()
    const tabs = initialFiles.map((file, index) => ({
      id: `tab-${file.id}`,
      fileId: file.id,
      isActive: index === 0,
      isPinned: false
    }))
    
    initialFiles.forEach(file => files.set(file.id, file))
    
    return {
      files,
      splitConfig: {
        direction: 'horizontal',
        groups: [{
          id: 'group-1',
          tabs,
          activeTabId: tabs[0]?.id || null
        }]
      },
      activeGroupId: 'group-1'
    }
  })

  const openFile = (file: CodeFile, targetGroupId?: string) => {
    setEditorState(prev => {
      const newFiles = new Map(prev.files)
      newFiles.set(file.id, file)

      const groupId = targetGroupId || prev.activeGroupId
      const targetGroup = prev.splitConfig.groups.find(g => g.id === groupId)
      if (!targetGroup) return prev

      const existingTab = targetGroup.tabs.find(t => t.fileId === file.id)
      if (existingTab) {
        return {
          ...prev,
          files: newFiles,
          activeGroupId: groupId,
          splitConfig: {
            ...prev.splitConfig,
            groups: prev.splitConfig.groups.map(g =>
              g.id === groupId
                ? {
                    ...g,
                    activeTabId: existingTab.id,
                    tabs: g.tabs.map(t => ({ ...t, isActive: t.id === existingTab.id }))
                  }
                : {
                    ...g,
                    tabs: g.tabs.map(t => ({ ...t, isActive: false }))
                  }
            )
          }
        }
      }

      const newTab = {
        id: `tab-${Date.now()}`,
        fileId: file.id,
        isActive: true,
        isPinned: false
      }

      return {
        ...prev,
        files: newFiles,
        activeGroupId: groupId,
        splitConfig: {
          ...prev.splitConfig,
          groups: prev.splitConfig.groups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  activeTabId: newTab.id,
                  tabs: [...g.tabs.map(t => ({ ...t, isActive: false })), newTab]
                }
              : {
                  ...g,
                  tabs: g.tabs.map(t => ({ ...t, isActive: false }))
                }
          )
        }
      }
    })
  }

  const closeFile = (fileId: string, groupId?: string) => {
    setEditorState(prev => {
      const targetGroupId = groupId || prev.activeGroupId
      const group = prev.splitConfig.groups.find(g => g.id === targetGroupId)
      if (!group) return prev

      const tabIndex = group.tabs.findIndex(t => t.fileId === fileId)
      if (tabIndex === -1) return prev

      const newTabs = group.tabs.filter(t => t.fileId !== fileId)
      let newActiveTabId = group.activeTabId

      if (group.activeTabId === group.tabs[tabIndex].id && newTabs.length > 0) {
        newActiveTabId = newTabs[Math.min(tabIndex, newTabs.length - 1)].id
      } else if (newTabs.length === 0) {
        newActiveTabId = null
      }

      return {
        ...prev,
        splitConfig: {
          ...prev.splitConfig,
          groups: prev.splitConfig.groups.map(g =>
            g.id === targetGroupId
              ? { ...g, tabs: newTabs, activeTabId: newActiveTabId }
              : g
          )
        }
      }
    })
  }

  const switchTab = (tabId: string, groupId: string) => {
    setEditorState(prev => ({
      ...prev,
      activeGroupId: groupId,
      splitConfig: {
        ...prev.splitConfig,
        groups: prev.splitConfig.groups.map(g =>
          g.id === groupId
            ? {
                ...g,
                activeTabId: tabId,
                tabs: g.tabs.map(t => ({ ...t, isActive: t.id === tabId }))
              }
            : {
                ...g,
                tabs: g.tabs.map(t => ({ ...t, isActive: false }))
              }
        )
      }
    }))
  }

  const moveTab = (tabId: string, fromGroupId: string, toGroupId: string, toIndex: number) => {
    setEditorState(prev => {
      const fromGroup = prev.splitConfig.groups.find(g => g.id === fromGroupId)
      const toGroup = prev.splitConfig.groups.find(g => g.id === toGroupId)

      if (!fromGroup || !toGroup) return prev

      const tab = fromGroup.tabs.find(t => t.id === tabId)
      if (!tab) return prev

      const newFromTabs = fromGroup.tabs.filter(t => t.id !== tabId)
      const newToTabs = [...toGroup.tabs]
      newToTabs.splice(toIndex, 0, tab)

      return {
        ...prev,
        splitConfig: {
          ...prev.splitConfig,
          groups: prev.splitConfig.groups.map(g => {
            if (g.id === fromGroupId) {
              return { ...g, tabs: newFromTabs }
            }
            if (g.id === toGroupId) {
              return { ...g, tabs: newToTabs }
            }
            return g
          })
        }
      }
    })
  }

  const closeSplit = (groupId: string) => {
    setEditorState(prev => {
      // Don't allow closing if only one group remains
      if (prev.splitConfig.groups.length <= 1) return prev

      const groupToClose = prev.splitConfig.groups.find(g => g.id === groupId)
      if (!groupToClose) return prev

      // If closing the active group, switch to another group
      let newActiveGroupId = prev.activeGroupId
      if (prev.activeGroupId === groupId) {
        const remainingGroups = prev.splitConfig.groups.filter(g => g.id !== groupId)
        newActiveGroupId = remainingGroups[0]?.id || prev.activeGroupId
      }

      return {
        ...prev,
        activeGroupId: newActiveGroupId,
        splitConfig: {
          ...prev.splitConfig,
          groups: prev.splitConfig.groups.filter(g => g.id !== groupId)
        }
      }
    })
  }

  const splitEditor = (direction: 'horizontal' | 'vertical', groupId: string, tabId?: string) => {
    setEditorState(prev => {
      const sourceGroup = prev.splitConfig.groups.find(g => g.id === groupId)
      if (!sourceGroup) return prev

      // Get the tab to split (either specified tab or active tab)
      const tabToSplit = tabId
        ? sourceGroup.tabs.find(t => t.id === tabId)
        : sourceGroup.tabs.find(t => t.id === sourceGroup.activeTabId)

      if (!tabToSplit) return prev

      // Create new group with a DUPLICATE of the tab (same file, new tab ID)
      const newGroupId = `group-${Date.now()}`
      const duplicatedTab = {
        id: `tab-${Date.now()}`,
        fileId: tabToSplit.fileId, // Same file!
        isActive: true,
        isPinned: tabToSplit.isPinned
      }

      const newGroup: EditorGroup = {
        id: newGroupId,
        tabs: [duplicatedTab],
        activeTabId: duplicatedTab.id
      }

      // Find where to insert the new group
      const sourceIndex = prev.splitConfig.groups.findIndex(g => g.id === groupId)
      const newGroups = [...prev.splitConfig.groups]

      // INSERT new group right after the source group (don't modify source group at all)
      newGroups.splice(sourceIndex + 1, 0, newGroup)

      // Keep the same overall direction, or set it if this is the first split
      const newDirection = prev.splitConfig.groups.length === 1 ? direction : prev.splitConfig.direction

      return {
        ...prev,
        activeGroupId: newGroupId,
        splitConfig: {
          direction: newDirection,
          groups: newGroups
        }
      }
    })
  }

  const updateFileContent = (fileId: string, content: string) => {
    setEditorState(prev => {
      const newFiles = new Map(prev.files)
      const file = newFiles.get(fileId)
      if (file) {
        newFiles.set(fileId, { ...file, content, isDirty: true })
      }
      return { ...prev, files: newFiles }
    })
  }

  const actions = {
    openFile,
    closeFile,
    switchTab,
    moveTab,
    splitEditor,
    closeSplit,
    updateFileContent
  }

  const activeGroup = editorState.splitConfig.groups.find(g => g.id === editorState.activeGroupId)
  const activeTab = activeGroup?.tabs.find(t => t.id === activeGroup.activeTabId)
  const activeFile = activeTab ? editorState.files.get(activeTab.fileId) : null

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        className={cn(
          'flex flex-col bg-background border border-border rounded-lg overflow-hidden',
          'shadow-sm',
          className
        )}
        style={{ height }}
      >
        {editorState.splitConfig.groups.length === 1 ? (
          <div className="flex flex-col h-full">
            <EditorTabBar 
              group={editorState.splitConfig.groups[0]}
              files={editorState.files}
              actions={actions}
              isActive={true}
              totalGroups={editorState.splitConfig.groups.length}
            />
            <div className="flex-1 min-h-0">
              <CodePanel
                file={activeFile}
                showLineNumbers={showLineNumbers}
                fontSize={fontSize}
              />
            </div>
          </div>
        ) : (
          <ResizablePanelGroup 
            direction={editorState.splitConfig.direction}
            className="h-full"
          >
            {editorState.splitConfig.groups.map((group, index) => (
              <React.Fragment key={group.id}>
                <ResizablePanel defaultSize={100 / editorState.splitConfig.groups.length}>
                  <div className="flex flex-col h-full">
                    <EditorTabBar 
                      group={group}
                      files={editorState.files}
                      actions={actions}
                      isActive={group.id === editorState.activeGroupId}
                      totalGroups={editorState.splitConfig.groups.length}
                    />
                    <div className="flex-1 min-h-0">
                      <CodePanel
                        file={group.activeTabId ? editorState.files.get(
                          group.tabs.find(t => t.id === group.activeTabId)?.fileId || ''
                        ) : null}
                        showLineNumbers={showLineNumbers}
                        fontSize={fontSize}
                      />
                    </div>
                  </div>
                </ResizablePanel>
                {index < editorState.splitConfig.groups.length - 1 && (
                  <ResizableHandle withHandle />
                )}
              </React.Fragment>
            ))}
          </ResizablePanelGroup>
        )}
      </div>
    </DndProvider>
  )
}