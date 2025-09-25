"use client"

import { motion } from "motion/react"
import { Brain, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
          <Brain className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Welcome to AI for Kids!
        </h1>

        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Get ready to explore the exciting world of Artificial Intelligence through fun, interactive lessons and games!
        </p>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 text-left">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <Brain className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Learn AI Concepts</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Discover how AI works through simple explanations
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-left">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
              <Brain className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium">Interactive Activities</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Train AI models and see them learn in real-time
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-left">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <Brain className="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Fun Games & Quizzes</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Play games that teach you about AI while having fun
              </p>
            </div>
          </div>
        </div>

        <Button onClick={onGetStarted} className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          Get Started
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}
