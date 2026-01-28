"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { phase: "init", label: "X₀ = x₀: start at initial condition" },
  { phase: "velocity", label: "u(X): vector field gives velocity at X" },
  { phase: "follow", label: "dX/dt = u(X): trajectory follows velocity" },
  { phase: "flow", label: "ψₜ(x₀) = Xₜ: flow maps start to end" },
]

export const ODEIllustration = () => {
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

  // Trajectory points
  const start = { x: 25, y: 70 }
  const mid1 = { x: 50, y: 55 }
  const mid2 = { x: 80, y: 45 }
  const end = { x: 120, y: 35 }

  // Progress along trajectory
  const progress = phase === "init" ? 0 : phase === "velocity" ? 0.3 : phase === "follow" ? 0.7 : 1

  // Current position
  const currentX = start.x + progress * (end.x - start.x)
  const currentY = start.y + progress * (end.y - start.y)

  // Velocity vector at current position
  const velLength = 20
  const velAngle = -0.4 // slight upward angle

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg width="160" height="105" viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <defs>
          <marker id="ode-vel" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
          <marker id="ode-flow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-green-500 dark:fill-green-400" />
          </marker>
        </defs>

        {/* Background vector field (faint arrows) */}
        <g opacity="0.15">
          {[20, 50, 80, 110, 140].map(x =>
            [25, 50, 75].map(y => (
              <line key={`${x}-${y}`} x1={x} y1={y} x2={x + 12} y2={y - 5} stroke="currentColor" strokeWidth="1" markerEnd="url(#ode-vel)" />
            ))
          )}
        </g>

        {/* Trajectory path */}
        <motion.path
          d={`M${start.x},${start.y} Q${mid1.x},${mid1.y} ${mid2.x},${mid2.y} T${end.x},${end.y}`}
          fill="none"
          className="stroke-violet-500/50 dark:stroke-violet-400/50"
          strokeWidth="2"
          strokeDasharray="4 2"
          animate={{ opacity: phase === "follow" || phase === "flow" ? 1 : 0.3 }}
          transition={ease}
        />

        {/* Start point x₀ */}
        <circle cx={start.x} cy={start.y} r="5" className="fill-red-500 dark:fill-red-400" />
        <text x={start.x} y={start.y + 15} fontSize="7" textAnchor="middle" className="fill-red-500 dark:fill-red-400">x₀</text>

        {/* End point (flow result) */}
        <motion.g animate={{ opacity: phase === "flow" ? 1 : 0.3 }} transition={ease}>
          <circle cx={end.x} cy={end.y} r="5" className="fill-green-500/30 dark:fill-green-400/30" />
          <circle cx={end.x} cy={end.y} r="3" className="fill-green-500 dark:fill-green-400" />
          <text x={end.x + 10} y={end.y + 3} fontSize="7" className="fill-green-500 dark:fill-green-400">ψₜ(x₀)</text>
        </motion.g>

        {/* Current position X */}
        <motion.g animate={{ x: currentX - start.x, y: currentY - start.y }} transition={ease}>
          <circle cx={start.x} cy={start.y} r="4" className="fill-blue-500 dark:fill-blue-400" />
          <text x={start.x - 10} y={start.y - 5} fontSize="7" className="fill-blue-500 dark:fill-blue-400">X</text>
        </motion.g>

        {/* Velocity vector at current position */}
        <motion.g animate={{ opacity: phase === "velocity" || phase === "follow" ? 1 : 0, x: currentX - start.x, y: currentY - start.y }} transition={ease}>
          <line x1={start.x} y1={start.y} x2={start.x + velLength * Math.cos(velAngle)} y2={start.y + velLength * Math.sin(velAngle)} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#ode-vel)" />
          <text x={start.x + velLength + 5} y={start.y - 8} fontSize="6" className="fill-blue-500 dark:fill-blue-400">u(X)</text>
        </motion.g>

        {/* Flow arrow (direct mapping) */}
        <motion.g animate={{ opacity: phase === "flow" ? 1 : 0 }} transition={ease}>
          <line x1={start.x + 8} y1={start.y - 5} x2={end.x - 8} y2={end.y + 5} className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#ode-flow)" />
        </motion.g>

        {/* Formula bar */}
        <rect x="20" y="3" width="120" height="14" rx="3" className="fill-sky-500/10 dark:fill-sky-400/10" />
        <text x="80" y="13" fontSize="7" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontWeight="bold">
          dX/dt = u(X), X₀ = x₀
        </text>

        {/* Time indicator */}
        <text x="140" y="75" fontSize="6" className="fill-current/50">t: 0→1</text>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
