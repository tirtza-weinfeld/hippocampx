# Illustration Guide

Fix illustrations to actually teach concepts. Reference: `tangent-line.tsx`

## Teaching Structure (Most Important)

1. **Define WHAT it IS** — show the basic element, no extras yet
2. **Show the key property** — the defining characteristic
3. **Show variations** — positive/negative/zero cases, different positions
4. **Final insight** — zoom in, highlight the "aha" moment

Each step MUST add visual details. Never same visuals with different labels.

```tsx
// BAD — steps 1-2 look identical
{ showLine: true, label: "A line" },
{ showLine: true, label: "The line touches the curve" },  // no visual change!

// GOOD — each step adds something new
{ showPoint: true, showLine: false, showSlope: false, label: "Pick a point P" },
{ showPoint: true, showLine: true, showSlope: false, label: "Line touches at P" },
{ showPoint: true, showLine: true, showSlope: true, label: "Slope = rise ÷ run" },
```

Use **flags** to progressively reveal elements:

```tsx
const steps = [
  { x: 50, showLine: false, showSlope: false, zoom: 1, label: "Pick point P on curve" },
  { x: 50, showLine: true, showSlope: false, zoom: 1, label: "Line appears at P" },
  { x: 50, showLine: true, showSlope: true, zoom: 1, label: "Slope indicator added" },
  { x: 30, showLine: true, showSlope: true, zoom: 1, label: "Move P → line changes" },
  { x: 70, showLine: true, showSlope: false, zoom: 5, label: "Zoom: see key insight" },
]
```

## Step Controls

```tsx
import { IllustrationControls } from "./illustration-controls"

const [step, setStep] = useState(0)
const [playing, setPlaying] = useState(true)

useEffect(() => {
  if (!playing) return
  const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
  return () => clearInterval(id)
}, [playing])

const { x, label, showThing, zoom } = steps[step]

// At bottom of component:
<p className="text-xs text-center text-current/80 h-4">{label}</p>
<IllustrationControls
  step={step}
  totalSteps={steps.length}
  playing={playing}
  onStep={setStep}
  onPlayingChange={setPlaying}
/>
```

## Colors — Tailwind with Dark Mode

```tsx
// BAD
stroke="#ef4444"
fill="#3b82f6"

// GOOD
className="stroke-red-500 dark:stroke-red-400"
className="fill-blue-500 dark:fill-blue-400"
stroke="currentColor"  // neutral elements
fill="currentColor"    // neutral elements
```

Color palette:
- **Primary element** (tangent, main line): `red-500/400`
- **Point/dot**: `blue-500/400`
- **Secondary indicator**: `green-500/400`
- **Tertiary indicator**: `violet-500/400`
- **Highlight ring**: `sky-500/400`
- **Neutral** (axes, curve): `currentColor` with opacity

## Smooth Animations

```tsx
const ease = { type: "spring", stiffness: 80, damping: 20 } as const

// Use animate={} prop, never spread conflicting props
<motion.circle
  animate={{ cx: pointX, cy: pointY, opacity: show ? 1 : 0 }}
  transition={ease}
  r="4"
  className="fill-blue-500 dark:fill-blue-400"
/>
```

## Generate Curves from Math

```tsx
// BAD — hand-drawn bezier
<path d="M10,50 C20,30 40,70 50,50" />

// GOOD — generated from function
const f = (x: number) => 40 + 25 * Math.sin((x - 20) / 25)

const curvePath = (() => {
  const points: string[] = []
  for (let x = 15; x <= 125; x += 2) points.push(`${x},${f(x)}`)
  return `M${points.join(" L")}`
})()

<path d={curvePath} stroke="currentColor" strokeWidth="2" fill="none" />
```

## SVG Y-Axis is Inverted

In SVG, y increases downward. For intuitive display:

```tsx
// Negate values so "up" on screen = positive for users
const displaySlope = -mathSlope
const displayValue = -mathValue
```

## Arrows with Calculated Positions

```tsx
const angle = Math.atan(slope)
const cos = Math.cos(angle)
const sin = Math.sin(angle)
const size = 7

const tip = { x: endX, y: endY }
const back1 = {
  x: endX - size * cos + 3 * sin,
  y: endY - size * sin - 3 * cos,
}
const back2 = {
  x: endX - size * cos - 3 * sin,
  y: endY - size * sin + 3 * cos,
}

<motion.polygon
  animate={{
    points: `${tip.x},${tip.y} ${back1.x},${back1.y} ${back2.x},${back2.y}`,
    opacity: show ? 1 : 0,
  }}
  transition={ease}
  className="fill-red-500 dark:fill-red-400"
/>
```

## Zoom Effect

```tsx
// Add zoom to steps
{ x: 70, showThing: true, zoom: 5, label: "Zoomed in: see the detail" }

// Zoomable content group
<motion.g
  animate={{
    scale: zoom,
    x: (80 - pointX) * (zoom - 1),  // 80 = SVG center X
    y: (52 - pointY) * (zoom - 1),  // 52 = SVG center Y
  }}
  transition={ease}
>
  {/* All zoomable content here */}
</motion.g>

// Hide UI clutter when zoomed
opacity: zoom === 1 ? 1 : 0
```

## Component Structure

```tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { IllustrationControls } from "./illustration-controls"

// Math functions
const f = (x: number) => /* ... */

// Generate paths
const curvePath = /* ... */

// Steps array
const steps = [/* ... */]

// Animation config
const ease = { type: "spring", stiffness: 80, damping: 20 } as const

export const TermIllustration = () => {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const { x, label, showThing, zoom } = steps[step]
  // ... derived values

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        width="160"
        height="105"
        viewBox="0 0 160 105"
        overflow="hidden"
      >
        <motion.g animate={{ scale: zoom, /* ... */ }} transition={ease}>
          {/* Axes */}
          {/* Curve */}
          {/* Main element */}
          {/* Indicators */}
          {/* Point */}
          {/* Legend (hide when zoomed) */}
        </motion.g>
      </motion.svg>

      <p className="text-xs text-center text-current/80 h-4">{label}</p>

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
```
