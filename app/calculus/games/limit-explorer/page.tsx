"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight, Home, RefreshCw, HelpCircle, Download, Share } from "lucide-react"
import Link from "next/link"
import { Confetti } from "@/components/calculus/confetti"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { downloadCanvasAsImage, shareCanvas } from "@/components/calculus/utility/share-utils"

const LEVELS = [
  {
    id: 1,
    title: "Simple Approach",
    description: "Approach x = 2 from both sides",
    function: (x: number) => (x === 2 ? null : x * x - 4),
    limit: 0,
    limitPoint: 2,
    xMin: 0,
    xMax: 4,
    yMin: -5,
    yMax: 5,
    tutorial:
      "Move the character as close as possible to x = 2 without crossing it. The limit of this function as x approaches 2 is 0.",
  },
  {
    id: 2,
    title: "Discontinuous Function",
    description: "Find the limit as x approaches 1",
    function: (x: number) => (x === 1 ? null : (x - 1) / (x - 1)),
    limit: 1,
    limitPoint: 1,
    xMin: 0,
    xMax: 2,
    yMin: 0,
    yMax: 2,
    tutorial:
      "This function has a hole at x = 1. Try to determine what value the function approaches as x gets closer to 1.",
  },
  {
    id: 3,
    title: "Different Sides",
    description: "Approach x = 0 from left and right",
    function: (x: number) => (x === 0 ? null : x / Math.abs(x)),
    limit: null, // No limit exists
    limitPoint: 0,
    xMin: -2,
    xMax: 2,
    yMin: -2,
    yMax: 2,
    tutorial: "This function approaches different values from the left and right sides of x = 0. Does a limit exist?",
  },
  {
    id: 4,
    title: "Oscillating Function",
    description: "Approach x = 0 with a sine function",
    function: (x: number) => (x === 0 ? null : Math.sin(1 / x)),
    limit: null, // No limit exists
    limitPoint: 0,
    xMin: -0.5,
    xMax: 0.5,
    yMin: -1.5,
    yMax: 1.5,
    tutorial:
      "This function oscillates infinitely as x approaches 0. Try to observe what happens as you get closer and closer.",
  },
  {
    id: 5,
    title: "Rational Function",
    description: "Find the limit of (x² - 4)/(x - 2) as x approaches 2",
    function: (x: number) => (x === 2 ? null : (x * x - 4) / (x - 2)),
    limit: 4,
    limitPoint: 2,
    xMin: 0,
    xMax: 4,
    yMin: 0,
    yMax: 8,
    tutorial: "This rational function has a removable discontinuity at x = 2. Can you determine what the limit is?",
  },
]

