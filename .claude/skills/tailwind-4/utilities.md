# Tailwind 4.1+ — Custom Utilities

## @utility — Simple

```css
@utility scrollbar-thin {
  scrollbar-width: thin;
  &::-webkit-scrollbar { width: 6px; }
}

@utility text-balance { text-wrap: balance; }
@utility text-pretty { text-wrap: pretty; }
@utility content-auto { content-visibility: auto; }
```

## @utility — Functional with --value()

```css
@theme {
  --gradient-brand: linear-gradient(135deg, var(--primary), var(--accent));
}

@utility text-gradient-* {
  background: --value(--gradient-*);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

Usage: `text-gradient-brand`

### --value() Types

| Type | Example |
|------|---------|
| Theme token | `--value(--gradient-*)` |
| Bare value | `--value(integer)`, `--value(number)` |
| Arbitrary | `--value([percentage])`, `--value([length])` |
| Literal | `--value("inherit", "initial")` |

Types: `integer`, `number`, `percentage`, `ratio`, `length`, `angle`, `color`, `url`, `position`

### Combined --value()

```css
@utility opacity-* {
  opacity: --value([percentage]);
  opacity: calc(--value(integer) * 1%);
  opacity: --value(--opacity-*);
}
```

Last match wins.

## --modifier()

```css
@utility text-* {
  font-size: --value(--text-*, [length]);
  line-height: --modifier(--leading-*, [length], [*]);
}
```

Usage: `text-lg/relaxed`, `text-base/7`

## Negative Values

```css
@utility inset-* { inset: --spacing(--value(integer)); }
@utility -inset-* { inset: calc(--spacing(--value(integer)) * -1); }
```

## @layer — Cascade

```css
@layer base {
  html { font-family: var(--font-sans); }
}
```

`@layer components` — escape hatch for third-party/legacy only. Prefer utilities in JSX.

## @source — Content Detection

```css
@source "../node_modules/@company/ui";
@source not "./legacy";
@source inline("{hover:,}ring-{1,2,4}");
```
