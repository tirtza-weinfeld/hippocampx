"use client"

import React from "react"
import { motion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { CustomHeaders } from "./custom/headers"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },

}

interface TypographyProps {
  children: ReactNode
  className?: string
  [key: string]: unknown
}

const withCustomComponent = (WrappedComponent: React.ComponentType<TypographyProps>, headerTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
  function ComponentWithCustomHeader({ children, className, ...props }: TypographyProps) {
    const componentName = props['component'] as string | undefined

    // if (componentName && 'ProblemTimeComplexityHeader' === componentName) {
    if (false) {
      const CustomComponent = CustomHeaders[componentName as keyof typeof CustomHeaders]

      if (CustomComponent) {
        const headerClassName = cn(
          className,
          headerTag === 'h1' && 'text-3xl md:text-4xl',
          headerTag === 'h2' && 'text-2xl md:text-3xl',
          headerTag === 'h3' && 'text-xl md:text-2xl',
          headerTag === 'h4' && 'text-lg md:text-xl',
          headerTag === 'h5' && 'text-lg md:text-xl',
          headerTag === 'h6' && 'text-base md:text-lg'
        )

        if (headerTag === 'h1') {
          return <CustomComponent><h1 className={headerClassName} {...props}>{children}</h1></CustomComponent>
        }
        if (headerTag === 'h2') {
          return <CustomComponent><h2 className={headerClassName} {...props}>{children}</h2></CustomComponent>
        }
        if (headerTag === 'h3') {
          return <CustomComponent><h3 className={headerClassName} {...props}>{children}</h3></CustomComponent>
        }
        if (headerTag === 'h4') {
          return <CustomComponent><h4 className={headerClassName} {...props}>{children}</h4></CustomComponent>
        }
        if (headerTag === 'h5') {
          return <CustomComponent><h5 className={headerClassName} {...props}>{children}</h5></CustomComponent>
        }
        if (headerTag === 'h6') {
          return <CustomComponent><h6 className={headerClassName} {...props}>{children}</h6></CustomComponent>
        }
      }
    }

    return <WrappedComponent className={className} {...props}>{children}</WrappedComponent>
  }

  ComponentWithCustomHeader.displayName = `withCustomComponent(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return ComponentWithCustomHeader
}



const H1Base = ({ children, className, ...props }: TypographyProps) => {
  return (
    <motion.div {...fadeInUp} className="relative mb-12 mt-16 first:mt-2 group">
      <h1 className={cn("text-4xl md:text-5xl font-extrabold text-center tracking-tight leading-tight", "text-teal-600 dark:text-teal-700", className)} {...props}>
        <span className={cn("text-teal-600 dark:text-teal-700")}>
          {children}
        </span>
      </h1>
    </motion.div>
  )
}
export const H1 = withCustomComponent(H1Base, 'h1')

const H2Base = ({ children, className, ...props }: TypographyProps) => {
  return (
    // <motion.div {...fadeInUp} className="relative mb-8 first:mt-12">
    <motion.div {...fadeInUp} className="relative mb-8 mt-12">
      <div className="absolute -left-3 top-0 w-1 h-full bg-link-gradient  rounded-full" />
      <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight leading-tight", "text-teal-500 dark:text-teal-800", className)} {...props}>
        <span className={cn("text-teal-500 dark:text-teal-800")}>
          {children}
        </span>
      </h2>
    </motion.div>
  )
}
export const H2 = withCustomComponent(H2Base, 'h2')

const H3Base = ({ children, className, ...props }: TypographyProps) => {

  return (
    <motion.div {...fadeInUp} className="relative mb-6 mt-10">

      <h3 className={cn(" text-2xl md:text-3xl font-bold tracking-tight  leading-tight", "text-gray-800 dark:text-gray-200", className)} {...props}>
        {children}
      </h3>
    </motion.div>
  )
}
export const H3 = withCustomComponent(H3Base, 'h3')

const H4Base = ({ children, className, ...props }: TypographyProps) => {
  return (
    <motion.div {...fadeInUp} className="relative mb-4 mt-8">
      <div className="flex items-center gap-2">
        <h4 className={cn("text-lg md:text-xl lg:text-2xl font-extrabold tracking-tight", "text-gray-800 dark:text-gray-200", className)} {...props}>
          {children}
        </h4>
      </div>
    </motion.div>
  )
}
export const H4 = withCustomComponent(H4Base, 'h4')

const H5Base = ({ children, className, ...props }: TypographyProps) => {
  return (
    <motion.h5
      {...fadeInUp}
      className={cn("text-lg md:text-xl font-semibold tracking-tight mb-3 mt-6 border-l-2 border-blue-500 pl-3", "text-gray-800 dark:text-gray-200", className)}
      {...props}
    >
      {children}
    </motion.h5>
  )
}
export const H5 = withCustomComponent(H5Base, 'h5')

const H6Base = ({ children, className, ...props }: TypographyProps) => {
  return (
    <motion.h6
      {...fadeInUp}
      className={cn("text-base md:text-lg lg:text-xl font-semibold tracking-tight mb-2 mt-4 uppercase tracking-wider", "text-blue-600 dark:text-blue-400", className)}
      {...props}
    >
      {children}
    </motion.h6>
  )
}
export const H6 = withCustomComponent(H6Base, 'h6')

export const Paragraph = ({ children, className, ...props }: TypographyProps) => (
  <motion.p
    {...fadeInUp}
    className={cn("text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6 max-w-none", className)} {...props}
  >
    {children}
  </motion.p>
)


export function Strong ({ children, ...props }: TypographyProps) {

  return (
    <motion.strong
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "font-semibold ",
        " px-1.5 py-0.5 ",
        // "px-1",
        "inline-block",
        "rounded-sm",
        // "bg-code-background-gradient",
        // " hover:shadow-xs hover:shadow-strong-shadow",
        // "bg-strong-background"
        // "border-b-1 border-step/50 ",
        "shadow-xs  ",
        // "border border-step border-1",
        "bg-linear-to-r  from-step/10 via-step/5 to-transparent",
        "hover:bg-linear-to-l",
        "transition-all duration-300",
        // className
      )}
      {...props}
    >
      <span className=" 
      bg-strong-gradient
      ">
      {children}
      </span>
    </motion.strong>
  )
}

export const Em = ({ children, ...props }: TypographyProps) => {

  return (
    <motion.em
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "italic px-1.5 py-0.5 rounded-sm",
        // "bg-linear-to-r bg-clip-text text-transparent",
        "text-em-gradient",
        // "from-sky-500 to-teal-600 via-sky-800",
        // "dark:from-sky-200 dark:to-teal-200 dark:via-sky-200",
      )}
         {...props}
    >
      {children}
    </motion.em>
  )
}
