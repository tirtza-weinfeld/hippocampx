"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "./illustration-controls"

const steps = [
  { phase: "sample", label: "1. Sample z~p_data, ε~N(0,I), t~U(0,1)" },
  { phase: "interpolate", label: "2. Compute x = αₜz + βₜε" },
  { phase: "predict", label: "3. Network predicts u_θ(x,t)" },
  { phase: "loss", label: "4. Loss = ||u_θ - u_target||²" },
]

export function FlowMatchingLossIllustration({ size = "md" }: { size?: IllustrationSize }) {
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

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg className={sizeClasses[size]} viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Data point z */}
        <motion.g initial={{ opacity: 1 }} animate={{ opacity: phase !== "loss" ? 1 : 0.4 }} transition={ease}>
          <circle cx="25" cy="35" r="8" className="fill-green-500/30 dark:fill-green-400/30" />
          <circle cx="25" cy="35" r="4" className="fill-green-500 dark:fill-green-400" />
          <text x="25" y="52" fontSize="7" textAnchor="middle" className="fill-green-500 dark:fill-green-400">z</text>
        </motion.g>

        {/* Noise ε */}
        <motion.g initial={{ opacity: 1 }} animate={{ opacity: phase !== "loss" ? 1 : 0.4 }} transition={ease}>
          <circle cx="25" cy="75" r="8" className="fill-violet-500/30 dark:fill-violet-400/30" />
          <circle cx="25" cy="75" r="4" className="fill-violet-500 dark:fill-violet-400" />
          <text x="25" y="92" fontSize="7" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400">ε</text>
        </motion.g>

        {/* Interpolated x */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "sample" ? 0 : 1 }} transition={ease}>
          <line x1="35" y1="40" x2="55" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1="35" y1="70" x2="55" y2="58" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="65" cy="55" r="6" className="fill-blue-500 dark:fill-blue-400" />
          <text x="65" y="70" fontSize="7" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400">x</text>
        </motion.g>

        {/* Neural network */}
        <motion.g initial={{ opacity: 0.3 }} animate={{ opacity: phase === "sample" || phase === "interpolate" ? 0.3 : 1 }} transition={ease}>
          <rect x="85" y="45" width="30" height="20" rx="4" className="fill-sky-500/20 dark:fill-sky-400/20 stroke-sky-500 dark:stroke-sky-400" strokeWidth="1" />
          <text x="100" y="58" fontSize="7" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400">u_θ</text>
          <line x1="75" y1="55" x2="85" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </motion.g>

        {/* Predicted vector */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "predict" || phase === "loss" ? 1 : 0 }} transition={ease}>
          <line x1="120" y1="55" x2="145" y2="45" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
          <circle cx="145" cy="45" r="2" className="fill-red-500 dark:fill-red-400" />
          <text x="145" y="40" fontSize="6" className="fill-red-500 dark:fill-red-400">pred</text>
        </motion.g>

        {/* Target vector */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "loss" ? 1 : 0 }} transition={ease}>
          <line x1="120" y1="55" x2="148" y2="38" className="stroke-green-500 dark:stroke-green-400" strokeWidth="2" strokeDasharray="3 1" />
          <circle cx="148" cy="38" r="2" className="fill-green-500 dark:fill-green-400" />
          <text x="148" y="33" fontSize="6" className="fill-green-500 dark:fill-green-400">target</text>
        </motion.g>

        {/* Loss formula */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: phase === "loss" ? 1 : 0 }} transition={ease}>
          <rect x="25" y="5" width="110" height="16" rx="3" className="fill-red-500/20 dark:fill-red-400/20" />
          <text x="80" y="16" fontSize="8" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontWeight="bold">L = ||u_θ(x,t) - u*||²</text>
        </motion.g>

        {/* t indicator */}
        <text x="75" y="78" fontSize="7" className="fill-current/50">t~U(0,1)</text>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
