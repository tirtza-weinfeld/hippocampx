"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls, type IllustrationSize, sizeClasses } from "../flow-models/illustration-controls"

// Tree: [1, 2, 3, 4, 5]
//        1
//       / \
//      2   3
//     / \
//    4   5
// preorder:  [1, 2, 4, 5, 3]
// postorder: [4, 5, 2, 3, 1]

type TreeNodePos = { val: number; x: number; y: number; left?: number; right?: number }

const nodes: TreeNodePos[] = [
  { val: 1, x: 50, y: 12, left: 1, right: 2 },
  { val: 2, x: 30, y: 36, left: 3, right: 4 },
  { val: 3, x: 70, y: 36 },
  { val: 4, x: 18, y: 60 },
  { val: 5, x: 42, y: 60 },
]

const preorder = [1, 2, 4, 5, 3]
const postorder = [4, 5, 2, 3, 1]

// Algorithm trace - each step shows state after an action
type Step = {
  label: string
  preConsumed: number // how many preorder values consumed
  postJ: number // current j pointer
  builtNodes: number[] // node indices that exist
  activeNode?: number // node currently being processed
  matchHighlight?: boolean // highlight when root.val == post[j]
  closingNode?: number // node being "closed" (j advancing)
}

const steps: Step[] = [
  {
    label: "Start: iterator on preorder, j=0 on postorder",
    preConsumed: 0,
    postJ: 0,
    builtNodes: [],
  },
  {
    label: "Consume 1 → create root. post[0]=4 ≠ 1, build left",
    preConsumed: 1,
    postJ: 0,
    builtNodes: [0],
    activeNode: 0,
  },
  {
    label: "Consume 2 → left of 1. post[0]=4 ≠ 2, build left",
    preConsumed: 2,
    postJ: 0,
    builtNodes: [0, 1],
    activeNode: 1,
  },
  {
    label: "Consume 4 → left of 2. post[0]=4 == 4 ✓ close subtree",
    preConsumed: 3,
    postJ: 0,
    builtNodes: [0, 1, 3],
    activeNode: 3,
    matchHighlight: true,
    closingNode: 3,
  },
  {
    label: "j++ → j=1. Back to node 2: post[1]=5 ≠ 2, build right",
    preConsumed: 3,
    postJ: 1,
    builtNodes: [0, 1, 3],
    activeNode: 1,
  },
  {
    label: "Consume 5 → right of 2. post[1]=5 == 5 ✓ close subtree",
    preConsumed: 4,
    postJ: 1,
    builtNodes: [0, 1, 3, 4],
    activeNode: 4,
    matchHighlight: true,
    closingNode: 4,
  },
  {
    label: "j++ → j=2. Back to node 2: post[2]=2 == 2 ✓ close subtree",
    preConsumed: 4,
    postJ: 2,
    builtNodes: [0, 1, 3, 4],
    activeNode: 1,
    matchHighlight: true,
    closingNode: 1,
  },
  {
    label: "j++ → j=3. Back to node 1: post[3]=3 ≠ 1, build right",
    preConsumed: 4,
    postJ: 3,
    builtNodes: [0, 1, 3, 4],
    activeNode: 0,
  },
  {
    label: "Consume 3 → right of 1. post[3]=3 == 3 ✓ close subtree",
    preConsumed: 5,
    postJ: 3,
    builtNodes: [0, 1, 2, 3, 4],
    activeNode: 2,
    matchHighlight: true,
    closingNode: 2,
  },
  {
    label: "j++ → j=4. Back to node 1: post[4]=1 == 1 ✓ done!",
    preConsumed: 5,
    postJ: 4,
    builtNodes: [0, 1, 2, 3, 4],
    activeNode: 0,
    matchHighlight: true,
    closingNode: 0,
  },
]

const ease = { type: "spring", stiffness: 100, damping: 18 } as const

