"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "./illustration-controls"

const steps = [
  { phase: "cond1", label: "u(x|z₁): conditional on data point z₁" },
  { phase: "cond2", label: "u(x|z₂): different data, different direction" },
  { phase: "cond3", label: "u(x|z₃): each z defines a vector field" },
  { phase: "marginal", label: "u(x) = weighted average of conditionals" },
]

export function ConditionalMarginalIllustration({ size = "md" }: { size?: IllustrationSize }) {
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

  // Common point x where we evaluate vectors
  const origin = { x: 80, y: 55 }
  // Data points z1, z2, z3 in different locations
  const z1 = { x: 30, y: 25 }
  const z2 = { x: 130, y: 30 }
  const z3 = { x: 100, y: 85 }
  // Conditional vectors point toward their respective z
  const vec1 = { x: origin.x + (z1.x - origin.x) * 0.4, y: origin.y + (z1.y - origin.y) * 0.4 }
  const vec2 = { x: origin.x + (z2.x - origin.x) * 0.4, y: origin.y + (z2.y - origin.y) * 0.4 }
  const vec3 = { x: origin.x + (z3.x - origin.x) * 0.4, y: origin.y + (z3.y - origin.y) * 0.4 }
  // Marginal = weighted average (assume equal weights for viz)
  const marginal = {
    x: (vec1.x + vec2.x + vec3.x) / 3,
    y: (vec1.y + vec2.y + vec3.y) / 3,
  }

  const showCond = (n: number) => {
    if (phase === "marginal") return 0.3
    if (phase === "cond1" && n === 1) return 1
    if (phase === "cond2" && n <= 2) return n === 2 ? 1 : 0.5
    if (phase === "cond3") return n === 3 ? 1 : 0.5
    return 0
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg className={sizeClasses[size]} viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <defs>
          <marker id="cm-v1" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-red-500 dark:fill-red-400" />
          </marker>
          <marker id="cm-v2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-violet-500 dark:fill-violet-400" />
          </marker>
          <marker id="cm-v3" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-sky-500 dark:fill-sky-400" />
          </marker>
          <marker id="cm-marg" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-green-500 dark:fill-green-400" />
          </marker>
        </defs>

        {/* Data points z1, z2, z3 */}
        <motion.g initial={{ opacity: 1 }} animate={{ opacity: showCond(1) }} transition={ease}>
          <circle cx={z1.x} cy={z1.y} r="5" className="fill-red-500/30 dark:fill-red-400/30" />
          <circle cx={z1.x} cy={z1.y} r="3" className="fill-red-500 dark:fill-red-400" />
          <text x={z1.x} y={z1.y - 8} fontSize="6" textAnchor="middle" className="fill-red-500 dark:fill-red-400">z₁</text>
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: showCond(2) }} transition={ease}>
          <circle cx={z2.x} cy={z2.y} r="5" className="fill-violet-500/30 dark:fill-violet-400/30" />
          <circle cx={z2.x} cy={z2.y} r="3" className="fill-violet-500 dark:fill-violet-400" />
          <text x={z2.x} y={z2.y - 8} fontSize="6" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400">z₂</text>
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: showCond(3) }} transition={ease}>
          <circle cx={z3.x} cy={z3.y} r="5" className="fill-sky-500/30 dark:fill-sky-400/30" />
          <circle cx={z3.x} cy={z3.y} r="3" className="fill-sky-500 dark:fill-sky-400" />
          <text x={z3.x + 10} y={z3.y + 2} fontSize="6" className="fill-sky-500 dark:fill-sky-400">z₃</text>
        </motion.g>

        {/* Origin point x */}
        <circle cx={origin.x} cy={origin.y} r="5" className="fill-current/40" />
        <text x={origin.x - 10} y={origin.y + 3} fontSize="7" className="fill-current/70">x</text>

        {/* Conditional vectors */}
        <motion.line x1={origin.x} y1={origin.y} x2={vec1.x} y2={vec1.y} className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" markerEnd="url(#cm-v1)" initial={{ opacity: 1 }} animate={{ opacity: showCond(1) }} transition={ease} />
        <motion.line x1={origin.x} y1={origin.y} x2={vec2.x} y2={vec2.y} className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="2" markerEnd="url(#cm-v2)" initial={{ opacity: 0 }} animate={{ opacity: showCond(2) }} transition={ease} />
        <motion.line x1={origin.x} y1={origin.y} x2={vec3.x} y2={vec3.y} className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="2" markerEnd="url(#cm-v3)" initial={{ opacity: 0 }} animate={{ opacity: showCond(3) }} transition={ease} />

        {/* Marginal vector */}
        <motion.line x1={origin.x} y1={origin.y} x2={marginal.x} y2={marginal.y} className="stroke-green-500 dark:stroke-green-400" strokeWidth="2.5" markerEnd="url(#cm-marg)" initial={{ opacity: 0 }} animate={{ opacity: phase === "marginal" ? 1 : 0 }} transition={ease} />

        {/* Formula */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "marginal" ? 1 : 0 }} transition={ease}>
          <rect x="15" y="3" width="130" height="14" rx="3" className="fill-green-500/20 dark:fill-green-400/20" />
          <text x="80" y="13" fontSize="7" textAnchor="middle" className="fill-green-500 dark:fill-green-400" fontWeight="bold">u(x) = ∫ u(x|z)·w(z) dz</text>
        </motion.g>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
