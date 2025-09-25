"use client"

import { motion } from "motion/react"
import type React from "react"

export const SlopeIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Grid */}
    <defs>
      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </pattern>
    </defs>
    <rect width="120" height="80" fill="url(#grid)" />

    {/* Axes */}
    <motion.line
      x1="10"
      y1="70"
      x2="110"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="20"
      y1="10"
      x2="20"
      y2="75"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Line with positive slope */}
    <motion.line
      x1="30"
      y1="60"
      x2="90"
      y2="20"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />

    {/* Rise and Run indicators */}
    <motion.line
      x1="30"
      y1="60"
      x2="30"
      y2="35"
      stroke="red"
      strokeWidth="2"
      strokeDasharray="2,2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    />
    <motion.line
      x1="30"
      y1="35"
      x2="55"
      y2="35"
      stroke="blue"
      strokeWidth="2"
      strokeDasharray="2,2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    />

    {/* Labels */}
    <motion.text
      x="25"
      y="48"
      fontSize="8"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      Rise
    </motion.text>
    <motion.text
      x="38"
      y="32"
      fontSize="8"
      fill="blue"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.7 }}
    >
      Run
    </motion.text>

    {/* Points */}
    <motion.circle
      cx="30"
      cy="60"
      r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.8 }}
    />
    <motion.circle
      cx="55"
      cy="35"
      r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2 }}
    />
  </motion.svg>
)

export const FunctionIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Function machine box */}
    <motion.rect
      x="40"
      y="25"
      width="40"
      height="30"
      rx="5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    />

    {/* Input arrow */}
    <motion.path
      d="M10 40 L35 40"
      stroke="currentColor"
      strokeWidth="2"
      markerEnd="url(#arrowhead)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    />

    {/* Output arrow */}
    <motion.path
      d="M85 40 L110 40"
      stroke="currentColor"
      strokeWidth="2"
      markerEnd="url(#arrowhead)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    />

    {/* Arrow marker */}
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
      </marker>
    </defs>

    {/* Function label */}
    <motion.text
      x="60"
      y="42"
      fontSize="10"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      f(x)
    </motion.text>

    {/* Input/Output labels */}
    <motion.text
      x="22"
      y="35"
      fontSize="8"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
    >
      x
    </motion.text>
    <motion.text
      x="95"
      y="35"
      fontSize="8"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4 }}
    >
      y
    </motion.text>

    {/* Example values */}
    <motion.circle
      cx="22"
      cy="40"
      r="8"
      fill="none"
      stroke="green"
      strokeWidth="1"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5 }}
    />
    <motion.text
      x="22"
      y="44"
      fontSize="8"
      textAnchor="middle"
      fill="green"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.7 }}
    >
      3
    </motion.text>

    <motion.circle
      cx="98"
      cy="40"
      r="8"
      fill="none"
      stroke="orange"
      strokeWidth="1"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.8 }}
    />
    <motion.text
      x="98"
      y="44"
      fontSize="8"
      textAnchor="middle"
      fill="orange"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      7
    </motion.text>
  </motion.svg>
)

export const LimitIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Axes */}
    <motion.line
      x1="10"
      y1="70"
      x2="110"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="20"
      y1="10"
      x2="20"
      y2="75"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Function curve with hole */}
    <motion.path
      d="M30 60 Q50 30 70 50"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />
    <motion.path
      d="M70 50 Q90 70 100 40"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
    />

    {/* Hole at x = 70 */}
    <motion.circle
      cx="70"
      cy="50"
      r="3"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2 }}
    />

    {/* Limit point */}
    <motion.circle
      cx="70"
      cy="45"
      r="2"
      fill="red"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5 }}
    />

    {/* Approaching arrows */}
    <motion.path
      d="M55 35 L65 42"
      stroke="blue"
      strokeWidth="2"
      markerEnd="url(#arrowhead-blue)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.8, duration: 0.5 }}
    />
    <motion.path
      d="M85 55 L75 48"
      stroke="blue"
      strokeWidth="2"
      markerEnd="url(#arrowhead-blue)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    />

    <defs>
      <marker id="arrowhead-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="blue" />
      </marker>
    </defs>

    {/* Labels */}
    <motion.text
      x="70"
      y="35"
      fontSize="8"
      textAnchor="middle"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
    >
      L
    </motion.text>
    <motion.text
      x="70"
      y="75"
      fontSize="8"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4 }}
    >
      a
    </motion.text>
  </motion.svg>
)

