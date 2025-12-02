"use client"
import { cn } from "@/lib/utils"
import { useState, type ReactNode } from "react"
import { Tag } from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05
        }
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
} as const

const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: {
            type: "spring" as const,
            stiffness: 500,
            damping: 25
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        x: 10,
        transition: {
            duration: 0.1
        }
    }
} as const

export function AgentTags({ topics, timeComplexityBadge }: { topics: string[], timeComplexityBadge?: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const shouldReduceMotion = useReducedMotion()

    return (
        <div className="flex flex-row-reverse gap-1">
            <motion.button
                className={cn(
                    "bg-linear-to-r from-blue-50 to-blue-100 dark:from-black dark:to-gray-800 hover:bg-linear-to-l",
                    "shadow-sm shadow-blue-500/30 dark:shadow-blue-500",
                    "bg-clip-text text-transparent",
                    "w-6 h-5",
                    "text-xs",
                    "flex items-center justify-center",
                    "rounded-full",
                    "cursor-pointer",
                    isOpen && "opacity-100",
                    !isOpen && "opacity-5 hover:opacity-100",
                )}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
                >
                    <Tag className="size-3 text-blue-700 dark:text-blue-300" />
                </motion.span>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="flex flex-row-reverse gap-1"
                        variants={shouldReduceMotion ? {} : containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {timeComplexityBadge && (
                            <motion.div
                                variants={shouldReduceMotion ? {} : itemVariants}
                            >
                                {timeComplexityBadge}
                            </motion.div>
                        )}
                        {topics.map((topic) => (
                            <motion.span
                                key={topic}
                                variants={shouldReduceMotion ? {} : itemVariants}
                                className={cn(
                                    "bg-linear-to-r from-blue-50 to-blue-100 dark:from-black dark:to-gray-900",
                                    "w-fit",
                                    "rounded-full flex items-center gap-1 hover:bg-linear-to-l",
                                    "shadow-sm shadow-blue-500/30 dark:shadow-blue-500/80",
                                    "cursor-pointer",
                                )}
                                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                            >
                                <span className={cn(
                                    "bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
                                    "bg-clip-text text-transparent hover:bg-linear-to-l",
                                    "px-2 py-0.5",
                                    "text-xs",
                                )}>
                                    {topic}
                                </span>
                            </motion.span>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
