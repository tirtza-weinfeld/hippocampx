"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eraser, Sparkles, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import type { PredictionOutput } from "@/lib/neural-network/types"

interface DigitCanvasProps {
  onPredict?: (pixels: number[]) => Promise<PredictionOutput>
  className?: string
}

interface Point {
  x: number
  y: number
}

export default function DigitCanvas({ onPredict, className }: DigitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isPredicting, setIsPredicting] = useState(false)
  const [prediction, setPrediction] = useState<PredictionOutput | null>(null)
  const [hasDrawing, setHasDrawing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const CANVAS_SIZE = 280 // Display size
  const MODEL_SIZE = 28 // MNIST model input size

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = CANVAS_SIZE
    canvas.height = CANVAS_SIZE

    // Set white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Set drawing style
    ctx.strokeStyle = "black"
    ctx.lineWidth = 15
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  // Get point from event (works for mouse and touch)
  const getPoint = useCallback((event: MouseEvent | TouchEvent): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in event && event.touches.length > 0) {
      const touch = event.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    }

    if ("clientX" in event) {
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      }
    }

    return null
  }, [])

  // Start drawing
  const startDrawing = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault()
      const point = getPoint(event)
      if (!point) return

      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!ctx) return

      setIsDrawing(true)
      setHasDrawing(true)
      setPrediction(null)

      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
    },
    [getPoint]
  )

  // Draw
  const draw = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isDrawing) return
      event.preventDefault()

      const point = getPoint(event)
      if (!point) return

      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!ctx) return

      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    },
    [isDrawing, getPoint]
  )

  // Stop drawing
  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  // Add event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Mouse events
    canvas.addEventListener("mousedown", startDrawing as EventListener)
    canvas.addEventListener("mousemove", draw as EventListener)
    canvas.addEventListener("mouseup", stopDrawing)
    canvas.addEventListener("mouseleave", stopDrawing)

    // Touch events
    canvas.addEventListener("touchstart", startDrawing as EventListener)
    canvas.addEventListener("touchmove", draw as EventListener)
    canvas.addEventListener("touchend", stopDrawing)

    return () => {
      canvas.removeEventListener("mousedown", startDrawing as EventListener)
      canvas.removeEventListener("mousemove", draw as EventListener)
      canvas.removeEventListener("mouseup", stopDrawing)
      canvas.removeEventListener("mouseleave", stopDrawing)
      canvas.removeEventListener("touchstart", startDrawing as EventListener)
      canvas.removeEventListener("touchmove", draw as EventListener)
      canvas.removeEventListener("touchend", stopDrawing)
    }
  }, [startDrawing, draw, stopDrawing])

  // Clear canvas
  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasDrawing(false)
    setPrediction(null)
    setError(null)
  }

  // Convert canvas to 28x28 grayscale pixel array
  function canvasToPixels(): number[] {
    const canvas = canvasRef.current
    if (!canvas) return []

    const ctx = canvas.getContext("2d")
    if (!ctx) return []

    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    const data = imageData.data

    // Create temporary canvas for downscaling
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = MODEL_SIZE
    tempCanvas.height = MODEL_SIZE
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return []

    // Draw downscaled image
    tempCtx.drawImage(canvas, 0, 0, MODEL_SIZE, MODEL_SIZE)
    const scaledData = tempCtx.getImageData(0, 0, MODEL_SIZE, MODEL_SIZE).data

    // Convert to grayscale values (0-1, where 0 is white and 1 is black)
    const pixels: number[] = []
    for (let i = 0; i < scaledData.length; i += 4) {
      // Get RGB values (they should all be the same for grayscale)
      const r = scaledData[i]
      const g = scaledData[i + 1]
      const b = scaledData[i + 2]

      // Convert to grayscale (average of RGB)
      const gray = (r + g + b) / 3

      // Normalize to 0-1 and invert (MNIST expects 0 for background, 1 for digit)
      const normalized = 1 - gray / 255

      pixels.push(normalized)
    }

    return pixels
  }

  // Handle predict button click
  async function handlePredict() {
    if (!onPredict || !hasDrawing) return

    setIsPredicting(true)
    setError(null)

    try {
      const pixels = canvasToPixels()
      if (pixels.length !== 784) {
        const errorMsg = `Invalid pixel array length: ${pixels.length}`
        console.error(errorMsg)
        setError(errorMsg)
        return
      }

      const result = await onPredict(pixels)
      setPrediction(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to predict digit"
      console.error("Prediction error:", err)
      setError(errorMessage)
    } finally {
      setIsPredicting(false)
    }
  }

  return (
    <div className={className}>
      <Card className="p-6 dark:bg-slate-800">
        <h3 className="text-2xl font-semibold gradient-text gradient-blue-purple mb-4 flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-blue-500" />
          Draw a Digit
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Draw a digit (0-9) in the box below using your mouse, finger, or Apple Pencil
        </p>

        <div className="flex flex-col items-center gap-4">
          {/* Canvas */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="border-4 border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden shadow-lg"
          >
            <canvas
              ref={canvasRef}
              className="cursor-crosshair touch-none bg-white"
              style={{
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
              }}
            />
          </motion.div>

          {/* Buttons */}
          <div className="flex gap-3 w-full max-w-md">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                onClick={clearCanvas}
                variant="outline"
                className="w-full"
                disabled={!hasDrawing || isPredicting}
                aria-label="Clear canvas"
              >
                <Eraser className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                onClick={handlePredict}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={!hasDrawing || isPredicting}
                aria-label="Predict digit"
              >
                {isPredicting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Predict
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Error Display */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md"
              >
                <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    <strong>Error:</strong> {error}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prediction Results */}
          <AnimatePresence mode="wait">
            {prediction && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md"
              >
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
                  <div className="text-center">
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">I think this is a:</p>
                    <motion.p
                      className="text-6xl font-bold gradient-text gradient-blue-purple mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      {prediction.predicted_digit}
                    </motion.p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </p>

                    {/* Probability bars */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                        All Predictions:
                      </p>
                      {prediction.probabilities.map((prob, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm font-medium w-4 text-gray-700 dark:text-gray-300">
                            {idx}
                          </span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${prob * 100}%` }}
                              transition={{ duration: 0.5, delay: idx * 0.05 }}
                              className={`h-full ${
                                idx === prediction.predicted_digit
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                  : "bg-gray-400 dark:bg-gray-600"
                              }`}
                            />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 w-12 text-right">
                            {(prob * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}