export const DerivativeIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Axes */}
    <motion.line
      x1="10"
      y1="70"
      x2="110"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="20"
      y1="10"
      x2="20"
      y2="75"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Parabola */}
    <motion.path
      d="M30 65 Q60 20 90 65"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    />

    {/* Tangent line */}
    <motion.line
      x1="40"
      y1="60"
      x2="80"
      y2="30"
      stroke="red"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
    />

    {/* Point of tangency */}
    <motion.circle
      cx="60"
      cy="45"
      r="3"
      fill="red"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.8 }}
    />

    {/* Slope triangle */}
    <motion.path
      d="M60 45 L70 45 L70 40 Z"
      fill="blue"
      opacity="0.3"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    />

    {/* Labels */}
    <motion.text
      x="62"
      y="42"
      fontSize="8"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
    >
      f&apos;(x)
    </motion.text>
    <motion.text
      x="65"
      y="50"
      fontSize="6"
      fill="blue"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4 }}
    >
      slope
    </motion.text>
  </motion.svg>
)

export const IntegralIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Axes */}
    <motion.line
      x1="10"
      y1="70"
      x2="110"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="20"
      y1="10"
      x2="20"
      y2="75"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Function curve */}
    <motion.path
      d="M30 60 Q60 30 90 50"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />

    {/* Area rectangles */}
    {[35, 45, 55, 65, 75].map((x, i) => (
      <motion.rect
        key={i}
        x={x}
        y={70 - (40 - Math.abs(x - 60) * 0.5)}
        width="8"
        height={40 - Math.abs(x - 60) * 0.5}
        fill="blue"
        opacity="0.4"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
        style={{ transformOrigin: "bottom" }}
      />
    ))}

    {/* Area under curve */}
    <motion.path
      d="M30 60 Q60 30 90 50 L90 70 L30 70 Z"
      fill="green"
      opacity="0.2"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
      style={{ transformOrigin: "bottom" }}
    />

    {/* Integral symbol */}
    <motion.text
      x="95"
      y="40"
      fontSize="16"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
    >
      ∫
    </motion.text>

    {/* Labels */}
    <motion.text
      x="60"
      y="75"
      fontSize="8"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.7 }}
    >
      Area
    </motion.text>
  </motion.svg>
)

export const RiseIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Vertical measurement */}
    <motion.line
      x1="40"
      y1="20"
      x2="40"
      y2="60"
      stroke="red"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />

    {/* Arrow heads */}
    <motion.polygon
      points="35,25 40,15 45,25"
      fill="red"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1 }}
    />
    <motion.polygon
      points="35,55 40,65 45,55"
      fill="red"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2 }}
    />

    {/* Points */}
    <motion.circle
      cx="40"
      cy="20"
      r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.4 }}
    />
    <motion.circle
      cx="40"
      cy="60"
      r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.6 }}
    />

    {/* Labels */}
    <motion.text
      x="45"
      y="25"
      fontSize="8"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8 }}
    >
      y₂
    </motion.text>
    <motion.text
      x="45"
      y="65"
      fontSize="8"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      y₁
    </motion.text>
    <motion.text
      x="50"
      y="42"
      fontSize="10"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
    >
      Rise = Δy
    </motion.text>

    {/* Coordinate system hint */}
    <motion.line
      x1="20"
      y1="70"
      x2="80"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2 }}
    />
    <motion.line
      x1="25"
      y1="15"
      x2="25"
      y2="75"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3 }}
    />
  </motion.svg>
)

