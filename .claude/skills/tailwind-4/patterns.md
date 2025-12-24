# Tailwind 4.1+ — Patterns

## Built-in Utilities — Don't Redefine

Tailwind 4 ships with these. Never redefine in `@theme`:

- `rounded-*` (sm, md, lg, xl, 2xl, 3xl, full)
- `shadow-*` (xs, sm, md, lg, xl, 2xl)
- `blur-*` (sm, md, lg, xl, 2xl, 3xl)
- `ease-*` (linear, in, out, in-out)
- `duration-*` (75, 100, 150, 200, 300, 500, 700, 1000)

Only use `@theme` for **custom** tokens (semantic colors, brand shadows, spring easing).

## Entry Animation
`starting:opacity-0 starting:translate-y-2 transition-[opacity,transform]`

## Gradients
`bg-linear-*` not `bg-gradient-*`

## Text Shadows
`text-shadow-lg` `text-shadow-primary/30`

Sizes: `2xs` `xs` `sm` `md` `lg`

## Masks
`mask-b-from-50%` `mask-t-from-20%` `mask-radial-from-70% mask-radial-at-center`

## Popover Animation
`transition-discrete open:opacity-100 starting:open:opacity-0`

## Field Sizing
`field-sizing-content` — auto-resize textarea
