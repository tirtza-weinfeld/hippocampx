"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Sine-like curve: y = 40 + 25*sin((x-20)/25)
const f = (x: number) => 40 + 25 * Math.sin((x - 20) / 25)
const fPrime = (x: number) => (25 / 25) * Math.cos((x - 20) / 25)

// Generate smooth curve path
const curvePath = (() => {
  const points: string[] = []
  for (let x = 15; x <= 125; x += 2) points.push(`${x},${f(x)}`)
  return `M${points.join(" L")}`
})()

// SVG y is inverted: visually "up" = negative math slope
// Peak (visual min) at x≈59 where slope=0
const steps = [
  { x: 50, showTangent: false, showSlope: false, zoom: 1, label: "Pick any point P on a curve" },
  { x: 50, showTangent: true, showSlope: false, zoom: 1, label: "Tangent = line that just touches at P" },
  { x: 50, showTangent: true, showSlope: true, zoom: 1, label: "Slope = rise ÷ run (steepness)" },
  { x: 95, showTangent: true, showSlope: true, zoom: 1, label: "Positive slope → curve going up" },
  { x: 59, showTangent: true, showSlope: true, zoom: 1, label: "Slope = 0 at bottom → horizontal" },
  { x: 30, showTangent: true, showSlope: true, zoom: 1, label: "Negative slope → curve going down" },
  { x: 70, showTangent: true, showSlope: false, zoom: 5, label: "Zoomed in: curve and tangent overlap!" },
]

