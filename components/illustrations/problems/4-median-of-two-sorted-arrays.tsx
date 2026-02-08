"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "../flow-models/illustration-controls"

// a = [1, 3], b = [2, 4, 5, 6] → median 3.5
const a = [1, 3]
const b = [2, 4, 5, 6]

type Step = {
  label: string
  i: number; j: number
  low: number; high: number
  bounds?: { al: string; ar: string; bl: string; br: string }
  alBrOk?: boolean; blArOk?: boolean
  decision?: string          // e.g. "low = i+1 = 2"
  result?: string
  code: string
}

const steps: Step[] = [
  { label: "Ensure a is the shorter array", i: -1, j: -1, low: 0, high: 2,
    code: "if len(a) > len(b): a, b = b, a" },
  { label: "Init binary search on a", i: -1, j: -1, low: 0, high: 2,
    code: "m, n, low, high = 2, 4, 0, 2" },
  { label: "Compute partition indices", i: 1, j: 2, low: 0, high: 2,
    code: "i = (0+2)//2 = 1   j = (7)//2 - 1 = 2" },
  { label: "Read boundary values at the cut", i: 1, j: 2, low: 0, high: 2,
    bounds: { al: "1", ar: "3", bl: "4", br: "5" },
    code: "al=a[0]=1  ar=a[1]=3  bl=b[1]=4  br=b[2]=5" },
  { label: "Cross-check fails → shift search right", i: 1, j: 2, low: 0, high: 2,
    bounds: { al: "1", ar: "3", bl: "4", br: "5" },
    alBrOk: true, blArOk: false, decision: "low = i+1 = 2",
    code: "else: low = i + 1" },
  { label: "New partition with narrowed range", i: 2, j: 1, low: 2, high: 2,
    code: "i = (2+2)//2 = 2   j = (7)//2 - 2 = 1" },
  { label: "ar = ∞ because i equals m", i: 2, j: 1, low: 2, high: 2,
    bounds: { al: "3", ar: "∞", bl: "2", br: "4" },
    code: "al=a[1]=3  ar=∞ (i==m)  bl=b[0]=2  br=b[1]=4" },
  { label: "Both checks pass — valid partition!", i: 2, j: 1, low: 2, high: 2,
    bounds: { al: "3", ar: "∞", bl: "2", br: "4" },
    alBrOk: true, blArOk: true,
    code: "if al <= br and bl <= ar:  # valid!" },
  { label: "Even total → median from boundaries", i: 2, j: 1, low: 2, high: 2,
    bounds: { al: "3", ar: "∞", bl: "2", br: "4" },
    alBrOk: true, blArOk: true, result: "3.5",
    code: "return (max(3,2) + min(∞,4)) / 2 = 3.5" },
]

const W = 44, H = 28, P = W + 6   // cell width, height, pitch
const X0 = 60                      // first cell x
const spring = { type: "spring", stiffness: 120, damping: 20 } as const
const cutX = (idx: number) => X0 + idx * P - 3

function cellStyle(part: number, idx: number, hasBounds: boolean) {
  if (part < 0) return { fill: "url(#cellDim)", stroke: "rgba(148,163,184,0.25)", txt: "fill-slate-400" }
  if (hasBounds && idx === part - 1) return { fill: "url(#cellAl)", stroke: "rgba(251,191,36,0.6)", txt: "fill-amber-300" }
  if (hasBounds && idx === part) return { fill: "url(#cellAr)", stroke: "rgba(56,189,248,0.6)", txt: "fill-sky-300" }
  if (idx < part) return { fill: "url(#cellLeft)", stroke: "rgba(99,102,241,0.5)", txt: "fill-indigo-300" }
  return { fill: "url(#cellDim)", stroke: "rgba(148,163,184,0.25)", txt: "fill-slate-400" }
}

