"use client"

import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"

type SidebarToggleProps = {
  readonly isOpen: boolean
  readonly onClick: () => void
  readonly isMobile?: boolean
}

export function SidebarToggle({ isOpen, onClick, isMobile = false }: SidebarToggleProps) {
  return (
    <button
      className={cn(
        "fixed z-60 flex items-center justify-center size-10 rounded-lg",
        "hover:bg-primary/10 active:scale-95",
        "transition-all duration-200",
        "outline-none",
        isMobile ? "top-2 left-5" : "top-3.5 left-5"
      )}
      onClick={onClick}
      aria-label={isMobile ? (isOpen ? "Close menu" : "Open menu") : (isOpen ? "Collapse sidebar" : "Expand sidebar")}
      aria-expanded={isOpen}
      aria-controls={isMobile ? "mobile-sidebar" : "desktop-sidebar"}
    >
      <PanelLeft
        className="size-6  text-primary transition-transform duration-200"
        
        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
      />
    </button>
  )
}
