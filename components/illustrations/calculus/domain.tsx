"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

const steps = [
  { showMachine: true, showDomain: false, showInputs: false, showInvalid: false, showArrow: false, label: "A function f(x) takes inputs" },
  { showMachine: true, showDomain: true, showInputs: false, showInvalid: false, showArrow: false, label: "The DOMAIN is all valid inputs" },
  { showMachine: true, showDomain: true, showInputs: true, showInvalid: false, showArrow: false, label: "These inputs work for f(x)" },
  { showMachine: true, showDomain: true, showInputs: true, showInvalid: true, showArrow: false, label: "But some inputs are NOT allowed!" },
  { showMachine: true, showDomain: true, showInputs: true, showInvalid: true, showArrow: true, label: "Domain → Function → Range" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const DomainIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showMachine, showDomain, showInputs, showInvalid, showArrow, label } = steps[step]

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
          <rect x="70" y="35" width="35" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
          <text x="87" y="52" fontSize="10" textAnchor="middle" fill="currentColor" fontWeight="bold">f(x)</text>
        </motion.g>

        {/* Domain ellipse */}
        <motion.ellipse
          cx="35"
          cy="48"
          rx="22"
          ry="30"
          className="fill-green-500/15 dark:fill-green-400/15 stroke-green-500 dark:stroke-green-400"
          strokeWidth="2"
          animate={{ opacity: showDomain ? 1 : 0 }}
          transition={ease}
        />

        {/* Domain label */}
        <motion.text
          x="35"
          y="15"
          fontSize="10"
          textAnchor="middle"
          className="fill-green-500 dark:fill-green-400"
          fontWeight="bold"
          animate={{ opacity: showDomain ? 1 : 0 }}
          transition={ease}
        >
          Domain
        </motion.text>

        {/* Valid inputs */}
        {[28, 43, 58, 73].map((y, i) => (
          <motion.circle
            key={i}
            cx="35"
            cy={y}
            r="3"
            className="fill-green-500 dark:fill-green-400"
            animate={{ opacity: showInputs ? 1 : 0 }}
            transition={{ ...ease, delay: i * 0.08 }}
          />
        ))}

        {/* Invalid input (hole in domain) */}
        <motion.g animate={{ opacity: showInvalid ? 1 : 0 }} transition={ease}>
          <circle cx="35" cy="50" r="5" fill="white" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
          <text x="35" y="53" fontSize="8" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontWeight="bold">✗</text>
          <text x="35" y="92" fontSize="8" textAnchor="middle" className="fill-red-500 dark:fill-red-400">Not allowed!</text>
        </motion.g>

        {/* Arrow from domain to function */}
        <motion.g animate={{ opacity: showArrow ? 1 : 0 }} transition={ease}>
          <line x1="58" y1="48" x2="68" y2="48" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <polygon points="68,48 62,44 62,52" fill="currentColor" opacity="0.6" />
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
