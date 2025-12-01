"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={cn("min-h-[calc(100vh-4rem)]", className)}
    >
      {children}
    </motion.div>
  )
}

