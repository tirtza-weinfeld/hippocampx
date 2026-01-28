"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { showF: false, showf: true, showDerivArrow: false, showAntiArrow: false, showCycle: false, label: "Start with a function f(x)" },
  { showF: true, showf: true, showDerivArrow: false, showAntiArrow: false, showCycle: false, label: "F(x) is the antiderivative" },
  { showF: true, showf: true, showDerivArrow: true, showAntiArrow: false, showCycle: false, label: "d/dx takes F(x) → f(x)" },
  { showF: true, showf: true, showDerivArrow: true, showAntiArrow: true, showCycle: false, label: "∫ takes f(x) → F(x)" },
  { showF: true, showf: true, showDerivArrow: true, showAntiArrow: true, showCycle: true, label: "They are inverse operations!" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const AntiderivativeIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showF, showf, showDerivArrow, showAntiArrow, showCycle, label } = steps[step]

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        width="160"
        height="105"
        viewBox="0 0 160 105"
        overflow="hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Cycle circle (dashed) */}
        <motion.circle
          cx="80"
          cy="50"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4,3"
          opacity="0.3"
          animate={{ opacity: showCycle ? 0.4 : 0 }}
          transition={ease}
        />

        {/* f(x) label at top */}
        <motion.g animate={{ opacity: showf ? 1 : 0 }} transition={ease}>
          <rect x="60" y="12" width="40" height="18" rx="3" className="fill-blue-500/20 dark:fill-blue-400/20" />
          <text x="80" y="25" fontSize="12" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontWeight="bold">
            f(x)
          </text>
        </motion.g>

        {/* F(x) label at bottom */}
        <motion.g animate={{ opacity: showF ? 1 : 0 }} transition={ease}>
          <rect x="60" y="70" width="40" height="18" rx="3" className="fill-green-500/20 dark:fill-green-400/20" />
          <text x="80" y="83" fontSize="12" textAnchor="middle" className="fill-green-500 dark:fill-green-400" fontWeight="bold">
            F(x)
          </text>
        </motion.g>

        {/* Derivative arrow (right side, going down) */}
        <motion.path
          d="M105 30 Q120 50 105 70"
          className="stroke-red-500 dark:stroke-red-400"
          strokeWidth="2"
          fill="none"
          animate={{ opacity: showDerivArrow ? 1 : 0 }}
          transition={ease}
        />
        <motion.polygon
          points="105,70 100,62 110,62"
          className="fill-red-500 dark:fill-red-400"
          animate={{ opacity: showDerivArrow ? 1 : 0 }}
          transition={ease}
        />
        <motion.text
          x="128"
          y="52"
          fontSize="9"
          className="fill-red-500 dark:fill-red-400"
          fontWeight="bold"
          animate={{ opacity: showDerivArrow ? 1 : 0 }}
          transition={ease}
        >
          d/dx
        </motion.text>

        {/* Antiderivative arrow (left side, going up) */}
        <motion.path
          d="M55 70 Q40 50 55 30"
          className="stroke-green-500 dark:stroke-green-400"
          strokeWidth="2"
          fill="none"
          animate={{ opacity: showAntiArrow ? 1 : 0 }}
          transition={ease}
        />
        <motion.polygon
          points="55,30 50,38 60,38"
          className="fill-green-500 dark:fill-green-400"
          animate={{ opacity: showAntiArrow ? 1 : 0 }}
          transition={ease}
        />
        <motion.text
          x="22"
          y="52"
          fontSize="9"
          className="fill-green-500 dark:fill-green-400"
          fontWeight="bold"
          animate={{ opacity: showAntiArrow ? 1 : 0 }}
          transition={ease}
        >
          ∫ dx
        </motion.text>
      </motion.svg>

      <p className="text-xs text-center text-current/80 h-4">{label}</p>

      <IllustrationControls
        step={step}
        totalSteps={steps.length}
        playing={playing}
        onStep={setStep}
        onPlayingChange={setPlaying}
      />
    </div>
  )
}