export default function LimitExplorerGame() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [position, setPosition] = useState(0)
  const [gameState, setGameState] = useState<"playing" | "success" | "failed">("playing")
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)
  // const [showReward, setShowReward] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const level = LEVELS[currentLevel]

  // Initialize position at the start of each level
  useEffect(() => {
    setPosition(level.xMin + (level.xMax - level.xMin) * 0.25)
    setGameState("playing")
    setAttempts(0)
  }, [currentLevel, level.xMin, level.xMax])

  // Draw the game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up coordinate transformation
    const xRange = level.xMax - level.xMin
    const yRange = level.yMax - level.yMin
    const xScale = canvas.width / xRange
    const yScale = canvas.height / yRange

    const transformX = (x: number) => (x - level.xMin) * xScale
    const transformY = (y: number) => canvas.height - (y - level.yMin) * yScale

    // Draw axes
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1

    // x-axis
    ctx.beginPath()
    ctx.moveTo(0, transformY(0))
    ctx.lineTo(canvas.width, transformY(0))
    ctx.stroke()

    // y-axis
    ctx.beginPath()
    ctx.moveTo(transformX(0), 0)
    ctx.lineTo(transformX(0), canvas.height)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    // Vertical grid lines
    for (let x = Math.ceil(level.xMin); x <= level.xMax; x++) {
      ctx.beginPath()
      ctx.moveTo(transformX(x), 0)
      ctx.lineTo(transformX(x), canvas.height)
      ctx.stroke()

      // Label x-axis
      ctx.fillStyle = "#64748b"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(x.toString(), transformX(x), transformY(0) + 15)
    }

    // Horizontal grid lines
    for (let y = Math.ceil(level.yMin); y <= level.yMax; y++) {
      ctx.beginPath()
      ctx.moveTo(0, transformY(y))
      ctx.lineTo(canvas.width, transformY(y))
      ctx.stroke()

      // Label y-axis
      if (y !== 0) {
        ctx.fillStyle = "#64748b"
        ctx.font = "12px Arial"
        ctx.textAlign = "right"
        ctx.fillText(y.toString(), transformX(0) - 5, transformY(y) + 4)
      }
    }

    // Draw function
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()

    let isFirstPoint = true
    for (let px = 0; px < canvas.width; px++) {
      const x = level.xMin + (px / canvas.width) * xRange
      const y = level.function(x)

      if (y !== null) {
        if (isFirstPoint) {
          ctx.moveTo(px, transformY(y))
          isFirstPoint = false
        } else {
          ctx.lineTo(px, transformY(y))
        }
      } else {
        // If we hit a discontinuity, end the current path and start a new one
        ctx.stroke()
        ctx.beginPath()
        isFirstPoint = true
      }
    }
    ctx.stroke()

    // Draw limit point as a vertical dashed line
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(transformX(level.limitPoint), 0)
    ctx.lineTo(transformX(level.limitPoint), canvas.height)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw character (player position)
    const characterX = transformX(position)
    const characterY = transformY(level.function(position) || 0)

    // Character body
    ctx.fillStyle = "#8b5cf6"
    ctx.beginPath()
    ctx.arc(characterX, characterY, 10, 0, Math.PI * 2)
    ctx.fill()

    // Character face
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(characterX - 3, characterY - 2, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(characterX + 3, characterY - 2, 2, 0, Math.PI * 2)
    ctx.fill()

    // Character mouth (changes based on game state)
    ctx.strokeStyle = "white"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    if (gameState === "success") {
      // Happy mouth
      ctx.arc(characterX, characterY + 2, 4, 0, Math.PI)
    } else if (gameState === "failed") {
      // Sad mouth
      ctx.arc(characterX, characterY + 5, 4, Math.PI, Math.PI * 2)
    } else {
      // Neutral mouth
      ctx.moveTo(characterX - 3, characterY + 3)
      ctx.lineTo(characterX + 3, characterY + 3)
    }
    ctx.stroke()

    // Draw current position value
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`x = ${position.toFixed(4)}`, canvas.width / 2, 20)

    // Draw function value
    const functionValue = level.function(position)
    if (functionValue !== null) {
      ctx.fillText(`f(x) = ${functionValue.toFixed(4)}`, canvas.width / 2, 40)
    } else {
      ctx.fillText(`f(x) = undefined`, canvas.width / 2, 40)
    }
  }, [currentLevel, position, gameState, level])

  // Check if player is close enough to the limit
  const checkLimit = () => {
    setAttempts(attempts + 1)

    // Calculate distance from limit point
    const distance = Math.abs(position - level.limitPoint)

    // Calculate function value
    const functionValue = level.function(position)

    // Check if we're close enough to the limit point but not exactly on it
    if (distance < 0.05 && distance > 0.001) {
      // If the level has a defined limit, check if we're close to it
      if (level.limit !== null && functionValue !== null) {
        const limitDistance = Math.abs(functionValue - level.limit)
        if (limitDistance < 0.2) {
          handleSuccess()
        } else {
          setGameState("failed")
          setTimeout(() => setGameState("playing"), 1500)
        }
      } else if (level.limit === null) {
        // For levels with no limit, just getting close is a success
        handleSuccess()
      }
    } else if (distance <= 0.001) {
      // Too close to the limit point (on the discontinuity)
      setGameState("failed")
      setTimeout(() => setGameState("playing"), 1500)
    } else {
      // Not close enough
      setGameState("failed")
      setTimeout(() => setGameState("playing"), 1500)
    }
  }

  const handleSuccess = () => {
    setGameState("success")
    setShowConfetti(true)

    // Calculate score based on attempts and distance
    const distance = Math.abs(position - level.limitPoint)
    const baseScore = 100
    const attemptPenalty = Math.min(attempts * 10, 50)
    const distanceBonus = Math.floor((0.05 - distance) * 1000)
    const levelScore = Math.max(baseScore - attemptPenalty + distanceBonus, 50)

    setScore((prevScore) => prevScore + levelScore)

    // Show reward if completed all levels
    if (currentLevel === LEVELS.length - 1) {
      setTimeout(() => {
        // setShowReward(true)
      }, 1500)
    } else {
      // Move to next level after delay
      setTimeout(() => {
        setCurrentLevel((prev) => prev + 1)
        setShowConfetti(false)
      }, 2000)
    }
  }

  const resetGame = () => {
    setCurrentLevel(0)
    setScore(0)
    setGameState("playing")
    setShowConfetti(false)
    // setShowReward(false)
    setPosition(level.xMin + (level.xMax - level.xMin) * 0.25)
    setAttempts(0)
  }

  const moveCharacter = (direction: "left" | "right", amount: number) => {
    setPosition((prev) => {
      const newPosition =
        direction === "left" ? Math.max(prev - amount, level.xMin) : Math.min(prev + amount, level.xMax)

      // Don't allow moving exactly to the limit point
      if (Math.abs(newPosition - level.limitPoint) < 0.001) {
        return prev
      }

      return newPosition
    })
  }

  // Download the game canvas as an image
  const handleDownload = () => {
    try {
      downloadCanvasAsImage(
        canvasRef.current,
        `limit-explorer-level-${level.id}-${new Date().toISOString().slice(0, 10)}.png`,
      )
    } catch (error) {
      console.error("Error downloading game state:", error)
      alert("Failed to download the image. Please try again.")
    }
  }

  // Share the game state
  const handleShare = async () => {
    try {
      if (!canvasRef.current) return

      await shareCanvas(canvasRef.current, {
        title: `Limit Explorer - Level ${level.id}`,
        text: `Check out my progress on Limit Explorer Level ${level.id} with CalKids! Score: ${score} #CalKids #LimitExplorer`,
        filename: `limit-explorer-level-${level.id}-${new Date().toISOString().slice(0, 10)}.png`,
      })
    } catch (error) {
      console.error("Error sharing game state:", error)
      alert("Failed to share the game state. The content has been copied to your clipboard instead.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/calculus/games">
          <Button variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" /> Back to Games
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text">
          Limit Explorer
        </h1>
        <Button variant="outline" size="sm" onClick={() => setShowTutorial(true)}>
          <HelpCircle className="mr-2 h-4 w-4" /> Help
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-4 shadow-md">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Level {level.id}: {level.title}
              </h2>
              <p className="text-muted-foreground">{level.description}</p>
            </div>

            <div className="relative">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full h-auto border border-gray-200 rounded-md bg-white @xs:w-full @lg:w-auto"
              />
              {showConfetti && <Confetti />}
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => moveCharacter("left", 0.5)} disabled={gameState !== "playing"}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Big Step Left
                </Button>
                <Button
                  variant="outline"
                  onClick={() => moveCharacter("left", 0.01)}
                  disabled={gameState !== "playing"}
                >
                  <ArrowLeft className="h-4 w-4" /> Small Step
                </Button>
                <Button
                  variant="outline"
                  onClick={() => moveCharacter("right", 0.01)}
                  disabled={gameState !== "playing"}
                >
                  Small Step <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => moveCharacter("right", 0.5)}
                  disabled={gameState !== "playing"}
                >
                  Big Step Right <ArrowRight className="mr-1 h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="w-3/4 mr-4">
                  <p className="text-sm text-muted-foreground mb-1">Fine Adjustment:</p>
                  <Slider
                    value={[position]}
                    min={level.xMin}
                    max={level.xMax}
                    step={0.001}
                    onValueChange={(values) => {
                      const newPos = values[0]
                      if (Math.abs(newPos - level.limitPoint) > 0.001) {
                        setPosition(newPos)
                      }
                    }}
                    disabled={gameState !== "playing"}
                  />
                </div>
                <Button
                  onClick={checkLimit}
                  className="bg-gradient-to-r from-purple-500 to-blue-400 text-white"
                  disabled={gameState !== "playing"}
                >
                  Check Limit
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-4 shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Game Info</h2>

            <div className="space-y-4 flex-grow">
              <div>
                <p className="text-sm font-medium">Current Level:</p>
                <p className="text-2xl font-bold">
                  {currentLevel + 1} / {LEVELS.length}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Score:</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Attempts:</p>
                <p className="text-lg">{attempts}</p>
              </div>

              <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm font-medium">Hint:</p>
                <p className="text-sm text-muted-foreground">
                  Get as close as possible to x = {level.limitPoint} without touching it.
                  {level.limit !== null ? ` The limit is ${level.limit}.` : " Does a limit exist?"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleDownload} title="Download screenshot">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare} title="Share your progress">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full" onClick={resetGame}>
                <RefreshCw className="mr-2 h-4 w-4" /> Restart Game
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {showTutorial && (
        <TutorialPopup
          steps={[
            {
              title: "Welcome to Limit Explorer!",
              content: "In this game, you'll learn about limits in calculus.",
              emoji: "🎮"
            },
            {
              title: "Game Objective",
              content: "Move your character as close as possible to the limit point (red dashed line) without crossing it.",
              emoji: "🎯"
            },
            {
              title: "Controls",
              content: "Use the buttons to move left or right, the slider for fine adjustments, and click 'Check Limit' when you're close enough.",
              emoji: "🎛️"
            },
            {
              title: "Tips",
              content: "The closer you get without crossing, the higher your score. Some functions have limits, others don't. Watch how the function value changes as you approach the limit point.",
              emoji: "💡"
            },
            {
              title: "Current Level",
              content: level.tutorial,
              emoji: "📊"
            }
          ]}
          gameName="limit-explorer"
        />
      )}

      {/* {showReward && (
        <RewardBadge
          title="Limit Master"
          description="You've mastered the concept of limits in calculus!"
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

