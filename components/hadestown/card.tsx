"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className,
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight text-amber-600 dark:text-amber-400", className)}
      {...props}
    />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-500 dark:text-amber-300/80", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

// Add a new CardFlip component for memory game
interface CardFlipProps {
  flipped: boolean
  matched?: boolean
  onClick?: () => void
  backContent?: React.ReactNode
  frontContent?: React.ReactNode
  className?: string
}

const CardFlip = ({ flipped, matched = false, onClick, backContent, frontContent, className }: CardFlipProps) => {
  return (
    <div
      className={cn("relative w-full h-full perspective-1000 cursor-pointer", matched && "cursor-default")}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500 preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.1 }}
      >
        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-500/90 to-amber-600/70 dark:from-amber-600 dark:to-amber-700 text-white dark:text-gray-900 border-2 border-amber-500/30 dark:border-amber-700/50 shadow-md",
            matched &&
            "bg-gradient-to-br from-green-500/90 to-green-600/70 dark:from-green-600 dark:to-green-700 border-green-500/30 dark:border-green-700/50",
          )}
        >
          {backContent}
        </div>

        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden rounded-lg flex items-center justify-center bg-gradient-to-br from-white/90 to-gray-100/80 border-2 border-amber-500/30 dark:from-gray-800 dark:to-gray-900 dark:border-amber-700/50 text-amber-600 dark:text-amber-400 shadow-md rotate-y-180 p-2 text-center",
            matched &&
            //  "border-green-500/30 dark:border-green-700/50 bg-gradient-to-br from-green-500/90 to-green-600/70 dark:from-green-600 dark:to-green-700 border-green-500/30 dark:border-green-700/50"

            `bg-gradient-to-br 
             from-green-600 to-green-300  text-foreground border-none
             dark:from-green-400 dark:to-green-800 dark:text-amber-100 border-none
             
             `
            // ``
            ,
            className,
          )}
        >

          {matched && (
            <div className="absolute top-4 right-3 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              <CheckIcon className="h-3 w-3" />
            </div>
          )}
          {frontContent}
        </div>
      </motion.div>
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardFlip }

