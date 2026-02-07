"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "../flow-models/illustration-controls"

// nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3 → [3, 3, 5, 5, 6, 7]
const nums = [1, 3, -1, -3, 5, 3, 6, 7]
const k = 3

type Step = {
  label: string
  i: number
  deque: number[]
  result: number[]
}

const steps: Step[] = [
  { label: "Deque front = window max, values kept decreasing", i: -1, deque: [], result: [] },
  { label: "i=0: deque empty → append idx 0", i: 0, deque: [0], result: [] },
  { label: "i=1: nums[0]=1 ≤ 3 → pop back. Append 1", i: 1, deque: [1], result: [] },
  { label: "i=2: nums[1]=3 > −1 → keep. Append. Window full, max=3", i: 2, deque: [1, 2], result: [3] },
  { label: "i=3: nums[2]=−1 > −3 → keep. Append. max=3", i: 3, deque: [1, 2, 3], result: [3, 3] },
  { label: "i=4: q[0]=1 ≤ i−k=1 → drop front. Pop all ≤ 5. max=5", i: 4, deque: [4], result: [3, 3, 5] },
  { label: "i=5: nums[4]=5 > 3 → keep. Append. max=5", i: 5, deque: [4, 5], result: [3, 3, 5, 5] },
  { label: "i=6: nums[5]=3 ≤ 6, nums[4]=5 ≤ 6 → pop. max=6", i: 6, deque: [6], result: [3, 3, 5, 5, 6] },
  { label: "i=7: nums[6]=6 ≤ 7 → pop back. Append. max=7", i: 7, deque: [7], result: [3, 3, 5, 5, 6, 7] },
]

const cellW = 26
const cellH = 22
const cellY = 20
const cellX = (i: number) => 18 + i * 30
const dqPitch = 30

const spring = { type: "spring", stiffness: 120, damping: 20 } as const
const gentle = { type: "spring", stiffness: 100, damping: 18 } as const

