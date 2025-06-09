"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import BinaryMascot from "./binary-mascot"
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Award, Zap, ChevronRight } from "lucide-react"
import confetti from "canvas-confetti"
import { Badge } from "@/components/ui/badge"
import { FunButton } from "./fun-button"

type PracticeMode = "binary-to-decimal" | "decimal-to-binary"
type Difficulty = "easy" | "medium" | "hard"

interface Question {
  question: string
  answer: string
  type: PracticeMode
}

export default function BinaryPractice() {
  const [mode, setMode] = useState<PracticeMode>("binary-to-decimal")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [userAnswer, setUserAnswer] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [mascotEmotion, setMascotEmotion] = useState<"happy" | "thinking" | "excited" | "confused" | "celebrating">(
    "thinking",
  )

  // Generate a question based on mode and difficulty
  const generateQuestion = useCallback(() => {
    if (mode === "binary-to-decimal") {
      const binaryLength = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8
      const maxDecimal = Math.pow(2, binaryLength) - 1
      const decimal = Math.floor(Math.random() * maxDecimal) + 1
      const binary = decimal.toString(2).padStart(binaryLength, "0")

      return {
        question: `Convert binary ${binary} to decimal`,
        answer: decimal.toString(),
        type: "binary-to-decimal" as PracticeMode,
      }
    } else {
      const maxDecimal = difficulty === "easy" ? 15 : difficulty === "medium" ? 63 : 255
      const decimal = Math.floor(Math.random() * maxDecimal) + 1
      const binary = decimal.toString(2)

      return {
        question: `Convert decimal ${decimal} to binary`,
        answer: binary,
        type: "decimal-to-binary" as PracticeMode,
      }
    }
  }, [mode, difficulty])

  // Initialize with a question if none exists
  if (!currentQuestion) {
    const newQuestion = generateQuestion()
    setCurrentQuestion(newQuestion)
  }

  // Change mode or difficulty
  const changeMode = (newMode: PracticeMode) => {
    if (newMode !== mode) {
      setMode(newMode)
      const newQuestion = generateQuestion()
      setCurrentQuestion(newQuestion)
      setUserAnswer("")
      setIsCorrect(null)
      setShowHint(false)
      setMascotEmotion("thinking")
    }
  }

  const changeDifficulty = (newDifficulty: Difficulty) => {
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty)
      const newQuestion = generateQuestion()
      setCurrentQuestion(newQuestion)
      setUserAnswer("")
      setIsCorrect(null)
      setShowHint(false)
      setMascotEmotion("thinking")
    }
  }

  // Check the user's answer
  const checkAnswer = () => {
    if (!currentQuestion || !userAnswer) return

    const correct = userAnswer.trim() === currentQuestion.answer
    setIsCorrect(correct)

    if (correct) {
      setScore((prev) => prev + 1)
      setStreak((prev) => prev + 1)
      setMascotEmotion("celebrating")

      if (streak >= 2) {
        // Trigger confetti for streaks
        confetti({
          particleCount: 50 * Math.min(streak, 4),
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    } else {
      setStreak(0)
      setMascotEmotion("confused")
    }

    setQuestionsAnswered((prev) => prev + 1)
  }

  // Move to the next question
  const nextQuestion = () => {
    const newQuestion = generateQuestion()
    setCurrentQuestion(newQuestion)
    setUserAnswer("")
    setIsCorrect(null)
    setShowHint(false)
    setMascotEmotion("thinking")
  }

  // Generate a hint
  const getHint = () => {
    if (!currentQuestion) return ""

    if (currentQuestion.type === "binary-to-decimal") {
      // const binary = currentQuestion.question.split(" ")[2]
      return `Remember: Each position in binary represents a power of 2. Starting from the right, the positions are 2⁰, 2¹, 2², etc.`
    } else {
      // const decimal = Number.parseInt(currentQuestion.question.split(" ")[2])
      return `Remember: To convert decimal to binary, divide by 2 repeatedly and note the remainders from bottom to top.`
    }
  }

  return (
    <Card className="w-full border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center ">
            <motion.div
              animate={{
                rotate: mascotEmotion === "confused" ? [0, 10, -10, 0] : 0,
                y: mascotEmotion === "celebrating" ? [0, -10, 0] : 0,
              }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              <BinaryMascot emotion={mascotEmotion} size="sm" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-center ml-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500 
            ">
              Binary Practice
            </h2>
            
          </div>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Convert between binary and decimal numbers with our interactive tools.
          </p>

          <div className="w-full max-w-3xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-blue-50/70 dark:bg-slate-800/70 border-0 shadow-md">
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-blue-500" />
                    Practice Mode
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={mode === "binary-to-decimal" ? "default" : "outline"}
                        onClick={() => changeMode("binary-to-decimal")}
                        className={
                          mode === "binary-to-decimal"
                            ? "bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 shadow-md rounded-xl"
                            : "bg-white/80 dark:bg-slate-800/80 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 rounded-xl shadow-sm"
                        }
                      >
                        Binary to Decimal
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={mode === "decimal-to-binary" ? "default" : "outline"}
                        onClick={() => changeMode("decimal-to-binary")}
                        className={
                          mode === "decimal-to-binary"
                            ? "bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 shadow-md rounded-xl"
                            : "bg-white/80 dark:bg-slate-800/80 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 rounded-xl shadow-sm"
                        }
                      >
                        Decimal to Binary
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50/70 dark:bg-slate-800/70 border-0 shadow-md">
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-blue-500" />
                    Difficulty
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={difficulty === "easy" ? "default" : "outline"}
                        onClick={() => changeDifficulty("easy")}
                        className={
                          difficulty === "easy"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md rounded-xl"
                            : "bg-white/80 dark:bg-slate-800/80 border-2 border-green-200 dark:border-green-900 hover:border-green-400 rounded-xl shadow-sm"
                        }
                      >
                        Easy
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={difficulty === "medium" ? "default" : "outline"}
                        onClick={() => changeDifficulty("medium")}
                        className={
                          difficulty === "medium"
                            ? "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 shadow-md rounded-xl"
                            : "bg-white/80 dark:bg-slate-800/80 border-2 border-yellow-200 dark:border-yellow-900 hover:border-yellow-400 rounded-xl shadow-sm"
                        }
                      >
                        Medium
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={difficulty === "hard" ? "default" : "outline"}
                        onClick={() => changeDifficulty("hard")}
                        className={
                          difficulty === "hard"
                            ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-md rounded-xl"
                            : "bg-white/80 dark:bg-slate-800/80 border-2 border-red-200 dark:border-red-900 hover:border-red-400 rounded-xl shadow-sm"
                        }
                      >
                        Hard
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm font-medium bg-blue-100/70 dark:bg-blue-900/30 shadow-sm">
                  Score: {score}/{questionsAnswered}
                </Badge>
                {streak >= 3 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-sm flex items-center"
                  >
                    🔥 Streak: {streak}
                  </motion.div>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FunButton
                  onClick={nextQuestion}
                  variant="secondary"
                  bubbles={true}
                  size="sm"
                  className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
                >
                  <span className="sm:inline hidden">Next</span>
                  <ChevronRight className="h-4 w-4 inline-block sm:ml-1" />
                </FunButton>
              </motion.div>
            </div>

            <Card className="bg-white/70 dark:bg-slate-800/70 border-0 shadow-md mb-6">
              <CardContent className="pt-6">
                <motion.h3
                  className="text-xl font-bold text-center mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={currentQuestion?.question}
                >
                  {currentQuestion?.question}
                </motion.h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="answer" className="text-lg">
                      Your Answer:
                    </Label>
                    <div className="flex flex-col mt-2">
                      <div className="relative">
                        <Input
                          id="answer"
                          value={userAnswer}
                          onChange={(e) => {
                            // Filter to only allow valid characters based on mode
                            const value = e.target.value
                            const regex = mode === "binary-to-decimal" ? /^[0-9]*$/ : /^[0-1]*$/
                            if (regex.test(value)) {
                              setUserAnswer(value)
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && userAnswer && isCorrect === null) {
                              checkAnswer()
                            }
                          }}
                          className="text-xl font-mono text-center rounded-lg h-14 border-2 border-blue-200 dark:border-blue-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                          placeholder={mode === "binary-to-decimal" ? "Enter decimal number" : "Enter binary number"}
                          disabled={isCorrect !== null}
                          type={mode === "binary-to-decimal" ? "tel" : "text"}
                          inputMode={mode === "binary-to-decimal" ? "numeric" : "text"}
                          autoComplete="off"
                          aria-label={
                            mode === "binary-to-decimal"
                              ? "Enter decimal number"
                              : "Enter binary number (0s and 1s only)"
                          }
                        />
                        {userAnswer && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {mode === "binary-to-decimal" ? (
                              <span className="text-blue-500">#{userAnswer}</span>
                            ) : (
                              <span className="text-green-500">0b{userAnswer}</span>
                            )}
                          </motion.div>
                        )}
                      </div>

                      <motion.div
                        className="mt-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FunButton
                          onClick={checkAnswer}
                          disabled={!userAnswer || isCorrect !== null}
                          className="w-full h-12 text-lg font-medium rounded-xl"
                          icon={<ArrowRight className="h-5 w-5" />}
                          iconPosition="right"
                          bubbles={true}
                        >
                          <span className="relative z-10">Check Answer</span>
                        </FunButton>
                      </motion.div>

                      {mode === "binary-to-decimal" ? (
                        <div className="flex justify-center gap-2 mt-4 flex-wrap">
                          {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
                            <motion.button
                              key={digit}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 text-white font-bold shadow-md text-lg"
                              onClick={() => {
                                if (isCorrect === null) {
                                  setUserAnswer((prev) => prev + digit)
                                }
                              }}
                              disabled={isCorrect !== null}
                            >
                              {digit}
                            </motion.button>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500 text-white font-bold shadow-md text-lg"
                            onClick={() => {
                              if (isCorrect === null) {
                                setUserAnswer((prev) => prev.slice(0, -1))
                              }
                            }}
                            disabled={isCorrect !== null || userAnswer.length === 0}
                          >
                            ←
                          </motion.button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-4 mt-4">
                          {["0", "1"].map((digit) => (
                            <motion.button
                              key={digit}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${digit === "1" ? "bg-gradient-to-br from-green-400 to-green-600" : "bg-gradient-to-br from-blue-400 to-blue-600"} text-white text-2xl font-bold shadow-md`}
                              onClick={() => {
                                if (isCorrect === null) {
                                  setUserAnswer((prev) => prev + digit)
                                }
                              }}
                              disabled={isCorrect !== null}
                            >
                              {digit}
                            </motion.button>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-500 text-white text-2xl font-bold shadow-md"
                            onClick={() => {
                              if (isCorrect === null) {
                                setUserAnswer((prev) => prev.slice(0, -1))
                              }
                            }}
                            disabled={isCorrect !== null || userAnswer.length === 0}
                          >
                            ←
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isCorrect !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`p-4 rounded-lg flex items-center ${
                            isCorrect
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                              <span>Correct! Great job!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                              <span>
                                Not quite. The correct answer is <strong>{currentQuestion?.answer}</strong>
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex justify-end mt-4">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <FunButton
                              onClick={nextQuestion}
                              variant="secondary"
                              bubbles={true}
                              size="sm"
                              className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
                            >
                              <span className="sm:inline hidden">Next</span>
                              <ChevronRight className="h-4 w-4 inline-block sm:ml-1" />
                            </FunButton>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6 items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FunButton
                  variant="outline"
                  onClick={() => setShowHint(!showHint)}
                  icon={<Lightbulb className="h-4 w-4 text-yellow-500" />}
                  iconPosition="left"
                  bubbles={true}
                  size="sm"
                  className="px-3 py-2 text-sm font-medium rounded-full min-w-[40px] min-h-[40px]"
                >
                  <span className="sm:inline hidden ml-1">{showHint ? "Hide" : "Hint"}</span>
                </FunButton>
              </motion.div>

              {questionsAnswered > 0 && (
                <motion.div
                  className="text-sm font-medium bg-blue-100/70 dark:bg-blue-900/30 px-3 py-1.5 rounded-full shadow-sm"
                  animate={questionsAnswered > 3 && score / questionsAnswered > 0.7 ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  {Math.round((score / questionsAnswered) * 100)}%
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-md">
                    <CardContent className="pt-4">
                      <div className="flex items-start">
                        <BinaryMascot emotion="happy" size="sm" />
                        <div className="ml-2">
                          <h4 className="font-bold mb-1">Hint:</h4>
                          <p>{getHint()}</p>

                          {mode === "binary-to-decimal" && (
                            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                              {currentQuestion?.question
                                .split(" ")[2]
                                .split("")
                                .map((bit, index, array) => {
                                  const position = array.length - 1 - index
                                  const value = bit === "1" ? Math.pow(2, position) : 0
                                  return (
                                    <div
                                      key={index}
                                      className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg shadow-sm"
                                    >
                                      <div className="text-xs font-medium">Position {position}</div>
                                      <div className="font-bold">{bit}</div>
                                      <div className="text-xs mt-1">
                                        {bit === "1" ? (
                                          <span className="text-green-600 dark:text-green-400">
                                            2<sup>{position}</sup> = {value}
                                          </span>
                                        ) : (
                                          <span className="text-slate-400">0</span>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                            </div>
                          )}

                          {mode === "decimal-to-binary" && (
                            <div className="mt-3 bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg shadow-sm">
                              <p className="text-sm">
                                Divide {currentQuestion?.question.split(" ")[2]} by 2 repeatedly and track the
                                remainders:
                              </p>
                              <div className="font-mono text-xs mt-2 space-y-1">
                                {Array.from({ length: 4 }).map((_, i) => (
                                  <div key={i} className="opacity-70">
                                    {i === 0 ? currentQuestion?.question.split(" ")[2] : "..."} ÷ 2 = ... remainder ...
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs mt-2 italic">
                                Read the remainders from bottom to top to get your binary number.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full max-w-3xl">
            <Card className="bg-gradient-to-br from-violet-50/70 to-blue-50/70 dark:from-violet-900/20 dark:to-blue-900/20 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <BinaryMascot emotion="excited" size="sm" />
                  <h3 className="text-xl font-bold ml-2">Practice Tips</h3>
                </div>

                <ul className="space-y-2 list-disc pl-5">
                  <li>Start with easy problems and work your way up</li>
                  <li>Try to solve problems mentally before using the converter</li>
                  <li>Practice regularly to build your binary skills</li>
                  <li>Challenge yourself with harder problems as you improve</li>
                </ul>

                <div className="mt-4 text-sm text-center bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg shadow-sm">
                  <p>Remember: The key to mastering binary is practice!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

