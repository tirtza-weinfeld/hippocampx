"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "./illustration-controls"

const steps = [
  { showDist: true, showArrows: false, showFormula: false, label: "Distribution p(x) — probability density" },
  { showDist: true, showArrows: true, showFormula: false, label: "Score ∇log p(x) points uphill" },
  { showDist: true, showArrows: true, showFormula: true, label: "Follow score → climb to high prob region" },
]

// Gaussian curve points
const gaussian = (x: number, mu: number, sigma: number) =>
  Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI))

const curvePoints = Array.from({ length: 50 }, (_, i) => {
  const x = 20 + (i / 49) * 120
  const y = 80 - gaussian(x - 20, 60, 25) * 2000
  return { x, y }
})
const curveD = curvePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")

// Score arrows at different x positions
const arrowPositions = [35, 55, 95, 115]

export function ScoreFunctionIllustration({ size = "md" }: { size?: IllustrationSize }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reducedMotion = useReducedMotion()

  const ease = reducedMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 80, damping: 20 }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showDist, showArrows, showFormula, label } = steps[step]

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg className={sizeClasses[size]} viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <defs>
          <marker id="score-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-green-500 dark:fill-green-400" />
          </marker>
        </defs>

        {/* Baseline */}
        <line x1="20" y1="80" x2="140" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Gaussian distribution */}
        <motion.path d={curveD} fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" initial={{ opacity: 1 }} animate={{ opacity: showDist ? 1 : 0 }} transition={ease} />
        <motion.path d={`${curveD} L140,80 L20,80 Z`} className="fill-blue-500/20 dark:fill-blue-400/20" initial={{ opacity: 1 }} animate={{ opacity: showDist ? 1 : 0 }} transition={ease} />

        {/* Peak marker */}
        <circle cx="80" cy="25" r="3" className="fill-violet-500 dark:fill-violet-400" />
        <text x="80" y="18" fontSize="7" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400">peak</text>

        {/* Score arrows - point toward peak */}
        {arrowPositions.map((xPos, i) => {
          const yPos = 80 - gaussian(xPos - 20, 60, 25) * 2000 + 5
          const direction = xPos < 80 ? 1 : -1
          return (
            <motion.line key={i} x1={xPos} y1={yPos} x2={xPos + direction * 15} y2={yPos} className="stroke-green-500 dark:stroke-green-400" strokeWidth="2" markerEnd="url(#score-arr)" initial={{ opacity: 0 }} animate={{ opacity: showArrows ? 0.8 : 0 }} transition={ease} />
          )
        })}

        {/* Labels */}
        <text x="145" y="85" fontSize="7" fill="currentColor" opacity="0.5">x</text>
        <text x="12" y="25" fontSize="7" fill="currentColor" opacity="0.5">p(x)</text>

        {/* Formula */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: showFormula ? 1 : 0 }} transition={ease}>
          <rect x="30" y="88" width="100" height="14" rx="3" className="fill-green-500/20 dark:fill-green-400/20" />
          <text x="80" y="98" fontSize="8" textAnchor="middle" className="fill-green-500 dark:fill-green-400" fontWeight="bold">∇log p(x) → mode</text>
        </motion.g>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
