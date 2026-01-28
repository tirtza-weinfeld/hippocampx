"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Two points for showing run
const p1 = { x: 35, y: 55 }
const p2 = { x: 120, y: 55 }

const steps = [
  { showP1: true, showP2: false, showRun: false, showLabel: false, label: "Start with a point P₁" },
  { showP1: true, showP2: true, showRun: false, showLabel: false, label: "Add a second point P₂" },
  { showP1: true, showP2: true, showRun: true, showLabel: false, label: "The horizontal distance between them..." },
  { showP1: true, showP2: true, showRun: true, showLabel: true, label: "...is called the RUN (Δx)" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const RunIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showP1, showP2, showRun, showLabel, label } = steps[step]

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

        {/* Run line (horizontal) */}
        <motion.line
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          className="stroke-green-500 dark:stroke-green-400"
          strokeWidth="3"
          strokeDasharray="4,2"
          animate={{ opacity: showRun ? 1 : 0 }}
          transition={ease}
        />

        {/* Arrow heads for run */}
        <motion.polygon
          points={`${p1.x + 8},${p1.y - 5} ${p1.x},${p1.y} ${p1.x + 8},${p1.y + 5}`}
          className="fill-green-500 dark:fill-green-400"
          animate={{ opacity: showRun ? 1 : 0 }}
          transition={ease}
        />
        <motion.polygon
          points={`${p2.x - 8},${p2.y - 5} ${p2.x},${p2.y} ${p2.x - 8},${p2.y + 5}`}
          className="fill-green-500 dark:fill-green-400"
          animate={{ opacity: showRun ? 1 : 0 }}
          transition={ease}
        />

        {/* Run label */}
        <motion.g animate={{ opacity: showLabel ? 1 : 0 }} transition={ease}>
          <rect x="55" y="28" width="50" height="16" rx="3" className="fill-green-500/20 dark:fill-green-400/20" />
          <text x="80" y="40" fontSize="10" textAnchor="middle" className="fill-green-500 dark:fill-green-400" fontWeight="bold">
            Run = Δx
          </text>
        </motion.g>

        {/* Points */}
        <motion.circle
          cx={p1.x}
          cy={p1.y}
          r="4"
          className="fill-blue-500 dark:fill-blue-400"
          animate={{ opacity: showP1 ? 1 : 0 }}
          transition={ease}
        />
        <motion.circle
          cx={p2.x}
          cy={p2.y}
          r="4"
          className="fill-blue-500 dark:fill-blue-400"
          animate={{ opacity: showP2 ? 1 : 0 }}
          transition={ease}
        />

        {/* Point labels */}
        <motion.text x={p1.x - 4} y={p1.y + 15} fontSize="8" textAnchor="middle" fill="currentColor" opacity="0.7" animate={{ opacity: showP1 ? 0.7 : 0 }} transition={ease}>
          x₁
        </motion.text>
        <motion.text x={p2.x - 4} y={p2.y + 15} fontSize="8" textAnchor="middle" fill="currentColor" opacity="0.7" animate={{ opacity: showP2 ? 0.7 : 0 }} transition={ease}>
          x₂
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
