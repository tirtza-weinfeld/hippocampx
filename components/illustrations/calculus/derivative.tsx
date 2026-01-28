"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Parabola function: y = 0.03(x-70)² + 20
const f = (x: number) => 0.03 * (x - 70) ** 2 + 20

// Generate smooth curve path from function
const curvePath = (() => {
  const points: string[] = []
  for (let x = 25; x <= 115; x += 2) points.push(`${x},${f(x)}`)
  return `M${points.join(" L")}`
})()

const fixedX = 50
const fixedY = f(fixedX)

const steps = [
  { x: 95, label: "Secant line through 2 points" },
  { x: 85, label: "Moving point closer..." },
  { x: 75, label: "Gap shrinking..." },
  { x: 65, label: "Getting closer..." },
  { x: 58, label: "Almost there..." },
  { x: 53, label: "Nearly touching..." },
  { x: 51, label: "Tangent line = derivative!" },
]

const getLine = (movingX: number) => {
  const movingY = f(movingX)
  const slope = (movingY - fixedY) / (movingX - fixedX)
  return {
    x1: 25,
    x2: 105,
    y1: fixedY + slope * (25 - fixedX),
    y2: fixedY + slope * (105 - fixedX),
  }
}

const ease = { duration: 0.4, ease: "easeOut" } as const

export const DerivativeIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { x: movingX, label } = steps[step]
  const movingY = f(movingX)
  const line = getLine(movingX)
  const showH = movingX - fixedX > 8

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        width="160"
        height="105"
        viewBox="0 0 160 105"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Axes */}
        <line x1="15" y1="90" x2="135" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="10" x2="20" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Curve */}
        <path d={curvePath} stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />

        {/* Secant/tangent line */}
        <motion.line
          animate={{ x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2 }}
          transition={ease}
          className="stroke-red-500 dark:stroke-red-400"
          strokeWidth="2"
        />

        {/* Fixed point */}
        <circle cx={fixedX} cy={fixedY} r="4" className="fill-blue-500 dark:fill-blue-400" />

        {/* Moving point */}
        <motion.circle animate={{ cx: movingX, cy: movingY }} transition={ease} r="4" className="fill-green-500 dark:fill-green-400" />

        {/* h bracket */}
        <motion.line y1="80" y2="80" animate={{ x1: fixedX, x2: movingX }} transition={ease} className="stroke-orange-500 dark:stroke-orange-400" strokeWidth="2" />
        <motion.text y="87" fontSize="9" className="fill-orange-500 dark:fill-orange-400" textAnchor="middle" fontWeight="bold" animate={{ x: (fixedX + movingX) / 2, opacity: showH ? 1 : 0 }} transition={ease}>
          h
        </motion.text>

        {/* Labels */}
        <text x={fixedX - 2} y={fixedY - 8} fontSize="8" className="fill-blue-500 dark:fill-blue-400" textAnchor="middle" fontWeight="bold">x</text>
        <motion.text fontSize="8" className="fill-green-500 dark:fill-green-400" textAnchor="middle" fontWeight="bold" animate={{ x: movingX, y: movingY - 8 }} transition={ease}>
          x+h
        </motion.text>

        {/* Explanation */}
        <text x="80" y="100" fontSize="8" fill="currentColor" textAnchor="middle">{label}</text>

        {/* Legend */}
        <circle cx="130" cy="15" r="3" className="fill-blue-500 dark:fill-blue-400" />
        <text x="137" y="18" fontSize="6" fill="currentColor" opacity="0.7">f(x)</text>
        <circle cx="130" cy="25" r="3" className="fill-green-500 dark:fill-green-400" />
        <text x="137" y="28" fontSize="6" fill="currentColor" opacity="0.7">f(x+h)</text>
      </motion.svg>

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
