"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Sample function
const f = (x: number) => 45 + 20 * Math.sin((x - 40) / 25)
const curvePath = (() => {
  const points: string[] = []
  for (let x = 25; x <= 145; x += 2) points.push(`${x},${f(x)}`)
  return `M${points.join(" L")}`
})()

// Data points
const dataPoints = [
  { x: 35, y: 55 },
  { x: 55, y: 32 },
  { x: 75, y: 48 },
  { x: 95, y: 28 },
  { x: 115, y: 42 },
]

const steps = [
  { showAxes: true, showCurve: false, showPoints: false, showLabel: false, label: "Start with coordinate axes" },
  { showAxes: true, showCurve: true, showPoints: false, showLabel: false, label: "Plot a function as a curve" },
  { showAxes: true, showCurve: true, showPoints: true, showLabel: false, label: "Or plot individual data points" },
  { showAxes: true, showCurve: true, showPoints: true, showLabel: true, label: "A graph shows relationships visually!" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const GraphIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showAxes, showCurve, showPoints, showLabel, label } = steps[step]

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
        <motion.g animate={{ opacity: showAxes ? 1 : 0 }} transition={ease}>
          <line x1="15" y1="85" x2="150" y2="85" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="20" y1="15" x2="20" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <text x="145" y="82" fontSize="8" fill="currentColor" opacity="0.5">x</text>
          <text x="24" y="20" fontSize="8" fill="currentColor" opacity="0.5">y</text>
        </motion.g>

        {/* Function curve */}
        <motion.path
          d={curvePath}
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2"
          fill="none"
          animate={{ opacity: showCurve ? 1 : 0 }}
          transition={ease}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            className="fill-red-500 dark:fill-red-400"
            animate={{ opacity: showPoints ? 1 : 0 }}
            transition={{ ...ease, delay: i * 0.08 }}
          />
        ))}

        {/* Label */}
        <motion.g animate={{ opacity: showLabel ? 1 : 0 }} transition={ease}>
          <rect x="45" y="5" width="70" height="16" rx="3" className="fill-green-500/20 dark:fill-green-400/20" />
          <text x="80" y="16" fontSize="9" textAnchor="middle" className="fill-green-500 dark:fill-green-400" fontWeight="bold">
            Visual Data!
          </text>
        </motion.g>
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
