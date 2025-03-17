"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DraggableItemProps {
  id: string
  children: React.ReactNode
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
  className?: string
  disabled?: boolean
  onClick?: () => void
  isSelected?: boolean
}

export function DraggableItem({
  id,
  children,
  onDragStart,
  onDragEnd,
  className,
  disabled = false,
  onClick,
  isSelected = false,
}: DraggableItemProps) {
  const [isDragging, setIsDragging] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  // Handle HTML5 drag and drop
  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) return

    setIsDragging(true)
    e.dataTransfer.setData("text/plain", id)

    // Add a ghost image
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      const ghostElement = document.createElement("div")
      ghostElement.style.width = `${rect.width}px`
      ghostElement.style.height = `${rect.height}px`
      ghostElement.style.opacity = "0"
      document.body.appendChild(ghostElement)
      e.dataTransfer.setDragImage(ghostElement, 0, 0)

      // Clean up ghost element
      setTimeout(() => {
        document.body.removeChild(ghostElement)
      }, 0)
    }

    if (onDragStart) onDragStart(id)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (onDragEnd) onDragEnd()
  }

  return (
    <motion.div
      ref={itemRef}
      className={cn(
        "draggable-item",
        isDragging && "dragging",
        isSelected && "ring-2 ring-primary scale-105",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      {children}
    </motion.div>
  )
}

interface DropTargetProps {
  id: string
  children: React.ReactNode
  onDrop: (itemId: string) => void
  className?: string
  disabled?: boolean
  isSelected?: boolean
  onClick?: () => void
}

export function DropTarget({
  children,
  onDrop,
  className,
  disabled = false,
  isSelected = false,
  onClick,
}: DropTargetProps) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsOver(false)
    const itemId = e.dataTransfer.getData("text/plain")
    if (itemId) {
      onDrop(itemId)
    }
  }

  return (
    <motion.div
      className={cn(
        "drop-target",
        isOver && "can-drop",
        isSelected && "ring-2 ring-primary bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}

export function useDragAndDrop<T>(items: T[], setItems: React.Dispatch<React.SetStateAction<T[]>>) {
  const [draggedItem, setDraggedItem] = useState<T | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedItem(items[index])
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDraggedIndex(null)
  }

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedItem === null) return

    const newItems = [...items]
    newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItem)

    setItems(newItems)
    setDraggedItem(null)
    setDraggedIndex(null)
  }

  return {
    draggedItem,
    draggedIndex,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  }
}

