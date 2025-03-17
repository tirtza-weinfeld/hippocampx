"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeftIcon, ArrowRightIcon, MusicIcon, CheckIcon, RefreshCwIcon, HelpCircleIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { XIcon } from "lucide-react"

const LYRICS = [
  {
    title: "Wait for Me",
    lyrics: ["Wait for me, I'm coming", "Wait, I'm coming with you", "Wait for me, I'm coming too", "I'm coming too"],
    missing: [1, 2], // Indices of the missing lines
    context: "Orpheus sings this as he decides to follow Eurydice to the underworld.",
  },
  {
    title: "Road to Hell",
    lyrics: ["It's a sad song", "It's a sad tale, it's a tragedy", "It's a sad song", "But we sing it anyway"],
    missing: [1, 3], // Indices of the missing lines
    context: "Hermes introduces the story of Orpheus and Eurydice.",
  },
  {
    title: "Epic III",
    lyrics: [
      "La la la la la la la...",
      "La la la la la la la...",
      "La la la la la la la...",
      "We sing of what might have been and what never was",
    ],
    missing: [3], // Indices of the missing lines
    context: "The final song that reflects on the story that was told.",
  },
  {
    title: "When the Chips are Down",
    lyrics: [
      "When the chips are down",
      "When the odds are stacked against you",
      "When your back's against the wall",
      "You gotta take the deal they're dealing you",
    ],
    missing: [1, 2], // Indices of the missing lines
    context: "The Fates sing this to Eurydice as they tempt her to go to the underworld.",
  },
  {
    title: "Way Down Hadestown",
    lyrics: [
      "Way down Hadestown",
      "Way down under the ground",
      "Hound dogs howl and the hellhounds growl",
      "And the whistle of the train sounds",
    ],
    missing: [2], // Indices of the missing lines
    context: "This song describes the journey to Hadestown and what it's like there.",
  },
]

