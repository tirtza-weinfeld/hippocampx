"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/calculus/confetti"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"

export function FunctionExplorer() {
  const [functionType, setFunctionType] = useState("linear")
  const [parameter, setParameter] = useState(1)
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const functionTypes = useMemo(() => ({
    linear: {
      name: "Linear",
      formula: "f(<span class='var-x'>x</span>) = <span class='var-a'>m</span><span class='var-x'>x</span>",
      description: "Linear functions grow at a constant rate. They make straight lines.",
      paramName: "<span class='var-a'>m</span> (slope)",
      paramMin: -2,
      paramMax: 2,
      paramStep: 0.1,
      color: "#6366f1", // indigo-500
      calculate: (x: number) => parameter * x,
    },
    quadratic: {
      name: "Quadratic",
      formula: "f(<span class='var-x'>x</span>) = <span class='var-a'>a</span><span class='var-x'>x</span>²",
      description: "Quadratic functions make parabolas. They grow faster and faster as x increases.",
      paramName: "<span class='var-a'>a</span>",
      paramMin: -1,
      paramMax: 1,
      paramStep: 0.1,
      color: "#a855f7", // purple-500
      calculate: (x: number) => parameter * x * x,
    },
    cubic: {
      name: "Cubic",
      formula: "f(<span class='var-x'>x</span>) = <span class='var-a'>a</span><span class='var-x'>x</span>³",
      description: "Cubic functions grow even faster than quadratics. They can make S-shaped curves.",
      paramName: "<span class='var-a'>a</span>",
      paramMin: -0.5,
      paramMax: 0.5,
      paramStep: 0.05,
      color: "#ec4899", // pink-500
      calculate: (x: number) => parameter * x * x * x,
    },
    sine: {
      name: "Sine",
      formula: "f(<span class='var-x'>x</span>) = <span class='var-a'>a</span>·sin(<span class='var-x'>x</span>)",
      description: "Sine functions wiggle up and down forever. They're great for modeling waves.",
      paramName: "<span class='var-a'>a</span> (amplitude)",
      paramMin: -2,
      paramMax: 2,
      paramStep: 0.1,
      color: "#3b82f6", // blue-500
      calculate: (x: number) => parameter * Math.sin(x),
    },
    exponential: {
      name: "Exponential",
      formula: "f(<span class='var-x'>x</span>) = <span class='var-a'>a</span>ˣ",
      description:
        "Exponential functions grow extremely quickly. They're used for compound interest and population growth.",
      paramName: "<span class='var-a'>a</span> (base)",
      paramMin: 0.5,
      paramMax: 2,
      paramStep: 0.1,
      color: "#10b981", // emerald-500
      calculate: (x: number) => Math.pow(parameter, x),
    },
  }), [parameter])

  // Draw the function on the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up coordinate system
    // Origin at center, x from -5 to 5, y from -5 to 5
    const originX = canvas.width / 2
    const originY = canvas.height / 2
    const scale = canvas.width / 10 // 10 units across the canvas

    // Draw axes
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(canvas.width, originY)
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, canvas.height)
    ctx.stroke()

    // Draw grid
    ctx.strokeStyle = "#ddd"
    ctx.lineWidth = 0.5
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue

      // Vertical grid lines
      ctx.beginPath()
      ctx.moveTo(originX + i * scale, 0)
      ctx.lineTo(originX + i * scale, canvas.height)
      ctx.stroke()

      // Horizontal grid lines
      ctx.beginPath()
      ctx.moveTo(0, originY + i * scale)
      ctx.lineTo(canvas.width, originY + i * scale)
      ctx.stroke()
    }

    // Draw function
    ctx.strokeStyle = functionTypes[functionType as keyof typeof functionTypes].color
    ctx.lineWidth = 3
    ctx.beginPath()

    const func = functionTypes[functionType as keyof typeof functionTypes].calculate

    // Start from the left edge
    const startX = -5
    let startY = func(startX)

    // Clamp starting point if it's outside the visible area
    if (startY < -5) startY = -5
    if (startY > 5) startY = 5

    ctx.moveTo(originX + startX * scale, originY - startY * scale)

    // Draw the function point by point
    for (let pixelX = 1; pixelX <= canvas.width; pixelX++) {
      const x = (pixelX - originX) / scale
      let y = func(x)

      // Clamp y to visible area
      if (y < -5) y = -5
      if (y > 5) y = 5

      ctx.lineTo(pixelX, originY - y * scale)
    }

    ctx.stroke()

    // Label axes
    ctx.fillStyle = "#888"
    ctx.font = "12px sans-serif"
    ctx.fillText("x", canvas.width - 10, originY - 5)
    ctx.fillText("y", originX + 5, 10)

    // Label function
    ctx.fillStyle = functionTypes[functionType as keyof typeof functionTypes].color
    ctx.font = "bold 14px sans-serif"
    const formulaText = functionTypes[functionType as keyof typeof functionTypes].formula
      .replace(/<[^>]*>/g, "") // Remove HTML tags for canvas
      .replace("a", parameter.toString())
    ctx.fillText(formulaText, 10, 20)
  }, [functionType, parameter, functionTypes])

  const handleParameterChange = (value: number[]) => {
    setParameter(value[0])
  }

  const handleFunctionChange = (type: string) => {
    setFunctionType(type)
    // Reset parameter to default for the function type
    const funcInfo = functionTypes[type as keyof typeof functionTypes]
    setParameter((funcInfo.paramMin + funcInfo.paramMax) / 2)

    // Show reward for exploring new functions
    // setShowReward(true)
    setShowConfetti(true)
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Function Explorer!",
      content:
        "This interactive tool helps you discover different types of functions and how they behave - a key concept in calculus!",
      emoji: "📊",
    },
    {
      title: "Function Families",
      content:
        "Functions come in different 'families' that behave in unique ways. You can explore linear, quadratic, cubic, sine, and exponential functions.",
      emoji: "👪",
    },
    {
      title: "Parameters",
      content:
        "Each function has parameters that change how it looks. Use the slider to adjust the parameter and watch how the function changes!",
      emoji: "🎛️",
    },
    {
      title: "The Coordinate System",
      content: "The graph shows the x-y coordinate system. The function plots y = f(x) for each value of x.",
      emoji: "🧭",
    },
    {
      title: "Let's Explore!",
      content: "Try switching between different function types and adjusting their parameters to see how they behave!",
      emoji: "🔍",
    },
  ]

  return (
    <section className="py-6 relative">
      <Confetti trigger={showConfetti} count={50} />
      {/* <RewardBadge
        title="Function Explorer"
        description={`You've discovered the ${functionTypes[functionType as keyof typeof functionTypes].name} function family!`}
        icon="star"
        color="indigo"
        show={showReward}
        onClose={() => setShowReward(false)}
      /> */}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="card-fun">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Function Explorer</span>
              <TutorialPopup steps={tutorialSteps} gameName="function-explorer" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              <Tabs defaultValue="linear" value={functionType} onValueChange={handleFunctionChange}>
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="linear">Linear</TabsTrigger>
                  <TabsTrigger value="quadratic">Quadratic</TabsTrigger>
                  <TabsTrigger value="cubic">Cubic</TabsTrigger>
                  <TabsTrigger value="sine">Sine</TabsTrigger>
                  <TabsTrigger value="exponential">Exponential</TabsTrigger>
                </TabsList>
                
                {/* <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-muted">
                  <canvas ref={canvasRef} width={400} height={300} className="w-full h-auto" />
                </div> */}

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
                  <div>
                    <h3
                      className="text-sm font-medium mb-2"
                      dangerouslySetInnerHTML={{
                        __html: `${functionTypes[functionType as keyof typeof functionTypes].paramName}: ${parameter}`,
                      }}
                    />
                    <Slider
                      value={[parameter]}
                      min={functionTypes[functionType as keyof typeof functionTypes].paramMin}
                      max={functionTypes[functionType as keyof typeof functionTypes].paramMax}
                      step={functionTypes[functionType as keyof typeof functionTypes].paramStep}
                      onValueChange={handleParameterChange}
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg border-2 border-muted mt-4">
                  <h3 className="font-medium mb-2">
                    {functionTypes[functionType as keyof typeof functionTypes].name} Functions
                  </h3>
                  <p className="text-sm">{functionTypes[functionType as keyof typeof functionTypes].description}</p>
                  <p
                    className="text-sm mt-2 font-medium math-eq"
                    dangerouslySetInnerHTML={{
                      __html: `Formula: ${functionTypes[functionType as keyof typeof functionTypes].formula.replace("a", parameter.toString())}`,
                    }}
                  />
                </div>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