export const RunIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Horizontal measurement */}
    <motion.line
      x1="30"
      y1="50"
      x2="80"
      y2="50"
      stroke="blue"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />

    {/* Arrow heads */}
    <motion.polygon
      points="35,45 25,50 35,55"
      fill="blue"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1 }}
    />
    <motion.polygon
      points="75,45 85,50 75,55"
      fill="blue"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2 }}
    />

    {/* Points */}
    <motion.circle
      cx="30"
      cy="50"
      r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.4 }}
    />
    <motion.circle
      cx="80"
      cy="50"
      r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.6 }}
    />

    {/* Labels */}
    <motion.text
      x="25"
      y="45"
      fontSize="8"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8 }}
    >
      x₁
    </motion.text>
    <motion.text
      x="75"
      y="45"
      fontSize="8"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      x₂
    </motion.text>
    <motion.text
      x="50"
      y="42"
      fontSize="10"
      fill="blue"
      textAnchor="middle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
    >
      Run = Δx
    </motion.text>

    {/* Coordinate system hint */}
    <motion.line
      x1="20"
      y1="70"
      x2="90"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2 }}
    />
    <motion.line
      x1="25"
      y1="15"
      x2="25"
      y2="75"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3 }}
    />
  </motion.svg>
)

// NEW ILLUSTRATIONS FOR ALL REMAINING DICTIONARY ENTRIES

export const CoordinateIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Grid */}
    <defs>
      <pattern id="coord-grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
      </pattern>
    </defs>
    <rect width="120" height="80" fill="url(#coord-grid)" />

    {/* Axes */}
    <motion.line
      x1="10"
      y1="40"
      x2="110"
      y2="40"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="60"
      y1="10"
      x2="60"
      y2="70"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Origin */}
    <motion.circle
      cx="60"
      cy="40"
      r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.8 }}
    />
    <motion.text
      x="65"
      y="45"
      fontSize="8"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      (0,0)
    </motion.text>

    {/* Example point */}
    <motion.circle
      cx="80"
      cy="25"
      r="3"
      fill="red"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2 }}
    />

    {/* Coordinate lines */}
    <motion.line
      x1="60"
      y1="25"
      x2="80"
      y2="25"
      stroke="red"
      strokeWidth="1"
      strokeDasharray="2,2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.4, duration: 0.5 }}
    />
    <motion.line
      x1="80"
      y1="40"
      x2="80"
      y2="25"
      stroke="red"
      strokeWidth="1"
      strokeDasharray="2,2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.6, duration: 0.5 }}
    />

    {/* Labels */}
    <motion.text
      x="85"
      y="20"
      fontSize="10"
      fill="red"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8 }}
    >
      (3, 2)
    </motion.text>
    <motion.text
      x="70"
      y="30"
      fontSize="8"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      x = 3
    </motion.text>
    <motion.text
      x="85"
      y="35"
      fontSize="8"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
    >
      y = 2
    </motion.text>

    {/* Axis labels */}
    <motion.text
      x="105"
      y="45"
      fontSize="8"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4 }}
    >
      x
    </motion.text>
    <motion.text
      x="65"
      y="15"
      fontSize="8"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.6 }}
    >
      y
    </motion.text>
  </motion.svg>
)

