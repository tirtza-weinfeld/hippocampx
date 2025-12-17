"use client"

import { motion } from "motion/react"
import { BrainIcon } from "lucide-react"

type PageHeaderProps = {
  shouldReduceMotion: boolean | null
}

export function PageHeader({ shouldReduceMotion }: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <motion.div
        className="inline-block relative mb-4"
        initial={shouldReduceMotion ? { opacity: 0 } : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-old-game-primary/20 via-old-game-primary-dark/20 to-old-game-primary/20 rounded-2xl blur-lg" />

        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-xl border border-old-game-border">
          <div className="flex items-center justify-center gap-4">
            <motion.div
              animate={shouldReduceMotion ? undefined : { rotate: [0, 8, 0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BrainIcon className="h-8 w-8 text-old-game-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-old-game-gradient">
              Word Memory
            </h1>
            <motion.div
              animate={shouldReduceMotion ? undefined : { rotate: [0, -8, 0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BrainIcon className="h-8 w-8 text-old-game-primary" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.p
        className="text-lg text-old-game-text-muted max-w-xl mx-auto"
        initial={shouldReduceMotion ? { opacity: 0 } : { y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.15 }}
      >
        Match each word with its definition. Find all pairs to complete the game!
      </motion.p>
    </div>
  )
}
