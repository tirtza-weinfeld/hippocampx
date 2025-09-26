"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ListProps {
  children: ReactNode
  className?: string
}


// Modern animation variants optimized for React 19+ performance
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
} as const




export const UnorderedList = ({ children, className = "", ...props }: ListProps & unknown) => {
  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "mb-6 ml-0 space-y-2 list-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.ul>
  )
}
