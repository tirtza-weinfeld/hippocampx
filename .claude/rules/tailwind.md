---
paths: "**/*.tsx,**/*.css,styles/**"
---
# Tailwind CSS

## Entry Point
```css
@import "tailwindcss";
```

## @theme (design tokens → utilities)

**@theme** — new tokens, generates utilities:
```css
@theme {
  --color-brand: oklch(0.7 0.15 264);
}
```
Usage: `bg-brand`, `text-brand`

**@theme inline + :root/.dark** — for dark mode support:
```css
:root {
  --background: oklch(0.98 0.01 264);
  --primary: oklch(0.6 0.15 180);
}
.dark {
  --background: oklch(0.15 0.01 264);
  --primary: oklch(0.7 0.12 180);
}

@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
}
```
Usage: `bg-background text-primary` — dark mode works automatically via CSS cascade.

**No `dark:` prefix needed for mapped tokens.** Use `dark:` only for Tailwind's built-in colors.

**Rule:** `@theme` for new tokens. `@theme inline` + `:root`/`.dark` for dark mode.

## @layer base (element defaults)

For default HTML element styles. Rarely needed—prefer utilities on `<html>`/`<body>`.
```css
@layer base {
  h1 { font-size: var(--text-2xl); }
}
```

## @layer components (overridable multi-property classes)

For reusable classes that **utilities can override**:
```css
@layer components {
  .card {
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    padding: --spacing(6);
  }
}
```
Usage: `card rounded-none` — utility overrides component's `border-radius`

**Rule:** `@layer components` for base styles needing utility overrides.

## @utility (CSS properties without Tailwind utilities)

Only for CSS properties Tailwind has no utilities for. Never for colors, spacing, or properties with existing utilities.

**Nested** — use `&` for pseudo-elements/selectors:
```css
@utility scrollbar-thin {
  scrollbar-width: thin;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
}
```

**Functional utilities** — use `--value()` to match `@theme` tokens:
```css
@theme {
  --gradient-brand: linear-gradient(...);
  --gradient-sunset: linear-gradient(...);
}

@utility text-gradient-* {
  background: --value(--gradient-*);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```
Usage: `text-gradient-brand`, `text-gradient-sunset`

**`--value()` forms:**
- `--value(--theme-var-*)` — match theme tokens
- `--value(integer)` / `--value(number)` / `--value(percentage)` — bare values
- `--value([integer])` — arbitrary values like `utility-[42]`
- `--value("inherit", "initial")` — literal strings

## @custom-variant

Define once in globals.css:
```css
@custom-variant dark (&:is(.dark *));
```
Usage: `bg-white dark:bg-gray-900`

## Build-Time Functions

Use inside `@theme`, `@theme inline`, or `@utility` definitions:

```css
@theme inline {
  --color-primary-soft: --alpha(var(--primary) / 10%);  /* derive transparent variant */
  --color-overlay: --alpha(var(--background) / 80%);
}

@utility card {
  padding: --spacing(4) --spacing(6);  /* compute spacing */
  border-radius: var(--radius-lg);
}
```

## Theme Namespaces

**Primary (used in this project):**
| Namespace | Token Example | Generated Utilities |
|-----------|---------------|---------------------|
| `--color-*` | `--color-brand` | `bg-brand`, `text-brand`, `border-brand`, `fill-brand`, `stroke-brand` |
| `--animate-*` | `--animate-fade-in` | `animate-fade-in` |
| `--ease-*` | `--ease-fluid` | `ease-fluid` |
| `--shadow-*` | `--shadow-glow` | `shadow-glow` |

**Rarely customized (Tailwind defaults usually sufficient):**
| Namespace | Purpose |
|-----------|---------|
| `--font-*` | Font families (`font-display`) |
| `--text-*` | Font sizes only, NOT colors (`text-micro`) |
| `--spacing-*` | Spacing scale (`p-18`, `gap-72`) |
| `--radius-*` | Border radius (`rounded-pill`) |
| `--breakpoint-*` | Responsive variants (`3xl:*`) |
| `--container-*` | Container query variants (`@8xl:*`) |

## Animations

`@theme` for static values, `@theme inline` when shorthand uses var().
@keyframes defined inside same block — var() inside resolves at runtime.
```css
@theme {
  --animate-wiggle: wiggle 1s ease-in-out infinite;
  @keyframes wiggle { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
}
```
Usage: `animate-wiggle`, `animate-[spin_2s_linear_infinite]` (one-off)

## State Variants

**Interactive:** `hover:`, `active:`, `focus-visible:` (keyboard), `focus-within:` (child focused)
**Form:** `disabled:`, `invalid:`, `required:`, `checked:`, `placeholder-shown:`, `autofill:`
**Structural:** `first:`, `last:`, `odd:`, `even:`, `empty:`, `has-[...]:`
**Group/Peer:** `group-hover:`, `peer-invalid:`, `in-[...]:`

