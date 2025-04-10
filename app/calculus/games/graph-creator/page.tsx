"use client"

import { useState, useRef, useEffect } from "react"
import { PageTransition } from "@/components/calculus/page-transition"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { ArrowRight, Download, Share } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { downloadCanvasAsImage, shareCanvas } from "@/components/calculus/utility/share-utils"

// Custom mathematical expression parser and evaluator
function evaluateExpression(expression: string, x: number): number | undefined {
  try {
    // Handle empty or whitespace-only expressions
    if (!expression || expression.trim() === "") {
      return undefined
    }

    // Sanitize and prepare the expression
    const expr = expression
      .trim()
      // Replace multiple spaces with a single space
      .replace(/\s+/g, " ")
      // Replace constants
      .replace(/\bpi\b/gi, Math.PI.toString())
      .replace(/\be\b/gi, Math.E.toString())

    // Simple tokenizer and parser for mathematical expressions
    const tokens: string[] = []
    let i = 0

    // Tokenize the expression
    while (i < expr.length) {
      // Skip whitespace
      if (expr[i] === " ") {
        i++
        continue
      }

      // Numbers (including decimals)
      if (/[0-9.]/.test(expr[i])) {
        let num = ""
        while (i < expr.length && /[0-9.]/.test(expr[i])) {
          num += expr[i++]
        }
        tokens.push(num)
        continue
      }

      // Variables
      if (/[a-z]/i.test(expr[i])) {
        let name = ""
        while (i < expr.length && /[a-z0-9_]/i.test(expr[i])) {
          name += expr[i++]
        }

        // Handle functions
        if (name === "x") {
          tokens.push(x.toString())
        } else if (name === "sin" && expr[i] === "(") {
          let depth = 1
          let j = i + 1
          while (j < expr.length && depth > 0) {
            if (expr[j] === "(") depth++
            if (expr[j] === ")") depth--
            j++
          }
          const arg = expr.substring(i + 1, j - 1)
          const argValue = evaluateExpression(arg, x)
          if (argValue === undefined) return undefined
          tokens.push(Math.sin(argValue).toString())
          i = j
        } else if (name === "cos" && expr[i] === "(") {
          let depth = 1
          let j = i + 1
          while (j < expr.length && depth > 0) {
            if (expr[j] === "(") depth++
            if (expr[j] === ")") depth--
            j++
          }
          const arg = expr.substring(i + 1, j - 1)
          const argValue = evaluateExpression(arg, x)
          if (argValue === undefined) return undefined
          tokens.push(Math.cos(argValue).toString())
          i = j
        } else if (name === "tan" && expr[i] === "(") {
          let depth = 1
          let j = i + 1
          while (j < expr.length && depth > 0) {
            if (expr[j] === "(") depth++
            if (expr[j] === ")") depth--
            j++
          }
          const arg = expr.substring(i + 1, j - 1)
          const argValue = evaluateExpression(arg, x)
          if (argValue === undefined) return undefined
          tokens.push(Math.tan(argValue).toString())
          i = j
        } else if (name === "sqrt" && expr[i] === "(") {
          let depth = 1
          let j = i + 1
          while (j < expr.length && depth > 0) {
            if (expr[j] === "(") depth++
            if (expr[j] === ")") depth--
            j++
          }
          const arg = expr.substring(i + 1, j - 1)
          const argValue = evaluateExpression(arg, x)
          if (argValue === undefined || argValue < 0) return undefined
          tokens.push(Math.sqrt(argValue).toString())
          i = j
        } else if (name === "abs" && expr[i] === "(") {
          let depth = 1
          let j = i + 1
          while (j < expr.length && depth > 0) {
            if (expr[j] === "(") depth++
            if (expr[j] === ")") depth--
            j++
          }
          const arg = expr.substring(i + 1, j - 1)
          const argValue = evaluateExpression(arg, x)
          if (argValue === undefined) return undefined
          tokens.push(Math.abs(argValue).toString())
          i = j
        } else if (name === "log" && expr[i] === "(") {
          let depth = 1
          let j = i + 1
          while (j < expr.length && depth > 0) {
            if (expr[j] === "(") depth++
            if (expr[j] === ")") depth--
            j++
          }
          const arg = expr.substring(i + 1, j - 1)
          const argValue = evaluateExpression(arg, x)
          if (argValue === undefined || argValue <= 0) return undefined
          tokens.push(Math.log(argValue).toString())
          i = j
        } else if (name === "exp" && expr[i] === "(") {
          let depth = 1
          let j = i + 1
          while (j < expr.length && depth > 0) {
            if (expr[j] === "(") depth++
            if (expr[j] === ")") depth--
            j++
          }
          const arg = expr.substring(i + 1, j - 1)
          const argValue = evaluateExpression(arg, x)
          if (argValue === undefined) return undefined
          tokens.push(Math.exp(argValue).toString())
          i = j
        } else {
          // Unknown function or variable
          return undefined
        }
        continue
      }

      // Operators and parentheses
      if (/[+\-*/$$$$^]/.test(expr[i])) {
        // Handle negative numbers
        if (expr[i] === "-" && (i === 0 || /[+\-*/(^]/.test(expr[i - 1]))) {
          tokens.push("-1")
          tokens.push("*")
        } else {
          tokens.push(expr[i])
        }
        i++
        continue
      }

      // Unknown character
      i++
    }

    // Simple expression evaluator
    function evaluate(tokens: string[]): number {
      if (tokens.length === 0) return 0
      if (tokens.length === 1) return Number.parseFloat(tokens[0])

      // Handle parentheses first
      let i = 0
      while (i < tokens.length) {
        if (tokens[i] === "(") {
          let depth = 1
          let j = i + 1
          while (j < tokens.length && depth > 0) {
            if (tokens[j] === "(") depth++
            if (tokens[j] === ")") depth--
            j++
          }
          const subExpr = tokens.slice(i + 1, j - 1)
          const result = evaluate(subExpr)
          tokens.splice(i, j - i, result.toString())
        }
        i++
      }

      // Handle exponentiation
      i = 1
      while (i < tokens.length - 1) {
        if (tokens[i] === "^") {
          const base = Number.parseFloat(tokens[i - 1])
          const exponent = Number.parseFloat(tokens[i + 1])
          const result = Math.pow(base, exponent)
          tokens.splice(i - 1, 3, result.toString())
          i--
        }
        i++
      }

      // Handle multiplication and division
      i = 1
      while (i < tokens.length - 1) {
        if (tokens[i] === "*") {
          const left = Number.parseFloat(tokens[i - 1])
          const right = Number.parseFloat(tokens[i + 1])
          const result = left * right
          tokens.splice(i - 1, 3, result.toString())
          i--
        } else if (tokens[i] === "/") {
          const left = Number.parseFloat(tokens[i - 1])
          const right = Number.parseFloat(tokens[i + 1])
          if (right === 0) throw new Error("Division by zero")
          const result = left / right
          tokens.splice(i - 1, 3, result.toString())
          i--
        }
        i++
      }

      // Handle addition and subtraction
      i = 1
      while (i < tokens.length - 1) {
        if (tokens[i] === "+") {
          const left = Number.parseFloat(tokens[i - 1])
          const right = Number.parseFloat(tokens[i + 1])
          const result = left + right
          tokens.splice(i - 1, 3, result.toString())
          i--
        } else if (tokens[i] === "-") {
          const left = Number.parseFloat(tokens[i - 1])
          const right = Number.parseFloat(tokens[i + 1])
          const result = left - right
          tokens.splice(i - 1, 3, result.toString())
          i--
        }
        i++
      }

      return Number.parseFloat(tokens[0])
    }

    // Use a simpler approach for common expressions
    if (expr === "x^2") return x * x
    if (expr === "x^3") return x * x * x
    if (expr === "sin(x)") return Math.sin(x)
    if (expr === "cos(x)") return Math.cos(x)
    if (expr === "tan(x)") return Math.tan(x)
    if (expr === "abs(x)") return Math.abs(x)
    if (expr === "sqrt(x)") return x >= 0 ? Math.sqrt(x) : undefined
    if (expr === "log(x)") return x > 0 ? Math.log(x) : undefined
    if (expr === "exp(x)") return Math.exp(x)

    // For more complex expressions, use our parser
    try {
      const result = evaluate(tokens)
      return isNaN(result) || !isFinite(result) ? undefined : result
    } catch (error) {
      console.error("Error in expression evaluation:", error)
      return undefined
    }
  } catch (error) {
    console.error("Error evaluating expression:", error)
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
// function secondDerivative(expression: string, x: number, h = 0.0001): number | undefined {
//   const yPlus = evaluateExpression(expression, x + h)
//   const y = evaluateExpression(expression, x)
//   const yMinus = evaluateExpression(expression, x - h)

//   if (yPlus === undefined || y === undefined || yMinus === undefined) return undefined

//   return (yPlus - 2 * y + yMinus) / (h * h)
// }

export default function GraphCreatorGamePage() {
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<"playing" | "success" | "failure" | "next">("playing")
  const [targetExpression, setTargetExpression] = useState<string>("x^2")
  const [userExpression, setUserExpression] = useState<string>("")
  const [showDerivative, setShowDerivative] = useState<boolean>(false)
  const [expressionValid, setExpressionValid] = useState<boolean>(true)
  const [attempts, setAttempts] = useState<number>(0)
  const [hint, setHint] = useState<string>("")
  const [earnedBadge, setEarnedBadge] = useState<boolean>(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Graph Creator Game!",
      content: "In this game, you'll practice creating mathematical functions to match target graphs.",
      emoji: "📊",
    },
    {
      title: "Your Goal",
      content: "Write a mathematical expression that matches the red target function.",
      emoji: "🎯",
    },
    {
      title: "Function Syntax",
      content: "Use standard notation like x^2, sin(x), sqrt(x). Check the guide below for more examples.",
      emoji: "✏️",
    },
    {
      title: "Derivatives",
      content:
        "Toggle the derivative option to see how your function changes. This can help you match complex functions.",
      emoji: "📈",
    },
    {
      title: "Earn Badges",
      content: "Complete levels to earn badges and improve your calculus skills!",
      emoji: "🏆",
    },
  ]

  // Generate a new level
  const generateLevel = (levelNum: number) => {
    let newTargetExpression = ""
    setHint("")
    setAttempts(0)
    setEarnedBadge(false)

    // Choose target expression based on level
    if (levelNum === 1) {
      newTargetExpression = "x^2"
      setHint("Try a quadratic function")
    } else if (levelNum === 2) {
      newTargetExpression = "x^3/3"
      setHint("Try a cubic function")
    } else if (levelNum === 3) {
      newTargetExpression = "sin(x)"
      setHint("Try a trigonometric function")
    } else if (levelNum === 4) {
      newTargetExpression = "abs(x)"
      setHint("Try the absolute value function")
    } else if (levelNum === 5) {
      newTargetExpression = "sqrt(abs(x))"
      setHint("Try combining square root with another function")
    } else if (levelNum <= 7) {
      // Random polynomial
      const degree = Math.floor(Math.random() * 3) + 2 // 2, 3, or 4
      const coefficients = Array.from({ length: degree + 1 }, () => Math.floor(Math.random() * 5) - 2)
      newTargetExpression = coefficients
        .map((coef, i) => {
          if (coef === 0) return ""
          const power = degree - i
          if (power === 0) return `${coef}`
          if (power === 1) return `${coef}*x`
          return `${coef}*x^${power}`
        })
        .filter(Boolean)
        .join(" + ")
        .replace(/\+ -/g, "- ")
      setHint("Try a polynomial function")
    } else if (levelNum <= 9) {
      // Trigonometric functions
      const functions = ["sin", "cos", "tan"]
      const func = functions[Math.floor(Math.random() * functions.length)]
      const amplitude = Math.floor(Math.random() * 3) + 1
      const frequency = Math.floor(Math.random() * 2) + 1
      const phase = Math.floor(Math.random() * 3)
      newTargetExpression = `${amplitude} * ${func}(${frequency} * x ${phase ? "+ " + phase : ""})`
      setHint("Try a trigonometric function with amplitude and frequency")
    } else {
      // Combinations
      const options = [
        "x^2 * sin(x)",
        "exp(-x^2/4) * cos(x)",
        "sqrt(abs(x)) * sin(x)",
        "log(abs(x) + 1) * cos(x)",
        "sin(x^2)",
        "x * exp(-abs(x)/2)",
      ]
      newTargetExpression = options[Math.floor(Math.random() * options.length)]
      setHint("Try combining different functions")
    }

    setTargetExpression(newTargetExpression)
    setUserExpression("")
    setGameState("playing")
  }

  // Initialize the game
  useEffect(() => {
    generateLevel(level)
  }, [level])

  // Draw the graph
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
    const xMin = -10
    const xMax = 10
    const yMin = -6
    const yMax = 6
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
    const { y: xAxisY } = toCanvasCoords(0, 0)
    ctx.beginPath()
    ctx.moveTo(0, xAxisY)
    ctx.lineTo(width, xAxisY)
    ctx.stroke()

    // y-axis
    const { x: yAxisX } = toCanvasCoords(0, 0)
    ctx.beginPath()
    ctx.moveTo(yAxisX, 0)
    ctx.lineTo(yAxisX, height)
    ctx.stroke()

    // Draw tick marks and labels
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748B" // slate-500

    // x-axis ticks
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if (x === 0) continue // Skip origin
      const { x: tickX } = toCanvasCoords(x, 0)
      ctx.beginPath()
      ctx.moveTo(tickX, xAxisY - 5)
      ctx.lineTo(tickX, xAxisY + 5)
      ctx.stroke()
      ctx.fillText(x.toString(), tickX, xAxisY + 15)
    }

    // y-axis ticks
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      if (y === 0) continue // Skip origin
      const { y: tickY } = toCanvasCoords(0, y)
      ctx.beginPath()
      ctx.moveTo(yAxisX - 5, tickY)
      ctx.lineTo(yAxisX + 5, tickY)
      ctx.stroke()
      ctx.fillText(y.toString(), yAxisX - 15, tickY)
    }

    // Origin label
    ctx.fillText("0", yAxisX - 10, xAxisY + 15)

    // Draw the target function (red)
    ctx.strokeStyle = "#EF4444" // red-500
    ctx.lineWidth = 3
    ctx.beginPath()

    let firstPoint = true
    let lastY: number | undefined

    for (let i = 0; i <= width; i++) {
      const x = xMin + (i / width) * xRange
      const y = evaluateExpression(targetExpression, x)

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

    // Draw the user's function (blue) if valid
    if (userExpression && expressionValid) {
      ctx.strokeStyle = "#3B82F6" // blue-500
      ctx.lineWidth = 3
      ctx.beginPath()

      firstPoint = true
      lastY = undefined

      for (let i = 0; i <= width; i++) {
        const x = xMin + (i / width) * xRange
        const y = evaluateExpression(userExpression, x)

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

      // Draw the derivative if enabled
      if (showDerivative) {
        ctx.strokeStyle = "#10B981" // emerald-500
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5]) // Dashed line
        ctx.beginPath()

        firstPoint = true
        lastY = undefined

        for (let i = 0; i <= width; i++) {
          const x = xMin + (i / width) * xRange
          const y = numericalDerivative(userExpression, x)

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
    }

    // Add legend
    ctx.font = "14px sans-serif"

    // Target function
    ctx.fillStyle = "#EF4444" // red-500
    ctx.fillText("Target Function", width - 100, 30)

    // User function
    if (userExpression && expressionValid) {
      ctx.fillStyle = "#3B82F6" // blue-500
      ctx.fillText("Your Function", width - 100, 60)

      // Derivative
      if (showDerivative) {
        ctx.fillStyle = "#10B981" // emerald-500
        ctx.fillText("Derivative", width - 100, 90)
      }
    }
  }, [targetExpression, userExpression, showDerivative, expressionValid])

  // Update user expression
  const updateUserExpression = (value: string) => {
    setUserExpression(value)

    // Always consider empty input as valid
    if (value.trim() === "") {
      setExpressionValid(true)
      return
    }

    // For common expressions, we know they're valid
    const commonExpressions = [
      "x^2",
      "x^3",
      "x^4",
      "sin(x)",
      "cos(x)",
      "tan(x)",
      "abs(x)",
      "sqrt(x)",
      "log(x)",
      "exp(x)",
      "x",
      "2*x",
      "x/2",
      "1/x",
    ]

    if (commonExpressions.includes(value.trim())) {
      setExpressionValid(true)
      return
    }

    // Test the expression at a few points
    let validPoints = 0
    const testPoints = [-1, 0, 1]

    for (const point of testPoints) {
      try {
        const result = evaluateExpression(value, point)
        if (result !== undefined) {
          validPoints++
        }
      } catch (e) {
        console.error("Error evaluating expression:", e)
        // Ignore errors during testing
      }
    }

    // If it works for at least one point, consider it valid
    setExpressionValid(validPoints > 0)
  }

  // Check if the user's function matches the target
  const checkMatch = () => {
    if (!expressionValid) {
      setGameState("failure")
      setAttempts(attempts + 1)
      return
    }

    // Check if the functions match at multiple points
    const numPoints = 20
    const xMin = -5
    const xMax = 5
    const xStep = (xMax - xMin) / numPoints
    let matches = 0
    let totalPoints = 0

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * xStep
      const targetY = evaluateExpression(targetExpression, x)
      const userY = evaluateExpression(userExpression, x)

      if (targetY === undefined || userY === undefined || isNaN(targetY) || isNaN(userY)) {
        continue
      }

      totalPoints++
      if (Math.abs(targetY - userY) < 0.2) {
        matches++
      }
    }

    const matchPercentage = totalPoints > 0 ? (matches / totalPoints) * 100 : 0

    if (matchPercentage >= 90) {
      // Success!
      const levelPoints = Math.max(10, 50 - attempts * 10) // Fewer points for more attempts
      setScore(score + levelPoints)
      setGameState("success")

      // Award badge for completing level 5 or 10
      if ((level === 5 || level === 10) && !earnedBadge) {
        setEarnedBadge(true)
      }

      setTimeout(() => {
        setGameState("next")
      }, 2000)
    } else {
      // Failure
      setGameState("failure")
      setAttempts(attempts + 1)

      // Give more specific hints after multiple attempts
      if (attempts === 1) {
        setHint(`Try a different function type. Your match was ${matchPercentage.toFixed(0)}%`)
      } else if (attempts === 2) {
        setHint(`Look at the shape of the curve. Your match was ${matchPercentage.toFixed(0)}%`)
      } else if (attempts >= 3) {
        // Give a more specific hint
        if (targetExpression.includes("sin") || targetExpression.includes("cos")) {
          setHint("Try using a trigonometric function like sin(x) or cos(x)")
        } else if (targetExpression.includes("^")) {
          const match = targetExpression.match(/\^(\d+)/)
          if (match) {
            setHint(`Try a polynomial of degree ${match[1]}`)
          } else {
            setHint("Try a polynomial function")
          }
        } else if (targetExpression.includes("sqrt")) {
          setHint("Try using the square root function: sqrt(x)")
        } else if (targetExpression.includes("abs")) {
          setHint("Try using the absolute value function: abs(x)")
        } else if (targetExpression.includes("exp")) {
          setHint("Try using the exponential function: exp(x)")
        } else {
          setHint(`The target function is: ${targetExpression}`)
        }
      }
    }
  }

  // Go to the next level
  const nextLevel = () => {
    setLevel(level + 1)
  }

  // Download the graph as an image
  const handleDownload = () => {
    try {
      downloadCanvasAsImage(canvasRef.current, `graph-creator-level-${level}.png`)
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
        title: "Graph Creator - CalKids",
        text: `I reached level ${level} with a score of ${score} in Graph Creator! #CalKids #MathGames`,
        filename: `graph-creator-level-${level}.png`,
      })
    } catch (error) {
      console.error("Error sharing graph:", error)
      alert("Failed to share the graph. The content has been copied to your clipboard instead.")
    }
  }

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:py-12">

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-4 items-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-transparent bg-clip-text">
                Graph Creator Challenge
              </h1>
              <TutorialPopup steps={tutorialSteps} gameName="graph-creator" className="bg-background/50" />
            </div>

            <p className="mt-4 text-xl text-muted-foreground">
              Create mathematical functions to match the target graphs and master calculus concepts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="border-2 bg-background/60 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Level {level}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={handleDownload}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleShare}>
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Create a function that matches the red target curve</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {/* <div className="flex justify-center">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={400}
                      className="border border-muted rounded-lg bg-white dark:bg-gray-900"
                    />
                  </div> */}

                  <div className="flex justify-center">
                    <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-muted">
                      <canvas ref={canvasRef} width={600} height={400} className=" @xs:w-full @lg:w-auto" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-lg font-semibold">Score: {score}</div>
                  {gameState === "playing" && (
                    <Button onClick={checkMatch} className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                      Check Match
                    </Button>
                  )}
                  {gameState === "success" && (
                    <Button disabled className="bg-green-600 text-white">
                      Correct!
                    </Button>
                  )}
                  {gameState === "failure" && (
                    <Button onClick={() => setGameState("playing")} className="bg-red-600 text-white">
                      Try Again
                    </Button>
                  )}
                  {gameState === "next" && (
                    <Button onClick={nextLevel} className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                      Next Level <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-2 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Your Function</CardTitle>
                  <CardDescription>Write a mathematical expression</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="function">f(x) =</Label>
                    <Input
                      id="function"
                      value={userExpression}
                      onChange={(e) => updateUserExpression(e.target.value)}
                      placeholder="e.g., x^2, sin(x), sqrt(x)"
                      className={!expressionValid && userExpression ? "border-red-500" : ""}
                    />
                    {!expressionValid && userExpression && (
                      <p className="text-xs text-red-500">
                        Invalid expression. Try using simpler functions or check the examples below.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-derivative"
                      checked={showDerivative}
                      onCheckedChange={() => setShowDerivative(!showDerivative)}
                    />
                    <Label htmlFor="show-derivative">Show derivative f&apos; (x)</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Quick Examples:</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => updateUserExpression("x^2")}>
                        x²
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateUserExpression("sin(x)")}>
                        sin(x)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateUserExpression("x^3")}>
                        x³
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateUserExpression("abs(x)")}>
                        |x|
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateUserExpression("sqrt(x)")}>
                        √x
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateUserExpression("2*x")}>
                        2x
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateUserExpression("cos(x)")}>
                        cos(x)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateUserExpression("x^2 + 1")}>
                        x² + 1
                      </Button>
                    </div>
                  </div>

                  {hint && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800 text-sm">
                      <strong>Hint:</strong> {hint}
                    </div>
                  )}

                  {/* {earnedBadge && (
                    <div className="flex justify-center">
                      <RewardBadge
                        title={level === 5 ? "Function Master" : "Calculus Wizard"}
                        description={
                          level === 5 ? "Completed 5 levels of Graph Creator" : "Completed 10 levels of Graph Creator"
                        }
                        icon={level === 5 ? "📊" : "🧙‍♂️"}
                      />
                    </div>
                  )} */}
                </CardContent>
              </Card>

              <Card className="border-2 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Function Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">Basic Operations</h4>
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
                        Exponentiation: <code>x^2</code>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Functions</h4>
                    <ul className="list-disc list-inside">
                      <li>
                        Trigonometric: <code>sin(x)</code>, <code>cos(x)</code>
                      </li>
                      <li>
                        Square root: <code>sqrt(x)</code>
                      </li>
                      <li>
                        Absolute value: <code>abs(x)</code>
                      </li>
                      <li>
                        Exponential: <code>exp(x)</code>
                      </li>
                      <li>
                        Logarithm: <code>log(x)</code>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Constants</h4>
                    <ul className="list-disc list-inside">
                      <li>
                        Pi: <code>pi</code>
                      </li>
                      <li>
                        Euler&apos;s number: <code>e</code>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/lab/graph-creator" className="w-full">
                    <Button variant="outline" className="w-full">
                      Try Free Graph Creator <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

