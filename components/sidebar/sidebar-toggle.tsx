"use client"

import Image from "next/image"
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
        isMobile ? "top-2 left-5" : "top-3.5 left-5",
        isMobile && !isOpen && "bg-primary/10",
        !isMobile && !isOpen && "left-4.5",
      )}
      onClick={onClick}
      aria-label={isMobile ? (isOpen ? "Close menu" : "Open menu") : (isOpen ? "Collapse sidebar" : "Expand sidebar")}
      aria-expanded={isOpen}
      aria-controls={isMobile ? "mobile-sidebar" : "desktop-sidebar"}
    >
      <Image
        src={`/hippo/hippo.png`}
        alt="Menu"
        width={36}
        height={36}
        className={cn(
          "size-9 object-contain drop-shadow-sm",
          "mask-radial-from-80% mask-radial-at-center",
          "dark:mask-radial-from-70%",
          isOpen && "rotate-20"
        )}
      />
    
        
    </button>
  )
}