export const GraphIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Axes */}
    <motion.line
      x1="15"
      y1="65"
      x2="105"
      y2="65"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="20"
      y1="15"
      x2="20"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Multiple function curves */}
    <motion.path
      d="M25 60 Q40 30 55 45 Q70 60 85 35 Q95 20 100 25"
      stroke="blue"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 1.2 }}
    />

    <motion.path
      d="M25 55 L100 25"
      stroke="green"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    />

    <motion.path
      d="M25 50 Q60 20 100 50"
      stroke="orange"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 2, duration: 1 }}
    />

    {/* Data points */}
    {[
      { x: 30, y: 50, delay: 2.5 },
      { x: 45, y: 35, delay: 2.7 },
      { x: 60, y: 45, delay: 2.9 },
      { x: 75, y: 30, delay: 3.1 },
      { x: 90, y: 40, delay: 3.3 },
    ].map((point, i) => (
      <motion.circle
        key={i}
        cx={point.x}
        cy={point.y}
        r="2"
        fill="red"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: point.delay }}
      />
    ))}

    {/* Labels */}
    <motion.text
      x="60"
      y="12"
      fontSize="10"
      textAnchor="middle"
      fill="currentColor"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.5 }}
    >
      Visual Data
    </motion.text>
  </motion.svg>
)

export const DomainIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Function machine */}
    <motion.rect
      x="45"
      y="30"
      width="30"
      height="20"
      rx="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />
    <motion.text
      x="60"
      y="42"
      fontSize="8"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      f(x)
    </motion.text>

    {/* Valid inputs (domain) */}
    <motion.ellipse
      cx="25"
      cy="40"
      rx="15"
      ry="25"
      fill="green"
      opacity="0.2"
      stroke="green"
      strokeWidth="2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    />

    {/* Valid input values */}
    {[-2, -1, 0, 1, 2].map((_, i) => (
      <motion.circle
        key={i}
        cx="25"
        cy={25 + i * 10}
        r="2"
        fill="green"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5 + i * 0.1 }}
      />
    ))}

    {/* Invalid input (hole in domain) */}
    <motion.circle
      cx="25"
      cy="35"
      r="3"
      fill="white"
      stroke="red"
      strokeWidth="2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2.2 }}
    />
    <motion.text
      x="30"
      y="38"
      fontSize="6"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4 }}
    >
      ✗
    </motion.text>

    {/* Arrow from domain to function */}
    <motion.path
      d="M40 40 L45 40"
      stroke="currentColor"
      strokeWidth="2"
      markerEnd="url(#domain-arrow)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 2.6, duration: 0.5 }}
    />

    <defs>
      <marker id="domain-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
      </marker>
    </defs>

    {/* Labels */}
    <motion.text
      x="25"
      y="15"
      fontSize="10"
      textAnchor="middle"
      fill="green"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
    >
      Domain
    </motion.text>
    <motion.text
      x="25"
      y="70"
      fontSize="8"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2 }}
    >
      Valid Inputs
    </motion.text>
  </motion.svg>
)

export const RangeIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Function machine */}
    <motion.rect
      x="45"
      y="30"
      width="30"
      height="20"
      rx="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />
    <motion.text
      x="60"
      y="42"
      fontSize="8"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      f(x)
    </motion.text>

    {/* Arrow from function to range */}
    <motion.path
      d="M75 40 L80 40"
      stroke="currentColor"
      strokeWidth="2"
      markerEnd="url(#range-arrow)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    />

    {/* Range (possible outputs) */}
    <motion.ellipse
      cx="95"
      cy="40"
      rx="15"
      ry="20"
      fill="orange"
      opacity="0.2"
      stroke="orange"
      strokeWidth="2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    />

    {/* Output values */}
    {[0, 1, 4, 9, 16].map(( _, i) => (
      <motion.circle
        key={i}
        cx="95"
        cy={25 + i * 8}
        r="2"
        fill="orange"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.8 + i * 0.1 }}
      />
    ))}

    {/* Gap in range (impossible output) */}
    <motion.rect
      x="88"
      y="48"
      width="14"
      height="4"
      fill="white"
      stroke="red"
      strokeWidth="1"
      strokeDasharray="2,2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2.5 }}
    />
    <motion.text
      x="95"
      y="52"
      fontSize="6"
      textAnchor="middle"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.7 }}
    >
      Gap
    </motion.text>

    <defs>
      <marker id="range-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
      </marker>
    </defs>

    {/* Labels */}
    <motion.text
      x="95"
      y="15"
      fontSize="10"
      textAnchor="middle"
      fill="orange"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
    >
      Range
    </motion.text>
    <motion.text
      x="95"
      y="70"
      fontSize="8"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2 }}
    >
      Possible Outputs
    </motion.text>
  </motion.svg>
)

