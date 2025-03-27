"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { ArrowRight, Download, Share, Plus, RefreshCw, X } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import { downloadCanvasAsImage, shareCanvas } from "@/components/calculus/utility/share-utils"

// Function parser and evaluator
function evaluateExpression(expression: string, x: number): number | undefined {
  try {
    // Replace common math functions with Math equivalents
    const preparedExpression = expression
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/exp\(/g, "Math.exp(")
      .replace(/log\(/g, "Math.log(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/abs\(/g, "Math.abs(")
      .replace(/\^/g, "**")
      .replace(/e/g, "Math.E")
      .replace(/pi/g, "Math.PI")

    // Create a function from the expression
    const func = new Function("x", `return ${preparedExpression}`)
    return func(x)
  } catch {
    console.error("Error rendering graph")
    return undefined
  }
}

// Numerical differentiation
function numericalDerivative(expression: string, x: number, h = 0.0001): number | undefined {
  const yPlus = evaluateExpression(expression, x + h)
  const yMinus = evaluateExpression(expression, x - h)

  if (yPlus === undefined || yMinus === undefined) return undefined

  return (yPlus - yMinus) / (2 * h)
}

// Second derivative
function secondDerivative(expression: string, x: number, h = 0.0001): number | undefined {
  const yPlus = evaluateExpression(expression, x + h)
  const y = evaluateExpression(expression, x)
  const yMinus = evaluateExpression(expression, x - h)

  if (yPlus === undefined || y === undefined || yMinus === undefined) return undefined

  return (yPlus - 2 * y + yMinus) / (h * h)
}

export default function GraphCreatorPage() {
  const [expressions, setExpressions] = useState<string[]>(["x^2", "sin(x)"])
  const [expressionColors, setExpressionColors] = useState<string[]>(["#3B82F6", "#EC4899"])
  const [showDerivatives, setShowDerivatives] = useState<boolean[]>([false, false])
  const [showSecondDerivatives, setShowSecondDerivatives] = useState<boolean[]>([false, false])
  const [xMin, setXMin] = useState<number>(-10)
  const [xMax, setXMax] = useState<number>(10)
  const [yMin, setYMin] = useState<number>(-10)
  const [yMax, setYMax] = useState<number>(10)
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph")
  const [tableXValues, setTableXValues] = useState<number[]>([-2, -1, 0, 1, 2])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [expressionValid, setExpressionValid] = useState<boolean[]>([true, true])

  // Available colors for expressions
  const colors = [
    "#3B82F6", // blue-500
    "#EC4899", // pink-500
    "#10B981", // emerald-500
    "#F59E0B", // amber-500
    "#8B5CF6", // violet-500
    "#EF4444", // red-500
    "#06B6D4", // cyan-500
    "#84CC16", // lime-500
  ]

  // Draw the graph on the canvas
  useEffect(() => {
    if (viewMode !== "graph") return

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
    const xRange = xMax - xMin
    const yRange = yMax - yMin
    const xScale = width / xRange
    const yScale = height / yRange

    // Helper function to convert mathematical coordinates to canvas coordinates
    const toCanvasCoords = (x: number, y: number) => ({
      x: (x - xMin) * xScale,
      y: height - (y - yMin) * yScale, // Flip y-axis
    })

    // Draw grid
    ctx.strokeStyle = "#E2E8F0" // slate-200
    ctx.lineWidth = 1

    // Vertical grid lines
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if (x === 0) continue // Skip axes
      const { x: canvasX } = toCanvasCoords(x, 0)
      ctx.beginPath()
      ctx.moveTo(canvasX, 0)
      ctx.lineTo(canvasX, height)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      if (y === 0) continue // Skip axes
      const { y: canvasY } = toCanvasCoords(0, y)
      ctx.beginPath()
      ctx.moveTo(0, canvasY)
      ctx.lineTo(width, canvasY)
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = "#94A3B8" // slate-400
    ctx.lineWidth = 2

    // x-axis
    if (yMin <= 0 && yMax >= 0) {
      const { y: xAxisY } = toCanvasCoords(0, 0)
      ctx.beginPath()
      ctx.moveTo(0, xAxisY)
      ctx.lineTo(width, xAxisY)
      ctx.stroke()
    }

    // y-axis
    if (xMin <= 0 && xMax >= 0) {
      const { x: yAxisX } = toCanvasCoords(0, 0)
      ctx.beginPath()
      ctx.moveTo(yAxisX, 0)
      ctx.lineTo(yAxisX, height)
      ctx.stroke()
    }

    // Draw tick marks and labels
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748B" // slate-500

    // x-axis ticks
    if (yMin <= 0 && yMax >= 0) {
      const { y: xAxisY } = toCanvasCoords(0, 0)
      for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        if (x === 0) continue // Skip origin
        const { x: tickX } = toCanvasCoords(x, 0)
        ctx.beginPath()
        ctx.moveTo(tickX, xAxisY - 5)
        ctx.lineTo(tickX, xAxisY + 5)
        ctx.stroke()
        ctx.fillText(x.toString(), tickX, xAxisY + 15)
      }
    }

    // y-axis ticks
    if (xMin <= 0 && xMax >= 0) {
      const { x: yAxisX } = toCanvasCoords(0, 0)
      for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        if (y === 0) continue // Skip origin
        const { y: tickY } = toCanvasCoords(0, y)
        ctx.beginPath()
        ctx.moveTo(yAxisX - 5, tickY)
        ctx.lineTo(yAxisX + 5, tickY)
        ctx.stroke()
        ctx.fillText(y.toString(), yAxisX - 15, tickY)
      }
    }

    // Origin label
    if (xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0) {
      const { x: originX, y: originY } = toCanvasCoords(0, 0)
      ctx.fillText("0", originX - 10, originY + 15)
    }

    // Draw each expression
    expressions.forEach((expression, index) => {
      if (!expressionValid[index]) return

      const color = expressionColors[index]

      // Draw the function
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      let firstPoint = true
      let lastY: number | undefined

      for (let i = 0; i <= width; i++) {
        const x = xMin + (i / width) * xRange
        const y = evaluateExpression(expression, x)

        if (y === undefined || isNaN(y) || !isFinite(y)) {
          firstPoint = true
          continue
        }

        // Skip if y is outside the visible range
        if (y < yMin || y > yMax) {
          firstPoint = true
          continue
        }

        // Skip if there's a large jump (discontinuity)
        if (!firstPoint && lastY !== undefined) {
          const jump = Math.abs(y - lastY)
          if (jump > yRange / 4) {
            firstPoint = true
          }
        }

        const { x: canvasX, y: canvasY } = toCanvasCoords(x, y)

        if (firstPoint) {
          ctx.moveTo(canvasX, canvasY)
          firstPoint = false
        } else {
          ctx.lineTo(canvasX, canvasY)
        }

        lastY = y
      }

      ctx.stroke()

      // Draw the first derivative if enabled
      if (showDerivatives[index]) {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5]) // Dashed line
        ctx.beginPath()

        firstPoint = true
        lastY = undefined

        for (let i = 0; i <= width; i++) {
          const x = xMin + (i / width) * xRange
          const y = numericalDerivative(expression, x)

          if (y === undefined || isNaN(y) || !isFinite(y)) {
            firstPoint = true
            continue
          }

          // Skip if y is outside the visible range
          if (y < yMin || y > yMax) {
            firstPoint = true
            continue
          }

          // Skip if there's a large jump (discontinuity)
          if (!firstPoint && lastY !== undefined) {
            const jump = Math.abs(y - lastY)
            if (jump > yRange / 4) {
              firstPoint = true
            }
          }

          const { x: canvasX, y: canvasY } = toCanvasCoords(x, y)

          if (firstPoint) {
            ctx.moveTo(canvasX, canvasY)
            firstPoint = false
          } else {
            ctx.lineTo(canvasX, canvasY)
          }

          lastY = y
        }

        ctx.stroke()
        ctx.setLineDash([]) // Reset to solid line
      }

      // Draw the second derivative if enabled
      if (showSecondDerivatives[index]) {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.setLineDash([2, 2]) // Dotted line
        ctx.beginPath()

        firstPoint = true
        lastY = undefined

        for (let i = 0; i <= width; i++) {
          const x = xMin + (i / width) * xRange
          const y = secondDerivative(expression, x)

          if (y === undefined || isNaN(y) || !isFinite(y)) {
            firstPoint = true
            continue
          }

          // Skip if y is outside the visible range
          if (y < yMin || y > yMax) {
            firstPoint = true
            continue
          }

          // Skip if there's a large jump (discontinuity)
          if (!firstPoint && lastY !== undefined) {
            const jump = Math.abs(y - lastY)
            if (jump > yRange / 4) {
              firstPoint = true
            }
          }

          const { x: canvasX, y: canvasY } = toCanvasCoords(x, y)

          if (firstPoint) {
            ctx.moveTo(canvasX, canvasY)
            firstPoint = false
          } else {
            ctx.lineTo(canvasX, canvasY)
          }

          lastY = y
        }

        ctx.stroke()
        ctx.setLineDash([]) // Reset to solid line
      }
    })

    // Add legend
    ctx.font = "14px sans-serif"

    expressions.forEach((expression, index) => {
      if (!expressionValid[index]) return

      const color = expressionColors[index]
      const y = 20 + index * 60

      // Function
      ctx.fillStyle = color
      ctx.fillText(`f${index + 1}(x) = ${expression}`, 120, y)

      // First derivative
      if (showDerivatives[index]) {
        ctx.fillStyle = color
        ctx.fillText(`f${index + 1}'(x)`, 120, y + 20)

        // Draw dashed line sample
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(80, y + 20)
        ctx.lineTo(110, y + 20)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Second derivative
      if (showSecondDerivatives[index]) {
        ctx.fillStyle = color
        ctx.fillText(`f${index + 1}''(x)`, 120, y + 40)

        // Draw dotted line sample
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.setLineDash([2, 2])
        ctx.beginPath()
        ctx.moveTo(80, y + 40)
        ctx.lineTo(110, y + 40)
        ctx.stroke()
        ctx.setLineDash([])
      }
    })
  }, [
    expressions,
    expressionColors,
    showDerivatives,
    showSecondDerivatives,
    xMin,
    xMax,
    yMin,
    yMax,
    viewMode,
    expressionValid,
  ])

  // Add a new expression
  const addExpression = () => {
    if (expressions.length >= 8) return

    setExpressions([...expressions, "x"])
    setExpressionColors([...expressionColors, colors[expressions.length % colors.length]])
    setShowDerivatives([...showDerivatives, false])
    setShowSecondDerivatives([...showSecondDerivatives, false])
    setExpressionValid([...expressionValid, true])
  }

  // Remove an expression
  const removeExpression = (index: number) => {
    if (expressions.length <= 1) return

    const newExpressions = [...expressions]
    newExpressions.splice(index, 1)
    setExpressions(newExpressions)

    const newColors = [...expressionColors]
    newColors.splice(index, 1)
    setExpressionColors(newColors)

    const newShowDerivatives = [...showDerivatives]
    newShowDerivatives.splice(index, 1)
    setShowDerivatives(newShowDerivatives)

    const newShowSecondDerivatives = [...showSecondDerivatives]
    newShowSecondDerivatives.splice(index, 1)
    setShowSecondDerivatives(newShowSecondDerivatives)

    const newExpressionValid = [...expressionValid]
    newExpressionValid.splice(index, 1)
    setExpressionValid(newExpressionValid)
  }

  // Update an expression
  const updateExpression = (index: number, value: string) => {
    const newExpressions = [...expressions]
    newExpressions[index] = value
    setExpressions(newExpressions)

    // Check if expression is valid
    try {
      const result = evaluateExpression(value, 0)
      const newExpressionValid = [...expressionValid]
      newExpressionValid[index] = result !== undefined
      setExpressionValid(newExpressionValid)
    } catch {
      const newExpressionValid = [...expressionValid]
      newExpressionValid[index] = false
      setExpressionValid(newExpressionValid)
    }
  }

  // Toggle derivative visibility
  const toggleDerivative = (index: number) => {
    const newShowDerivatives = [...showDerivatives]
    newShowDerivatives[index] = !newShowDerivatives[index]
    setShowDerivatives(newShowDerivatives)
  }

  // Toggle second derivative visibility
  const toggleSecondDerivative = (index: number) => {
    const newShowSecondDerivatives = [...showSecondDerivatives]
    newShowSecondDerivatives[index] = !newShowSecondDerivatives[index]
    setShowSecondDerivatives(newShowSecondDerivatives)
  }

  // Reset view
  const resetView = () => {
    setXMin(-10)
    setXMax(10)
    setYMin(-10)
    setYMax(10)
  }

  // Add a value to the table
  const addTableValue = () => {
    if (tableXValues.length >= 10) return

    const lastValue = tableXValues[tableXValues.length - 1] || 0
    setTableXValues([...tableXValues, lastValue + 1])
  }

  // Remove a value from the table
  const removeTableValue = (index: number) => {
    if (tableXValues.length <= 1) return

    const newTableXValues = [...tableXValues]
    newTableXValues.splice(index, 1)
    setTableXValues(newTableXValues)
  }

  // Update a table value
  const updateTableValue = (index: number, value: string) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return

    const newTableXValues = [...tableXValues]
    newTableXValues[index] = numValue
    setTableXValues(newTableXValues)
  }

  // Download the graph as an image
  const handleDownload = () => {
    try {
      downloadCanvasAsImage(canvasRef.current, `graph-creator-${new Date().toISOString().slice(0, 10)}.png`)
    } catch {
      console.error("Error downloading graph")
      alert("Failed to download the graph. Please try again.")
    }
  }

  // Share the graph
  const handleShare = async () => {
    try {
      if (!canvasRef.current) return

      await shareCanvas(canvasRef.current, {
        title: "My Graph from CalKids",
        text: `Check out this graph I created with CalKids! Functions: ${expressions.join(", ")} #CalKids #MathGraph`,
        filename: `graph-creator-${new Date().toISOString().slice(0, 10)}.png`,
      })
    } catch {
      console.error("Error sharing graph")
      alert("Failed to share the graph. The content has been copied to your clipboard instead.")
    }
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Graph Creator!",
      content: "This interactive tool helps you create and analyze your own mathematical functions.",
      emoji: "📊",
    },
    {
      title: "Creating Functions",
      content:
        "Enter mathematical expressions using standard notation. You can use operators like +, -, *, /, ^ and functions like sin(), cos(), sqrt().",
      emoji: "✏️",
    },
    {
      title: "Derivatives",
      content: "Toggle the derivative and second derivative options to visualize how the function changes.",
      emoji: "📈",
    },
    {
      title: "Multiple Functions",
      content: "Add multiple functions to compare them on the same graph. Each function has its own color.",
      emoji: "🎨",
    },
    {
      title: "Table View",
      content:
        "Switch to table view to see the exact values of your functions and their derivatives at specific points.",
      emoji: "🔢",
    },
  ]

  return (
    <div className="@container px-4 py-8 md:py-12">
      <TutorialPopup steps={tutorialSteps} gameName="graph-creator" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-transparent bg-clip-text">
            Graph Creator
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Create and analyze your own mathematical functions and their derivatives
          </p>
        </div>

        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Function Graph Creator</span>
              <Tabs
                defaultValue={viewMode}
                value={viewMode}
                onValueChange={(value) => setViewMode(value as "graph" | "table")}
                className="h-9"
              >
                <TabsList>
                  <TabsTrigger value="graph">Graph View</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Function inputs */}
            <div className="space-y-4">
              {expressions.map((expression, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full mt-2" style={{ backgroundColor: expressionColors[index] }}></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`function-${index}`} className="text-sm font-medium">
                        f{index + 1}(x) =
                      </Label>
                      <div className="flex-1">
                        <Input
                          id={`function-${index}`}
                          value={expression}
                          onChange={(e) => updateExpression(index, e.target.value)}
                          className={!expressionValid[index] ? "border-red-500" : ""}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`derivative-${index}`}
                          checked={showDerivatives[index]}
                          onCheckedChange={() => toggleDerivative(index)}
                        />
                        <Label htmlFor={`derivative-${index}`} className="text-sm">
                          f&apos;(x)
                        </Label>

                        <Checkbox
                          id={`second-derivative-${index}`}
                          checked={showSecondDerivatives[index]}
                          onCheckedChange={() => toggleSecondDerivative(index)}
                        />
                        <Label htmlFor={`second-derivative-${index}`} className="text-sm">
                          f&apos;&apos;(x)
                        </Label>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExpression(index)}
                          disabled={expressions.length <= 1}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {!expressionValid[index] && (
                      <p className="text-xs text-red-500">Invalid expression. Please check your syntax.</p>
                    )}
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addExpression} disabled={expressions.length >= 8} className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Add Function
              </Button>
            </div>

            {/* Graph view */}
            {viewMode === "graph" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="border border-muted rounded-lg bg-white dark:bg-gray-900 @xs:w-full @lg:w-auto"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium">
                        X Range: [{xMin}, {xMax}]
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={xMin}
                        onChange={(e) => setXMin(Number.parseFloat(e.target.value))}
                        className="w-20"
                      />
                      <span className="self-center">to</span>
                      <Input
                        type="number"
                        value={xMax}
                        onChange={(e) => setXMax(Number.parseFloat(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium">
                        Y Range: [{yMin}, {yMax}]
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={yMin}
                        onChange={(e) => setYMin(Number.parseFloat(e.target.value))}
                        className="w-20"
                      />
                      <span className="self-center">to</span>
                      <Input
                        type="number"
                        value={yMax}
                        onChange={(e) => setYMax(Number.parseFloat(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetView}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset View
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Table view */}
            {viewMode === "table" && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-muted p-2 text-left">x</th>
                        {expressions.map((expr, i) => (
                          <React.Fragment key={i}>
                            <th className="border border-muted p-2 text-left" style={{ color: expressionColors[i] }}>
                              f{i + 1}(x)
                            </th>
                            {showDerivatives[i] && (
                              <th className="border border-muted p-2 text-left" style={{ color: expressionColors[i] }}>
                                f{i + 1}&apos;(x)
                              </th>
                            )}
                            {showSecondDerivatives[i] && (
                              <th className="border border-muted p-2 text-left" style={{ color: expressionColors[i] }}>
                                f{i + 1}&apos;&apos;(x)
                              </th>
                            )}
                          </React.Fragment>
                        ))}
                        <th className="border border-muted p-2 text-left w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableXValues.map((x, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                          <td className="border border-muted p-2">
                            <Input
                              type="number"
                              value={x}
                              onChange={(e) => updateTableValue(rowIndex, e.target.value)}
                              className="w-20"
                            />
                          </td>
                          {expressions.map((expr, colIndex) => (
                            <React.Fragment key={colIndex}>
                              <td className="border border-muted p-2" style={{ color: expressionColors[colIndex] }}>
                                {expressionValid[colIndex]
                                  ? evaluateExpression(expr, x)?.toFixed(4) || "undefined"
                                  : "error"}
                              </td>
                              {showDerivatives[colIndex] && (
                                <td className="border border-muted p-2" style={{ color: expressionColors[colIndex] }}>
                                  {expressionValid[colIndex]
                                    ? numericalDerivative(expr, x)?.toFixed(4) || "undefined"
                                    : "error"}
                                </td>
                              )}
                              {showSecondDerivatives[colIndex] && (
                                <td className="border border-muted p-2" style={{ color: expressionColors[colIndex] }}>
                                  {expressionValid[colIndex]
                                    ? secondDerivative(expr, x)?.toFixed(4) || "undefined"
                                    : "error"}
                                </td>
                              )}
                            </React.Fragment>
                          ))}
                          <td className="border border-muted p-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTableValue(rowIndex)}
                              disabled={tableXValues.length <= 1}
                              className="h-6 w-6"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button variant="outline" onClick={addTableValue} disabled={tableXValues.length >= 10} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Row
                </Button>
              </div>
            )}

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
              <h3 className="font-medium mb-2">Function Syntax Guide:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Basic Operations:</p>
                  <ul className="list-disc list-inside">
                    <li>
                      Addition: <code>x + 2</code>
                    </li>
                    <li>
                      Subtraction: <code>x - 2</code>
                    </li>
                    <li>
                      Multiplication: <code>x * 2</code>
                    </li>
                    <li>
                      Division: <code>x / 2</code>
                    </li>
                    <li>
                      Exponentiation: <code>x^2</code> or <code>x**2</code>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Functions:</p>
                  <ul className="list-disc list-inside">
                    <li>
                      Trigonometric: <code>sin(x)</code>, <code>cos(x)</code>, <code>tan(x)</code>
                    </li>
                    <li>
                      Exponential: <code>exp(x)</code> or <code>e^x</code>
                    </li>
                    <li>
                      Logarithm: <code>log(x)</code>
                    </li>
                    <li>
                      Square root: <code>sqrt(x)</code>
                    </li>
                    <li>
                      Absolute value: <code>abs(x)</code>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Link href="/calculus/games/graph-creator">
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                  Try Graph Creator Game <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

