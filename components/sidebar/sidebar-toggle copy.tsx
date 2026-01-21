"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type SidebarToggleProps = {
  readonly isOpen: boolean
  readonly onClick: () => void
  readonly isMobile?: boolean
}

export function SidebarToggle({ isOpen, onClick, isMobile = false }: SidebarToggleProps) {
  const variant = isOpen ? "hippo-floating-brain" : "hippo"

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
      <Image
        src={`/hippo/light-${variant}.png`}
        alt="Menu"
        width={36}
        height={36}
        className={cn("size-9 object-contain drop-shadow-sm dark:hidden",
          isOpen&& "rotate-10"
          )}
      />
      <Image
        src={`/hippo/dark-${variant}.png`}
        alt="Menu"
        width={36}
        height={36}
        className={cn("size-9 object-contain drop-shadow-sm hidden dark:block "
          ,
          isOpen&& "rotate-10",
          ""


        )
        
        }
      />
    </button>
  )
}
