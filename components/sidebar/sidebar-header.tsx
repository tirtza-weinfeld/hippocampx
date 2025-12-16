"use client"

import { motion, AnimatePresence } from "motion/react"

type SidebarHeaderProps = {
  readonly isExpanded: boolean
  readonly isMobile?: boolean
}

export function SidebarHeader({ isExpanded, isMobile = false }: SidebarHeaderProps) {
  const logo = (
    <span className="text-lg font-semibold bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
      HippoCampX
    </span>
  )

  if (isMobile) {
    return (
      <header className="flex h-14 shrink-0 items-center border-b border-sidebar-border pl-14 pr-4">
        {logo}
      </header>
    )
  }

  return (
    <header className="flex h-14 shrink-0 items-center pl-14 pr-3">
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
          >
            {logo}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
