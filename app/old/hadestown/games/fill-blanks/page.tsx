"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookIcon, ArrowLeftIcon, ArrowRightIcon, StarIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

// Fill in the Blanks Game Data
const FILL_BLANKS_SENTENCES = [
  {
    sentence: "Orpheus played his _____ to charm the stones and trees.",
    answer: "lyre",
    options: ["lyre", "guitar", "flute", "drum"],
  },
  {
    sentence: "_____ is the wife of Hades and brings spring when she returns.",
    answer: "Persephone",
    options: ["Persephone", "Eurydice", "Athena", "Aphrodite"],
  },
  {
    sentence: "The _____ is the underground realm ruled by Hades.",
    answer: "underworld",
    options: ["underworld", "mountain", "forest", "ocean"],
  },
  {
    sentence: "Orpheus tried to _____ on his difficult journey to save Eurydice.",
    answer: "persevere",
    options: ["persevere", "surrender", "sleep", "dance"],
  },
  {
    sentence: "_____ told the story of Orpheus and Eurydice.",
    answer: "Hermes",
    options: ["Hermes", "Zeus", "Apollo", "Poseidon"],
  },
]

export default function FillInTheBlanksGame() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [completedSentences, setCompletedSentences] = useState<Set<number>>(new Set())
  const [showCelebration, setShowCelebration] = useState(false)
  const [isDropTargetActive, setIsDropTargetActive] = useState(false)

  const currentSentence = FILL_BLANKS_SENTENCES[currentIndex]

  const checkAnswer = () => {
    if (!selectedAnswer) return

    const correct = selectedAnswer === currentSentence.answer
    setIsCorrect(correct)

    if (correct && !completedSentences.has(currentIndex)) {
      setScore((prev) => prev + 1)
      setCompletedSentences(new Set([...completedSentences, currentIndex]))

      // Show celebration if all sentences are completed
      if (completedSentences.size + 1 === FILL_BLANKS_SENTENCES.length) {
        setTimeout(() => setShowCelebration(true), 1000)
      }
    }
  }

  const nextSentence = () => {
    setCurrentIndex((prev) => (prev + 1) % FILL_BLANKS_SENTENCES.length)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setIsDropTargetActive(false)
  }

  const prevSentence = () => {
    setCurrentIndex((prev) => (prev - 1 + FILL_BLANKS_SENTENCES.length) % FILL_BLANKS_SENTENCES.length)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setIsDropTargetActive(false)
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, option: string) => {
    if (isCorrect !== null) return

    e.dataTransfer.setData("text/plain", option)

    // Add visual feedback
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add("opacity-70", "scale-105", "shadow-lg", "z-50")
    }
  }

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    // Remove visual feedback
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove("opacity-70", "scale-105", "shadow-lg", "z-50")
    }
  }

  // Handle drag over for the blank
  const handleDragOver = (e: React.DragEvent) => {
    if (isCorrect !== null) return

    e.preventDefault()
    setIsDropTargetActive(true)
  }

  // Handle drag leave for the blank
  const handleDragLeave = () => {
    setIsDropTargetActive(false)
  }

  // Handle drop for the blank
  const handleDrop = (e: React.DragEvent) => {
    if (isCorrect !== null) return

    e.preventDefault()
    setIsDropTargetActive(false)

    const option = e.dataTransfer.getData("text/plain")
    if (option) {
      setSelectedAnswer(option)
    }
  }

  // Format the sentence with a blank
  const parts = currentSentence.sentence.split("_____")

  return (
    <main className="min-h-screen py-8 bg-gradient-to-b from-background to-background/90 text-foreground dark:from-gray-950 dark:to-amber-950/80">
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-amber-800/30 dark:via-gray-900 dark:to-red-800/30 animate-gradient"></div>
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-amber-100/10 to-transparent dark:from-amber-700/30 dark:to-transparent"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/5 to-transparent dark:from-amber-600/20 dark:to-transparent"></div>
        <div className="railroad-pattern absolute inset-0 opacity-10 dark:opacity-20"></div>
      </div>

  

      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center gap-2 mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <BookIcon className="h-6 w-6 text-primary dark:text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-600">
              Fill in the Blanks
            </h1>
            <BookIcon className="h-6 w-6 text-primary dark:text-amber-400" />
          </motion.div>
          <p className="text-muted-foreground dark:text-amber-300 text-readable">
            Complete the sentences by dragging the correct word to the blank
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-gradient-card border-primary/30 p-6 shadow-lg ember-glow">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-primary dark:text-amber-400 font-medium">Progress</span>
              <span className="text-primary dark:text-amber-400 font-medium">
                {currentIndex + 1}/{FILL_BLANKS_SENTENCES.length}
              </span>
            </div>
            <Progress value={((currentIndex + 1) / FILL_BLANKS_SENTENCES.length) * 100} className="h-2 bg-card" />
          </div>

          <div className="mb-8 text-center min-h-[300px]">
            <motion.h2
              key={`sentence-${currentIndex}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-500 mb-4"
            >
              Fill in the Blank
            </motion.h2>

            {/* Sentence with drop target */}
            <motion.div
              key={currentSentence.sentence}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg md:text-xl text-gray-800 dark:text-gray-200 mb-8 p-5 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl shadow-inner"
            >
              {parts[0]}
              <span
                className={`inline-block min-w-[100px] px-2 py-1 mx-1 border-b-2 border-dashed rounded transition-all ${
                  isDropTargetActive
                    ? "border-green-500 bg-green-100/30 dark:bg-green-900/30"
                    : selectedAnswer
                      ? isCorrect === true
                        ? "border-green-500 bg-green-100/30 dark:bg-green-900/30"
                        : isCorrect === false
                          ? "border-red-500 bg-red-100/30 dark:bg-red-900/30"
                          : "border-amber-500 bg-amber-100/30 dark:bg-amber-900/30"
                      : "border-amber-500"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedAnswer || ""}
              </span>
              {parts[1]}
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {currentSentence.options.map((option, index) => (
                <div
                  key={index}
                  draggable={isCorrect === null}
                  onDragStart={(e) => handleDragStart(e, option)}
                  onDragEnd={handleDragEnd}
                >
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl text-center cursor-pointer transition-colors shadow-sm text-lg ${
                      selectedAnswer === option
                        ? "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shadow-md"
                        : "bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                    } ${
                      isCorrect !== null && option === currentSentence.answer
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 shadow-md"
                        : isCorrect !== null && selectedAnswer === option && option !== currentSentence.answer
                          ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 shadow-md"
                          : ""
                    }`}
                    onClick={() => {
                      if (isCorrect === null) {
                        setSelectedAnswer(option)
                      }
                    }}
                    disabled={isCorrect !== null}
                  >
                    {option}
                  </motion.button>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                  onClick={checkAnswer}
                  disabled={!selectedAnswer || isCorrect !== null}
                >
                  Check Answer
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Fixed navigation buttons */}
          <div className="fixed bottom-6 right-6 flex flex-row gap-3 z-30">
            <motion.div
              whileHover={{ scale: 1.15, rotate: -5 }}
              whileTap={{ scale: 0.9, rotate: -10 }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                y: { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 400, damping: 10 },
              }}
            >
              <Button
                onClick={prevSentence}
                className="rounded-full w-14 h-14 shadow-xl bg-gradient-primary text-primary-foreground hover:shadow-primary/30 hover:shadow-xl"
                aria-label="Previous sentence"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9, rotate: 10 }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                y: { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut", delay: 0.5 },
                scale: { type: "spring", stiffness: 400, damping: 10 },
              }}
            >
              <Button
                onClick={nextSentence}
                className={`rounded-full w-14 h-14 shadow-xl ${
                  isCorrect !== null ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-primary"
                } text-primary-foreground hover:shadow-primary/30 hover:shadow-xl`}
                aria-label="Next sentence"
              >
                <ArrowRightIcon className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>

          <div className="mt-6 text-center">
            <motion.p
              className="text-primary dark:text-amber-400 font-medium text-lg"
              animate={score > 0 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              Score: {score}/{FILL_BLANKS_SENTENCES.length}
            </motion.p>
          </div>
        </Card>

        {/* Celebration Modal */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCelebration(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="inline-block mb-4"
                  >
                    <StarIcon className="h-16 w-16 text-yellow-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">All Blanks Filled!</h2>
                  <p className="text-gray-700 dark:text-gray-200 mb-6">
                    You&apos;ve successfully filled in all the blanks! Your knowledge of Hadestown vocabulary is impressive!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white dark:text-gray-900 rounded-full shadow-md"
                    onClick={() => setShowCelebration(false)}
                  >
                    Continue Learning
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

