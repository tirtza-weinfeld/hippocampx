"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  Sparkles,
  Trophy,
  HelpCircleIcon,
  XIcon,
  MusicIcon,
  Music2Icon,
} from "lucide-react"

const WORDS = [
  {
    word: "ORPHEUS",
    hint: "The musician who tries to rescue his love from the underworld",
    funFact: "Orpheus was said to play music so beautiful that even rocks and trees were charmed by his songs!",
    character: "orpheus",
  },
  {
    word: "EURYDICE",
    hint: "The woman who follows the call down below",
    funFact: "Eurydice's name is pronounced you-RID-ih-see in the musical.",
    character: "eurydice",
  },
  {
    word: "HERMES",
    hint: "The messenger who narrates the ancient tale",
    funFact: "Hermes is known as the god of transitions and boundaries in Greek mythology.",
    character: "hermes",
  },
  {
    word: "PERSEPHONE",
    hint: "The goddess who brings the seasons",
    funFact: "When Persephone is in the underworld during winter, her mother Demeter mourns, causing plants to die.",
    character: "persephone",
  },
  {
    word: "HADES",
    hint: "The king of the underworld",
    funFact: "Hades is both the name of the god and the place he rules in Greek mythology.",
    character: "hades",
  },
  {
    word: "MELODY",
    hint: "A sequence of musical notes",
    funFact: "The word 'melody' comes from Greek words meaning 'singing' and 'song'.",
    character: "orpheus",
  },
  {
    word: "JOURNEY",
    hint: "A long trip or adventure",
    funFact: "Orpheus takes a long journey to find Eurydice in the underworld.",
    character: "hermes",
  },
  {
    word: "UNDERWORLD",
    hint: "The realm beneath the earth",
    funFact: "In Hadestown, the underworld is portrayed as an industrial factory town.",
    character: "hades",
  },
]

type LetterTile = {
  id: string
  letter: string
  index: number
}

// Guide steps for the tutorial
const GUIDE_STEPS = [
  {
    title: "Welcome to Spelling Challenge!",
    content: "In this game, you'll spell words from the world of Hadestown!",
    target: null,
    image: "orpheus",
  },
  {
    title: "Drag Letters",
    content: "Drag these scrambled letters...",
    target: "scrambled-letters",
    image: "eurydice",
  },
  {
    title: "Drop in Order",
    content: "...and drop them into these empty spaces to spell the word correctly.",
    target: "letter-targets",
    image: "hermes",
  },
  {
    title: "Use Hints",
    content: "Need help? Click the 'Show Hint' button for a clue about the word.",
    target: "hint-button",
    image: "persephone",
  },
  {
    title: "Check Your Answer",
    content: "When you've placed all the letters, click 'Check Answer' to see if you're correct!",
    target: "check-button",
    image: "hades",
  },
  {
    title: "Ready to Play!",
    content: "Now you're ready to start spelling! Good luck!",
    target: null,
    image: "orpheus",
  },
]

