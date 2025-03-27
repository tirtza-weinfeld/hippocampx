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
import { Play, RefreshCw, Plus, Minus } from "lucide-react"

export default function AreaBuilderPage() {
  const [gameState, setGameState] = useState<"ready" | "building" | "guessing" | "correct" | "incorrect" | "finished">(
    "ready",
  )
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [rectangles, setRectangles] = useState<{ x: number; width: number; height: number }[]>([])
  const [currentFunction, setCurrentFunction] = useState<{
    id: string
    name: string
    fn: (x: number) => number
  }>({
    id: "parabola",
    name: "x²",
    fn: (x: number) => x * x,
  })
  const [userAnswer, setUserAnswer] = useState("")
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [actualArea, setActualArea] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maxLevel = 8

  // Available functions
  const functions = [
    { id: "parabola", name: "x²", fn: (x: number) => x * x },
    { id: "cubic", name: "x³", fn: (x: number) => x * x * x },
    { id: "linear", name: "2x + 1", fn: (x: number) => 2 * x + 1 },
    { id: "sine", name: "sin(x) + 2", fn: (x: number) => Math.sin(x) + 2 },
    { id: "exponential", name: "e^x", fn: (x: number) => Math.exp(x) },
  ]

  // Start a new game
  const startGame = () => {
    setGameState("building")
    setLevel(1)
    setScore(0)
    setRectangles([])
    setUserAnswer("")
    setFeedback("")

    // Set the function based on level
    const functionIndex = 0 // Start with parabola
    setCurrentFunction(functions[functionIndex])
  }

  // Add a rectangle
  const addRectangle = () => {
    if (rectangles.length >= 10) return // Limit to 10 rectangles

    // Calculate where to place the new rectangle
    const minX = -5
    const maxX = 5
    const range = maxX - minX
    const rectWidth = range / 10 // Default width

    // If there are existing rectangles, place the new one after the last one
    let newX = minX
    if (rectangles.length > 0) {
      const lastRect = rectangles[rectangles.length - 1]
      newX = lastRect.x + lastRect.width
    }

    // Don't add if it would go beyond the range
    if (newX + rectWidth > maxX) return

    // Calculate height based on the function at the midpoint of the rectangle
    const midpoint = newX + rectWidth / 2
    const height = currentFunction.fn(midpoint)

    setRectangles([...rectangles, { x: newX, width: rectWidth, height }])
  }

  // Remove the last rectangle
  const removeRectangle = () => {
    if (rectangles.length === 0) return
    setRectangles(rectangles.slice(0, -1))
  }

  // Adjust rectangle width
  // const   adjustRectangleWidth = (index: number, newWidth: number) => {
  //   if (index < 0 || index >= rectangles.length) return

  //   const updatedRectangles = [...rectangles]
  //   updatedRectangles[index].width = newWidth

  //   // Recalculate height based on the new midpoint
  //   const midpoint = updatedRectangles[index].x + newWidth / 2
  //   updatedRectangles[index].height = currentFunction.fn(midpoint)

  //   setRectangles(updatedRectangles)
  // }

  // Calculate the total area of all rectangles
  const calculateTotalArea = () => {
    return rectangles.reduce((sum, rect) => sum + rect.width * rect.height, 0)
  }

  // Submit the area approximation
  const submitArea = () => {
    setGameState("guessing")

    // Calculate the actual area using integration
    let area = 0

    // Simple numerical integration
    const minX = -5
    const maxX = 5
    const numPoints = 1000
    const dx = (maxX - minX) / numPoints

    for (let i = 0; i < numPoints; i++) {
      const x = minX + i * dx
      area += currentFunction.fn(x) * dx
    }

    setActualArea(Math.round(area * 100) / 100)
  }

  // Check the user's answer
  const checkAnswer = () => {
    if (!actualArea) return

    const userAreaGuess = Number.parseFloat(userAnswer)
    const rectangleArea = calculateTotalArea()

    // Check if the answer is close to the actual area
    const isCorrect = !isNaN(userAreaGuess) && Math.abs(userAreaGuess - actualArea) < 0.5

    if (isCorrect) {
      setGameState("correct")
      // Award more points for closer approximations
      const accuracy = 1 - Math.abs(rectangleArea - actualArea) / actualArea
      const levelPoints = Math.round(level * 10 * Math.max(0.5, accuracy))
      setScore((prev) => prev + levelPoints)
      setFeedback(`Correct! The actual area is ${actualArea}. Your approximation was ${rectangleArea.toFixed(2)}.`)
      setShowConfetti(true)

      // If this is a milestone level, show a reward
      // if (level % 2 === 0) {
      //   setShowReward(true)
      // }

      // Move to the next level after a delay
      setTimeout(() => {
        if (level >= maxLevel) {
          setGameState("finished")
          // setShowReward(true)
          setShowConfetti(true)
        } else {
          setLevel((prev) => prev + 1)
          // Change function every 2 levels
          if (level % 2 === 0) {
            const nextFunctionIndex = Math.min(Math.floor(level / 2), functions.length - 1)
            setCurrentFunction(functions[nextFunctionIndex])
          }
          setRectangles([])
          setUserAnswer("")
          setFeedback("")
          setGameState("building")
        }
      }, 2000)
    } else {
      setGameState("incorrect")
      setFeedback(`Not quite! The actual area is ${actualArea}. Your approximation was ${rectangleArea.toFixed(2)}.`)

      // Try again after a delay
      setTimeout(() => {
        setUserAnswer("")
        setFeedback("")
        setGameState("guessing")
      }, 2000)
    }
  }

  // Draw the function and rectangles on the canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up coordinate system with origin at center
    const width = canvas.width
    const height = canvas.height
    const origin = { x: width / 2, y: height / 2 }
    const scale = 30 // Pixels per unit

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
    ctx.strokeStyle = "#10B981" // emerald-500
    ctx.lineWidth = 2
    ctx.beginPath()

    const minX = -5
    const maxX = 5

    for (let i = 0; i <= width; i++) {
      const x = minX + (i / width) * (maxX - minX)
      const y = currentFunction.fn(x)
      const canvasCoords = toCanvasCoords(x, y)

      if (i === 0) {
        ctx.moveTo(canvasCoords.x, canvasCoords.y)
      } else {
        ctx.lineTo(canvasCoords.x, canvasCoords.y)
      }
    }
    ctx.stroke()

    // Draw rectangles
    ctx.fillStyle = "rgba(16, 185, 129, 0.3)" // emerald-500 with opacity

    for (const rect of rectangles) {
      const { x, width: rectWidth, height: rectHeight } = rect
      const canvasX = toCanvasCoords(x, 0).x
      const canvasY = toCanvasCoords(0, rectHeight).y
      const canvasWidth = rectWidth * scale
      const canvasHeight = origin.y - canvasY

      ctx.fillRect(canvasX, canvasY, canvasWidth, canvasHeight)

      // Draw rectangle border
      ctx.strokeStyle = "#10B981" // emerald-500
      ctx.lineWidth = 1
      ctx.strokeRect(canvasX, canvasY, canvasWidth, canvasHeight)
    }
  }, [currentFunction, rectangles])

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Area Builder!",
      content: "In this game, you'll learn about integration by approximating the area under curves using rectangles.",
      emoji: "📐",
    },
    {
      title: "Your Challenge",
      content:
        "You'll be shown a function. Your job is to build rectangles under the curve to approximate the area, then guess the actual area.",
      emoji: "🧩",
    },
    {
      title: "Building Rectangles",
      content:
        "Add rectangles using the '+' button. The height of each rectangle is determined by the function at the midpoint of the rectangle's base.",
      emoji: "🏗️",
    },
    {
      title: "Making Your Guess",
      content:
        "After building your approximation, you'll calculate the total area of your rectangles and then guess the actual area under the curve.",
      emoji: "🤔",
    },
    {
      title: "Let's Build!",
      content: "Click 'Start Game' to begin your area-building adventure!",
      emoji: "🎮",
    },
  ]

  return (
    <div className="container px-4 py-8 md:py-12">
      <TutorialPopup steps={tutorialSteps} gameName="area-builder" />
      <Confetti trigger={showConfetti} count={100} />
      {/* <RewardBadge
        title={gameState === "finished" ? "Integration Master!" : "Level Up!"}
        description={
          gameState === "finished"
            ? `Amazing! You completed the game with ${score} points!`
            : `You've reached level ${level}! Keep up the great work!`
        }
        icon="trophy"
        color="green"
        show={showReward}
        onClose={() => setShowReward(false)}
      /> */}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
            Area Builder
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">Build rectangles to approximate the area under curves!</p>
        </div>

        <Card className="border-2 border-border bg-background/60 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <span>Game Progress</span>
                {gameState !== "ready" && (
                  <span className="ml-2 text-sm badge-fun bg-gradient-to-r from-green-500 to-emerald-400 text-white">
                    Level {level}/{maxLevel}
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium">Score: {score}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{Math.round((level / maxLevel) * 100)}%</span>
              </div>
              <Progress value={(level / maxLevel) * 100} className="h-2" indicatorClassName="bg-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              {gameState === "ready"
                ? "Ready to Build?"
                : gameState === "building"
                  ? "Build Your Approximation"
                  : gameState === "guessing"
                    ? "Guess the Area"
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
                  <p className="text-lg">Approximate the area under curves by building rectangles!</p>
                  <p className="text-sm text-muted-foreground">
                    This is how integration works in calculus - adding up many small pieces to find the total area.
                  </p>
                </div>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full"
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
                    <span className="font-bold text-green-600 dark:text-green-400">{score}</span> points!
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg max-w-md">
                  <h3 className="font-medium mb-2 text-center">Area Builder Ranks</h3>
                  <div className="space-y-2">
                    <div className={`p-2 rounded ${score >= 400 ? "bg-green-100 dark:bg-green-900/30" : "opacity-50"}`}>
                      <div className="flex justify-between">
                        <span>Integration Genius</span>
                        <span>400+ points</span>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded ${score >= 250 && score < 400 ? "bg-green-100 dark:bg-green-900/30" : "opacity-50"}`}
                    >
                      <div className="flex justify-between">
                        <span>Area Master</span>
                        <span>250-399 points</span>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded ${score >= 150 && score < 250 ? "bg-green-100 dark:bg-green-900/30" : "opacity-50"}`}
                    >
                      <div className="flex justify-between">
                        <span>Rectangle Expert</span>
                        <span>150-249 points</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded ${score < 150 ? "bg-green-100 dark:bg-green-900/30" : "opacity-50"}`}>
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
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">
                    {gameState === "building"
                      ? `Build rectangles to approximate the area under f(x) = ${currentFunction.name}`
                      : `Estimate the area under f(x) = ${currentFunction.name} from x = -5 to x = 5`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {gameState === "building"
                      ? "Add rectangles and adjust their widths to get a good approximation"
                      : "Calculate the total area of your rectangles, then guess the actual area"}
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-muted">
                    <canvas ref={canvasRef} width={500} height={300} className="w-full h-auto" />
                  </div>
                </div>

                {gameState === "building" ? (
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={addRectangle}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        disabled={rectangles.length >= 10}
                      >
                        <Plus className="h-4 w-4" />
                        Add Rectangle
                      </Button>
                      <Button
                        onClick={removeRectangle}
                        variant="outline"
                        className="border-green-500 text-green-500"
                        disabled={rectangles.length === 0}
                      >
                        <Minus className="h-4 w-4" />
                        Remove Rectangle
                      </Button>
                    </div>

                    {rectangles.length > 0 && (
                      <div className="space-y-4">
                        <div className="text-sm font-medium">
                          Total Area of Rectangles: {calculateTotalArea().toFixed(2)}
                        </div>

                        <Button
                          onClick={submitArea}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        >
                          Submit Approximation
                        </Button>
                      </div>
                    )}
                  </div>
                ) : gameState === "guessing" ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-sm font-medium">
                      Your rectangle approximation: {calculateTotalArea().toFixed(2)}
                    </div>

                    <div className="flex w-full max-w-sm items-center gap-2">
                      <label className="text-sm font-medium">Actual Area:</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Enter your estimate"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            checkAnswer()
                          }
                        }}
                      />
                      <Button
                        onClick={checkAnswer}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                      >
                        Submit
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter your best estimate of the actual area under the curve
                    </p>
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

