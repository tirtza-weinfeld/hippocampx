"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "../flow-models/illustration-controls"

// 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → back to 3
// L = 2 (tail), C = 8 (cycle)

const cx = 110
const cy = 55
const r = 28

// Cycle nodes positioned clockwise, starting from left
const cycleAngles = Array.from({ length: 8 }, (_, i) => Math.PI + (i * Math.PI * 2) / 8)

const nodes = [
  { val: 1, x: 15, y: 55 },
  { val: 2, x: 45, y: 55 },
  ...cycleAngles.map((angle, i) => ({
    val: i + 3,
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r,
  })),
]

type Step = {
  label: string
  slow: number
  fast: number
  lap: number
  meet?: boolean
}

const steps: Step[] = [
  { label: "Detect cycle: slow ×1, fast ×2", slow: 0, fast: 0, lap: 0 },
  { label: "slow → 2, fast → 3", slow: 1, fast: 2, lap: 0 },
  { label: "slow → 3, fast → 5", slow: 2, fast: 4, lap: 0 },
  { label: "slow → 4, fast → 7", slow: 3, fast: 6, lap: 0 },
  { label: "slow → 5, fast → 9", slow: 4, fast: 8, lap: 0 },
  { label: "slow → 6, fast → 3 (k=1 lap)", slow: 5, fast: 2, lap: 1 },
  { label: "slow → 7, fast → 5", slow: 6, fast: 4, lap: 1 },
  { label: "slow → 8, fast → 7", slow: 7, fast: 6, lap: 1 },
  { label: "slow = fast = 9 — Cycle found!", slow: 8, fast: 8, lap: 1, meet: true },
]

const spring = { type: "spring", stiffness: 130, damping: 18 } as const

