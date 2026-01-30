# Flow Models Illustration Guide

Guidelines for creating interactive SVG illustrations for flow models concepts.

## Component Structure

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  IllustrationControls,
  type IllustrationSize,
  sizeClasses,
} from "./illustration-controls";

// Pre-compute data outside component (use rounded values for hydration safety)
const computePosition = (x: number, y: number) => ({
  x: Math.round(x * 100) / 100,
  y: Math.round(y * 100) / 100,
});

const initialData = [
  /* pre-computed t=0 positions */
];

const steps = [
  { label: "Step explanation" },
  { showFeature: true, label: "Feature revealed" },
  // Only specify what changes from defaults
];

const ease = { type: "spring", stiffness: 80, damping: 20 } as const;

export function ConceptIllustration({
  size = "md",
  playing: initialPlaying = true,
}: {
  size?: IllustrationSize;
  playing?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(initialPlaying);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1400);
    return () => clearInterval(id);
  }, [playing]);

  const { showFeature = false, label } = steps[step]; // Defaults in destructuring

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.svg
        viewBox="0 0 160 105"
        className={sizeClasses[size]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Always pair initial + animate */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: showFeature ? 1 : 0 }}
          transition={ease}
        >
          {/* content */}
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
  );
}
```

## Visual Language

| Concept          | Representation                                    |
| ---------------- | ------------------------------------------------- |
| Scalars          | Plain text labels                                 |
| Vectors          | Lines with circle endpoints (arrowheads via dots) |
| Vector fields    | Grid of arrows, highlight one to show u(x,t)      |
| Trajectories     | Smooth curves via SVG path                        |
| Noise/stochastic | Dashed lines, jittery paths, or cloud fills       |
| Distributions    | Shaded regions or bell-curve shapes               |
| Time/steps       | Horizontal progression or numbered points         |
| Neural networks  | Box labeled "θ" with input/output ports           |
| Functions        | Rounded rectangles with formula inside            |

## Color Scheme (Tailwind)

| Role                    | Light / Dark                              |
| ----------------------- | ----------------------------------------- |
| Primary curve           | `stroke-blue-500` / `stroke-blue-400`     |
| Secondary/comparison    | `stroke-green-500` / `stroke-green-400`   |
| Highlight/current       | `stroke-red-500` / `stroke-red-400`       |
| Formulas/labels         | `fill-violet-500` / `fill-violet-400`     |
| Auxiliary (h, brackets) | `stroke-orange-500` / `stroke-orange-400` |
| Background accents      | `fill-sky-500/20` / `fill-sky-400/20`     |

Always use both light and dark variants: `className="stroke-blue-500 dark:stroke-blue-400"`

## Step Design (Progressive Disclosure)

Each `steps` array should follow this pattern:

1. **Intuition frame** — What is this concept? Show the core visual.
2. **Build-up frames** — Add elements one by one, highlight key parts.
3. **Formula frame** — Show equation with symbol-to-visual mapping.
4. **Connection frame** — How this leads to the next concept.

For algorithms (Euler, Euler-Maruyama, etc.):

- Show state before update
- Animate the update with arrow
- Show state after update with values
- Show effect of step size h

## Math Rendering

Use `MathRenderer` for pretty math in labels:

```tsx
import { MathRenderer } from "@/components/mdx/parse/renderers/math-renderer";

// In the label area (outside SVG)
<p className="text-xs text-center text-current/80 h-4">
  Reverse SDE: <MathRenderer latex="dX = [u + \frac{\sigma^2}{2}\nabla \log p]dt" />
</p>
```

For simple subscripts/superscripts, Unicode is fine: `X₀`, `Xₜ₊ₕ`, `σ²`

For fractions, integrals, or complex notation — use KaTeX via `MathRenderer`.

## Sizing & Layout

- **SVG**: `viewBox="0 0 160 105"` with `className={sizeClasses[size]}`
- **Font sizes**: Labels = 7-8px, formulas = 8-9px, explanations = 8px
- **Circle radii**: Points = 4px (5px when highlighted), grid dots = 1.5px
- **Stroke widths**: Primary = 2, secondary = 1.5, auxiliary = 1
- **Legend**: Top-left corner, font size 6-7px

## Animation

- Use spring easing: `{ type: "spring", stiffness: 80, damping: 20 }`
- Interval: 1400ms between auto-play steps
- Animate only what changes: use `motion.g`, `motion.path`, `motion.circle`
- Use `strokeDasharray` + `strokeDashoffset` for path drawing effects
- Use `opacity` transitions for showing/hiding elements

### CRITICAL: Always pair `initial` + `animate`

Every `animate` prop MUST have a matching `initial`:

```tsx
// ✅ Correct
<motion.g initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} />
<motion.path initial={{ strokeDashoffset: 400 }} animate={{ strokeDashoffset: show ? 0 : 400 }} />
<motion.circle initial={{ cx: initialX, cy: initialY }} animate={{ cx, cy }} />

// ❌ Wrong — causes "animating from undefined" warnings
<motion.g animate={{ opacity: show ? 1 : 0 }} />
```

## Hydration Safety

Computed positions can differ between server and client due to float precision. This causes hydration mismatches.

### Round all computed values

```tsx
// ❌ Wrong — may produce 29.999999999999993 vs 30
const x = cx + Math.cos(angle) * r;

// ✅ Correct — stable across server/client
const x = Math.round((cx + Math.cos(angle) * r) * 100) / 100;
```

### Pre-compute initial positions outside component

```tsx
// Compute once at module level (t=0 state)
const initialPositions = gridPoints.map((p) => computePosition(p.x, p.y, 0));

// Use for initial prop
<motion.circle
  initial={{ cx: initialPositions[i].x, cy: initialPositions[i].y }}
  animate={{ cx: currentPositions[i].x, cy: currentPositions[i].y }}
/>
```

## Coverage Checklist (per concept)

Before marking an illustration complete, verify:

- [ ] Intuition is clear without reading text
- [ ] All symbols in formulas have visual counterparts
- [ ] At least one concrete example with values shown
- [ ] Dark mode tested
- [ ] Auto-play loops cleanly
- [ ] Step labels are concise (< 40 chars)
- [ ] No decorative elements — everything teaches
- [ ] Every `animate` has matching `initial`
- [ ] No hydration warnings in browser console
- [ ] Computed floats are rounded (`Math.round(x * 100) / 100`)

## Flow Models Specific

| Concept               | Key visual elements                    |
| --------------------- | -------------------------------------- |
| Vector field u(x,t)   | Grid of arrows, highlight one point    |
| ODE flow              | Smooth trajectory following arrows     |
| SDE / Brownian        | Jagged/noisy trajectory, σ√dt steps    |
| Probability path p_t  | Density cloud evolving over time       |
| Score function ∇log p | Arrows pointing toward high density    |
| Euler method          | Straight line segments, show error gap |
| Euler-Maruyama        | Euler + noise term visualized          |
| Conditional flow      | Two paths (conditional/unconditional)  |
| CFG                   | Weighted combination of two vectors    |

## Don'ts

- Don't use `<marker>` for arrowheads — use circles at endpoints
- Don't animate `d` attribute on complex paths — fade/draw instead
- Don't put long text in SVG — use the label below
- Don't use opacity below 0.2 for teaching elements
- Don't exceed 7 steps (5-6 is ideal)
- Don't hardcode pixel positions — compute from data
- Don't use `animate` without `initial` — causes "undefined" warnings
- Don't use raw floats in computed positions — round to avoid hydration mismatch
- Don't use `export const X = () =>` — use `export function X()`
- Don't repeat the same value in every step — use defaults in destructuring
