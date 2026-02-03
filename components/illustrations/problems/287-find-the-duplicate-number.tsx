"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import {
  IllustrationControls,
  type IllustrationSize,
  sizeClasses,
} from "../flow-models/illustration-controls"

// nums = [2, 6, 4, 1, 3, 1, 5]
// Path: 0 → 2 → 4 → 3 → 1 → 6 → 5 → 1
// Duplicate = 1 (cycle entry)

const nums = [2, 6, 4, 1, 3, 1, 5]

const nodePositions: Record<number, { x: number; y: number }> = {
  0: { x: 40, y: 65 },
  2: { x: 95, y: 65 },
  4: { x: 150, y: 65 },
  3: { x: 205, y: 65 },
  1: { x: 255, y: 105 },
  6: { x: 300, y: 145 },
  5: { x: 230, y: 145 },
}

const pathOrder = [0, 2, 4, 3, 1, 6, 5]

const edges: { from: number; to: number; inCycle: boolean }[] = [
  { from: 0, to: 2, inCycle: false },
  { from: 2, to: 4, inCycle: false },
  { from: 4, to: 3, inCycle: false },
  { from: 3, to: 1, inCycle: false },
  { from: 1, to: 6, inCycle: true },
  { from: 6, to: 5, inCycle: true },
  { from: 5, to: 1, inCycle: true },
]

type Step = {
  label: string
  slowIdx: number
  fastIdx: number
  phase: 0 | 1 | 2
  meeting?: boolean
  found?: boolean
}

function getNode(idx: number): number {
  if (idx < 4) return pathOrder[idx]
  return [1, 6, 5][(idx - 4) % 3]
}

const steps: Step[] = [
  { label: "Start: both at index 0", slowIdx: 0, fastIdx: 0, phase: 0 },
  { label: "Phase 1: slow +1, fast +2", slowIdx: 0, fastIdx: 0, phase: 1 },
  { label: "slow=2, fast=4", slowIdx: 1, fastIdx: 2, phase: 1 },
  { label: "slow=4, fast=1", slowIdx: 2, fastIdx: 4, phase: 1 },
  { label: "slow=3, fast=5", slowIdx: 3, fastIdx: 6, phase: 1 },
  { label: "slow=1, fast=6", slowIdx: 4, fastIdx: 5, phase: 1 },
  { label: "slow=6, fast=1", slowIdx: 5, fastIdx: 7, phase: 1 },
  { label: "Meet at 5!", slowIdx: 6, fastIdx: 6, phase: 1, meeting: true },
  { label: "Phase 2: reset slow to 0", slowIdx: 0, fastIdx: 6, phase: 2 },
  { label: "slow=2, fast=1", slowIdx: 1, fastIdx: 7, phase: 2 },
  { label: "slow=4, fast=6", slowIdx: 2, fastIdx: 5, phase: 2 },
  { label: "slow=3, fast=5", slowIdx: 3, fastIdx: 6, phase: 2 },
  { label: "Meet at 1!", slowIdx: 4, fastIdx: 4, phase: 2, meeting: true },
  { label: "Duplicate = 1", slowIdx: 4, fastIdx: 4, phase: 2, found: true },
]

const spring = { type: "spring", stiffness: 120, damping: 18 } as const

function getEdgePath(from: number, to: number): string {
  const s = nodePositions[from]
  const e = nodePositions[to]

  if (from === 5 && to === 1) {
    return `M ${s.x} ${s.y - 14} C ${s.x - 20} ${s.y - 45}, ${e.x - 45} ${e.y + 15}, ${e.x - 14} ${e.y + 6}`
  }
  if (from === 3 && to === 1) {
    return `M ${s.x + 12} ${s.y + 8} L ${e.x - 12} ${e.y - 8}`
  }
  if (from === 1 && to === 6) {
    return `M ${s.x + 12} ${s.y + 8} L ${e.x - 12} ${e.y - 8}`
  }
  return `M ${s.x + 15} ${s.y} L ${e.x - 15} ${e.y}`
}

