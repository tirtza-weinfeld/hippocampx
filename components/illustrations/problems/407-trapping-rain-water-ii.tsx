"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "../flow-models/illustration-controls"

const grid = [
  [4, 3, 4, 4],
  [3, 0, 2, 4],
  [4, 1, 0, 3],
  [4, 4, 3, 4],
]
const R = 4, C = 4

type Step = {
  label: string
  processing?: [number, number]
  exploring?: [number, number][]
  water: Partial<Record<string, number>>
  visited: string[]
  total: number
  code: string
}

const borders = (() => {
  const s: string[] = []
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (r === 0 || r === R - 1 || c === 0 || c === C - 1) s.push(`${r},${c}`)
  return s
})()
const borderSet = new Set(borders)
const allVis = [...borders, "1,1", "2,1", "1,2", "2,2"]
const allWater = { "1,1": 3, "2,1": 2, "1,2": 1, "2,2": 3 } as const

const steps: Step[] = [
  { label: "Min-heap BFS from border cells inward", water: {}, visited: [], total: 0,
    code: "heapify(heap := [(h,r,c) for border cells])" },
  { label: "Init: 12 border cells in heap, min height = 3", water: {}, visited: [...borders], total: 0,
    code: "vis = [[is_border(r,c) ...]] # mark borders" },
  { label: "Pop (h=3, r=0, c=1) → neighbor (1,1) h=0", processing: [0, 1], exploring: [[1, 1]],
    water: {}, visited: [...borders], total: 0,
    code: "h, r, c = heappop(heap)  # (3, 0, 1)" },
  { label: "height 0 < wall 3 → trap 3 units at (1,1)", processing: [0, 1], exploring: [[1, 1]],
    water: { "1,1": 3 }, visited: [...borders, "1,1"], total: 3,
    code: "water += 3 - 0; heappush(heap, (3, 1, 1))" },
  { label: "Pop (h=3, r=1, c=1) → neighbors (2,1), (1,2)", processing: [1, 1], exploring: [[2, 1], [1, 2]],
    water: { "1,1": 3 }, visited: [...borders, "1,1"], total: 3,
    code: "h, r, c = heappop(heap)  # (3, 1, 1)" },
  { label: "(2,1): 1<3 +2 water. (1,2): 2<3 +1 water", processing: [1, 1], exploring: [[2, 1], [1, 2]],
    water: { "1,1": 3, "2,1": 2, "1,2": 1 }, visited: [...borders, "1,1", "2,1", "1,2"], total: 6,
    code: "water += (3-1) + (3-2); push both" },
  { label: "Pop (h=3, r=1, c=2) → neighbor (2,2) h=0", processing: [1, 2], exploring: [[2, 2]],
    water: { "1,1": 3, "2,1": 2, "1,2": 1 }, visited: [...borders, "1,1", "2,1", "1,2"], total: 6,
    code: "h, r, c = heappop(heap)  # (3, 1, 2)" },
  { label: "height 0 < wall 3 → trap 3 units at (2,2)", processing: [1, 2], exploring: [[2, 2]],
    water: { ...allWater }, visited: allVis, total: 9,
    code: "water += 3 - 0; heappush(heap, (3, 2, 2))" },
  { label: "Remaining pops: all neighbors already visited",
    water: { ...allWater }, visited: allVis, total: 9,
    code: "while heap: ... # no unvisited neighbors" },
  { label: "Total trapped rain water = 9",
    water: { ...allWater }, visited: allVis, total: 9,
    code: "return water  # 9" },
]

const cW = 34, cH = 26, gap = 3, gX = 12, gY = 14
const spring = { type: "spring", stiffness: 120, damping: 20 } as const

