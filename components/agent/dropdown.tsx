"use client"

import { useState, useRef, useEffect, useId, useEffectEvent, type ReactNode, type KeyboardEvent } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { Check, Search } from "lucide-react"
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
  tooltipClassName?: string
  searchable?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  label?: string
}

/**
 * Accessible dropdown with keyboard navigation and screen reader support.
 * Renders as portal to avoid clipping.
 */
export function Dropdown({
  trigger,
  children,
  align = "start",
  className,
  centerContainerSelector,
  tooltipContent,
  tooltipSide = "top",
  tooltipClassName,
  searchable,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  label,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const triggerId = useId()
  const menuId = useId()

  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const getItems = () => {
    if (!dropdownRef.current) return []
    return Array.from(dropdownRef.current.querySelectorAll<HTMLDivElement>('[role="menuitem"]'))
  }

  const focusItem = (index: number) => {
    const items = getItems()
    if (index >= 0 && index < items.length) {
      setFocusedIndex(index)
      items[index]?.focus()
    }
  }

  const close = () => {
    setIsOpen(false)
    setFocusedIndex(-1)
    onSearchChange?.("")
    triggerRef.current?.focus()
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          focusItem(0)
        }
        break
      case "ArrowUp":
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          focusItem(getItems().length - 1)
        }
        break
      case "Escape":
        if (isOpen) {
          e.preventDefault()
          close()
        }
        break
    }
  }

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = getItems()
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        focusItem(focusedIndex < items.length - 1 ? focusedIndex + 1 : 0)
        break
      case "ArrowUp":
        e.preventDefault()
        focusItem(focusedIndex > 0 ? focusedIndex - 1 : items.length - 1)
        break
      case "Home":
        e.preventDefault()
        focusItem(0)
        break
      case "End":
        e.preventDefault()
        focusItem(items.length - 1)
        break
      case "Escape":
        e.preventDefault()
        close()
        break
      case "Tab":
        close()
        break
    }
  }

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      focusItem(0)
    } else if (e.key === "Escape") {
      e.preventDefault()
      close()
    }
  }

  // Non-reactive close handler for event listeners
  const onClose = useEffectEvent(() => {
    close()
  })

  // Update position when opening
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current || !dropdownRef.current) return

      let containerRect: DOMRect
      if (align === "center" && centerContainerSelector) {
        const container = triggerRef.current.closest(centerContainerSelector)
        containerRect = container ? container.getBoundingClientRect() : triggerRef.current.getBoundingClientRect()
      } else {
        containerRect = triggerRef.current.getBoundingClientRect()
      }

      const dropdownWidth = dropdownRef.current.offsetWidth || 200
      const dropdownHeight = dropdownRef.current.offsetHeight || 200
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let left: number
      if (align === "end") {
        left = containerRect.right - dropdownWidth
      } else if (align === "center") {
        left = containerRect.left + (containerRect.width - dropdownWidth) / 2
      } else {
        left = containerRect.left
      }

      // Keep within viewport
      left = Math.max(8, Math.min(left, viewportWidth - dropdownWidth - 8))

      // Position above if not enough space below
      const spaceBelow = viewportHeight - containerRect.bottom - 8
      const top = spaceBelow < dropdownHeight && containerRect.top > dropdownHeight
        ? containerRect.top - dropdownHeight - 8
        : containerRect.bottom + 8

      setPosition({ top, left })
    }

    updatePosition()
    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)

    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [isOpen, align, centerContainerSelector])

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchable) {
      requestAnimationFrame(() => searchInputRef.current?.focus())
    }
  }, [isOpen, searchable])

  // Close on outside click/touch and custom events
  useEffect(() => {
    if (!isOpen) return

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        onClose()
      }
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleOutside)
      document.addEventListener("touchstart", handleOutside)
      window.addEventListener("dropdown-item-selected", onClose)
      window.addEventListener("agent-dialog-closing", onClose)
    }, 10)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("touchstart", handleOutside)
      window.removeEventListener("dropdown-item-selected", onClose)
      window.removeEventListener("agent-dialog-closing", onClose)
    }
  }, [isOpen]) // onClose is from useEffectEvent - stable, not needed in deps

  const triggerElement = (
    <button
      ref={triggerRef}
      id={triggerId}
      type="button"
      onClick={handleTriggerClick}
      onKeyDown={handleTriggerKeyDown}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? menuId : undefined}
      aria-label={label}
      className="appearance-none bg-transparent border-none p-0 m-0 cursor-pointer"
    >
      {trigger}
    </button>
  )

  return (
    <div className="relative inline-block">
      {tooltipContent ? (
        <AgentTooltip content={tooltipContent} side={tooltipSide} className={tooltipClassName}>
          {triggerElement}
        </AgentTooltip>
      ) : (
        triggerElement
      )}

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            aria-orientation="vertical"
            onKeyDown={handleMenuKeyDown}
            data-dropdown-portal
            className={cn(
              "fixed z-[9999]",
              "min-w-[200px] rounded-xl",
              "border border-border/50 shadow-2xl ring-1 ring-black/5",
              "bg-popover/95 backdrop-blur-xl",
              "p-2",
              "origin-top",
              "animate-dropdown-open",
              "focus:outline-none",
              className
            )}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {searchable && (
              <div className="relative mb-2">
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  role="searchbox"
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className={cn(
                    "w-full pl-8 pr-3 py-2 text-sm rounded-lg",
                    "bg-muted/50 border border-border/50",
                    "placeholder:text-muted-foreground text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                    "transition-shadow duration-150"
                  )}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
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
  disabled?: boolean
}

export function DropdownItem({ checked, onSelect, children, icon, className, disabled }: DropdownItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    window.dispatchEvent(new CustomEvent("dropdown-item-selected"))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelect()
      window.dispatchEvent(new CustomEvent("dropdown-item-selected"))
    }
  }

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2.5",
        "min-h-[44px] py-2.5 pr-4 pl-9 text-sm font-medium rounded-lg",
        "transition-all duration-150 ease-out",
        "outline-none",
        "focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset",
        "hover:bg-accent/80",
        "active:scale-[0.98]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-2.5 flex size-4 items-center justify-center",
          "transition-all duration-150",
          checked ? "scale-100 opacity-100" : "scale-75 opacity-0"
        )}
      >
        {icon || <Check className="size-4 stroke-[2.5]" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
}
