"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface OrderedListProps {
  children: ReactNode
  className?: string
}



// Animation variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}




export const OrderedList = ({ 
  children, 
  className = "", 
  ...props
}: OrderedListProps) => {
  return (
    <motion.ol
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "mb-6 ml-0 space-y-3 list-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.ol>
  )
}