export const LinearFunctionIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Grid */}
    <defs>
      <pattern id="linear-grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
      </pattern>
    </defs>
    <rect width="120" height="80" fill="url(#linear-grid)" />

    {/* Axes */}
    <motion.line
      x1="10"
      y1="60"
      x2="110"
      y2="60"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="20"
      y1="10"
      x2="20"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Linear function line */}
    <motion.line
      x1="25"
      y1="55"
      x2="95"
      y2="25"
      stroke="blue"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 1 }}
    />

    {/* Y-intercept point */}
    <motion.circle
      cx="20"
      cy="50"
      r="3"
      fill="red"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5 }}
    />

    {/* Slope triangle */}
    <motion.path
      d="M40 45 L60 45 L60 35 Z"
      fill="green"
      opacity="0.3"
      stroke="green"
      strokeWidth="1"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    />

    {/* Labels */}
    <motion.text
      x="25"
      y="50"
      fontSize="8"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8 }}
    >
      b
    </motion.text>
    <motion.text
      x="50"
      y="42"
      fontSize="8"
      fill="green"
      textAnchor="middle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
    >
      slope = m
    </motion.text>
    <motion.text
      x="60"
      y="15"
      fontSize="10"
      fill="blue"
      textAnchor="middle"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
    >
      y = mx + b
    </motion.text>
  </motion.svg>
)

export const QuadraticFunctionIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Axes */}
    <motion.line
      x1="10"
      y1="60"
      x2="110"
      y2="60"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="60"
      y1="10"
      x2="60"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Parabola */}
    <motion.path
      d="M20 55 Q60 15 100 55"
      stroke="purple"
      strokeWidth="3"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 1.2 }}
    />

    {/* Vertex point */}
    <motion.circle
      cx="60"
      cy="15"
      r="3"
      fill="red"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.8 }}
    />

    {/* Vertex label */}
    <motion.text
      x="65"
      y="12"
      fontSize="8"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      Vertex
    </motion.text>

    {/* Axis of symmetry */}
    <motion.line
      x1="60"
      y1="15"
      x2="60"
      y2="55"
      stroke="orange"
      strokeWidth="1"
      strokeDasharray="3,3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 2.2, duration: 0.8 }}
    />

    {/* Formula */}
    <motion.text
      x="60"
      y="75"
      fontSize="10"
      fill="purple"
      textAnchor="middle"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
    >
      y = ax² + bx + c
    </motion.text>

    {/* Direction indicators */}
    <motion.path
      d="M30 45 L35 40 L40 45"
      stroke="green"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 3, duration: 0.5 }}
    />
    <motion.path
      d="M80 45 L85 40 L90 45"
      stroke="green"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 3.2, duration: 0.5 }}
    />
  </motion.svg>
)

export const ContinuityIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Axes */}
    <motion.line
      x1="10"
      y1="60"
      x2="110"
      y2="60"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="20"
      y1="10"
      x2="20"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Continuous curve */}
    <motion.path
      d="M25 50 Q40 30 55 40 Q70 50 85 35 Q95 25 105 30"
      stroke="green"
      strokeWidth="3"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 1.5 }}
    />

    {/* Pencil drawing the curve */}
          <motion.circle
      r="2"
      fill="orange"
      initial={{ scale: 0, x: 25, y: 50 }}
      animate={{ 
        scale: 1,
        x: [25, 40, 55, 70, 85, 105],
        y: [50, 30, 40, 50, 35, 30]
      }}
      transition={{ 
        delay: 0.8,
        duration: 1.5,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }}
    />

    {/* Pencil trail effect */}
    <motion.path
      d="M22 52 L27 47"
      stroke="orange"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 0.2 }}
    />

    {/* "No lifting" indicator */}
    <motion.text
      x="60"
      y="15"
      fontSize="10"
      fill="green"
      textAnchor="middle"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
    >
      No Breaks!
    </motion.text>

    {/* Checkmark */}
    <motion.path
      d="M50 20 L55 25 L65 15"
      stroke="green"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 3, duration: 0.5 }}
    />
  </motion.svg>
)

