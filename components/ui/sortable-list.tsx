"use client"

import { type ReactNode, useState } from "react"
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
  type DragStartEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart(event: DragStartEvent) {
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

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  }

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
            isDragging={activeId === getItemId(item)}
          >
            {children(item, index)}
          </SortableItem>
        ))}
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeItem && activeIndex !== -1 ? (
          <div className="cursor-grabbing">
            <div className="transform scale-105 shadow-2xl ring-2 ring-teal-500/50 rounded-lg">
              {children(activeItem, activeIndex)}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

interface SortableItemProps {
  id: string
  children: ReactNode
  showDragHandle?: boolean
  isDragging?: boolean
}

export function SortableItem({
  id,
  children,
  showDragHandle = true,
  isDragging = false,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <div className={cn(
        "flex items-center gap-2",
        showDragHandle && "pr-12"
      )}>
        <div className="flex-1">
          {children}
        </div>
        {showDragHandle && (
          <button
            type="button"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "p-2 rounded-lg cursor-grab active:cursor-grabbing",
              "transition-all duration-200 ease-out",
              "opacity-0 group-hover:opacity-100",
              "hover:bg-teal-500/10 hover:scale-110",
              "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50",
              isDragging && "opacity-100 scale-110 bg-teal-500/20"
            )}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-teal-600" />
          </button>
        )}
      </div>
    </div>
  )
}