**Pseudo-elements:** `before:`, `after:`, `placeholder:`, `selection:`, `marker:`, `file:`, `backdrop:`
**Accessibility:** `motion-reduce:`, `contrast-more:`, `forced-colors:`, `inert:`
**Media:** `print:`, `portrait:`, `landscape:`, `noscript:`
**State:** `open:` (details/popover), `starting:` (entry animation), `aria-expanded:`, `data-[...]:`
**Selectors:** `*:` (children), `**:` (descendants)

`focus-visible:` not `focus:` for keyboard-only rings. `disabled:` cancels hover/focus.
Stack: `dark:md:hover:bg-primary`

## Responsive

**Viewport:** `sm:`, `md:`, `lg:`, `xl:`, `2xl:` — range: `md:max-lg:`
**Container:** `@container` + `@sm:`, `@md:` — named: `@container/sidebar` + `@sm/sidebar:`
**Pointer:** `pointer-coarse:` (touch), `pointer-fine:` (mouse)
**Safe alignment:** `justify-center-safe` prevents overflow when centering

## Gradients

**Linear:** `bg-linear-to-r`, `bg-linear-45` + `from-*`, `via-*`, `to-*`
**Radial/Conic:** `bg-radial`, `bg-conic`
**Stops:** `from-10%`, `via-30%`, `to-90%`
For text gradients, use `@utility text-gradient-*` (see @utility section).

## Transitions

`transition-colors` (hover), `transition-transform` (scale), `transition-shadow`, `transition-opacity`
Avoid `transition-all` (perf). Add `duration-*` and `ease-*`.
Patterns: `hover:scale-105 transition-transform`, `hover:shadow-xl transition-shadow`, `hover:blur-none transition-[filter]`

## Filters

**Blur:** `blur-sm`, `backdrop-blur-md`
**Effects:** `grayscale`, `brightness-*`, `contrast-*`, `saturate-*`
**Glassmorphism:** `bg-white/10 backdrop-blur-md backdrop-saturate-150`
Use `transition-[filter]` when animating filters.

## Shadows

**Box:** `shadow-lg`, colored: `shadow-blue-500/25`
**Drop:** `drop-shadow-lg` for SVG/PNG, colored: `drop-shadow-cyan-500/50`
**Text:** `text-shadow-{2xs,xs,sm,md,lg}`, colored: `text-shadow-sky-300/50`

## Masks

Gradient masks: transparent=hidden, opaque=visible.
- **Edge fade**: `mask-{t,r,b,l}-from-{%}`, `mask-{x,y}-from-{%}` (both sides)
- **Radial**: `mask-radial-from-{%}`, `mask-radial-at-{position}`, `mask-circle`
- **Arbitrary**: `mask-[url(/shape.svg)]`

## Layout & Sizing

`size-6` = `w-6 h-6`. `aspect-video`, `aspect-square`, `aspect-[4/3]`.
`inset-0` = `top-0 right-0 bottom-0 left-0`. `inset-x-*`, `inset-y-*`.
`divide-y`, `divide-x` — borders between children. `divide-gray-200`.

## Text

`truncate` — single line with ellipsis. `line-clamp-{1-6}` — multi-line truncate.
`wrap-break-word` — break long words. `wrap-anywhere` — break in flex.

## Accessibility

`sr-only` — visible to screen readers only. `not-sr-only` — undo.
`forced-colors:` variant for Windows High Contrast mode.

## SVG

`fill-current`/`stroke-current` inherit parent's `text-*` color. Use `size-*` for dimensions.
Hover: parent `text-gray-500 hover:text-blue-600` + child `fill-current`

## Scroll

`scroll-smooth` on html. `overscroll-contain` on modals/drawers.
`scroll-mt-*` for anchor offset with fixed headers.
Snap: `snap-x snap-mandatory overflow-x-auto` + children `snap-center`

## Common Patterns

**Hover lift:** `hover:-translate-y-1 hover:shadow-lg transition`
**Press:** `active:scale-95 transition-transform`
**Focus ring:** `focus-visible:ring-2 focus-visible:ring-ring outline-none` (`ring-*` = box-shadow outline)
**Disabled:** `disabled:opacity-50 disabled:pointer-events-none`
**Entry:** `starting:opacity-0 starting:translate-y-2 transition`

Always pair transforms with `transition`.

## Best Practices

1. **`:root`/`.dark` → raw tokens** (`--brand`) **→ `@theme inline` → namespaced** (`--color-brand`)
2. **OKLCH strictly** - All colors in `oklch()` format
3. **`--spacing()` / `--alpha()` inside definitions only** - Never in className
4. **Container queries for components** - `@container` + `@md:`
5. **motion-safe/motion-reduce** - Always respect user preferences
6. **No duplicate @keyframes** - Define once per animation name
7. **No `dark:` for mapped tokens** - Dark mode works via CSS cascade
