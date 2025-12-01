"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TutorialPopup } from "@/components/old/calculus/tutorial-popup"
import { ArrowRight, Download, Share, Plus, RefreshCw, X } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import { downloadCanvasAsImage, shareCanvas } from "@/components/old/calculus/utility/share-utils"

// Function parser and evaluator - MORE ROBUST VERSION
function evaluateExpression(expression: string, x: number): number | undefined {
  if (!expression || expression.trim() === "") {
    return undefined
  }

  // Check for obviously incomplete expressions
  if (
    /[+\-*/^]$/.test(expression) ||
    /\($/.test(expression) ||
    /sin\($|cos\($|tan\($|log\($|sqrt\($|abs\($/.test(expression)
  ) {
    return undefined
  }

  try {
    // Safe evaluation using Function constructor
    // First, sanitize the expression
    const sanitizedExpression = expression
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan")
      .replace(/exp/g, "Math.exp")
      .replace(/log/g, "Math.log")
      .replace(/sqrt/g, "Math.sqrt")
      .replace(/abs/g, "Math.abs")
      .replace(/\^/g, "**")
      .replace(/pi/g, "Math.PI")
      .replace(/e(?![a-zA-Z])/g, "Math.E") // Replace e but not exp or other words starting with e

    // Wrap in a try-catch before even creating the function
    let func
    try {
      // Test if the expression is valid JavaScript syntax
      // This will throw if there's a syntax error
      new Function(`return ${sanitizedExpression};`)

      // If we get here, the syntax is valid, so create the actual function
      func = new Function(
        "x",
        `
        try {
          return ${sanitizedExpression};
        } catch (e) {
          return undefined;
        }
      `,
      )
    } catch (syntaxError) {
      // Syntax error in the expression
      console.log("Syntax error in expression:", syntaxError)
      return undefined
    }

    // Now safely execute the function
    try {
      const result = func(x)

      // Check if result is valid
      if (result === undefined || result === null || isNaN(result) || !isFinite(result)) {
        return undefined
      }

      return result
    } catch (runtimeError) {
      console.log("Runtime error evaluating expression:", runtimeError)
      return undefined
    }
  } catch (error) {
    console.log("Error in expression evaluation:", error)
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

const tutorialSteps = [
  {
    title: "Welcome to the Function Graph Creator!",
    target: ".function-graph-creator",
    content:
      "Welcome to the Function Graph Creator! This tool allows you to visualize mathematical functions and explore their properties.",
  },
  {
    title: "Function Input",
    target: ".function-input",
    content: "Enter your mathematical functions here. You can add multiple functions to compare them.",
  },
  {
    title: "Graph View",
    target: ".graph-view",
    content: "This is the graph view where your functions are plotted. Adjust the X and Y ranges to zoom in and out.",
  },
  {
    title: "Table View",
    target: ".table-view",
    content: "Switch to the table view to see the numerical values of your functions at different points.",
  },
  {
    title: "Derivative Checkboxes",
    target: ".derivative-checkbox",
    content: "Check these boxes to display the first and second derivatives of your functions.",
  },
  {
    title: "Add Function Button",
    target: ".add-function-button",
    content: "Add more functions to the graph to compare and analyze them.",
  },
  {
    title: "Reset View Button",
    target: ".reset-view-button",
    content: "Reset the graph view to the default X and Y ranges.",
  },
  {
    title: "Download and Share",
    target: ".download-share-buttons",
    content: "Download the graph as an image or share it with others.",
  },
  {
    title: "Function Syntax Guide",
    target: ".function-syntax-guide",
    content: "Refer to this guide for the correct syntax when entering your functions.",
  },
]

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
  const [errorMessages, setErrorMessages] = useState<string[]>(["", ""])

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
    setErrorMessages([...errorMessages, ""])
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

    const newErrorMessages = [...errorMessages]
    newErrorMessages.splice(index, 1)
    setErrorMessages(newErrorMessages)
  }

  // Update an expression
  const updateExpression = (index: number, value: string) => {
    const newExpressions = [...expressions]
    newExpressions[index] = value
    setExpressions(newExpressions)

    // Check if expression is valid, but be more tolerant during typing
    try {
      // Empty expression is valid (just won't display)
      if (!value.trim()) {
        const newExpressionValid = [...expressionValid]
        newExpressionValid[index] = true
        setExpressionValid(newExpressionValid)

        const newErrorMessages = [...errorMessages]
        newErrorMessages[index] = ""
        setErrorMessages(newErrorMessages)
        return
      }

      // Don't validate incomplete expressions that might be in the middle of typing
      // Common incomplete patterns that should be allowed during typing
      const incompletePatterns = [
        /sin\(?$/,
        /cos\(?$/,
        /tan\(?$/,
        /log\(?$/,
        /sqrt\(?$/,
        /abs\(?$/,
        /\($/,
        /\^$/,
        /\*$/,
        /\+$/,
        /-$/,
        /\/$/,
        /\*\*$/,
      ]

      if (incompletePatterns.some((pattern) => pattern.test(value))) {
        // This looks like an incomplete expression, don't mark as invalid yet
        return
      }

      // Test the expression at a few points
      const testPoints = [-1, 0, 1]
      let isValid = false
      let errorMsg = ""

      for (const point of testPoints) {
        try {
          const result = evaluateExpression(value, point)
          if (result !== undefined) {
            isValid = true
            break
          }
        } catch (error) {
          // Just store the error but don't immediately invalidate
          errorMsg = error instanceof Error ? error.message : "Invalid expression"
        }
      }

      const newExpressionValid = [...expressionValid]
      newExpressionValid[index] = isValid
      setExpressionValid(newExpressionValid)

      // Only show error message if the expression is clearly invalid
      // and not just incomplete
      const newErrorMessages = [...errorMessages]
      newErrorMessages[index] = isValid ? "" : errorMsg || "Invalid expression. Please check your syntax."
      setErrorMessages(newErrorMessages)
    } catch (error) {
      // Don't immediately mark as invalid during typing
      // Only update error state if it's a complete expression
      if (value.includes("(") && !value.includes(")")) {
        // Likely incomplete parentheses, don't mark as invalid yet
        return
      }

      const newExpressionValid = [...expressionValid]
      newExpressionValid[index] = false
      setExpressionValid(newExpressionValid)

      const newErrorMessages = [...errorMessages]
      newErrorMessages[index] = error instanceof Error ? error.message : "Invalid expression"
      setErrorMessages(newErrorMessages)
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
    } catch (error) {
      console.error("Error downloading graph:", error)
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
    } catch (error) {
      console.error("Error sharing graph:", error)
      alert("Failed to share the graph. The content has been copied to your clipboard instead.")
    }
  }

  return (
    <div className="@container px-4 py-8 @md:py-12">

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-4 items-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl @md:text-5xl bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-transparent bg-clip-text">
              Graph Creator Challenge
            </h1>
            <TutorialPopup steps={tutorialSteps} gameName="graph-creator" className="bg-amber-500/10 text-amber-500 border-amber-600/20" />
          </div>
          <p className="mt-4 text-xl text-muted-foreground">
            Create mathematical functions to match the target graphs and master calculus concepts
          </p>
        </div>

        <Card className="border-2 function-graph-creator bg-background/60 backdrop-blur-sm">
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
                          onChange={(e) => {
                            // Just update the expression state without any validation
                            const newExpressions = [...expressions]
                            newExpressions[index] = e.target.value
                            setExpressions(newExpressions)

                            // Clear any previous error for a better user experience while typing
                            const newExpressionValid = [...expressionValid]
                            newExpressionValid[index] = true
                            setExpressionValid(newExpressionValid)

                            const newErrorMessages = [...errorMessages]
                            newErrorMessages[index] = ""
                            setErrorMessages(newErrorMessages)
                          }}
                          // Add onBlur to validate only when the user is done typing
                          onBlur={() => {
                            // Only validate when the user leaves the input field
                            setTimeout(() => updateExpression(index, expressions[index]), 100)
                          }}
                          className={`function-input ${!expressionValid[index] ? "border-red-500" : ""}`}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`derivative-${index}`}
                          checked={showDerivatives[index]}
                          onCheckedChange={() => toggleDerivative(index)}
                          className="derivative-checkbox"
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

              <Button
                variant="outline"
                onClick={addExpression}
                disabled={expressions.length >= 8}
                className="mt-2 add-function-button"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Function
              </Button>
            </div>

            {/* Graph view */}
            {viewMode === "graph" && (
              <div className="space-y-4 graph-view">
          
                
                <div className="flex justify-center">
                  <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-muted">
                    <canvas ref={canvasRef} width={600} height={400} className=" @xs:w-full @lg:w-auto" />
                  </div>
                </div>

                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
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
                        onChange={(e) => {
                          const val = Number.parseFloat(e.target.value)
                          if (!isNaN(val)) setXMin(val)
                        }}
                        className="w-20"
                      />
                      <span className="self-center">to</span>
                      <Input
                        type="number"
                        value={xMax}
                        onChange={(e) => {
                          const val = Number.parseFloat(e.target.value)
                          if (!isNaN(val)) setXMax(val)
                        }}
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
                        onChange={(e) => {
                          const val = Number.parseFloat(e.target.value)
                          if (!isNaN(val)) setYMin(val)
                        }}
                        className="w-20"
                      />
                      <span className="self-center">to</span>
                      <Input
                        type="number"
                        value={yMax}
                        onChange={(e) => {
                          const val = Number.parseFloat(e.target.value)
                          if (!isNaN(val)) setYMax(val)
                        }}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetView} className="reset-view-button">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset View
                  </Button>

                  <div className="flex gap-2 download-share-buttons">
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
              <div className="space-y-4 table-view">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-muted p-2 text-left">x</th>
                        {expressions.map((_, i) => (
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

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800 function-syntax-guide">
              <h3 className="font-medium mb-2">Function Syntax Guide:</h3>
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-4 text-sm">
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
                      Trigonometric: <code>sin(x)</code>, <code>cos(x)</code>
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
              <div className="flex justify-center gap-4 mt-4 @md:flex-row flex flex-col">
                <Link href="/old/calculus/lab/function-laboratory">
                  <Button variant="outline">
                    Try Function Laboratory <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/old/calculus/games/graph-creator">
                  <Button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                    Play Graph Creator Game <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