export function ConstructBinaryTreePrePostIllustration({
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
  const { preConsumed, postJ, builtNodes, activeNode, matchHighlight, closingNode, label } = s

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        viewBox="0 0 200 130"
        className={sizeClasses[size]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Tree section - right side */}
        <g transform="translate(100, 8)">
          <text x="40" y="0" textAnchor="middle" fontSize="6" className="fill-current/50">
            Building Tree
          </text>

          {/* Edges */}
          {nodes.map((node, i) => (
            <g key={`edges-${i}`}>
              {node.left !== undefined && builtNodes.includes(i) && builtNodes.includes(node.left) && (
                <motion.line
                  x1={node.x}
                  y1={node.y + 6}
                  x2={nodes[node.left].x}
                  y2={nodes[node.left].y - 6}
                  className="stroke-current/40"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...ease, duration: 0.4 }}
                />
              )}
              {node.right !== undefined && builtNodes.includes(i) && builtNodes.includes(node.right) && (
                <motion.line
                  x1={node.x}
                  y1={node.y + 6}
                  x2={nodes[node.right].x}
                  y2={nodes[node.right].y - 6}
                  className="stroke-current/40"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...ease, duration: 0.4 }}
                />
              )}
            </g>
          ))}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const isBuilt = builtNodes.includes(i)
            const isActive = activeNode === i
            const isClosing = closingNode === i && matchHighlight
            return (
              <motion.g
                key={`node-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isBuilt ? 1 : 0.1,
                  scale: isBuilt ? 1 : 0.6,
                }}
                transition={ease}
              >
                {/* Glow effect for closing node */}
                {isClosing && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="12"
                    className="fill-green-500/20"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0] }}
                    transition={{ duration: 0.8 }}
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="9"
                  className={
                    isClosing
                      ? "fill-green-500/30 stroke-green-500 dark:fill-green-400/30 dark:stroke-green-400"
                      : isActive
                        ? "fill-amber-500/30 stroke-amber-500 dark:fill-amber-400/30 dark:stroke-amber-400"
                        : isBuilt
                          ? "fill-blue-500/20 stroke-blue-500 dark:fill-blue-400/20 dark:stroke-blue-400"
                          : "fill-current/5 stroke-current/20"
                  }
                  strokeWidth="2"
                />
                <text
                  x={node.x}
                  y={node.y + 3}
                  textAnchor="middle"
                  fontSize="8"
                  className="fill-current font-medium"
                >
                  {node.val}
                </text>
              </motion.g>
            )
          })}
        </g>

        {/* Arrays section - left side */}
        <g transform="translate(4, 18)">
          {/* Preorder array */}
          <text x="0" y="0" fontSize="6" className="fill-current/60">
            preorder (iterator):
          </text>
          {preorder.map((val, i) => {
            const isConsumed = i < preConsumed
            const isNext = i === preConsumed
            return (
              <motion.g key={`pre-${i}`}>
                <rect
                  x={i * 14}
                  y={6}
                  width="12"
                  height="14"
                  rx="2"
                  className={
                    isNext
                      ? "fill-amber-500/30 stroke-amber-500 dark:fill-amber-400/30 dark:stroke-amber-400"
                      : isConsumed
                        ? "fill-current/5 stroke-current/15"
                        : "fill-current/10 stroke-current/30"
                  }
                  strokeWidth="1"
                />
                <text
                  x={i * 14 + 6}
                  y={16}
                  textAnchor="middle"
                  fontSize="7"
                  className={isConsumed ? "fill-current/30" : "fill-current"}
                  fontWeight={isNext ? "bold" : "normal"}
                  style={{ textDecoration: isConsumed ? "line-through" : "none" }}
                >
                  {val}
                </text>
              </motion.g>
            )
          })}
          {/* Iterator arrow */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: preConsumed < preorder.length ? 1 : 0, x: preConsumed * 14 + 6 }}
            transition={ease}
          >
            <text x={0} y={-2} textAnchor="middle" fontSize="5" className="fill-amber-600 dark:fill-amber-400">
              next
            </text>
            <path d="M0,0 L0,4" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
          </motion.g>
        </g>

        {/* Postorder array */}
        <g transform="translate(4, 54)">
          <text x="0" y="0" fontSize="6" className="fill-current/60">
            postorder (j pointer):
          </text>
          {postorder.map((val, i) => {
            const isPassed = i < postJ
            const isCurrent = i === postJ
            const isMatching = matchHighlight && isCurrent
            return (
              <motion.g key={`post-${i}`}>
                {/* Match glow */}
                {isMatching && (
                  <motion.rect
                    x={i * 14 - 2}
                    y={4}
                    width="16"
                    height="18"
                    rx="3"
                    className="fill-green-500/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.9, 1.1, 1] }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <rect
                  x={i * 14}
                  y={6}
                  width="12"
                  height="14"
                  rx="2"
                  className={
                    isMatching
                      ? "fill-green-500/40 stroke-green-500 dark:fill-green-400/40 dark:stroke-green-400"
                      : isCurrent
                        ? "fill-rose-500/30 stroke-rose-500 dark:fill-rose-400/30 dark:stroke-rose-400"
                        : isPassed
                          ? "fill-current/5 stroke-current/15"
                          : "fill-current/10 stroke-current/30"
                  }
                  strokeWidth="1"
                />
                <text
                  x={i * 14 + 6}
                  y={16}
                  textAnchor="middle"
                  fontSize="7"
                  className={isPassed ? "fill-current/30" : "fill-current"}
                  fontWeight={isCurrent ? "bold" : "normal"}
                >
                  {val}
                </text>
              </motion.g>
            )
          })}
          {/* J pointer */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1, x: postJ * 14 + 6 }} transition={ease}>
            <text x={0} y={-2} textAnchor="middle" fontSize="5" className="fill-rose-600 dark:fill-rose-400">
              j
            </text>
            <path d="M0,0 L0,4" className="stroke-rose-500 dark:stroke-rose-400" strokeWidth="1.5" />
          </motion.g>

          {/* Match indicator */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: matchHighlight ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <text x={postJ * 14 + 6} y={30} textAnchor="middle" fontSize="5" className="fill-green-600 dark:fill-green-400">
              root.val == post[j]
            </text>
          </motion.g>
        </g>

        {/* Legend / Key insight */}
        <g transform="translate(4, 100)">
          <rect x="0" y="0" width="88" height="26" rx="3" className="fill-current/5 stroke-current/20" strokeWidth="0.5" />
          <text x="4" y="9" fontSize="5" className="fill-current/70">
            Key insight:
          </text>
          <text x="4" y="17" fontSize="4.5" className="fill-current/60">
            post[j] == root.val means
          </text>
          <text x="4" y="23" fontSize="4.5" className="fill-current/60">
            subtree is complete → j++
          </text>
        </g>
      </motion.svg>

      <p className="text-xs text-center text-current/80 h-8 max-w-[280px]">{label}</p>

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
