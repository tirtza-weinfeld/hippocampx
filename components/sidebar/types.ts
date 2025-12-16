import type { ReactNode } from "react"
import type { NavigationItem } from "@/lib/routes"

export type SidebarProps = {
  readonly children: ReactNode
  readonly defaultOpen: boolean
}

export type NavItemProps = {
  readonly item: NavigationItem
  readonly isExpanded: boolean
  readonly pathname: string
  readonly onNavigate: (href: string, parentHref?: string) => void
  readonly isOpen: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly registerRef: (href: string, el: HTMLElement | null) => void
  readonly isMobile: boolean
}

export type ExpandedItems = Record<string, boolean>

export type SidebarState = {
  isExpanded: boolean
  isMobileOpen: boolean
  isSearchOpen: boolean
  expandedItems: ExpandedItems
}

export type SidebarActions = {
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  toggleSearch: () => void
  setIsSearchOpen: (open: boolean) => void
  setIsMobileOpen: (open: boolean) => void
  setExpandedItems: React.Dispatch<React.SetStateAction<ExpandedItems>>
  handleNavigation: (href: string, parentHref?: string) => void
}