export function TrappingRainWaterIIIllustration({
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
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 2800)
    return () => clearInterval(id)
  }, [playing])

  const s = steps[step]
  const vis = new Set(s.visited)
  const procKey = s.processing ? `${s.processing[0]},${s.processing[1]}` : null
  const expSet = new Set((s.exploring ?? []).map(([r, c]) => `${r},${c}`))

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg viewBox="0 0 340 205" className={sizeClasses[size]}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        {/* Column / row labels */}
        {[0, 1, 2, 3].map(c => (
          <text key={`c${c}`} x={gX + c * (cW + gap) + cW / 2} y={10} textAnchor="middle" fontSize="7" className="fill-slate-500">{c}</text>
        ))}
        {[0, 1, 2, 3].map(r => (
          <text key={`r${r}`} x={5} y={gY + r * (cH + gap) + cH / 2 + 3} textAnchor="middle" fontSize="7" className="fill-slate-500">{r}</text>
        ))}

        {/* Grid cells */}
        {grid.map((row, r) => row.map((h, c) => {
          const x = gX + c * (cW + gap), y = gY + r * (cH + gap)
          const k = `${r},${c}`
          const isProc = k === procKey, isExp = expSet.has(k)
          const w = s.water[k]
          const hi = Math.min(h / 5, 1)
          let fill = `rgba(148,163,184,${(0.08 + hi * 0.25).toFixed(2)})`
          let stroke = `rgba(148,163,184,${(0.2 + hi * 0.3).toFixed(2)})`
          if (isProc) { fill = "rgba(251,191,36,0.3)"; stroke = "rgba(251,191,36,0.7)" }
          else if (isExp) { fill = "rgba(99,102,241,0.25)"; stroke = "rgba(99,102,241,0.6)" }
          else if (borderSet.has(k) && vis.has(k)) { fill = "rgba(148,163,184,0.15)"; stroke = "rgba(148,163,184,0.35)" }

          return (
            <g key={k}>
              <motion.rect x={x} y={y} width={cW} height={cH} rx={4}
                fill={fill} stroke={stroke} strokeWidth={1.2}
                animate={{ fill, stroke }} transition={spring} />
              {w === undefined ? (
                <text x={x + cW / 2} y={y + cH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="600"
                  className={isProc ? "fill-amber-300" : isExp ? "fill-indigo-300" : "fill-slate-400"}>{h}</text>
              ) : (
                <>
                  <motion.rect x={x + 2} y={y + 2} width={cW - 4} height={cH - 4} rx={2}
                    fill={`rgba(56,189,248,${(Math.min(w / 4, 1) * 0.4 + 0.1).toFixed(2)})`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring} />
                  <motion.text x={x + cW / 2} y={y + cH / 2 + 4} textAnchor="middle"
                    fontSize="9" fontWeight="700" fill="#38bdf8"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>+{w}</motion.text>
                </>
              )}
            </g>
          )
        }))}

        {/* Info panel */}
        <g transform="translate(175, 14)">
          {s.processing && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={0} y={10} fontSize="8" fontWeight="600" className="fill-slate-500">popped</text>
              <rect x={40} y={0} width={44} height={16} rx={3} fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.5)" strokeWidth={1} />
              <text x={62} y={12} textAnchor="middle" fontSize="8" fontWeight="600" fill="#fbbf24">({s.processing[0]},{s.processing[1]})</text>
            </motion.g>
          )}
          {s.exploring && s.exploring.length > 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={0} y={32} fontSize="8" fontWeight="600" className="fill-slate-500">check</text>
              {s.exploring.map(([r, c], i) => (
                <g key={`e${r}${c}`}>
                  <rect x={35 + i * 48} y={22} width={42} height={16} rx={3} fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.5)" strokeWidth={1} />
                  <text x={56 + i * 48} y={34} textAnchor="middle" fontSize="8" fontWeight="600" fill="#818cf8">({r},{c})</text>
                </g>
              ))}
            </motion.g>
          )}
          <text x={0} y={58} fontSize="8" fontWeight="600" className="fill-slate-500">water</text>
          <motion.rect x={35} y={48} width={36} height={18} rx={4}
            fill={s.total > 0 ? "rgba(56,189,248,0.15)" : "rgba(148,163,184,0.08)"}
            stroke={s.total > 0 ? "rgba(56,189,248,0.5)" : "rgba(148,163,184,0.3)"}
            strokeWidth={1.2} animate={{ fill: s.total > 0 ? "rgba(56,189,248,0.15)" : "rgba(148,163,184,0.08)" }} transition={spring} />
          <motion.text x={53} y={61} textAnchor="middle" fontSize="11" fontWeight="700"
            fill={s.total > 0 ? "#38bdf8" : "#94a3b8"} animate={{ fill: s.total > 0 ? "#38bdf8" : "#94a3b8" }} transition={spring}>
            {s.total}
          </motion.text>
        </g>

        {/* Legend */}
        <g transform="translate(175, 95)">
          <rect x={0} y={0} width={8} height={8} rx={2} fill="rgba(251,191,36,0.3)" stroke="rgba(251,191,36,0.7)" strokeWidth={0.8} />
          <text x={12} y={7} fontSize="7" className="fill-slate-500">popped</text>
          <rect x={52} y={0} width={8} height={8} rx={2} fill="rgba(99,102,241,0.25)" stroke="rgba(99,102,241,0.6)" strokeWidth={0.8} />
          <text x={64} y={7} fontSize="7" className="fill-slate-500">neighbor</text>
          <rect x={112} y={0} width={8} height={8} rx={2} fill="rgba(56,189,248,0.4)" stroke="rgba(56,189,248,0.6)" strokeWidth={0.8} />
          <text x={124} y={7} fontSize="7" className="fill-slate-500">water</text>
        </g>

        {/* Result */}
        <AnimatePresence>
          {step === steps.length - 1 && (
            <motion.g key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={spring}>
              <rect x={100} y={128} width={140} height={24} rx={6} fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.6)" strokeWidth={1.5} />
              <text x={170} y={144} textAnchor="middle" fontSize="12" fontWeight="700" fill="#4ade80">water = {s.total}</text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Code line */}
        <rect x={4} y={165} width={332} height={18} rx={3} fill="rgba(148,163,184,0.06)" stroke="rgba(148,163,184,0.15)" strokeWidth={0.5} />
        <text x={10} y={178} fontSize="7.5" fontFamily="monospace" className="fill-slate-400">{s.code}</text>
      </motion.svg>

      <p className="text-sm text-center text-current/80 h-5 font-medium">{s.label}</p>

      <IllustrationControls step={step} totalSteps={steps.length} playing={playing}
        onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
