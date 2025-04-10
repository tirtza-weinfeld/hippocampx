"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { ArrowRight, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function FunctionLaboratoryPage() {
  const [baseFunction, setBaseFunction] = useState("parabola")
  const [verticalShift, setVerticalShift] = useState(0)
  const [horizontalShift, setHorizontalShift] = useState(0)
  const [verticalStretch, setVerticalStretch] = useState(1)
  const [horizontalStretch, setHorizontalStretch] = useState(1)
  const [showOriginal, setShowOriginal] = useState(true)
  const [showDerivative, setShowDerivative] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Base functions
  const functions = useMemo(() => ({
    parabola: {
      name: "Parabola",
      formula: "f(x) = x²",
      fn: (x: number) => x * x,
      derivative: (x: number) => 2 * x,
      derivativeFormula: "f'(x) = 2x",
      color: "#3B82F6", // blue-500
    },
    cubic: {
      name: "Cubic Function",
      formula: "f(x) = x³",
      fn: (x: number) => x * x * x,
      derivative: (x: number) => 3 * x * x,
      derivativeFormula: "f'(x) = 3x²",
      color: "#8B5CF6", // violet-500
    },
    sine: {
      name: "Sine Function",
      formula: "f(x) = sin(x)",
      fn: (x: number) => Math.sin(x),
      derivative: (x: number) => Math.cos(x),
      derivativeFormula: "f'(x) = cos(x)",
      color: "#10B981", // emerald-500
    },
    exponential: {
      name: "Exponential Function",
      formula: "f(x) = eˣ",
      fn: (x: number) => Math.exp(x),
      derivative: (x: number) => Math.exp(x),
      derivativeFormula: "f'(x) = eˣ",
      color: "#F59E0B", // amber-500
    },
    absolute: {
      name: "Absolute Value",
      formula: "f(x) = |x|",
      fn: (x: number) => Math.abs(x),
      derivative: (x: number) => (x < 0 ? -1 : x > 0 ? 1 : 0),
      derivativeFormula: "f'(x) = -1 if x < 0, 1 if x > 0",
      color: "#EC4899", // pink-500
    },
  }), []) // Empty dependency array since functions are static

  // Draw the functions on the canvas
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

    // Set up coordinate system with origin at center
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

    // Get the base function
    const fn = functions[baseFunction as keyof typeof functions]

    // Draw the original function if enabled
    if (showOriginal) {
      ctx.strokeStyle = "#94A3B8" // slate-400
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5]) // Dashed line
      ctx.beginPath()

      for (let i = 0; i <= width; i++) {
        const x = (i - origin.x) / scale
        const y = fn.fn(x)
        const canvasCoords = toCanvasCoords(x, y)

        if (i === 0) {
          ctx.moveTo(canvasCoords.x, canvasCoords.y)
        } else {
          ctx.lineTo(canvasCoords.x, canvasCoords.y)
        }
      }
      ctx.stroke()
      ctx.setLineDash([]) // Reset to solid line
    }

    // Draw the transformed function
    ctx.strokeStyle = fn.color
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i <= width; i++) {
      const canvasX = i
      const mathX = (canvasX - origin.x) / scale

      // Apply transformations to x
      const transformedX = (mathX - horizontalShift) / horizontalStretch

      // Calculate y value
      let mathY = fn.fn(transformedX)

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

    // Draw the derivative if enabled
    if (showDerivative) {
      ctx.strokeStyle = "#EC4899" // pink-500
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5]) // Dashed line
      ctx.beginPath()

      for (let i = 0; i <= width; i++) {
        const canvasX = i
        const mathX = (canvasX - origin.x) / scale

        // Apply transformations to x
        const transformedX = (mathX - horizontalShift) / horizontalStretch

        // Calculate derivative y value
        // For a transformed function f(ax+b), the derivative is a*f'(ax+b)
        const mathY = fn.derivative(transformedX) * (verticalStretch / horizontalStretch)

        const canvasY = origin.y - mathY * scale

        if (i === 0) {
          ctx.moveTo(canvasX, canvasY)
        } else {
          ctx.lineTo(canvasX, canvasY)
        }
      }
      ctx.stroke()
      ctx.setLineDash([]) // Reset to solid line
    }

    // Add legend
    ctx.font = "14px sans-serif"

    if (showOriginal) {
      ctx.fillStyle = "#94A3B8" // slate-400
      ctx.fillText("Original Function", width - 120, 20)
    }

    ctx.fillStyle = fn.color
    ctx.fillText("Transformed Function", width - 120, 40)

    if (showDerivative) {
      ctx.fillStyle = "#EC4899" // pink-500
      ctx.fillText("Derivative", width - 120, 60)
    }
  }, [functions, baseFunction, horizontalShift, horizontalStretch, showDerivative, showOriginal, verticalShift, verticalStretch])

  // Format the transformed function as a string
  const formatTransformedFunction = () => {
    const fn = functions[baseFunction as keyof typeof functions]
    let result = fn.formula.replace("f(x)", "g(x)")

    // Replace x with the transformed x
    if (horizontalStretch !== 1 || horizontalShift !== 0) {
      let xTransform = ""

      if (horizontalStretch !== 1) {
        xTransform += `${horizontalStretch}x`
      } else {
        xTransform += "x"
      }

      if (horizontalShift !== 0) {
        xTransform += ` ${horizontalShift > 0 ? "-" : "+"} ${Math.abs(horizontalShift)}`
      }

      // Replace x with the transformed x in the formula
      result = result.replace(/x(?!²|³)/g, `(${xTransform})`)
    }

    // Apply vertical stretch
    if (verticalStretch !== 1) {
      result = `${verticalStretch} * ${result}`
    }

    // Apply vertical shift
    if (verticalShift !== 0) {
      result = `${result} ${verticalShift > 0 ? "+" : "-"} ${Math.abs(verticalShift)}`
    }

    return result
  }

  // Reset transformations
  const resetTransformations = () => {
    setVerticalShift(0)
    setHorizontalShift(0)
    setVerticalStretch(1)
    setHorizontalStretch(1)
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Function Laboratory!",
      content: "This interactive tool helps you understand how transformations affect functions.",
      emoji: "🧪",
    },
    {
      title: "Base Functions",
      content: "Choose a base function using the tabs above. This is the starting point for your transformations.",
      emoji: "📊",
    },
    {
      title: "Vertical Transformations",
      content: "Vertical shift moves the function up or down. Vertical stretch makes it taller or shorter.",
      emoji: "↕️",
    },
    {
      title: "Horizontal Transformations",
      content: "Horizontal shift moves the function left or right. Horizontal stretch makes it wider or narrower.",
      emoji: "↔️",
    },
    {
      title: "Derivative View",
      content: "Toggle the derivative view to see how transformations affect the derivative of the function.",
      emoji: "📈",
    },
  ]

  return (
    <div className="@container px-4 py-8 @md:py-12">

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-4 items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-transparent bg-clip-text">
              Function Laboratory
            </h1>
            <TutorialPopup steps={tutorialSteps} gameName="function-laboratory" className="bg-indigo-500/10 text-indigo-500 border-indigo-600/20" />

          </div>
          <p className="mt-4 text-xl text-muted-foreground">
            Build, transform, and analyze functions to see calculus in action
          </p>
        </div>

        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Function Transformation Lab</span>
              <Tabs defaultValue={baseFunction} value={baseFunction} onValueChange={setBaseFunction} className="h-9">
                <TabsList>
                  <TabsTrigger value="parabola">x²</TabsTrigger>
                  <TabsTrigger value="cubic">x³</TabsTrigger>
                  <TabsTrigger value="sine">sin(x)</TabsTrigger>
                  <TabsTrigger value="exponential">eˣ</TabsTrigger>
                  <TabsTrigger value="absolute">|x|</TabsTrigger>
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
                className="border border-muted rounded-lg bg-white dark:bg-gray-900 @xs:w-full @lg:w-auto"
              />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Vertical Shift: {verticalShift}</div>
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
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Horizontal Shift: {horizontalShift}</div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Vertical Stretch: {verticalStretch}</div>
                  </div>
                  <Slider
                    value={[verticalStretch]}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => setVerticalStretch(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Horizontal Stretch: {horizontalStretch}</div>
                  </div>
                  <Slider
                    value={[horizontalStretch]}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => setHorizontalStretch(value[0])}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowOriginal(!showOriginal)}
                    className={
                      showOriginal
                        ? "bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                        : ""
                    }
                  >
                    {showOriginal ? "Hide Original" : "Show Original"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDerivative(!showDerivative)}
                    className={
                      showDerivative
                        ? "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800"
                        : ""
                    }
                  >
                    {showDerivative ? "Hide Derivative" : "Show Derivative"}
                  </Button>
                </div>

                <Button variant="outline" onClick={resetTransformations}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Original Function:</h3>
                    <div className="text-lg font-medium">
                      {functions[baseFunction as keyof typeof functions].formula}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Transformed Function:</h3>
                    <div className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                      {formatTransformedFunction()}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>Function transformations follow these rules:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Vertical shift: f(x) + c moves the function up by c units</li>
                    <li>Horizontal shift: f(x - c) moves the function right by c units</li>
                    <li>Vertical stretch: a·f(x) stretches the function vertically by a factor of a</li>
                    <li>Horizontal stretch: f(x/a) stretches the function horizontally by a factor of a</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Link href="/calculus/games/function-transformer">
                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                  Try Function Transformer Game <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

