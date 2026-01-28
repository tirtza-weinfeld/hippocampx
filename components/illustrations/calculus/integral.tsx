"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Curve function: y = 55 - 20*sin((x-30)/25)
const f = (x: number) => 55 - 20 * Math.sin((x - 30) / 25)

// Generate smooth curve path
const curvePath = (() => {
  const points: string[] = []
  for (let x = 25; x <= 130; x += 2) points.push(`${x},${f(x)}`)
  return `M${points.join(" L")}`
})()

// Rectangle x positions for Riemann sum visualization
const rectPositions = [30, 45, 60, 75, 90, 105]
const rectWidth = 12

// Teaching steps - progressive reveal
const steps = [
  { showRects: 0, showArea: false, showSymbol: false, label: "Start with a curve f(x)" },
  { showRects: 1, showArea: false, showSymbol: false, label: "Approximate area with a rectangle" },
  { showRects: 3, showArea: false, showSymbol: false, label: "Add more rectangles for better fit" },
  { showRects: 6, showArea: false, showSymbol: false, label: "More rectangles = closer approximation" },
  { showRects: 6, showArea: true, showSymbol: false, label: "Limit of infinite rectangles = exact area" },
  { showRects: 0, showArea: true, showSymbol: true, label: "∫ f(x) dx = Area under curve" },
]

// Generate area path from function
const areaPath = (() => {
  const points: string[] = []
  for (let x = 30; x <= 117; x += 2) points.push(`${x},${f(x)}`)
  return `M30,90 L${points.join(" L")} L117,90 Z`
})()

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const IntegralIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showRects, showArea, showSymbol, label } = steps[step]

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        width="160"
        height="105"
        viewBox="0 0 160 105"
        overflow="hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Axes */}
        <line x1="10" y1="90" x2="145" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="8" x2="20" y2="92" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Area under curve - shown in later steps */}
        <motion.path
          d={areaPath}
          className="fill-green-500 dark:fill-green-400"
          animate={{ opacity: showArea ? 0.3 : 0 }}
          transition={ease}
        />

        {/* Riemann sum rectangles */}
        {rectPositions.map((x, i) => {
          const height = 90 - f(x + rectWidth / 2)
          return (
            <motion.rect
              key={i}
              x={x}
              y={f(x + rectWidth / 2)}
              width={rectWidth}
              height={height}
              className="fill-blue-500 dark:fill-blue-400"
              animate={{ opacity: i < showRects ? 0.4 : 0 }}
              transition={ease}
            />
          )
        })}

        {/* Curve */}
        <path d={curvePath} stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />

        {/* Bounds markers a and b */}
        <motion.g animate={{ opacity: showArea || showRects > 0 ? 1 : 0 }} transition={ease}>
          <line x1="30" y1="88" x2="30" y2="92" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <text x="30" y="100" fontSize="8" textAnchor="middle" fill="currentColor" opacity="0.7">a</text>
          <line x1="117" y1="88" x2="117" y2="92" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <text x="117" y="100" fontSize="8" textAnchor="middle" fill="currentColor" opacity="0.7">b</text>
        </motion.g>

        {/* Integral symbol and notation */}
        <motion.g animate={{ opacity: showSymbol ? 1 : 0 }} transition={ease}>
          <text
            x="135"
            y="35"
            fontSize="20"
            className="fill-red-500 dark:fill-red-400"
            fontWeight="bold"
          >
            ∫
          </text>
          <text
            x="127"
            y="50"
            fontSize="6"
            className="fill-red-500 dark:fill-red-400"
          >
            a
          </text>
          <text
            x="127"
            y="22"
            fontSize="6"
            className="fill-red-500 dark:fill-red-400"
          >
            b
          </text>
        </motion.g>

        {/* Legend */}
        <g fontSize="5" opacity="0.8">
          <rect x="125" y="58" width="8" height="6" className="fill-blue-500 dark:fill-blue-400" opacity="0.4" />
          <text x="135" y="63" fill="currentColor">rectangles</text>
          <rect x="125" y="68" width="8" height="6" className="fill-green-500 dark:fill-green-400" opacity="0.3" />
          <text x="135" y="73" fill="currentColor">exact area</text>
        </g>
      </motion.svg>

      <p className="text-xs text-center text-current/80 h-4">{label}</p>

      <IllustrationControls
        step={step}
        totalSteps={steps.length}
        playing={playing}
        onStep={setStep}
        onPlayingChange={setPlaying}
      />
    </div>
  )
}
