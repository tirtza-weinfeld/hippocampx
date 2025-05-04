"use client"

import { motion } from "framer-motion"
import MLTrainer from "@/components/ai/ml-trainer"

export default function TrainMLPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
        Train Machine Learning
      </h1>
      <MLTrainer />
    </motion.div>
  )
}
