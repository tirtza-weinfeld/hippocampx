"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Home, HelpCircle, RefreshCw, Play, Pause } from "lucide-react"
import Link from "next/link"
import { Confetti } from "@/components/calculus/confetti"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
// import { RewardBadge } from "@/components/calculus/reward-badge"

// Define scenario types
type ScenarioType = "car" | "population" | "pendulum" | "balloon" | "rocket"

// Define scenario structure
interface Scenario {
  id: number
  type: ScenarioType
  title: string
  description: string
  initialPosition: number
  initialVelocity: number
  acceleration: number | ((t: number, p: number, v: number) => number)
  timeScale: number
  maxTime: number
  question: string
  correctAnswer: (finalPosition: number, finalVelocity: number) => boolean
  answerType: "position" | "velocity" | "time"
  answerUnit: string
  hint: string
  difficulty: "easy" | "medium" | "hard"
  color: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    type: "car",
    title: "Car Journey",
    description: "A car starts from rest and accelerates at a constant rate.",
    initialPosition: 0,
    initialVelocity: 0,
    acceleration: 2, // 2 m/s²
    timeScale: 1,
    maxTime: 10,
    question: "What will be the car's position after 5 seconds?",
    correctAnswer: (finalPosition) => Math.abs(finalPosition - 25) < 2,
    answerType: "position",
    answerUnit: "meters",
    hint: "Remember that position = initial position + initial velocity × time + ½ × acceleration × time²",
    difficulty: "easy",
    color: "from-amber-500 to-orange-400",
  },
  {
    id: 2,
    type: "population",
    title: "Population Growth",
    description: "A bacteria population grows at a rate proportional to its size.",
    initialPosition: 100, // 100 bacteria
    initialVelocity: 10, // Initial growth rate
    acceleration: (t, p) => 0.05 * p, // Growth acceleration depends on population
    timeScale: 0.5,
    maxTime: 20,
    question: "What will be the population after 10 time units?",
    correctAnswer: (finalPosition) => Math.abs(finalPosition - 271) < 10,
    answerType: "position",
    answerUnit: "bacteria",
    hint: "This is exponential growth. The rate of change increases as the population increases.",
    difficulty: "medium",
    color: "from-green-500 to-emerald-400",
  },
  {
    id: 3,
    type: "pendulum",
    title: "Pendulum Swing",
    description: "A pendulum swings back and forth with decreasing amplitude.",
    initialPosition: 50, // 50 degrees
    initialVelocity: 0,
    acceleration: (t, p, v) => -0.5 * p - 0.1 * v, // Simple harmonic motion with damping
    timeScale: 0.2,
    maxTime: 30,
    question: "What will be the pendulum's maximum velocity during the first 15 time units?",
    correctAnswer: (_, finalVelocity) => Math.abs(finalVelocity - 25) < 3,
    answerType: "velocity",
    answerUnit: "degrees/s",
    hint: "The pendulum's velocity is highest when it passes through the center position.",
    difficulty: "hard",
    color: "from-blue-500 to-indigo-400",
  },
  {
    id: 4,
    type: "balloon",
    title: "Rising Balloon",
    description: "A hot air balloon rises with decreasing acceleration due to air resistance.",
    initialPosition: 0,
    initialVelocity: 5, // 5 m/s
    acceleration: (t, p, v) => 2 - 0.1 * v, // Decreasing acceleration as velocity increases
    timeScale: 0.5,
    maxTime: 20,
    question: "At what time will the balloon reach a height of 100 meters?",
    correctAnswer: (finalPosition) => Math.abs(finalPosition - 100) < 5,
    answerType: "time",
    answerUnit: "seconds",
    hint: "The balloon's acceleration decreases as it rises, so its velocity will approach a terminal velocity.",
    difficulty: "medium",
    color: "from-sky-500 to-cyan-400",
  },
  {
    id: 5,
    type: "rocket",
    title: "Rocket Launch",
    description: "A rocket launches with increasing acceleration as it burns fuel.",
    initialPosition: 0,
    initialVelocity: 0,
    acceleration: (t) => 5 + 0.5 * t, // Increasing acceleration
    timeScale: 0.5,
    maxTime: 15,
    question: "What will be the rocket's velocity after 10 seconds?",
    correctAnswer: (_, finalVelocity) => Math.abs(finalVelocity - 75) < 5,
    answerType: "velocity",
    answerUnit: "m/s",
    hint: "The rocket's acceleration increases with time, so its velocity increases faster than linear.",
    difficulty: "hard",
    color: "from-red-500 to-rose-400",
  },
]

