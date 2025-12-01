"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  HelpCircleIcon,
  BookIcon,
  ShuffleIcon,
  PuzzleIcon,
  ListTodoIcon,
  RefreshCwIcon,
  StarIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

// Vocabulary Quiz Data
const VOCABULARY_ITEMS = [
  {
    word: "Melody",
    definition: "A sequence of musical notes that form a satisfying pattern",
    example: "Orpheus played a beautiful melody on his lyre.",
    options: [
      "A sequence of musical notes that form a satisfying pattern",
      "A loud sound made by many instruments",
      "A type of musical instrument",
      "A group of singers",
    ],
  },
  {
    word: "Underworld",
    definition: "The world of the dead, located beneath the world of the living",
    example: "Hades rules the underworld with Persephone by his side.",
    options: [
      "The world of the dead, located beneath the world of the living",
      "A secret place where criminals hide",
      "A subway system in a big city",
      "A fantasy world in a video game",
    ],
  },
  {
    word: "Fate",
    definition: "The development of events beyond a person's control",
    example: "The Fates determined the destiny of every mortal and immortal.",
    options: [
      "The development of events beyond a person's control",
      "A type of celebration or festival",
      "A decision made by a king or queen",
      "A journey to a faraway place",
    ],
  },
  {
    word: "Lyre",
    definition: "A stringed musical instrument like a small U-shaped harp",
    example: "Orpheus was known for playing the lyre better than anyone else.",
    options: [
      "A stringed musical instrument like a small U-shaped harp",
      "A type of bird that sings beautifully",
      "A tool used for digging in the ground",
      "A special kind of boat",
    ],
  },
  {
    word: "Persevere",
    definition: "To continue doing something despite difficulties or delays",
    example: "Orpheus had to persevere on his difficult journey through the underworld.",
    options: [
      "To continue doing something despite difficulties or delays",
      "To give up when things get hard",
      "To celebrate a victory",
      "To sleep for a long time",
    ],
  },
]

// Word Matching Game Data
const MATCHING_PAIRS = [
  { word: "Melody", match: "Musical pattern" },
  { word: "Underworld", match: "Hades' realm" },
  { word: "Lyre", match: "Orpheus' instrument" },
  { word: "Eurydice", match: "Orpheus' love" },
  { word: "Persephone", match: "Goddess of spring" },
  { word: "Hermes", match: "Divine messenger" },
  { word: "Railroad", match: "Path to Hadestown" },
  { word: "Fates", match: "Three sisters" },
]

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

// Word Categories Game Data
const WORD_CATEGORIES = [
  {
    category: "Characters",
    words: ["Orpheus", "Eurydice", "Hermes", "Persephone", "Hades"],
  },
  {
    category: "Places",
    words: ["Hadestown", "Underworld", "Railroad", "River Styx", "Above Ground"],
  },
  {
    category: "Music Terms",
    words: ["Melody", "Lyre", "Harmony", "Rhythm", "Song"],
  },
  {
    category: "Themes",
    words: ["Love", "Fate", "Hope", "Doubt", "Perseverance"],
  },
]

