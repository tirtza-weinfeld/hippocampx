# CSS @function Test Findings

Testing bleeding-edge CSS features in Chrome 137+ via `pnpm test:browser`.

## What Works ✅

| Pattern | Example | Result |
|---------|---------|--------|
| Type annotations | `@function --fn(--a <color>) returns <color>` | ✅ Works |
| `type(*)` generic | `@function --pick(--light type(*), --dark type(*)) returns type(*)` | ✅ Works |
| Basic `@function` | `@function --double(--v <number>) returns <number>` | `--double(5) = 10` |
| `@function` returning color | `@function --make-gray(--l <number>) returns <color>` | `oklch(0.5 0 0)` |
| Nested function calls | `--outer(--v) { result: calc(--inner(var(--v)) * 2); }` | `12` |
| Function result stored in var | `:root { --my-gray: --make-gray(0.7); }` | `oklch(0.7 0 0)` |
| `if()` with `style()` queries | `if(style(--mode: dark): var(--dark); else: var(--light))` | Switches correctly |
| `color-mix()` | `color-mix(in oklch, var(--a), var(--b) 50%)` | `oklch(0.539974 0.285457 326.643)` |
| `--mix()` wrapper function | `--mix(red, blue, 50%)` | `oklch(0.539974 0.285457 326.643)` |
| `--emph()` nested if | `if(style(--emphasis: loud): 12%; else: if(...))` | mid=8%, quiet=4%, loud=12% |
| `.layer` class with `@layer` | No conflict | ✅ Works |
| `if()` result used in function | `--layer-base` from `if()` → `--mix()` | `oklch(0.8992 0.0168 265)` |
| `linear-gradient` with function colors | `linear-gradient(--make-gray(0.9), --make-gray(0.7))` | ✅ Works |
| Function returning gradient | `@function --grad(...) returns <image>` | ✅ Works |
| Chained functions | `--pick` → `--neutral` → `--grad-v3` | ✅ Works |
| Trailing semicolon in `if()` | `if(...; else: ...;);` | ✅ Works |
| No trailing semicolon | `if(...; else: ...)` | ✅ Works |
| Nested function without var wrapper | `--neutral(--pick(var(--a), var(--b)))` | `oklch(0.18 0 265)` |
| `contrast-color()` | `contrast-color(var(--base))` | `rgb(0, 0, 0)` |
| `@function` inside `@layer` | Functions defined in `@layer tokens` | ✅ Works |
| 4-level nested `if()` | `--intent-src` with accent/positive/caution/destructive | ✅ Works |
| `var()` percentage in `--mix()` | `--mix(c1, c2, var(--pct-var))` | `oklch(0.8488 0 265)` |
| `if()` result percentage in `--mix()` | `--mix(c1, c2, var(--pct-if))` where `--pct-if` is `if()` | `oklch(0.8488 0 265)` |

## What Doesn't Work ❌

| Pattern | Example | Result |
|---------|---------|--------|
| Trailing comma in arguments | `--fn(var(--a), var(--b), var(--c),)` | ❌ Fails |
| Complex variable chains with `--g-layer-a` | See bug analysis below | ❌ Empty |

## The Specific Bug: Chrome @function Evaluation Order

### Summary

Chrome fails to evaluate `--intent-color` (returns empty) when ALL of these conditions are present:

1. `--intent-accent: oklch(0.60 var(--chroma) var(--hue))` in first `:root` block (any `oklch()` with `var()` refs)
2. `--layer-base` from `if()` with nested `--neutral()` function calls using `--pick()` results
3. `--intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost))`
4. `--g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura))`

This is a **Chrome @function lazy evaluation bug** - the combination of unrelated variable definitions triggers incorrect evaluation order.

### What Does NOT Fix It

| Attempt | Result |
|---------|--------|
| Shorthand `if()` syntax (flattened, not nested) | ❌ Still fails |
| Using literal values in `oklch()` for `--intent-accent` | ❌ Still fails |
| Removing `var()` refs from `--intent-accent` | ❌ Still fails |

