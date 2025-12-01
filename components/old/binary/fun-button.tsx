"use client"

import type React from "react"

import { type ButtonHTMLAttributes, forwardRef } from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

// Change the component description to clarify it's not a sound button
// Enhance the FunButton component to ensure it's fully accessible and even more fun

// Update the buttonVariants to be more kid-friendly with larger sizes and more rounded corners
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-600 hover:to-blue-600 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]",
        outline:
          "border-3 border-blue-300 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 dark:border-blue-700 text-blue-600 dark:text-blue-300 hover:border-blue-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]",
        secondary:
          "bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-600 shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
        success:
          "bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]",
        warning:
          "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]",
        ghost:
          "bg-transparent hover:bg-gradient-to-r hover:from-blue-100/50 hover:to-indigo-100/50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 text-slate-700 dark:text-slate-300",
        link: "bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 rounded-full text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface FunButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  bubbles?: boolean // Add this prop to the interface
}

// Update the FunButton component to have more kid-friendly animations
const FunButton = forwardRef<HTMLButtonElement, FunButtonProps>(
  ({ className, variant, size, icon, iconPosition = "left", children, bubbles, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.92 }}
        animate={{ rotate: [0, 0.5, -0.5, 0] }}
        transition={{ rotate: { repeat: Number.POSITIVE_INFINITY, duration: 3 } }}
      >
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
          aria-label={props["aria-label"] || (typeof children === "string" ? children : undefined)}
        >
          {icon && iconPosition === "left" && <span className="mr-2 text-lg">{icon}</span>}
          <span className="relative z-10 font-bold">{children}</span>
          {icon && iconPosition === "right" && <span className="ml-2 text-lg">{icon}</span>}

          {/* Add subtle animated background for kid appeal */}
          {variant !== "ghost" && variant !== "link" && (
            <motion.div
              className="absolute inset-0 -z-10 opacity-20 rounded-full"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
                  "radial-gradient(circle at 80% 70%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
          )}
        </button>
        {bubbles && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/30"
                initial={{ 
                  x: "50%", 
                  y: "50%", 
                  opacity: 0,
                  scale: 0 
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`, 
                  y: `${Math.random() * 100}%`, 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1 + Math.random(),
                  delay: i * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    )
  },
)

FunButton.displayName = "FunButton"

export { FunButton, buttonVariants }
