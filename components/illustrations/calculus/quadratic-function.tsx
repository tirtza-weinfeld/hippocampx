"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Parabola: y = 0.015(x-80)^2 + 25 (opening upward, vertex at bottom)
const f = (x: number) => 0.015 * (x - 80) ** 2 + 25
const vertexX = 80
const vertexY = f(vertexX)

const curvePath = (() => {
  const points: string[] = []
  for (let x = 25; x <= 135; x += 2) points.push(`${x},${f(x)}`)
  return `M${points.join(" L")}`
})()

const steps = [
  { showAxes: true, showCurve: false, showVertex: false, showSymmetry: false, showFormula: false, label: "Start with coordinate axes" },
  { showAxes: true, showCurve: true, showVertex: false, showSymmetry: false, showFormula: false, label: "A quadratic is a parabola (U-shape)" },
  { showAxes: true, showCurve: true, showVertex: true, showSymmetry: false, showFormula: false, label: "The lowest point is the vertex" },
  { showAxes: true, showCurve: true, showVertex: true, showSymmetry: true, showFormula: false, label: "It's symmetric about the vertex" },
  { showAxes: true, showCurve: true, showVertex: true, showSymmetry: true, showFormula: true, label: "y = ax² + bx + c" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const QuadraticFunctionIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showAxes, showCurve, showVertex, showSymmetry, showFormula, label } = steps[step]

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
          <line x1={vertexX} y1="15" x2={vertexX} y2="90" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <text x="145" y="82" fontSize="8" fill="currentColor" opacity="0.5">x</text>
          <text x={vertexX + 4} y="20" fontSize="8" fill="currentColor" opacity="0.5">y</text>
        </motion.g>

        {/* Parabola */}
        <motion.path
          d={curvePath}
          className="stroke-violet-500 dark:stroke-violet-400"
          strokeWidth="2.5"
          fill="none"
          animate={{ opacity: showCurve ? 1 : 0 }}
          transition={ease}
        />

        {/* Axis of symmetry */}
        <motion.line
          x1={vertexX}
          y1={vertexY}
          x2={vertexX}
          y2={f(40)}
          className="stroke-sky-500 dark:stroke-sky-400"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          animate={{ opacity: showSymmetry ? 1 : 0 }}
          transition={ease}
        />

        {/* Vertex */}
        <motion.g animate={{ opacity: showVertex ? 1 : 0 }} transition={ease}>
          <circle cx={vertexX} cy={vertexY} r="5" className="fill-red-500 dark:fill-red-400" />
          <text x={vertexX + 8} y={vertexY + 4} fontSize="9" className="fill-red-500 dark:fill-red-400" fontWeight="bold">
            Vertex
          </text>
        </motion.g>

        {/* Formula */}
        <motion.g animate={{ opacity: showFormula ? 1 : 0 }} transition={ease}>
          <rect x="40" y="5" width="80" height="16" rx="3" className="fill-violet-500/20 dark:fill-violet-400/20" />
          <text x="80" y="17" fontSize="10" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400" fontWeight="bold">
            y = ax² + bx + c
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
