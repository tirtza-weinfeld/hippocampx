"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Gamepad,
  Trophy,
  Check,
  ArrowRight,
  ChevronRight,
  Zap,
  HelpCircle,
  RefreshCw,
  Home,
  ChevronLeft,
} from "lucide-react"
import confetti from "canvas-confetti"
import BinaryMascot from "./binary-mascot"
import { FunButton } from "./fun-button"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type GameMode = "binary-to-decimal" | "decimal-to-binary"
type GameScreen = "welcome" | "playing" | "gameover"
type Difficulty = "easy" | "medium" | "hard"
type MascotEmotion = "happy" | "thinking" | "excited" | "confused" | "celebrating"

interface Question {
  question: string
  answer: string
  options: string[]
  explanation?: string
}

export default function BinaryGame() {
  // Game state
  const [gameMode, setGameMode] = useState<GameMode>("binary-to-decimal")
  const [gameScreen, setGameScreen] = useState<GameScreen>("welcome")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>("happy")
  const [showExplanation, setShowExplanation] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [tutorialOpen, setTutorialOpen] = useState(false)

  // Refs
  const gameContainerRef = useRef<HTMLDivElement>(null)

  // Constants
  const totalQuestions = 10
  const maxBits = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8
  const maxDecimal = difficulty === "easy" ? 15 : difficulty === "medium" ? 63 : 255
  const timePerQuestion = difficulty === "easy" ? 15 : difficulty === "medium" ? 12 : 10

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("binaryGameHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore, 10))
    }
  }, [])

  // Save high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("binaryGameHighScore", score.toString())
    }
  }, [score, highScore])

  // Generate a random binary number
  const generateRandomBinary = useCallback((maxBits: number) => {
    const max = Math.pow(2, maxBits) - 1
    const decimal = Math.floor(Math.random() * max) + 1
    return decimal.toString(2)
  }, [])

  // Generate a random decimal number
  const generateRandomDecimal = useCallback((max: number) => {
    return Math.floor(Math.random() * max) + 1
  }, [])

  // Generate a new question
  const generateQuestion = useCallback(() => {
    if (gameMode === "binary-to-decimal") {
      const binary = generateRandomBinary(maxBits)
      const correctAnswer = Number.parseInt(binary, 2).toString()

      // Generate wrong options
      let options = [correctAnswer]
      while (options.length < 4) {
        const wrongAnswer = Math.floor(Math.random() * maxDecimal) + 1
        if (!options.includes(wrongAnswer.toString())) {
          options.push(wrongAnswer.toString())
        }
      }

      // Shuffle options
      options = options.sort(() => Math.random() - 0.5)

      return {
        question: `Convert binary ${binary} to decimal`,
        answer: correctAnswer,
        options,
        explanation: `The binary number ${binary} converts to decimal ${correctAnswer} because: 
          ${binary
            .split("")
            .reverse()
            .map((bit, i) => (bit === "1" ? `2^${i} = ${Math.pow(2, i)}` : null))
            .filter(Boolean)
            .reverse()
            .join(" + ")} = ${correctAnswer}`,
      }
    } else {
      const decimal = generateRandomDecimal(maxDecimal)
      const correctAnswer = decimal.toString(2)

      // Generate wrong options
      let options = [correctAnswer]
      while (options.length < 4) {
        const wrongDecimal = Math.floor(Math.random() * maxDecimal) + 1
        const wrongAnswer = wrongDecimal.toString(2)
        if (!options.includes(wrongAnswer) && wrongAnswer.length <= maxBits) {
          options.push(wrongAnswer)
        }
      }

      // Shuffle options
      options = options.sort(() => Math.random() - 0.5)

      return {
        question: `Convert decimal ${decimal} to binary`,
        answer: correctAnswer,
        options,
        explanation: `The decimal number ${decimal} converts to binary ${correctAnswer} because:
          ${decimal} = ${decimal
            .toString(2)
            .split("")
            .reverse()
            .map((bit, i) => (bit === "1" ? `2^${i} (${Math.pow(2, i)})` : null))
            .filter(Boolean)
            .reverse()
            .join(" + ")}`,
      }
    }
  }, [gameMode, generateRandomBinary, generateRandomDecimal, maxBits, maxDecimal])

  // Start the game
  const startGame = useCallback(() => {
    setGameScreen("playing")
    setScore(0)
    setQuestionNumber(0)
    setStreak(0)
    setCurrentQuestion(generateQuestion())
    setTimeLeft(timePerQuestion)
    setMascotEmotion("excited")
    setSelectedAnswer(null)
    setIsCorrect(null)
    setShowExplanation(false)

    // Focus on game container for keyboard navigation
    if (gameContainerRef.current) {
      gameContainerRef.current.focus()
    }
  }, [generateQuestion, timePerQuestion])

  // Check the answer
  const checkAnswer = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer)
      const correct = answer === currentQuestion?.answer
      setIsCorrect(correct)

      if (correct) {
        // Calculate score based on time left and difficulty
        const timeBonus = Math.floor(timeLeft * (difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2))
        const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3
        const questionScore = 10 + timeBonus * difficultyMultiplier

        setScore((prev) => prev + questionScore)
        setStreak((prev) => prev + 1)
        setMascotEmotion("celebrating")

        // Trigger confetti for correct answers
        if (streak >= 2) {
          confetti({
            particleCount: Math.min(50 * streak, 200),
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#8b5cf6", "#6366f1", "#3b82f6"],
          })
        }
      } else {
        setStreak(0)
        setMascotEmotion("confused")
      }

      // Show explanation after answering
      setTimeout(() => {
        setShowExplanation(true)
      }, 1000)

      // Move to next question after a delay
      setTimeout(() => {
        if (questionNumber < totalQuestions - 1) {
          setQuestionNumber((prev) => prev + 1)
          setCurrentQuestion(generateQuestion())
          setSelectedAnswer(null)
          setIsCorrect(null)
          setTimeLeft(timePerQuestion)
          setMascotEmotion("thinking")
          setShowExplanation(false)
        } else {
          setGameScreen("gameover")

          // Trigger more confetti for game over with good score
          if (score >= totalQuestions * 10) {
            setTimeout(() => {
              confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ["#8b5cf6", "#6366f1", "#3b82f6", "#10b981"],
              })
            }, 500)
          }
        }
      }, 3000)
    },
    [currentQuestion, questionNumber, generateQuestion, streak, difficulty, score, totalQuestions, timePerQuestion],
  )

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (gameScreen === "playing" && currentQuestion && selectedAnswer === null) {
        // Number keys 1-4 for selecting options
        if (e.key >= "1" && e.key <= "4") {
          const index = Number.parseInt(e.key) - 1
          if (index >= 0 && index < currentQuestion.options.length) {
            checkAnswer(currentQuestion.options[index])
          }
        }

        // Arrow keys for navigation
        if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault() // Prevent scrolling
        }
      }

      // Space to start game from welcome screen
      if (gameScreen === "welcome" && e.key === " ") {
        startGame()
      }

      // Escape to go back to welcome screen
      if (e.key === "Escape" && gameScreen !== "welcome") {
        setGameScreen("welcome")
      }
    },
    [gameScreen, currentQuestion, selectedAnswer, checkAnswer, startGame],
  )

  // Timer effect
  useEffect(() => {
    if (gameScreen !== "playing" || selectedAnswer !== null) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          checkAnswer("") // Force wrong answer when time runs out
          return 0
        }

        // Change mascot emotion when time is running low
        if (prev <= 5 && mascotEmotion !== "confused") {
          setMascotEmotion("confused")
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameScreen, selectedAnswer, checkAnswer, mascotEmotion])

  // Tutorial content
  const tutorialSteps = [
    {
      title: "Welcome to Binary Challenge!",
      content:
        "Learn binary conversion while having fun! This game will test your ability to convert between binary and decimal numbers.",
      image: <BinaryMascot emotion="excited" size="md" />,
    },
    {
      title: "Binary to Decimal Mode",
      content:
        "In this mode, you'll see a binary number (made of 0s and 1s) and need to convert it to a decimal number (0-9).",
      image: (
        <div className="flex items-center gap-3 my-4">
          <div className="flex space-x-1">
            {["1", "0", "1", "1"].map((bit, i) => (
              <div
                key={i}
                className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-mono font-bold"
              >
                {bit}
              </div>
            ))}
          </div>
          <ArrowRight className="text-primary" />
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
            11
          </div>
        </div>
      ),
    },
    {
      title: "Decimal to Binary Mode",
      content: "In this mode, you'll see a decimal number and need to convert it to binary (sequence of 0s and 1s).",
      image: (
        <div className="flex items-center gap-3 my-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
            11
          </div>
          <ArrowRight className="text-primary" />
          <div className="flex space-x-1">
            {["1", "0", "1", "1"].map((bit, i) => (
              <div
                key={i}
                className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-mono font-bold"
              >
                {bit}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "How to Play",
      content:
        "Choose the correct answer from the four options. The faster you answer, the more points you'll earn! Try to build a streak for bonus points.",
      image: <BinaryMascot emotion="thinking" size="md" />,
    },
    {
      title: "Difficulty Levels",
      content:
        "Choose from Easy, Medium, or Hard difficulty. Higher difficulties have larger numbers and less time, but offer more points!",
      image: (
        <div className="flex gap-2 my-4">
          {["Easy", "Medium", "Hard"].map((level, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-full text-white font-medium ${
                i === 0 ? "bg-emerald-500" : i === 1 ? "bg-amber-500" : "bg-rose-500"
              }`}
            >
              {level}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Ready to Play?",
      content: "Now you're ready to test your binary skills! Good luck and have fun!",
      image: <BinaryMascot emotion="celebrating" size="md" />,
    },
  ]

  // Render welcome screen
  const renderWelcomeScreen = () => (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Hero section */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative inline-block">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
            }}
          >
            <BinaryMascot emotion="excited" size="lg" />
          </motion.div>

          <motion.div
            className="absolute -top-4 -right-4"
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              delay: 0.5,
            }}
          >
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-2 rounded-full shadow-lg">
              <Gamepad className="h-6 w-6" />
            </div>
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
          Binary Challenge
        </h1>

        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-md mx-auto">
          Test your binary conversion skills in this fun and educational game!
        </p>
      </motion.div>

      {/* Game mode selection */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Binary to Decimal Mode */}
        <GameModeCard
          title="Binary to Decimal"
          description="Convert binary code (1s and 0s) to regular numbers"
          isSelected={gameMode === "binary-to-decimal"}
          onClick={() => {
            setGameMode("binary-to-decimal")
          }}
          icon={
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                {["1", "0", "1", "1"].map((bit, i) => (
                  <motion.div
                    key={i}
                    className={`w-7 h-9 ${bit === "1" ? "bg-violet-500" : "bg-blue-500"} rounded-lg flex items-center justify-center text-white text-sm font-mono font-bold shadow-md`}
                    animate={
                      gameMode === "binary-to-decimal"
                        ? {
                            y: [0, -3, 0],
                            scale: [1, 1.05, 1],
                          }
                        : {}
                    }
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      delay: i * 0.15,
                    }}
                  >
                    {bit}
                  </motion.div>
                ))}
              </div>

              <motion.div
                animate={
                  gameMode === "binary-to-decimal"
                    ? {
                        x: [0, 5, 0],
                      }
                    : {}
                }
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2 }}
              >
                <ArrowRight className="text-primary h-5 w-5" />
              </motion.div>

              <motion.div
                className="w-10 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md"
                animate={
                  gameMode === "binary-to-decimal"
                    ? {
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                11
              </motion.div>
            </div>
          }
          mascot={<BinaryMascot emotion={gameMode === "binary-to-decimal" ? "excited" : "thinking"} size="sm" />}
        />

        {/* Decimal to Binary Mode */}
        <GameModeCard
          title="Decimal to Binary"
          description="Convert regular numbers into binary code (1s and 0s)"
          isSelected={gameMode === "decimal-to-binary"}
          onClick={() => {
            setGameMode("decimal-to-binary")
          }}
          icon={
            <div className="flex items-center gap-2">
              <motion.div
                className="w-10 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md"
                animate={
                  gameMode === "decimal-to-binary"
                    ? {
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                11
              </motion.div>

              <motion.div
                animate={
                  gameMode === "decimal-to-binary"
                    ? {
                        x: [0, 5, 0],
                      }
                    : {}
                }
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2 }}
              >
                <ArrowRight className="text-primary h-5 w-5" />
              </motion.div>

              <div className="flex space-x-1">
                {["1", "0", "1", "1"].map((bit, i) => (
                  <motion.div
                    key={i}
                    className={`w-7 h-9 ${bit === "1" ? "bg-violet-500" : "bg-blue-500"} rounded-lg flex items-center justify-center text-white text-sm font-mono font-bold shadow-md`}
                    animate={
                      gameMode === "decimal-to-binary"
                        ? {
                            y: [0, -3, 0],
                            scale: [1, 1.05, 1],
                          }
                        : {}
                    }
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      delay: i * 0.15,
                    }}
                  >
                    {bit}
                  </motion.div>
                ))}
              </div>
            </div>
          }
          mascot={<BinaryMascot emotion={gameMode === "decimal-to-binary" ? "excited" : "thinking"} size="sm" />}
        />
      </motion.div>

      {/* Difficulty selection */}
      <motion.div
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-amber-500" />
          Select Difficulty
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
          {[
            {
              id: "easy",
              label: "Easy",
              color: "from-emerald-400 to-emerald-600",
              hoverColor: "hover:from-emerald-500 hover:to-emerald-700",
              icon: (
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                >
                  🌱
                </motion.div>
              ),
              description: "4-bit numbers\n15 seconds per question",
            },
            {
              id: "medium",
              label: "Medium",
              color: "from-amber-400 to-amber-600",
              hoverColor: "hover:from-amber-500 hover:to-amber-700",
              icon: (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  🔥
                </motion.div>
              ),
              description: "6-bit numbers\n12 seconds per question",
            },
            {
              id: "hard",
              label: "Hard",
              color: "from-rose-400 to-rose-600",
              hoverColor: "hover:from-rose-500 hover:to-rose-700",
              icon: (
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  ⚡
                </motion.div>
              ),
              description: "8-bit numbers\n10 seconds per question",
            },
          ].map((level) => (
            <motion.div
              key={level.id}
              className={`relative overflow-hidden rounded-xl shadow-md ${
                difficulty === (level.id as Difficulty) ? "ring-2 ring-offset-2 ring-offset-background" : ""
              }`}
              style={{
                boxShadow:
                  difficulty === (level.id as Difficulty)
                    ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : undefined,
              }}
              whileHover={{
                scale: 1.03,
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 10 },
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setDifficulty(level.id as Difficulty)
              }}
            >
              <div
                className={`h-full w-full p-5 flex flex-col items-center ${
                  difficulty === (level.id as Difficulty)
                    ? `bg-gradient-to-br ${level.color} text-white`
                    : `bg-white/80 dark:bg-slate-800/80 hover:bg-gradient-to-br ${level.color} hover:text-white text-slate-700 dark:text-slate-200 transition-all duration-300`
                }`}
              >
                <div className="text-2xl mb-2">{level.icon}</div>
                <h3 className="text-lg font-bold mb-1">{level.label}</h3>
                <div className="text-xs text-center whitespace-pre-line opacity-90 mt-1">{level.description}</div>

                {difficulty === (level.id as Difficulty) && (
                  <motion.div
                    className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1 shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Check className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <FunButton
          variant="outline"
          onClick={() => {
            setTutorialOpen(true)
          }}
          icon={<HelpCircle className="h-5 w-5 mr-2" />}
          iconPosition="left"
          bubbles={true}
          size="lg"
          className="px-6 py-4 text-lg font-bold"
        >
          How to Play
        </FunButton>

        <FunButton
          onClick={startGame}
          icon={<Gamepad className="h-5 w-5 mr-2" />}
          iconPosition="left"
          bubbles={true}
          size="lg"
          className="px-6 py-4 text-lg font-bold"
        >
          Start Game
        </FunButton>
      </motion.div>

      {/* High score display */}
      {highScore > 0 && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 px-4 py-2 rounded-full shadow-sm">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="font-medium">
              High Score: <span className="text-amber-600 dark:text-amber-400 font-bold">{highScore}</span>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )

  // Render game screen
  const renderGameScreen = () => (
    <div
      className="w-full max-w-2xl mx-auto bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
      ref={gameContainerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Binary game area"
    >
      {/* Game header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="text-base font-medium bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full shadow-sm">
            <span className="sr-only">Question</span>
            {questionNumber + 1} / {totalQuestions}
          </div>

          {streak >= 2 && (
            <motion.div
              className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Zap className="h-4 w-4" />
              <span className="font-medium">Streak: {streak}</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setGameScreen("welcome")
            }}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="Return to menu"
          >
            <Home className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>

          <div className="text-base font-medium flex items-center bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full shadow-sm">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            <span className="sr-only">Score</span>
            {score}
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="relative mb-6">
        <Progress
          value={(timeLeft / timePerQuestion) * 100}
          className="h-4 rounded-full"
          style={{
            background: timeLeft <= timePerQuestion * 0.3 ? "rgba(239, 68, 68, 0.2)" : undefined,
          }}
        />

        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <span
            className={`text-xs font-medium ${
              timeLeft <= timePerQuestion * 0.3
                ? "text-red-600 dark:text-red-400"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {timeLeft}s
          </span>
        </div>

        {timeLeft <= timePerQuestion * 0.3 && (
          <motion.div
            className="absolute right-0 -top-1"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
          </motion.div>
        )}
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={questionNumber}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6 bg-gradient-to-br from-violet-50/80 to-blue-50/80 dark:from-violet-900/20 dark:to-blue-900/20 border-0 shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <motion.div
                  animate={{
                    rotate: mascotEmotion === "confused" ? [0, 10, -10, 0] : 0,
                    y: mascotEmotion === "celebrating" ? [0, -5, 0] : 0,
                  }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  <BinaryMascot emotion={mascotEmotion} size="sm" />
                </motion.div>
                <h3 className="text-xl font-bold ml-3">{currentQuestion?.question}</h3>
              </div>

              {gameMode === "binary-to-decimal" && currentQuestion && (
                <div className="flex justify-center mb-4 flex-wrap">
                  {currentQuestion.question
                    .split(" ")[2]
                    .split("")
                    .map((bit, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-xl font-mono font-bold m-1 rounded-lg ${
                          bit === "1"
                            ? "bg-gradient-to-br from-violet-500 to-blue-600"
                            : "bg-gradient-to-br from-blue-500 to-indigo-600"
                        } text-white shadow-md`}
                      >
                        {bit}
                      </motion.div>
                    ))}
                </div>
              )}

              {gameMode === "decimal-to-binary" && currentQuestion && (
                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md"
                  >
                    {currentQuestion.question.split(" ")[2]}
                  </motion.div>
                </div>
              )}
            </div>
          </Card>

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion?.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={selectedAnswer === null ? { scale: 1.05, y: -5 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
              >
                <button
                  className={cn(
                    "relative h-16 md:h-20 text-xl font-mono w-full rounded-xl transition-all duration-300 shadow-md",
                    selectedAnswer === option
                      ? option === currentQuestion.answer
                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
                        : "bg-gradient-to-br from-rose-400 to-rose-600 text-white"
                      : "bg-white/80 dark:bg-slate-900/80 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80",
                  )}
                  onClick={() => selectedAnswer === null && checkAnswer(option)}
                  disabled={selectedAnswer !== null}
                  aria-label={`Option ${index + 1}: ${option}`}
                  aria-pressed={selectedAnswer === option}
                >
                  <span className="relative z-10">{option}</span>

                  {selectedAnswer === option && (
                    <motion.div
                      className="absolute -top-3 -right-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {option === currentQuestion.answer ? (
                        <div className="bg-white dark:bg-slate-800 rounded-full p-1 shadow-md">
                          <CheckCircle className="h-6 w-6 text-emerald-500" />
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-full p-1 shadow-md">
                          <XCircle className="h-6 w-6 text-rose-500" />
                        </div>
                      )}
                    </motion.div>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Explanation */}
          <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
            <DialogContent
              className={cn(
                "sm:max-w-md border-2 shadow-lg transform transition-all",
                isCorrect
                  ? "bg-gradient-to-br from-emerald-50/90 to-emerald-100/90 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-200 dark:border-emerald-800/50"
                  : "bg-gradient-to-br from-rose-50/90 to-rose-100/90 dark:from-rose-900/30 dark:to-rose-800/30 border-rose-200 dark:border-rose-800/50",
              )}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {isCorrect ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1], rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md"
                    >
                      <XCircle className="h-5 w-5" />
                    </motion.div>
                  )}
                  {isCorrect ? (
                    <span className="text-emerald-700 dark:text-emerald-300">Awesome! That's correct! 🎯</span>
                  ) : (
                    <span className="text-rose-700 dark:text-rose-300">
                      Not quite! The correct answer is{" "}
                      <span className="font-mono bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded ml-1">
                        {currentQuestion?.answer}
                      </span>
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div
                className={cn(
                  "text-sm mt-3 p-3 rounded-lg",
                  isCorrect
                    ? "bg-white/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200"
                    : "bg-white/50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200",
                )}
              >
                <p className="font-medium mb-2">How it works:</p>
                <p className="font-mono">{currentQuestion?.explanation}</p>
              </div>

              {isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 font-medium"
                >
                  Keep up the great work! You&apos;re mastering binary! 💪
                </motion.div>
              )}

              {!isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 text-sm text-rose-600 dark:text-rose-400 font-medium"
                >
                  Don&apos;t worry! Binary takes practice. You&apos;ll get it next time! 🚀
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </AnimatePresence>
    </div>
  )

  // Render game over screen
  const renderGameOverScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8 max-w-lg mx-auto bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
    >
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
        Game Over!
      </h2>

      <motion.div
        className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        {score}
      </motion.div>

      <div className="relative">
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: score >= totalQuestions * 10 ? [0, 10, -10, 0] : 0,
          }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <BinaryMascot
            emotion={score >= totalQuestions * 20 ? "celebrating" : score >= totalQuestions * 10 ? "happy" : "confused"}
            size="lg"
          />
        </motion.div>

        {score > highScore && (
          <motion.div
            className="absolute -top-6 -right-6"
            animate={{ rotate: 360 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
          >
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-2 rounded-full shadow-lg">
              <Trophy className="h-6 w-6" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xl text-slate-700 dark:text-slate-300">
          {score >= totalQuestions * 20
            ? "Perfect! You're a binary master! 🎉"
            : score >= totalQuestions * 10
              ? "Great job! You're getting really good at this! 🌟"
              : "Keep practicing! You'll get better with time. 💪"}
        </p>

        {score > highScore && (
          <motion.p
            className="text-lg font-medium text-amber-600 dark:text-amber-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            New High Score! 🏆
          </motion.p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <FunButton
          variant="outline"
          onClick={() => {
            setGameScreen("welcome")
          }}
          icon={<Home className="h-4 w-4" />}
          iconPosition="left"
          bubbles={true}
          size="sm"
          className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
        >
          <span className="sm:inline hidden ml-1">Menu</span>
        </FunButton>

        <FunButton
          onClick={startGame}
          icon={<RefreshCw className="h-4 w-4" />}
          iconPosition="left"
          bubbles={true}
          size="sm"
          className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
        >
          <span className="sm:inline hidden ml-1">Play</span>
        </FunButton>
      </div>
    </motion.div>
  )

  const renderTutorialDialog = () => (
    <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
      <DialogContent className="sm:max-w-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
            How to Play
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tutorialStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-violet-50/80 to-blue-50/80 dark:from-violet-900/20 dark:to-blue-900/20 p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-bold mb-4">{tutorialSteps[tutorialStep].title}</h3>

              <div className="flex flex-col items-center mb-6">{tutorialSteps[tutorialStep].image}</div>

              <p className="text-slate-700 dark:text-slate-300 mb-8">{tutorialSteps[tutorialStep].content}</p>

              <div className="flex justify-between items-center mt-6">
                <FunButton
                  onClick={() => {
                    setTutorialStep((prev) => Math.max(0, prev - 1))
                  }}
                  disabled={tutorialStep === 0}
                  variant={tutorialStep === 0 ? "ghost" : "outline"}
                  icon={<ChevronLeft className="h-4 w-4" />}
                  iconPosition="left"
                  bubbles={tutorialStep !== 0}
                  size="sm"
                  className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
                >
                  <span className="sm:inline hidden">Prev</span>
                </FunButton>

                <div className="flex space-x-2">
                  {tutorialSteps.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2.5 w-2.5 rounded-full ${
                        tutorialStep === index ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                      onClick={() => {
                        setTutorialStep(index)
                      }}
                      aria-label={`Go to tutorial step ${index + 1}`}
                    />
                  ))}
                </div>

                {tutorialStep < tutorialSteps.length - 1 ? (
                  <FunButton
                    onClick={() => {
                      setTutorialStep((prev) => Math.min(tutorialSteps.length - 1, prev + 1))
                    }}
                    icon={<ChevronRight className="h-4 w-4" />}
                    iconPosition="right"
                    bubbles={true}
                    size="sm"
                    className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
                  >
                    <span className="sm:inline hidden">Next</span>
                  </FunButton>
                ) : (
                  <FunButton
                    onClick={() => {
                      setTutorialOpen(false)
                    }}
                    icon={<Gamepad className="h-4 w-4" />}
                    iconPosition="right"
                    bubbles={true}
                    size="sm"
                    className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
                  >
                    <span className="sm:inline hidden">Play</span>
                  </FunButton>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <Card className="w-full border-0 shadow-xl bg-gradient-to-br from-white/80 via-violet-50/30 to-blue-50/30 dark:from-slate-900/80 dark:via-violet-950/30 dark:to-blue-950/30 backdrop-blur-sm rounded-2xl overflow-hidden">
      <div className="pt-6 pb-6 px-4 md:px-6">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Binary particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs font-mono font-bold text-primary/10 dark:text-primary/5"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: 0,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [0, Math.random() * 20 - 10],
                opacity: [0, 0.8, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            >
              {Math.random() > 0.5 ? "1" : "0"}
            </motion.div>
          ))}

          {/* Gradient blobs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-400/10 dark:bg-violet-600/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {gameScreen === "welcome" && renderWelcomeScreen()}
          {gameScreen === "playing" && renderGameScreen()}
          {gameScreen === "gameover" && renderGameOverScreen()}
        </div>
      </div>
      {renderTutorialDialog()}
    </Card>
  )
}

// Helper component for game mode selection
function GameModeCard({
  title,
  description,
  icon,
  isSelected,
  onClick,
  mascot,
}: {
  title: string
  description: string
  icon: React.ReactNode
  isSelected: boolean
  onClick: () => void
  mascot: React.ReactNode
}) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer",
        isSelected ? "ring-2 ring-primary" : "",
      )}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
    >
      <div
        className={cn(
          "absolute inset-0",
          isSelected
            ? "bg-gradient-to-br from-violet-50/90 to-blue-50/90 dark:from-violet-900/40 dark:to-blue-900/40"
            : "bg-white/80 dark:bg-slate-800/80",
        )}
      />

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn("text-xl font-bold", isSelected ? "text-primary" : "text-slate-700 dark:text-slate-200")}>
            {title}
          </h3>

          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center"
            >
              <Check className="h-3 w-3 mr-1" />
              <span>Selected</span>
            </motion.div>
          )}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">{description}</p>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 shadow-inner mb-5">{icon}</div>

        <div className="absolute -bottom-5 -right-5 z-20">
          <motion.div
            animate={
              isSelected
                ? {
                    y: [0, -5, 0],
                    rotate: [0, 3, -3, 0],
                  }
                : {}
            }
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
          >
            {mascot}
          </motion.div>
        </div>

        <motion.button
          className={cn(
            "relative w-full py-3 px-4 rounded-xl text-base font-medium transition-all duration-300",
            isSelected
              ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-md"
              : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600",
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSelected ? "Selected!" : "Choose This Mode"}
        </motion.button>
      </div>
    </motion.div>
  )
}

