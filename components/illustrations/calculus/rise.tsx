"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Two points for showing rise
const p1 = { x: 50, y: 75 }
const p2 = { x: 110, y: 35 }

const steps = [
  { showP1: true, showP2: false, showRise: false, showLabel: false, label: "Start with a point P₁" },
  { showP1: true, showP2: true, showRise: false, showLabel: false, label: "Add a second point P₂" },
  { showP1: true, showP2: true, showRise: true, showLabel: false, label: "The vertical distance between them..." },
  { showP1: true, showP2: true, showRise: true, showLabel: true, label: "...is called the RISE (Δy)" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const RiseIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showP1, showP2, showRise, showLabel, label } = steps[step]

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

        {/* Rise line (vertical) */}
        <motion.line
          x1={p1.x}
          y1={p1.y}
          x2={p1.x}
          y2={p2.y}
          className="stroke-violet-500 dark:stroke-violet-400"
          strokeWidth="3"
          strokeDasharray="4,2"
          animate={{ opacity: showRise ? 1 : 0 }}
          transition={ease}
        />

        {/* Arrow heads for rise */}
        <motion.polygon
          points={`${p1.x - 5},${p2.y + 8} ${p1.x},${p2.y} ${p1.x + 5},${p2.y + 8}`}
          className="fill-violet-500 dark:fill-violet-400"
          animate={{ opacity: showRise ? 1 : 0 }}
          transition={ease}
        />
        <motion.polygon
          points={`${p1.x - 5},${p1.y - 8} ${p1.x},${p1.y} ${p1.x + 5},${p1.y - 8}`}
          className="fill-violet-500 dark:fill-violet-400"
          animate={{ opacity: showRise ? 1 : 0 }}
          transition={ease}
        />

        {/* Rise label */}
        <motion.g animate={{ opacity: showLabel ? 1 : 0 }} transition={ease}>
          <rect x="55" y="48" width="50" height="16" rx="3" className="fill-violet-500/20 dark:fill-violet-400/20" />
          <text x="80" y="60" fontSize="10" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400" fontWeight="bold">
            Rise = Δy
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
        <motion.text x={p1.x + 6} y={p1.y + 4} fontSize="8" fill="currentColor" opacity="0.7" animate={{ opacity: showP1 ? 0.7 : 0 }} transition={ease}>
          P₁ (y₁)
        </motion.text>
        <motion.text x={p2.x + 6} y={p2.y + 4} fontSize="8" fill="currentColor" opacity="0.7" animate={{ opacity: showP2 ? 0.7 : 0 }} transition={ease}>
          P₂ (y₂)
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
