"use client"

import { createContext, type ReactNode } from "react"
import type { ExpandedItems } from "./types"

type SidebarContextValue = {
  // State
  isExpanded: boolean
  isMobileOpen: boolean
  isSearchOpen: boolean
  expandedItems: ExpandedItems
  pathname: string
  isMobile: boolean
  // Actions
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  toggleSearch: () => void
  setIsSearchOpen: (open: boolean) => void
  setIsMobileOpen: (open: boolean) => void
  setExpandedItems: React.Dispatch<React.SetStateAction<ExpandedItems>>
  handleNavigation: (href: string, parentHref?: string) => void
  // Refs
  registerNavRef: (href: string, el: HTMLElement | null) => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

type SidebarProviderProps = {
  readonly children: ReactNode
  readonly value: SidebarContextValue
}

export function SidebarProvider({ children, value }: SidebarProviderProps) {
  return <SidebarContext value={value}>{children}</SidebarContext>
}
