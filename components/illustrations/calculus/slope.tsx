"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Two points for slope demonstration
const p1 = { x: 35, y: 70 }
const p2 = { x: 115, y: 30 }

// Teaching steps - progressive reveal
const steps = [
  { showLine: false, showRise: false, showRun: false, showFormula: false, label: "Two points on a coordinate plane" },
  { showLine: true, showRise: false, showRun: false, showFormula: false, label: "Draw a line through the points" },
  { showLine: true, showRise: true, showRun: false, showFormula: false, label: "Rise = vertical change (Δy)" },
  { showLine: true, showRise: true, showRun: true, showFormula: false, label: "Run = horizontal change (Δx)" },
  { showLine: true, showRise: true, showRun: true, showFormula: true, label: "Slope = rise ÷ run = Δy/Δx" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const SlopeIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showLine, showRise, showRun, showFormula, label } = steps[step]

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
        <line x1="10" y1="90" x2="150" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="15" y1="10" x2="15" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Line through points */}
        <motion.line
          x1={p1.x - 15}
          y1={p1.y + 10}
          x2={p2.x + 15}
          y2={p2.y - 10}
          className="stroke-current"
          strokeWidth="2"
          opacity="0.7"
          animate={{ opacity: showLine ? 0.7 : 0 }}
          transition={ease}
        />

        {/* Rise (vertical line) */}
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
          rise
        </motion.text>

        {/* Run (horizontal line) */}
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
          run
        </motion.text>

        {/* Points */}
        <motion.circle
          cx={p1.x}
          cy={p1.y}
          r="4"
          className="fill-blue-500 dark:fill-blue-400"
          animate={{ opacity: 1 }}
          transition={ease}
        />
        <motion.circle
          cx={p2.x}
          cy={p2.y}
          r="4"
          className="fill-blue-500 dark:fill-blue-400"
          animate={{ opacity: 1 }}
          transition={ease}
        />

        {/* Point labels */}
        <text x={p1.x + 6} y={p1.y + 4} fontSize="8" fill="currentColor" opacity="0.7">P₁</text>
        <text x={p2.x + 6} y={p2.y + 4} fontSize="8" fill="currentColor" opacity="0.7">P₂</text>

        {/* Slope formula */}
        <motion.g animate={{ opacity: showFormula ? 1 : 0 }} transition={ease}>
          <rect x="95" y="60" width="55" height="20" rx="3" className="fill-red-500/20 dark:fill-red-400/20" />
          <text x="122" y="74" fontSize="10" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontWeight="bold">
            m = rise/run
          </text>
        </motion.g>

        {/* Legend */}
        <g fontSize="5" opacity="0.8">
          <line x1="125" y1="10" x2="140" y2="10" className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="1.5" strokeDasharray="2,1" />
          <text x="143" y="12" fill="currentColor">rise (Δy)</text>
          <line x1="125" y1="18" x2="140" y2="18" className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" strokeDasharray="2,1" />
          <text x="143" y="20" fill="currentColor">run (Δx)</text>
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
