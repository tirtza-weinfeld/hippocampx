---
paths: "**/*.tsx"
---
# Motion for React

## Imports

```tsx
// Client Components
"use client"
import { motion, AnimatePresence } from "motion/react"

// Server Components
import * as motion from "motion/react-client"
```

## Core Animation

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>
```

## Variants

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  }}
/>
```

## Gestures

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ outline: "2px solid oklch(0.6 0.15 250)" }}
/>
```

## Exit Animations

```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

## Scroll-Triggered

```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
/>
```

## Scroll-Linked

```tsx
"use client"
import { motion, useScroll } from "motion/react"

function ProgressBar() {
  const { scrollYProgress } = useScroll()
  return <motion.div style={{ scaleX: scrollYProgress }} />
}
```

## Layout

```tsx
<motion.div layout />
<motion.div layoutId="shared-element" />
```

## Reduced Motion

```tsx
"use client"
import { motion, useReducedMotion } from "motion/react"

function Card() {
  const reduced = useReducedMotion()
  return (
    <motion.div
      animate={{ scale: reduced ? 1 : 1.05 }}
      transition={{ duration: reduced ? 0 : 0.2 }}
    />
  )
}
```

## Hooks

| Hook | Usage |
|------|-------|
| `useScroll()` | `scrollY`, `scrollYProgress` |
| `useInView(ref)` | Viewport visibility |
| `useMotionValue(0)` | Reactive values |
| `useTransform(mv, [0,1], [0,100])` | Value mapping |
| `useSpring(mv)` | Spring physics |
| `useReducedMotion()` | Accessibility |
| `useAnimate()` | Imperative control |

## Transition Types

```tsx
transition={{ type: "spring", stiffness: 300, damping: 20 }}
transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
transition={{ type: "inertia", velocity: 50 }}
```

## Transform Properties

`opacity`, `scale`, `rotate`, `x`, `y`, `rotateX`, `rotateY`, `skewX`, `skewY`

## Easing

`"easeIn"`, `"easeOut"`, `"easeInOut"`, `"circIn"`, `"circOut"`, `"backIn"`, `"backOut"`, `"anticipate"`

## Colors

Use oklch in animations:
```tsx
animate={{ backgroundColor: "oklch(0.7 0.15 250)" }}
variants={{
  idle: { boxShadow: "0 1px 3px oklch(0 0 0 / 0.12)" },
  hover: { boxShadow: "0 4px 12px oklch(0 0 0 / 0.15)" }
}}
```
