"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "../flow-models/illustration-controls"

// Example: 1 → 2 → 3 → [4 → 5 → 6 → 7 → 8 → back to 4]
// L = 3 (distance to cycle entrance)
// C = 5 (cycle length)
// Meeting point at node 6, so M = 2

const nodes = [
  // Linear part (L = 3)
  { id: 0, val: 1, x: 20, y: 70 },
  { id: 1, val: 2, x: 50, y: 70 },
  { id: 2, val: 3, x: 80, y: 70 },
  // Cycle part (C = 5) - arranged as pentagon
  { id: 3, val: 4, x: 115, y: 55 },  // entrance (top-left of cycle)
  { id: 4, val: 5, x: 150, y: 45 },  // top-right
  { id: 5, val: 6, x: 170, y: 75 },  // right
  { id: 6, val: 7, x: 150, y: 105 }, // bottom-right
  { id: 7, val: 8, x: 115, y: 95 },  // bottom-left
]

const cycleEntrance = 3
const cycleLength = 5
const linearLength = 3

const edges: { from: number; to: number; path: string }[] = [
  // Linear edges
  { from: 0, to: 1, path: "M 30 70 L 40 70" },
  { from: 1, to: 2, path: "M 60 70 L 70 70" },
  { from: 2, to: 3, path: "M 90 70 Q 100 70 105 60" },
  // Cycle edges
  { from: 3, to: 4, path: "M 125 52 Q 138 45 140 48" },
  { from: 4, to: 5, path: "M 158 50 Q 168 58 168 65" },
  { from: 5, to: 6, path: "M 168 85 Q 165 98 158 102" },
  { from: 6, to: 7, path: "M 142 108 Q 130 108 122 100" },
  { from: 7, to: 3, path: "M 115 85 Q 108 70 115 62" }, // cycle back
]

type Step = {
  label: string
  phase: 0 | 1 | 2
  slow: number
  fast: number
  meet?: boolean
  entrance?: boolean
  showM?: boolean
}

const steps: Step[] = [
  { label: "Floyd's Cycle Detection: Find the cycle entrance", phase: 0, slow: 0, fast: 0 },
  // Phase 1
  { label: "Phase 1: slow moves ×1, fast moves ×2", phase: 1, slow: 1, fast: 2 },
  { label: "slow → 3, fast → 5", phase: 1, slow: 2, fast: 4 },
  { label: "slow → 4 (enters cycle), fast → 7", phase: 1, slow: 3, fast: 6 },
  { label: "slow → 5, fast → 4", phase: 1, slow: 4, fast: 3 },
  { label: "slow → 6, fast → 6 — meeting point!", phase: 1, slow: 5, fast: 5, meet: true, showM: true },
  // Phase 2
  { label: "Phase 2: reset slow to head, both move ×1", phase: 2, slow: 0, fast: 5 },
  { label: "slow → 2, fast → 7", phase: 2, slow: 1, fast: 6 },
  { label: "slow → 3, fast → 8", phase: 2, slow: 2, fast: 7 },
  { label: "slow → 4, fast → 4 — entrance found!", phase: 2, slow: 3, fast: 3, meet: true },
  { label: "L = kC − M proves they meet at entrance", phase: 2, slow: 3, fast: 3, entrance: true },
]

const spring = { type: "spring", stiffness: 120, damping: 20 } as const

