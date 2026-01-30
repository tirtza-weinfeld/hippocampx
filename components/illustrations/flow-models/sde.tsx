"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "./illustration-controls"

const steps = [
  { showDrift: true, showSDE: false, showFormula: false, label: "Drift term: u(X)dt — deterministic" },
  { showDrift: true, showSDE: true, showFormula: false, label: "Add noise: σdW — stochastic" },
  { showDrift: true, showSDE: true, showFormula: true, label: "SDE: dX = u(X)dt + σdW" },
  { showDrift: false, showSDE: true, showFormula: true, label: "Multiple realizations spread out" },
]

const toD = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")

// Pre-computed paths
const driftPath = Array.from({ length: 25 }, (_, i) => ({ x: 25 + (i / 24) * 110, y: 70 - (i / 24) * 40 }))
const driftD = toD(driftPath)

const sdePaths = [0.3, -0.2, 0.1].map(noise =>
  toD(driftPath.map((p, i) => ({ x: p.x, y: p.y + noise * 20 * Math.sin(i * 0.5) * (i / 24) })))
)

export function SDEIllustration({ size = "md" }: { size?: IllustrationSize }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reducedMotion = useReducedMotion()

  const ease = reducedMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 80, damping: 20 }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showDrift, showSDE, showFormula, label } = steps[step]

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg viewBox="0 0 160 105" className={sizeClasses[size]} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.path d={driftD} fill="none" className="stroke-green-500 dark:stroke-green-400" strokeWidth="2" strokeDasharray="4 2" initial={{ opacity: 0 }} animate={{ opacity: showDrift ? 0.7 : 0 }} transition={ease} />
        {sdePaths.map((d, i) => (
          <motion.path key={i} d={d} fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" initial={{ opacity: 0 }} animate={{ opacity: showSDE ? 0.8 : 0 }} transition={ease} />
        ))}
        <circle cx="25" cy="70" r="4" className="fill-red-500 dark:fill-red-400" />
        <g fontSize="7" opacity="0.7">
          <line x1="10" y1="12" x2="20" y2="12" className="stroke-green-500" strokeWidth="2" strokeDasharray="3 1" />
          <text x="23" y="14" fill="currentColor">drift</text>
          <line x1="10" y1="22" x2="20" y2="22" className="stroke-blue-500" strokeWidth="1.5" />
          <text x="23" y="24" fill="currentColor">SDE</text>
        </g>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: showFormula ? 1 : 0 }} transition={ease}>
          <rect x="30" y="85" width="100" height="14" rx="3" className="fill-violet-500/20 dark:fill-violet-400/20" />
          <text x="80" y="95" fontSize="8" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400" fontWeight="bold">dX = u(X)dt + σdW</text>
        </motion.g>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