export const TangentLineIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Axes */}
    <motion.line
      x1="10"
      y1="65"
      x2="110"
      y2="65"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="15"
      y1="10"
      x2="15"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Curve */}
    <motion.path
      d="M20 60 Q60 20 100 55"
      stroke="blue"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 1 }}
    />

    {/* Point of tangency */}
    <motion.circle
      cx="60"
      cy="35"
      r="3"
      fill="red"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5 }}
    />

    {/* Tangent line */}
    <motion.line
      x1="35"
      y1="45"
      x2="85"
      y2="25"
      stroke="red"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
    />

    {/* Touch indicator */}
    <motion.circle
      cx="60"
      cy="35"
      r="8"
      fill="none"
      stroke="orange"
      strokeWidth="1"
      strokeDasharray="2,2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2.5, duration: 0.5 }}
    />

    {/* Labels */}
    <motion.text
      x="65"
      y="30"
      fontSize="8"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
    >
      Tangent
    </motion.text>
    <motion.text
      x="40"
      y="15"
      fontSize="8"
      fill="blue"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2 }}
    >
      Curve
    </motion.text>
    <motion.text
      x="60"
      y="75"
      fontSize="8"
      textAnchor="middle"
      fill="orange"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.4 }}
    >
      Just Touches
    </motion.text>
  </motion.svg>
)

export const RateOfChangeIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Speedometer background */}
    <motion.circle
      cx="60"
      cy="50"
      r="25"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />

    {/* Speed marks */}
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const angle = (i * Math.PI) / 5 - Math.PI / 2
      const x1 = 60 + 20 * Math.cos(angle)
      const y1 = 50 + 20 * Math.sin(angle)
      const x2 = 60 + 25 * Math.cos(angle)
      const y2 = 50 + 25 * Math.sin(angle)
      return (
        <motion.line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
        />
      )
    })}

    {/* Speedometer needle */}
    <motion.line
      x1="60"
      y1="50"
      x2="75"
      y2="35"
      stroke="red"
      strokeWidth="3"
      initial={{ rotate: -90 }}
      animate={{ rotate: 45 }}
      transition={{ delay: 2, duration: 1, type: "spring" }}
      style={{ transformOrigin: "60px 50px" }}
    />

    {/* Center dot */}
    <motion.circle
      cx="60"
      cy="50"
      r="3"
      fill="red"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2.5 }}
    />

    {/* Moving object */}
    <motion.circle
      cx="20"
      cy="20"
      r="3"
      fill="blue"
      initial={{ x: 0 }}
      animate={{ x: 60 }}
      transition={{ delay: 1, duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
    />

    {/* Speed trail */}
    <motion.path
      d="M15 20 L25 20"
      stroke="blue"
      strokeWidth="1"
      opacity="0.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.5, duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
    />

    {/* Labels */}
    <motion.text
      x="60"
      y="15"
      fontSize="10"
      textAnchor="middle"
      fill="currentColor"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
    >
      Rate of Change
    </motion.text>
    <motion.text
      x="60"
      y="75"
      fontSize="8"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2 }}
    >
      How Fast?
    </motion.text>
  </motion.svg>
)

