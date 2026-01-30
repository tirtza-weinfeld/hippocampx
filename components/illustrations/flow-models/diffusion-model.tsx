"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "./illustration-controls"

const steps = [
  { t: 0, dir: "forward", showArrow: false, label: "Start with data x₀" },
  { t: 0.5, dir: "forward", showArrow: true, label: "Forward: add noise progressively" },
  { t: 1, dir: "forward", showArrow: true, label: "At t=1: pure noise ε ~ N(0,I)" },
  { t: 0.5, dir: "reverse", showArrow: true, label: "Reverse: learn to denoise" },
  { t: 0, dir: "reverse", showArrow: false, label: "Generate: sample noise → data" },
]

const dataX = 30, noiseX = 130

export function DiffusionModelIllustration({ size = "md" }: { size?: IllustrationSize }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reducedMotion = useReducedMotion()

  const ease = reducedMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 80, damping: 20 }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { t, dir, showArrow, label } = steps[step]
  const cx = dataX + t * (noiseX - dataX)
  const blur = t * 8

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg viewBox="0 0 160 105" className={sizeClasses[size]} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <defs>
          <filter id="blur"><feGaussianBlur stdDeviation={blur} /></filter>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" opacity="0.6" />
          </marker>
        </defs>

        <line x1="25" y1="85" x2="135" y2="85" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <text x="25" y="98" fontSize="7" fill="currentColor" opacity="0.5">t=0</text>
        <text x="125" y="98" fontSize="7" fill="currentColor" opacity="0.5">t=1</text>
        <text x="75" y="98" fontSize="7" fill="currentColor" opacity="0.5">{dir === "forward" ? "→ noise" : "← denoise"}</text>

        <motion.g animate={{ x: cx - dataX }} transition={ease}>
          <circle cx={dataX} cy={52} r="12" className="fill-blue-500/30 dark:fill-blue-400/30" filter={blur > 0 ? "url(#blur)" : undefined} />
          <circle cx={dataX} cy={52} r="6" className="fill-blue-500 dark:fill-blue-400" />
        </motion.g>

        <motion.line x1={dir === "forward" ? 50 : 110} y1="52" x2={dir === "forward" ? 90 : 70} y2="52" className={dir === "forward" ? "stroke-red-500" : "stroke-green-500"} strokeWidth="2" markerEnd="url(#arr)" initial={{ opacity: 0 }} animate={{ opacity: showArrow ? 1 : 0 }} transition={ease} />

        <text x="30" y="30" fontSize="8" className="fill-blue-500 dark:fill-blue-400">x₀ (data)</text>
        <text x="110" y="30" fontSize="8" className="fill-violet-500 dark:fill-violet-400">ε (noise)</text>
      </motion.svg>
      <p className="text-xs text-center text-current/80 h-4">{label}</p>
      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
