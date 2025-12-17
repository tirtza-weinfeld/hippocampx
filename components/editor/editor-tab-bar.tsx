'use client'

import React from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { EditorTab } from './editor-tab'
import type { EditorGroup, CodeFile, EditorActions } from './types'

interface EditorTabBarProps {
  group: EditorGroup
  files: Map<string, CodeFile>
  actions: EditorActions
  isActive: boolean
  totalGroups: number
}

export function EditorTabBar({ group, files, actions, isActive, totalGroups }: EditorTabBarProps) {
  // const handleGroupClick = () => {
  //   if (!isActive && group.activeTabId) {
  //     actions.switchTab(group.activeTabId, group.id)
  //   }
  // }
  const moveTab = (dragIndex: number, hoverIndex: number) => {
    const draggedTab = group.tabs[dragIndex]
    if (!draggedTab) return

    actions.moveTab(draggedTab.id, group.id, group.id, hoverIndex)
  }

  const handleNewFile = () => {
    const newFile = {
      id: `file-${Date.now()}`,
      name: 'untitled.txt',
      content: '',
      language: 'plaintext',
      isDirty: false
    }
    actions.openFile(newFile, group.id)
  }

  const handleCloseAllTabs = () => {
    group.tabs.forEach(tab => {
      const file = files.get(tab.fileId)
      if (file) {
        actions.closeFile(file.id, group.id)
      }
    })
  }

  const handleCloseOtherTabs = () => {
    const activeTab = group.tabs.find(tab => tab.id === group.activeTabId)
    if (!activeTab) return

    group.tabs
      .filter(tab => tab.id !== activeTab.id)
      .forEach(tab => {
        const file = files.get(tab.fileId)
        if (file) {
          actions.closeFile(file.id, group.id)
        }
      })
  }

  const handleSplitRight = () => {
    actions.splitEditor('horizontal', group.id, group.activeTabId || undefined)
  }

  const handleSplitDown = () => {
    actions.splitEditor('vertical', group.id, group.activeTabId || undefined)
  }

  const handleCloseSplit = () => {
    actions.closeSplit(group.id)
  }

  return (
    <div className={cn(
      'flex items-center bg-muted/30 border-b border-border min-h-10',
      isActive && 'bg-muted/50'
    )}>
      {/* Tab container with horizontal scroll */}
      <div className="flex-1 flex items-center overflow-x-auto scrollbar-none">
        <div className="flex min-w-0">
          {group.tabs.map((tab, index) => (
            <EditorTab
              key={tab.id}
              tab={tab}
              file={files.get(tab.fileId)}
              groupId={group.id}
              actions={actions}
              index={index}
              onMoveTab={moveTab}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center px-2 gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleNewFile}
          className="w-6 h-6 p-0"
          title="New file"
        >
          <Plus className="w-4 h-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">Tab options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleNewFile}>
              <Plus className="w-4 h-4 mr-2" />
              New File
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleCloseOtherTabs}
              disabled={group.tabs.length <= 1}
            >
              Close Others
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleCloseAllTabs}
              disabled={group.tabs.length === 0}
            >
              Close All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSplitRight}>
              Split Right
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSplitDown}>
              Split Down
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleCloseSplit}
              disabled={totalGroups <= 1}
            >
              Close Split
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}