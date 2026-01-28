"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Example point
const point = { x: 100, y: 30 }
const originX = 80
const originY = 75

const steps = [
  { showAxes: true, showGrid: false, showPoint: false, showLines: false, showCoords: false, label: "A coordinate plane has two axes" },
  { showAxes: true, showGrid: true, showPoint: false, showLines: false, showCoords: false, label: "The grid helps locate positions" },
  { showAxes: true, showGrid: true, showPoint: true, showLines: false, showCoords: false, label: "Pick any point on the plane" },
  { showAxes: true, showGrid: true, showPoint: true, showLines: true, showCoords: false, label: "Find its x and y distances from origin" },
  { showAxes: true, showGrid: true, showPoint: true, showLines: true, showCoords: true, label: "Write as (x, y) = (3, 2)" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const CoordinateIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showAxes, showGrid, showPoint, showLines, showCoords, label } = steps[step]

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
        {/* Grid */}
        <motion.g animate={{ opacity: showGrid ? 0.15 : 0 }} transition={ease}>
          {[...Array(8)].map((_, i) => (
            <line key={`v${i}`} x1={20 + i * 20} y1="15" x2={20 + i * 20} y2="95" stroke="currentColor" strokeWidth="0.5" />
          ))}
          {[...Array(5)].map((_, i) => (
            <line key={`h${i}`} x1="15" y1={15 + i * 20} x2="150" y2={15 + i * 20} stroke="currentColor" strokeWidth="0.5" />
          ))}
        </motion.g>

        {/* Axes */}
        <motion.g animate={{ opacity: showAxes ? 1 : 0 }} transition={ease}>
          <line x1="15" y1={originY} x2="150" y2={originY} stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <line x1={originX} y1="15" x2={originX} y2="95" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <circle cx={originX} cy={originY} r="2" fill="currentColor" opacity="0.6" />
          <text x={originX + 4} y={originY + 10} fontSize="7" fill="currentColor" opacity="0.5">(0,0)</text>
          <text x="145" y={originY + 10} fontSize="8" fill="currentColor" opacity="0.6">x</text>
          <text x={originX + 4} y="20" fontSize="8" fill="currentColor" opacity="0.6">y</text>
        </motion.g>

        {/* Dashed lines to point */}
        <motion.line
          x1={originX}
          y1={point.y}
          x2={point.x}
          y2={point.y}
          className="stroke-green-500 dark:stroke-green-400"
          strokeWidth="1.5"
          strokeDasharray="3,2"
          animate={{ opacity: showLines ? 1 : 0 }}
          transition={ease}
        />
        <motion.line
          x1={point.x}
          y1={originY}
          x2={point.x}
          y2={point.y}
          className="stroke-violet-500 dark:stroke-violet-400"
          strokeWidth="1.5"
          strokeDasharray="3,2"
          animate={{ opacity: showLines ? 1 : 0 }}
          transition={ease}
        />

        {/* Point */}
        <motion.circle
          cx={point.x}
          cy={point.y}
          r="5"
          className="fill-red-500 dark:fill-red-400"
          animate={{ opacity: showPoint ? 1 : 0 }}
          transition={ease}
        />

        {/* Coordinate label */}
        <motion.g animate={{ opacity: showCoords ? 1 : 0 }} transition={ease}>
          <rect x={point.x + 5} y={point.y - 18} width="38" height="16" rx="3" className="fill-red-500/20 dark:fill-red-400/20" />
          <text x={point.x + 24} y={point.y - 6} fontSize="10" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontWeight="bold">
            (3, 2)
          </text>
        </motion.g>

        {/* Axis value indicators */}
        <motion.g animate={{ opacity: showLines ? 1 : 0 }} transition={ease}>
          <text x={(originX + point.x) / 2} y={point.y - 4} fontSize="8" textAnchor="middle" className="fill-green-500 dark:fill-green-400">x=3</text>
          <text x={point.x + 8} y={(originY + point.y) / 2} fontSize="8" className="fill-violet-500 dark:fill-violet-400">y=2</text>
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
