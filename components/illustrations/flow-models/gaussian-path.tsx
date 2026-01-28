"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { t: 0, label: "t=0: x = z (pure data, α=1, β=0)" },
  { t: 0.33, label: "t=0.33: x = αz + βε (mixing)" },
  { t: 0.66, label: "t=0.66: more noise, less signal" },
  { t: 1, label: "t=1: x = ε (pure noise, α=0, β=1)" },
]

// CondOT schedule: α_t = t, β_t = 1-t (reversed for data→noise)
const alpha = (t: number) => 1 - t
const beta = (t: number) => t

export const GaussianPathIllustration = () => {
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
  const a = alpha(t)
  const b = beta(t)

  // Data point position and noise cloud size
  const dataX = 40, noiseX = 120, cy = 45
  const currentX = dataX + t * (noiseX - dataX)
  const cloudR = 5 + b * 20

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg width="160" height="105" viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Timeline */}
        <line x1="30" y1="85" x2="130" y2="85" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <text x="30" y="95" fontSize="7" fill="currentColor" opacity="0.5">t=0</text>
        <text x="120" y="95" fontSize="7" fill="currentColor" opacity="0.5">t=1</text>

        {/* Data point (z) */}
        <circle cx={dataX} cy={cy} r="6" className="fill-green-500 dark:fill-green-400" />
        <text x={dataX} y={cy + 18} fontSize="7" textAnchor="middle" className="fill-green-500 dark:fill-green-400">z</text>

        {/* Noise cloud */}
        <circle cx={noiseX} cy={cy} r="18" className="fill-violet-500/20 dark:fill-violet-400/20" />
        <text x={noiseX} y={cy + 28} fontSize="7" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400">ε~N(0,I)</text>

        {/* Interpolated point with growing noise cloud */}
        <motion.g animate={{ x: currentX - dataX }} transition={ease}>
          <motion.circle cx={dataX} cy={cy} r={cloudR} className="fill-blue-500/30 dark:fill-blue-400/30" animate={{ r: cloudR }} transition={ease} />
          <circle cx={dataX} cy={cy} r="5" className="fill-blue-500 dark:fill-blue-400" />
        </motion.g>

        {/* Formula bar */}
        <rect x="25" y="5" width="110" height="18" rx="3" className="fill-sky-500/10 dark:fill-sky-400/10" />
        <text x="80" y="17" fontSize="8" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontWeight="bold">
          x = {a.toFixed(2)}·z + {b.toFixed(2)}·ε
        </text>

        {/* Alpha/Beta indicators */}
        <g fontSize="7">
          <text x="30" y="75" className="fill-green-500 dark:fill-green-400">α={a.toFixed(2)}</text>
          <text x="100" y="75" className="fill-violet-500 dark:fill-violet-400">β={b.toFixed(2)}</text>
        </g>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
