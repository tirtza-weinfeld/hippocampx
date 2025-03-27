"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { ArrowRight, Download, Share } from "lucide-react"
import Link from "next/link"

export default function SlopeExplorerPage() {
  const [xValue, setXValue] = useState(0)
  const [functionType, setFunctionType] = useState("parabola")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showDerivative, setShowDerivative] = useState(false)

  // Function definitions
  const functions = useMemo(() => ({
    parabola: {
      name: "Parabola",
      formula: "f(x) = x²",
      fn: (x: number) => x * x,
      derivative: (x: number) => 2 * x,
      derivativeFormula: "f'(x) = 2x",
      color: "#3B82F6", // blue-500
      recommendedDomain: [-3, 3],
    },
    cubic: {
      name: "Cubic Function",
      formula: "f(x) = x³",
      fn: (x: number) => x * x * x,
      derivative: (x: number) => 3 * x * x,
      derivativeFormula: "f'(x) = 3x²",
      color: "#8B5CF6", // violet-500
      recommendedDomain: [-2, 2],
    },
    sine: {
      name: "Sine Function",
      formula: "f(x) = sin(x)",
      fn: (x: number) => Math.sin(x),
      derivative: (x: number) => Math.cos(x),
      derivativeFormula: "f'(x) = cos(x)",
      color: "#10B981", // emerald-500
      recommendedDomain: [-Math.PI, Math.PI],
    },
    exponential: {
      name: "Exponential Function",
      formula: "f(x) = eˣ",
      fn: (x: number) => Math.exp(x),
      derivative: (x: number) => Math.exp(x),
      derivativeFormula: "f'(x) = eˣ",
      color: "#F59E0B", // amber-500
      recommendedDomain: [-2, 2],
    },
  }), []) // Empty dependency array since functions are static

  // Draw the function on the canvas
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

    // Get the selected function
    const fn = functions[functionType as keyof typeof functions]

    // Draw the function
    ctx.strokeStyle = fn.color
    ctx.lineWidth = 2
    ctx.beginPath()

    const [domainMin, domainMax] = fn.recommendedDomain

    for (let i = 0; i <= width; i++) {
      const x = (i - origin.x) / scale
      if (x < domainMin || x > domainMax) continue

      const y = fn.fn(x)
      const canvasCoords = toCanvasCoords(x, y)

      if (i === 0) {
        ctx.moveTo(canvasCoords.x, canvasCoords.y)
      } else {
        ctx.lineTo(canvasCoords.x, canvasCoords.y)
      }
    }
    ctx.stroke()

    // Draw derivative function if enabled
    if (showDerivative) {
      ctx.strokeStyle = "#EC4899" // pink-500
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5]) // Dashed line
      ctx.beginPath()

      for (let i = 0; i <= width; i++) {
        const x = (i - origin.x) / scale
        if (x < domainMin || x > domainMax) continue

        const y = fn.derivative(x)
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

    // Draw tangent line at x-value
    const tangentX = xValue
    const tangentY = fn.fn(tangentX)
    const slope = fn.derivative(tangentX)

    // Calculate tangent line endpoints
    const tangentLength = 2 // Length in units
    const x1 = tangentX - tangentLength / 2
    const y1 = tangentY - (slope * tangentLength) / 2
    const x2 = tangentX + tangentLength / 2
    const y2 = tangentY + (slope * tangentLength) / 2

    // Draw tangent line
    ctx.strokeStyle = "#EC4899" // pink-500
    ctx.lineWidth = 2
    ctx.beginPath()
    const start = toCanvasCoords(x1, y1)
    const end = toCanvasCoords(x2, y2)
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()

    // Draw point on curve
    const pointCoords = toCanvasCoords(tangentX, tangentY)
    ctx.fillStyle = "#EC4899" // pink-500
    ctx.beginPath()
    ctx.arc(pointCoords.x, pointCoords.y, 6, 0, Math.PI * 2)
    ctx.fill()

    // Draw slope value near the point
    ctx.fillStyle = "#EC4899" // pink-500
    ctx.font = "bold 14px sans-serif"
    ctx.fillText(`Slope: ${slope.toFixed(2)}`, pointCoords.x + 15, pointCoords.y - 15)
  }, [functions, functionType, showDerivative, xValue])

  // Handle function change
  const handleFunctionChange = (value: string) => {
    setFunctionType(value)
    setXValue(0) // Reset x-value when changing functions
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Slope Explorer!",
      content: "This interactive tool helps you understand derivatives and slopes of functions.",
      emoji: "📈",
    },
    {
      title: "The Function Graph",
      content: "The blue curve shows the function. You can choose different functions using the tabs above.",
      emoji: "🔵",
    },
    {
      title: "The Tangent Line",
      content:
        "The pink line is tangent to the curve at the selected point. Its slope is the derivative at that point.",
      emoji: "📐",
    },
    {
      title: "Moving the Point",
      content: "Use the slider to move the point along the curve and see how the slope changes.",
      emoji: "👆",
    },
    {
      title: "Show Derivative",
      content: "Toggle the 'Show Derivative' button to see the derivative function (the function of all slopes).",
      emoji: "🔍",
    },
  ]

  return (
    <div className="@container px-4 py-8 md:py-12">
      <TutorialPopup steps={tutorialSteps} gameName="slope-explorer" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 via-sky-600 to-teal-600 text-transparent bg-clip-text">
            Slope Explorer
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Visualize derivatives and tangent lines on interactive curves
          </p>
        </div>

        <Card className="border-2 border-border bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Interactive Derivative Visualization</span>
              <Tabs
                defaultValue={functionType}
                value={functionType}
                onValueChange={handleFunctionChange}
                className="h-9"
              >
                <TabsList>
                  <TabsTrigger value="parabola">x²</TabsTrigger>
                  <TabsTrigger value="cubic">x³</TabsTrigger>
                  <TabsTrigger value="sine">sin(x)</TabsTrigger>
                  <TabsTrigger value="exponential">eˣ</TabsTrigger>
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

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">x-value: {xValue.toFixed(2)}</div>
                  <div className="text-sm font-medium">
                    Slope: {functions[functionType as keyof typeof functions].derivative(xValue).toFixed(2)}
                  </div>
                </div>
                <Slider
                  value={[xValue]}
                  min={functions[functionType as keyof typeof functions].recommendedDomain[0]}
                  max={functions[functionType as keyof typeof functions].recommendedDomain[1]}
                  step={0.1}
                  onValueChange={(value) => setXValue(value[0])}
                />
              </div>

              <div className="flex justify-between">
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

                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Function:</h3>
                    <div className="text-lg font-medium">
                      {functions[functionType as keyof typeof functions].formula}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Derivative:</h3>
                    <div className="text-lg font-medium text-pink-600 dark:text-pink-400">
                      {functions[functionType as keyof typeof functions].derivativeFormula}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>
                    The pink line is tangent to the curve at x = {xValue.toFixed(2)}. The slope of this line is the
                    derivative at that point:{" "}
                    {functions[functionType as keyof typeof functions].derivative(xValue).toFixed(2)}.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Link href="/calculus/games/slope-racer">
                <Button className="bg-gradient-to-r from-blue-600 to-sky-600 text-white">
                  Try Slope Racer Game <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

