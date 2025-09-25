"use client"

import { motion } from "motion/react"
import AITutorials from "@/components/ai/ai-tutorials"

export default function TutorialsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
        AI Tutorials
      </h1>
      <AITutorials />
    </motion.div>
  )
}
