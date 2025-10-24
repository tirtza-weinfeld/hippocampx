"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { AgentTooltip } from "./agent-tooltip"

type TooltipSide = "top" | "right" | "bottom" | "left"

type DropdownProps = {
  trigger: ReactNode
  children: ReactNode
  align?: "start" | "end" | "center"
  className?: string
  centerContainerSelector?: string
  tooltipContent?: string
  tooltipSide?: TooltipSide
}

/**
 * Dropdown component that renders content as a portal to avoid clipping.
 * Calculates position relative to trigger element.
 */
export function Dropdown({ trigger, children, align = "start", className, centerContainerSelector, tooltipContent, tooltipSide = "top" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  function handleTriggerClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  // Update position when opening
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return

    function updatePosition() {
      if (!triggerRef.current || !dropdownRef.current) return

      let containerRect: DOMRect

      // If centerContainerSelector is provided, use that container for centering
      if (align === "center" && centerContainerSelector) {
        const container = triggerRef.current.closest(centerContainerSelector)
        if (container) {
          containerRect = container.getBoundingClientRect()
        } else {
          containerRect = triggerRef.current.getBoundingClientRect()
        }
      } else {
        containerRect = triggerRef.current.getBoundingClientRect()
      }

      const dropdownWidth = dropdownRef.current.offsetWidth || 200

      let left: number
      if (align === "end") {
        left = containerRect.right
      } else if (align === "center") {
        // Center the dropdown relative to the container
        left = containerRect.left + (containerRect.width - dropdownWidth) / 2
      } else {
        left = containerRect.left
      }

      setPosition({
        top: containerRect.bottom + 8,
        left,
      })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, align, centerContainerSelector])

  // Close dropdown when clicking outside or when item is selected
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    function handleItemSelected() {
      setIsOpen(false)
    }

    function handleDialogClosing() {
      setIsOpen(false)
    }

    // Small delay to prevent immediate close when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('dropdown-item-selected', handleItemSelected)
      window.addEventListener('agent-dialog-closing', handleDialogClosing)
    }, 10)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('dropdown-item-selected', handleItemSelected)
      window.removeEventListener('agent-dialog-closing', handleDialogClosing)
    }
  }, [isOpen])

  const triggerElement = (
    <div onClick={handleTriggerClick}>
      {trigger}
    </div>
  )

  return (
    <div ref={triggerRef} className="relative inline-block">
      {tooltipContent ? (
        <AgentTooltip content={tooltipContent} side={tooltipSide}>
          {triggerElement}
        </AgentTooltip>
      ) : (
        triggerElement
      )}

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            data-dropdown-portal
            className={cn(
              "fixed z-[9999]",
              "min-w-[200px] rounded-xl",
              "border border-border/50 shadow-2xl ring-1 ring-black/5",
              "bg-popover/95 backdrop-blur-xl",
              "p-2",
              "origin-top",
              "animate-dropdown-open",
              className
            )}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  )
}

type DropdownItemProps = {
  checked?: boolean
  onSelect: () => void
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export function DropdownItem({ checked, onSelect, children, icon, className }: DropdownItemProps) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onSelect()

    // Close dropdown after selection by dispatching a custom event
    window.dispatchEvent(new CustomEvent('dropdown-item-selected'))
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2.5",
        "py-2.5 pr-4 pl-9 text-sm font-medium rounded-lg",
        "transition-all duration-200 ease-out",
        "hover:shadow-sm hover:scale-[1.02]",
        "active:scale-[0.98]",
        className
      )}
    >
      <span className={cn(
        "absolute left-2.5 flex size-4 items-center justify-center",
        "transition-all duration-200",
        checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
      )}>
        {icon || <Check className="size-4 stroke-[2.5]" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
}
