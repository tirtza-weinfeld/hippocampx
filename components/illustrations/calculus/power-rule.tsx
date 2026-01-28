"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { showOriginal: true, showArrow: false, showResult: false, showStep1: false, showStep2: false, label: "Start with x³" },
  { showOriginal: true, showArrow: true, showResult: false, showStep1: false, showStep2: false, label: "Apply the power rule..." },
  { showOriginal: true, showArrow: true, showResult: false, showStep1: true, showStep2: false, label: "Step 1: Bring down the exponent" },
  { showOriginal: true, showArrow: true, showResult: false, showStep1: true, showStep2: true, label: "Step 2: Reduce power by 1" },
  { showOriginal: true, showArrow: true, showResult: true, showStep1: true, showStep2: true, label: "Result: 3x²" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const PowerRuleIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showOriginal, showArrow, showResult, showStep1, showStep2, label } = steps[step]

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
        {/* Original term x³ */}
        <motion.g animate={{ opacity: showOriginal ? 1 : 0 }} transition={ease}>
          <rect x="20" y="15" width="35" height="22" rx="3" className="fill-blue-500/20 dark:fill-blue-400/20" />
          <text x="37" y="31" fontSize="14" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontWeight="bold">
            x³
          </text>
        </motion.g>

        {/* Arrow */}
        <motion.line
          x1="60"
          y1="26"
          x2="95"
          y2="26"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ opacity: showArrow ? 0.7 : 0 }}
          transition={ease}
        />
        <motion.polygon
          points="95,26 88,22 88,30"
          fill="currentColor"
          animate={{ opacity: showArrow ? 0.7 : 0 }}
          transition={ease}
        />

        {/* Result term 3x² */}
        <motion.g animate={{ opacity: showResult ? 1 : 0 }} transition={ease}>
          <rect x="100" y="15" width="45" height="22" rx="3" className="fill-green-500/20 dark:fill-green-400/20" />
          <text x="122" y="31" fontSize="14" textAnchor="middle" className="fill-green-500 dark:fill-green-400" fontWeight="bold">
            3x²
          </text>
        </motion.g>

        {/* Step 1: Bring down the exponent */}
        <motion.g animate={{ opacity: showStep1 ? 1 : 0 }} transition={ease}>
          <text x="80" y="55" fontSize="9" textAnchor="middle" fill="currentColor" opacity="0.8">
            Bring down the power
          </text>
          <motion.circle cx="37" cy="18" r="8" fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" strokeDasharray="2,1" />
          <motion.path d="M45 18 Q55 35 65 55" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
          <text x="68" y="65" fontSize="12" className="fill-red-500 dark:fill-red-400" fontWeight="bold">
            3
          </text>
        </motion.g>

        {/* Step 2: Reduce power by 1 */}
        <motion.g animate={{ opacity: showStep2 ? 1 : 0 }} transition={ease}>
          <text x="80" y="80" fontSize="9" textAnchor="middle" fill="currentColor" opacity="0.8">
            Reduce power by 1
          </text>
          <text x="95" y="92" fontSize="10" className="fill-violet-500 dark:fill-violet-400" fontWeight="bold">
            3 - 1 = 2
          </text>
        </motion.g>
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
