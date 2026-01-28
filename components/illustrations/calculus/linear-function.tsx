"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Line: y = mx + b, where m = -0.5, b = 65 (in SVG coords)
const m = -0.5
const b = 65

const steps = [
  { showAxes: true, showLine: false, showIntercept: false, showSlope: false, showFormula: false, label: "Start with coordinate axes" },
  { showAxes: true, showLine: true, showIntercept: false, showSlope: false, showFormula: false, label: "A linear function is a straight line" },
  { showAxes: true, showLine: true, showIntercept: true, showSlope: false, showFormula: false, label: "It crosses the y-axis at 'b'" },
  { showAxes: true, showLine: true, showIntercept: true, showSlope: true, showFormula: false, label: "The slope 'm' shows the steepness" },
  { showAxes: true, showLine: true, showIntercept: true, showSlope: true, showFormula: true, label: "y = mx + b" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const LinearFunctionIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showAxes, showLine, showIntercept, showSlope, showFormula, label } = steps[step]

  // Line endpoints
  const x1 = 30, x2 = 140
  const y1 = m * x1 + b, y2 = m * x2 + b
  const yInterceptY = b
  const yAxisX = 25

  // Slope triangle
  const triX1 = 60, triX2 = 100
  const triY1 = m * triX1 + b, triY2 = m * triX2 + b

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
        <motion.g animate={{ opacity: showAxes ? 0.1 : 0 }} transition={ease}>
          {[...Array(8)].map((_, i) => (
            <line key={`v${i}`} x1={20 + i * 18} y1="15" x2={20 + i * 18} y2="95" stroke="currentColor" strokeWidth="0.5" />
          ))}
          {[...Array(5)].map((_, i) => (
            <line key={`h${i}`} x1="15" y1={20 + i * 18} x2="150" y2={20 + i * 18} stroke="currentColor" strokeWidth="0.5" />
          ))}
        </motion.g>

        {/* Axes */}
        <motion.g animate={{ opacity: showAxes ? 1 : 0 }} transition={ease}>
          <line x1="15" y1="85" x2="150" y2="85" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1={yAxisX} y1="15" x2={yAxisX} y2="90" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <text x="145" y="82" fontSize="8" fill="currentColor" opacity="0.5">x</text>
          <text x="28" y="20" fontSize="8" fill="currentColor" opacity="0.5">y</text>
        </motion.g>

        {/* Line */}
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2.5"
          animate={{ opacity: showLine ? 1 : 0 }}
          transition={ease}
        />

        {/* Y-intercept */}
        <motion.g animate={{ opacity: showIntercept ? 1 : 0 }} transition={ease}>
          <circle cx={yAxisX} cy={yInterceptY} r="5" className="fill-red-500 dark:fill-red-400" />
          <text x={yAxisX + 8} y={yInterceptY + 4} fontSize="9" className="fill-red-500 dark:fill-red-400" fontWeight="bold">b</text>
        </motion.g>

        {/* Slope triangle */}
        <motion.g animate={{ opacity: showSlope ? 1 : 0 }} transition={ease}>
          <path
            d={`M${triX1} ${triY1} L${triX2} ${triY1} L${triX2} ${triY2} Z`}
            className="fill-green-500/25 dark:fill-green-400/25 stroke-green-500 dark:stroke-green-400"
            strokeWidth="1.5"
          />
          <text x={(triX1 + triX2) / 2} y={triY1 + 12} fontSize="8" textAnchor="middle" className="fill-green-500 dark:fill-green-400">run</text>
          <text x={triX2 + 8} y={(triY1 + triY2) / 2} fontSize="8" className="fill-green-500 dark:fill-green-400">rise</text>
        </motion.g>

        {/* Formula */}
        <motion.g animate={{ opacity: showFormula ? 1 : 0 }} transition={ease}>
          <rect x="55" y="5" width="60" height="16" rx="3" className="fill-violet-500/20 dark:fill-violet-400/20" />
          <text x="85" y="17" fontSize="11" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400" fontWeight="bold">
            y = mx + b
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
