"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/calculus/confetti"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { Play, RefreshCw, Timer, Trophy } from "lucide-react"

export default function SlopeRacerPage() {
  const [gameState, setGameState] = useState<"ready" | "playing" | "correct" | "incorrect" | "finished">("ready")
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [userAnswer, setUserAnswer] = useState("")
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [currentProblem, setCurrentProblem] = useState<{
    function: string
    point: [number, number]
    slope: number
  } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const maxLevel = 10

  // Generate a new problem
  const generateProblem = () => {
    // Different functions based on level
    const functions = [
      { fn: "x²", derivative: "2x", generator: (x: number) => x * x, derivativeAt: (x: number) => 2 * x },
      { fn: "x³", derivative: "3x²", generator: (x: number) => x * x * x, derivativeAt: (x: number) => 3 * x * x },
      {
        fn: "sin(x)",
        derivative: "cos(x)",
        generator: (x: number) => Math.sin(x),
        derivativeAt: (x: number) => Math.cos(x),
      },
      {
        fn: "cos(x)",
        derivative: "-sin(x)",
        generator: (x: number) => Math.cos(x),
        derivativeAt: (x: number) => -Math.sin(x),
      },
      {
        fn: "x² + 2x",
        derivative: "2x + 2",
        generator: (x: number) => x * x + 2 * x,
        derivativeAt: (x: number) => 2 * x + 2,
      },
    ]

    const selectedFunction = functions[Math.floor(Math.random() * functions.length)]
    const x = Math.random() * 4 - 2 // Random x between -2 and 2
    const y = selectedFunction.generator(x)

    // Calculate the actual slope at this point
    const slope = selectedFunction.derivativeAt(x)
    const roundedSlope = Math.round(slope * 100) / 100

    return {
      function: selectedFunction.fn,
      point: [x, y] as [number, number],
      slope: roundedSlope,
    }
  }

  // Start a new game
  const startGame = () => {
    setGameState("playing")
    setLevel(1)
    setScore(0)
    setTimeLeft(30)
    const newProblem = generateProblem()
    setCurrentProblem(newProblem)
    setUserAnswer("")
    setFeedback("")

    // Start the timer
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout)
          setGameState("finished")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Check the user's answer
  const checkAnswer = () => {
    if (!currentProblem) return

    const userSlope = Number.parseFloat(userAnswer)

    // Check if the answer is correct (within a small margin of error)
    const isCorrect = !isNaN(userSlope) && Math.abs(userSlope - currentProblem.slope) < 0.1

    if (isCorrect) {
      setGameState("correct")
      setScore((prev) => prev + level * 10)
      setFeedback(`Correct! The slope is ${currentProblem.slope}.`)
      setShowConfetti(true)

      // If this is a milestone level, show a reward
      if (level % 3 === 0) {
        // setShowReward(true)
      }

      // Move to the next level after a delay
      setTimeout(() => {
        if (level >= maxLevel) {
          setGameState("finished")
          // setShowReward(true)
          setShowConfetti(true)
          if (timerRef.current) clearInterval(timerRef.current)
        } else {
          setLevel((prev) => prev + 1)
          const newProblem = generateProblem()
          setCurrentProblem(newProblem)
          setUserAnswer("")
          setFeedback("")
          setGameState("playing")
        }
      }, 2000)
    } else {
      setGameState("incorrect")
      setFeedback(`Not quite! The correct slope is ${currentProblem.slope}.`)

      // Try again after a delay
      setTimeout(() => {
        setUserAnswer("")
        setFeedback("")
        setGameState("playing")
      }, 2000)
    }
  }

  // Draw the function and tangent line on the canvas
  useEffect(() => {
    if (!currentProblem || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up coordinate system with origin at center
    const width = canvas.width
    const height = canvas.height
    const origin = { x: width / 2, y: height / 2 }
    const scale = 40 // Pixels per unit

    // Helper function to convert mathematical coordinates to canvas coordinates
    const toCanvasCoords = (x: number, y: number) => ({
      x: origin.x + x * scale,
      y: origin.y - y * scale, // Flip y-axis
    })

    // Draw axes
    ctx.strokeStyle = "#94A3B8" // slate-400
    ctx.lineWidth = 1

    // x-axis
    ctx.beginPath()
    ctx.moveTo(0, origin.y)
    ctx.lineTo(width, origin.y)
    ctx.stroke()

    // y-axis
    ctx.beginPath()
    ctx.moveTo(origin.x, 0)
    ctx.lineTo(origin.x, height)
    ctx.stroke()

    // Draw tick marks
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748B" // slate-500

    // x-axis ticks
    for (let x = -Math.floor(origin.x / scale); x <= Math.floor((width - origin.x) / scale); x++) {
      if (x === 0) continue // Skip origin
      const canvasX = toCanvasCoords(x, 0).x
      ctx.beginPath()
      ctx.moveTo(canvasX, origin.y - 5)
      ctx.lineTo(canvasX, origin.y + 5)
      ctx.stroke()
      ctx.fillText(x.toString(), canvasX, origin.y + 15)
    }

    // y-axis ticks
    for (let y = -Math.floor((height - origin.y) / scale); y <= Math.floor(origin.y / scale); y++) {
      if (y === 0) continue // Skip origin
      const canvasY = toCanvasCoords(0, y).y
      ctx.beginPath()
      ctx.moveTo(origin.x - 5, canvasY)
      ctx.lineTo(origin.x + 5, canvasY)
      ctx.stroke()
      ctx.fillText(y.toString(), origin.x - 15, canvasY)
    }

    // Origin label
    ctx.fillText("0", origin.x - 10, origin.y + 15)

    // Draw the function
    ctx.strokeStyle = "#3B82F6" // blue-500
    ctx.lineWidth = 2
    ctx.beginPath()

    // Determine which function to draw based on the problem
    let functionGenerator: (x: number) => number

    if (currentProblem.function === "x²") {
      functionGenerator = (x) => x * x
    } else if (currentProblem.function === "x³") {
      functionGenerator = (x) => x * x * x
    } else if (currentProblem.function === "sin(x)") {
      functionGenerator = (x) => Math.sin(x)
    } else if (currentProblem.function === "cos(x)") {
      functionGenerator = (x) => Math.cos(x)
    } else if (currentProblem.function === "x² + 2x") {
      functionGenerator = (x) => x * x + 2 * x
    } else {
      // Default to x²
      functionGenerator = (x) => x * x
    }

    // Draw the function
    for (let i = 0; i <= width; i++) {
      const x = (i - origin.x) / scale
      const y = functionGenerator(x)
      const canvasCoords = toCanvasCoords(x, y)

      if (i === 0) {
        ctx.moveTo(canvasCoords.x, canvasCoords.y)
      } else {
        ctx.lineTo(canvasCoords.x, canvasCoords.y)
      }
    }
    ctx.stroke()

    // Draw the point on the curve
    const [pointX, pointY] = currentProblem.point
    const pointCoords = toCanvasCoords(pointX, pointY)

    ctx.fillStyle = "#EC4899" // pink-500
    ctx.beginPath()
    ctx.arc(pointCoords.x, pointCoords.y, 6, 0, Math.PI * 2)
    ctx.fill()

    // If the game state is "correct" or "incorrect", draw the tangent line
    if (gameState === "correct" || gameState === "incorrect") {
      const slope = currentProblem.slope

      // Calculate tangent line endpoints
      const tangentLength = 2 // Length in units
      const x1 = pointX - tangentLength / 2
      const y1 = pointY - (slope * tangentLength) / 2
      const x2 = pointX + tangentLength / 2
      const y2 = pointY + (slope * tangentLength) / 2

      // Draw tangent line
      ctx.strokeStyle = gameState === "correct" ? "#10B981" : "#EF4444" // green-500 or red-500
      ctx.lineWidth = 2
      ctx.beginPath()
      const start = toCanvasCoords(x1, y1)
      const end = toCanvasCoords(x2, y2)
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }
  }, [currentProblem, gameState])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Slope Racer!",
      content:
        "In this game, you'll practice finding the slopes of tangent lines to curves - a key concept in calculus!",
      emoji: "🏎️",
    },
    {
      title: "Your Challenge",
      content:
        "You'll be shown a function and a point on the curve. Your job is to find the slope of the tangent line at that point.",
      emoji: "📈",
    },
    {
      title: "How to Play",
      content:
        "Look at the function and the highlighted point. Calculate the derivative at that point to find the slope, then enter your answer.",
      emoji: "🧮",
    },
    {
      title: "Beat the Clock",
      content:
        "You have 30 seconds to solve as many problems as you can. Each correct answer earns you points based on the level.",
      emoji: "⏱️",
    },
    {
      title: "Let's Race!",
      content: "Click 'Start Game' to begin your slope-finding adventure!",
      emoji: "🏁",
    },
  ]

  return (
    <div className="container px-4 py-8 md:py-12">
      <TutorialPopup steps={tutorialSteps} gameName="slope-racer" />
      <Confetti trigger={showConfetti} count={100} />
      {/* <RewardBadge
        title={gameState === "finished" ? "Slope Master!" : "Level Up!"}
        description={
          gameState === "finished"
            ? `Amazing! You completed the game with ${score} points!`
            : `You've reached level ${level}! Keep up the great work!`
        }
        icon="trophy"
        color="blue"
        show={showReward}
        onClose={() => setShowReward(false)}
      /> */}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 via-sky-600 to-teal-600 text-transparent bg-clip-text">
            Slope Racer
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">Race against time to find the slopes of tangent lines!</p>
        </div>

        <Card className="border-2 bg-background/60 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <span>Game Progress</span>
                {gameState !== "ready" && (
                  <span className="ml-2 text-sm badge-fun bg-gradient-to-r from-blue-500 to-sky-400 text-white">
                    Level {level}/{maxLevel}
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span>{score}</span>
                </div>
                {gameState !== "ready" && gameState !== "finished" && (
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Timer className="h-4 w-4 text-red-500" />
                    <span className={timeLeft <= 10 ? "text-red-500 animate-pulse" : ""}>{timeLeft}s</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{Math.round((level / maxLevel) * 100)}%</span>
              </div>
              <Progress value={(level / maxLevel) * 100} className="h-2" indicatorClassName="bg-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              {gameState === "ready"
                ? "Ready to Race?"
                : gameState === "playing"
                  ? "Find the Slope!"
                  : gameState === "correct"
                    ? "Correct!"
                    : gameState === "incorrect"
                      ? "Not Quite!"
                      : "Game Over!"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gameState === "ready" ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-lg">Find the slopes of tangent lines to curves as quickly as you can!</p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll need to use your knowledge of derivatives to succeed.
                  </p>
                </div>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
              </div>
            ) : gameState === "finished" ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold">🎉 Game Over! 🎉</p>
                  <p className="text-lg">
                    You finished with a score of{" "}
                    <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> points!
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg max-w-md">
                  <h3 className="font-medium mb-2 text-center">Slope Racer Ranks</h3>
                  <div className="space-y-2">
                    <div className={`p-2 rounded ${score >= 500 ? "bg-blue-100 dark:bg-blue-900/30" : "opacity-50"}`}>
                      <div className="flex justify-between">
                        <span>Calculus Genius</span>
                        <span>500+ points</span>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded ${score >= 300 && score < 500 ? "bg-blue-100 dark:bg-blue-900/30" : "opacity-50"}`}
                    >
                      <div className="flex justify-between">
                        <span>Derivative Master</span>
                        <span>300-499 points</span>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded ${score >= 150 && score < 300 ? "bg-blue-100 dark:bg-blue-900/30" : "opacity-50"}`}
                    >
                      <div className="flex justify-between">
                        <span>Slope Expert</span>
                        <span>150-299 points</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded ${score < 150 ? "bg-blue-100 dark:bg-blue-900/30" : "opacity-50"}`}>
                      <div className="flex justify-between">
                        <span>Calculus Apprentice</span>
                        <span>0-149 points</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {currentProblem && (
                  <>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium">
                        Find the slope of the tangent line to f(x) = {currentProblem.function} at the point (
                        {currentProblem.point[0]}, {currentProblem.point[1].toFixed(2)})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Calculate the derivative f&apos;(x) and evaluate it at x = {currentProblem.point[0]}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-muted">
                        <canvas ref={canvasRef} width={500} height={300} className="w-full h-auto" />
                      </div>
                    </div>

                    {gameState === "playing" ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex w-full max-w-sm items-center gap-2">
                          <label className="text-sm font-medium">Slope:</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Enter the slope"
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                checkAnswer()
                              }
                            }}
                          />
                          <Button
                            onClick={checkAnswer}
                            className="bg-gradient-to-r from-blue-600 to-sky-600 text-white"
                          >
                            Submit
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Enter your answer with up to 2 decimal places</p>
                      </div>
                    ) : (
                      <motion.div
                        className={`p-4 rounded-lg ${
                          gameState === "correct"
                            ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                            : "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-center font-medium">{feedback}</p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