export const PowerRuleIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Power rule transformation */}
    <motion.text
      x="20"
      y="25"
      fontSize="14"
      fill="blue"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      x³
    </motion.text>

    {/* Arrow */}
    <motion.path
      d="M45 20 L65 20"
      stroke="currentColor"
      strokeWidth="2"
      markerEnd="url(#power-arrow)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    />

    {/* Result */}
    <motion.text
      x="80"
      y="25"
      fontSize="14"
      fill="green"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      3x²
    </motion.text>

    {/* Step-by-step breakdown */}
    <motion.text
      x="60"
      y="45"
      fontSize="10"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      Step 1: Bring down the power
    </motion.text>

    <motion.text
      x="30"
      y="55"
      fontSize="12"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
    >
      3
    </motion.text>

    <motion.text
      x="60"
      y="65"
      fontSize="10"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
    >
      Step 2: Reduce power by 1
    </motion.text>

    <motion.text
      x="90"
      y="55"
      fontSize="12"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.5 }}
    >
      x²
    </motion.text>

    <defs>
      <marker id="power-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
      </marker>
    </defs>
  </motion.svg>
)

export const ChainRuleIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Chain links */}
    <motion.ellipse
      cx="30"
      cy="40"
      rx="12"
      ry="8"
      fill="none"
      stroke="blue"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />

    <motion.ellipse
      cx="50"
      cy="40"
      rx="12"
      ry="8"
      fill="none"
      stroke="green"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
    />

    <motion.ellipse
      cx="70"
      cy="40"
      rx="12"
      ry="8"
      fill="none"
      stroke="orange"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    />

    {/* Function labels */}
    <motion.text
      x="30"
      y="25"
      fontSize="8"
      textAnchor="middle"
      fill="blue"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      f(g(x))
    </motion.text>

    <motion.text
      x="50"
      y="25"
      fontSize="8"
      textAnchor="middle"
      fill="green"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
    >
      g(x)
    </motion.text>

    <motion.text
      x="70"
      y="25"
      fontSize="8"
      textAnchor="middle"
      fill="orange"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4 }}
    >
      x
    </motion.text>

    {/* Chain rule formula */}
    <motion.text
      x="60"
      y="60"
      fontSize="10"
      textAnchor="middle"
      fill="currentColor"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
    >
      f&apos;(g(x)) × g&apos;(x)
    </motion.text>

    {/* Multiplication symbol */}
    <motion.text
      x="60"
      y="50"
      fontSize="12"
      textAnchor="middle"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.5 }}
    >
      ×
    </motion.text>
  </motion.svg>
)

export const AntiderivativeIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Reverse arrow cycle */}
    <motion.circle
      cx="60"
      cy="40"
      r="25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="3,3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    />

    {/* Function f(x) */}
    <motion.text
      x="60"
      y="20"
      fontSize="12"
      textAnchor="middle"
      fill="blue"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      f(x)
    </motion.text>

    {/* Antiderivative F(x) */}
    <motion.text
      x="60"
      y="65"
      fontSize="12"
      textAnchor="middle"
      fill="green"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      F(x)
    </motion.text>

    {/* Derivative arrow down */}
    <motion.path
      d="M70 25 Q80 40 70 55"
      stroke="red"
      strokeWidth="2"
      fill="none"
      markerEnd="url(#anti-arrow-down)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
    />

    {/* Antiderivative arrow up */}
    <motion.path
      d="M50 55 Q40 40 50 25"
      stroke="green"
      strokeWidth="2"
      fill="none"
      markerEnd="url(#anti-arrow-up)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 2.5, duration: 0.8 }}
    />

    {/* Labels */}
    <motion.text
      x="85"
      y="35"
      fontSize="8"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
    >
      d/dx
    </motion.text>

    <motion.text
      x="35"
      y="35"
      fontSize="8"
      fill="green"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2 }}
    >
      ∫ dx
    </motion.text>

    <defs>
      <marker id="anti-arrow-down" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="red" />
      </marker>
      <marker id="anti-arrow-up" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="green" />
      </marker>
    </defs>
  </motion.svg>
)

