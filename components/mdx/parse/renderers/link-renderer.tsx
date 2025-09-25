"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface LinkRendererProps {
  href?: string
  children: ReactNode
  className?: string
}

export function LinkRenderer({ href, children, className }: LinkRendererProps) {
  const isExternal = href?.startsWith("http")

  // Fallback gradient styles in case CSS custom utilities don't work
  const fallbackTextStyle = {
    background: 'linear-gradient(to right, rgb(15 118 110 / 0.6), rgb(14 165 233 / 0.8) 50%, rgb(20 184 166 / 0.6))',
    backgroundSize: '200% 100%',
    backgroundPosition: '0% 50%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    display: 'inline-block',
    transition: 'background-position 0.3s ease'
  }

  const fallbackUnderlineStyle = {
    background: 'linear-gradient(to right, rgb(15 118 110 / 0.6), rgb(14 165 233 / 0.8) 50%, rgb(20 184 166 / 0.6))',
    backgroundSize: '200% 100%',
    backgroundPosition: '0% 50%'
  }

  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn("inline-flex items-center gap-1 relative group", className)}
    >
      <span
        className={cn("relative text-link-gradient")}
        style={fallbackTextStyle}
        onMouseEnter={(e) => {
          // Manual hover effect for fallback
          if (e.currentTarget.style.backgroundPosition === '0% 50%') {
            e.currentTarget.style.backgroundPosition = '100% 50%'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundPosition = '0% 50%'
        }}
      >
        {children}
        <span
          className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-link-gradient"
          style={fallbackUnderlineStyle}
        />
      </span>

      {isExternal && (
        <span className="group-hover:-translate-y-1 transition-transform duration-300 text-teal-600 group-hover:text-teal-700 dark:text-teal-700 dark:group-hover:text-teal-400">
          <ExternalLink className="w-4 h-4" />
        </span>
      )}

      {!isExternal && (
        <span className={cn(
          "group-hover:-translate-y-1 transition-transform duration-300",
          "text-teal-400 dark:text-teal-600",
          "[h1_&]:hidden [h2_&]:hidden [h3_&]:hidden [h4_&]:hidden [h5_&]:hidden [h6_&]:hidden"
        )}>
          <ArrowUpRight className="w-4 h-4" />
        </span>
      )}
    </motion.a>
  )
}