export function LinkedListCycleIllustration({
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
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1800)
    return () => clearInterval(id)
  }, [playing])

  const s = steps[step]

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        viewBox="0 0 160 105"
        className={sizeClasses[size]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <defs>
          <marker id="arrL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,1 L5,3 L0,5 Z" fill="rgba(148,163,184,0.6)" />
          </marker>
          <marker id="arrC" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,1 L5,3 L0,5 Z" fill="rgba(129,140,248,0.8)" />
          </marker>
          <marker id="arrM" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,1 L5,3 L0,5 Z" fill="#a855f7" />
          </marker>
          <linearGradient id="slowG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="fastG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>

        {/* Cycle background circle */}
        <circle cx={cx} cy={cy} r={r + 12} fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.25)" strokeWidth="1" strokeDasharray="4,3" />

        {/* C=8 label outside cycle */}
        <text x={cx} y={12} textAnchor="middle" fontSize="9" fill="#818cf8" fontWeight="600">C = 8</text>

        {/* L=2 bracket */}
        <path d="M 15 72 L 15 76 L 45 76 L 45 72" fill="none" stroke="#2dd4bf" strokeWidth="1.2" />
        <text x="30" y="86" textAnchor="middle" fontSize="9" fill="#2dd4bf" fontWeight="600">L = 2</text>

        {/* Edge: 1 → 2 */}
        <line x1={nodes[0].x + 8} y1={nodes[0].y} x2={nodes[1].x - 8} y2={nodes[1].y} stroke="rgba(148,163,184,0.5)" strokeWidth="1.5" markerEnd="url(#arrL)" />

        {/* Edge: 2 → 3 */}
        <line x1={nodes[1].x + 8} y1={nodes[1].y} x2={nodes[2].x - 8} y2={nodes[2].y} stroke="rgba(148,163,184,0.5)" strokeWidth="1.5" markerEnd="url(#arrL)" />

        {/* Cycle edges: 3→4→5→6→7→8→9→10 (indices 2-9) */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const fromIdx = i + 2
          const toIdx = i + 3
          const dx = nodes[toIdx].x - nodes[fromIdx].x
          const dy = nodes[toIdx].y - nodes[fromIdx].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const ux = dx / dist
          const uy = dy / dist
          return (
            <line
              key={`e${i}`}
              x1={nodes[fromIdx].x + ux * 8}
              y1={nodes[fromIdx].y + uy * 8}
              x2={nodes[toIdx].x - ux * 8}
              y2={nodes[toIdx].y - uy * 8}
              stroke="rgba(129,140,248,0.6)"
              strokeWidth="1.3"
              markerEnd="url(#arrC)"
            />
          )
        })}

        {/* Cycle back: 10 → 3 (dashed) */}
        {(() => {
          const from = nodes[9] // node 10
          const to = nodes[2]   // node 3
          const dx = to.x - from.x
          const dy = to.y - from.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const ux = dx / dist
          const uy = dy / dist
          return (
            <line
              x1={from.x + ux * 8}
              y1={from.y + uy * 8}
              x2={to.x - ux * 8}
              y2={to.y - uy * 8}
              stroke={s.meet ? "#a855f7" : "rgba(129,140,248,0.6)"}
              strokeWidth="1.5"
              strokeDasharray="4,3"
              markerEnd={s.meet ? "url(#arrM)" : "url(#arrC)"}
            />
          )
        })()}

        {/* Nodes */}
        {nodes.map((node, idx) => {
          const inCycle = idx >= 2
          const isMeet = s.meet && (idx === s.slow || idx === s.fast)
          return (
            <g key={`n${idx}`}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="8"
                fill={isMeet ? "rgba(168,85,247,0.3)" : inCycle ? "rgba(99,102,241,0.2)" : "rgba(148,163,184,0.15)"}
                stroke={isMeet ? "#a855f7" : inCycle ? "rgba(129,140,248,0.7)" : "rgba(148,163,184,0.5)"}
                strokeWidth={isMeet ? 2 : 1.5}
                animate={{ scale: isMeet ? 1.1 : 1 }}
                transition={spring}
              />
              <text x={node.x} y={node.y + 3} textAnchor="middle" fontSize="7" fontWeight="600" fill={inCycle ? "#a5b4fc" : "#94a3b8"}>
                {node.val}
              </text>
            </g>
          )
        })}

        {/* Slow pointer */}
        <motion.g animate={{ x: nodes[s.slow].x, y: nodes[s.slow].y - 16 }} transition={spring}>
          <rect x="-11" y="-5" width="22" height="10" rx="5" fill="url(#slowG)" />
          <text x="0" y="2" textAnchor="middle" fontSize="6" fill="white" fontWeight="700">slow</text>
          <line x1="0" y1="5" x2="0" y2="8" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="0" cy="9" r="1.2" fill="#fbbf24" />
        </motion.g>

        {/* Fast pointer */}
        <motion.g animate={{ x: nodes[s.fast].x, y: nodes[s.fast].y + 16 }} transition={spring}>
          <circle cx="0" cy="-9" r="1.2" fill="#38bdf8" />
          <line x1="0" y1="-8" x2="0" y2="-5" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="-9" y="-5" width="18" height="10" rx="5" fill="url(#fastG)" />
          <text x="0" y="2" textAnchor="middle" fontSize="6" fill="white" fontWeight="700">fast</text>
        </motion.g>

        {/* k indicator */}
        <rect
          x="122"
          y="90"
          width={s.meet ? 35 : 28}
          height="12"
          rx="6"
          fill={s.meet ? "rgba(34,197,94,0.2)" : s.lap > 0 ? "rgba(251,113,133,0.2)" : "rgba(100,116,139,0.15)"}
          stroke={s.meet ? "rgba(34,197,94,0.5)" : s.lap > 0 ? "rgba(251,113,133,0.4)" : "rgba(100,116,139,0.3)"}
        />
        <text
          x={s.meet ? "139" : "136"}
          y="99"
          textAnchor="middle"
          fontSize="7"
          fontWeight="600"
          fill={s.meet ? "#4ade80" : s.lap > 0 ? "#fb7185" : "#94a3b8"}
        >
          {s.meet ? "Found!" : `k=${s.lap}`}
        </text>
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
