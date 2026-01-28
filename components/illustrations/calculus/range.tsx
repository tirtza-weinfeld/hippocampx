"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { showMachine: true, showRange: false, showOutputs: false, showGap: false, showArrow: false, label: "A function f(x) produces outputs" },
  { showMachine: true, showRange: true, showOutputs: false, showGap: false, showArrow: false, label: "The RANGE is all possible outputs" },
  { showMachine: true, showRange: true, showOutputs: true, showGap: false, showArrow: false, label: "These are the values f(x) can produce" },
  { showMachine: true, showRange: true, showOutputs: true, showGap: true, showArrow: false, label: "Some values may never be reached!" },
  { showMachine: true, showRange: true, showOutputs: true, showGap: true, showArrow: true, label: "Domain → Function → Range" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const RangeIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showMachine, showRange, showOutputs, showGap, showArrow, label } = steps[step]

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
        {/* Function machine */}
        <motion.g animate={{ opacity: showMachine ? 1 : 0 }} transition={ease}>
          <rect x="55" y="35" width="35" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
          <text x="72" y="52" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">f(x)</text>
        </motion.g>

        {/* Arrow from function to range */}
        <motion.g animate={{ opacity: showArrow ? 1 : 0 }} transition={ease}>
          <line x1="92" y1="48" x2="102" y2="48" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <polygon points="102,48 96,44 96,52" fill="currentColor" opacity="0.6" />
        </motion.g>

        {/* Range ellipse */}
        <motion.ellipse
          cx="125"
          cy="48"
          rx="22"
          ry="28"
          className="fill-sky-500/15 dark:fill-sky-400/15 stroke-sky-500 dark:stroke-sky-400"
          strokeWidth="2"
          animate={{ opacity: showRange ? 1 : 0 }}
          transition={ease}
        />

        {/* Range label */}
        <motion.text
          x="125"
          y="15"
          fontSize="10"
          textAnchor="middle"
          className="fill-sky-500 dark:fill-sky-400"
          fontWeight="bold"
          animate={{ opacity: showRange ? 1 : 0 }}
          transition={ease}
        >
          Range
        </motion.text>

        {/* Output values */}
        {[28, 40, 56, 68].map((y, i) => (
          <motion.circle
            key={i}
            cx="125"
            cy={y}
            r="3"
            className="fill-sky-500 dark:fill-sky-400"
            animate={{ opacity: showOutputs ? 1 : 0 }}
            transition={{ ...ease, delay: i * 0.08 }}
          />
        ))}

        {/* Gap in range */}
        <motion.g animate={{ opacity: showGap ? 1 : 0 }} transition={ease}>
          <rect x="117" y="46" width="16" height="6" rx="2" fill="white" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="125" y="92" fontSize="8" textAnchor="middle" className="fill-red-500 dark:fill-red-400">Gap (unreachable)</text>
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
