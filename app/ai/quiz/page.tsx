"use client"

import { motion } from "framer-motion"
import AIQuiz from "@/components/ai/ai-quiz"

export default function QuizPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
        AI Quiz
      </h1>
      <AIQuiz />
    </motion.div>
  )
}
