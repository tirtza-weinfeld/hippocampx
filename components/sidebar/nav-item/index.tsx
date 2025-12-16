"use client"

import { useRef, useEffect } from "react"
import type { NavItemProps } from "../types"
import { NavItemMobileWithChildren, NavItemMobileSimple } from "./nav-item-mobile"
import { NavItemCollapsedWithChildren, NavItemCollapsedSimple } from "./nav-item-collapsed"
import { NavItemExpanded } from "./nav-item-expanded"

export function NavItem({
  item,
  isExpanded,
  pathname,
  onNavigate,
  isOpen,
  onOpenChange,
  registerRef,
  isMobile,
}: NavItemProps) {
  const itemRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (itemRef.current) {
      registerRef(item.href, itemRef.current)
    }
    return () => {
      registerRef(item.href, null)
    }
  }, [item.href, registerRef])

  // Mobile with children
  if (isMobile && item.children) {
    return (
      <li ref={itemRef} className="relative">
        <NavItemMobileWithChildren
          item={item}
          pathname={pathname}
          onNavigate={onNavigate}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          registerRef={registerRef}
        />
      </li>
    )
  }

  // Mobile without children
  if (isMobile && !item.children) {
    return (
      <li ref={itemRef} className="relative">
        <NavItemMobileSimple
          item={item}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </li>
    )
  }

  // Collapsed with children
  if (!isExpanded && item.children) {
    return (
      <li ref={itemRef} className="relative group">
        <NavItemCollapsedWithChildren
          item={item}
          pathname={pathname}
          registerRef={registerRef}
        />
      </li>
    )
  }

  // Collapsed without children
  if (!isExpanded && !item.children) {
    return (
      <li ref={itemRef} className="relative group">
        <NavItemCollapsedSimple
          item={item}
          pathname={pathname}
        />
      </li>
    )
  }

  // Expanded (default)
  return (
    <li ref={itemRef} className="group">
      <NavItemExpanded
        item={item}
        pathname={pathname}
        onNavigate={onNavigate}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        registerRef={registerRef}
      />
    </li>
  )
}

NavItem.displayName = "NavItem"
