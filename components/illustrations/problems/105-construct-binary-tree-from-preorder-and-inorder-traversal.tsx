"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "../flow-models/illustration-controls"

// Tree structure: [3, 9, 20, 1, 2, 15, 7]
// preorder: [3, 9, 1, 2, 20, 15, 7]
// inorder:  [1, 9, 2, 3, 15, 20, 7]

type TreeNodePos = { val: number; x: number; y: number; left?: number; right?: number }

// Full tree - always visible
const nodes: TreeNodePos[] = [
  { val: 3, x: 40, y: 20, left: 1, right: 2 },
  { val: 9, x: 20, y: 45, left: 3, right: 4 },
  { val: 20, x: 60, y: 45, left: 5, right: 6 },
  { val: 1, x: 10, y: 70 },
  { val: 2, x: 30, y: 70 },
  { val: 15, x: 50, y: 70 },
  { val: 7, x: 70, y: 70 },
]

const preorder = [3, 9, 1, 2, 20, 15, 7]
const inorder = [1, 9, 2, 3, 15, 20, 7]

type Step = {
  label: string
  preRootIdx?: number
  inRootIdx?: number
  leftRange?: [number, number]
  rightRange?: [number, number]
  builtNodes: number[]
  activeNode?: number
  focusNodes?: number[]
  showSplit?: boolean
  showComplete?: boolean
}

const steps: Step[] = [
  { label: "Build tree from preorder & inorder", builtNodes: [] },
  { label: "preorder[0] = 3 is the root", preRootIdx: 0, inRootIdx: 3, builtNodes: [], activeNode: 0 },
  { label: "Find 3 in inorder → left [1,9,2] right [15,20,7]", preRootIdx: 0, inRootIdx: 3, leftRange: [0, 2], rightRange: [4, 6], builtNodes: [0], focusNodes: [1, 3, 4], showSplit: true },
  { label: "Recurse: build left subtree", preRootIdx: 1, inRootIdx: 1, builtNodes: [0], focusNodes: [1, 3, 4], activeNode: 1 },
  { label: "preorder[1] = 9 → left subtree root", preRootIdx: 1, inRootIdx: 1, builtNodes: [0], activeNode: 1, focusNodes: [1, 3, 4] },
  { label: "Find 9 in inorder → left [1] right [2]", preRootIdx: 1, inRootIdx: 1, leftRange: [0, 0], rightRange: [2, 2], builtNodes: [0, 1], focusNodes: [3, 4], showSplit: true },
  { label: "Attach leaves 1 and 2", builtNodes: [0, 1], activeNode: 3, focusNodes: [3, 4] },
  { label: "Left subtree complete", builtNodes: [0, 1, 3, 4], focusNodes: [1, 3, 4] },
  { label: "Recurse: build right subtree", preRootIdx: 4, inRootIdx: 5, builtNodes: [0, 1, 3, 4], focusNodes: [2, 5, 6], activeNode: 2 },
  { label: "preorder[4] = 20 → right subtree root", preRootIdx: 4, inRootIdx: 5, leftRange: [4, 4], rightRange: [6, 6], builtNodes: [0, 1, 3, 4], activeNode: 2, focusNodes: [2, 5, 6], showSplit: true },
  { label: "Attach leaves 15 and 7", builtNodes: [0, 1, 2, 3, 4], activeNode: 5, focusNodes: [5, 6] },
  { label: "Tree construction complete!", builtNodes: [0, 1, 2, 3, 4, 5, 6], showComplete: true },
]

const ease = { type: "spring", stiffness: 80, damping: 20 } as const

function getNodeStyle(i: number, s: Step) {
  if (s.showComplete) return "fill-green-500/20 stroke-green-500 dark:fill-green-400/20 dark:stroke-green-400"
  if (s.activeNode === i) return "fill-yellow-500/30 stroke-yellow-500 dark:fill-yellow-400/30 dark:stroke-yellow-400"
  if (s.builtNodes.includes(i)) return "fill-blue-500/20 stroke-blue-500 dark:fill-blue-400/20 dark:stroke-blue-400"
  if (s.focusNodes?.includes(i)) return "fill-rose-500/10 stroke-rose-500/50 dark:fill-rose-400/10 dark:stroke-rose-400/50"
  return "fill-current/5 stroke-current/20"
}

function getEdgeOpacity(parentIdx: number, childIdx: number, s: Step) {
  if (s.showComplete) return 1
  const parentBuilt = s.builtNodes.includes(parentIdx) || s.activeNode === parentIdx
  const childBuilt = s.builtNodes.includes(childIdx) || s.activeNode === childIdx
  if (parentBuilt && childBuilt) return 1
  if (s.focusNodes && s.focusNodes.includes(parentIdx) && s.focusNodes.includes(childIdx)) return 0.3
  return 0.15
}

