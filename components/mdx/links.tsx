"use client"

import { motion } from "framer-motion"
import type { ComponentPropsWithoutRef } from "react"
import { ArrowUpRight } from "lucide-react"



export const Link = ({ href, children }: ComponentPropsWithoutRef<"a">) => {

  const isExternal = href?.startsWith("http")
  const gradient = ` bg-gradient-to-r from-teal-700/60 to-teal-600/60 via-sky-600/80 
      group-hover:bg-gradient-to-l
     dark:from-teal-400/80 dark:to-teal-600/80 dark:via-sky-600/80 
     `
      

  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      // whileHover={{ scale: 1.02 }}
      className="inline-flex items-center gap-1 relative group  "
    >
      <span className={`relative ${gradient} bg-clip-text text-transparent`}>
        {children}
        <span className="absolute bottom-0 left-0 w-full h-0.5 
        transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left
         bg-gradient-to-r from-teal-600/60 to-teal-700/60 via-sky-600/80 
        group-hover:bg-gradient-to-l 
        " />
      </span>
      {isExternal && (
        <span>
          <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
        </span>
      )}
    </motion.a>
  )
}