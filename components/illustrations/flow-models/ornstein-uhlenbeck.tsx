"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "./illustration-controls"

const steps = [
  { sigma: 0, label: "σ=0: deterministic flow to origin (ODE)" },
  { sigma: 0.25, label: "σ=0.25: slight noise, still converges" },
  { sigma: 0.5, label: "σ=0.5: more noise, wider spread" },
  { sigma: 1, label: "σ=1: high noise → Gaussian N(0, σ²/2θ)" },
]

// Pre-computed OU paths for different sigma values
const generateOUPath = (sigma: number, seed: number): string => {
  const pts: { x: number; y: number }[] = [{ x: 25, y: 20 + seed * 15 }]
  const theta = 0.25
  const h = 0.025

  for (let i = 1; i <= 50; i++) {
    const prev = pts[i - 1]
    // dX = -θX dt + σ dW
    const drift = -theta * (prev.y - 52) * h * 50 // Pull toward center (y=52)
    const noise = sigma * Math.sin(seed * i * 0.8 + seed * 10) * 8
    const newY = prev.y + drift + noise
    pts.push({ x: prev.x + 2.6, y: Math.max(10, Math.min(95, newY)) })
  }

  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
}

const paths = {
  0: [generateOUPath(0, 1), generateOUPath(0, 2), generateOUPath(0, 3)],
  0.25: [generateOUPath(0.25, 1), generateOUPath(0.25, 2), generateOUPath(0.25, 3)],
  0.5: [generateOUPath(0.5, 1), generateOUPath(0.5, 2), generateOUPath(0.5, 3)],
  1: [generateOUPath(1, 1), generateOUPath(1, 2), generateOUPath(1, 3)],
}

const colors = [
  "stroke-blue-500 dark:stroke-blue-400",
  "stroke-violet-500 dark:stroke-violet-400",
  "stroke-green-500 dark:stroke-green-400",
]

export function OrnsteinUhlenbeckIllustration({ size = "md" }: { size?: IllustrationSize }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reducedMotion = useReducedMotion()

  const ease = reducedMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 80, damping: 20 }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { sigma, label } = steps[step]
  const currentPaths = paths[sigma as keyof typeof paths]

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg className={sizeClasses[size]} viewBox="0 0 160 105" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Center line (equilibrium) */}
        <line x1="20" y1="52" x2="145" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeDasharray="4 2" />
        <text x="148" y="54" fontSize="6" fill="currentColor" opacity="0.4">0</text>

        {/* Time axis */}
        <line x1="25" y1="95" x2="140" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <text x="80" y="102" fontSize="6" fill="currentColor" opacity="0.4">time t</text>

        {/* OU trajectories */}
        {currentPaths.map((d, i) => (
          <motion.path
            key={`${sigma}-${i}`}
            d={d}
            fill="none"
            className={colors[i]}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={ease}
          />
        ))}

        {/* Starting points */}
        {[20, 35, 50].map((y, i) => (
          <circle key={i} cx="25" cy={y + 15} r="3" className={colors[i].replace("stroke", "fill")} />
        ))}

        {/* Stationary distribution indicator for high sigma */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: sigma >= 0.5 ? 0.4 : 0 }} transition={ease}>
          <ellipse cx="140" cy="52" rx="3" ry={10 + sigma * 15} className="fill-current/10 stroke-current/30" strokeWidth="1" />
        </motion.g>

        {/* Formula */}
        <rect x="30" y="5" width="100" height="14" rx="3" className="fill-sky-500/10 dark:fill-sky-400/10" />
        <text x="80" y="15" fontSize="7" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontWeight="bold">
          dX = -θX dt + σdW
        </text>

        {/* Sigma indicator */}
        <text x="10" y="15" fontSize="7" className="fill-current/60">σ={sigma}</text>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
