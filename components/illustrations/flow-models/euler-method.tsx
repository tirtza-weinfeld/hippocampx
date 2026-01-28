"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// True curve vs Euler approximation
const trueCurve = (() => {
  const pts: { x: number; y: number }[] = []
  for (let t = 0; t <= 1; t += 0.02) {
    pts.push({ x: 25 + t * 115, y: 75 - 50 * t + 15 * Math.sin(t * Math.PI * 1.5) })
  }
  return pts
})()

// Euler steps (fewer points, straight lines between them)
const eulerSteps = [
  { x: 25, y: 75 },
  { x: 54, y: 58 },
  { x: 83, y: 42 },
  { x: 112, y: 30 },
  { x: 140, y: 22 },
]

const truePathD = trueCurve.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
const eulerPathD = eulerSteps.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")

const steps = [
  { showTrue: true, showEuler: false, showSteps: false, showFormula: false, currentStep: -1, label: "True trajectory (continuous)" },
  { showTrue: true, showEuler: false, showSteps: true, showFormula: false, currentStep: 0, label: "Start at X₀, evaluate u(X₀)" },
  { showTrue: true, showEuler: true, showSteps: true, showFormula: false, currentStep: 1, label: "Take step: X₁ = X₀ + h·u(X₀)" },
  { showTrue: true, showEuler: true, showSteps: true, showFormula: false, currentStep: 3, label: "Repeat: Xₜ₊ₕ = Xₜ + h·u(Xₜ)" },
  { showTrue: true, showEuler: true, showSteps: true, showFormula: true, currentStep: 4, label: "Step size h = 1/n controls accuracy" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const EulerMethodIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showTrue, showEuler, showSteps, showFormula, currentStep, label } = steps[step]

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
        {/* True continuous curve */}
        <motion.path
          d={truePathD}
          fill="none"
          className="stroke-green-500 dark:stroke-green-400"
          strokeWidth="2"
          opacity="0.5"
          animate={{ opacity: showTrue ? 0.5 : 0 }}
          transition={ease}
        />

        {/* Euler approximation path */}
        <motion.path
          d={eulerPathD}
          fill="none"
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2"
          strokeDasharray="200"
          animate={{
            strokeDashoffset: showEuler ? 0 : 200,
            opacity: showEuler ? 1 : 0
          }}
          transition={ease}
        />

        {/* Step points */}
        {showSteps && eulerSteps.map((p, i) => (
          <motion.g
            key={i}
            animate={{ opacity: i <= currentStep ? 1 : 0.2 }}
            transition={ease}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={i === currentStep ? 5 : 4}
              className={i === currentStep ? "fill-red-500 dark:fill-red-400" : "fill-blue-500 dark:fill-blue-400"}
            />
            {i === 0 && (
              <text x={p.x - 10} y={p.y + 14} fontSize="8" className="fill-blue-500 dark:fill-blue-400">X₀</text>
            )}
            {i === currentStep && i > 0 && (
              <text x={p.x + 6} y={p.y - 4} fontSize="8" className="fill-red-500 dark:fill-red-400">X{i}</text>
            )}
          </motion.g>
        ))}

        {/* Step arrow */}
        {currentStep > 0 && currentStep < eulerSteps.length && (
          <motion.g animate={{ opacity: 1 }} transition={ease}>
            <line
              x1={eulerSteps[currentStep - 1].x + 4}
              y1={eulerSteps[currentStep - 1].y - 4}
              x2={eulerSteps[currentStep].x - 4}
              y2={eulerSteps[currentStep].y + 2}
              className="stroke-violet-500 dark:stroke-violet-400"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead)"
            />
          </motion.g>
        )}

        {/* Legend */}
        <g fontSize="7" opacity="0.8">
          <line x1="10" y1="10" x2="22" y2="10" className="stroke-green-500 dark:stroke-green-400" strokeWidth="2" opacity="0.5" />
          <text x="25" y="12" fill="currentColor">true</text>
          <line x1="10" y1="20" x2="22" y2="20" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
          <text x="25" y="22" fill="currentColor">Euler</text>
        </g>

        {/* Formula */}
        <motion.g animate={{ opacity: showFormula ? 1 : 0 }} transition={ease}>
          <rect x="55" y="85" width="90" height="14" rx="3" className="fill-sky-500/20 dark:fill-sky-400/20" />
          <text x="100" y="95" fontSize="8" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontWeight="bold">
            Xₜ₊ₕ = Xₜ + h·u(Xₜ)
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
