"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { phase: "drift", label: "u(x): deterministic velocity field" },
  { phase: "score", label: "(σ²/2)∇log p(x): score pulls toward density" },
  { phase: "noise", label: "σ·dW: stochastic diffusion" },
  { phase: "combined", label: "dx = [u + (σ²/2)∇log p]dt + σdW" },
]

export const SDESamplingScoresIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reducedMotion = useReducedMotion()

  const ease = reducedMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 80, damping: 20 }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { phase, label } = steps[step]

  // Starting point
  const origin = { x: 40, y: 55 }
  // Drift vector (deterministic flow)
  const drift = { x: 85, y: 45 }
  // Score vector (points toward high density region)
  const scoreEnd = { x: 60, y: 35 }
  // Noise wiggle (random)
  const noiseEnd = { x: 50, y: 65 }
  // Combined result
  const combined = { x: 95, y: 40 }

  const showDrift = phase === "drift" || phase === "combined"
  const showScore = phase === "score" || phase === "combined"
  const showNoise = phase === "noise" || phase === "combined"

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg width="160" height="105" viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <defs>
          <marker id="sde-drift" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
          <marker id="sde-score" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-green-500 dark:fill-green-400" />
          </marker>
          <marker id="sde-noise" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-violet-500 dark:fill-violet-400" />
          </marker>
          <marker id="sde-combined" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-red-500 dark:fill-red-400" />
          </marker>
        </defs>

        {/* High density region (target) */}
        <motion.g animate={{ opacity: showScore || phase === "combined" ? 1 : 0.3 }} transition={ease}>
          <ellipse cx="130" cy="25" rx="20" ry="15" className="fill-green-500/15 dark:fill-green-400/15" />
          <ellipse cx="130" cy="25" rx="12" ry="9" className="fill-green-500/25 dark:fill-green-400/25" />
          <text x="130" y="50" fontSize="6" textAnchor="middle" className="fill-green-500/70 dark:fill-green-400/70">p(x)</text>
        </motion.g>

        {/* Origin point X */}
        <circle cx={origin.x} cy={origin.y} r="5" className="fill-current/40" />
        <text x={origin.x - 10} y={origin.y + 3} fontSize="7" className="fill-current/70">X</text>

        {/* Drift vector (deterministic) */}
        <motion.g animate={{ opacity: showDrift ? 1 : 0.15 }} transition={ease}>
          <line x1={origin.x} y1={origin.y} x2={drift.x} y2={drift.y} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#sde-drift)" />
          <text x={drift.x + 5} y={drift.y - 2} fontSize="6" className="fill-blue-500 dark:fill-blue-400">u(x)</text>
        </motion.g>

        {/* Score vector */}
        <motion.g animate={{ opacity: showScore ? 1 : 0.15 }} transition={ease}>
          <line x1={origin.x} y1={origin.y} x2={scoreEnd.x} y2={scoreEnd.y} className="stroke-green-500 dark:stroke-green-400" strokeWidth="2" markerEnd="url(#sde-score)" />
          <text x={scoreEnd.x - 5} y={scoreEnd.y - 5} fontSize="5" className="fill-green-500 dark:fill-green-400">∇log p</text>
        </motion.g>

        {/* Noise vector (wiggly) */}
        <motion.g animate={{ opacity: showNoise ? 1 : 0.15 }} transition={ease}>
          <path d={`M${origin.x},${origin.y} Q${origin.x + 3},${origin.y + 5} ${origin.x + 5},${origin.y + 3} T${noiseEnd.x},${noiseEnd.y}`} className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="2" fill="none" markerEnd="url(#sde-noise)" />
          <text x={noiseEnd.x + 5} y={noiseEnd.y + 3} fontSize="6" className="fill-violet-500 dark:fill-violet-400">σdW</text>
        </motion.g>

        {/* Combined result */}
        <motion.g animate={{ opacity: phase === "combined" ? 1 : 0 }} transition={ease}>
          <line x1={origin.x} y1={origin.y} x2={combined.x} y2={combined.y} className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" markerEnd="url(#sde-combined)" />
          <circle cx={combined.x} cy={combined.y} r="3" className="fill-red-500/50 dark:fill-red-400/50" />
        </motion.g>

        {/* Formula bar */}
        <motion.g animate={{ opacity: phase === "combined" ? 1 : 0 }} transition={ease}>
          <rect x="10" y="85" width="140" height="14" rx="3" className="fill-red-500/20 dark:fill-red-400/20" />
          <text x="80" y="95" fontSize="6" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontWeight="bold">dX = [u + (σ²/2)∇log p]dt + σdW</text>
        </motion.g>

        {/* Sigma indicator */}
        <text x="10" y="15" fontSize="7" className="fill-current/50">σ &gt; 0</text>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
