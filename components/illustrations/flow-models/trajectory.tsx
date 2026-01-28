"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Trajectory following a spiral/curved path
const trajectory = (() => {
  const points: { x: number; y: number }[] = []
  for (let t = 0; t <= 1; t += 0.02) {
    // Curved path from bottom-left to top-right
    const x = 25 + t * 110
    const y = 80 - t * 55 + 15 * Math.sin(t * Math.PI * 2)
    points.push({ x, y })
  }
  return points
})()

const pathD = trajectory.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")

const steps = [
  { showStart: true, showPath: false, showEnd: false, showTime: false, progress: 0, label: "Start at initial point X₀" },
  { showStart: true, showPath: true, showEnd: false, showTime: false, progress: 0.3, label: "Follow the vector field..." },
  { showStart: true, showPath: true, showEnd: false, showTime: true, progress: 0.6, label: "Time t maps to position Xₜ" },
  { showStart: true, showPath: true, showEnd: true, showTime: true, progress: 1, label: "Arrive at final point X₁" },
  { showStart: true, showPath: true, showEnd: true, showTime: false, progress: 1, label: "dXₜ/dt = u(Xₜ) defines the ODE" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const TrajectoryIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showStart, showPath, showEnd, showTime, progress, label } = steps[step]

  // Current position along trajectory
  const idx = Math.floor(progress * (trajectory.length - 1))
  const current = trajectory[idx]

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
        {/* Time axis label */}
        <text x="80" y="100" fontSize="8" textAnchor="middle" fill="currentColor" opacity="0.4">t: 0 → 1</text>

        {/* Trajectory path */}
        <motion.path
          d={pathD}
          fill="none"
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2"
          strokeDasharray="400"
          animate={{
            strokeDashoffset: showPath ? 400 * (1 - progress) : 400,
            opacity: showPath ? 1 : 0
          }}
          transition={ease}
        />

        {/* Start point */}
        <motion.g animate={{ opacity: showStart ? 1 : 0 }} transition={ease}>
          <circle cx={trajectory[0].x} cy={trajectory[0].y} r="5" className="fill-green-500 dark:fill-green-400" />
          <text x={trajectory[0].x - 8} y={trajectory[0].y + 14} fontSize="9" className="fill-green-500 dark:fill-green-400" fontWeight="bold">
            X₀
          </text>
        </motion.g>

        {/* Current position marker */}
        {showPath && progress > 0 && progress < 1 && (
          <motion.g
            animate={{ opacity: 1 }}
            transition={ease}
          >
            <circle cx={current.x} cy={current.y} r="4" className="fill-violet-500 dark:fill-violet-400" />
            {showTime && (
              <text x={current.x + 8} y={current.y - 4} fontSize="8" className="fill-violet-500 dark:fill-violet-400" fontWeight="bold">
                Xₜ
              </text>
            )}
          </motion.g>
        )}

        {/* End point */}
        <motion.g animate={{ opacity: showEnd ? 1 : 0 }} transition={ease}>
          <circle cx={trajectory[trajectory.length - 1].x} cy={trajectory[trajectory.length - 1].y} r="5" className="fill-red-500 dark:fill-red-400" />
          <text x={trajectory[trajectory.length - 1].x + 6} y={trajectory[trajectory.length - 1].y + 4} fontSize="9" className="fill-red-500 dark:fill-red-400" fontWeight="bold">
            X₁
          </text>
        </motion.g>

        {/* ODE formula */}
        <motion.g animate={{ opacity: step === 4 ? 1 : 0 }} transition={ease}>
          <rect x="30" y="5" width="100" height="16" rx="3" className="fill-sky-500/20 dark:fill-sky-400/20" />
          <text x="80" y="17" fontSize="9" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontWeight="bold">
            dX/dt = u(X) → ODE
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
