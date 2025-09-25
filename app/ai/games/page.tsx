"use client"

import { motion } from "motion/react"
import AIGames from "@/components/ai/ai-games"

export default function GamesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
        AI Games
      </h1>
      <AIGames />
    </motion.div>
  )
}
