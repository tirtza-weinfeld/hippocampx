"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Chain rule: derivative of f(g(x)) = f'(g(x)) · g'(x)
// Visual: show a change propagating through, getting scaled at each function

// Using concrete example: g doubles (g'=2), f triples (f'=3)
// So total scaling = 2 × 3 = 6

const steps = [
  { phase: 0, label: "Composing functions: input → g → f → output" },
  { phase: 1, label: "g' = 2 — g doubles any change" },
  { phase: 2, label: "f' = 3 — f triples any change" },
  { phase: 3, label: "Push small change Δx = 1 into g..." },
  { phase: 4, label: "g doubles it: Δx·g' = 1·2 = 2" },
  { phase: 5, label: "That 2 flows into f..." },
  { phase: 6, label: "f triples it: 2·f' = 2·3 = 6" },
  { phase: 7, label: "Total rate = g'·f' = 2·3 = 6" },
  { phase: 8, label: "(f(g(x)))' = f'(g(x)) · g'(x)" },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const ChainRuleIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1800)
    return () => clearInterval(id)
  }, [playing])

  const { phase, label } = steps[step]

  // Bar heights represent the "size" of the change
  const inputBar = phase >= 3 ? 8 : 0
  const midBar = phase >= 4 ? 16 : 0  // doubled
  const outputBar = phase >= 6 ? 48 : 0  // tripled (16 × 3)

  // Visibility flags
  const showMidBar = phase >= 4
  const showOutputBar = phase >= 6 && phase <= 8

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        width="160"
        height="105"
        viewBox="0 0 160 105"
        overflow="visible"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* g box */}
        <motion.g animate={{ opacity: phase >= 0 ? 1 : 0 }} transition={ease}>
          <rect x="40" y="35" width="28" height="28" rx="4" className="fill-green-500 dark:fill-green-400" />
          <text x="54" y="53" fontSize="12" textAnchor="middle" className="fill-white" fontWeight="bold">
            g
          </text>
        </motion.g>

        {/* g rate label */}
        <motion.g animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={ease}>
          <text x="54" y="28" fontSize="8" textAnchor="middle" className="fill-green-600 dark:fill-green-300" fontWeight="bold">
            ×2
          </text>
        </motion.g>

        {/* Arrow g → f */}
        <motion.g animate={{ opacity: phase >= 0 ? 1 : 0 }} transition={ease}>
          <line x1="70" y1="49" x2="85" y2="49" className="stroke-current" strokeWidth="1.5" opacity="0.4" />
          <polygon points="88,49 84,46 84,52" className="fill-current" opacity="0.4" />
        </motion.g>

        {/* f box */}
        <motion.g animate={{ opacity: phase >= 0 ? 1 : 0 }} transition={ease}>
          <rect x="90" y="35" width="28" height="28" rx="4" className="fill-red-500 dark:fill-red-400" />
          <text x="104" y="53" fontSize="12" textAnchor="middle" className="fill-white" fontWeight="bold">
            f
          </text>
        </motion.g>

        {/* f rate label */}
        <motion.g animate={{ opacity: phase >= 2 ? 1 : 0 }} transition={ease}>
          <text x="104" y="28" fontSize="8" textAnchor="middle" className="fill-red-600 dark:fill-red-300" fontWeight="bold">
            ×3
          </text>
        </motion.g>

        {/* Input arrow */}
        <motion.g animate={{ opacity: phase >= 0 ? 1 : 0 }} transition={ease}>
          <line x1="15" y1="49" x2="35" y2="49" className="stroke-current" strokeWidth="1.5" opacity="0.4" />
          <polygon points="38,49 34,46 34,52" className="fill-current" opacity="0.4" />
        </motion.g>

        {/* Output arrow */}
        <motion.g animate={{ opacity: phase >= 0 ? 1 : 0 }} transition={ease}>
          <line x1="120" y1="49" x2="140" y2="49" className="stroke-current" strokeWidth="1.5" opacity="0.4" />
          <polygon points="143,49 139,46 139,52" className="fill-current" opacity="0.4" />
        </motion.g>

        {/* INPUT: Small change bar (size 1) */}
        <motion.g animate={{ opacity: phase >= 3 && phase < 5 ? 1 : 0 }} transition={ease}>
          <motion.rect
            animate={{
              x: phase === 3 ? 17 : phase === 4 ? 52 : 17,
              width: 6,
              height: inputBar,
              y: 70 - inputBar,
            }}
            transition={ease}
            className="fill-blue-500 dark:fill-blue-400"
            rx="2"
          />
          <motion.text
            animate={{
              x: phase === 3 ? 20 : phase === 4 ? 55 : 20,
              opacity: phase === 3 ? 1 : 0,
            }}
            y="82"
            fontSize="8"
            textAnchor="middle"
            className="fill-blue-500 dark:fill-blue-400"
            fontWeight="bold"
          >
            1
          </motion.text>
        </motion.g>

        {/* MID: After g (size 2) */}
        <motion.g animate={{ opacity: showMidBar ? 1 : 0 }} transition={ease}>
          <motion.rect
            animate={{
              x: phase >= 5 ? 102 : 52,
              width: 6,
              height: midBar,
              y: 70 - midBar,
            }}
            transition={ease}
            className="fill-green-500 dark:fill-green-400"
            rx="2"
          />
          <motion.text
            animate={{
              x: phase >= 5 ? 105 : 55,
              opacity: phase === 4 || phase === 5 ? 1 : 0,
            }}
            y="82"
            fontSize="8"
            textAnchor="middle"
            className="fill-green-500 dark:fill-green-400"
            fontWeight="bold"
          >
            2
          </motion.text>
        </motion.g>

        {/* OUTPUT: After f (size 6) */}
        <motion.g animate={{ opacity: showOutputBar ? 1 : 0 }} transition={ease}>
          <rect
            x="132"
            width="6"
            height={outputBar}
            y={70 - outputBar}
            className="fill-red-500 dark:fill-red-400"
            rx="2"
          />
          <text
            x="135"
            y="82"
            fontSize="8"
            textAnchor="middle"
            className="fill-red-500 dark:fill-red-400"
            fontWeight="bold"
          >
            6
          </text>
        </motion.g>

        {/* Numeric result */}
        <motion.g animate={{ opacity: phase === 7 ? 1 : 0 }} transition={ease}>
          <rect x="25" y="88" width="110" height="16" rx="3" className="fill-violet-500/20 dark:fill-violet-400/20" />
          <text x="80" y="99" fontSize="9" textAnchor="middle" className="fill-violet-600 dark:fill-violet-400" fontWeight="bold">
            total rate = g'·f' = 2·3 = 6
          </text>
        </motion.g>

        {/* Chain rule formula - the punchline */}
        <motion.g animate={{ opacity: phase >= 8 ? 1 : 0 }} transition={ease}>
          <rect x="10" y="5" width="140" height="20" rx="4" className="fill-violet-500/30 dark:fill-violet-400/30" />
          <text x="80" y="18" fontSize="9" textAnchor="middle" className="fill-violet-700 dark:fill-violet-300" fontWeight="bold">
            (f(g(x)))&apos; = f&apos;(g(x)) · g&apos;(x)
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