export function LinkedListCycleIIIllustration({
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
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 2200)
    return () => clearInterval(id)
  }, [playing])

  const s = steps[step]

  const getNodeFill = (idx: number) => {
    if (s.entrance && idx === cycleEntrance) return "url(#entranceGrad)"
    if (s.meet && (idx === s.slow || idx === s.fast)) return "url(#meetGrad)"
    if (idx >= cycleEntrance) return "url(#cycleGrad)"
    return "url(#linearGrad)"
  }

  const getNodeStroke = (idx: number) => {
    if (s.entrance && idx === cycleEntrance) return "#22c55e"
    if (s.meet && (idx === s.slow || idx === s.fast)) return "#a855f7"
    if (idx >= cycleEntrance) return "rgba(99,102,241,0.6)"
    return "rgba(148,163,184,0.5)"
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        viewBox="0 0 200 140"
        className={sizeClasses[size]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <defs>
          <linearGradient id="linearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(148,163,184,0.2)" />
            <stop offset="100%" stopColor="rgba(148,163,184,0.05)" />
          </linearGradient>
          <linearGradient id="cycleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.25)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.1)" />
          </linearGradient>
          <linearGradient id="meetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.5)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.25)" />
          </linearGradient>
          <linearGradient id="entranceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.5)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.2)" />
          </linearGradient>
          <linearGradient id="slowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="fastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0.5 L5,3 L0,5.5 Z" fill="rgba(148,163,184,0.5)" />
          </marker>
          <marker id="arrCycle" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0.5 L5,3 L0,5.5 Z" fill="rgba(99,102,241,0.7)" />
          </marker>
          <marker id="arrGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0.5 L5,3 L0,5.5 Z" fill="#22c55e" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* L annotation (linear distance) - teal color */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: s.phase > 0 ? 0.9 : 0.4 }}
        >
          <path
            d="M 20 88 L 80 88"
            stroke="rgba(20,184,166,0.6)"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#arr)"
          />
          <line x1="20" y1="85" x2="20" y2="91" stroke="rgba(20,184,166,0.6)" strokeWidth="1" />
          <line x1="80" y1="85" x2="80" y2="91" stroke="rgba(20,184,166,0.6)" strokeWidth="1" />
          <rect x="40" y="90" width="22" height="12" rx="3" fill="rgba(20,184,166,0.15)" />
          <text x="51" y="99" textAnchor="middle" fontSize="8" fill="#2dd4bf" fontWeight="600">
            L={linearLength}
          </text>
        </motion.g>

        {/* C annotation (cycle length) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: s.phase > 0 ? 0.9 : 0.4 }}
        >
          <ellipse
            cx="142"
            cy="75"
            rx="42"
            ry="40"
            fill="none"
            stroke="rgba(99,102,241,0.3)"
            strokeWidth="1"
            strokeDasharray="4,3"
          />
          <rect x="172" y="28" width="24" height="12" rx="3" fill="rgba(99,102,241,0.15)" />
          <text x="184" y="37" textAnchor="middle" fontSize="8" fill="#818cf8" fontWeight="600">
            C={cycleLength}
          </text>
        </motion.g>

        {/* M annotation (meeting distance from entrance) - rose/pink color */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: s.showM ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            d="M 120 50 Q 145 35 155 42"
            stroke="rgba(251,113,133,0.8)"
            strokeWidth="1.5"
            strokeDasharray="3,2"
            fill="none"
          />
          <rect x="130" y="24" width="26" height="12" rx="3" fill="rgba(251,113,133,0.2)" />
          <text x="143" y="33" textAnchor="middle" fontSize="8" fill="#fb7185" fontWeight="600">
            M=2
          </text>
        </motion.g>

        {/* Edges */}
        {edges.map(({ from, to, path }, i) => {
          const isCycleBack = from === 7 && to === 3
          const isInCycle = from >= cycleEntrance
          return (
            <motion.path
              key={`edge-${i}`}
              d={path}
              fill="none"
              strokeWidth={isCycleBack ? 1.5 : 1.2}
              strokeDasharray={isCycleBack ? "5,4" : undefined}
              stroke={
                s.entrance && isCycleBack
                  ? "#22c55e"
                  : isInCycle
                    ? "rgba(99,102,241,0.5)"
                    : "rgba(148,163,184,0.4)"
              }
              markerEnd={
                s.entrance && isCycleBack
                  ? "url(#arrGreen)"
                  : isInCycle
                    ? "url(#arrCycle)"
                    : "url(#arr)"
              }
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node, idx) => (
          <g key={`node-${idx}`}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="11"
              fill={getNodeFill(idx)}
              stroke={getNodeStroke(idx)}
              strokeWidth={s.entrance && idx === cycleEntrance ? 2.5 : 1.5}
              filter={s.entrance && idx === cycleEntrance ? "url(#glow)" : undefined}
              initial={{ scale: 0 }}
              animate={{ scale: s.entrance && idx === cycleEntrance ? 1.15 : 1 }}
              transition={{ ...spring, delay: idx * 0.04 }}
            />
            <motion.text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              className={
                s.entrance && idx === cycleEntrance
                  ? "fill-green-400"
                  : idx >= cycleEntrance
                    ? "fill-indigo-300"
                    : "fill-slate-300"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.04 + 0.15 }}
            >
              {node.val}
            </motion.text>
          </g>
        ))}

        {/* Slow pointer */}
        <motion.g
          animate={{ x: nodes[s.slow].x, y: nodes[s.slow].y - 22 }}
          transition={spring}
        >
          <rect x="-15" y="-8" width="30" height="16" rx="8" fill="url(#slowGrad)" />
          <text x="0" y="4" textAnchor="middle" fontSize="8" fill="white" fontWeight="700">
            slow
          </text>
          <path d="M0,8 L0,11" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <circle cx="0" cy="13" r="2" fill="#fbbf24" />
        </motion.g>

        {/* Fast pointer */}
        <motion.g
          animate={{ x: nodes[s.fast].x, y: nodes[s.fast].y + 22 }}
          transition={spring}
        >
          <circle cx="0" cy="-13" r="2" fill="#38bdf8" />
          <path d="M0,-11 L0,-8" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <rect x="-13" y="-8" width="26" height="16" rx="8" fill="url(#fastGrad)" />
          <text x="0" y="4" textAnchor="middle" fontSize="8" fill="white" fontWeight="700">
            fast
          </text>
        </motion.g>

        {/* Phase indicator */}
        <motion.g
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: s.phase > 0 ? 1 : 0, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <rect
            x="3"
            y="3"
            width="50"
            height="18"
            rx="9"
            fill={s.phase === 1 ? "rgba(244,63,94,0.15)" : "rgba(34,197,94,0.15)"}
            stroke={s.phase === 1 ? "rgba(244,63,94,0.4)" : "rgba(34,197,94,0.4)"}
            strokeWidth="1"
          />
          <text
            x="28"
            y="15"
            textAnchor="middle"
            fontSize="9"
            fontWeight="600"
            fill={s.phase === 1 ? "#fb7185" : "#4ade80"}
          >
            Phase {s.phase}
          </text>
        </motion.g>

        {/* Formula annotation at entrance */}
        {s.entrance && (
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <rect x="3" y="120" width="85" height="16" rx="4" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.3)" strokeWidth="0.75" />
            <text x="45.5" y="131" textAnchor="middle" fontSize="8" fill="#4ade80" fontWeight="500">
              L = kC − M → entrance
            </text>
          </motion.g>
        )}
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