export function FindDuplicateIllustration({
  size = "xl",
  playing: initialPlaying = true,
}: {
  size?: IllustrationSize
  playing?: boolean
}) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(initialPlaying)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1800)
    return () => clearInterval(id)
  }, [playing])

  const current = steps[step]
  const slowNode = getNode(current.slowIdx)
  const fastNode = getNode(current.fastIdx)
  const cycleNodes = [1, 6, 5]

  const getNodeStyle = (node: number) => {
    if (current.found && node === 1) {
      return "fill-emerald-500/35 stroke-emerald-500"
    }
    if (current.meeting && node === slowNode) {
      return "fill-violet-500/35 stroke-violet-500"
    }
    if (node === slowNode && node === fastNode) {
      return "fill-violet-500/25 stroke-violet-500"
    }
    if (node === slowNode) {
      return "fill-amber-500/25 stroke-amber-500"
    }
    if (node === fastNode) {
      return "fill-sky-500/25 stroke-sky-500"
    }
    if (cycleNodes.includes(node)) {
      return "fill-rose-500/10 stroke-rose-400/60"
    }
    return "fill-slate-500/8 stroke-slate-400/50"
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.svg
        viewBox="0 0 360 210"
        className={sizeClasses[size]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Region labels */}
        <text x="120" y="42" textAnchor="middle" fontSize="9" className="fill-slate-400/60" fontWeight="500">
          tail
        </text>
        <text x="265" y="175" textAnchor="middle" fontSize="9" className="fill-rose-400/60" fontWeight="500">
          cycle
        </text>

        {/* Phase badge */}
        {current.phase > 0 && (
          <g transform="translate(305, 8)">
            <rect
              x="0"
              y="0"
              width="48"
              height="20"
              rx="4"
              className={current.phase === 1 ? "fill-amber-500/15 stroke-amber-500/40" : "fill-teal-500/15 stroke-teal-500/40"}
              strokeWidth="1"
            />
            <text
              x="24"
              y="14"
              textAnchor="middle"
              fontSize="10"
              className={current.phase === 1 ? "fill-amber-600 dark:fill-amber-400" : "fill-teal-600 dark:fill-teal-400"}
              fontWeight="600"
            >
              P{current.phase}
            </text>
          </g>
        )}

        {/* Edges */}
        {edges.map(({ from, to, inCycle }, i) => (
          <path
            key={`edge-${i}`}
            d={getEdgePath(from, to)}
            className={
              current.found && inCycle
                ? "stroke-emerald-500"
                : inCycle
                  ? "stroke-rose-400/50"
                  : "stroke-slate-400/40"
            }
            strokeWidth={1.5}
            strokeDasharray={inCycle ? "5 3" : undefined}
            fill="none"
            markerEnd={current.found && inCycle ? "url(#arrG)" : inCycle ? "url(#arrR)" : "url(#arrS)"}
          />
        ))}

        {/* Nodes */}
        {Object.entries(nodePositions).map(([val, pos]) => {
          const node = Number(val)
          const isFound = current.found && node === 1
          return (
            <g key={`node-${val}`}>
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="15"
                className={getNodeStyle(node)}
                strokeWidth={isFound ? 2.5 : 2}
                animate={{ scale: isFound ? 1.12 : 1 }}
                transition={spring}
              />
              <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="14" className="fill-current" fontWeight="600">
                {val}
              </text>
            </g>
          )
        })}

        {/* Slow pointer */}
        <motion.g
          animate={{ x: nodePositions[slowNode].x, y: nodePositions[slowNode].y - 30 }}
          transition={spring}
        >
          <rect x="-18" y="-8" width="36" height="16" rx="4" className="fill-amber-500/25 stroke-amber-500" strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fontSize="9" className="fill-amber-600 dark:fill-amber-400" fontWeight="600">
            slow
          </text>
          <path d="M0,8 L0,13" className="stroke-amber-500" strokeWidth="1.5" />
          <circle cx="0" cy="15" r="2" className="fill-amber-500" />
        </motion.g>

        {/* Fast pointer */}
        <motion.g
          animate={{ x: nodePositions[fastNode].x, y: nodePositions[fastNode].y + 30 }}
          transition={spring}
        >
          <circle cx="0" cy="-15" r="2" className="fill-sky-500" />
          <path d="M0,-13 L0,-8" className="stroke-sky-500" strokeWidth="1.5" />
          <rect x="-16" y="-8" width="32" height="16" rx="4" className="fill-sky-500/25 stroke-sky-500" strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fontSize="9" className="fill-sky-600 dark:fill-sky-400" fontWeight="600">
            fast
          </text>
        </motion.g>

        {/* Array */}
        <g transform="translate(8, 188)">
          <text x="0" y="10" fontSize="8" className="fill-current/40" fontWeight="500">nums</text>
          {nums.map((val, i) => {
            const hl = current.found && val === 1
            return (
              <g key={`arr-${i}`} transform={`translate(${32 + i * 44}, 0)`}>
                <rect
                  x="0" y="0" width="38" height="20" rx="3"
                  className={hl ? "fill-emerald-500/25 stroke-emerald-500" : "fill-current/5 stroke-current/15"}
                  strokeWidth={hl ? 1.5 : 1}
                />
                <text x="19" y="14" textAnchor="middle" fontSize="12" className={hl ? "fill-emerald-500" : "fill-current"} fontWeight="500">
                  {val}
                </text>
              </g>
            )
          })}
        </g>

        {/* Markers */}
        <defs>
          <marker id="arrS" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-slate-400/40" />
          </marker>
          <marker id="arrR" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-rose-400/50" />
          </marker>
          <marker id="arrG" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-emerald-500" />
          </marker>
        </defs>
      </motion.svg>

      <p className="text-sm text-current/70 font-medium">{current.label}</p>

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
