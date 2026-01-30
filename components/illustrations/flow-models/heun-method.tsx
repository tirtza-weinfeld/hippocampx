"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "./illustration-controls"

const steps = [
  { phase: "start", label: "Start at Xₜ, compute u(Xₜ)" },
  { phase: "euler", label: "Euler guess: X'= Xₜ + h·u(Xₜ)" },
  { phase: "avg", label: "Evaluate u at guessed point X'" },
  { phase: "final", label: "Heun: Xₜ₊ₕ = Xₜ + h/2·(u(Xₜ) + u(X'))" },
]

export function HeunMethodIllustration({ size = "md" }: { size?: IllustrationSize }) {
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

  // Points
  const start = { x: 30, y: 70 }
  const eulerGuess = { x: 80, y: 45 } // X' = initial Euler step
  const heunFinal = { x: 85, y: 40 } // Heun corrected position (better)

  // Velocity vectors
  const v1 = { dx: 35, dy: -18 } // u(Xₜ)
  const v2 = { dx: 30, dy: -12 } // u(X')

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg className={sizeClasses[size]} viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <defs>
          <marker id="heun-v1" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
          <marker id="heun-v2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-violet-500 dark:fill-violet-400" />
          </marker>
        </defs>

        {/* True curve (reference) */}
        <path d="M30,70 Q60,50 90,37 T140,22" fill="none" className="stroke-green-500/40 dark:stroke-green-400/40" strokeWidth="2" strokeDasharray="4 2" />

        {/* Start point */}
        <circle cx={start.x} cy={start.y} r="5" className="fill-red-500 dark:fill-red-400" />
        <text x={start.x - 12} y={start.y + 12} fontSize="8" className="fill-red-500 dark:fill-red-400">Xₜ</text>

        {/* Velocity at start u(Xₜ) */}
        <motion.g initial={{ opacity: 1 }} animate={{ opacity: phase !== "start" ? 0.4 : 1 }} transition={ease}>
          <line x1={start.x} y1={start.y} x2={start.x + v1.dx} y2={start.y + v1.dy} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#heun-v1)" />
          <text x={start.x + v1.dx / 2 - 8} y={start.y + v1.dy / 2 - 5} fontSize="6" className="fill-blue-500 dark:fill-blue-400">u(Xₜ)</text>
        </motion.g>

        {/* Euler guess X' */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "euler" || phase === "avg" || phase === "final" ? 1 : 0 }} transition={ease}>
          <line x1={start.x} y1={start.y} x2={eulerGuess.x} y2={eulerGuess.y} className="stroke-orange-500/50 dark:stroke-orange-400/50" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx={eulerGuess.x} cy={eulerGuess.y} r="4" className="fill-orange-500/60 dark:fill-orange-400/60" />
          <text x={eulerGuess.x + 5} y={eulerGuess.y - 3} fontSize="7" className="fill-orange-500 dark:fill-orange-400">X'</text>
        </motion.g>

        {/* Velocity at guessed point u(X') */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "avg" || phase === "final" ? 1 : 0 }} transition={ease}>
          <line x1={eulerGuess.x} y1={eulerGuess.y} x2={eulerGuess.x + v2.dx} y2={eulerGuess.y + v2.dy} className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="2" markerEnd="url(#heun-v2)" />
          <text x={eulerGuess.x + v2.dx + 3} y={eulerGuess.y + v2.dy} fontSize="6" className="fill-violet-500 dark:fill-violet-400">u(X')</text>
        </motion.g>

        {/* Heun final position */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "final" ? 1 : 0 }} transition={ease}>
          <line x1={start.x} y1={start.y} x2={heunFinal.x} y2={heunFinal.y} className="stroke-green-500 dark:stroke-green-400" strokeWidth="2.5" />
          <circle cx={heunFinal.x} cy={heunFinal.y} r="5" className="fill-green-500 dark:fill-green-400" />
          <text x={heunFinal.x + 6} y={heunFinal.y + 3} fontSize="7" className="fill-green-500 dark:fill-green-400">Xₜ₊ₕ</text>
        </motion.g>

        {/* Legend */}
        <g fontSize="6" opacity="0.7">
          <line x1="10" y1="10" x2="20" y2="10" className="stroke-green-500/40" strokeWidth="2" strokeDasharray="3 1" />
          <text x="23" y="12" fill="currentColor">true</text>
          <line x1="10" y1="18" x2="20" y2="18" className="stroke-orange-500/50" strokeWidth="1.5" strokeDasharray="2 1" />
          <text x="23" y="20" fill="currentColor">Euler</text>
          <line x1="10" y1="26" x2="20" y2="26" className="stroke-green-500" strokeWidth="2" />
          <text x="23" y="28" fill="currentColor">Heun</text>
        </g>

        {/* Formula */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "final" ? 1 : 0 }} transition={ease}>
          <rect x="15" y="85" width="130" height="14" rx="3" className="fill-sky-500/20 dark:fill-sky-400/20" />
          <text x="80" y="95" fontSize="6.5" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontWeight="bold">Xₜ₊ₕ = Xₜ + (h/2)·(u(Xₜ) + u(X'))</text>
        </motion.g>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