export function SlidingWindowMaxIllustration({
  size = "md",
  playing: initialPlaying = true,
}: {
  size?: IllustrationSize
  playing?: boolean
}) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(initialPlaying)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 2400)
    return () => clearInterval(id)
  }, [playing])

  const s = steps[step]
  const wStart = Math.max(0, s.i - k + 1)
  const wEnd = s.i
  const wCells = s.i >= 0 ? wEnd - wStart + 1 : 0

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        viewBox="0 0 280 118"
        className={sizeClasses[size]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <defs>
          <linearGradient id="sw-cell" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(148,163,184,0.2)" />
            <stop offset="100%" stopColor="rgba(148,163,184,0.05)" />
          </linearGradient>
          <linearGradient id="sw-win" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.25)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.1)" />
          </linearGradient>
          <linearGradient id="sw-max" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(250,204,21,0.4)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0.15)" />
          </linearGradient>
          <linearGradient id="sw-dq" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.3)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.08)" />
          </linearGradient>
          <linearGradient id="sw-res" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.35)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.1)" />
          </linearGradient>
        </defs>

        {/* i pointer above array */}
        {s.i >= 0 && (
          <motion.g animate={{ x: cellX(s.i) + cellW / 2 }} transition={spring}>
            <text x="0" y="10" textAnchor="middle" fontSize="7" fill="#38bdf8" fontWeight="600">
              i
            </text>
            <path d="M0,12 L-3,17 L3,17 Z" fill="#38bdf8" opacity="0.8" />
          </motion.g>
        )}

        {/* Window bracket (dashed) */}
        {s.i >= 0 && (
          <motion.rect
            animate={{ x: cellX(wStart) - 3, width: wCells * 30 - 4 + 6 }}
            y={cellY - 3}
            height={cellH + 6}
            rx="6"
            fill="none"
            stroke="rgba(99,102,241,0.45)"
            strokeWidth="1.5"
            strokeDasharray="4,3"
            transition={spring}
          />
        )}

        {/* Array cells */}
        {nums.map((val, idx) => {
          const inWin = s.i >= 0 && idx >= wStart && idx <= wEnd
          const isMax = s.deque.length > 0 && idx === s.deque[0]
          const inDq = s.deque.includes(idx)
          return (
            <g key={idx}>
              <motion.rect
                x={cellX(idx)}
                y={cellY}
                width={cellW}
                height={cellH}
                rx="4"
                fill={isMax ? "url(#sw-max)" : inDq ? "url(#sw-dq)" : inWin ? "url(#sw-win)" : "url(#sw-cell)"}
                stroke={
                  isMax ? "rgba(250,204,21,0.7)"
                    : inDq ? "rgba(168,85,247,0.5)"
                      : inWin ? "rgba(99,102,241,0.4)"
                        : "rgba(148,163,184,0.3)"
                }
                strokeWidth={isMax ? 2 : 1.2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...spring, delay: idx * 0.04 }}
              />
              <motion.text
                x={cellX(idx) + cellW / 2}
                y={35}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                className={
                  isMax ? "fill-amber-300"
                    : inDq ? "fill-purple-300"
                      : inWin ? "fill-indigo-300"
                        : "fill-slate-400"
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.04 + 0.1 }}
              >
                {val}
              </motion.text>
              <text
                x={cellX(idx) + cellW / 2}
                y={52}
                textAnchor="middle"
                fontSize="7"
                className="fill-slate-500"
              >
                {idx}
              </text>
            </g>
          )
        })}

        {/* k badge */}
        <rect x="248" y="2" width="26" height="13" rx="4" fill="rgba(99,102,241,0.12)" />
        <text x="261" y="11" textAnchor="middle" fontSize="7" fill="#818cf8" fontWeight="600">
          k={k}
        </text>

        {/* Deque section */}
        <text x="4" y="72" fontSize="7.5" fill="#a78bfa" fontWeight="600" opacity={s.deque.length > 0 ? 1 : 0.4}>
          deque
        </text>

        {/* Deque bracket — always rendered, fades in/out */}
        <motion.rect
          x={37}
          y={60}
          initial={{ opacity: 0, width: dqPitch + 6 }}
          animate={{
            width: Math.max(s.deque.length, 1) * dqPitch + 6,
            opacity: s.deque.length > 0 ? 1 : 0,
          }}
          height={22}
          rx="4"
          fill="rgba(168,85,247,0.06)"
          stroke="rgba(168,85,247,0.2)"
          strokeWidth="1"
          transition={gentle}
        />

        {/* max label */}
        <motion.text
          x={53}
          y="58"
          textAnchor="middle"
          fontSize="6"
          fill="rgba(250,204,21,0.8)"
          initial={{ opacity: 0 }}
          animate={{ opacity: s.deque.length > 0 ? 1 : 0 }}
        >
          max↓
        </motion.text>

        {/* Deque items — stable keys for smooth enter/exit */}
        <AnimatePresence>
          {s.deque.map((dIdx, pos) => (
            <motion.g
              key={dIdx}
              initial={{ opacity: 0, y: -6, x: 40 + pos * dqPitch }}
              animate={{ opacity: 1, y: 0, x: 40 + pos * dqPitch }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
              transition={gentle}
            >
              <rect
                x={0}
                y={63}
                width={cellW}
                height={16}
                rx="3"
                fill={pos === 0 ? "rgba(250,204,21,0.15)" : "rgba(168,85,247,0.1)"}
                stroke={pos === 0 ? "rgba(250,204,21,0.5)" : "rgba(168,85,247,0.3)"}
                strokeWidth="1"
              />
              <text
                x={cellW / 2}
                y={74.5}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill={pos === 0 ? "#fbbf24" : "#c084fc"}
              >
                {nums[dIdx]}
              </text>
              <text
                x={cellW / 2}
                y={86}
                textAnchor="middle"
                fontSize="6"
                fill={pos === 0 ? "rgba(250,204,21,0.6)" : "rgba(168,85,247,0.5)"}
              >
                [{dIdx}]
              </text>
            </motion.g>
          ))}
        </AnimatePresence>

        {/* Result section */}
        <text x="4" y="106" fontSize="7.5" fill="#4ade80" fontWeight="600" opacity={s.result.length > 0 ? 1 : 0.4}>
          result
        </text>

        {/* Result items — AnimatePresence for smooth entry */}
        <AnimatePresence>
          {s.result.map((val, pos) => (
            <motion.g
              key={pos}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={gentle}
            >
              <rect
                x={40 + pos * 28}
                y={96}
                width={24}
                height={16}
                rx="3"
                fill="url(#sw-res)"
                stroke="rgba(34,197,94,0.4)"
                strokeWidth="1"
              />
              <text
                x={40 + pos * 28 + 12}
                y={107}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="#4ade80"
              >
                {val}
              </text>
            </motion.g>
          ))}
        </AnimatePresence>
      </motion.svg>

      <p className="text-sm text-center text-current/80 h-5 font-medium">{s.label}</p>

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
