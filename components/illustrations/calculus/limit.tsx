"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Curve with a hole at x=80
const f = (x: number) => 50 - 20 * Math.sin((x - 40) / 30)
const holeX = 80
const limitY = f(holeX)

const curvePath = (() => {
  const left: string[] = []
  const right: string[] = []
  for (let x = 20; x <= 77; x += 2) left.push(`${x},${f(x)}`)
  for (let x = 83; x <= 140; x += 2) right.push(`${x},${f(x)}`)
  return { left: `M${left.join(" L")}`, right: `M${right.join(" L")}` }
})()

const steps = [
  { showHole: true, showArrows: false, showLimit: false, showLabel: false, label: "A function with a hole at x = a" },
  { showHole: true, showArrows: true, showLimit: false, showLabel: false, label: "Approach from both sides..." },
  { showHole: true, showArrows: true, showLimit: true, showLabel: false, label: "Both sides approach the same value" },
  { showHole: true, showArrows: true, showLimit: true, showLabel: true, label: "That value is the limit L" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const LimitIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showHole, showArrows, showLimit, showLabel, label } = steps[step]

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

        {/* Curve (two parts with hole) */}
        <path d={curvePath.left} stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
        <path d={curvePath.right} stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />

        {/* Hole */}
        <motion.circle
          cx={holeX}
          cy={limitY}
          r="4"
          fill="white"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ opacity: showHole ? 1 : 0 }}
          transition={ease}
        />

        {/* Approaching arrows */}
        <motion.line
          x1={holeX - 35}
          y1={f(holeX - 30)}
          x2={holeX - 12}
          y2={limitY + 2}
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2"
          animate={{ opacity: showArrows ? 1 : 0 }}
          transition={ease}
        />
        <motion.polygon
          points={`${holeX - 12},${limitY + 2} ${holeX - 18},${limitY - 3} ${holeX - 18},${limitY + 7}`}
          className="fill-blue-500 dark:fill-blue-400"
          animate={{ opacity: showArrows ? 1 : 0 }}
          transition={ease}
        />
        <motion.line
          x1={holeX + 35}
          y1={f(holeX + 30)}
          x2={holeX + 12}
          y2={limitY + 2}
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2"
          animate={{ opacity: showArrows ? 1 : 0 }}
          transition={ease}
        />
        <motion.polygon
          points={`${holeX + 12},${limitY + 2} ${holeX + 18},${limitY - 3} ${holeX + 18},${limitY + 7}`}
          className="fill-blue-500 dark:fill-blue-400"
          animate={{ opacity: showArrows ? 1 : 0 }}
          transition={ease}
        />

        {/* Limit point */}
        <motion.circle
          cx={holeX}
          cy={limitY}
          r="3"
          className="fill-red-500 dark:fill-red-400"
          animate={{ opacity: showLimit ? 1 : 0 }}
          transition={ease}
        />

        {/* Limit label */}
        <motion.g animate={{ opacity: showLabel ? 1 : 0 }} transition={ease}>
          <text x={holeX + 8} y={limitY - 8} fontSize="10" className="fill-red-500 dark:fill-red-400" fontWeight="bold">
            L
          </text>
          <text x={holeX} y="98" fontSize="8" textAnchor="middle" fill="currentColor" opacity="0.7">
            a
          </text>
          <line x1={holeX} y1="90" x2={holeX} y2="92" stroke="currentColor" strokeWidth="1" opacity="0.5" />
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
