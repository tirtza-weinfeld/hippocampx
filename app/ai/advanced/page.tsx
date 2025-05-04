"use client"

import { motion } from "framer-motion"
import AdvancedConcepts from "@/components/ai/advanced-concepts"

export default function AdvancedAIPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Advanced AI Concepts
      </h1>
      <AdvancedConcepts />
    </motion.div>
  )
}
