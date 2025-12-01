"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/calculus/confetti"

export function TangentExplorer() {
  const [xValue, setXValue] = useState(0)
  const [functionType, setFunctionType] = useState("parabola")
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Function definitions
  const functions = useMemo(() => ({
    parabola: {
      name: "Parabola",
      formula: "f(<span class='var-x'>x</span>) = <span class='var-x'>x</span>²",
      fn: (x: number) => x * x,
      derivative: (x: number) => 2 * x,
      derivativeFormula: "f'(<span class='var-x'>x</span>) = 2<span class='var-x'>x</span>",
      color: "#3B82F6", // blue-500
      recommendedDomain: [-3, 3],
    },
    cubic: {
      name: "Cubic Function",
      formula: "f(<span class='var-x'>x</span>) = <span class='var-x'>x</span>³",
      fn: (x: number) => x * x * x,
      derivative: (x: number) => 3 * x * x,
      derivativeFormula: "f'(<span class='var-x'>x</span>) = 3<span class='var-x'>x</span>²",
      color: "#8B5CF6", // violet-500
      recommendedDomain: [-2, 2],
    },
    sine: {
      name: "Sine Function",
      formula: "f(<span class='var-x'>x</span>) = sin(<span class='var-x'>x</span>)",
      fn: (x: number) => Math.sin(x),
      derivative: (x: number) => Math.cos(x),
      derivativeFormula: "f'(<span class='var-x'>x</span>) = cos(<span class='var-x'>x</span>)",
      color: "#10B981", // emerald-500
      recommendedDomain: [-Math.PI, Math.PI],
    },
    exponential: {
      name: "Exponential Function",
      formula: "f(<span class='var-x'>x</span>) = e<sup><span class='var-x'>x</span></sup>",
      fn: (x: number) => Math.exp(x),
      derivative: (x: number) => Math.exp(x),
      derivativeFormula: "f'(<span class='var-x'>x</span>) = e<sup><span class='var-x'>x</span></sup>",
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
  }, [xValue, functionType, functions])

  // Handle slider change - check for first interaction here instead of effect
  function handleXValueChange(newValue: number) {
    setXValue(newValue)
    if (!hasInteracted && newValue !== 0) {
      setHasInteracted(true)
      setShowConfetti(true)
    }
  }

  // Handle function change
  const handleFunctionChange = (value: string) => {
    setFunctionType(value)
    setXValue(0) // Reset x-value when changing functions
  }

  return (
    <section className="py-6 relative">
      <Confetti trigger={showConfetti} count={70} />
      {/* <RewardBadge
        title="Tangent Explorer"
        description="You've discovered how derivatives create tangent lines to curves!"
        icon="star"
        color="blue"
        show={showReward}
        onClose={() => setShowReward(false)}
      /> */}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold mb-4">Tangent Line Explorer</h2>
        <Card>
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
            <div className="flex justify-center ">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="border border-muted rounded-lg bg-white dark:bg-gray-900
      @xs:w-full @lg:w-auto              
              "
              />
            </div>



            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">
                    <span className="var-x">x</span>-value: {xValue.toFixed(2)}
                  </div>
                  <div className="text-sm font-medium">
                    Slope:{" "}
                    <span className="var-derivative">
                      {functions[functionType as keyof typeof functions].derivative(xValue).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Slider
                  value={[xValue]}
                  min={functions[functionType as keyof typeof functions].recommendedDomain[0]}
                  max={functions[functionType as keyof typeof functions].recommendedDomain[1]}
                  step={0.1}
                  onValueChange={(value) => handleXValueChange(value[0])}
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="grid @md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Function:</h3>
                    <div
                      className="text-lg font-medium math-eq"
                      dangerouslySetInnerHTML={{
                        __html: functions[functionType as keyof typeof functions].formula,
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Derivative:</h3>
                    <div
                      className="text-lg font-medium text-pink-600 dark:text-pink-400 math-eq"
                      dangerouslySetInnerHTML={{
                        __html: functions[functionType as keyof typeof functions].derivativeFormula,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>
                    The pink line is tangent to the curve at <span className="var-x">x</span> = {xValue.toFixed(2)}. The
                    slope of this line is the derivative at that point:{" "}
                    <span className="var-derivative">
                      {functions[functionType as keyof typeof functions].derivative(xValue).toFixed(2)}
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

