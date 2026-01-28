"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { trails: 1, showNoise: false, label: "Random walk: each step is random" },
  { trails: 2, showNoise: false, label: "Different realizations diverge" },
  { trails: 3, showNoise: true, label: "Wₜ = Brownian motion (Wiener process)" },
  { trails: 3, showNoise: true, label: "dWₜ ~ N(0, dt) — Gaussian increments" },
]

const colors = ["stroke-blue-500 dark:stroke-blue-400", "stroke-violet-500 dark:stroke-violet-400", "stroke-green-500 dark:stroke-green-400"]

// Pre-computed paths (deterministic seeds for consistent rendering)
const paths = [1, 2, 3].map(seed => {
  const pts = [{ x: 25, y: 52 }]
  for (let i = 1; i <= 40; i++) {
    const prev = pts[i - 1]
    pts.push({ x: prev.x + 3, y: Math.max(15, Math.min(90, prev.y + Math.sin(seed * i * 0.7) * 8)) })
  }
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
})

export const BrownianMotionIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reducedMotion = useReducedMotion()

  const ease = reducedMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 80, damping: 20 }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { trails, showNoise, label } = steps[step]

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg width="160" height="105" viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {paths.slice(0, trails).map((d, i) => (
          <motion.path key={i} d={d} fill="none" className={colors[i]} strokeWidth="1.5" animate={{ opacity: 1 }} transition={ease} />
        ))}
        <circle cx="25" cy="52" r="4" className="fill-red-500 dark:fill-red-400" />
        <text x="20" y="68" fontSize="8" className="fill-red-500 dark:fill-red-400">X₀</text>
        <motion.g animate={{ opacity: showNoise ? 1 : 0 }} transition={ease}>
          <rect x="40" y="5" width="80" height="14" rx="3" className="fill-sky-500/20 dark:fill-sky-400/20" />
          <text x="80" y="15" fontSize="8" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontWeight="bold">dW ~ N(0, dt)</text>
        </motion.g>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
