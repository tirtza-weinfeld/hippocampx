"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "./illustration-controls"

const steps = [
  { phase: "uncond", label: "u(x|∅): unconditional prediction" },
  { phase: "cond", label: "u(x|y): conditional prediction" },
  { phase: "guided", label: "ũ = (1-w)·u(∅) + w·u(y), w=1.5" },
  { phase: "compare", label: "CFG extrapolates beyond conditional" },
]

export function ClassifierFreeGuidanceIllustration({ size = "md" }: { size?: IllustrationSize }) {
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

  // Vector endpoints from common origin
  const origin = { x: 40, y: 55 }
  const uncond = { x: 90, y: 65 }   // Unconditional: slight downward
  const cond = { x: 100, y: 45 }    // Conditional: upward toward target
  // Guided: extrapolate beyond conditional (w=1.5)
  const w = 1.5
  const guided = {
    x: (1 - w) * uncond.x + w * cond.x,
    y: (1 - w) * uncond.y + w * cond.y,
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg className={sizeClasses[size]} viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <defs>
          <marker id="cfg-uncond" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-violet-500 dark:fill-violet-400" />
          </marker>
          <marker id="cfg-cond" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
          <marker id="cfg-guided" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-green-500 dark:fill-green-400" />
          </marker>
        </defs>

        {/* Origin point (x) */}
        <circle cx={origin.x} cy={origin.y} r="5" className="fill-current/30" />
        <text x={origin.x} y={origin.y + 18} fontSize="7" textAnchor="middle" className="fill-current/70">x</text>

        {/* Conditioning target */}
        <motion.g initial={{ opacity: 0.3 }} animate={{ opacity: phase !== "uncond" ? 1 : 0.3 }} transition={ease}>
          <circle cx="130" cy="25" r="8" className="fill-sky-500/20 dark:fill-sky-400/20" />
          <circle cx="130" cy="25" r="4" className="fill-sky-500 dark:fill-sky-400" />
          <text x="130" y="15" fontSize="6" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400">y</text>
        </motion.g>

        {/* Unconditional vector */}
        <motion.g initial={{ opacity: 1 }} animate={{ opacity: phase === "uncond" || phase === "compare" ? 1 : 0.3 }} transition={ease}>
          <line x1={origin.x} y1={origin.y} x2={uncond.x} y2={uncond.y} className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="2" markerEnd="url(#cfg-uncond)" />
          <text x={uncond.x + 5} y={uncond.y + 5} fontSize="6" className="fill-violet-500 dark:fill-violet-400">u(∅)</text>
        </motion.g>

        {/* Conditional vector */}
        <motion.g initial={{ opacity: 0.3 }} animate={{ opacity: phase === "cond" || phase === "compare" ? 1 : 0.3 }} transition={ease}>
          <line x1={origin.x} y1={origin.y} x2={cond.x} y2={cond.y} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#cfg-cond)" />
          <text x={cond.x + 5} y={cond.y - 2} fontSize="6" className="fill-blue-500 dark:fill-blue-400">u(y)</text>
        </motion.g>

        {/* Guided vector (extrapolated) */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "guided" || phase === "compare" ? 1 : 0 }} transition={ease}>
          <line x1={origin.x} y1={origin.y} x2={guided.x} y2={guided.y} className="stroke-green-500 dark:stroke-green-400" strokeWidth="2.5" markerEnd="url(#cfg-guided)" />
          <text x={guided.x + 5} y={guided.y - 2} fontSize="6" className="fill-green-500 dark:fill-green-400" fontWeight="bold">ũ</text>
        </motion.g>

        {/* Formula bar */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "guided" || phase === "compare" ? 1 : 0 }} transition={ease}>
          <rect x="15" y="85" width="130" height="14" rx="3" className="fill-green-500/20 dark:fill-green-400/20" />
          <text x="80" y="95" fontSize="7" textAnchor="middle" className="fill-green-500 dark:fill-green-400" fontWeight="bold">ũ = (1-w)·u(∅) + w·u(y)</text>
        </motion.g>

        {/* w indicator */}
        <text x="10" y="15" fontSize="7" className="fill-current/50">w = 1.5</text>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
