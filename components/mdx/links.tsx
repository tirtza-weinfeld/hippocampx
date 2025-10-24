"use client"

import { motion } from "motion/react"
import type { ReactNode, ComponentPropsWithoutRef } from "react"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Route } from "next"



interface LinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  href?: string
  children: ReactNode
  showPreview?: boolean
}

export const CustomLink = ({ href, children, className, onClick, ...rest }: LinkProps) => {
  const isExternal = href?.startsWith("http")

  return (
    <Link
      href={href as Route|| ""}
      className={cn("inline-flex items-center gap-1 relative group", className)}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={onClick}
      {...rest}
    >
      <motion.span className={cn("relative text-link-gradient")}>
        {children}
        <span className="whitespace-nowrap">
          {isExternal ? (
            <span className={cn(
              "link-marker group-hover:-translate-y-1 transition-transform duration-300",
              "text-teal-600 group-hover:text-teal-700 dark:text-teal-700 dark:group-hover:text-teal-400 ml-1 inline-block"
            )}>
              <ExternalLink className="w-4 h-4" />
            </span>
          ) : (
            <span className={cn(
              "link-marker group-hover:-translate-y-1 transition-transform duration-300 ml-1 inline-block",
              "text-teal-400 dark:text-teal-600",
              "[h1_&]:hidden [h2_&]:hidden [h3_&]:hidden [h4_&]:hidden [h5_&]:hidden [h6_&]:hidden"
            )}>
              <ArrowUpRight className="w-4 h-4" />
            </span>
          )}
        </span>
        <span className={cn(
          "absolute bottom-0 left-0 w-full h-0.5",
          "transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-link-gradient"
        )} />
      </motion.span>
    </Link>
  )
}

// Export as Link to maintain existing API
export { CustomLink as Link }