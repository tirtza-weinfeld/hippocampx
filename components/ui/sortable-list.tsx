"use client"

import { type ReactNode } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortableListProps<T> {
  items: T[]
  onReorder: (items: T[]) => void
  children: (item: T, index: number) => ReactNode
  getItemId: (item: T) => string
  showDragHandle?: boolean
}

export function SortableList<T>({
  items,
  onReorder,
  children,
  getItemId,
  showDragHandle = true,
}: SortableListProps<T>) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag activates
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart(event: DragEndEvent) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => getItemId(item) === active.id)
      const newIndex = items.findIndex((item) => getItemId(item) === over.id)

      const reorderedItems = arrayMove(items, oldIndex, newIndex)
      onReorder(reorderedItems)
    }

    setActiveId(null)
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  const activeItem = activeId
    ? items.find((item) => getItemId(item) === activeId)
    : null
  const activeIndex = activeItem ? items.indexOf(activeItem) : -1

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={items.map(getItemId)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <SortableItem
            key={getItemId(item)}
            id={getItemId(item)}
            showDragHandle={showDragHandle}
          >
            {children(item, index)}
          </SortableItem>
        ))}
      </SortableContext>
      <DragOverlay>
        {activeItem ? (
          <div className="opacity-50">{children(activeItem, activeIndex)}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

interface SortableItemProps {
  id: string
  children: ReactNode
  showDragHandle?: boolean
}

export function SortableItem({ id, children, showDragHandle = true }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-50 z-50 scale-105 shadow-lg"
      )}
    >
      <div className={cn(
        "flex items-center gap-2",
        showDragHandle && "pr-10"
      )}>
        <div className="flex-1">
          {children}
        </div>
        {showDragHandle && (
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded cursor-grab active:cursor-grabbing hover:bg-accent transition-colors"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}
