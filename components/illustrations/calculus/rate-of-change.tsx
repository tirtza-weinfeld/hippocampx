"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Two points for secant line
const p1 = { x: 40, y: 70 }
const p2 = { x: 120, y: 30 }

const steps = [
  { showPoints: true, showSecant: false, showRise: false, showRun: false, showFormula: false, label: "Two points on a curve" },
  { showPoints: true, showSecant: true, showRise: false, showRun: false, showFormula: false, label: "Connect them with a line" },
  { showPoints: true, showSecant: true, showRise: true, showRun: false, showFormula: false, label: "Measure the change in y (rise)" },
  { showPoints: true, showSecant: true, showRise: true, showRun: true, showFormula: false, label: "Measure the change in x (run)" },
  { showPoints: true, showSecant: true, showRise: true, showRun: true, showFormula: true, label: "Rate of change = Δy / Δx" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const RateOfChangeIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showPoints, showSecant, showRise, showRun, showFormula, label } = steps[step]

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

        {/* Secant line */}
        <motion.line
          x1={p1.x - 10}
          y1={p1.y + 5}
          x2={p2.x + 10}
          y2={p2.y - 5}
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2"
          animate={{ opacity: showSecant ? 0.8 : 0 }}
          transition={ease}
        />

        {/* Rise line (vertical) */}
        <motion.line
          x1={p1.x}
          y1={p1.y}
          x2={p1.x}
          y2={p2.y}
          className="stroke-violet-500 dark:stroke-violet-400"
          strokeWidth="2"
          strokeDasharray="4,2"
          animate={{ opacity: showRise ? 1 : 0 }}
          transition={ease}
        />
        <motion.text
          x={p1.x - 12}
          y={(p1.y + p2.y) / 2 + 4}
          fontSize="9"
          className="fill-violet-500 dark:fill-violet-400"
          fontWeight="bold"
          animate={{ opacity: showRise ? 1 : 0 }}
          transition={ease}
        >
          Δy
        </motion.text>

        {/* Run line (horizontal) */}
        <motion.line
          x1={p1.x}
          y1={p2.y}
          x2={p2.x}
          y2={p2.y}
          className="stroke-green-500 dark:stroke-green-400"
          strokeWidth="2"
          strokeDasharray="4,2"
          animate={{ opacity: showRun ? 1 : 0 }}
          transition={ease}
        />
        <motion.text
          x={(p1.x + p2.x) / 2}
          y={p2.y - 6}
          fontSize="9"
          textAnchor="middle"
          className="fill-green-500 dark:fill-green-400"
          fontWeight="bold"
          animate={{ opacity: showRun ? 1 : 0 }}
          transition={ease}
        >
          Δx
        </motion.text>

        {/* Points */}
        <motion.circle
          cx={p1.x}
          cy={p1.y}
          r="5"
          className="fill-red-500 dark:fill-red-400"
          animate={{ opacity: showPoints ? 1 : 0 }}
          transition={ease}
        />
        <motion.circle
          cx={p2.x}
          cy={p2.y}
          r="5"
          className="fill-red-500 dark:fill-red-400"
          animate={{ opacity: showPoints ? 1 : 0 }}
          transition={ease}
        />

        {/* Formula */}
        <motion.g animate={{ opacity: showFormula ? 1 : 0 }} transition={ease}>
          <rect x="35" y="5" width="90" height="18" rx="3" className="fill-sky-500/20 dark:fill-sky-400/20" />
          <text x="80" y="18" fontSize="10" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontWeight="bold">
            Rate = Δy / Δx
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
