"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { phase: "init", label: "X₀ ~ p_init: sample from Gaussian noise" },
  { phase: "network", label: "Neural network u^θ defines vector field" },
  { phase: "simulate", label: "Simulate ODE: dX/dt = u^θ(X)" },
  { phase: "sample", label: "X₁ ~ p_data: endpoint is our sample" },
]

export const FlowModelIllustration = () => {
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

  // Progress through trajectory
  const progress = phase === "init" ? 0 : phase === "network" ? 0.3 : phase === "simulate" ? 0.7 : 1

  // Noise cloud (left) and data manifold (right)
  const noiseX = 30, dataX = 130

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg width="160" height="105" viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <defs>
          <marker id="fm-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
        </defs>

        {/* Timeline */}
        <line x1="25" y1="90" x2="135" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <text x="25" y="100" fontSize="7" fill="currentColor" opacity="0.5">t=0</text>
        <text x="125" y="100" fontSize="7" fill="currentColor" opacity="0.5">t=1</text>

        {/* Noise distribution (Gaussian cloud) */}
        <motion.g animate={{ opacity: phase === "init" ? 1 : 0.4 }} transition={ease}>
          <ellipse cx={noiseX} cy="50" rx="18" ry="25" className="fill-violet-500/20 dark:fill-violet-400/20" />
          <ellipse cx={noiseX} cy="50" rx="10" ry="15" className="fill-violet-500/30 dark:fill-violet-400/30" />
          <text x={noiseX} y="82" fontSize="7" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400">p_init</text>
        </motion.g>

        {/* Data manifold (structured shape) */}
        <motion.g animate={{ opacity: phase === "sample" ? 1 : 0.4 }} transition={ease}>
          <ellipse cx={dataX} cy="45" rx="12" ry="8" className="fill-green-500/30 dark:fill-green-400/30" />
          <ellipse cx={dataX - 5} cy="60" rx="10" ry="6" className="fill-green-500/30 dark:fill-green-400/30" />
          <text x={dataX} y="82" fontSize="7" textAnchor="middle" className="fill-green-500 dark:fill-green-400">p_data</text>
        </motion.g>

        {/* Neural network box */}
        <motion.g animate={{ opacity: phase === "network" || phase === "simulate" ? 1 : 0.3 }} transition={ease}>
          <rect x="68" y="15" width="24" height="20" rx="3" className="fill-sky-500/20 dark:fill-sky-400/20 stroke-sky-500 dark:stroke-sky-400" strokeWidth="1" />
          <text x="80" y="28" fontSize="7" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400">u^θ</text>
        </motion.g>

        {/* Trajectory from noise to data */}
        <motion.path
          d="M48,50 Q70,45 80,48 T100,45 T130,45"
          fill="none"
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2"
          strokeDasharray="150"
          animate={{ strokeDashoffset: 150 * (1 - progress) }}
          transition={ease}
        />

        {/* Moving point */}
        <motion.g animate={{ x: (dataX - noiseX) * progress }} transition={ease}>
          <circle cx={noiseX + 18} cy="50" r="5" className="fill-blue-500 dark:fill-blue-400" />
          {phase === "init" && <text x={noiseX + 28} y="52" fontSize="7" className="fill-blue-500 dark:fill-blue-400">X₀</text>}
          {phase === "sample" && <text x={noiseX + 28} y="52" fontSize="7" className="fill-green-500 dark:fill-green-400">X₁</text>}
        </motion.g>

        {/* Small velocity arrows along path */}
        <motion.g animate={{ opacity: phase === "network" || phase === "simulate" ? 0.6 : 0 }} transition={ease}>
          {[60, 80, 100].map((x, i) => (
            <line key={i} x1={x} y1={48} x2={x + 10} y2={46} className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="1" markerEnd="url(#fm-arrow)" />
          ))}
        </motion.g>

        {/* Algorithm indicator */}
        <motion.g animate={{ opacity: phase === "simulate" || phase === "sample" ? 1 : 0 }} transition={ease}>
          <rect x="55" y="65" width="50" height="12" rx="2" className="fill-blue-500/20 dark:fill-blue-400/20" />
          <text x="80" y="74" fontSize="6" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400">ODE solver</text>
        </motion.g>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
