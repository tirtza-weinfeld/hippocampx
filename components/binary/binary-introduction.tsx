"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"
import BinaryMascot, { type MascotEmotion } from "@/components/binary/binary-mascot"
import confetti from "canvas-confetti"
import { FunButton } from "@/components/binary/fun-button"

export default function BinaryIntroduction() {
  const [step, setStep] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [lessons] = useState([
    {
      title: "Meet Bitsy!",
      content:
        "Hi there! I'm Bitsy, your binary buddy! I'm going to teach you all about binary numbers - the secret language that computers speak!",
      mascot: "excited",
      visual: (
        <div className="flex justify-center my-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, rotate: { repeat: Number.POSITIVE_INFINITY, duration: 2 } }}
          >
            <BinaryMascot emotion="excited" size="lg" />
          </motion.div>
        </div>
      ),
    },
    {
      title: "What is Binary?",
      content:
        "Binary is a super cool number system that only uses two digits: 0 and 1. While we humans use 10 digits (0-9), computers only understand ON (1) and OFF (0)!",
      mascot: "happy",
      visual: (
        <div className="flex flex-col items-center gap-6 my-8">
          <div className="flex justify-center gap-12">
            <motion.div
              className="text-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-red-400 to-orange-500 dark:from-red-500 dark:to-orange-600 flex items-center justify-center text-white text-3xl md:text-5xl font-bold mb-3 shadow-lg"
                animate={{
                  scale: [1, 0.9, 1],
                  boxShadow: [
                    "0px 4px 8px rgba(0,0,0,0.1)",
                    "0px 2px 4px rgba(0,0,0,0.1)",
                    "0px 4px 8px rgba(0,0,0,0.1)",
                  ],
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                0
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 px-3 py-1 rounded-full shadow-sm"
              >
                <p className="text-sm md:text-base font-medium">OFF</p>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 flex items-center justify-center text-white text-3xl md:text-5xl font-bold mb-3 shadow-lg"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0px 4px 8px rgba(0,0,0,0.1)",
                    "0px 8px 16px rgba(0,0,0,0.2)",
                    "0px 4px 8px rgba(0,0,0,0.1)",
                  ],
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                1
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-3 py-1 rounded-full shadow-sm"
              >
                <p className="text-sm md:text-base font-medium">ON</p>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 p-3 rounded-xl shadow-md max-w-xs text-center"
          >
            <p className="text-sm">Computers only understand these two states!</p>
          </motion.div>
        </div>
      ),
    },
    {
      title: "Counting in Binary",
      content:
        "In binary, each position is like a special power spot! Starting from the right, we have spots worth 1, 2, 4, 8, and so on - each spot is double the one before it!",
      mascot: "thinking",
      visual: (
        <div className="flex flex-col items-center my-8">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { value: 8, color: "from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700", power: 3 },
              { value: 4, color: "from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700", power: 2 },
              { value: 2, color: "from-green-400 to-green-600 dark:from-green-500 dark:to-green-700", power: 1 },
              { value: 1, color: "from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700", power: 0 },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
              >
                <motion.div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {item.value}
                </motion.div>
                <p className="text-xs md:text-sm mt-2 font-medium">
                  2<sup>{item.power}</sup>
                </p>
              </motion.div>
            ))}
          </div>
          <motion.p
            className="text-center text-sm md:text-base bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Each position has a value that&apos;s double the previous one!
          </motion.p>
        </div>
      ),
    },
    {
      title: "Binary to Decimal",
      content:
        "To convert binary to decimal (our normal numbers), we add up the values of each position where there's a 1. It's like collecting points in a game!",
      mascot: "happy",
      visual: (
        <div className="flex flex-col items-center my-8">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { bit: 1, value: 8, color: "from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700" },
              { bit: 0, value: 4, color: "from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700" },
              { bit: 1, value: 2, color: "from-green-400 to-green-600 dark:from-green-500 dark:to-green-700" },
              { bit: 1, value: 1, color: "from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
              >
                <motion.div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${
                    item.bit === 1 ? item.color : "from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
                  } flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg`}
                  animate={
                    item.bit === 1
                      ? {
                          y: [0, -10, 0],
                          boxShadow: [
                            "0px 0px 0px rgba(0,0,0,0.1)",
                            "0px 10px 20px rgba(0,0,0,0.2)",
                            "0px 0px 0px rgba(0,0,0,0.1)",
                          ],
                        }
                      : {}
                  }
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  {item.bit}
                </motion.div>
                <p className="text-xs md:text-sm mt-2 font-medium">{item.value}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-md"
          >
            <p className="text-center text-base md:text-lg font-bold mb-3">1011 = 8 + 0 + 2 + 1 = 11 in decimal</p>
            <div className="flex justify-center items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700 flex items-center justify-center text-white font-bold shadow-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0 }}
              >
                8
              </motion.div>
              <span>+</span>
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 flex items-center justify-center text-white font-bold shadow-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.3 }}
              >
                2
              </motion.div>
              <span>+</span>
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 flex items-center justify-center text-white font-bold shadow-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.6 }}
              >
                1
              </motion.div>
              <span>=</span>
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 text-white flex items-center justify-center font-bold shadow-md"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.9 }}
              >
                11
              </motion.div>
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      title: "Binary in Action!",
      content:
        "Binary is super important because it's how all computers store and process information. Every picture, video, game, and even this website is made of 0s and 1s!",
      mascot: "celebrating",
      visual: (
        <div className="flex flex-col items-center justify-center my-8">
          <div className="grid grid-cols-8 gap-1 mb-6 bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl shadow-md backdrop-blur-sm">
            {Array(24)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-mono font-bold ${
                    i % 3 === 0
                      ? "bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 text-white"
                      : "bg-slate-200 dark:bg-slate-700"
                  } rounded shadow-sm`}
                >
                  {i % 3 === 0 ? "1" : "0"}
                </motion.div>
              ))}
          </div>

          <motion.div
            className="mt-6 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[
              {
                icon: "🖼️",
                label: "Images",
                color: "from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700",
              },
              { icon: "🎮", label: "Games", color: "from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700" },
              {
                icon: "🎵",
                label: "Music",
                color: "from-green-400 to-green-600 dark:from-green-500 dark:to-green-700",
              },
              {
                icon: "📱",
                label: "Apps",
                color: "from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`flex items-center justify-center p-3 bg-gradient-to-br ${item.color} rounded-lg text-white shadow-md`}
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 1 }}
              >
                <span className="mr-2 text-xl">{item.icon}</span> {item.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      ),
    },
    {
      title: "You Did It!",
      content:
        "Congratulations! You've learned the basics of binary numbers! Now you can try converting numbers in the Convert tab or play a fun game in the Play tab!",
      mascot: "celebrating",
      visual: (
        <div className="flex flex-col items-center justify-center my-8">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            className="mb-6"
          >
            <BinaryMascot emotion="celebrating" size="lg" />
          </motion.div>

          <motion.div
            className="text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 p-6 rounded-xl shadow-md backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              You&apos;re a Binary Star! ⭐
            </h3>
            <p className="text-lg">Now you know the secret language of computers!</p>
          </motion.div>
        </div>
      ),
    },
  ])

  // Play sound effect when changing steps
  useEffect(() => {
    // Show celebration at the end
    if (step === lessons.length - 1) {
      setTimeout(() => {
        setShowCelebration(true)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 1000)
    } else {
      setShowCelebration(false)
    }
  }, [step, lessons.length])

  // Add this after the existing useEffect
  useEffect(() => {
    // Add keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Left arrow key for previous
      if (e.key === "ArrowLeft" && step > 0) {
        setStep((prev) => prev - 1)
      }
      // Right arrow key for next
      else if (e.key === "ArrowRight" && step < lessons.length - 1) {
        setStep((prev) => prev + 1)
      }
      // Number keys 1-6 (or however many lessons)
      else if (/^[1-9]$/.test(e.key)) {
        const numKey = Number.parseInt(e.key)
        if (numKey <= lessons.length) {
          setStep(numKey - 1)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [step, lessons.length])

  const currentLesson = lessons[step]

  return (
    <Card className="w-full overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl">
      <CardContent className="pt-6 pb-6">
        {/* Removed duplicate sound control button */}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center mb-4">
              <BinaryMascot emotion={currentLesson.mascot as MascotEmotion} size="sm" />
              <h2 className="text-2xl md:text-3xl font-bold text-center ml-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
                {currentLesson.title}
              </h2>
            </div>

            <motion.div
              className="mb-6 text-center max-w-2xl px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-base md:text-lg">{currentLesson.content}</p>
            </motion.div>

            {currentLesson.visual}

            {showCelebration && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute top-1/4 left-1/4">
                  <motion.div
                    animate={{ y: [0, -100], opacity: [1, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="text-4xl"
                  >
                    🎉
                  </motion.div>
                </div>
                <div className="absolute top-1/3 right-1/4">
                  <motion.div
                    animate={{ y: [0, -100], opacity: [1, 0] }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                    className="text-4xl"
                  >
                    🎈
                  </motion.div>
                </div>
                <div className="absolute bottom-1/4 right-1/3">
                  <motion.div
                    animate={{ y: [0, -100], opacity: [1, 0] }}
                    transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                    className="text-4xl"
                  >
                    ⭐
                  </motion.div>
                </div>
              </motion.div>
            )}

            <div className="relative w-full mt-8 px-4 h-16">
              {/* Fixed position buttons */}
              <div className="absolute left-4 bottom-0">
                <motion.div
                  whileHover={{ scale: step === 0 ? 1 : 1.08, y: step === 0 ? 0 : -5 }}
                  whileTap={{ scale: step === 0 ? 1 : 0.92 }}
                  animate={{ rotate: [0, -1, 1, 0] }}
                  transition={{ rotate: { repeat: Number.POSITIVE_INFINITY, duration: 2 } }}
                >
                  <FunButton
                    variant={step === 0 ? "ghost" : "default"}
                    onClick={() => {
                      setStep((prev) => Math.max(0, prev - 1))
                    }}
                    disabled={step === 0}
                    icon={<ChevronLeft className="mr-1 h-5 w-5" />}
                    iconPosition="left"
                    className={`flex items-center px-6 py-4 text-lg`}
                    bubbles={step !== 0}
                    size="lg"
                    aria-label="Go to previous lesson"
                  >
                    <span className={step === 0 ? "opacity-50" : ""}>Previous</span>
                  </FunButton>
                </motion.div>
              </div>

              {/* Pagination indicators in the center */}
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 flex space-x-2">
                {lessons.map((_, i) => (
                  <motion.button
                    key={i}
                    className={`h-3 w-3 rounded-full ${
                      i === step
                        ? "bg-gradient-to-r from-violet-400 to-blue-400 shadow-[0_0_5px_rgba(99,102,241,0.5)]"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    animate={i === step ? { scale: [1, 1.5, 1], y: [0, -2, 0] } : {}}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    onClick={() => setStep(i)}
                    aria-label={`Go to lesson ${i + 1}`}
                    aria-current={i === step ? "step" : undefined}
                  />
                ))}
              </div>

              {/* Next button fixed at right */}
              <div className="absolute right-4 bottom-0">
                <motion.div
                  whileHover={{
                    scale: step === lessons.length - 1 ? 1 : 1.08,
                    y: step === lessons.length - 1 ? 0 : -5,
                  }}
                  whileTap={{ scale: step === lessons.length - 1 ? 1 : 0.92 }}
                  animate={{ rotate: [0, 1, -1, 0] }}
                  transition={{ rotate: { repeat: Number.POSITIVE_INFINITY, duration: 2 } }}
                >
                  <FunButton
                    variant={step === lessons.length - 1 ? "ghost" : "default"}
                    onClick={() => {
                      setStep((prev) => Math.min(lessons.length - 1, prev + 1))
                    }}
                    disabled={step === lessons.length - 1}
                    icon={<ChevronRight className="ml-1 h-5 w-5 relative z-10" />}
                    iconPosition="right"
                    className={`flex items-center px-6 py-4 text-lg`}
                    bubbles={step !== lessons.length - 1}
                    size="lg"
                    aria-label="Go to next lesson"
                  >
                    <span className="relative z-10">Next</span>
                  </FunButton>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

