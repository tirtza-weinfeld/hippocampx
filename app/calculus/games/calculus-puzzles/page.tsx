"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Check, X } from "lucide-react"
import { Confetti } from "@/components/calculus/confetti"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import Image from "next/image"
// import { RewardBadge } from "@/components/calculus/reward-badge"

// Define puzzle types
type PuzzleType = "derivative" | "integral" | "limit" | "application"

// Define puzzle difficulty
type Difficulty = "easy" | "medium" | "hard"

// Define puzzle structure
interface Puzzle {
  id: number
  type: PuzzleType
  difficulty: Difficulty
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  image?: string
  points: number
}

// Define puzzles by category
const PUZZLES: Record<PuzzleType, Puzzle[]> = {
  derivative: [
    {
      id: 1,
      type: "derivative",
      difficulty: "easy",
      question: "What is the derivative of f(x) = x²?",
      options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = 2", "f'(x) = x²"],
      correctAnswer: 1,
      explanation: "The derivative of x² is 2x. We use the power rule: if f(x) = xⁿ, then f'(x) = n·xⁿ⁻¹.",
      points: 10,
    },
    {
      id: 2,
      type: "derivative",
      difficulty: "medium",
      question: "What is the derivative of f(x) = sin(x)?",
      options: ["f'(x) = cos(x)", "f'(x) = -sin(x)", "f'(x) = -cos(x)", "f'(x) = tan(x)"],
      correctAnswer: 0,
      explanation: "The derivative of sin(x) is cos(x).",
      points: 15,
    },
    {
      id: 3,
      type: "derivative",
      difficulty: "hard",
      question: "What is the derivative of f(x) = e^x · cos(x)?",
      options: [
        "f'(x) = e^x · cos(x)",
        "f'(x) = e^x · cos(x) - e^x · sin(x)",
        "f'(x) = e^x · cos(x) + e^x · sin(x)",
        "f'(x) = -e^x · sin(x)",
      ],
      correctAnswer: 2,
      explanation:
        "We use the product rule: (u·v)' = u'·v + u·v'. Here, u = e^x and v = cos(x). So u' = e^x and v' = -sin(x). Therefore, f'(x) = e^x · cos(x) + e^x · (-sin(x)) = e^x · cos(x) - e^x · sin(x).",
      points: 25,
    },
  ],
  integral: [
    {
      id: 4,
      type: "integral",
      difficulty: "easy",
      question: "What is ∫ x dx?",
      options: ["x", "x²", "x²/2", "x²/2 + C"],
      correctAnswer: 3,
      explanation: "The integral of x is x²/2 + C, where C is the constant of integration.",
      points: 10,
    },
    {
      id: 5,
      type: "integral",
      difficulty: "medium",
      question: "What is ∫ sin(x) dx?",
      options: ["cos(x) + C", "-cos(x) + C", "sin(x) + C", "-sin(x) + C"],
      correctAnswer: 1,
      explanation: "The integral of sin(x) is -cos(x) + C.",
      points: 15,
    },
    {
      id: 6,
      type: "integral",
      difficulty: "hard",
      question: "What is the area under the curve f(x) = x² from x = 0 to x = 2?",
      options: ["2", "4", "8/3", "4/3"],
      correctAnswer: 2,
      explanation:
        "The area under the curve is given by the definite integral ∫₀² x² dx = [x³/3]₀² = 2³/3 - 0³/3 = 8/3.",
      points: 25,
    },
  ],
  limit: [
    {
      id: 7,
      type: "limit",
      difficulty: "easy",
      question: "What is lim(x→2) x²?",
      options: ["0", "2", "4", "∞"],
      correctAnswer: 2,
      explanation: "To find the limit, we substitute x = 2 into the function: 2² = 4.",
      points: 10,
    },
    {
      id: 8,
      type: "limit",
      difficulty: "medium",
      question: "What is lim(x→0) (sin(x)/x)?",
      options: ["0", "1", "∞", "The limit does not exist"],
      correctAnswer: 1,
      explanation: "This is a famous limit in calculus. As x approaches 0, sin(x)/x approaches 1.",
      points: 15,
    },
    {
      id: 9,
      type: "limit",
      difficulty: "hard",
      question: "What is lim(x→0) (1-cos(x))/x²?",
      options: ["0", "1/2", "1", "∞"],
      correctAnswer: 1,
      explanation:
        "This limit can be evaluated using L'Hôpital's rule or the Taylor series expansion of cos(x). The result is 1/2.",
      points: 25,
    },
  ],
  application: [
    {
      id: 10,
      type: "application",
      difficulty: "easy",
      question: "If a car's position is given by s(t) = t² + 2t, what is its velocity at t = 3?",
      options: ["3", "8", "6", "12"],
      correctAnswer: 2,
      explanation: "The velocity is the derivative of position: v(t) = s'(t) = 2t + 2. At t = 3, v(3) = 2(3) + 2 = 8.",
      points: 10,
    },
    {
      id: 11,
      type: "application",
      difficulty: "medium",
      question:
        "A ball is thrown upward with an initial velocity of 20 m/s. If its height is given by h(t) = 20t - 5t², at what time does it reach its maximum height?",
      options: ["1 second", "2 seconds", "4 seconds", "5 seconds"],
      correctAnswer: 1,
      explanation:
        "The ball reaches its maximum height when its velocity is zero. The velocity is h'(t) = 20 - 10t. Setting this equal to zero: 20 - 10t = 0, so t = 2 seconds.",
      points: 15,
    },
    {
      id: 12,
      type: "application",
      difficulty: "hard",
      question:
        "A company's profit function is P(x) = -0.01x² + 100x - 1000, where x is the number of items produced. How many items should be produced to maximize profit?",
      options: ["5000", "4000", "5500", "6000"],
      correctAnswer: 0,
      explanation:
        "To maximize profit, we find where the derivative of the profit function equals zero. P'(x) = -0.02x + 100. Setting this equal to zero: -0.02x + 100 = 0, so x = 5000 items.",
      points: 25,
    },
  ],
}

