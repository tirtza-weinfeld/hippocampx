"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/old/calculus/confetti"
import { TutorialPopup } from "@/components/old/calculus/tutorial-popup"
import { Play, RefreshCw, Check, ArrowUp, ArrowRight, Maximize, Minimize } from "lucide-react"

export default function FunctionTransformerPage() {
  const [gameState, setGameState] = useState<"ready" | "playing" | "correct" | "incorrect" | "finished">("ready")
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  // const [showTutorial, setShowTutorial] = useState(true)
  const [feedback, setFeedback] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maxLevel = 10

  // Transformation parameters
  const [verticalShift, setVerticalShift] = useState(0)
  const [horizontalShift, setHorizontalShift] = useState(0)
  const [verticalStretch, setVerticalStretch] = useState(1)
  const [horizontalStretch, setHorizontalStretch] = useState(1)

  // Target function parameters
  const [targetFunction, setTargetFunction] = useState<{
    baseFunction: string
    verticalShift: number
    horizontalShift: number
    verticalStretch: number
    horizontalStretch: number
  }>({
    baseFunction: "x²",
    verticalShift: 0,
    horizontalShift: 0,
    verticalStretch: 1,
    horizontalStretch: 1,
  })

  // Base functions
  const baseFunctions = useMemo(() => [
    { name: "x²", fn: (x: number) => x * x },
    { name: "x³", fn: (x: number) => x * x * x },
    { name: "sin(x)", fn: (x: number) => Math.sin(x) },
    { name: "cos(x)", fn: (x: number) => Math.cos(x) },
    { name: "|x|", fn: (x: number) => Math.abs(x) },
  ], [])

  // Generate a new target function
  const generateTargetFunction = (level: number) => {
    // Choose a base function based on level
    const functionIndex = Math.min(Math.floor(level / 2), baseFunctions.length - 1)
    const baseFunction = baseFunctions[functionIndex].name

    // Generate random transformations based on level
    const maxShift = Math.min(3, 1 + Math.floor(level / 3))
    const maxStretch = Math.min(3, 1 + Math.floor(level / 3))

    // More complex transformations at higher levels
    let verticalShift = 0
    let horizontalShift = 0
    let verticalStretch = 1
    let horizontalStretch = 1

    // Level 1-2: Only vertical shifts
    if (level >= 1) {
      verticalShift = Math.floor(Math.random() * (maxShift * 2 + 1)) - maxShift
    }

    // Level 3-4: Add horizontal shifts
    if (level >= 3) {
      horizontalShift = Math.floor(Math.random() * (maxShift * 2 + 1)) - maxShift
    }

    // Level 5-6: Add vertical stretches
    if (level >= 5) {
      verticalStretch = Math.max(0.5, Math.round(Math.random() * maxStretch * 2 * 2) / 2)
    }

    // Level 7+: Add horizontal stretches
    if (level >= 7) {
      horizontalStretch = Math.max(0.5, Math.round(Math.random() * maxStretch * 2) / 2)
    }

    return {
      baseFunction,
      verticalShift,
      horizontalShift,
      verticalStretch,
      horizontalStretch,
    }
  }

  // Start a new game
  const startGame = () => {
    setGameState("playing")
    setLevel(1)
    setScore(0)
    resetTransformations()

    // Generate first target function
    const newTarget = generateTargetFunction(1)
    setTargetFunction(newTarget)
    setFeedback("")
  }

  // Reset transformations to default
  const resetTransformations = () => {
    setVerticalShift(0)
    setHorizontalShift(0)
    setVerticalStretch(1)
    setHorizontalStretch(1)
  }

  // Check if the current transformation matches the target
  const checkTransformation = () => {
    const isCorrect =
      Math.abs(verticalShift - targetFunction.verticalShift) <= 0.1 &&
      Math.abs(horizontalShift - targetFunction.horizontalShift) <= 0.1 &&
      Math.abs(verticalStretch - targetFunction.verticalStretch) <= 0.1 &&
      Math.abs(horizontalStretch - targetFunction.horizontalStretch) <= 0.1

    if (isCorrect) {
      setGameState("correct")
      // More points for higher levels
      const levelPoints = level * 10
      setScore((prev) => prev + levelPoints)
      setFeedback(`Correct! You matched the function f(x) = ${formatFunction(targetFunction)}.`)
      setShowConfetti(true)

      // Move to the next level after a delay
      setTimeout(() => {
        if (level >= maxLevel) {
          setGameState("finished")
        } else {
          setLevel((prev) => prev + 1)
          resetTransformations()
          const newTarget = generateTargetFunction(level + 1)
          setTargetFunction(newTarget)
          setFeedback("")
          setGameState("playing")
        }
      }, 2000)
    } else {
      setGameState("incorrect")
      setFeedback(`Not quite! Try adjusting your transformations to match the target function.`)

      // Try again after a delay
      setTimeout(() => {
        setFeedback("")
        setGameState("playing")
      }, 2000)
    }
  }

  // Format a function with transformations as a string
  const formatFunction = (func: typeof targetFunction) => {
    let result = ""

    // Apply horizontal stretch and shift
    if (func.horizontalStretch !== 1 || func.horizontalShift !== 0) {
      const insideExpr = []

      if (func.horizontalStretch !== 1) {
        insideExpr.push(`${func.horizontalStretch}x`)
      } else {
        insideExpr.push("x")
      }

      if (func.horizontalShift !== 0) {
        insideExpr.push(`${func.horizontalShift > 0 ? "-" : "+"} ${Math.abs(func.horizontalShift)}`)
      }

      result = func.baseFunction.replace("x", `(${insideExpr.join(" ")})`)
    } else {
      result = func.baseFunction
    }

    // Apply vertical stretch
    if (func.verticalStretch !== 1) {
      result = `${func.verticalStretch} * ${result}`
    }

    // Apply vertical shift
    if (func.verticalShift !== 0) {
      result = `${result} ${func.verticalShift > 0 ? "+" : "-"} ${Math.abs(func.verticalShift)}`
    }

    return result
  }

  // Draw the functions on the canvas
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

    // Get the base function
    const baseFunctionObj = baseFunctions.find((f) => f.name === targetFunction.baseFunction) || baseFunctions[0]

    // Draw the target function
    ctx.strokeStyle = "#6366F1" // indigo-500
    ctx.lineWidth = 2
    ctx.beginPath()

    // const     minX = -5
    // const maxX = 5

    for (let i = 0; i <= width; i++) {
      const canvasX = i
      const mathX = (canvasX - origin.x) / scale

      // Apply transformations to x
      const transformedX = (mathX - targetFunction.horizontalShift) / targetFunction.horizontalStretch

      // Calculate y value
      let mathY = baseFunctionObj.fn(transformedX)

      // Apply vertical transformations
      mathY = mathY * targetFunction.verticalStretch + targetFunction.verticalShift

      const canvasY = origin.y - mathY * scale

      if (i === 0) {
        ctx.moveTo(canvasX, canvasY)
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }
    ctx.stroke()

    // Draw the user's function
    ctx.strokeStyle = "#EC4899" // pink-500
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i <= width; i++) {
      const canvasX = i
      const mathX = (canvasX - origin.x) / scale

      // Apply transformations to x
      const transformedX = (mathX - horizontalShift) / horizontalStretch

      // Calculate y value
      let mathY = baseFunctionObj.fn(transformedX)

      // Apply vertical transformations
      mathY = mathY * verticalStretch + verticalShift

      const canvasY = origin.y - mathY * scale

      if (i === 0) {
        ctx.moveTo(canvasX, canvasY)
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }
    ctx.stroke()

    // Add legend
    ctx.font = "14px sans-serif"
    ctx.fillStyle = "#6366F1" // indigo-500
    ctx.fillText("Target Function", width - 100, 20)

    ctx.fillStyle = "#EC4899" // pink-500
    ctx.fillText("Your Function", width - 100, 40)
  }, [
    baseFunctions,
    horizontalShift,
    horizontalStretch,
    targetFunction.baseFunction,
    targetFunction.horizontalShift,
    targetFunction.horizontalStretch,
    targetFunction.verticalShift,
    targetFunction.verticalStretch,
    verticalShift,
    verticalStretch
  ])

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Function Transformer!",
      content:
        "In this game, you'll learn how transformations affect the graphs of functions - a key concept in calculus!",
      emoji: "📊",
    },
    {
      title: "Your Challenge",
      content:
        "You'll be shown a transformed function (in blue). Your job is to apply transformations to match it with your function (in pink).",
      emoji: "🎯",
    },
    {
      title: "Transformations",
      content:
        "You can shift functions up, down, left, or right. You can also stretch or compress them vertically or horizontally.",
      emoji: "↔️",
    },
    {
      title: "Controls",
      content: "Use the sliders to adjust your transformations. Watch how each change affects your function's graph.",
      emoji: "🎛️",
    },
    {
      title: "Let's Transform!",
      content: "Click 'Start Game' to begin your function transformation adventure!",
      emoji: "🎮",
    },
  ]

  return (
    <div className="container px-4 py-8 md:py-12">
      <Confetti trigger={showConfetti} count={100} />
      {/* <RewardBadge
        title={gameState === "finished" ? "Transformation Master!" : "Level Up!"}
        description={
          gameState === "finished"
            ? `Amazing! You completed the game with ${score} points!`
            : `You've reached level ${level}! Keep up the great work!`
        }
        icon="trophy"
        color="indigo"
        show={showReward}
        onClose={() => setShowReward(false)}
      /> */}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-4 items-center">

            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-transparent bg-clip-text">
              Function Transformer
            </h1>

            <TutorialPopup steps={tutorialSteps} gameName="function-transformer" />
          </div>

          <p className="mt-4 text-xl text-muted-foreground">Transform functions to match the target graph!</p>
        </div>

        <Card className="border-2 bg-background/60 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <span>Game Progress</span>
                {gameState !== "ready" && (
                  <span className="ml-2 text-sm badge-fun bg-gradient-to-r from-indigo-500 to-violet-400 text-white">
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
              <Progress value={(level / maxLevel) * 100} className="h-2" indicatorClassName="bg-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              {gameState === "ready"
                ? "Ready to Transform?"
                : gameState === "playing"
                  ? "Match the Function"
                  : gameState === "correct"
                    ? "Perfect Match!"
                    : gameState === "incorrect"
                      ? "Not Quite!"
                      : "Game Over!"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gameState === "ready" ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-lg">Transform functions to match the target graph!</p>
                  <p className="text-sm text-muted-foreground">
                    Learn how shifting and stretching affects the shape of functions.
                  </p>
                </div>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full"
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
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{score}</span> points!
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg max-w-md">
                  <h3 className="font-medium mb-2 text-center">Function Transformer Ranks</h3>
                  <div className="space-y-2">
                    <div
                      className={`p-2 rounded ${score >= 500 ? "bg-indigo-100 dark:bg-indigo-900/30" : "opacity-50"}`}
                    >
                      <div className="flex justify-between">
                        <span>Transformation Genius</span>
                        <span>500+ points</span>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded ${score >= 300 && score < 500 ? "bg-indigo-100 dark:bg-indigo-900/30" : "opacity-50"}`}
                    >
                      <div className="flex justify-between">
                        <span>Function Master</span>
                        <span>300-499 points</span>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded ${score >= 150 && score < 300 ? "bg-indigo-100 dark:bg-indigo-900/30" : "opacity-50"}`}
                    >
                      <div className="flex justify-between">
                        <span>Graph Expert</span>
                        <span>150-299 points</span>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded ${score < 150 ? "bg-indigo-100 dark:bg-indigo-900/30" : "opacity-50"}`}
                    >
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
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">
                    Transform the function f(x) = {targetFunction.baseFunction} to match the target function
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Adjust the sliders to apply transformations to your function
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-muted">
                    <canvas ref={canvasRef} width={500} height={300} className="
                    @xs:w-full @lg:w-auto
                    " />
                  </div>
                </div>

                {gameState === "playing" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium flex items-center gap-1">
                              <ArrowUp className="h-4 w-4 text-indigo-500" />
                              <span>Vertical Shift: {verticalShift}</span>
                            </label>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setVerticalShift(0)}
                            >
                              0
                            </Button>
                          </div>
                          <Slider
                            value={[verticalShift]}
                            min={-5}
                            max={5}
                            step={0.5}
                            onValueChange={(value) => setVerticalShift(value[0])}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium flex items-center gap-1">
                              <ArrowRight className="h-4 w-4 text-indigo-500" />
                              <span>Horizontal Shift: {horizontalShift}</span>
                            </label>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setHorizontalShift(0)}
                            >
                              0
                            </Button>
                          </div>
                          <Slider
                            value={[horizontalShift]}
                            min={-5}
                            max={5}
                            step={0.5}
                            onValueChange={(value) => setHorizontalShift(value[0])}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium flex items-center gap-1">
                              <Maximize className="h-4 w-4 text-indigo-500" />
                              <span>Vertical Stretch: {verticalStretch}</span>
                            </label>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setVerticalStretch(1)}
                            >
                              1
                            </Button>
                          </div>
                          <Slider
                            value={[verticalStretch]}
                            min={0.5}
                            max={3}
                            step={0.5}
                            onValueChange={(value) => setVerticalStretch(value[0])}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium flex items-center gap-1">
                              <Minimize className="h-4 w-4 text-indigo-500" />
                              <span>Horizontal Stretch: {horizontalStretch}</span>
                            </label>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setHorizontalStretch(1)}
                            >
                              1
                            </Button>
                          </div>
                          <Slider
                            value={[horizontalStretch]}
                            min={0.5}
                            max={3}
                            step={0.5}
                            onValueChange={(value) => setHorizontalStretch(value[0])}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={checkTransformation}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Check Match
                      </Button>
                      <Button variant="outline" onClick={resetTransformations}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    className={`p-4 rounded-lg ${gameState === "correct"
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

