"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { ArrowRight, Download, RefreshCw, Share } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { downloadCanvasAsImage } from "@/components/calculus/utility/share-utils"
import { shareCanvas } from "@/components/calculus/utility/share-utils"

export default function AreaBuilderPage() {
  const [functionType, setFunctionType] = useState("parabola")
  const [rectangles, setRectangles] = useState<number>(4)
  const [rectangleMethod, setRectangleMethod] = useState<"left" | "right" | "midpoint">("midpoint")
  const [domain, setDomain] = useState<[number, number]>([-2, 2])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Function definitions
  const functions = useMemo(() => ({
    parabola: {
      name: "Parabola",
      formula: "f(x) = x²",
      fn: (x: number) => x * x,
      integral: (a: number, b: number) => (Math.pow(b, 3) - Math.pow(a, 3)) / 3,
      integralFormula: "∫x² dx = x³/3 + C",
      color: "#3B82F6", // blue-500
      recommendedDomain: [-2, 2],
    },
    cubic: {
      name: "Cubic Function",
      formula: "f(x) = x³",
      fn: (x: number) => x * x * x,
      integral: (a: number, b: number) => (Math.pow(b, 4) - Math.pow(a, 4)) / 4,
      integralFormula: "∫x³ dx = x⁴/4 + C",
      color: "#8B5CF6", // violet-500
      recommendedDomain: [-2, 2],
    },
    sine: {
      name: "Sine Function",
      formula: "f(x) = sin(x)",
      fn: (x: number) => Math.sin(x),
      integral: (a: number, b: number) => -Math.cos(b) + Math.cos(a),
      integralFormula: "∫sin(x) dx = -cos(x) + C",
      color: "#10B981", // emerald-500
      recommendedDomain: [0, Math.PI * 2],
    },
    linear: {
      name: "Linear Function",
      formula: "f(x) = 2x + 1",
      fn: (x: number) => 2 * x + 1,
      integral: (a: number, b: number) => b * b - a * a + (b - a),
      integralFormula: "∫(2x + 1) dx = x² + x + C",
      color: "#F59E0B", // amber-500
      recommendedDomain: [-2, 2],
    },
  }), []) // Empty dependency array since functions are static

  // Draw the function and rectangles on the canvas
  useEffect(() => {
    try {
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
      if (!fn) return

      // Draw the function
      ctx.strokeStyle = fn.color
      ctx.lineWidth = 2
      ctx.beginPath()

      const [domainMin, domainMax] = domain

      // Ensure domain values are valid
      if (isNaN(domainMin) || isNaN(domainMax) || domainMin >= domainMax) return

      for (let i = 0; i <= width; i++) {
        const x = (i - origin.x) / scale
        const y = fn.fn(x)

        // Skip if y is not a valid number
        if (isNaN(y) || !isFinite(y)) continue

        const canvasCoords = toCanvasCoords(x, y)

        if (i === 0) {
          ctx.moveTo(canvasCoords.x, canvasCoords.y)
        } else {
          ctx.lineTo(canvasCoords.x, canvasCoords.y)
        }
      }
      ctx.stroke()

      // Draw rectangles
      if (rectangles > 0) {
        const rectWidth = (domainMax - domainMin) / rectangles

        ctx.fillStyle = "rgba(16, 185, 129, 0.3)" // emerald-500 with opacity

        for (let i = 0; i < rectangles; i++) {
          const rectLeft = domainMin + i * rectWidth
          const rectRight = rectLeft + rectWidth

          // Determine the height based on the selected method
          let rectHeight: number
          if (rectangleMethod === "left") {
            rectHeight = fn.fn(rectLeft)
          } else if (rectangleMethod === "right") {
            rectHeight = fn.fn(rectRight)
          } else {
            // midpoint
            rectHeight = fn.fn(rectLeft + rectWidth / 2)
          }

          // Skip if height is not a valid number
          if (isNaN(rectHeight) || !isFinite(rectHeight)) continue

          // Only draw rectangles for positive heights
          if (rectHeight > 0) {
            const canvasLeft = toCanvasCoords(rectLeft, 0).x
            const canvasTop = toCanvasCoords(0, rectHeight).y
            const canvasWidth = rectWidth * scale
            const canvasHeight = origin.y - canvasTop

            ctx.fillRect(canvasLeft, canvasTop, canvasWidth, canvasHeight)

            // Draw rectangle border
            ctx.strokeStyle = "#10B981" // emerald-500
            ctx.lineWidth = 1
            ctx.strokeRect(canvasLeft, canvasTop, canvasWidth, canvasHeight)
          }
        }
      }

      // Draw domain highlight
      ctx.strokeStyle = "#EC4899" // pink-500
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5]) // Dashed line

      const domainMinCanvas = toCanvasCoords(domainMin, 0).x
      const domainMaxCanvas = toCanvasCoords(domainMax, 0).x

      // Left boundary
      ctx.beginPath()
      ctx.moveTo(domainMinCanvas, 0)
      ctx.lineTo(domainMinCanvas, height)
      ctx.stroke()

      // Right boundary
      ctx.beginPath()
      ctx.moveTo(domainMaxCanvas, 0)
      ctx.lineTo(domainMaxCanvas, height)
      ctx.stroke()

      ctx.setLineDash([]) // Reset to solid line
    } catch (error) {
      console.error("Error rendering canvas:", error)
    }
  }, [functions, domain, functionType, rectangleMethod, rectangles])

  // Calculate the approximate area
  const calculateApproximateArea = () => {
    try {
      const fn = functions[functionType as keyof typeof functions]
      if (!fn) return "0.0000"

      const [domainMin, domainMax] = domain
      if (isNaN(domainMin) || isNaN(domainMax) || domainMin >= domainMax) return "0.0000"

      const rectWidth = (domainMax - domainMin) / rectangles

      let sum = 0
      for (let i = 0; i < rectangles; i++) {
        const rectLeft = domainMin + i * rectWidth
        const rectRight = rectLeft + rectWidth

        // Determine the height based on the selected method
        let rectHeight: number
        if (rectangleMethod === "left") {
          rectHeight = fn.fn(rectLeft)
        } else if (rectangleMethod === "right") {
          rectHeight = fn.fn(rectRight)
        } else {
          // midpoint
          rectHeight = fn.fn(rectLeft + rectWidth / 2)
        }

        // Skip if height is not a valid number
        if (isNaN(rectHeight) || !isFinite(rectHeight)) continue

        // Only add positive heights
        if (rectHeight > 0) {
          sum += rectWidth * rectHeight
        }
      }

      return sum.toFixed(4)
    } catch (error) {
      console.error("Error calculating approximate area:", error)
      return "0.0000"
    }
  }

  // Calculate the exact area
  const calculateExactArea = () => {
    try {
      const fn = functions[functionType as keyof typeof functions]
      if (!fn) return "0.0000"

      const [domainMin, domainMax] = domain
      if (isNaN(domainMin) || isNaN(domainMax) || domainMin >= domainMax) return "0.0000"

      const result = fn.integral(domainMin, domainMax)
      if (isNaN(result) || !isFinite(result)) return "0.0000"

      return result.toFixed(4)
    } catch (error) {
      console.error("Error calculating exact area:", error)
      return "0.0000"
    }
  }

  // Handle function change
  const handleFunctionChange = (value: string) => {
    setFunctionType(value)
    setDomain(functions[value as keyof typeof functions].recommendedDomain as [number, number])
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Area Builder!",
      content: "This interactive tool helps you understand integrals and area under curves.",
      emoji: "📊",
    },
    {
      title: "The Function Graph",
      content: "The colored curve shows the function. You can choose different functions using the tabs above.",
      emoji: "🔵",
    },
    {
      title: "The Rectangles",
      content: "The green rectangles approximate the area under the curve. You can adjust how many rectangles to use.",
      emoji: "🟩",
    },
    {
      title: "Rectangle Methods",
      content: "Try different methods (left, right, midpoint) to see how they affect the approximation.",
      emoji: "📏",
    },
    {
      title: "Domain Selection",
      content: "You can change the domain (the range of x-values) to find the area of different regions.",
      emoji: "🔍",
    },
  ]

  return (
    <TooltipProvider>
      <div className="px-4 py-8 @md:py-12">

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-4 items-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
                Area Builder
              </h1>
              <TutorialPopup steps={tutorialSteps} gameName="area-builder" autoShowOnce={false} className="
            bg-green-600 text-white" />

            </div>
            <p className="mt-4 text-xl text-muted-foreground">
              Discover the power of integrals by finding areas under curves
            </p>
          </div>

          <Card className="border-2 border-border bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Interactive Area Visualization</span>
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
                    <TabsTrigger value="linear">2x+1</TabsTrigger>
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
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium">Number of Rectangles: {rectangles}</div>
                    </div>
                    <Slider
                      value={[rectangles]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => setRectangles(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Rectangle Method:</div>
                    <div className="flex gap-2">
                      <Button
                        variant={rectangleMethod === "left" ? "default" : "outline"}
                        onClick={() => setRectangleMethod("left")}
                        className={rectangleMethod === "left" ? "bg-green-500 text-white" : ""}
                      >
                        Left
                      </Button>
                      <Button
                        variant={rectangleMethod === "midpoint" ? "default" : "outline"}
                        onClick={() => setRectangleMethod("midpoint")}
                        className={rectangleMethod === "midpoint" ? "bg-green-500 text-white" : ""}
                      >
                        Midpoint
                      </Button>
                      <Button
                        variant={rectangleMethod === "right" ? "default" : "outline"}
                        onClick={() => setRectangleMethod("right")}
                        className={rectangleMethod === "right" ? "bg-green-500 text-white" : ""}
                      >
                        Right
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">
                      Domain: [{domain[0]}, {domain[1]}]
                    </div>
                  </div>
                  <Slider
                    value={domain}
                    min={-5}
                    max={5}
                    step={0.5}
                    onValueChange={(value) => {
                      // Ensure domain min is less than domain max
                      if (value[0] < value[1]) {
                        setDomain([value[0], value[1]])
                      } else {
                        setDomain([value[0], value[0] + 0.5])
                      }
                    }}
                  />
                </div>

                <div className="flex justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRectangles(4)
                          setRectangleMethod("midpoint")
                          setDomain(functions[functionType as keyof typeof functions].recommendedDomain as [number, number])
                        }}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset all settings to default values</p>
                    </TooltipContent>
                  </Tooltip>

                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            try {
                              if (canvasRef.current) {
                                downloadCanvasAsImage(
                                  canvasRef.current,
                                  `area-builder-${functionType}-${rectangleMethod}-${rectangles}.png`,
                                )
                              }
                            } catch (error) {
                              console.error("Error downloading image:", error)
                              alert("There was an issue downloading the image. Please try again.")
                            }
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download this visualization as an image</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            try {
                              if (canvasRef.current) {
                                const fn = functions[functionType as keyof typeof functions]
                                shareCanvas(canvasRef.current, {
                                  title: "Area Builder Visualization",
                                  text: `Check out my area calculation for ${fn.formula} using ${rectangleMethod} rectangles! Approximate area: ${calculateApproximateArea()}, Exact area: ${calculateExactArea()}`,
                                  filename: `area-builder-${functionType}.png`,
                                }).catch((error) => {
                                  console.error("Error sharing:", error)
                                  alert(
                                    "There was an issue sharing. The content has been copied to your clipboard instead.",
                                  )
                                })
                              }
                            } catch (error) {
                              console.error("Error sharing:", error)
                              alert("There was an issue sharing. Please try again.")
                            }
                          }}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share this visualization with others</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <div className="grid @md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Function:</h3>
                      <div className="text-lg font-medium">
                        {functions[functionType as keyof typeof functions].formula}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Integral:</h3>
                      <div className="text-lg font-medium text-green-600 dark:text-green-400">
                        {functions[functionType as keyof typeof functions].integralFormula}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid @md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Approximate Area:</h3>
                      <div className="text-lg font-medium text-green-600 dark:text-green-400">
                        {calculateApproximateArea()}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Exact Area:</h3>
                      <div className="text-lg font-medium">{calculateExactArea()}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>
                      As you increase the number of rectangles, the approximation gets closer to the exact area. This is
                      the fundamental idea behind integration in calculus!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Link href="/calculus/games/area-builder">
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    Try Area Builder Game <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}

