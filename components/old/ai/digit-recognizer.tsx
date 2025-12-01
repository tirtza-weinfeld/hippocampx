"use client"

import { motion } from "motion/react"
import DigitCanvas from "./digit-canvas"
import { Card } from "@/components/ui/card"
import { Brain, Sparkles, Zap } from "lucide-react"
import type { PredictionOutput } from "@/lib/neural-network/types"
import SwipeContainer from "./swipe-container"

// Use the Railway API via Next.js proxy
const API_URL = "/api/mnist/predict-railway"

export default function DigitRecognizer() {
  async function handlePredict(pixels: number[]): Promise<PredictionOutput> {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pixels }),
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const error = await response.json()
          errorMessage = error.error || error.message || errorMessage
        } catch {
          const text = await response.text()
          errorMessage = text || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return data as PredictionOutput
    } catch (error) {
      console.error("Prediction error:", error)
      throw error
    }
  }

  return (
    <SwipeContainer className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold gradient-text gradient-blue-purple mb-4">
          MNIST Digit Recognizer
        </h2>
        <p className="text-lg mb-4 dark:text-gray-300">
          Draw any digit from 0-9 and watch our neural network predict what you drew! This AI model has been trained on
          thousands of handwritten digits.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <DigitCanvas onPredict={handlePredict} />
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="p-6 hover-card h-full dark:bg-slate-800">
            <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-4 flex items-center">
              <Brain className="h-6 w-6 mr-2 text-purple-500" />
              How It Works
            </h3>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg text-blue-700 dark:text-blue-300 mb-2">1. You Draw</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Draw a digit using your mouse, finger, or Apple Pencil on the canvas
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800"
              >
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg text-purple-700 dark:text-purple-300 mb-2">2. Image Processing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your drawing is converted into a 28×28 pixel grayscale image (784 numbers between 0 and 1)
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="p-4 bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/20 rounded-lg border border-pink-100 dark:border-pink-800"
              >
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-pink-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg text-pink-700 dark:text-pink-300 mb-2">3. Neural Network</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      The pixel data is sent to our neural network, which has learned patterns from thousands of
                      handwritten digits
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-100 dark:border-green-800"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg text-green-700 dark:text-green-300 mb-2">4. Prediction</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      The network outputs probabilities for each digit (0-9) and shows you what it thinks you drew!
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-2xl font-semibold gradient-text gradient-blue-purple mb-4">About MNIST</h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              MNIST (Modified National Institute of Standards and Technology) is a famous dataset of 70,000 handwritten
              digits used to train image recognition systems.
            </p>
            <p>
              The neural network you&apos;re using has been trained on this dataset and can recognize handwritten digits
              with high accuracy. Try drawing different styles and see how well it performs!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">28×28</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Input Size</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">784</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pixels</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">10</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Digits (0-9)</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </SwipeContainer>
  )
}
