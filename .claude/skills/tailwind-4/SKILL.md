---
name: tailwind-4
description: Tailwind CSS 4.1+ patterns. Use when styling components, responsive design, container queries, masks, shadows, or animations. (project)
---

# Tailwind 4.1+

## Setup

```css
@import "tailwindcss";
```

No `tailwind.config.js`. No `@tailwind` directives.

## @theme — Design Tokens

```css
@theme {
  --font-display: "Satoshi", "sans-serif";
  --color-brand: oklch(0.7 0.15 250);
  --breakpoint-3xl: 1920px;
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --animate-wiggle: wiggle 1s ease-in-out infinite;
  @keyframes wiggle { 0%, 100% { rotate: -3deg } 50% { rotate: 3deg } }
}
```

| Namespace | Generates |
|-----------|-----------|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*` |
| `--font-*` | `font-*` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` |
| `--radius-*` | `rounded-*` |
| `--shadow-*` | `shadow-*` |
| `--ease-*` | `ease-*` |
| `--animate-*` | `animate-*` |
| `--breakpoint-*` | `sm:`, `md:`, `3xl:` |
| `--container-*` | `@sm:`, `@md:` |

## Theming — Dark/Light

```css
@custom-variant dark (&:where(.dark, .dark *));

:root { --primary: var(--color-blue-600); }
.dark { --primary: var(--color-blue-400); }

@theme inline { --color-primary: var(--primary); }
```

Usage: `bg-primary` — no `dark:` needed.

## Palette Overrides

Add class to layout, target with `body:has()`:

```css
body:has(.claude-code) { --primary: var(--color-orange-600); }
.dark body:has(.claude-code) { --primary: var(--color-orange-400); }
```

## @theme vs :root vs @theme inline

| Directive | Purpose |
|-----------|---------|
| `@theme` | Creates utilities (`bg-brand`), static values |
| `:root` / `.dark` | CSS variables, cascadable, no utilities |
| `@theme inline` | Maps `:root` vars to utilities, resolves at runtime |

Use `:root` for theme values that change (dark/light), `@theme inline` to expose them as utilities.

## Theme Functions

```css
--color-overlay: --alpha(var(--background) / 80%);
padding: --spacing(4) --spacing(6);
```

## Anti-Patterns

| Avoid | Use |
|-------|-----|
| `tailwind.config.js` | `@theme` in CSS |
| `@tailwind base/utilities` | `@import "tailwindcss"` |
| `dark:bg-zinc-900` | Semantic `bg-background` |
| `group` class | `in-*` variant |
| Viewport for component layout | `@container` queries |