export default function SpellingChallengePage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [scrambledLetters, setScrambledLetters] = useState<LetterTile[]>([])
  const [placedLetters, setPlacedLetters] = useState<(LetterTile | null)[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [showFunFact, setShowFunFact] = useState(false)
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set())
  const [showCelebration, setShowCelebration] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [currentGuideStep, setCurrentGuideStep] = useState(0)
  const [firstVisit, setFirstVisit] = useState(true)
  const [highlightTarget, setHighlightTarget] = useState<string | null>(null)
  const [characterContext, setCharacterContext] = useState<string>("orpheus")
  const [showFloatingNotes, setShowFloatingNotes] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track screen size for responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const currentWord = WORDS[currentWordIndex]

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("hasVisitedSpellingChallenge")
    if (!hasVisited) {
      // Show guide on first visit
      setShowGuide(true)
      localStorage.setItem("hasVisitedSpellingChallenge", "true")
    }
    setFirstVisit(!hasVisited)
  }, [])

  useEffect(() => {
    if (currentWord) {
      resetGame()
      setCharacterContext(currentWord.character)
    }
  }, [currentWord])

  useEffect(() => {
    // Update highlight target when guide step changes
    if (showGuide && GUIDE_STEPS[currentGuideStep]) {
      setHighlightTarget(GUIDE_STEPS[currentGuideStep].target)
    } else {
      setHighlightTarget(null)
    }
  }, [currentGuideStep, showGuide])

  // Character effect when getting correct answers
  useEffect(() => {
    if (isCorrect) {
      if (currentWord.character === "orpheus") {
        setShowFloatingNotes(true)
        setTimeout(() => setShowFloatingNotes(false), 3000)
      }
    }
  }, [isCorrect, currentWord])

  const resetGame = () => {
    const letters = currentWord.word.split("").map((letter, index) => ({
      id: `${letter}-${index}-${Math.random()}`,
      letter,
      index,
    }))

    // Shuffle the letters
    const shuffled = [...letters].sort(() => Math.random() - 0.5)

    setScrambledLetters(shuffled)
    setPlacedLetters(Array(currentWord.word.length).fill(null))
    setIsCorrect(null)
    setShowHint(false)
    setShowFunFact(false)
  }

  const checkAnswer = () => {
    const currentAnswer = placedLetters.map((tile) => tile?.letter || "").join("")
    const isAnswerCorrect = currentAnswer === currentWord.word
    setIsCorrect(isAnswerCorrect)

    if (isAnswerCorrect) {
      if (!completedWords.has(currentWordIndex)) {
        const newCompletedWords = new Set(completedWords)
        newCompletedWords.add(currentWordIndex)
        setCompletedWords(newCompletedWords)
        setScore(score + 1)
      }
      setShowFunFact(true)

      if (score + 1 === WORDS.length && !completedWords.has(currentWordIndex)) {
        setTimeout(() => {
          setShowCelebration(true)
        }, 1000)
      }
    }
  }

  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % WORDS.length)
  }

  const prevWord = () => {
    setCurrentWordIndex((prev) => (prev - 1 + WORDS.length) % WORDS.length)
  }

  const handleDrop = (item: LetterTile, index: number) => {
    const newPlaced = [...placedLetters]
    const newScrambled = scrambledLetters.filter((t) => t.id !== item.id)

    // If there's already a tile in this position, move it back to scrambled
    if (newPlaced[index]) {
      newScrambled.push(newPlaced[index]!)
    }

    // Place the new tile in the target position
    newPlaced[index] = item
    setPlacedLetters(newPlaced)
    setScrambledLetters(newScrambled)
    setIsCorrect(null)
  }

  const handleLetterClick = (letter: LetterTile) => {
    // For mobile or simplified interaction - find the first empty slot
    const firstEmptyIndex = placedLetters.findIndex((item) => item === null)
    if (firstEmptyIndex !== -1) {
      handleDrop(letter, firstEmptyIndex)
    }
  }

  const handlePlacedLetterClick = (index: number) => {
    if (!isCorrect && placedLetters[index]) {
      // Return to scrambled letters on click
      const newPlaced = [...placedLetters]
      const tile = newPlaced[index]
      if (tile) {
        setScrambledLetters([...scrambledLetters, tile])
        newPlaced[index] = null
        setPlacedLetters(newPlaced)
        setIsCorrect(null)
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id)
    // Add a class to the element being dragged
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add("opacity-70", "scale-105", "shadow-lg", "z-50")
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    // Remove the class when drag ends
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove("opacity-70", "scale-105", "shadow-lg", "z-50")
    }
  }

  const nextGuideStep = () => {
    if (currentGuideStep < GUIDE_STEPS.length - 1) {
      setCurrentGuideStep(currentGuideStep + 1)
    } else {
      setShowGuide(false)
      setCurrentGuideStep(0)
    }
  }

  const prevGuideStep = () => {
    if (currentGuideStep > 0) {
      setCurrentGuideStep(currentGuideStep - 1)
    }
  }

  const closeGuide = () => {
    setShowGuide(false)
    setCurrentGuideStep(0)
  }

  // Helper function to get character-specific styles
  const getCharacterStyles = (character: string) => {
    switch (character) {
      case "orpheus":
        return "from-amber-300 to-amber-500 dark:from-amber-400 dark:to-amber-600 text-amber-950 dark:text-amber-950"
      case "eurydice":
        return "from-red-300 to-red-500 dark:from-red-400 dark:to-red-600 text-red-950 dark:text-red-950"
      case "hermes":
        return "from-blue-300 to-blue-500 dark:from-blue-400 dark:to-blue-600 text-blue-950 dark:text-blue-950"
      case "persephone":
        return "from-green-300 to-green-500 dark:from-green-400 dark:to-green-600 text-green-950 dark:text-green-950"
      case "hades":
        return "from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 text-gray-100 dark:text-gray-100"
      default:
        return "from-amber-300 to-amber-500 dark:from-amber-400 dark:to-amber-600 text-amber-950 dark:text-amber-950"
    }
  }

  if (!currentWord) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50 dark:bg-gray-900 text-amber-900 dark:text-amber-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
        >
          <RefreshCwIcon className="h-10 w-10 text-amber-500 dark:text-amber-400" />
        </motion.div>
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    )
  }

  // Character-specific background elements
  const CharacterBackground = () => {
    switch (characterContext) {
      case "orpheus":
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 opacity-20 dark:opacity-30">
              <MusicIcon className="w-12 h-12 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-20 dark:opacity-30">
              <Music2Icon className="w-12 h-12 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
        )
      case "eurydice":
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-10 opacity-20 dark:opacity-30">
              <div className="w-16 h-16 rounded-full"></div>
            </div>
            <div className="absolute bottom-1/4 right-10 opacity-20 dark:opacity-30">
              <div className="w-12 h-12 border-2 border-red-500 dark:border-red-400 rounded-full"></div>
            </div>
          </div>
        )
      case "hermes":
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-1/4 opacity-20 dark:opacity-30">
              <div className="w-16 h-8 border-2 border-blue-500 dark:border-blue-400 rounded-full transform rotate-45"></div>
            </div>
            <div className="absolute bottom-10 left-1/4 opacity-20 dark:opacity-30">
              <div className="w-16 h-8 border-2 border-blue-500 dark:border-blue-400 rounded-full transform -rotate-45"></div>
            </div>
          </div>
        )
      case "persephone":
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-1/3 opacity-20 dark:opacity-30">
              <div className="w-8 h-8 text-green-500 dark:text-green-400">🌿</div>
            </div>
            <div className="absolute bottom-10 right-1/3 opacity-20 dark:opacity-30">
              <div className="w-8 h-8 text-green-500 dark:text-green-400">🌱</div>
            </div>
            <div className="absolute top-1/3 right-10 opacity-20 dark:opacity-30">
              <div className="w-8 h-8 text-green-500 dark:text-green-400">🌼</div>
            </div>
          </div>
        )
      case "hades":
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-10 opacity-20 dark:opacity-30">
              <div className="w-4 h-16 bg-gray-500 dark:bg-gray-400"></div>
            </div>
            <div className="absolute bottom-1/4 right-10 opacity-20 dark:opacity-30">
              <div className="w-4 h-16 bg-gray-500 dark:bg-gray-400"></div>
            </div>
            <div className="absolute bottom-10 left-1/4 opacity-20 dark:opacity-30">
              <div className="w-16 h-4 bg-gray-500 dark:bg-gray-400"></div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Floating musical notes for Orpheus
  const FloatingNotes = () => {
    if (!showFloatingNotes) return null

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-500 dark:text-amber-400 text-2xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: [0, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.2,
            }}
          >
            {i % 2 === 0 ? "♪" : "♫"}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <main className="min-h-screen py-8 bg-amber-50 dark:bg-gray-900 text-amber-900 dark:text-amber-100 relative overflow-hidden">
      {/* Themed background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-white/80 to-amber-50/50 dark:from-gray-900 dark:via-gray-950 dark:to-amber-950/30 animate-gradient"></div>

        {/* Railroad pattern more visible in dark mode */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="h-full w-full railroad-pattern animate-railroad"></div>
        </div>

        {/* Character-specific decorations */}
        <CharacterBackground />
      </div>

      {/* Animated musical notes for correct Orpheus answers */}
      <FloatingNotes />


      <div className="container mx-auto px-4 max-w-4xl">
        {/* Fixed navigation buttons - repositioned to the bottom corners for better reach */}
        <div className="fixed bottom-6 right-6 flex flex-row gap-3 z-30">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="touch-target">
            <Button
              onClick={prevWord}
              className="rounded-full w-16 h-16 shadow-xl bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 text-white"
              aria-label="Previous spelling word"
            >
              <ArrowLeftIcon className="h-8 w-8" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="touch-target">
            <Button
              onClick={nextWord}
              className="rounded-full w-16 h-16 shadow-xl bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 text-white"
              aria-label="Next spelling word"
            >
              <ArrowRightIcon className="h-8 w-8" />
            </Button>
          </motion.div>
        </div>

        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-3 text-amber-600 dark:text-amber-400"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            Spelling Challenge
          </motion.h1>
          <p className="text-amber-700/80 dark:text-amber-300/80 mb-4">Drag and drop the letters to spell the word!</p>

          {/* Help button to show guide */}
          <Button
            variant="outline"
            size="lg"
            className="
            cursor-pointer 
            transition-all duration-300
            hover:scale-105
            text-base
             border-amber-500
              text-amber-600
              hover:text-amber-700
             dark:border-amber-400 dark:text-amber-400 bg-amber-100/10 hover:bg-amber-100/20 dark:hover:bg-amber-900/30 rounded-full touch-target"
            onClick={() => setShowGuide(true)}
          >
            <HelpCircleIcon className="h-5 w-5 mr-2" /> How to Play
          </Button>
        </div>

        {/* Main game area - more rounded and playful */}
        <Card className="max-w-2xl mx-auto p-6 md:p-8 bg-white dark:bg-gray-800 border-amber-300 dark:border-amber-700/50 rounded-2xl shadow-xl">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-amber-700 dark:text-amber-300 font-medium">Progress</span>
              <div className="flex items-center space-x-2">
                <motion.span
                  key={currentWordIndex}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-amber-700 dark:text-amber-300 font-medium"
                >
                  {currentWordIndex + 1}/{WORDS.length}
                </motion.span>
              </div>
            </div>
            <Progress
              value={((currentWordIndex + 1) / WORDS.length) * 100}
              className="h-3 bg-amber-100 dark:bg-gray-700"
              indicatorClassName="bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700"
            />
          </div>

          {/* Hint section with more playful design */}
          <div className="mb-8">
            <Button
              id="hint-button"
              variant="ghost"
              size="lg"
              className={`text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 mb-2 rounded-full ${highlightTarget === "hint-button" ? "ring-4 ring-yellow-400/50 dark:ring-yellow-400/30 animate-pulse" : ""}`}
              onClick={() => {
                setShowHint(!showHint)
              }}
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200/60 dark:from-amber-900/40 dark:to-amber-800/30 border border-amber-300/40 dark:border-amber-700/40 text-amber-800 dark:text-amber-200"
                >
                  {currentWord.hint}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Letter tiles - bigger and more spaced for easier use */}
          <div className="mb-8">
            <div
              id="letter-targets"
              className={`flex justify-center mb-8 ${highlightTarget === "letter-targets" ? "ring-4 ring-yellow-400/50 dark:ring-yellow-400/30 p-2 rounded-lg animate-pulse" : ""}`}
              aria-label="Drop letters here to spell the word"
            >
              <div className="flex flex-wrap justify-center gap-3">
                {placedLetters.map((tile, index) => (
                  <div
                    key={`target-${index}`}
                    className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 touch-target
                      ${
                        tile
                          ? `border-${currentWord.character} bg-gradient-to-br ${getCharacterStyles(currentWord.character)} shadow-md`
                          : "border-amber-300 dark:border-amber-700/50 bg-amber-50 dark:bg-gray-700/50"
                      }`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.add("border-green-500", "bg-green-100/30", "scale-110", "shadow-lg")
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("border-green-500", "bg-green-100/30", "scale-110", "shadow-lg")
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove("border-green-500", "bg-green-100/30", "scale-110", "shadow-lg")
                      const tileId = e.dataTransfer.getData("text/plain")
                      const draggedTile = scrambledLetters.find((t) => t.id === tileId)

                      // If dragging from scrambled letters
                      if (draggedTile) {
                        handleDrop(draggedTile, index)
                      }
                      // If dragging from another target box
                      else {
                        const sourceIndexStr = e.dataTransfer.getData("source-index")
                        if (sourceIndexStr) {
                          const sourceIndex = Number.parseInt(sourceIndexStr)
                          const sourceTile = placedLetters[sourceIndex]
                          if (sourceTile) {
                            // Create a new array with the updated placements
                            const newPlaced = [...placedLetters]

                            // Swap the letters between boxes
                            const targetTile = newPlaced[index]
                            newPlaced[sourceIndex] = targetTile
                            newPlaced[index] = sourceTile

                            setPlacedLetters(newPlaced)
                            setIsCorrect(null)
                          }
                        }
                      }
                    }}
                    aria-label={tile ? `Letter ${tile.letter}` : `Empty letter slot ${index + 1}`}
                    onClick={() => handlePlacedLetterClick(index)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handlePlacedLetterClick(index)
                      }
                    }}
                  >
                    {tile && (
                      <motion.div
                        className="w-full h-full flex items-center justify-center font-bold text-2xl cursor-pointer select-none"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        draggable={!isCorrect}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("source-index", index.toString())
                          e.currentTarget.classList.add("opacity-70", "scale-105", "shadow-lg", "z-50")
                        }}
                        onDragEnd={(e) => {
                          e.currentTarget.classList.remove("opacity-70", "scale-105", "shadow-lg", "z-50")
                        }}
                      >
                        {tile.letter}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scrambled letters section */}
            <div
              id="scrambled-letters"
              className={`flex justify-center mb-8 ${highlightTarget === "scrambled-letters" ? "ring-4 ring-yellow-400/50 dark:ring-yellow-400/30 p-2 rounded-lg animate-pulse" : ""}`}
              aria-label="Drag these letters to spell the word"
            >
              <div className="flex flex-wrap justify-center gap-3">
                {scrambledLetters.map((tile) => (
                  <motion.div
                    key={tile.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-bold text-2xl rounded-lg cursor-pointer select-none shadow-md 
                      bg-gradient-to-br ${getCharacterStyles(currentWord.character)} touch-target`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, tile.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleLetterClick(tile)}
                    aria-label={`Letter ${tile.letter}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleLetterClick(tile)
                      }
                    }}
                  >
                    {tile.letter}
                  </motion.div>
                ))}
                {scrambledLetters.length === 0 && (
                  <p className="text-amber-700/70 dark:text-amber-300/70 italic font-medium">
                    All letters have been placed!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Feedback section - more engaging and kid-friendly */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`text-center p-5 rounded-xl mb-6 ${
                  isCorrect
                    ? "bg-gradient-to-br from-green-100 to-green-200/60 dark:from-green-900/40 dark:to-green-800/30 border border-green-300/40 dark:border-green-700/40 text-green-800 dark:text-green-300"
                    : "bg-gradient-to-br from-amber-100 to-amber-200/60 dark:from-amber-900/40 dark:to-amber-800/30 border border-amber-300/40 dark:border-amber-700/40 text-amber-800 dark:text-amber-300"
                }`}
              >
                {isCorrect ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center mb-3">
                      <Sparkles className="h-6 w-6 mr-2 text-yellow-500 dark:text-yellow-400 animate-pulse" />
                      <span className="font-bold text-xl">Correct! Great job!</span>
                      <Sparkles className="h-6 w-6 ml-2 text-yellow-500 dark:text-yellow-400 animate-pulse" />
                    </div>
                    {showFunFact && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 text-green-700 dark:text-green-300"
                      >
                        <h4 className="font-bold text-lg mb-1">Fun Fact:</h4>
                        <p>{currentWord.funFact}</p>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="font-medium text-lg">Not quite right. Try again!</p>
                    <p className="text-sm mt-2">
                      Hint: Double-check the order of your letters or click on a letter to return it.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons - bigger and more kid-friendly */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
      
              size="lg"
              className="
              cursor-pointer 
               hover:scale-105
                transition-all duration-300
                bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-400 dark:to-red-900 text-white text-base rounded-full
              touch-target"
              onClick={() => {
                resetGame()
              }}
            >
              <RefreshCwIcon className="mr-2 h-5 w-5" /> Reset
            </Button>

            <Button
              id="check-button"
              size="lg"
              className={` 
                hover:scale-105
                transition-all duration-300
                bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-400 dark:to-red-900 text-white text-base rounded-full ${
                placedLetters.some((tile) => tile === null) ? "opacity-70" : " cursor-pointer " 
              } ${highlightTarget === "check-button" ? "ring-4 ring-yellow-400/50 dark:ring-yellow-400/30 animate-pulse" : ""} touch-target`}
              onClick={checkAnswer}
              disabled={placedLetters.some((tile) => tile === null)}
            >
              Check Answer
            </Button>

            {isCorrect && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white text-base rounded-full touch-target"
                  onClick={nextWord}
                >
                  Next Word
                </Button>
              </motion.div>
            )}
          </div>

          {/* Score display - more celebratory */}
          <motion.div
            className="mt-8 text-center"
            animate={score > 0 ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 1, repeat: score > 0 ? 3 : 0 }}
          >
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/30 rounded-full shadow-inner">
              <Trophy className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
              <span className="font-bold text-xl text-amber-700 dark:text-amber-300">
                Score: {score}/{WORDS.length}
              </span>
            </div>
          </motion.div>
        </Card>
      </div>

      {/* Guide Modal - more kid-friendly with character images */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            onClick={(e) => e.target === e.currentTarget && closeGuide()}
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 20 }}
              className="p-6 rounded-2xl max-w-md w-full bg-white dark:bg-gray-800 border-2 border-amber-300 dark:border-amber-700/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="guide-title"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 id="guide-title" className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {GUIDE_STEPS[currentGuideStep].title}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeGuide}
                  className="h-9 w-9 rounded-full text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  aria-label="Close guide"
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-6 flex flex-col items-center">
                {/* Character image based on the step */}
                <div
                  className={`w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br ${getCharacterStyles(GUIDE_STEPS[currentGuideStep].image || "orpheus")}`}
                >
                  {GUIDE_STEPS[currentGuideStep].image === "orpheus" && <MusicIcon className="h-12 w-12" />}
                  {GUIDE_STEPS[currentGuideStep].image === "eurydice" && <span className="text-4xl">🌹</span>}
                  {GUIDE_STEPS[currentGuideStep].image === "hermes" && <span className="text-4xl">🪄</span>}
                  {GUIDE_STEPS[currentGuideStep].image === "persephone" && <span className="text-4xl">🌿</span>}
                  {GUIDE_STEPS[currentGuideStep].image === "hades" && <span className="text-4xl">👑</span>}
                </div>

                <p className="text-lg text-amber-900 dark:text-amber-100 text-center">
                  {GUIDE_STEPS[currentGuideStep].content}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={prevGuideStep}
                  disabled={currentGuideStep === 0}
                  className="border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400 disabled:opacity-40 rounded-full"
                >
                  Previous
                </Button>

                <div className="flex space-x-1.5">
                  {GUIDE_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        currentGuideStep === index ? "bg-amber-500 dark:bg-amber-400" : "bg-amber-300 dark:bg-amber-700"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  className={`rounded-full ${
                    currentGuideStep === GUIDE_STEPS.length - 1
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white"
                      : "border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400 bg-transparent"
                  }`}
                  onClick={nextGuideStep}
                  variant={currentGuideStep === GUIDE_STEPS.length - 1 ? "default" : "outline"}
                >
                  {currentGuideStep === GUIDE_STEPS.length - 1 ? "Start Playing" : "Next"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Modal - more exciting! */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="p-8 rounded-2xl max-w-md text-center bg-white dark:bg-gray-800 border-4 border-yellow-400 dark:border-yellow-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="celebration-title"
            >
              {/* Flying confetti effect */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    scale: Math.random() * 1.5 + 0.5,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                  }}
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                    background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                    zIndex: 10,
                  }}
                />
              ))}

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="mx-auto mb-6 relative"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 rounded-full bg-yellow-400/20 dark:bg-yellow-400/30 blur-xl"
                />
                <Trophy className="h-24 w-24 text-yellow-400 dark:text-yellow-500 relative z-10" />
              </motion.div>

              <h2 id="celebration-title" className="text-3xl font-bold mb-4 text-amber-600 dark:text-amber-400">
                Amazing Job!
              </h2>

              <p className="mb-6 text-xl text-amber-800 dark:text-amber-200">
                You've completed all the spelling challenges! You're a true Hadestown spelling champion!
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white text-lg rounded-full px-8 py-3"
                onClick={() => setShowCelebration(false)}
              >
                Continue Playing
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