export function MedianOfTwoSortedArraysIllustration({
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
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 3200)
    return () => clearInterval(id)
  }, [playing])

  const s = steps[step]
  const hasBounds = !!s.bounds
  const valid = s.alBrOk && s.blArOk

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg viewBox="0 0 400 210" className={sizeClasses[size]}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <defs>
          <linearGradient id="cellDim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(148,163,184,0.15)" />
            <stop offset="100%" stopColor="rgba(148,163,184,0.04)" />
          </linearGradient>
          <linearGradient id="cellLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.25)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0.08)" />
          </linearGradient>
          <linearGradient id="cellAl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,191,36,0.3)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0.08)" />
          </linearGradient>
          <linearGradient id="cellAr" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(56,189,248,0.3)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.08)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Search state: low / high pills ── */}
        <motion.g animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
          <rect x={280} y={4} width={52} height={18} rx={9}
            fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.4)" strokeWidth={1} />
          <text x={306} y={17} textAnchor="middle" fontSize="10" fill="#38bdf8" fontWeight="700">
            lo={s.low}
          </text>
          <rect x={338} y={4} width={52} height={18} rx={9}
            fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.4)" strokeWidth={1} />
          <text x={364} y={17} textAnchor="middle" fontSize="10" fill="#38bdf8" fontWeight="700">
            hi={s.high}
          </text>
        </motion.g>

        {/* ── Array a ── */}
        <text x={18} y={42} fontSize="13" fontWeight="700" className="fill-slate-500">a</text>
        {a.map((v, idx) => {
          const c = cellStyle(s.i, idx, hasBounds)
          return (
            <g key={`a${idx}`}>
              <rect x={X0 + idx * P} y={26} width={W} height={H} rx={6}
                fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
              <text x={X0 + idx * P + W / 2} y={45} textAnchor="middle"
                fontSize="14" fontWeight="700" className={c.txt}>{v}</text>
            </g>
          )
        })}
        {/* boundary labels under a */}
        {s.bounds && s.i > 0 && (
          <text x={X0 + (s.i - 1) * P + W / 2} y={66} textAnchor="middle"
            fontSize="8" fill="#fbbf24" fontWeight="600">al={s.bounds.al}</text>
        )}
        {s.bounds && s.i < a.length && (
          <text x={X0 + s.i * P + W / 2} y={66} textAnchor="middle"
            fontSize="8" fill="#38bdf8" fontWeight="600">ar={s.bounds.ar}</text>
        )}
        {s.bounds && s.i === a.length && (
          <text x={cutX(s.i) + 10} y={66} textAnchor="start"
            fontSize="8" fill="#38bdf8" fontWeight="600">ar={s.bounds.ar}</text>
        )}

        {/* ── Array b ── */}
        <text x={18} y={90} fontSize="13" fontWeight="700" className="fill-slate-500">b</text>
        {b.map((v, idx) => {
          const c = cellStyle(s.j, idx, hasBounds)
          return (
            <g key={`b${idx}`}>
              <rect x={X0 + idx * P} y={74} width={W} height={H} rx={6}
                fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
              <text x={X0 + idx * P + W / 2} y={93} textAnchor="middle"
                fontSize="14" fontWeight="700" className={c.txt}>{v}</text>
            </g>
          )
        })}
        {/* boundary labels under b */}
        {s.bounds && s.j > 0 && (
          <text x={X0 + (s.j - 1) * P + W / 2} y={114} textAnchor="middle"
            fontSize="8" fill="#fbbf24" fontWeight="600">bl={s.bounds.bl}</text>
        )}
        {s.bounds && s.j < b.length && (
          <text x={X0 + s.j * P + W / 2} y={114} textAnchor="middle"
            fontSize="8" fill="#38bdf8" fontWeight="600">br={s.bounds.br}</text>
        )}

        {/* ── Partition dashes ── */}
        {s.i >= 0 && (
          <motion.line
            initial={{ x1: cutX(s.i), x2: cutX(s.i) }}
            animate={{ x1: cutX(s.i), x2: cutX(s.i) }}
            y1={22} y2={58} stroke="rgba(250,204,21,0.6)" strokeWidth={2}
            strokeDasharray="5,3" transition={spring} />
        )}
        {s.j >= 0 && (
          <motion.line
            initial={{ x1: cutX(s.j), x2: cutX(s.j) }}
            animate={{ x1: cutX(s.j), x2: cutX(s.j) }}
            y1={70} y2={106} stroke="rgba(250,204,21,0.6)" strokeWidth={2}
            strokeDasharray="5,3" transition={spring} />
        )}

        {/* i / j pills at partition */}
        {s.i >= 0 && (
          <motion.g animate={{ x: cutX(s.i) }} transition={spring}>
            <rect x={-14} y={10} width={28} height={14} rx={7}
              fill="rgba(250,204,21,0.15)" stroke="rgba(250,204,21,0.5)" strokeWidth={1} />
            <text x={0} y={20} textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="700">i={s.i}</text>
          </motion.g>
        )}
        {s.j >= 0 && (
          <motion.g animate={{ x: cutX(s.j) }} transition={spring}>
            <rect x={-14} y={106} width={28} height={14} rx={7}
              fill="rgba(250,204,21,0.15)" stroke="rgba(250,204,21,0.5)" strokeWidth={1} />
            <text x={0} y={116} textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="700">j={s.j}</text>
          </motion.g>
        )}

        {/* ── Cross-check + decision ── */}
        <AnimatePresence>
          {s.alBrOk !== undefined && (
            <motion.g key="cross" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* al ≤ br */}
              <text x={18} y={142} fontSize="11" fontWeight="600"
                fill={s.alBrOk ? "#4ade80" : "#f87171"}>
                al ≤ br {s.alBrOk ? "✓" : "✗"}
              </text>
              {/* bl ≤ ar */}
              <text x={120} y={142} fontSize="11" fontWeight="600"
                fill={s.blArOk ? "#4ade80" : "#f87171"}>
                bl ≤ ar {s.blArOk ? "✓" : "✗"}
              </text>
              {/* verdict pill */}
              <rect x={230} y={128} width={68} height={20} rx={10}
                fill={valid ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.12)"}
                stroke={valid ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.4)"} strokeWidth={1} />
              <text x={264} y={142} textAnchor="middle" fontSize="10" fontWeight="700"
                fill={valid ? "#4ade80" : "#f87171"}>
                {valid ? "valid ✓" : "invalid ✗"}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* ── Decision: low/high update ── */}
        <AnimatePresence>
          {s.decision && (
            <motion.g key="dec" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <rect x={310} y={128} width={82} height={20} rx={10}
                fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.4)" strokeWidth={1} />
              <text x={351} y={142} textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="700">
                {s.decision}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* ── Result ── */}
        <AnimatePresence>
          {s.result && (
            <motion.g key="res" initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }} transition={spring}>
              <rect x={120} y={155} width={160} height={28} rx={8}
                fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.6)" strokeWidth={2}
                filter="url(#glow)" />
              <text x={200} y={174} textAnchor="middle" fontSize="15" fontWeight="800" fill="#4ade80">
                median = {s.result}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* ── Code line ── */}
        <rect x={8} y={190} width={384} height={16} rx={4}
          fill="rgba(148,163,184,0.04)" stroke="rgba(148,163,184,0.1)" strokeWidth={0.5} />
        <text x={16} y={202} fontSize="8.5" fontFamily="monospace" className="fill-slate-500">
          {s.code}
        </text>
      </motion.svg>

      <p className="text-sm text-center text-current/80 h-5 font-medium">{s.label}</p>

      <IllustrationControls
        step={step} totalSteps={steps.length} playing={playing}
        onStep={setStep} onPlayingChange={setPlaying}
      />
    </div>
  )
}