### What DOES Fix It

| Fix | Works When |
|-----|------------|
| Remove `--intent-accent` definition entirely | ✅ Works |
| Remove `--g-layer-a/b/c` definitions | ✅ Works |
| Add `--i1 + --i2` workaround | ✅ Works (simple case only) |

### Workaround Found ✅

Adding both `--i1: var(--intent-color)` AND `--i2: --shade(var(--intent-color), ...)` BEFORE `--g-layer-a` forces correct evaluation:

```css
--intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
--i1: var(--intent-color);  /* 👈 Simple alias - forces evaluation */
--i2: --shade(var(--intent-color), var(--ramp-shade));  /* 👈 Also needed */
--aura: --emph();
--g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));  /* ✅ Works now */
```

### Test Results Summary

| Test | Config | `--intent-color` | Result |
|------|--------|------------------|--------|
| TEST 35 | Base + `--g-layer-a` | Empty | ❌ |
| TEST 43 | + `--i0` only | Empty | ❌ |
| TEST 44 | + `--i1` only (alias) | Empty | ❌ |
| TEST 50 | + `--i2` only (shade) | Empty | ❌ |
| TEST 46 | + `--i0` + `--i1` | Empty | ❌ |
| TEST 47 | + `--i1` + `--i2` | `oklch(0.94 0 265)` | ✅ |
| TEST 48 | + `--i0` + `--i2` | `oklch(0.94 0 265)` | ✅ |
| TEST 45 | + `--i0` + `--i1` + `--i2` | `oklch(0.94 0 265)` | ✅ |

**Key insight:** You need at least ONE alias (`--i1: var(--intent-color)` or similar) AND ONE function call using `--intent-color` (like `--shade(var(--intent-color), ...)`).

### Why This Happens

Chrome's @function implementation appears to have a lazy evaluation issue:
- Variables defined via `if()` with nested function calls aren't fully resolved until "forced"
- A simple `var()` alias alone doesn't force evaluation
- A function call alone doesn't force evaluation
- The combination of both seems to trigger proper resolution

### Minimal Reproducer

**Fails:**
```css
@layer tokens;
@layer tokens {
  @function --pick(--light type(*), --dark type(*)) returns type(*) {
    result: if(style(--scheme: dark): var(--dark); else: var(--light););
  }
  @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 var(--hue)); }
  @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
  @function --emph() returns <percentage> {
    result: if(style(--emphasis: loud): 12%; else: if(style(--emphasis: quiet): 4%; else: 8%;));
  }
  :root {
    --scheme: light;
    --hue: 265;
    --emphasis: mid;
    --l-layer-mid-light: 0.94;
    --l-layer-mid-dark: 0.13;
  }
  :root {
    --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
    --layer-base: if(
      style(--emphasis: loud): --neutral(0.90);
      else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(var(--l-layer-mid));)
    );
    --intent-src: var(--layer-base);
    --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
    --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
    --aura: --emph();
    --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
    /* ❌ --intent-color is EMPTY */
  }
}
```

**Works (add --i1 + --i2):**
```css
  :root {
    /* ... same as above ... */
    --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
    --i1: var(--intent-color);  /* 👈 ADD THIS */
    --i2: --shade(var(--intent-color), 12%);  /* 👈 AND THIS */
    --aura: --emph();
    --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
    /* ✅ --intent-color is oklch(0.94 0 265) */
  }
```

## Test Files

- `__tests__/browser/css/bleeding-theme.test.ts` - Comprehensive isolation tests
- `__tests__/browser/css/bleeding-theme-standalone.test.ts` - File loading test
- `__tests__/browser/css/function-call-debug.test.ts` - Debug tests
- `/styles-bleeding/theme.css` - Full theme implementation

## Run Tests

```bash
pnpm test:browser __tests__/browser/css/bleeding-theme.test.ts
```
