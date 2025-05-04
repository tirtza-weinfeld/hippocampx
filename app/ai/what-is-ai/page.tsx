"use client"

import { motion } from "framer-motion"
import AIExplorer from "@/components/ai/ai-explorer"

export default function WhatIsAIPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        What is AI?
      </h1>
      <AIExplorer />
    </motion.div>
  )
}
