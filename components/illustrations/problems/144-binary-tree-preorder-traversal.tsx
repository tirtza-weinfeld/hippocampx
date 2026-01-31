"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "../flow-models/illustration-controls"

// Tree:      4
//          /   \
//         2     6
//        / \   / \
//       1   3 5   7
// Preorder: 4, 2, 1, 3, 6, 5, 7 (root → left → right)

type Node = { val: number; x: number; y: number; left?: number; right?: number }

const nodes: Node[] = [
  { val: 4, x: 50, y: 15, left: 1, right: 2 },
  { val: 2, x: 25, y: 40, left: 3, right: 4 },
  { val: 6, x: 75, y: 40, left: 5, right: 6 },
  { val: 1, x: 12, y: 65 },
  { val: 3, x: 38, y: 65 },
  { val: 5, x: 62, y: 65 },
  { val: 7, x: 88, y: 65 },
]

type Step = {
  label: string
  current?: number
  stack: number[]
  output: number[]
  phase?: "visit" | "descend" | "ascend"
}

// Preorder: visit → go left → go right
const steps: Step[] = [
  { label: "Start preorder traversal", stack: [], output: [] },
  { label: "Visit 4 first (root)", current: 0, stack: [0], output: [4], phase: "visit" },
  { label: "Go left to 2", current: 1, stack: [0, 1], output: [4], phase: "descend" },
  { label: "Visit 2", current: 1, stack: [0, 1], output: [4, 2], phase: "visit" },
  { label: "Go left to 1", current: 3, stack: [0, 1, 3], output: [4, 2], phase: "descend" },
  { label: "Visit 1 (leaf)", current: 3, stack: [0, 1], output: [4, 2, 1], phase: "visit" },
  { label: "Back to 2, go right to 3", current: 4, stack: [0, 4], output: [4, 2, 1], phase: "descend" },
  { label: "Visit 3 (leaf)", current: 4, stack: [0], output: [4, 2, 1, 3], phase: "visit" },
  { label: "Back to 4, go right to 6", current: 2, stack: [2], output: [4, 2, 1, 3], phase: "descend" },
  { label: "Visit 6", current: 2, stack: [2], output: [4, 2, 1, 3, 6], phase: "visit" },
  { label: "Go left to 5", current: 5, stack: [2, 5], output: [4, 2, 1, 3, 6], phase: "descend" },
  { label: "Visit 5 (leaf)", current: 5, stack: [2], output: [4, 2, 1, 3, 6, 5], phase: "visit" },
  { label: "Back to 6, go right to 7", current: 6, stack: [6], output: [4, 2, 1, 3, 6, 5], phase: "descend" },
  { label: "Visit 7 (leaf)", current: 6, stack: [], output: [4, 2, 1, 3, 6, 5, 7], phase: "visit" },
  { label: "Complete! Root → Left → Right", stack: [], output: [4, 2, 1, 3, 6, 5, 7] },
]

const ease = { type: "spring", stiffness: 120, damping: 20 } as const