export default function VocabularyGamesPage() {
  const [activeTab, setActiveTab] = useState("quiz")
  const [showGuide, setShowGuide] = useState(false)

  return (
    <main className="@container min-h-screen py-8 bg-gradient-to-b from-amber-50/30 to-amber-100/20 dark:from-gray-900 dark:to-amber-950/30 text-foreground">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-white/0 to-amber-500/5 dark:from-amber-500/10 dark:via-gray-900/0 dark:to-amber-500/10 animate-gradient-shift"></div>
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-amber-100/10 to-transparent dark:from-amber-700/10 dark:to-transparent"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-600/10 dark:to-transparent"></div>
        <div className="railroad-pattern absolute inset-0 opacity-5 dark:opacity-10"></div>
      </div>


      <div className="container mx-auto px-4 relative">
        {/* Header section */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-block relative mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-500/20 rounded-lg blur-md"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-8 py-4 shadow-lg">
              <motion.div
                className="flex items-center justify-center gap-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <BookIcon className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-500">
                  Vocabulary Games
                </h1>
                <motion.div
                  animate={{ rotate: [0, -10, 0, 10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <BookIcon className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          <motion.p
            className="text-lg text-gray-600 dark:text-amber-300/90 max-w-xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="font-medium">Discover amazing words</span> from the world of Hadestown!
          </motion.p>

          <motion.div
            className="flex justify-center gap-2 mt-3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {["Fun!", "Learn!", "Play!", "Explore!"].map((word, i) => (
              <motion.span
                key={word}
                className="inline-block text-xs font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 px-2 py-1 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: i * 0.2,
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* How to Play button */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 
            shadow-md hover:shadow-lg transition-all duration-300 
            text-amber-600 dark:text-amber-400
            border border-amber-500/20 dark:border-amber-600/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HelpCircleIcon className="h-5 w-5" />
            <span>How to Play</span>
          </motion.button>
        </div>

        {/* Game container */}
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg border-none">
          {/* Game tabs */}
          <div className="flex overflow-x-auto snap-x scrollbar-hide rounded-t-lg 
          bg-gradient-to-r from-amber-200/40 to-amber-700/50 ">
            <TabButton
              active={activeTab === "quiz"}
              onClick={() => setActiveTab("quiz")}
              icon={<ListTodoIcon className="h-4 w-4" />}
              label="Quiz"
            />
            <TabButton
              active={activeTab === "matching"}
              onClick={() => setActiveTab("matching")}
              icon={<PuzzleIcon className="h-4 w-4" />}
              label="Matching"
            />
            <TabButton
              active={activeTab === "fill-blanks"}
              onClick={() => setActiveTab("fill-blanks")}
              icon={<BookIcon className="h-4 w-4" />}
              label="Fill Blanks"
            />
            <TabButton
              active={activeTab === "categories"}
              onClick={() => setActiveTab("categories")}
              icon={<ShuffleIcon className="h-4 w-4" />}
              label="Categories"
            />
          </div>

          {/* Game content */}
          <CardContent className="p-6 bg-white dark:bg-gray-800">
            <AnimatePresence mode="wait">
              {activeTab === "quiz" && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <VocabularyQuiz />
                </motion.div>
              )}

              {activeTab === "matching" && (
                <motion.div
                  key="matching"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WordMatchingGame />
                </motion.div>
              )}

              {activeTab === "fill-blanks" && (
                <motion.div
                  key="fill-blanks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FillInTheBlanksGame />
                </motion.div>
              )}

              {activeTab === "categories" && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WordCategoriesGame />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Game Guide Modal */}
      <AnimatePresence>
        {showGuide && <GameGuide onClose={() => setShowGuide(false)} activeTab={activeTab} />}
      </AnimatePresence>
    </main>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 min-w-[100px] flex items-center justify-center gap-2 py-4 px-3 transition-all duration-300 ${
        active ? "text-white" : "text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400"
      }`}
    >
      {active && (
        <motion.div
          layoutId="tab-background"
          className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  )
}

// Game Guide Component
function GameGuide({ onClose, activeTab }: { onClose: () => void; activeTab: string }) {
  const guides = {
    quiz: {
      title: "Vocabulary Quiz",
      steps: [
        "Read the word at the top of the screen",
        "Choose the correct definition from the options",
        "Click 'Check Answer' to see if you're right",
        "Use the navigation buttons to move between words",
        "Try to get all the words correct!",
      ],
    },
    matching: {
      title: "Word Matching Game",
      steps: [
        "Click on a word from the top section",
        "Then click on its matching definition below",
        "Matched pairs will turn green",
        "Try to match all pairs with the fewest attempts",
        "Reset the game anytime to try again",
      ],
    },
    "fill-blanks": {
      title: "Fill in the Blanks",
      steps: [
        "Read the sentence with a missing word",
        "Choose the correct word from the options",
        "Click 'Check Answer' to see if you're right",
        "Use the navigation buttons to try more sentences",
        "Try to fill in all the blanks correctly!",
      ],
    },
    categories: {
      title: "Word Categories",
      steps: [
        "Click on a word from the available words",
        "Then click on the category where it belongs",
        "Sort all words into their correct categories",
        "Click 'Check Answers' when you're done",
        "Try to categorize all words correctly!",
      ],
    },
  }

  const currentGuide = guides[activeTab as keyof typeof guides]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">How to Play: {currentGuide.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {currentGuide.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <p className="text-gray-700 dark:text-gray-200">{step}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white dark:text-gray-900 rounded-full shadow-md"
            onClick={onClose}
          >
            Got it!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Vocabulary Quiz Component
function VocabularyQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showExample, setShowExample] = useState(false)
  const [score, setScore] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set())

  const currentItem = VOCABULARY_ITEMS[currentIndex]

  const checkAnswer = () => {
    if (!selectedOption) return

    const correct = selectedOption === currentItem.definition
    setIsCorrect(correct)

    if (correct && !completedWords.has(currentIndex)) {
      setScore(score + 1)
      setCompletedWords(new Set([...completedWords, currentIndex]))

      // Show celebration if all words are completed
      if (completedWords.size + 1 === VOCABULARY_ITEMS.length) {
        setTimeout(() => setShowCelebration(true), 1000)
      }
    }
  }

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % VOCABULARY_ITEMS.length)
    setSelectedOption(null)
    setIsCorrect(null)
    setShowExample(false)
  }

  const prevWord = () => {
    setCurrentIndex((prev) => (prev - 1 + VOCABULARY_ITEMS.length) % VOCABULARY_ITEMS.length)
    setSelectedOption(null)
    setIsCorrect(null)
    setShowExample(false)
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-amber-600 dark:text-amber-400 font-medium">Progress</span>
          <span className="text-amber-600 dark:text-amber-400 font-medium">
            {currentIndex + 1}/{VOCABULARY_ITEMS.length}
          </span>
        </div>

        <Progress
              value={((currentIndex + 1) / VOCABULARY_ITEMS.length) * 100} 
              className="h-3 bg-amber-100 dark:bg-gray-700"
              indicatorClassName="bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700"
            />
      </div>

      <div className="mb-8 text-center min-h-[300px]">
        <motion.h2
          key={`word-${currentItem.word}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-500 mb-4"
        >
          {currentItem.word}
        </motion.h2>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            className="text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 mb-4"
            onClick={() => setShowExample(!showExample)}
          >
            <HelpCircleIcon className="mr-2 h-4 w-4" />
            {showExample ? "Hide Example" : "Show Example"}
          </Button>
        </motion.div>

        <AnimatePresence>
          {showExample && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-md mb-6 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 shadow-inner"
            >
              <p className="italic">{currentItem.example}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3 mb-8">
          {currentItem.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                className={`w-full text-left p-5 h-auto rounded-xl transition-all duration-300 shadow-sm ${
                  selectedOption === option
                    ? "bg-amber-100 dark:bg-amber-900/50 shadow-md"
                    : "bg-white dark:bg-gray-900/50 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                } ${
                  isCorrect !== null && option === currentItem.definition
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 shadow-md"
                    : isCorrect !== null && selectedOption === option && option !== currentItem.definition
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 shadow-md"
                      : "text-gray-700 dark:text-gray-200"
                }`}
                onClick={() => {
                  if (isCorrect === null) {
                    setSelectedOption(option)
                  }
                }}
                disabled={isCorrect !== null}
              >
                <div className="flex items-start">
                  <span className="mr-3 font-bold text-amber-600 dark:text-amber-400 text-lg">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-base">{option}</span>
                  {isCorrect !== null && option === currentItem.definition && (
                    <CheckIcon className="ml-auto h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                  {isCorrect !== null && selectedOption === option && option !== currentItem.definition && (
                    <XIcon className="ml-auto h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={checkAnswer}
              disabled={!selectedOption || isCorrect !== null}
              className={`
              bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-700 text-white 
              dark:text-gray-900 shadow-md px-8 py-3 h-auto text-lg rounded-full 
      
              cursor-pointer
              
              `
            
            }
            >
              Check Answer
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Navigation buttons */}
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
            onClick={prevWord}
            className="rounded-full w-14 h-14 shadow-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white dark:text-gray-900 hover:shadow-amber-500/30 hover:shadow-xl"
            aria-label="Previous word"
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
            onClick={nextWord}
            className={`rounded-full w-14 h-14 shadow-xl ${
              isCorrect !== null
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-amber-500 to-amber-600"
            } text-white dark:text-gray-900 hover:shadow-amber-500/30 hover:shadow-xl`}
            aria-label="Next word"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      <div className="mt-6 text-center">
        <motion.p
          className="text-amber-600 dark:text-amber-400 font-medium text-lg"
          animate={score > 0 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          Score: {score}/{VOCABULARY_ITEMS.length}
        </motion.p>
      </div>

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
                <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">Congratulations!</h2>
                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  You&apos;ve completed all the vocabulary words! Your knowledge of Hadestown vocabulary is impressive!
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
  )
}

// Word Matching Game Component
function WordMatchingGame() {
  // Initialize with shuffled arrays - no effect needed
  const [words, setWords] = useState<string[]>(() =>
    MATCHING_PAIRS.map((pair) => pair.word).sort(() => Math.random() - 0.5)
  )
  const [definitions, setDefinitions] = useState<string[]>(() =>
    MATCHING_PAIRS.map((pair) => pair.match).sort(() => Math.random() - 0.5)
  )
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<{ [key: string]: string }>({})
  const [attempts, setAttempts] = useState(0)
  const [celebrationDismissed, setCelebrationDismissed] = useState(false)

  // Derive celebration state - show when complete AND not dismissed
  const isGameComplete = Object.keys(matchedPairs).length === MATCHING_PAIRS.length * 2
  const showCelebration = isGameComplete && !celebrationDismissed

  function dismissCelebration() {
    setCelebrationDismissed(true)
  }

  function resetGame() {
    setWords(MATCHING_PAIRS.map((pair) => pair.word).sort(() => Math.random() - 0.5))
    setDefinitions(MATCHING_PAIRS.map((pair) => pair.match).sort(() => Math.random() - 0.5))
    setSelectedWord(null)
    setSelectedMatch(null)
    setMatchedPairs({})
    setAttempts(0)
    setCelebrationDismissed(false)
  }

  // Helper to check match and update state - called from event handlers
  function checkAndHandleMatch(word: string, match: string) {
    const isCorrectPair = MATCHING_PAIRS.some((pair) => pair.word === word && pair.match === match)
    setAttempts((prev) => prev + 1)

    if (isCorrectPair) {
      setMatchedPairs((prev) => ({
        ...prev,
        [word]: match,
        [match]: word,
      }))
    }

    setTimeout(() => {
      setSelectedWord(null)
      setSelectedMatch(null)
    }, 500)
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, type: "word" | "definition", value: string) => {
    if (matchedPairs[value]) return // Don't allow dragging matched items

    e.dataTransfer.setData("text/plain", value)
    e.dataTransfer.setData("type", type)

    // Add dragging class to element
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add("opacity-50", "scale-105", "shadow-lg")
    }
  }

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    // Remove dragging class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove("opacity-50", "scale-105", "shadow-lg")
    }
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    // Add visual feedback
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add("ring-2", "ring-amber-500", "bg-amber-50/30")
    }
  }

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    // Remove visual feedback
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove("ring-2", "ring-amber-500", "bg-amber-50/30")
    }
  }

  // Handle drop
  function handleDrop(e: React.DragEvent, type: "word" | "definition", value: string) {
    e.preventDefault()

    // Remove visual feedback
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove("ring-2", "ring-amber-500", "bg-amber-50/30")
    }

    const droppedValue = e.dataTransfer.getData("text/plain")
    const droppedType = e.dataTransfer.getData("type")

    // Only allow dropping if types are different
    if (droppedType !== type && !matchedPairs[value]) {
      const word = type === "word" ? value : droppedValue
      const match = type === "word" ? droppedValue : value
      setSelectedWord(word)
      setSelectedMatch(match)
      checkAndHandleMatch(word, match)
    }
  }

  // Handle touch-based selection for mobile
  function handleItemClick(type: "word" | "definition", value: string) {
    if (matchedPairs[value]) return // Don't allow selecting matched items

    if (type === "word") {
      if (selectedWord === value) {
        setSelectedWord(null)
      } else {
        setSelectedWord(value)
        if (selectedMatch) {
          checkAndHandleMatch(value, selectedMatch)
        }
      }
    } else {
      if (selectedMatch === value) {
        setSelectedMatch(null)
      } else {
        setSelectedMatch(value)
        if (selectedWord) {
          checkAndHandleMatch(selectedWord, value)
        }
      }
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-500 mb-2">
          Match the Words
        </h2>
        <p className="text-gray-600 dark:text-amber-300/90">
          Drag a word to its matching definition or tap/click to select pairs
        </p>
      </div>

      <div className="mb-8 min-h-[400px]">
        {/* Words Section */}
        <div>
          <h3 className="text-lg font-medium text-amber-600 dark:text-amber-400 mb-3">Words</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {words.map((word, index) => (
              <div
                key={`word-${index}`}
                className="h-[70px] relative"
              >
                <div
                  className={`absolute inset-0 p-3 rounded-xl text-center transition-all duration-200 flex items-center justify-center shadow-sm ${
                    matchedPairs[word]
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 shadow-md"
                      : selectedWord === word
                        ? "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shadow-md"
                        : "bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                  }`}
                  draggable={!matchedPairs[word]}
                  onDragStart={(e) => handleDragStart(e, "word", word)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e)}
                  onDragLeave={(e) => handleDragLeave(e)}
                  onDrop={(e) => handleDrop(e, "word", word)}
                  onClick={() => handleItemClick("word", word)}
                >
                  <span className="text-center font-medium">{word}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Definitions Section */}
        <div>
          <h3 className="text-lg font-medium text-amber-600 dark:text-amber-400 mb-3">Definitions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {definitions.map((definition, index) => (
              <div
                key={`def-${index}`}
                className="h-[70px] relative"
              >
                <div
                  className={`absolute inset-0 p-3 rounded-xl text-center transition-all duration-200 flex items-center justify-center shadow-sm ${
                    matchedPairs[definition]
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 shadow-md"
                      : selectedMatch === definition
                        ? "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shadow-md"
                        : "bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                  }`}
                  draggable={!matchedPairs[definition]}
                  onDragStart={(e) => handleDragStart(e, "definition", definition)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e)}
                  onDragLeave={(e) => handleDragLeave(e)}
                  onDrop={(e) => handleDrop(e, "definition", definition)}
                >
                  <motion.div
                    className={`absolute inset-0 p-3 rounded-xl text-center transition-all duration-200 flex items-center justify-center shadow-sm ${
                      matchedPairs[definition]
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 shadow-md"
                        : selectedMatch === definition
                          ? "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shadow-md"
                          : "bg-white dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                    }`}
                    whileHover={!matchedPairs[definition] ? { scale: 1.05 } : {}}
                    whileTap={!matchedPairs[definition] ? { scale: 0.98 } : {}}
                    onClick={() => handleItemClick("definition", definition)}
                  >
                    <span className="text-center text-sm">{definition}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 dark:text-amber-300/90">
            Pairs matched:{" "}
            <span className="text-amber-600 dark:text-amber-400 font-bold">{Object.keys(matchedPairs).length / 2}</span>{" "}
            of {MATCHING_PAIRS.length}
          </p>
          <p className="text-gray-600 dark:text-amber-300/90">
            Attempts: <span className="text-amber-600 dark:text-amber-400 font-bold">{attempts}</span>
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={resetGame}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-gray-900 shadow-md px-6 py-2 h-auto rounded-xl"
          >
            <ShuffleIcon className="mr-2 h-4 w-4" /> Reset Game
          </Button>
        </motion.div>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={dismissCelebration}
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
                <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">Matching Complete!</h2>
                <p className="text-gray-700 dark:text-gray-200 mb-2">You matched all pairs in {attempts} attempts!</p>
                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  {attempts <= MATCHING_PAIRS.length + 2
                    ? "That's impressive! You have an amazing memory!"
                    : "Great job! Keep practicing to improve your score."}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white dark:text-gray-900 rounded-full shadow-md"
                  onClick={dismissCelebration}
                >
                  Continue Learning
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Fill in the Blanks Game Component
function FillInTheBlanksGame() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [completedSentences, setCompletedSentences] = useState<Set<number>>(new Set())
  const [showCelebration, setShowCelebration] = useState(false)

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
  }

  const prevSentence = () => {
    setCurrentIndex((prev) => (prev - 1 + FILL_BLANKS_SENTENCES.length) % FILL_BLANKS_SENTENCES.length)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  // Format the sentence with a blank
  const formattedSentence = currentSentence.sentence.replace(
    "_____",
    selectedAnswer
      ? `<span class="font-bold ${isCorrect === true ? "text-green-600 dark:text-green-400" : isCorrect === false ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}">${selectedAnswer}</span>`
      : `<span class="border-b-2 border-dashed border-amber-500 dark:border-amber-400 px-2">_____</span>`,
  )

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-amber-600 dark:text-amber-400 font-medium">Progress</span>
          <span className="text-amber-600 dark:text-amber-400 font-medium">
            {currentIndex + 1}/{FILL_BLANKS_SENTENCES.length}
          </span>
        </div>
        {/* <Progress value={((currentIndex + 1) / FILL_BLANKS_SENTENCES.length) * 100} className="h-2" /> */}

        <Progress
              value={((currentIndex + 1) / FILL_BLANKS_SENTENCES.length) * 100}
              className="h-3 bg-amber-100 dark:bg-gray-700"
              indicatorClassName="bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700"
            />
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
        <motion.p
          key={currentSentence.sentence}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg md:text-xl text-gray-800 dark:text-gray-200 mb-8 p-5 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl shadow-inner"
          dangerouslySetInnerHTML={{ __html: formattedSentence }}
        />

        <div className="grid grid-cols-2 gap-4 mb-8">
          {currentSentence.options.map((option, index) => (
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
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-gradient-to-r from-amber-500
               to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-gray-900 shadow-md px-8 py-3
                h-auto text-lg rounded-full
                not-disabled:cursor-pointer
                "
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
            className="rounded-full w-14 h-14 shadow-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white dark:text-gray-900 hover:shadow-amber-500/30 hover:shadow-xl"
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
              isCorrect !== null
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-amber-500 to-amber-600"
            } text-white dark:text-gray-900 hover:shadow-amber-500/30 hover:shadow-xl`}
            aria-label="Next sentence"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      <div className="mt-6 text-center">
        <motion.p
          className="text-amber-600 dark:text-amber-400 font-medium text-lg"
          animate={score > 0 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          Score: {score}/{FILL_BLANKS_SENTENCES.length}
        </motion.p>
      </div>

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
  )
}

// Word Categories Game Component
function WordCategoriesGame() {
  const [availableWords, setAvailableWords] = useState<string[]>([])
  const [userSortedWords, setUserSortedWords] = useState<{ [category: string]: string[] }>({})
  const [isChecking, setIsChecking] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  // Initialize the game
  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    // Create a flat array of all words and shuffle them
    const allWords = WORD_CATEGORIES.flatMap((cat) => cat.words)
    const shuffled = [...allWords].sort(() => Math.random() - 0.5)

    setAvailableWords(shuffled)

    // Initialize empty categories
    const initialSorted: { [category: string]: string[] } = {}
    WORD_CATEGORIES.forEach((cat) => {
      initialSorted[cat.category] = []
    })

    setUserSortedWords(initialSorted)
    setIsChecking(false)
    setSelectedWord(null)
    setSelectedCategory(null)
    setShowCelebration(false)
    setScore(0)
  }

  const moveWordToCategory = (word: string, category: string) => {
    if (isChecking) return

    // Remove from available words
    setAvailableWords((prev) => prev.filter((w) => w !== word))

    // Add to category
    setUserSortedWords((prev) => ({
      ...prev,
      [category]: [...prev[category], word],
    }))
  }

  const moveWordBack = (word: string, category: string) => {
    if (isChecking) return

    // Remove from category
    setUserSortedWords((prev) => ({
      ...prev,
      [category]: prev[category].filter((w) => w !== word),
    }))

    // Add back to available words
    setAvailableWords((prev) => [...prev, word])
  }

  const handleWordSelect = (word: string) => {
    if (isChecking) return
    setSelectedWord(word)
    setSelectedCategory(null)
  }

  const handleCategorySelect = (category: string) => {
    if (isChecking) return

    if (selectedWord) {
      // Move selected word to this category
      moveWordToCategory(selectedWord, category)
      setSelectedWord(null)
    } else {
      setSelectedCategory(category)
    }
  }

  const handleCategoryWordSelect = (word: string, category: string) => {
    if (isChecking) return

    if (selectedCategory === category) {
      // Move word back to available
      moveWordBack(word, category)
      setSelectedCategory(null)
    } else {
      setSelectedWord(word)
      setSelectedCategory(category)
    }
  }

  const checkAnswers = () => {
    setIsChecking(true)
    let correctPlacements = 0
    let totalPlacements = 0

    // Calculate score
    Object.entries(userSortedWords).forEach(([category, words]) => {
      words.forEach((word) => {
        totalPlacements++

        // Find the correct category for this word
        const correctCategory = WORD_CATEGORIES.find((cat) => cat.words.includes(word))

        if (correctCategory && correctCategory.category === category) {
          correctPlacements++
        }
      })
    })

    setScore(correctPlacements)

    // Show celebration if all words are correctly placed
    if (correctPlacements === totalPlacements && totalPlacements > 0) {
      setTimeout(() => setShowCelebration(true), 1000)
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-500 mb-2">
          Sort Words into Categories
        </h2>
        <p className="text-gray-600 dark:text-amber-300/90">Tap words and categories to sort them correctly</p>
      </div>

      <div className="mb-8 min-h-[500px]">
        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {WORD_CATEGORIES.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl shadow-md transition-all duration-300 ${
                selectedCategory === category.category
                  ? "bg-amber-100 dark:bg-amber-900/50 shadow-lg"
                  : "bg-white dark:bg-gray-900/50 hover:bg-amber-50 dark:hover:bg-amber-900/30"
              }`}
              onClick={() => handleCategorySelect(category.category)}
            >
              <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-2">{category.category}</h3>
              <div className="min-h-[120px] p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-md shadow-inner">
                {userSortedWords[category.category]?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userSortedWords[category.category].map((word, index) => (
                      <motion.button
                        key={`cat-${category.category}-word-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-2 rounded-md text-sm cursor-pointer shadow-sm ${
                          isChecking
                            ? WORD_CATEGORIES.find((cat) => cat.category === category.category)?.words.includes(word)
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            : selectedWord === word && selectedCategory === category.category
                              ? "bg-amber-200 dark:bg-amber-800/70 text-amber-800 dark:text-amber-300"
                              : "bg-white dark:bg-gray-800/70 text-gray-800 dark:text-gray-200"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCategoryWordSelect(word, category.category)
                        }}
                      >
                        {word}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic text-center p-2">Drop words here</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Available items */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900/50 shadow-md mb-6">
          <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              className="mr-2"
            >
              🗃️
            </motion.div>
            Words to Sort
          </h3>

          <div className="flex flex-wrap gap-3 p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-md shadow-inner min-h-[100px]">
            {availableWords.map((word, index) => (
              <motion.button
                key={`word-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-2 rounded-md text-sm cursor-pointer shadow-sm ${
                  selectedWord === word
                    ? "bg-amber-200 dark:bg-amber-800/70 text-amber-800 dark:text-amber-300"
                    : "bg-white dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                }`}
                onClick={() => handleWordSelect(word)}
              >
                {word}
              </motion.button>
            ))}

            {availableWords.length === 0 && (
              <div className="w-full text-center p-4 text-gray-500 dark:text-gray-400">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  All words have been sorted! Check your answers.
                </motion.div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center mt-6 gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-amber-500 text-amber-600 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 px-6 py-2 h-auto rounded-xl"
                onClick={() => resetGame()}
              >
                <RefreshCwIcon className="mr-2 h-4 w-4" /> Reset Game
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white dark:text-gray-900 shadow-md px-6 py-2 h-auto rounded-xl"
                onClick={checkAnswers}
                disabled={availableWords.length > 0 || isChecking}
              >
                <CheckIcon className="mr-2 h-4 w-4" /> Check Answers
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {isChecking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-6 p-4 rounded-lg bg-amber-50/50 dark:bg-amber-900/20 text-center shadow-md"
          >
            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-2">Results</h3>
            <p className="mb-2 text-gray-700 dark:text-gray-200">
              You sorted {score} out of {WORD_CATEGORIES.flatMap((cat) => cat.words).length} words correctly!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">Perfect Categorization!</h2>
                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  You&apos;ve correctly sorted all the words into their categories! Your knowledge of Hadestown vocabulary is
                  impressive!
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
  )
}

