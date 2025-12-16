"use client"

import { use } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { SidebarContext } from "./sidebar-context"
import { navigationItems } from "./constants"
import { SidebarHeader } from "./sidebar-header"
import { SidebarFooter } from "./sidebar-footer"
import { SidebarToggle } from "./sidebar-toggle"
import { NavItem } from "./nav-item"

type MobileSidebarProps = {
  readonly className?: string
}

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const

export function MobileSidebar({ className }: MobileSidebarProps) {
  const ctx = use(SidebarContext)
  if (!ctx) throw new Error("MobileSidebar must be used within SidebarProvider")

  const {
    isMobileOpen,
    pathname,
    expandedItems,
    toggleMobileSidebar,
    setIsSearchOpen,
    setExpandedItems,
    handleNavigation,
    registerNavRef,
  } = ctx

  return (
    <div className={cn("@container", className)}>
      <SidebarToggle isOpen={isMobileOpen} onClick={toggleMobileSidebar} isMobile />

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileSidebar}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        id="mobile-sidebar"
        className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-80 flex-col rounded-r-2xl border-r border-sidebar-border bg-sidebar/98 shadow-2xl backdrop-blur-lg"
        initial={{ x: "-100%" }}
        animate={{ x: isMobileOpen ? 0 : "-100%" }}
        transition={springTransition}
        aria-label="Main navigation"
      >
        <SidebarHeader isExpanded isMobile />

        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem
                key={item.title}
                item={item}
                isExpanded
                pathname={pathname}
                onNavigate={handleNavigation}
                isOpen={expandedItems[item.href] ?? false}
                onOpenChange={(open) => setExpandedItems((prev) => ({ ...prev, [item.href]: open }))}
                registerRef={registerNavRef}
                isMobile
              />
            ))}
          </ul>
        </nav>

        <SidebarFooter isExpanded isMobile onSearchClick={() => setIsSearchOpen(true)} />
      </motion.aside>
    </div>
  )
}