export function PreorderTraversalIllustration({
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
  const isComplete = step === steps.length - 1

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg viewBox="0 0 200 130" className={sizeClasses[size]} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Tree */}
        <g transform="translate(0, 5)">
          {/* Edges */}
          {nodes.map((node, i) => (
            <g key={`edges-${i}`}>
              {node.left !== undefined && (
                <line
                  x1={node.x}
                  y1={node.y + 7}
                  x2={nodes[node.left].x}
                  y2={nodes[node.left].y - 7}
                  className="stroke-current/20"
                  strokeWidth="1.5"
                />
              )}
              {node.right !== undefined && (
                <line
                  x1={node.x}
                  y1={node.y + 7}
                  x2={nodes[node.right].x}
                  y2={nodes[node.right].y - 7}
                  className="stroke-current/20"
                  strokeWidth="1.5"
                />
              )}
            </g>
          ))}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const isCurrent = s.current === i
            const inStack = s.stack.includes(i)
            const visited = s.output.includes(node.val)

            return (
              <motion.g key={`node-${i}`}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="10"
                  className={
                    isComplete
                      ? "fill-emerald-500/20 stroke-emerald-500"
                      : isCurrent
                        ? "fill-amber-500/30 stroke-amber-500"
                        : visited
                          ? "fill-sky-500/20 stroke-sky-500"
                          : inStack
                            ? "fill-violet-500/15 stroke-violet-500/60"
                            : "fill-current/5 stroke-current/25"
                  }
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                  animate={{ scale: isCurrent ? 1.15 : 1 }}
                  transition={ease}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isCurrent ? "bold" : "500"}
                  className={isCurrent || visited || isComplete ? "fill-current" : "fill-current/60"}
                >
                  {node.val}
                </text>
              </motion.g>
            )
          })}

          {/* Traversal order indicator */}
          {s.current !== undefined && s.phase && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={`phase-${step}`}>
              <motion.circle
                cx={nodes[s.current].x}
                cy={nodes[s.current].y}
                r="15"
                fill="none"
                className={s.phase === "visit" ? "stroke-amber-400" : "stroke-violet-400"}
                strokeWidth="1"
                strokeDasharray="3,3"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: [0, 0.6, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.g>
          )}
        </g>

        {/* Output array */}
        <g transform="translate(10, 90)">
          <text x="0" y="10" fontSize="8" className="fill-current/60" fontWeight="500">
            output:
          </text>
          <g transform="translate(40, 0)">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const hasValue = i < s.output.length
              const val = s.output[i]
              const justAdded = i === s.output.length - 1 && s.phase === "visit"
              return (
                <g key={`out-${i}`}>
                  <rect
                    x={i * 18}
                    y="0"
                    width="16"
                    height="16"
                    rx="3"
                    className={
                      hasValue
                        ? isComplete
                          ? "fill-emerald-500/20 stroke-emerald-500"
                          : justAdded
                            ? "fill-amber-500/30 stroke-amber-500"
                            : "fill-sky-500/20 stroke-sky-500"
                        : "fill-current/5 stroke-current/15"
                    }
                    strokeWidth="1"
                  />
                  {hasValue && (
                    <motion.text
                      x={i * 18 + 8}
                      y="12"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      className="fill-current"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={ease}
                    >
                      {val}
                    </motion.text>
                  )}
                </g>
              )
            })}
          </g>
        </g>

        {/* Call stack visualization */}
        <g transform="translate(175, 10)">
          <text x="0" y="8" fontSize="7" className="fill-current/50" textAnchor="middle">
            stack
          </text>
          {[0, 1, 2, 3].map((i) => {
            const stackIdx = s.stack.length - 1 - i
            const hasNode = stackIdx >= 0
            const nodeIdx = hasNode ? s.stack[stackIdx] : -1
            return (
              <g key={`stack-${i}`} transform={`translate(0, ${12 + i * 14})`}>
                <rect
                  x="-10"
                  y="0"
                  width="20"
                  height="12"
                  rx="2"
                  className={hasNode ? "fill-violet-500/20 stroke-violet-500" : "fill-current/5 stroke-current/10"}
                  strokeWidth="0.75"
                />
                {hasNode && (
                  <motion.text
                    x="0"
                    y="9"
                    textAnchor="middle"
                    fontSize="8"
                    className="fill-violet-600 dark:fill-violet-400"
                    fontWeight="500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {nodes[nodeIdx].val}
                  </motion.text>
                )}
              </g>
            )
          })}
        </g>

        {/* Order label */}
        <text x="100" y="125" textAnchor="middle" fontSize="7" className="fill-current/40" fontWeight="500">
          N → L → R
        </text>
      </motion.svg>

      <p className="text-xs text-center text-current/80 h-4">{s.label}</p>

      <IllustrationControls step={step} totalSteps={steps.length} playing={playing} onStep={setStep} onPlayingChange={setPlaying} />
    </div>
  )
}
