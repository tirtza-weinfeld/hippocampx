# Formula-Match — Design Specification

> Bleeding Edge 2025 | Pilot for app-wide CSS architecture

---

## 1. Color Semantics — Role-Based

Not `primary/secondary/accent`. Named by **function**.

| Category | Tokens |
|----------|--------|
| Surface | `--surface`, `--surface-dim`, `--surface-bright` |
| Text | `--on-surface`, `--on-surface-muted` |
| Interactive | `--interactive`, `--interactive-hovered`, `--interactive-pressed` |
| Interactive Text | `--on-interactive` |
| Feedback | `--success`, `--warning`, `--error`, `--info` (each with `--on-*` pair) |
| Borders | `--border`, `--border-muted`, `--border-strong`, `--border-focus` |

**Key:** Every background has an `on-*` pair. No guessing contrast.

### oklch() Color System

Perceptually uniform. Single hue with L/C shifts:

| State | Adjustment |
|-------|------------|
| Hover | L -7% |
| Pressed | L -13%, C +0.02 |
| Disabled | C reduced to ~0.02 (desaturated) |

---

## 2. Interactive States

### Hover

- **Media:** `@media (hover: hover)` only
- **Timing:** 150-200ms ease-out
- **Feedback:** Background L shift, optional `scale(1.02)`

### Focus-Visible

Use `:focus-visible`, **not** `:focus`

- 2-3px outline, 2px offset
- 3:1 contrast minimum
- `outline` + `outline-offset`, not `box-shadow`

### Active

**Instant** — no transition (or 50ms max)

- `scale(0.95-0.98)` + `translateY(1-2px)`
- Darker background, increased chroma
- Reduced/removed shadow

### Disabled

- `cursor: not-allowed`
- Desaturated (`oklch` C ~0.02) or `opacity: 0.5`
- No hover/active effects

### Validation

Use `:user-invalid` / `:user-valid`

**Not** `:invalid` / `:valid` (triggers prematurely on load)

---

## 3. Accessibility — WCAG 2.2

| Requirement | Spec | Level |
|-------------|------|-------|
| Target Size | min 24×24 CSS px | 2.5.8 AA |
| Focus Visible | 3:1 contrast focus ring | 2.4.7 A |
| High Contrast Mode | `border: 1px solid transparent` | forced-colors |
| Reduced Motion | `@media (prefers-reduced-motion: reduce)` | — |

---

## 4. Bleeding Edge CSS (2025)

| Feature | Purpose |
|---------|---------|
| `@property` | Typed custom properties, enables animation |
| `@starting-style` | Entry animations for DOM insertion |
| `transition-behavior: allow-discrete` | Animate `display`/`visibility` |
| `interpolate-size: allow-keywords` | Animate to/from `auto` |
| `@scope` | Scoped styles: `@scope (.card) to (.card-content)` |
| `anchor()` | CSS anchor positioning (JS-free popovers) |
| `@container style()` | Query custom property values |
| `@view-transition` | Native page transitions |
| `light-dark()` | Single declaration theming (requires `color-scheme: light dark`) |
| `field-sizing: content` | Textarea auto-resize |
| `text-wrap: balance \| pretty` | Typography |
| `color-mix()` | Runtime color mixing: `color-mix(in oklch, base, black 20%)` |
| Gradient interpolation | `linear-gradient(in oklch, ...)` — perceptually smooth gradients |

---

## 5. Token Architecture — Two-Tier

| Tier | Prefix | Exposed | Example |
|------|--------|---------|---------|
| Primitives | `--_` | No | `--_blue-500`, `--_gray-100` |
| Semantics | none | Yes (`@theme inline`) | `--interactive`, `--surface` |

Primitives in `:root`. Semantics alias primitives, exposed via `@theme inline`.

---

## 6. Anti-Patterns

| Avoid | Use Instead |
|-------|-------------|
| `:focus` | `:focus-visible` |
| `:invalid` | `:user-invalid` |
| Shadow-only active | Shadow + transparent border |
| Color-only indicators | Color + shape/icon |
| Transition on `:active` | Instant or 50ms |
| Exposing primitives | Semantic tokens only |
