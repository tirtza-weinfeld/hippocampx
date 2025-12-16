"use client"

import { use } from "react"
import { cn } from "@/lib/utils"
import { SidebarContext } from "./sidebar-context"
import { navigationItems, SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED } from "./constants"
import { SidebarHeader } from "./sidebar-header"
import { SidebarFooter } from "./sidebar-footer"
import { SidebarToggle } from "./sidebar-toggle"
import { NavItem } from "./nav-item"

type DesktopSidebarProps = {
  readonly className?: string
}

export function DesktopSidebar({ className }: DesktopSidebarProps) {
  const ctx = use(SidebarContext)
  if (!ctx) throw new Error("DesktopSidebar must be used within SidebarProvider")

  const {
    isExpanded,
    pathname,
    expandedItems,
    toggleSidebar,
    toggleSearch,
    setExpandedItems,
    handleNavigation,
    registerNavRef,
  } = ctx

  return (
    <div className={cn("flex-col", className)}>
      <aside
        id="desktop-sidebar"
        className="fixed inset-y-1 left-1 z-20 flex flex-col rounded-2xl border border-sidebar-border bg-sidebar/95 shadow-lg backdrop-blur-md transition-[width] duration-300 ease-out"
        style={{ width: isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED }}
      >
        <SidebarHeader isExpanded={isExpanded} />

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem
                key={item.title}
                item={item}
                isExpanded={isExpanded}
                pathname={pathname}
                onNavigate={handleNavigation}
                isOpen={expandedItems[item.href] ?? false}
                onOpenChange={(open) => setExpandedItems((prev) => ({ ...prev, [item.href]: open }))}
                registerRef={registerNavRef}
                isMobile={false}
              />
            ))}
          </ul>
        </nav>

        <SidebarFooter isExpanded={isExpanded} onSearchClick={toggleSearch} />
      </aside>

      <SidebarToggle isOpen={isExpanded} onClick={toggleSidebar} />
    </div>
  )
}