const getTangentLine = (x: number) => {
  const y = f(x)
  const slope = fPrime(x)
  const halfLen = 25
  return {
    x1: x - halfLen,
    y1: y - slope * halfLen,
    x2: x + halfLen,
    y2: y + slope * halfLen,
    slope,
  }
}

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const TangentLineIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { x: pointX, label, showTangent, showSlope, zoom } = steps[step]
  const pointY = f(pointX)
  const line = getTangentLine(pointX)

  // Slope indicator: negate for display (SVG y is inverted)
  // Visually "up" on screen = positive slope for students
  const displaySlope = -Math.round(line.slope * 100) / 100
  const slopeLabel =
    Math.abs(displaySlope) < 0.05 ? "m = 0" :
    displaySlope > 0 ? `m = +${displaySlope.toFixed(2)}` :
    `m = ${displaySlope.toFixed(2)}`

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
        {/* Zoomable content group - zoom centered on point P */}
        <motion.g
          animate={{
            scale: zoom,
            x: (80 - pointX) * (zoom - 1),
            y: (52 - pointY) * (zoom - 1),
          }}
          transition={ease}
        >
        {/* Axes */}
        <line x1="10" y1="90" x2="145" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="12" y1="8" x2="12" y2="92" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Curve */}
        <path d={curvePath} stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />

        {/* Tangent line with arrow */}
        <motion.line
          animate={{
            x1: line.x1,
            y1: line.y1,
            x2: line.x2,
            y2: line.y2,
            opacity: showTangent ? (zoom > 1 ? 0.6 : 1) : 0,
          }}
          transition={ease}
          className="stroke-red-500 dark:stroke-red-400"
          strokeWidth="2"
        />
        {/* Arrow at end of tangent - calculated points */}
        {(() => {
          const angle = Math.atan(line.slope)
          const cos = Math.cos(angle)
          const sin = Math.sin(angle)
          const size = 7
          // Arrow tip at line end, two back points rotated
          const tip = { x: line.x2, y: line.y2 }
          const back1 = {
            x: line.x2 - size * cos + 3 * sin,
            y: line.y2 - size * sin - 3 * cos,
          }
          const back2 = {
            x: line.x2 - size * cos - 3 * sin,
            y: line.y2 - size * sin + 3 * cos,
          }
          return (
            <motion.polygon
              animate={{
                points: `${tip.x},${tip.y} ${back1.x},${back1.y} ${back2.x},${back2.y}`,
                opacity: showTangent ? (zoom > 1 ? 0.6 : 1) : 0,
              }}
              transition={ease}
              className="fill-red-500 dark:fill-red-400"
            />
          )
        })()}

        {/* Slope indicator - only show when showSlope is true */}
        <motion.g
          animate={{ opacity: showSlope ? 1 : 0 }}
          transition={ease}
        >
          {/* Rise/run visual - show when slope is noticeable */}
          {Math.abs(line.slope) > 0.05 && (() => {
            const runLen = 22
            const riseLen = line.slope * runLen
            const riseEnd = pointY + riseLen
            const arrowSize = 4
            return (
              <>
                {/* Horizontal run with arrow */}
                <motion.line
                  animate={{ x1: pointX, y1: pointY, x2: pointX + runLen, y2: pointY }}
                  transition={ease}
                  className="stroke-green-500 dark:stroke-green-400"
                  strokeWidth="1.5"
                />
                <motion.polygon
                  animate={{
                    points: `${pointX + runLen},${pointY} ${pointX + runLen - arrowSize},${pointY - arrowSize / 2} ${pointX + runLen - arrowSize},${pointY + arrowSize / 2}`,
                  }}
                  transition={ease}
                  className="fill-green-500 dark:fill-green-400"
                />
                {/* Vertical rise with arrow */}
                <motion.line
                  animate={{ x1: pointX + runLen, y1: pointY, x2: pointX + runLen, y2: riseEnd }}
                  transition={ease}
                  className="stroke-violet-500 dark:stroke-violet-400"
                  strokeWidth="1.5"
                />
                <motion.polygon
                  animate={{
                    points: riseLen > 0
                      ? `${pointX + runLen},${riseEnd} ${pointX + runLen - arrowSize / 2},${riseEnd - arrowSize} ${pointX + runLen + arrowSize / 2},${riseEnd - arrowSize}`
                      : `${pointX + runLen},${riseEnd} ${pointX + runLen - arrowSize / 2},${riseEnd + arrowSize} ${pointX + runLen + arrowSize / 2},${riseEnd + arrowSize}`,
                  }}
                  transition={ease}
                  className="fill-violet-500 dark:fill-violet-400"
                />
              </>
            )
          })()}
          {/* Slope value - fixed position for readability */}
          <motion.text
            x="15"
            y="18"
            fontSize="9"
            className="fill-red-500 dark:fill-red-400"
            fontWeight="bold"
          >
            {slopeLabel}
          </motion.text>
        </motion.g>

        {/* Point on curve */}
        <motion.circle
          animate={{ cx: pointX, cy: pointY }}
          transition={ease}
          r="4"
          className="fill-blue-500 dark:fill-blue-400"
        />

        {/* Touch indicator - dashed ring (show with tangent, hide when zoomed) */}
        <motion.circle
          animate={{
            cx: pointX,
            cy: pointY,
            opacity: showTangent && zoom === 1 ? 0.6 : 0,
          }}
          transition={ease}
          r="10"
          fill="none"
          className="stroke-sky-500 dark:stroke-sky-400"
          strokeWidth="1.5"
          strokeDasharray="3,2"
        />

        {/* Point label (hide when zoomed) */}
        <motion.text
          animate={{ x: pointX + 8, y: pointY - 10, opacity: zoom === 1 ? 1 : 0 }}
          transition={ease}
          fontSize="9"
          className="fill-blue-500 dark:fill-blue-400"
          fontWeight="bold"
        >
          P
        </motion.text>

        {/* Legend (hide when zoomed) */}
        <g fontSize="5" opacity={zoom === 1 ? 0.8 : 0}>
          <line x1="125" y1="10" x2="138" y2="10" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1.5" />
          <text x="140" y="12" fill="currentColor">tangent</text>
          <line x1="125" y1="18" x2="136" y2="18" className="stroke-green-500 dark:stroke-green-400" strokeWidth="1" />
          <polygon points="138,18 135,16.5 135,19.5" className="fill-green-500 dark:fill-green-400" />
          <text x="140" y="20" fill="currentColor">run</text>
          <line x1="125" y1="26" x2="136" y2="26" className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="1" />
          <polygon points="138,26 135,24.5 135,27.5" className="fill-violet-500 dark:fill-violet-400" />
          <text x="140" y="28" fill="currentColor">rise</text>
        </g>
        </motion.g>
      </motion.svg>

      {/* Explanation label - outside SVG so always visible */}
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
