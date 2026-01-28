"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { showBridge: false, showSupports: false, showDerivatives: false, showIntegrals: false, showFTC: false, showFormula: false, label: "Two fundamental operations in calculus" },
  { showBridge: false, showSupports: false, showDerivatives: true, showIntegrals: false, showFTC: false, showFormula: false, label: "Derivatives: find rates of change" },
  { showBridge: false, showSupports: false, showDerivatives: true, showIntegrals: true, showFTC: false, showFormula: false, label: "Integrals: find accumulated area" },
  { showBridge: true, showSupports: true, showDerivatives: true, showIntegrals: true, showFTC: false, showFormula: false, label: "The FTC connects them!" },
  { showBridge: true, showSupports: true, showDerivatives: true, showIntegrals: true, showFTC: true, showFormula: false, label: "They are inverse operations" },
  { showBridge: true, showSupports: true, showDerivatives: true, showIntegrals: true, showFTC: true, showFormula: true, label: "∫ₐᵇ f(x)dx = F(b) - F(a)" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const FundamentalTheoremIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showBridge, showSupports, showDerivatives, showIntegrals, showFTC, showFormula, label } = steps[step]

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
        {/* Ground line */}
        <line x1="10" y1="75" x2="150" y2="75" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Bridge arc */}
        <motion.path
          d="M25 60 Q80 20 135 60"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          animate={{ opacity: showBridge ? 0.8 : 0 }}
          transition={ease}
        />

        {/* Bridge supports */}
        <motion.line x1="45" y1="50" x2="45" y2="75" stroke="currentColor" strokeWidth="2" animate={{ opacity: showSupports ? 0.6 : 0 }} transition={ease} />
        <motion.line x1="80" y1="35" x2="80" y2="75" stroke="currentColor" strokeWidth="2" animate={{ opacity: showSupports ? 0.6 : 0 }} transition={ease} />
        <motion.line x1="115" y1="50" x2="115" y2="75" stroke="currentColor" strokeWidth="2" animate={{ opacity: showSupports ? 0.6 : 0 }} transition={ease} />

        {/* Derivatives label (left) */}
        <motion.g animate={{ opacity: showDerivatives ? 1 : 0 }} transition={ease}>
          <rect x="15" y="10" width="55" height="16" rx="3" className="fill-blue-500/20 dark:fill-blue-400/20" />
          <text x="42" y="22" fontSize="9" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontWeight="bold">
            Derivatives
          </text>
        </motion.g>

        {/* Integrals label (right) */}
        <motion.g animate={{ opacity: showIntegrals ? 1 : 0 }} transition={ease}>
          <rect x="90" y="10" width="55" height="16" rx="3" className="fill-green-500/20 dark:fill-green-400/20" />
          <text x="117" y="22" fontSize="9" textAnchor="middle" className="fill-green-500 dark:fill-green-400" fontWeight="bold">
            Integrals
          </text>
        </motion.g>

        {/* FTC label on bridge */}
        <motion.g animate={{ opacity: showFTC ? 1 : 0 }} transition={ease}>
          <rect x="65" y="30" width="30" height="14" rx="2" className="fill-red-500/20 dark:fill-red-400/20" />
          <text x="80" y="40" fontSize="10" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontWeight="bold">
            FTC
          </text>
        </motion.g>

        {/* Formula at bottom */}
        <motion.text
          x="80"
          y="92"
          fontSize="9"
          textAnchor="middle"
          className="fill-violet-500 dark:fill-violet-400"
          fontWeight="bold"
          animate={{ opacity: showFormula ? 1 : 0 }}
          transition={ease}
        >
          ∫ₐᵇ f(x)dx = F(b) - F(a)
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
