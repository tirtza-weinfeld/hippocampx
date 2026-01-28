"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Parabola opening down: f(x) = -0.015(x-80)^2 + 30
const f = (x: number) => -0.015 * (x - 80) ** 2 + 30
const maxX = 80
const maxY = f(maxX)

const curvePath = (() => {
  const points: string[] = []
  for (let x = 20; x <= 140; x += 2) points.push(`${x},${90 - f(x)}`)
  return `M${points.join(" L")}`
})()

const steps = [
  { showCurve: true, showMax: false, showTangent: false, showTarget: false, showFormula: false, label: "A function we want to optimize" },
  { showCurve: true, showMax: true, showTangent: false, showTarget: false, showFormula: false, label: "Find the highest point (maximum)" },
  { showCurve: true, showMax: true, showTangent: true, showTarget: false, showFormula: false, label: "At the max, the tangent is horizontal" },
  { showCurve: true, showMax: true, showTangent: true, showTarget: true, showFormula: false, label: "This is our optimal solution!" },
  { showCurve: true, showMax: true, showTangent: true, showTarget: true, showFormula: true, label: "f'(x) = 0 finds the extrema" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const OptimizationIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showCurve, showMax, showTangent, showTarget, showFormula, label } = steps[step]
  const pointY = 90 - maxY

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
        <line x1="15" y1="90" x2="150" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="15" x2="20" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Function curve */}
        <motion.path
          d={curvePath}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
          animate={{ opacity: showCurve ? 0.7 : 0 }}
          transition={ease}
        />

        {/* Tangent line at maximum (horizontal) */}
        <motion.line
          x1={maxX - 35}
          y1={pointY}
          x2={maxX + 35}
          y2={pointY}
          className="stroke-red-500 dark:stroke-red-400"
          strokeWidth="2"
          strokeDasharray="4,2"
          animate={{ opacity: showTangent ? 1 : 0 }}
          transition={ease}
        />

        {/* Target rings around maximum */}
        <motion.circle
          cx={maxX}
          cy={pointY}
          r="10"
          fill="none"
          className="stroke-sky-500 dark:stroke-sky-400"
          strokeWidth="1"
          animate={{ opacity: showTarget ? 0.6 : 0, scale: showTarget ? 1 : 0.5 }}
          transition={ease}
        />
        <motion.circle
          cx={maxX}
          cy={pointY}
          r="16"
          fill="none"
          className="stroke-sky-500 dark:stroke-sky-400"
          strokeWidth="1"
          animate={{ opacity: showTarget ? 0.3 : 0, scale: showTarget ? 1 : 0.5 }}
          transition={ease}
        />

        {/* Maximum point */}
        <motion.circle
          cx={maxX}
          cy={pointY}
          r="5"
          className="fill-blue-500 dark:fill-blue-400"
          animate={{ opacity: showMax ? 1 : 0 }}
          transition={ease}
        />

        {/* Formula */}
        <motion.g animate={{ opacity: showFormula ? 1 : 0 }} transition={ease}>
          <rect x="90" y="70" width="55" height="18" rx="3" className="fill-red-500/20 dark:fill-red-400/20" />
          <text x="117" y="83" fontSize="10" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontWeight="bold">
            f'(x) = 0
          </text>
        </motion.g>

        {/* Max label */}
        <motion.text
          x={maxX + 8}
          y={pointY - 8}
          fontSize="9"
          className="fill-blue-500 dark:fill-blue-400"
          fontWeight="bold"
          animate={{ opacity: showMax ? 1 : 0 }}
          transition={ease}
        >
          max
        </motion.text>
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