export function ConstructBinaryTreeIllustration({
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

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        viewBox="0 0 260 130"
        className={sizeClasses[size]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Tree section - always show full tree */}
        <g transform="translate(5, 15)">
          {/* Edges - always visible with varying opacity */}
          {nodes.map((node, i) => (
            <g key={`edges-${i}`}>
              {node.left !== undefined && (
                <motion.line
                  x1={node.x}
                  y1={node.y + 6}
                  x2={nodes[node.left].x}
                  y2={nodes[node.left].y - 6}
                  className={s.showComplete ? "stroke-green-500 dark:stroke-green-400" : "stroke-current"}
                  strokeWidth="1.5"
                  initial={{ opacity: 0.15 }}
                  animate={{ opacity: getEdgeOpacity(i, node.left, s) }}
                  transition={ease}
                />
              )}
              {node.right !== undefined && (
                <motion.line
                  x1={node.x}
                  y1={node.y + 6}
                  x2={nodes[node.right].x}
                  y2={nodes[node.right].y - 6}
                  className={s.showComplete ? "stroke-green-500 dark:stroke-green-400" : "stroke-current"}
                  strokeWidth="1.5"
                  initial={{ opacity: 0.15 }}
                  animate={{ opacity: getEdgeOpacity(i, node.right, s) }}
                  transition={ease}
                />
              )}
            </g>
          ))}

          {/* Nodes - always visible with varying styles */}
          {nodes.map((node, i) => {
            const isBuilt = s.builtNodes.includes(i) || s.activeNode === i || s.showComplete
            const isFocus = s.focusNodes?.includes(i)
            return (
              <motion.g
                key={`node-${i}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={ease}
              >
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="9"
                  className={getNodeStyle(i, s)}
                  strokeWidth={s.activeNode === i ? 2.5 : isFocus ? 1.5 : 1}
                  strokeDasharray={!isBuilt && isFocus ? "3,2" : undefined}
                  initial={{ scale: 1 }}
                  animate={{ scale: s.activeNode === i ? 1.15 : 1 }}
                  transition={ease}
                />
                <text
                  x={node.x}
                  y={node.y + 3}
                  textAnchor="middle"
                  fontSize="8"
                  className={isBuilt ? "fill-current" : "fill-current/40"}
                  fontWeight={s.activeNode === i ? "bold" : "500"}
                >
                  {node.val}
                </text>
              </motion.g>
            )
          })}
        </g>

        {/* Arrays section */}
        <g transform="translate(95, 12)">
          {/* Root pointer box */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: s.preRootIdx !== undefined ? 1 : 0 }} transition={ease}>
            <rect x="55" y="-2" width="28" height="14" rx="3" className="fill-yellow-500/20 stroke-yellow-500 dark:fill-yellow-400/20 dark:stroke-yellow-400" strokeWidth="1" />
            <text x="69" y="8" textAnchor="middle" fontSize="7" className="fill-yellow-600 dark:fill-yellow-400" fontWeight="500">
              root
            </text>
            <motion.path
              d="M69,13 L69,20"
              className="stroke-yellow-500 dark:stroke-yellow-400"
              strokeWidth="1.5"
              markerEnd="url(#arrowY)"
              initial={{ x: 0 }}
              animate={{ x: (s.preRootIdx ?? 0) * 14 - 19 }}
              transition={ease}
            />
          </motion.g>

          {/* Preorder label & array */}
          <text x="0" y="30" fontSize="8" className="fill-current/70" fontWeight="500">
            preorder:
          </text>
          <g transform="translate(50, 22)">
            {preorder.map((val, i) => {
              const isRoot = i === s.preRootIdx
              return (
                <g key={`pre-${i}`}>
                  <rect
                    x={i * 14}
                    y="0"
                    width="13"
                    height="15"
                    rx="2"
                    className={
                      isRoot
                        ? "fill-yellow-500/30 stroke-yellow-500 dark:fill-yellow-400/30 dark:stroke-yellow-400"
                        : "fill-current/10 stroke-current/30"
                    }
                    strokeWidth="0.75"
                  />
                  <text
                    x={i * 14 + 6.5}
                    y="11"
                    textAnchor="middle"
                    fontSize="8"
                    className={isRoot ? "fill-yellow-600 dark:fill-yellow-400" : "fill-current"}
                    fontWeight={isRoot ? "bold" : "normal"}
                  >
                    {val}
                  </text>
                </g>
              )
            })}
          </g>

          {/* Inorder label & array */}
          <text x="0" y="60" fontSize="8" className="fill-current/70" fontWeight="500">
            inorder:
          </text>
          <g transform="translate(50, 52)">
            {inorder.map((val, i) => {
              const isRoot = i === s.inRootIdx
              const isLeft = s.showSplit && s.leftRange && i >= s.leftRange[0] && i <= s.leftRange[1]
              const isRight = s.showSplit && s.rightRange && i >= s.rightRange[0] && i <= s.rightRange[1]
              return (
                <g key={`in-${i}`}>
                  <rect
                    x={i * 14}
                    y="0"
                    width="13"
                    height="15"
                    rx="2"
                    className={
                      isRoot
                        ? "fill-yellow-500/30 stroke-yellow-500 dark:fill-yellow-400/30 dark:stroke-yellow-400"
                        : isLeft
                          ? "fill-rose-500/25 stroke-rose-500 dark:fill-rose-400/25 dark:stroke-rose-400"
                          : isRight
                            ? "fill-sky-500/25 stroke-sky-500 dark:fill-sky-400/25 dark:stroke-sky-400"
                            : "fill-current/10 stroke-current/30"
                    }
                    strokeWidth="0.75"
                  />
                  <text
                    x={i * 14 + 6.5}
                    y="11"
                    textAnchor="middle"
                    fontSize="8"
                    className={
                      isRoot ? "fill-yellow-600 dark:fill-yellow-400" : isLeft ? "fill-rose-600 dark:fill-rose-400" : isRight ? "fill-sky-600 dark:fill-sky-400" : "fill-current"
                    }
                    fontWeight={isRoot || isLeft || isRight ? "600" : "normal"}
                  >
                    {val}
                  </text>
                </g>
              )
            })}
          </g>

          {/* Left/Right subtree labels with arrows */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: s.showSplit ? 1 : 0 }} transition={ease}>
            {s.leftRange && (
              <g>
                <path
                  d={`M${50 + s.leftRange[0] * 14 + 6},74 Q${50 + ((s.leftRange[0] + s.leftRange[1]) / 2) * 14 + 6},84 ${50 + s.leftRange[1] * 14 + 6},74`}
                  className="stroke-rose-500 dark:stroke-rose-400"
                  strokeWidth="1.5"
                  fill="none"
                  markerEnd="url(#arrowRose)"
                />
                <rect
                  x={50 + ((s.leftRange[0] + s.leftRange[1]) / 2) * 14 - 18}
                  y="86"
                  width="50"
                  height="14"
                  rx="3"
                  className="fill-rose-500/20 stroke-rose-500 dark:fill-rose-400/20 dark:stroke-rose-400"
                  strokeWidth="1"
                />
                <text
                  x={50 + ((s.leftRange[0] + s.leftRange[1]) / 2) * 14 + 7}
                  y="96"
                  textAnchor="middle"
                  fontSize="7"
                  className="fill-rose-600 dark:fill-rose-400"
                  fontWeight="500"
                >
                  left subtree
                </text>
              </g>
            )}
            {s.rightRange && (
              <g>
                <path
                  d={`M${50 + s.rightRange[0] * 14 + 6},74 Q${50 + ((s.rightRange[0] + s.rightRange[1]) / 2) * 14 + 6},84 ${50 + s.rightRange[1] * 14 + 6},74`}
                  className="stroke-sky-500 dark:stroke-sky-400"
                  strokeWidth="1.5"
                  fill="none"
                  markerEnd="url(#arrowSky)"
                />
                <rect
                  x={50 + ((s.rightRange[0] + s.rightRange[1]) / 2) * 14 - 20}
                  y="86"
                  width="54"
                  height="14"
                  rx="3"
                  className="fill-sky-500/20 stroke-sky-500 dark:fill-sky-400/20 dark:stroke-sky-400"
                  strokeWidth="1"
                />
                <text
                  x={50 + ((s.rightRange[0] + s.rightRange[1]) / 2) * 14 + 7}
                  y="96"
                  textAnchor="middle"
                  fontSize="7"
                  className="fill-sky-600 dark:fill-sky-400"
                  fontWeight="500"
                >
                  right subtree
                </text>
              </g>
            )}
          </motion.g>
        </g>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowY" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-yellow-500 dark:fill-yellow-400" />
          </marker>
          <marker id="arrowRose" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-rose-500 dark:fill-rose-400" />
          </marker>
          <marker id="arrowSky" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" className="fill-sky-500 dark:fill-sky-400" />
          </marker>
        </defs>
      </motion.svg>

      <p className="text-xs text-center text-current/80 h-4">{s.label}</p>

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
