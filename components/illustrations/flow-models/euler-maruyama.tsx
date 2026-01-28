"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { showDet: true, showNoise: false, currentStep: 0, label: "Start at X₀, compute u(X₀)" },
  { showDet: true, showNoise: true, currentStep: 1, label: "Add noise: √h·σ·ε where ε~N(0,I)" },
  { showDet: true, showNoise: true, currentStep: 2, label: "X₁ = X₀ + h·u(X₀) + √h·σ·ε" },
  { showDet: true, showNoise: true, currentStep: 3, label: "Repeat with stochastic jumps" },
]

// Deterministic path (Euler)
const detPath = [
  { x: 25, y: 75 }, { x: 54, y: 58 }, { x: 83, y: 42 }, { x: 112, y: 30 }, { x: 140, y: 22 },
]
// Stochastic path (Euler-Maruyama) - adds noise
const stochPath = [
  { x: 25, y: 75 }, { x: 54, y: 62 }, { x: 83, y: 38 }, { x: 112, y: 35 }, { x: 140, y: 18 },
]

const toD = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")

export const EulerMaruyamaIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reducedMotion = useReducedMotion()

  const ease = reducedMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 80, damping: 20 }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showDet, showNoise, currentStep, label } = steps[step]

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg width="160" height="105" viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Deterministic Euler path */}
        <motion.path d={toD(detPath)} fill="none" className="stroke-green-500/50 dark:stroke-green-400/50" strokeWidth="2" strokeDasharray="4 2" animate={{ opacity: showDet ? 0.5 : 0 }} transition={ease} />

        {/* Stochastic Euler-Maruyama path */}
        <motion.path d={toD(stochPath.slice(0, currentStep + 1))} fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" animate={{ opacity: showNoise ? 1 : 0 }} transition={ease} />

        {/* Noise arrows */}
        {showNoise && stochPath.slice(1, currentStep + 1).map((p, i) => (
          <motion.g key={i} animate={{ opacity: 1 }} transition={ease}>
            <line x1={detPath[i + 1].x} y1={detPath[i + 1].y} x2={p.x} y2={p.y} className="stroke-red-500/60 dark:stroke-red-400/60" strokeWidth="1.5" strokeDasharray="2 1" />
            <text x={p.x + 4} y={p.y - 2} fontSize="6" className="fill-red-500 dark:fill-red-400">+ε</text>
          </motion.g>
        ))}

        {/* Current point */}
        {stochPath.slice(0, currentStep + 1).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === currentStep ? 5 : 3} className={i === currentStep ? "fill-blue-500 dark:fill-blue-400" : "fill-blue-500/50 dark:fill-blue-400/50"} />
        ))}

        {/* Legend */}
        <g fontSize="7" opacity="0.8">
          <line x1="10" y1="10" x2="22" y2="10" className="stroke-green-500/50" strokeWidth="2" strokeDasharray="3 1" />
          <text x="25" y="12" fill="currentColor">Euler</text>
          <line x1="10" y1="20" x2="22" y2="20" className="stroke-blue-500" strokeWidth="2" />
          <text x="25" y="22" fill="currentColor">E-M</text>
        </g>

        {/* Formula */}
        <motion.g animate={{ opacity: currentStep >= 2 ? 1 : 0 }} transition={ease}>
          <rect x="30" y="85" width="100" height="14" rx="3" className="fill-violet-500/20 dark:fill-violet-400/20" />
          <text x="80" y="95" fontSize="7" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400" fontWeight="bold">X += h·u(X) + √h·σ·ε</text>
        </motion.g>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
