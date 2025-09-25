"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"

export type MascotEmotion = "happy" | "thinking" | "excited" | "confused" | "celebrating"
type MascotSize = "sm" | "md" | "lg"

interface BinaryMascotProps {
  emotion?: MascotEmotion
  size?: MascotSize
  animate?: boolean
}

export default function BinaryMascot({ emotion = "happy", size = "md", animate = true }: BinaryMascotProps) {
  const [currentEmotion, setCurrentEmotion] = useState(emotion)

  // Randomly change emotions if animate is true
  useEffect(() => {
    if (!animate) return

    const emotions: MascotEmotion[] = ["happy", "thinking", "excited", "confused", "celebrating"]
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
        setCurrentEmotion(randomEmotion)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [animate])

  // Set size dimensions
  const dimensions = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  // Get emotion-specific styles
  const getEmotionStyles = () => {
    switch (currentEmotion) {
      case "happy":
        return {
          body: "bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700",
          eyes: "bg-white",
          mouth: "w-6 h-3 bg-white rounded-b-full",
          ears: "bg-blue-300 dark:bg-blue-600",
          hatColor: "bg-blue-300 dark:bg-blue-600",
          hatBand: "bg-yellow-400 dark:bg-yellow-500",
          feet: "bg-blue-300 dark:bg-blue-600",
          nose: "bg-blue-300 dark:bg-blue-600",
        }
      case "thinking":
        return {
          body: "bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700",
          eyes: "bg-white",
          mouth: "w-4 h-1 bg-white rounded-full",
          ears: "bg-purple-300 dark:bg-purple-600",
          hatColor: "bg-purple-300 dark:bg-purple-600",
          hatBand: "bg-green-400 dark:bg-green-500",
          feet: "bg-purple-300 dark:bg-purple-600",
          nose: "bg-purple-300 dark:bg-purple-600",
        }
      case "excited":
        return {
          body: "bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700",
          eyes: "bg-white",
          mouth: "w-6 h-3 bg-white rounded-t-full",
          ears: "bg-green-300 dark:bg-green-600",
          hatColor: "bg-green-300 dark:bg-green-600",
          hatBand: "bg-pink-400 dark:bg-pink-500",
          feet: "bg-green-300 dark:bg-green-600",
          nose: "bg-green-300 dark:bg-green-600",
        }
      case "confused":
        return {
          body: "bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700",
          eyes: "bg-white",
          mouth: "w-4 h-4 border-2 border-white rounded-full",
          ears: "bg-yellow-300 dark:bg-yellow-600",
          hatColor: "bg-yellow-300 dark:bg-yellow-600",
          hatBand: "bg-blue-400 dark:bg-blue-500",
          feet: "bg-yellow-300 dark:bg-yellow-600",
          nose: "bg-yellow-300 dark:bg-yellow-600",
        }
      case "celebrating":
        return {
          body: "bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-500 dark:to-pink-700",
          eyes: "bg-white",
          mouth: "w-6 h-6 bg-white rounded-full flex items-center justify-center",
          inner: "w-4 h-4 bg-pink-500 rounded-full",
          ears: "bg-pink-300 dark:bg-pink-600",
          hatColor: "bg-pink-300 dark:bg-pink-600",
          hatBand: "bg-teal-400 dark:bg-teal-500",
          feet: "bg-pink-300 dark:bg-pink-600",
          nose: "bg-pink-300 dark:bg-pink-600",
        }
      default:
        return {
          body: "bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700",
          eyes: "bg-white",
          mouth: "w-6 h-3 bg-white rounded-b-full",
          ears: "bg-blue-300 dark:bg-blue-600",
          hatColor: "bg-blue-300 dark:bg-blue-600",
          hatBand: "bg-yellow-400 dark:bg-yellow-500",
          feet: "bg-blue-300 dark:bg-blue-600",
          nose: "bg-blue-300 dark:bg-blue-600",
        }
    }
  }

  const emotionStyles = getEmotionStyles()

  // Animation variants
  const variants = {
    happy: {
      y: [0, -10, 0],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
    },
    thinking: {
      rotate: [0, 10, -10, 0],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 3 },
    },
    excited: {
      scale: [1, 1.1, 1],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 },
    },
    confused: {
      x: [0, 5, -5, 0],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
    },
    celebrating: {
      rotate: [0, 15, -15, 0],
      y: [0, -15, 0],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 1 },
    },
  }

  return (
    <motion.div className={`relative ${dimensions[size]}`} animate={animate ? variants[currentEmotion] : {}}>
      {/* Main hippo body */}
      <div
        className={`${emotionStyles.body} w-full h-full rounded-[60%] shadow-lg flex items-center justify-center text-white font-bold relative overflow-hidden`}
      >
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>

        {/* Binary pattern in background */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="text-xs font-mono grid grid-cols-3 gap-1 rounded-[60%] max-w-full max-h-full">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <span key={i}>{i % 2 === 0 ? "01" : "10"}</span>
              ))}
          </div>
        </div>

        {/* Ears */}
        <div className={`absolute -left-1 top-1/4 w-4 h-5 ${emotionStyles.ears} rounded-full`}></div>
        <div className={`absolute -right-1 top-1/4 w-4 h-5 ${emotionStyles.ears} rounded-full`}></div>

        {/* Hat - Made more prominent */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-[100%]">
          {/* Hat body */}
          <div className={`w-full h-8 ${emotionStyles.hatColor} rounded-t-[60%] shadow-md`}></div>
          {/* Hat band */}
          <div className={`w-[105%] h-2.5 ${emotionStyles.hatBand} -mt-2.5 shadow-sm`}></div>
          {/* Hat decoration */}
          <div className="absolute top-1.5 left-[60%] w-3 h-3 bg-white/30 rounded-full"></div>
          {/* Binary decoration */}
          <div className="absolute top-2 left-[30%] text-[6px] font-mono text-white/90">01</div>
        </div>

        {/* Eyes with glasses */}
        <div className="absolute top-[40%] left-0 w-full">
          <div className="relative flex justify-center">
            {/* Glasses bridge */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-0.5 bg-white/80"></div>

            {/* Eyes with glasses frames */}
            <div className="flex space-x-3">
              <div className="relative">
                <div className="w-3 h-3 border border-white/80 rounded-full flex items-center justify-center">
                  <div className={`w-2 h-2 ${emotionStyles.eyes} rounded-full`}></div>
                </div>
                <div className="absolute -left-1 top-1/2 w-1 h-0.5 bg-white/80 transform -rotate-45"></div>
              </div>

              <div className="relative">
                <div className="w-3 h-3 border border-white/80 rounded-full flex items-center justify-center">
                  <div className={`w-2 h-2 ${emotionStyles.eyes} rounded-full`}></div>
                </div>
                <div className="absolute -right-1 top-1/2 w-1 h-0.5 bg-white/80 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Snout with nose */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-[70%] h-[40%] bg-white/20 rounded-[50%]">
          {/* Nose - Added a more defined nose */}
          <div
            className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 w-4 h-2.5 ${emotionStyles.nose} rounded-[50%] opacity-60`}
          ></div>

          {/* Nostrils */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-3">
            <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
          </div>
        </div>

        {/* Mouth - Improved */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
          {currentEmotion === "happy" && <div className="w-8 h-4 bg-white rounded-b-full"></div>}
          {currentEmotion === "thinking" && <div className="w-5 h-1 bg-white rounded-full"></div>}
          {currentEmotion === "excited" && <div className="w-8 h-4 bg-white rounded-t-full"></div>}
          {currentEmotion === "confused" && <div className="w-5 h-5 border-2 border-white rounded-full"></div>}
          {currentEmotion === "celebrating" && (
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-pink-500 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Bow tie */}
        <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2">
          <div className="relative w-6 h-3">
            <div className="absolute left-0 top-0 w-3 h-3 bg-red-400 dark:bg-red-500 rounded-full transform -rotate-45"></div>
            <div className="absolute right-0 top-0 w-3 h-3 bg-red-400 dark:bg-red-500 rounded-full transform rotate-45"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-300 dark:bg-yellow-400 rounded-full"></div>
          </div>
        </div>

        {/* Binary text on chest */}
        <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 text-xs font-bold">01</div>

        {/* Feet - Added visible feet */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-6">
          <div className={`w-4 h-3 ${emotionStyles.feet} rounded-b-full shadow-sm`}></div>
          <div className={`w-4 h-3 ${emotionStyles.feet} rounded-b-full shadow-sm`}></div>
        </div>
      </div>

      {/* Thought bubbles - Only show when thinking */}
      {currentEmotion === "thinking" && (
        <>
          <motion.div
            className="absolute -top-4 -right-2 w-3 h-3 bg-white/80 dark:bg-white/60 rounded-full"
            animate={{ scale: [0.8, 1, 0.8], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          />
          <motion.div
            className="absolute -top-6 -right-1 w-2 h-2 bg-white/80 dark:bg-white/60 rounded-full"
            animate={{ scale: [0.8, 1, 0.8], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.3 }}
          />
          <motion.div
            className="absolute -top-8 right-1 w-4 h-4 bg-white/80 dark:bg-white/60 rounded-full flex items-center justify-center"
            animate={{ scale: [0.8, 1, 0.8], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.6 }}
          >
            <span className="text-[6px] font-mono">10</span>
          </motion.div>
        </>
      )}

      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 rounded-[50%] bg-white/30 dark:bg-white/10 blur-md"></div>
    </motion.div>
  )
}

