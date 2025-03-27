"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { ArrowRight, Play, Pause, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function RateAnalyzerPage() {
  const [simulationType, setSimulationType] = useState("car")
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [initialPosition, setInitialPosition] = useState(0)
  const [initialVelocity, setInitialVelocity] = useState(0)
  const [acceleration, setAcceleration] = useState(1)
  const [showVelocity, setShowVelocity] = useState(true)
  const [showAcceleration, setShowAcceleration] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  // Motion values for animation
  const position = useMotionValue(initialPosition)
  const velocity = useMotionValue(initialVelocity)

  // Transform position to visual position
  const x = useTransform(position, [-10, 10], [0, 100])

  // Simulation types
  const simulations = useMemo(() => ({
    car: {
      name: "Car Motion",
      description: "A car moving with constant acceleration",
      positionFormula: "s(t) = s₀ + v₀t + ½at²",
      velocityFormula: "v(t) = v₀ + at",
      accelerationFormula: "a(t) = a",
      color: "#3B82F6", // blue-500
      icon: "🚗",
    },
    pendulum: {
      name: "Pendulum",
      description: "A pendulum swinging back and forth",
      positionFormula: "s(t) = A·sin(ωt)",
      velocityFormula: "v(t) = A·ω·cos(ωt)",
      accelerationFormula: "a(t) = -A·ω²·sin(ωt)",
      color: "#8B5CF6", // violet-500
      icon: "🔄",
    },
    growth: {
      name: "Population Growth",
      description: "Exponential growth of a population",
      positionFormula: "P(t) = P₀·e^(rt)",
      velocityFormula: "P'(t) = r·P₀·e^(rt)",
      accelerationFormula: "P''(t) = r²·P₀·e^(rt)",
      color: "#10B981", // emerald-500
      icon: "🌱",
    },
    projectile: {
      name: "Projectile Motion",
      description: "A ball thrown upward under gravity",
      positionFormula: "h(t) = h₀ + v₀t - ½gt²",
      velocityFormula: "v(t) = v₀ - gt",
      accelerationFormula: "a(t) = -g",
      color: "#F59E0B", // amber-500
      icon: "⚽",
    },
  }), [])

  // Calculate position, velocity, and acceleration based on simulation type
  const calculateValues = useCallback(() => {
    let pos = 0
    let vel = 0
    let acc = 0

    switch (simulationType) {
      case "car":
        pos = initialPosition + initialVelocity * time + 0.5 * acceleration * time * time
        vel = initialVelocity + acceleration * time
        acc = acceleration
        break
      case "pendulum":
        const frequency = acceleration // Using acceleration slider as frequency control
        pos = initialPosition + initialVelocity * Math.sin(frequency * time)
        vel = initialVelocity * frequency * Math.cos(frequency * time)
        acc = -initialVelocity * frequency * frequency * Math.sin(frequency * time)
        break
      case "growth":
        const growthRate = acceleration // Using acceleration slider as growth rate
        pos = initialPosition * Math.exp(growthRate * time)
        vel = initialPosition * growthRate * Math.exp(growthRate * time)
        acc = initialPosition * growthRate * growthRate * Math.exp(growthRate * time)
        break
      case "projectile":
        const gravity = acceleration // Using acceleration slider as gravity
        pos = initialPosition + initialVelocity * time - 0.5 * gravity * time * time
        vel = initialVelocity - gravity * time
        acc = -gravity
        break
    }

    position.set(pos)
    velocity.set(vel)

    return { pos, vel, acc }
  }, [position, velocity, time, acceleration, simulationType, initialPosition, initialVelocity])

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    const animate = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const deltaTime = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      setTime((prevTime) => {
        const newTime = prevTime + deltaTime

        // Calculate new values
        // const {   pos, vel, acc } = calculateValues()

        return newTime
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, calculateValues])

  // Draw the graph on the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Canvas dimensions
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set up coordinate system
    const origin = { x: 50, y: height - 50 }
    const xScale = (width - 100) / 10 // 10 seconds on x-axis
    const yScale = 20 // Pixels per unit on y-axis

    // Helper function to convert coordinates
    const toCanvasCoords = (t: number, value: number) => ({
      x: origin.x + t * xScale,
      y: origin.y - value * yScale,
    })

    // Draw axes
    ctx.strokeStyle = "#94A3B8" // slate-400
    ctx.lineWidth = 1

    // x-axis (time)
    ctx.beginPath()
    ctx.moveTo(origin.x, origin.y)
    ctx.lineTo(width - 50, origin.y)
    ctx.stroke()

    // y-axis (values)
    ctx.beginPath()
    ctx.moveTo(origin.x, origin.y)
    ctx.lineTo(origin.x, 50)
    ctx.stroke()

    // Draw tick marks and labels
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748B" // slate-500

    // x-axis ticks (time)
    for (let t = 0; t <= 10; t += 2) {
      const x = origin.x + t * xScale
      ctx.beginPath()
      ctx.moveTo(x, origin.y - 5)
      ctx.lineTo(x, origin.y + 5)
      ctx.stroke()
      ctx.fillText(t.toString() + "s", x, origin.y + 15)
    }

    // y-axis ticks (values)
    for (let v = -10; v <= 10; v += 5) {
      if (v === 0) continue // Skip origin
      const y = origin.y - v * yScale
      ctx.beginPath()
      ctx.moveTo(origin.x - 5, y)
      ctx.lineTo(origin.x + 5, y)
      ctx.stroke()
      ctx.fillText(v.toString(), origin.x - 15, y)
    }

    // Axis labels
    ctx.fillText("Time (s)", width - 30, origin.y + 15)
    ctx.save()
    ctx.translate(origin.x - 30, height / 2 - 50)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Value", 0, 0)
    ctx.restore()

    // Draw position graph
    ctx.strokeStyle = simulations[simulationType as keyof typeof simulations].color
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let t = 0; t <= 10; t += 0.1) {
      const { pos } = calculateValues()
      const coords = toCanvasCoords(t, pos)

      if (t === 0) {
        ctx.moveTo(coords.x, coords.y)
      } else {
        ctx.lineTo(coords.x, coords.y)
      }
    }
    ctx.stroke()

    // Draw velocity graph if enabled
    if (showVelocity) {
      ctx.strokeStyle = "#EC4899" // pink-500
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5]) // Dashed line
      ctx.beginPath()

      for (let t = 0; t <= 10; t += 0.1) {
        const { vel } = calculateValues()
        const coords = toCanvasCoords(t, vel)

        if (t === 0) {
          ctx.moveTo(coords.x, coords.y)
        } else {
          ctx.lineTo(coords.x, coords.y)
        }
      }
      ctx.stroke()
      ctx.setLineDash([]) // Reset to solid line
    }

    // Draw acceleration graph if enabled
    if (showAcceleration) {
      ctx.strokeStyle = "#F59E0B" // amber-500
      ctx.lineWidth = 2
      ctx.setLineDash([2, 2]) // Dotted line
      ctx.beginPath()

      for (let t = 0; t <= 10; t += 0.1) {
        const { acc } = calculateValues()
        const coords = toCanvasCoords(t, acc)

        if (t === 0) {
          ctx.moveTo(coords.x, coords.y)
        } else {
          ctx.lineTo(coords.x, coords.y)
        }
      }
      ctx.stroke()
      ctx.setLineDash([]) // Reset to solid line
    }

    // Draw current time marker
    if (time <= 10) {
      const timeX = origin.x + time * xScale

      ctx.strokeStyle = "#64748B" // slate-400
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2]) // Dotted line
      ctx.beginPath()
      ctx.moveTo(timeX, 50)
      ctx.lineTo(timeX, origin.y)
      ctx.stroke()
      ctx.setLineDash([]) // Reset to solid line

      // Draw current values
      const { pos, vel, acc } = calculateValues()

      // Position marker
      const posY = origin.y - pos * yScale
      ctx.fillStyle = simulations[simulationType as keyof typeof simulations].color
      ctx.beginPath()
      ctx.arc(timeX, posY, 5, 0, Math.PI * 2)
      ctx.fill()

      // Velocity marker
      if (showVelocity) {
        const velY = origin.y - vel * yScale
        ctx.fillStyle = "#EC4899" // pink-500
        ctx.beginPath()
        ctx.arc(timeX, velY, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Acceleration marker
      if (showAcceleration) {
        const accY = origin.y - acc * yScale
        ctx.fillStyle = "#F59E0B" // amber-500
        ctx.beginPath()
        ctx.arc(timeX, accY, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Add legend
    ctx.font = "14px sans-serif"

    ctx.fillStyle = simulations[simulationType as keyof typeof simulations].color
    ctx.fillText("Position", width - 120, 20)

    if (showVelocity) {
      ctx.fillStyle = "#EC4899" // pink-500
      ctx.fillText("Velocity", width - 120, 40)
    }

    if (showAcceleration) {
      ctx.fillStyle = "#F59E0B" // amber-500
      ctx.fillText("Acceleration", width - 120, 60)
    }
  }, [time, simulationType, showVelocity, showAcceleration, calculateValues, simulations])

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setIsPlaying(false)
    setTime(0)
    position.set(initialPosition)
    velocity.set(initialVelocity)
    lastTimeRef.current = 0
  }, [initialPosition, initialVelocity, position, velocity])

  // Handle simulation type change
  const handleSimulationChange = (value: string) => {
    setSimulationType(value)
    resetSimulation()

    // Set default values based on simulation type
    switch (value) {
      case "car":
        setInitialPosition(0)
        setInitialVelocity(0)
        setAcceleration(1)
        break
      case "pendulum":
        setInitialPosition(0)
        setInitialVelocity(5)
        setAcceleration(2)
        break
      case "growth":
        setInitialPosition(1)
        setInitialVelocity(0)
        setAcceleration(0.5)
        break
      case "projectile":
        setInitialPosition(0)
        setInitialVelocity(10)
        setAcceleration(9.8)
        break
    }
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Rate Analyzer!",
      content: "This interactive tool helps you understand rates of change and derivatives in real-world scenarios.",
      emoji: "📊",
    },
    {
      title: "Simulation Types",
      content: "Choose different types of motion to see how position, velocity, and acceleration relate to each other.",
      emoji: "🔄",
    },
    {
      title: "The Graph",
      content:
        "The graph shows how position (solid line), velocity (dashed line), and acceleration (dotted line) change over time.",
      emoji: "📈",
    },
    {
      title: "Controls",
      content:
        "Use the sliders to adjust initial position, velocity, and acceleration. Press Play to start the simulation.",
      emoji: "🎛️",
    },
    {
      title: "Derivatives",
      content: "Remember that velocity is the derivative of position, and acceleration is the derivative of velocity!",
      emoji: "🧮",
    },
  ]

  return (
    <div className="@container px-4 py-8 md:py-12">
      <TutorialPopup steps={tutorialSteps} gameName="rate-analyzer" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-transparent bg-clip-text">
            Rate Analyzer
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Explore rates of change in real-world scenarios with interactive simulations
          </p>
        </div>

        <Card className="border-2 border-border bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Interactive Rate of Change Visualization</span>
              <Tabs
                defaultValue={simulationType}
                value={simulationType}
                onValueChange={handleSimulationChange}
                className="h-9"
              >
                <TabsList>
                  <TabsTrigger value="car">Car</TabsTrigger>
                  <TabsTrigger value="pendulum">Pendulum</TabsTrigger>
                  <TabsTrigger value="growth">Growth</TabsTrigger>
                  <TabsTrigger value="projectile">Projectile</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="border border-muted rounded-lg bg-white dark:bg-gray-900"
              />
            </div>

            <div className="relative h-20 bg-muted rounded-lg overflow-hidden border-2 border-muted">
              <div className="absolute inset-0 bg-gradient-to-r from-background to-background/50 opacity-20" />
              <motion.div
                className="absolute bottom-0 left-0 w-12 h-8"
                style={{ x: useTransform(x, [0, 100], ["0%", "100%"]) }}
              >
                <motion.div
                  className="bg-gradient-to-r from-red-500 to-pink-400 rounded-md w-10 h-6 flex items-center justify-center text-white text-xs font-bold"
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    y: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 },
                  }}
                >
                  {simulations[simulationType as keyof typeof simulations].icon}
                </motion.div>
              </motion.div>
              <div className="absolute bottom-0 left-0 w-full border-t-2 border-dashed border-red-400/50" />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Initial Position: {initialPosition}</div>
                  </div>
                  <Slider
                    value={[initialPosition]}
                    min={-10}
                    max={10}
                    step={0.5}
                    onValueChange={(value) => {
                      setInitialPosition(value[0])
                      if (!isPlaying) {
                        position.set(value[0])
                      }
                    }}
                    disabled={isPlaying}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Initial Velocity: {initialVelocity}</div>
                  </div>
                  <Slider
                    value={[initialVelocity]}
                    min={-10}
                    max={10}
                    step={0.5}
                    onValueChange={(value) => {
                      setInitialVelocity(value[0])
                      if (!isPlaying) {
                        velocity.set(value[0])
                      }
                    }}
                    disabled={isPlaying}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">
                      {simulationType === "car"
                        ? "Acceleration"
                        : simulationType === "pendulum"
                          ? "Frequency"
                          : simulationType === "growth"
                            ? "Growth Rate"
                            : "Gravity"}
                      : {acceleration}
                    </div>
                  </div>
                  <Slider
                    value={[acceleration]}
                    min={simulationType === "growth" ? 0.1 : -10}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setAcceleration(value[0])}
                    disabled={isPlaying}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowVelocity(!showVelocity)}
                    className={
                      showVelocity
                        ? "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800"
                        : ""
                    }
                  >
                    {showVelocity ? "Hide Velocity" : "Show Velocity"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAcceleration(!showAcceleration)}
                    className={
                      showAcceleration
                        ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                        : ""
                    }
                  >
                    {showAcceleration ? "Hide Acceleration" : "Show Acceleration"}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isPlaying ? "outline" : "default"}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={!isPlaying ? "bg-gradient-to-r from-red-500 to-pink-500 text-white" : ""}
                  >
                    {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button variant="outline" onClick={resetSimulation}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Position:</h3>
                    <div className="text-lg font-medium">
                      {simulations[simulationType as keyof typeof simulations].positionFormula}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Velocity:</h3>
                    <div className="text-lg font-medium text-pink-600 dark:text-pink-400">
                      {simulations[simulationType as keyof typeof simulations].velocityFormula}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Acceleration:</h3>
                    <div className="text-lg font-medium text-amber-600 dark:text-amber-400">
                      {simulations[simulationType as keyof typeof simulations].accelerationFormula}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>
                    Velocity is the derivative of position with respect to time (v = ds/dt). Acceleration is the
                    derivative of velocity with respect to time (a = dv/dt).
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Link href="/games/rate-master">
                <Button className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
                  Try Rate Master Game <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

