"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Smooth continuous curve
const f = (x: number) => 50 + 20 * Math.sin((x - 30) / 25)
const curvePath = (() => {
  const points: string[] = []
  for (let x = 25; x <= 145; x += 2) points.push(`${x},${f(x)}`)
  return `M${points.join(" L")}`
})()

const steps = [
  { showCurve: false, showPencil: false, showLabel: false, drawProgress: 0, label: "Can you draw without lifting the pencil?" },
  { showCurve: true, showPencil: true, showLabel: false, drawProgress: 0.3, label: "Start drawing..." },
  { showCurve: true, showPencil: true, showLabel: false, drawProgress: 0.7, label: "Keep going, don't lift!" },
  { showCurve: true, showPencil: true, showLabel: false, drawProgress: 1, label: "Made it all the way through!" },
  { showCurve: true, showPencil: false, showLabel: true, drawProgress: 1, label: "This is a CONTINUOUS function!" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const ContinuityIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showCurve, showPencil, showLabel, drawProgress, label } = steps[step]

  // Pencil position along curve
  const pencilX = 25 + drawProgress * 120
  const pencilY = f(pencilX)

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

        {/* Continuous curve */}
        <motion.path
          d={curvePath}
          className="stroke-green-500 dark:stroke-green-400"
          strokeWidth="2.5"
          fill="none"
          animate={{
            pathLength: showCurve ? drawProgress : 0,
            opacity: showCurve ? 1 : 0
          }}
          transition={ease}
        />

        {/* Pencil */}
        <motion.g animate={{ opacity: showPencil ? 1 : 0, x: pencilX - 25, y: pencilY - f(25) }} transition={ease}>
          <circle cx="25" cy={f(25)} r="4" className="fill-sky-500 dark:fill-sky-400" />
          <text x="25" y={f(25) - 8} fontSize="8" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400">✏️</text>
        </motion.g>

        {/* No breaks label */}
        <motion.g animate={{ opacity: showLabel ? 1 : 0 }} transition={ease}>
          <rect x="45" y="5" width="70" height="18" rx="3" className="fill-green-500/20 dark:fill-green-400/20" />
          <text x="80" y="18" fontSize="10" textAnchor="middle" className="fill-green-500 dark:fill-green-400" fontWeight="bold">
            No Breaks!
          </text>
          {/* Checkmark */}
          <path d="M120 12 L125 17 L135 7" className="stroke-green-500 dark:stroke-green-400" strokeWidth="2" fill="none" />
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
