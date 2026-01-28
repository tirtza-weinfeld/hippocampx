"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Teaching steps - each adds new visual elements
const steps = [
  { showBox: true, showInputArrow: false, showInputValue: false, showOutputArrow: false, showOutputValue: false, label: "A function is a machine" },
  { showBox: true, showInputArrow: true, showInputValue: false, showOutputArrow: false, showOutputValue: false, label: "It takes an input x" },
  { showBox: true, showInputArrow: true, showInputValue: true, showOutputArrow: false, showOutputValue: false, label: "Put in a value: 3" },
  { showBox: true, showInputArrow: true, showInputValue: true, showOutputArrow: true, showOutputValue: false, label: "The machine processes it" },
  { showBox: true, showInputArrow: true, showInputValue: true, showOutputArrow: true, showOutputValue: true, label: "Out comes f(3) = 7" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const FunctionIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { showBox, showInputArrow, showInputValue, showOutputArrow, showOutputValue, label } = steps[step]

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
        {/* Function machine box */}
        <motion.rect
          x="55"
          y="30"
          width="50"
          height="35"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ opacity: showBox ? 1 : 0 }}
          transition={ease}
        />

        {/* Function label inside box */}
        <motion.text
          x="80"
          y="52"
          fontSize="12"
          textAnchor="middle"
          fill="currentColor"
          fontWeight="bold"
          animate={{ opacity: showBox ? 1 : 0 }}
          transition={ease}
        >
          f(x)
        </motion.text>

        {/* Input arrow */}
        <motion.line
          x1="15"
          y1="47"
          x2="50"
          y2="47"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ opacity: showInputArrow ? 1 : 0 }}
          transition={ease}
        />
        <motion.polygon
          points="55,47 48,43 48,51"
          fill="currentColor"
          animate={{ opacity: showInputArrow ? 1 : 0 }}
          transition={ease}
        />

        {/* Input label "x" */}
        <motion.text
          x="32"
          y="40"
          fontSize="10"
          textAnchor="middle"
          fill="currentColor"
          animate={{ opacity: showInputArrow ? 0.7 : 0 }}
          transition={ease}
        >
          x
        </motion.text>

        {/* Input value circle and number */}
        <motion.circle
          cx="25"
          cy="47"
          r="10"
          fill="none"
          className="stroke-green-500 dark:stroke-green-400"
          strokeWidth="2"
          animate={{ opacity: showInputValue ? 1 : 0, scale: showInputValue ? 1 : 0.5 }}
          transition={ease}
        />
        <motion.text
          x="25"
          y="51"
          fontSize="10"
          textAnchor="middle"
          className="fill-green-500 dark:fill-green-400"
          fontWeight="bold"
          animate={{ opacity: showInputValue ? 1 : 0 }}
          transition={ease}
        >
          3
        </motion.text>

        {/* Output arrow */}
        <motion.line
          x1="105"
          y1="47"
          x2="140"
          y2="47"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ opacity: showOutputArrow ? 1 : 0 }}
          transition={ease}
        />
        <motion.polygon
          points="145,47 138,43 138,51"
          fill="currentColor"
          animate={{ opacity: showOutputArrow ? 1 : 0 }}
          transition={ease}
        />

        {/* Output value circle and number */}
        <motion.circle
          cx="135"
          cy="47"
          r="10"
          fill="none"
          className="stroke-violet-500 dark:stroke-violet-400"
          strokeWidth="2"
          animate={{ opacity: showOutputValue ? 1 : 0, scale: showOutputValue ? 1 : 0.5 }}
          transition={ease}
        />
        <motion.text
          x="135"
          y="51"
          fontSize="10"
          textAnchor="middle"
          className="fill-violet-500 dark:fill-violet-400"
          fontWeight="bold"
          animate={{ opacity: showOutputValue ? 1 : 0 }}
          transition={ease}
        >
          7
        </motion.text>

        {/* Legend */}
        <g fontSize="6" opacity="0.8">
          <circle cx="15" cy="85" r="4" fill="none" className="stroke-green-500 dark:stroke-green-400" strokeWidth="1" />
          <text x="22" y="87" fill="currentColor">input</text>
          <circle cx="55" cy="85" r="4" fill="none" className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="1" />
          <text x="62" y="87" fill="currentColor">output</text>
        </g>
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
