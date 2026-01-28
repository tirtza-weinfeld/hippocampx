"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Vector field u(x) = direction at each point
// Simple rotating field: u(x,y) = (-y, x) normalized
const arrows = (() => {
  const result: { x: number; y: number; dx: number; dy: number }[] = []
  for (let gx = 0; gx < 5; gx++) {
    for (let gy = 0; gy < 4; gy++) {
      const x = 30 + gx * 28
      const y = 20 + gy * 22
      // Rotating field centered at (80, 52)
      const cx = 80, cy = 52
      const rx = x - cx, ry = y - cy
      const len = Math.sqrt(rx * rx + ry * ry) || 1
      const dx = (-ry / len) * 10
      const dy = (rx / len) * 10
      result.push({ x, y, dx, dy })
    }
  }
  return result
})()

const steps = [
  { showGrid: true, showArrows: false, showLabel: false, highlight: -1, label: "A vector field assigns a vector to each point" },
  { showGrid: true, showArrows: true, showLabel: false, highlight: -1, label: "Arrows show direction and magnitude" },
  { showGrid: true, showArrows: true, showLabel: false, highlight: 6, label: "At each location (x,t), we get velocity u(x)" },
  { showGrid: true, showArrows: true, showLabel: false, highlight: 11, label: "The field tells us where to go next" },
  { showGrid: true, showArrows: true, showLabel: true, highlight: -1, label: "u: R^d x [0,1] -> R^d" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const VectorFieldIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showGrid, showArrows, showLabel, highlight, label } = steps[step]

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
        {/* Grid dots */}
        <motion.g animate={{ opacity: showGrid ? 0.3 : 0 }} transition={ease}>
          {arrows.map((a, i) => (
            <circle key={i} cx={a.x} cy={a.y} r="1.5" fill="currentColor" />
          ))}
        </motion.g>

        {/* Vector arrows */}
        {arrows.map((a, i) => (
          <motion.g
            key={i}
            animate={{
              opacity: showArrows ? (highlight === -1 || highlight === i ? 1 : 0.3) : 0
            }}
            transition={ease}
          >
            <line
              x1={a.x}
              y1={a.y}
              x2={a.x + a.dx}
              y2={a.y + a.dy}
              className={highlight === i ? "stroke-red-500 dark:stroke-red-400" : "stroke-blue-500 dark:stroke-blue-400"}
              strokeWidth={highlight === i ? 2 : 1.5}
            />
            <circle
              cx={a.x + a.dx}
              cy={a.y + a.dy}
              r={highlight === i ? 2.5 : 2}
              className={highlight === i ? "fill-red-500 dark:fill-red-400" : "fill-blue-500 dark:fill-blue-400"}
            />
          </motion.g>
        ))}

        {/* Highlighted point */}
        {highlight !== -1 && (
          <motion.circle
            cx={arrows[highlight].x}
            cy={arrows[highlight].y}
            r="4"
            className="fill-red-500/30 dark:fill-red-400/30 stroke-red-500 dark:stroke-red-400"
            strokeWidth="1.5"
            animate={{ opacity: 1, scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Formula label */}
        <motion.g animate={{ opacity: showLabel ? 1 : 0 }} transition={ease}>
          <rect x="35" y="5" width="90" height="16" rx="3" className="fill-violet-500/20 dark:fill-violet-400/20" />
          <text x="80" y="17" fontSize="9" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400" fontWeight="bold">
            u(x,t) = velocity at x
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