export default function RateMasterGame() {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [time, setTime] = useState(0)
  const [position, setPosition] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [gameState, setGameState] = useState<"playing" | "success" | "failed">("playing")
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)
  const [maxVelocity, setMaxVelocity] = useState(0)
  const [targetPosition, setTargetPosition] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const positionHistoryRef = useRef<[number, number][]>([])
  const velocityHistoryRef = useRef<[number, number][]>([])

  const currentScenario = SCENARIOS[currentScenarioIndex]

  // Draw scenario elements
  const drawScenarioElements = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw scenario-specific elements
    switch (currentScenario.type) {
      case "car":
        // Draw car
        ctx.fillStyle = currentScenario.color
        ctx.fillRect(position - 20, height - 60, 40, 20)
        // Draw wheels
        ctx.fillStyle = "#000"
        ctx.fillRect(position - 25, height - 55, 10, 10)
        ctx.fillRect(position + 15, height - 55, 10, 10)
        break
      case "population":
        // Draw population graph
        ctx.fillStyle = currentScenario.color
        ctx.fillRect(position - 5, height - 60, 10, 10)
        break
      case "pendulum":
        // Draw pendulum
        ctx.strokeStyle = currentScenario.color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(width / 2, 50)
        ctx.lineTo(position, height - 60)
        ctx.stroke()
        // Draw bob
        ctx.fillStyle = currentScenario.color
        ctx.beginPath()
        ctx.arc(position, height - 60, 10, 0, Math.PI * 2)
        ctx.fill()
        break
      case "balloon":
        // Draw balloon
        ctx.fillStyle = currentScenario.color
        ctx.beginPath()
        ctx.arc(position, height - 60, 20, 0, Math.PI * 2)
        ctx.fill()
        // Draw string
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(position, height - 40)
        ctx.lineTo(position, height - 20)
        ctx.stroke()
        break
      case "rocket":
        // Draw rocket
        ctx.fillStyle = currentScenario.color
        ctx.beginPath()
        ctx.moveTo(position - 10, height - 60)
        ctx.lineTo(position, height - 80)
        ctx.lineTo(position + 10, height - 60)
        ctx.closePath()
        ctx.fill()
        // Draw flame
        ctx.fillStyle = "#FF6B00"
        ctx.beginPath()
        ctx.moveTo(position - 5, height - 60)
        ctx.lineTo(position, height - 70)
        ctx.lineTo(position + 5, height - 60)
        ctx.closePath()
        ctx.fill()
        break
    }
  }, [currentScenario.type, currentScenario.color, position])

  // Draw the simulation
  const drawSimulation = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw scenario elements
    drawScenarioElements(ctx, width, height)

    // Draw position history
    if (positionHistoryRef.current.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 2
      positionHistoryRef.current.forEach(([t, p], i) => {
        const x = (t / currentScenario.maxTime) * width
        const y = height - (p / currentScenario.initialPosition) * height
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    }

    // Draw velocity history
    if (velocityHistoryRef.current.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = "#EC4899"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      velocityHistoryRef.current.forEach(([t, v], i) => {
        const x = (t / currentScenario.maxTime) * width
        const y = height - (v / maxVelocity) * height
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [currentScenario.maxTime, currentScenario.initialPosition, maxVelocity, drawScenarioElements])

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setIsSimulating(false)
    setTime(0)
    setPosition(currentScenario.initialPosition)
    setVelocity(currentScenario.initialVelocity)
    setMaxVelocity(Math.abs(currentScenario.initialVelocity))
    setTargetPosition(null)
    positionHistoryRef.current = [[0, currentScenario.initialPosition]]
    velocityHistoryRef.current = [[0, currentScenario.initialVelocity]]
    lastTimeRef.current = 0
    drawSimulation()
  }, [currentScenario.initialPosition, currentScenario.initialVelocity, setIsSimulating, setTime, setPosition, setVelocity, setMaxVelocity, setTargetPosition, drawSimulation])

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const deltaTime = (timestamp - lastTimeRef.current) / 1000 // Convert to seconds
    lastTimeRef.current = timestamp

    if (isSimulating && time < currentScenario.maxTime) {
      // Update time
      const newTime = time + deltaTime * currentScenario.timeScale

      // Calculate acceleration
      let acceleration
      if (typeof currentScenario.acceleration === "function") {
        acceleration = currentScenario.acceleration(newTime, position, velocity)
      } else {
        acceleration = currentScenario.acceleration
      }

      // Update velocity
      const newVelocity = velocity + acceleration * deltaTime * currentScenario.timeScale
      const newMaxVelocity = Math.max(maxVelocity, Math.abs(newVelocity))

      // Update position
      const newPosition = position + newVelocity * deltaTime * currentScenario.timeScale

      // Record history for graphing
      positionHistoryRef.current.push([newTime, newPosition])
      velocityHistoryRef.current.push([newTime, newVelocity])

      // Update all state at once to prevent race conditions
      setTime(newTime)
      setVelocity(newVelocity)
      setPosition(newPosition)
      setMaxVelocity(newMaxVelocity)

      // Check if we've reached the target position (for time-based questions)
      if (currentScenario.answerType === "time" && targetPosition !== null) {
        if (Math.abs(newPosition - targetPosition) < 1) {
          setIsSimulating(false)
          setUserAnswer(newTime.toFixed(1))
        }
      }

      // Stop if we've reached max time
      if (newTime >= currentScenario.maxTime) {
        setIsSimulating(false)
      }
    }

    // Draw the simulation
    drawSimulation()

    // Continue animation loop only if still simulating
    if (isSimulating) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [isSimulating, time, currentScenario, position, velocity, maxVelocity, targetPosition, drawSimulation])

  // Start/stop animation
  useEffect(() => {
    if (isSimulating) {
      lastTimeRef.current = 0 // Reset the last time reference when starting
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSimulating, animate])

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating)
  }

  const checkAnswer = () => {
    setAttempts(attempts + 1)

    let isCorrect = false
    const numAnswer = Number.parseFloat(userAnswer)

    if (!isNaN(numAnswer)) {
      switch (currentScenario.answerType) {
        case "position":
          isCorrect = currentScenario.correctAnswer(numAnswer, velocity)
          break
        case "velocity":
          isCorrect = currentScenario.correctAnswer(position, numAnswer)
          break
        case "time":
          // For time questions, set the target position and let the simulation run
          setTargetPosition(numAnswer)
          setIsSimulating(true)
          return
      }
    }

    if (isCorrect) {
      handleSuccess()
    } else {
      setGameState("failed")
      setTimeout(() => setGameState("playing"), 1500)
    }
  }

  const handleSuccess = () => {
    setGameState("success")
    setShowConfetti(true)

    // Calculate score based on difficulty and attempts
    const difficultyMultiplier =
      currentScenario.difficulty === "easy" ? 1 : currentScenario.difficulty === "medium" ? 1.5 : 2

    const attemptPenalty = Math.max(0, 1 - (attempts - 1) * 0.2)
    const scenarioScore = Math.round(100 * difficultyMultiplier * attemptPenalty)

    setScore((prevScore) => prevScore + scenarioScore)

    // Show reward if completed all scenarios
    if (currentScenarioIndex === SCENARIOS.length - 1) {
      setTimeout(() => {
        // setShowReward(true)
      }, 1500)
    } else {
      // Move to next scenario after delay
      setTimeout(() => {
        setCurrentScenarioIndex((prev) => prev + 1)
        setShowConfetti(false)
        setAttempts(0)
      }, 2000)
    }
  }

  const resetGame = () => {
    setCurrentScenarioIndex(0)
    setScore(0)
    setAttempts(0)
    // setShowReward(false)
    resetSimulation()
  }

  // Initialize canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      // Make sure canvas dimensions are set correctly
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = 400 // Fixed height or calculate based on parent
      }
      drawSimulation()
    }
  }, [drawSimulation])

  useEffect(() => {
    resetSimulation()
  }, [currentScenarioIndex, resetSimulation])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/calculus/games">
          <Button variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" /> Back to Games
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-500 to-orange-400 text-transparent bg-clip-text">
          Rate Master
        </h1>
        <Button variant="outline" size="sm" onClick={() => setShowTutorial(true)}>
          <HelpCircle className="mr-2 h-4 w-4" /> Help
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-4 shadow-md">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{currentScenario.title}</h2>
              <p className="text-muted-foreground">{currentScenario.description}</p>
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
                <Button variant="outline" onClick={toggleSimulation} className="w-1/3">
                  {isSimulating ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> {time === 0 ? "Start" : "Resume"}
                    </>
                  )}
                </Button>

                <div className="w-1/3 text-center">
                  <span className="text-sm text-muted-foreground">Time: {time.toFixed(1)}s</span>
                </div>

                <Button variant="outline" onClick={resetSimulation} className="w-1/3">
                  <RefreshCw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <h3 className="text-lg font-medium mb-2">Question:</h3>
                <p className="mb-4">{currentScenario.question}</p>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder={`Enter your answer in ${currentScenario.answerUnit}`}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="flex-grow"
                    disabled={gameState !== "playing"}
                  />
                  <Button
                    onClick={checkAnswer}
                    className={`bg-gradient-to-r ${currentScenario.color} text-white`}
                    disabled={gameState !== "playing" || userAnswer === ""}
                  >
                    Check
                  </Button>
                </div>

                {gameState === "failed" && <p className="mt-2 text-red-500">Try again! Hint: {currentScenario.hint}</p>}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-4 shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Game Info</h2>

            <div className="space-y-4 flex-grow">
              <div>
                <p className="text-sm font-medium">Current Scenario:</p>
                <p className="text-2xl font-bold">
                  {currentScenarioIndex + 1} / {SCENARIOS.length}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Score:</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Difficulty:</p>
                <p className="text-lg capitalize">{currentScenario.difficulty}</p>
              </div>

              <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm font-medium">Current Values:</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Position:</p>
                    <p className="text-sm">
                      {position.toFixed(1)} {currentScenario.answerUnit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Velocity:</p>
                    <p className="text-sm">
                      {velocity.toFixed(1)} {currentScenario.answerUnit}/s
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Acceleration:</p>
                    <p className="text-sm">
                      {typeof currentScenario.acceleration === "function"
                        ? "Variable"
                        : `${currentScenario.acceleration.toFixed(1)} ${currentScenario.answerUnit}/s²`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time:</p>
                    <p className="text-sm">{time.toFixed(1)} s</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={resetGame}>
                <RefreshCw className="mr-2 h-4 w-4" /> Restart Game
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {showTutorial && (
        <TutorialPopup
          gameName="rate-master"
          steps={[
            {
              title: "How to Play Rate Master",
              content: "Welcome to Rate Master! In this game, you'll learn about rates of change and how they relate to position, velocity, and acceleration.",
              emoji: "🎮"
            },
            {
              title: "Game Objective",
              content: "Observe how objects move or change over time, and predict their future positions or velocities.",
              emoji: "🎯"
            },
            {
              title: "How to Play",
              content: "Click 'Start' to begin the simulation. Watch how the object moves and how its position and velocity change. Answer the question by entering your prediction. Click 'Check' to see if your answer is correct.",
              emoji: "🎲"
            },
            {
              title: "Understanding the Graph",
              content: "The blue line shows position over time. The red line shows velocity over time. The horizontal axis represents time. The vertical axis represents position or velocity.",
              emoji: "📊"
            },
            {
              title: "Remember",
              content: "Velocity is the rate of change of position, and acceleration is the rate of change of velocity!",
              emoji: "💡"
            }
          ]}
        />
      )}

      {/* {showReward && (
        <RewardBadge
          title="Rate Master"
          description="You've mastered rates of change! You can now predict how objects move and change over time."
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

