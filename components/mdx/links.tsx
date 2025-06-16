"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"

interface LinkProps {
  href: string
  children: ReactNode
}



export const Link = ({ href, children }: LinkProps) => {
  const isExternal = href.startsWith("http")

  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.02 }}
      className="inline-flex items-center gap-1 font-semibold relative group"
    >
      <span className="relative font-bold tracking-tight bg-gradient-to-r from-teal-600/70 from-20% to-blue-500/90 to-70%
       via-sky-600/80 via-70% bg-clip-text text-transparent 
       hover:from-teal-600 hover:to-blue-600/90  dark:hover:from-teal-300/90 dark:hover:to-blue-300/90">
        {children}
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-600 to-sky-600 dark:from-teal-400 dark:to-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </span>
      {isExternal && (
        <motion.div initial={{ rotate: 0 }} whileHover={{ rotate: 45 }} transition={{ duration: 0.2 }}>
          <ArrowUpRight className="w-4 h-4" />
        </motion.div>
      )}
    </motion.a>
  )
}


