"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// PDF: p_0(·|z) = p_init (noise), p_1(·|z) = δ_z (data point)
// So t=0 is wide noise, t=1 is peaked at data point z
const steps = [
  { t: 0, label: "t=0: p₀ = p_init (wide Gaussian noise)" },
  { t: 0.33, label: "Distribution narrows toward data point z" },
  { t: 0.66, label: "Interpolating: noise → data" },
  { t: 1, label: "t=1: p₁ = δ_z (concentrated at data point)" },
]

const gaussian = (x: number, mu: number, sigma: number) =>
  Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI))

const makeCurve = (sigma: number) => {
  const pts: string[] = []
  for (let x = 0; x <= 100; x += 2) {
    const y = 85 - gaussian(x, 50, sigma) * 1500
    pts.push(`${x === 0 ? "M" : "L"}${30 + x},${y}`)
  }
  return pts.join(" ")
}

export const ProbabilityPathIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reducedMotion = useReducedMotion()

  const ease = reducedMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 80, damping: 20 }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { t, label } = steps[step]
  // Reverse: t=0 is wide (28), t=1 is narrow (8)
  const sigma = 28 - t * 20
  const curve = makeCurve(sigma)

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg width="160" height="105" viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* x-axis */}
        <line x1="30" y1="85" x2="130" y2="85" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Data point z indicator */}
        <motion.g animate={{ opacity: t > 0.5 ? 1 : 0.3 }} transition={ease}>
          <line x1="80" y1="85" x2="80" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeDasharray="2 2" />
          <text x="80" y="95" fontSize="7" textAnchor="middle" className="fill-green-500 dark:fill-green-400">z</text>
        </motion.g>

        {/* Probability curve */}
        <motion.path d={curve} fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" animate={{ d: curve }} transition={ease} />
        <motion.path d={`${curve} L130,85 L30,85 Z`} className="fill-blue-500/20 dark:fill-blue-400/20" animate={{ d: `${curve} L130,85 L30,85 Z` }} transition={ease} />

        {/* Time indicator */}
        <text x="145" y="20" fontSize="9" fill="currentColor" opacity="0.6">t={t.toFixed(2)}</text>

        {/* Title showing conditional */}
        <text x="80" y="12" fontSize="8" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400" fontWeight="bold">pₜ(x|z)</text>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
