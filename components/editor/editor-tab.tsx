'use client'

import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { X, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuSeparator,
  ContextMenuTrigger 
} from '@/components/ui/context-menu'
import type { EditorTab as EditorTabType, CodeFile, EditorActions } from './types'

interface FileIconProps {
  fileName: string
  className?: string
}

function FileIcon({ fileName, className }: FileIconProps) {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  const getIconColor = () => {
    switch (extension) {
      case 'ts':
      case 'tsx':
        return 'text-blue-500'
      case 'js':
      case 'jsx':
        return 'text-yellow-500'
      case 'py':
        return 'text-green-500'
      case 'json':
        return 'text-orange-500'
      case 'md':
        return 'text-gray-600 dark:text-gray-400'
      case 'css':
        return 'text-pink-500'
      case 'html':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <Circle 
      className={cn('w-3 h-3 fill-current', getIconColor(), className)} 
    />
  )
}

interface EditorTabProps {
  tab: EditorTabType
  file: CodeFile | undefined
  groupId: string
  actions: EditorActions
  index: number
  onMoveTab: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  type: string
  id: string
  index: number
  groupId: string
}

export function EditorTab({ 
  tab, 
  file, 
  groupId, 
  actions, 
  index,
  onMoveTab 
}: EditorTabProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'tab',
    item: (): DragItem => ({
      type: 'tab',
      id: tab.id,
      index,
      groupId
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: 'tab',
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item, monitor) => {
      if (!ref.current) return
      
      // Only allow reordering within the same group for now
      if (item.groupId !== groupId) return
      
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      const clientOffset = monitor.getClientOffset()
      
      if (!clientOffset) return
      
      const hoverClientX = clientOffset.x - hoverBoundingRect.left

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return

      onMoveTab(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  if (!file) return null

  const handleClick = () => {
    actions.switchTab(tab.id, groupId)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    actions.closeFile(file.id, groupId)
  }

  const handleSplitRight = () => {
    actions.splitEditor('horizontal', groupId, tab.id)
  }

  const handleSplitDown = () => {
    actions.splitEditor('vertical', groupId, tab.id)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={ref}
          data-handler-id={handlerId}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer',
            'border-r border-border last:border-r-0',
            'transition-colors duration-150',
            'hover:bg-muted/50',
            'group relative',
            tab.isActive
              ? 'bg-background text-foreground border-b-2 border-b-primary'
              : 'bg-muted/20 text-muted-foreground hover:text-foreground',
            isDragging && 'opacity-50'
          )}
          onClick={handleClick}
          role="tab"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
          }}
        >
      <FileIcon fileName={file.name} />
      
      <span className="truncate max-w-32 font-medium">
        {file.name}
      </span>
      
      {file.isDirty && (
        <Circle className="w-1.5 h-1.5 fill-primary text-primary" />
      )}
      
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          'w-4 h-4 p-0 rounded-sm ml-1',
          'opacity-0 group-hover:opacity-100',
          'hover:bg-destructive hover:text-destructive-foreground',
          'transition-opacity duration-150',
          tab.isActive && 'opacity-100'
        )}
        onClick={handleClose}
      >
        <X className="w-3 h-3" />
        <span className="sr-only">Close {file.name}</span>
      </Button>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleClose}>
          Close
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleSplitRight}>
          Split Right
        </ContextMenuItem>
        <ContextMenuItem onClick={handleSplitDown}>
          Split Down
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}