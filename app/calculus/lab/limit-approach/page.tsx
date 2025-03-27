"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LimitApproachPage() {
  const [functionType, setFunctionType] = useState("rational")
  const [approachValue, setApproachValue] = useState(0)
  const [approachDirection, setApproachDirection] = useState<"both" | "left" | "right">("both")
  const [epsilon, setEpsilon] = useState(0.1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [functionValue, setFunctionValue] = useState<number | string>("undefined")
  const [limitValue, setLimitValue] = useState<number | string>("undefined")

  // Function definitions
  const functions = useMemo(() => ({
    rational: {
      name: "Rational Function",
      formula: "f(x) = (x² - 1)/(x - 1)",
      fn: (x: number) => {
        if (x === 1) return undefined
        return (x * x - 1) / (x - 1)
      },
      limit: (a: number) => {
        if (a === 1) return 2
        return (a * a - 1) / (a - 1)
      },
      limitFormula: "lim x→1 (x² - 1)/(x - 1) = 2",
      color: "#3B82F6", // blue-500
      discontinuities: [1],
      domain: [-5, 5],
    },
    sinx_over_x: {
      name: "Sinc Function",
      formula: "f(x) = sin(x)/x",
      fn: (x: number) => {
        if (x === 0) return undefined
        return Math.sin(x) / x
      },
      limit: (a: number) => {
        if (a === 0) return 1
        return Math.sin(a) / a
      },
      limitFormula: "lim x→0 sin(x)/x = 1",
      color: "#8B5CF6", // violet-500
      discontinuities: [0],
      domain: [-10, 10],
    },
    piecewise: {
      name: "Piecewise Function",
      formula: "f(x) = { x² if x ≤ 2, 4 if x > 2 }",
      fn: (x: number) => {
        if (x <= 2) return x * x
        return 4
      },
      limit: (a: number) => {
        if (a < 2) return a * a
        if (a > 2) return 4
        return 4 // The limit exists at x = 2 even though the function is discontinuous
      },
      limitFormula: "lim x→2 f(x) = 4",
      color: "#10B981", // emerald-500
      discontinuities: [2],
      domain: [-2, 6],
    },
    jump: {
      name: "Jump Discontinuity",
      formula: "f(x) = { x + 1 if x < 0, x - 1 if x ≥ 0 }",
      fn: (x: number) => {
        if (x < 0) return x + 1
        return x - 1
      },
      limit: (a: number) => {
        if (a < 0) return a + 1
        if (a > 0) return a - 1
        return "DNE" // Does not exist at x = 0
      },
      limitFormula: "lim x→0 f(x) does not exist",
      color: "#F59E0B", // amber-500
      discontinuities: [0],
      domain: [-5, 5],
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
    const [domainMin, domainMax] = fn.domain

    // Draw the function
    ctx.strokeStyle = fn.color
    ctx.lineWidth = 2

    // Draw the function in segments to handle discontinuities
    const discontinuities = fn.discontinuities || []
    let lastX = domainMin

    for (const disc of [...discontinuities, domainMax]) {
      // Draw segment from lastX to just before discontinuity
      ctx.beginPath()
      let firstPoint = true

      for (let i = 0; i <= width; i++) {
        const x = (i - origin.x) / scale

        // Skip if outside current segment
        if (x < lastX || x >= disc) continue

        const y = fn.fn(x)

        // Skip undefined values
        if (y === undefined || isNaN(y)) continue

        const canvasCoords = toCanvasCoords(x, y)

        if (firstPoint) {
          ctx.moveTo(canvasCoords.x, canvasCoords.y)
          firstPoint = false
        } else {
          ctx.lineTo(canvasCoords.x, canvasCoords.y)
        }
      }

      ctx.stroke()
      lastX = disc
    }

    // Draw the approach point
    const approachPointX = approachValue
    const limitY = fn.limit(approachValue)
    const functionY = fn.fn(approachValue)

    // Update state with current values
    setFunctionValue(functionY !== undefined ? functionY.toFixed(4) : "undefined")
    setLimitValue(limitY !== "DNE" ? (typeof limitY === "number" ? limitY.toFixed(4) : limitY) : "DNE")

    // Draw vertical line at approach point
    ctx.strokeStyle = "#EC4899" // pink-500
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5]) // Dashed line

    const approachPointCanvas = toCanvasCoords(approachPointX, 0).x
    ctx.beginPath()
    ctx.moveTo(approachPointCanvas, 0)
    ctx.lineTo(approachPointCanvas, height)
    ctx.stroke()
    ctx.setLineDash([]) // Reset to solid line

    // Draw epsilon band if limit exists
    if (limitY !== "DNE" && typeof limitY === "number") {
      const limitYCanvas = toCanvasCoords(0, limitY).y

      // Draw horizontal line at limit value
      ctx.strokeStyle = "#EC4899" // pink-500
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5]) // Dashed line

      ctx.beginPath()
      ctx.moveTo(0, limitYCanvas)
      ctx.lineTo(width, limitYCanvas)
      ctx.stroke()

      // Draw epsilon band
      ctx.fillStyle = "rgba(236, 72, 153, 0.1)" // pink-500 with low opacity
      const epsilonTopY = toCanvasCoords(0, limitY + epsilon).y
      const epsilonBottomY = toCanvasCoords(0, limitY - epsilon).y
      ctx.fillRect(0, epsilonTopY, width, epsilonBottomY - epsilonTopY)

      ctx.setLineDash([]) // Reset to solid line
    }

    // Draw approach arrows
    const arrowSize = 10
    ctx.fillStyle = "#EC4899" // pink-500

    if (approachDirection === "left" || approachDirection === "both") {
      // Left approach arrow
      const arrowX = approachPointCanvas - 20
      const arrowY = origin.y - 30

      ctx.beginPath()
      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(arrowX + arrowSize, arrowY - arrowSize / 2)
      ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize / 2)
      ctx.closePath()
      ctx.fill()
    }

    if (approachDirection === "right" || approachDirection === "both") {
      // Right approach arrow
      const arrowX = approachPointCanvas + 20
      const arrowY = origin.y - 30

      ctx.beginPath()
      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(arrowX - arrowSize, arrowY - arrowSize / 2)
      ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize / 2)
      ctx.closePath()
      ctx.fill()
    }

    // Add labels
    ctx.font = "14px sans-serif"
    ctx.fillStyle = "#EC4899" // pink-500
    ctx.fillText(`x = ${approachValue}`, approachPointCanvas, origin.y - 50)

    if (limitY !== "DNE" && typeof limitY === "number") {
      const limitYCanvas = toCanvasCoords(0, limitY).y
      ctx.fillText(`Limit = ${limitY.toFixed(2)}`, origin.x + 80, limitYCanvas)
      ctx.fillText(`ε = ${epsilon}`, origin.x + 80, limitYCanvas - 20)
    }
  }, [functions, approachDirection, approachValue, epsilon, functionType])

  // Handle function change
  const handleFunctionChange = (value: string) => {
    setFunctionType(value)
    // Reset approach value to the discontinuity point of the selected function
    const fn = functions[value as keyof typeof functions]
    if (fn.discontinuities && fn.discontinuities.length > 0) {
      setApproachValue(fn.discontinuities[0])
    } else {
      setApproachValue(0)
    }
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Limit Approach!",
      content: "This interactive tool helps you understand limits and how functions behave near special points.",
      emoji: "🔍",
    },
    {
      title: "The Function Graph",
      content:
        "The colored curve shows the function. You can choose different functions with interesting behavior using the tabs above.",
      emoji: "📊",
    },
    {
      title: "Approach Point",
      content: "The vertical dashed line shows the point you're approaching. Use the slider to move this point.",
      emoji: "📍",
    },
    {
      title: "Approach Direction",
      content: "You can approach the point from the left, right, or both sides to see how the limit behaves.",
      emoji: "↔️",
    },
    {
      title: "Epsilon Band",
      content:
        "The shaded area shows values within ε (epsilon) of the limit. You can adjust ε to see how close you need to get.",
      emoji: "📏",
    },
  ]

  return (
    <div className="@container px-4 py-8 @md:py-12">
      <TutorialPopup steps={tutorialSteps} gameName="limit-approach" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter @sm:text-4xl  @md:text-5xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-transparent bg-clip-text">
            Limit Approach
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            See what happens as x approaches different values in interactive functions
          </p>
        </div>

        <Card className="border-2 border-border bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center @md:flex-row flex-col gap-2">
              <span>Interactive Limit Visualization</span>
              <Tabs
                defaultValue={functionType}
                value={functionType}
                onValueChange={handleFunctionChange}
                className="h-9"
              >
                <TabsList>
                  <TabsTrigger value="rational">(x²-1)/(x-1)</TabsTrigger>
                  <TabsTrigger value="sinx_over_x">sin(x)/x</TabsTrigger>
                  <TabsTrigger value="piecewise">Piecewise</TabsTrigger>
                  <TabsTrigger value="jump">Jump</TabsTrigger>
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
                className="border border-muted rounded-lg bg-white dark:bg-gray-900  @xs:w-full @lg:w-auto"
              />
            </div>

      
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between @md:flex-row flex-col gap-2">
                  <div className="text-sm font-medium">Approach x = {approachValue}</div>
                </div>
                <Slider
                  value={[approachValue]}
                  min={functions[functionType as keyof typeof functions].domain[0]}
                  max={functions[functionType as keyof typeof functions].domain[1]}
                  step={0.1}
                  onValueChange={(value) => setApproachValue(value[0])}
                />
              </div>

              <div className="grid grid-cols-1 @md:grid-cols-2 gap-4 ">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Approach Direction:</div>
                  <div className="flex gap-2 @md:flex-row flex-col gap-2  ">
                    <Button
                      variant={approachDirection === "left" ? "default" : "outline"}
                      onClick={() => setApproachDirection("left")}
                      className={approachDirection === "left" ? "bg-purple-500 text-white" : ""}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      From Left
                    </Button>
                    <Button
                      variant={approachDirection === "both" ? "default" : "outline"}
                      onClick={() => setApproachDirection("both")}
                      className={approachDirection === "both" ? "bg-purple-500 text-white" : ""}
                    >
                      Both Sides
                    </Button>
                    <Button
                      variant={approachDirection === "right" ? "default" : "outline"}
                      onClick={() => setApproachDirection("right")}
                      className={approachDirection === "right" ? "bg-purple-500 text-white" : ""}
                    >
                      From Right
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Epsilon (ε): {epsilon}</div>
                  </div>
                  <Slider
                    value={[epsilon]}
                    min={0.01}
                    max={2}
                    step={0.01}
                    onValueChange={(value) => setEpsilon(value[0])}
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Function:</h3>
                    <div className="text-lg font-medium">
                      {functions[functionType as keyof typeof functions].formula}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Limit:</h3>
                    <div className="text-lg font-medium text-purple-600 dark:text-purple-400">
                      {functions[functionType as keyof typeof functions].limitFormula}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Function Value at x = {approachValue}:</h3>
                    <div className="text-lg font-medium">{functionValue}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Limit Value as x → {approachValue}:</h3>
                    <div className="text-lg font-medium text-purple-600 dark:text-purple-400">{limitValue}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>
                    A limit exists if the function approaches the same value from both sides. The function value at the
                    point may be different from the limit, or may not exist at all!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Link href="/calculus/games/limit-explorer">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  Try Limit Explorer Game <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

