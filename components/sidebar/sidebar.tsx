"use client"

import type { SidebarProps } from "./types"
import {
  useSidebarState,
  useKeyboardShortcuts,
  useMobileDetection,
  useBodyScrollLock,
} from "./hooks"
import { SidebarProvider } from "./sidebar-context"
import { MobileSidebar } from "./mobile-sidebar"
import { DesktopSidebar } from "./desktop-sidebar"
import { SearchDialog } from "./search-dialog"
import { SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED } from "./constants"

export function Sidebar({ children, defaultOpen }: SidebarProps) {
  const isMobile = useMobileDetection()
  const { state, actions, refs } = useSidebarState(defaultOpen, isMobile)

  useBodyScrollLock(isMobile, state.isMobileOpen)

  useKeyboardShortcuts({
    toggleSidebar: actions.toggleSidebar,
    toggleMobileSidebar: actions.toggleMobileSidebar,
    toggleSearch: actions.toggleSearch,
    isMobile,
  })

  const contextValue = {
    ...state,
    ...actions,
    ...refs,
    isMobile,
  }

  const contentMargin = isMobile ? 0 : state.isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED

  return (
    <SidebarProvider value={contextValue}>
      <div className="flex min-h-screen">
        <DesktopSidebar className="hidden md:flex " />
        <MobileSidebar className="flex md:hidden" />

        <div
          className="min-w-0 flex-1"
          style={{ marginLeft: contentMargin }}
        >
          <div className="@container/content md:px-6 px-1">{children}</div>
        </div>

        <SearchDialog
          isOpen={state.isSearchOpen}
          onClose={() => actions.setIsSearchOpen(false)}
          onNavigate={actions.handleNavigation}
        />
      </div>
    </SidebarProvider>
  )
}