export const FundamentalTheoremIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Bridge structure */}
    <motion.path
      d="M20 50 Q60 20 100 50"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 1.2 }}
    />

    {/* Bridge supports */}
    <motion.line
      x1="35"
      y1="42"
      x2="35"
      y2="60"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    />
    <motion.line
      x1="60"
      y1="35"
      x2="60"
      y2="60"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.4, duration: 0.5 }}
    />
    <motion.line
      x1="85"
      y1="42"
      x2="85"
      y2="60"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.6, duration: 0.5 }}
    />

    {/* Derivatives side */}
    <motion.text
      x="25"
      y="15"
      fontSize="10"
      fill="blue"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      Derivatives
    </motion.text>

    {/* Integrals side */}
    <motion.text
      x="85"
      y="15"
      fontSize="10"
      fill="green"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
    >
      Integrals
    </motion.text>

    {/* Bridge label */}
    <motion.text
      x="60"
      y="30"
      fontSize="8"
      textAnchor="middle"
      fill="red"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
    >
      FTC
    </motion.text>

    {/* Formula */}
    <motion.text
      x="60"
      y="75"
      fontSize="8"
      textAnchor="middle"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
    >
      ∫ₐᵇ f(x)dx = F(b) - F(a)
    </motion.text>
  </motion.svg>
)

export const OptimizationIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    className="mx-auto my-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* Axes */}
    <motion.line
      x1="15"
      y1="65"
      x2="105"
      y2="65"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
    <motion.line
      x1="20"
      y1="15"
      x2="20"
      y2="70"
      stroke="currentColor"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    />

    {/* Function curve with maximum */}
    <motion.path
      d="M25 55 Q40 25 60 30 Q80 35 95 60"
      stroke="blue"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.8, duration: 1.2 }}
    />

    {/* Maximum point */}
    <motion.circle
      cx="60"
      cy="30"
      r="4"
      fill="red"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.8 }}
    />

    {/* Tangent line at maximum (horizontal) */}
    <motion.line
      x1="45"
      y1="30"
      x2="75"
      y2="30"
      stroke="red"
      strokeWidth="1"
      strokeDasharray="2,2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 2.2, duration: 0.8 }}
    />

    {/* Target/bullseye around maximum */}
    <motion.circle
      cx="60"
      cy="30"
      r="8"
      fill="none"
      stroke="orange"
      strokeWidth="1"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2.8, duration: 0.5 }}
    />
    <motion.circle
      cx="60"
      cy="30"
      r="12"
      fill="none"
      stroke="orange"
      strokeWidth="1"
      opacity="0.5"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 3, duration: 0.5 }}
    />

    {/* Labels */}
    <motion.text
      x="65"
      y="25"
      fontSize="8"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2 }}
    >
      Maximum
    </motion.text>

    <motion.text
      x="60"
      y="45"
      fontSize="8"
      textAnchor="middle"
      fill="red"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.4 }}
    >
      f&apos;(x) = 0
    </motion.text>

    <motion.text
      x="60"
      y="12"
      fontSize="10"
      textAnchor="middle"
      fill="currentColor"
      fontWeight="bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.6 }}
    >
      Find the Best!
    </motion.text>
  </motion.svg>
)

// Map terms to their SVG illustrations
export const termIllustrations: Record<string, React.ComponentType> = {
  Slope: SlopeIllustration,
  Rise: RiseIllustration,
  Run: RunIllustration,
  Function: FunctionIllustration,
  Coordinate: CoordinateIllustration,
  Graph: GraphIllustration,
  Domain: DomainIllustration,
  Range: RangeIllustration,
  "Linear Function": LinearFunctionIllustration,
  "Quadratic Function": QuadraticFunctionIllustration,
  Limit: LimitIllustration,
  Continuity: ContinuityIllustration,
  Derivative: DerivativeIllustration,
  "Tangent Line": TangentLineIllustration,
  "Rate of Change": RateOfChangeIllustration,
  "Power Rule": PowerRuleIllustration,
  "Chain Rule": ChainRuleIllustration,
  Integral: IntegralIllustration,
  Antiderivative: AntiderivativeIllustration,
  "Fundamental Theorem": FundamentalTheoremIllustration,
  Optimization: OptimizationIllustration,
}