export default function CalculusPuzzlesGame() {
  const [currentType, setCurrentType] = useState<PuzzleType>("derivative")
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  // const [showReward, setShowReward] = useState(false)
  const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([])

  const puzzleTypes: PuzzleType[] = ["derivative", "integral", "limit", "application"]
  const currentPuzzle = PUZZLES[currentType][currentPuzzleIndex]

  // Calculate total puzzles
  const totalPuzzles = Object.values(PUZZLES).reduce((sum, puzzles) => sum + puzzles.length, 0)

  // Update progress when completing puzzles
  useEffect(() => {
    setProgress((completedPuzzles.length / totalPuzzles) * 100)
  }, [completedPuzzles, totalPuzzles])

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index)
    }
  }

  const checkAnswer = () => {
    if (selectedAnswer === null) return

    setIsAnswered(true)
    const correct = selectedAnswer === currentPuzzle.correctAnswer
    setIsCorrect(correct)

    if (correct) {
      setScore((prev) => prev + currentPuzzle.points)
      setShowConfetti(true)
      setCompletedPuzzles((prev) => [...prev, currentPuzzle.id])

      // Check if all puzzles are completed
      if (completedPuzzles.length + 1 === totalPuzzles) {
        setTimeout(() => {
          // setShowReward(true)
        }, 1500)
      }
    }
  }

  const nextPuzzle = () => {
    setShowConfetti(false)
    setIsAnswered(false)
    setSelectedAnswer(null)

    // If we've reached the end of the current type's puzzles
    if (currentPuzzleIndex >= PUZZLES[currentType].length - 1) {
      // Find the next type that has puzzles
      const currentTypeIndex = puzzleTypes.indexOf(currentType)
      const nextTypeIndex = (currentTypeIndex + 1) % puzzleTypes.length

      // If we've gone through all types, start over
      if (nextTypeIndex === 0) {
        resetGame()
        return
      }

      setCurrentType(puzzleTypes[nextTypeIndex])
      setCurrentPuzzleIndex(0)
    } else {
      // Move to the next puzzle in the current type
      setCurrentPuzzleIndex((prev) => prev + 1)
    }
  }

  const resetGame = () => {
    setCurrentType("derivative")
    setCurrentPuzzleIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCorrect(false)
    setScore(0)
    setShowConfetti(false)
    // setShowReward(false)
    setCompletedPuzzles([])
  }

  const getTypeColor = (type: PuzzleType) => {
    switch (type) {
      case "derivative":
        return "from-pink-500 to-rose-400"
      case "integral":
        return "from-blue-500 to-indigo-400"
      case "limit":
        return "from-purple-500 to-violet-400"
      case "application":
        return "from-amber-500 to-orange-400"
    }
  }

  const getTypeIcon = (type: PuzzleType) => {
    switch (type) {
      case "derivative":
        return "d/dx"
      case "integral":
        return "∫"
      case "limit":
        return "lim"
      case "application":
        return "f(x)"
    }
  }

  const getTypeName = (type: PuzzleType) => {
    switch (type) {
      case "derivative":
        return "Derivatives"
      case "integral":
        return "Integrals"
      case "limit":
        return "Limits"
      case "application":
        return "Applications"
    }
  }

  const steps = [
    {
      title: "How to Play Calculus Puzzles",
      content: "Welcome to Calculus Puzzles! Test your calculus knowledge with fun puzzles across different topics.",
      emoji: "🎮"
    },
    {
      title: "Game Objective",
      content: "Solve puzzles correctly to earn points and complete all categories.",
      emoji: "🎯"
    },
    {
      title: "How to Play",
      content: "Read each question carefully, select your answer, and click 'Check Answer' to see if you're right. Learn from the explanation provided and move on to the next puzzle.",
      emoji: "📝"
    },
    {
      title: "Categories",
      content: "Derivatives - Problems about rates of change and slopes\nIntegrals - Problems about areas and accumulation\nLimits - Problems about approaching values\nApplications - Real-world problems using calculus",
      emoji: "📚"
    },
    {
      title: "Learning Tips",
      content: "Don't worry if you get a puzzle wrong - the explanation will help you learn!",
      emoji: "💡"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center gap-4 items-center mb-6">

        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-rose-400 text-transparent bg-clip-text">
          Calculus Puzzles
        </h1>
        <TutorialPopup steps={steps} gameName="calculus-puzzles" className="bg-pink-500/10 text-pink-500 border-pink-600/20" />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-md border-2 border-border">
            <CardHeader className={`bg-gradient-to-r ${getTypeColor(currentType)} text-white rounded-t-lg`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {getTypeIcon(currentType)}
                  </div>
                  <div>
                    <CardTitle>{getTypeName(currentType)}</CardTitle>
                    <CardDescription className="text-white/80">
                      Puzzle {currentPuzzleIndex + 1} of {PUZZLES[currentType].length}
                    </CardDescription>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/20 text-sm">
                  {currentPuzzle.difficulty.charAt(0).toUpperCase() + currentPuzzle.difficulty.slice(1)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="relative">
                <div className="mb-6 text-lg font-medium">{currentPuzzle.question}</div>

                {currentPuzzle.image && (
                  <div className="mb-6 flex justify-center">
                    <Image
                      src={currentPuzzle.image || "/placeholder.svg"}
                      alt="Puzzle illustration"
                      className="max-w-full h-auto rounded-md border border-border"
                    />
                  </div>
                )}

                <RadioGroup value={selectedAnswer?.toString()} className="space-y-3">
                  {currentPuzzle.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-md border-2 border-border transition-all ${isAnswered
                          ? index === currentPuzzle.correctAnswer
                            ? "border-green-500 bg-green-50"
                            : selectedAnswer === index
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200"
                          : selectedAnswer === index
                            ? "border-blue-500"
                            : "border-gray-200"
                        }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isAnswered} />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                        {option}
                      </Label>
                      {isAnswered && index === currentPuzzle.correctAnswer && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                      {isAnswered && selectedAnswer === index && index !== currentPuzzle.correctAnswer && (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {isAnswered && (
                  <div
                    className={`mt-6 p-4 rounded-md ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <p className={`font-medium ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {isCorrect ? "Correct!" : "Not quite right."}
                    </p>
                    <p className="mt-1 text-gray-700">{currentPuzzle.explanation}</p>
                  </div>
                )}

                {showConfetti && <Confetti />}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              {!isAnswered ? (
                <Button
                  onClick={checkAnswer}
                  className={`bg-gradient-to-r ${getTypeColor(currentType)} text-white`}
                  disabled={selectedAnswer === null}
                >
                  Check Answer
                </Button>
              ) : (
                <Button onClick={nextPuzzle} className={`bg-gradient-to-r ${getTypeColor(currentType)} text-white`}>
                  Next Puzzle <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="shadow-md h-full flex flex-col border-2 border-border">
            <CardHeader>
              <CardTitle>Game Progress</CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Score</p>
                  <p className="text-3xl font-bold">{score}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Puzzle Categories</p>

                  {puzzleTypes.map((type) => {
                    const completedInType = completedPuzzles.filter((id) =>
                      PUZZLES[type].some((puzzle) => puzzle.id === id),
                    ).length
                    const totalInType = PUZZLES[type].length

                    return (
                      <div
                        key={type}
                        className={`p-3 rounded-md border border-border ${currentType === type ? "border-blue-500" : "border-gray-200"}`}
                        onClick={() => {
                          if (!isAnswered) {
                            setCurrentType(type)
                            setCurrentPuzzleIndex(0)
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-8 w-8 rounded-full bg-gradient-to-r ${getTypeColor(type)} flex items-center justify-center text-white text-xs font-bold`}
                            >
                              {getTypeIcon(type)}
                            </div>
                            <span>{getTypeName(type)}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {completedInType}/{totalInType}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button variant="outline" className="w-full" onClick={resetGame}>
                Reset Game
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>



      {/* {showReward && (
        <RewardBadge
          title="Calculus Puzzle Master"
          description="You've completed all the calculus puzzles! Your understanding of calculus concepts is impressive!"
          image="/placeholder.svg?height=200&width=200"
          score={score}
          onClose={() => {
            setShowReward(false)
            resetGame()
          }}
        />
      )} */}
    </div>
  )
}