export default function LyricChallengePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInputs, setUserInputs] = useState<string[]>([])
  const [isChecked, setIsChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const currentLyric = LYRICS[currentIndex]

  const resetChallenge = useCallback(() => {
    setUserInputs(Array(currentLyric.missing.length).fill(""))
    setIsChecked(false)
    setShowHint(false)
  }, [currentLyric.missing.length])

  useEffect(() => {
    resetChallenge()
    // Initialize input refs array
    inputRefs.current = inputRefs.current.slice(0, currentLyric.missing.length)
  }, [currentLyric, resetChallenge])

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs]
    newInputs[index] = value
    setUserInputs(newInputs)
  }

  const checkAnswers = () => {
    setIsChecked(true)

    // Calculate score
    let correct = 0
    currentLyric.missing.forEach((lineIndex, index) => {
      const actualLine = currentLyric.lyrics[lineIndex].toLowerCase()
      const userLine = userInputs[index].toLowerCase()

      // Simple check - if the user's input contains most of the words in the actual line
      const actualWords = actualLine.split(/\s+/)
      const userWords = userLine.split(/\s+/)

      // Count how many words match
      const matchCount = actualWords.filter((word) => userWords.some((userWord) => userWord === word)).length

      // If more than 70% of words match, consider it correct
      if (matchCount / actualWords.length > 0.7) {
        correct++
      }
    })

    if (correct === currentLyric.missing.length && !isChecked) {
      setScore(score + 1)
    }
  }

  const nextLyric = () => {
    setCurrentIndex((prev) => (prev + 1) % LYRICS.length)
  }

  const prevLyric = () => {
    setCurrentIndex((prev) => (prev - 1 + LYRICS.length) % LYRICS.length)
  }

  return (
    <main className="min-h-screen py-8 bg-gradient-to-b from-background to-background/90 text-foreground">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-white to-amber-50/30 dark:from-amber-800/30 dark:via-gray-900 dark:to-red-800/30 animate-gradient"></div>
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-amber-100/10 to-transparent dark:from-amber-700/30 dark:to-transparent"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-amber-300/10 to-transparent dark:from-amber-600/20 dark:to-transparent"></div>

        {/* Musical notes floating animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-amber-400/30 dark:text-amber-500/40"
              initial={{
                x: Math.random() * 100,
                y: -20,
                rotate: Math.random() * 180 - 90,
                opacity: 0.3,
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: Math.random() * 360,
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 15 + Math.random() * 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: i * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${24 + Math.random() * 24}px`,
              }}
            >
              {["♪", "♫", "♩", "♬", "♭", "♮"][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>
      </div>

  

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center gap-2 mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <MusicIcon className="h-6 w-6 text-amber-500 dark:text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-500">
              Lyric Challenge
            </h1>
            <MusicIcon className="h-6 w-6 text-amber-500 dark:text-amber-400" />
          </motion.div>
          <p className="text-amber-700 dark:text-amber-300 text-readable">
            Fill in the missing lyrics from Hadestown songs
          </p>
        </div>

        {/* Song navigation */}
        <div className="flex justify-center gap-3 mb-6">
          <motion.button
            onClick={prevLyric}
            className="cursor-pointer bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600 text-white dark:text-gray-900 rounded-full p-3 shadow-lg hover:shadow-amber-300/30 dark:hover:shadow-amber-500/30"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous song"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </motion.button>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 flex items-center shadow-md border border-amber-200/50 dark:border-amber-700/50"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
          >
            <span className="text-amber-700 dark:text-amber-300 font-medium">
              {currentIndex + 1}/{LYRICS.length}
            </span>
          </motion.div>

          <motion.button
            onClick={nextLyric}
            className="cursor-pointer bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600 text-white dark:text-gray-900 rounded-full p-3 shadow-lg hover:shadow-amber-300/30 dark:hover:shadow-amber-500/30"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next song"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </motion.button>
        </div>

        <Card className="bg-white/90 dark:bg-gray-900/90 border-amber-200/50 dark:border-amber-700/50 shadow-xl backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="p-6">
            <motion.div
              key={currentLyric.title}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <MusicIcon className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {currentLyric.title}
                </h2>
              </div>

              <motion.button
                className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 mb-4 flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-gray-800 border border-amber-200/50 dark:border-amber-700/50"
                onClick={() => setShowHint(!showHint)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HelpCircleIcon className="h-4 w-4" />
                {showHint ? "Hide Context" : "Show Context"}
              </motion.button>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-lg mb-6 bg-amber-50/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 border border-amber-200/50 dark:border-amber-700/50 max-w-xl text-center"
                  >
                    {currentLyric.context}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="space-y-4 mb-8">
              {currentLyric.lyrics.map((line, index) => {
                const isMissing = currentLyric.missing.includes(index)
                const missingIndex = currentLyric.missing.indexOf(index)

                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 font-medium text-sm">
                      {index + 1}
                    </div>

                    {isMissing ? (
                      <div className="flex-1">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`relative ${isChecked ? "overflow-visible" : "overflow-hidden"}`}
                        >
                          <Input
                            ref={(el) => {
                              if (inputRefs.current) {
                                inputRefs.current[missingIndex] = el
                              }
                            }}
                            value={userInputs[missingIndex] || ""}
                            onChange={(e) => handleInputChange(missingIndex, e.target.value)}
                            className={`bg-white dark:bg-gray-800 border-2 text-amber-800 dark:text-amber-200 placeholder-amber-400/70 dark:placeholder-amber-600/70 rounded-lg py-3 px-4 shadow-inner ${
                              isChecked
                                ? userInputs[missingIndex].toLowerCase() === line.toLowerCase() ||
                                  line
                                    .toLowerCase()
                                    .split(/\s+/)
                                    .filter((word) => userInputs[missingIndex].toLowerCase().includes(word)).length /
                                    line.toLowerCase().split(/\s+/).length >
                                    0.7
                                  ? "border-green-500 dark:border-green-600 text-green-700 dark:text-green-400"
                                  : "border-red-500 dark:border-red-600 text-red-700 dark:text-red-400"
                                : "border-amber-300 dark:border-amber-700"
                            }`}
                            placeholder="Type the missing lyric..."
                            disabled={isChecked}
                          />

                          {isChecked && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-sm"
                            >
                              <span className="font-medium text-amber-600 dark:text-amber-400">Actual: </span>
                              <span className="text-amber-700 dark:text-amber-300">{line}</span>
                            </motion.div>
                          )}

                          {isChecked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-3"
                            >
                              {userInputs[missingIndex].toLowerCase() === line.toLowerCase() ||
                              line
                                .toLowerCase()
                                .split(/\s+/)
                                .filter((word) => userInputs[missingIndex].toLowerCase().includes(word)).length /
                                line.toLowerCase().split(/\s+/).length >
                                0.7 ? (
                                <CheckIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                              ) : (
                                <XIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    ) : (
                      <motion.p
                        className="flex-1 p-3 rounded-lg bg-amber-50/80 dark:bg-gray-800/80 text-amber-700 dark:text-amber-300 border border-amber-200/30 dark:border-amber-700/30"
                        whileHover={{ scale: 1.01 }}
                      >
                        {line}
                      </motion.p>
                    )}
                  </motion.div>
                )
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-3 [&>*]:rounded-full">
              <motion.button
                onClick={resetChallenge}
                disabled={!isChecked}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm ${
                  !isChecked
                    ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-900/70"
                }`}
                whileHover={isChecked ? { scale: 1.05 } : {}}
                whileTap={isChecked ? { scale: 0.95 } : {}}
              >
                <RefreshCwIcon className="h-4 w-4" />
                Try Again
              </motion.button>

              <motion.button
                onClick={checkAnswers}
                disabled={userInputs.some((input) => !input.trim()) || isChecked}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm ${
                  userInputs.some((input) => !input.trim()) || isChecked
                    ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 dark:from-amber-500 dark:to-amber-600 dark:text-gray-900"
                }`}
                whileHover={!userInputs.some((input) => !input.trim()) && !isChecked ? { scale: 1.05 } : {}}
                whileTap={!userInputs.some((input) => !input.trim()) && !isChecked ? { scale: 0.95 } : {}}
              >
                <CheckIcon className="h-4 w-4" />
                Check Answers
              </motion.button>

              {isChecked && (
                <motion.button
                  onClick={nextLyric}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 dark:from-green-500 dark:to-green-600 dark:text-gray-900"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRightIcon className="h-4 w-4" />
                  Next Song
                </motion.button>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <motion.div
            className="inline-block bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border border-amber-200/50 dark:border-amber-700/50"
            animate={score > 0 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 ">
              <span className="text-amber-700 text-lg dark:text-amber-300 font-medium">Score:</span>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 
              bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-500">
                {score}/{LYRICS.length}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

