"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Flow warps a grid over time
// ψ_t(x₀) maps initial position to position at time t
const gridSize = 4
const gridPoints = (() => {
  const pts: { x0: number; y0: number }[] = []
  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      pts.push({ x0: 30 + i * 25, y0: 15 + j * 20 })
    }
  }
  return pts
})()

// Flow function: simple warping transformation
const flowAt = (x0: number, y0: number, t: number) => {
  const cx = 80, cy = 52
  const dx = x0 - cx, dy = y0 - cy
  const r = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) + t * 0.5
  const scale = 1 + t * 0.15 * (1 - r / 80)
  return {
    x: cx + Math.cos(angle) * r * scale,
    y: cy + Math.sin(angle) * r * scale
  }
}

const steps = [
  { time: 0, showFormula: false, label: "Initial grid at t=0" },
  { time: 0.3, showFormula: false, label: "Flow warps space as t increases" },
  { time: 0.6, showFormula: false, label: "ψₜ(x₀) = position at time t" },
  { time: 1, showFormula: false, label: "Final warped grid at t=1" },
  { time: 1, showFormula: true, label: "Flow is a diffeomorphism" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const FlowIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { time, showFormula, label } = steps[step]

  // Compute warped positions
  const warped = gridPoints.map(p => flowAt(p.x0, p.y0, time))

  // Generate grid lines (horizontal and vertical)
  const hLines: string[] = []
  const vLines: string[] = []
  for (let i = 0; i <= gridSize; i++) {
    // Horizontal lines
    const hPts = []
    for (let j = 0; j <= gridSize; j++) {
      hPts.push(warped[i * (gridSize + 1) + j])
    }
    hLines.push(hPts.map((p, k) => `${k === 0 ? "M" : "L"}${p.x},${p.y}`).join(" "))

    // Vertical lines
    const vPts = []
    for (let j = 0; j <= gridSize; j++) {
      vPts.push(warped[j * (gridSize + 1) + i])
    }
    vLines.push(vPts.map((p, k) => `${k === 0 ? "M" : "L"}${p.x},${p.y}`).join(" "))
  }

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
        {/* Grid lines */}
        {hLines.map((d, i) => (
          <motion.path
            key={`h${i}`}
            d={d}
            fill="none"
            className="stroke-blue-500 dark:stroke-blue-400"
            strokeWidth="1"
            opacity="0.6"
            animate={{ d }}
            transition={ease}
          />
        ))}
        {vLines.map((d, i) => (
          <motion.path
            key={`v${i}`}
            d={d}
            fill="none"
            className="stroke-blue-500 dark:stroke-blue-400"
            strokeWidth="1"
            opacity="0.6"
            animate={{ d }}
            transition={ease}
          />
        ))}

        {/* Grid points */}
        {warped.map((p, i) => (
          <motion.circle
            key={i}
            r="2"
            className="fill-red-500 dark:fill-red-400"
            animate={{ cx: p.x, cy: p.y }}
            transition={ease}
          />
        ))}

        {/* Time indicator */}
        <text x="145" y="98" fontSize="8" fill="currentColor" opacity="0.6">
          t={time.toFixed(1)}
        </text>

        {/* Formula */}
        <motion.g animate={{ opacity: showFormula ? 1 : 0 }} transition={ease}>
          <rect x="25" y="5" width="110" height="16" rx="3" className="fill-violet-500/20 dark:fill-violet-400/20" />
          <text x="80" y="17" fontSize="9" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400" fontWeight="bold">
            ψₜ: smooth, invertible
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
