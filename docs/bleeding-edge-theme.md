# Hippocampx Theme System (Bleeding Edge)

This theme system is **constraint-driven**: components do not pick colors. They declare meaning and mass via axes, and CSS functions compute final gradients.

## Core model

A rendered color is determined by:

**role × intent × emphasis × weight → computed gradients**

### Invariants
- **Gradients everywhere** (fills, borders, and ink). Even “flat” is expressed as a *degenerate gradient*.
- **No legacy tokens** (no `primary`, no `success`, no raw `blue-500` usage at call sites).
- **No state tokens** (`hover`, `active`) in the token namespace; states are computed via functions.
- **Single intent per element** (do not mix `accent + destructive` at usage sites).

---

## Axes

### 1) `role` — what function the color serves
`role ∈ { surface | ink | affordance }` (mutually exclusive)

- **surface**: spatial planes / surfaces
  Examples: page background, cards, panels, modals.
- **ink**: informational marks  
  Examples: text, icons, strokes (still gradients).
- **affordance**: interaction cues  
  Examples: buttons, links, toggles, focus affordances.

**Rule:** Role defines which paint channels exist.
- `surface` → fill gradient (+ optional neutral border)
- `ink` → text gradient
- `affordance` → fill gradient + border gradient + ink gradient

---

### 2) `intent` — why the color exists (semantic meaning)
`intent ∈ { accent | positive | caution | destructive | base }`

- **accent**: brand / emphasis without status semantics
- **positive**: success / confirmation / safe action
- **caution**: warning / attention / risky action
- **destructive**: error / danger / irreversible action
- **base**: non-semantic default (derived from the current surface)

**Rule:** Intent is meaning, not usage.
- “Primary button” is not a token; it is **affordance × accent × …**

---

### 3) `emphasis` — perceptual salience (not state)
`emphasis ∈ { quiet | mid | loud }`

- **quiet**: backgrounded / low salience
- **mid**: baseline / default salience
- **loud**: attention-seeking / high salience

**Rule:** Emphasis modulates *strength*, not meaning:
- `surface`: adjusts surface lightness / aura strength
- `ink`: adjusts gradient contrast/chroma
- `affordance`: modulates intent strength and surface aura (but does not change intent)

---

### 4) `weight` — interaction paint mass (affordance-only)
`weight ∈ { solid | soft | outline | ghost }`

Weight only applies when `role=affordance`.

- **solid**: full gradient fill + full border + computed “on” ink gradient  
  Best for primary CTAs.
- **soft**: tinted gradient fill + subtle border + intent ink gradient  
  Best for secondary actions with presence.
- **outline**: minimal fill + strong border + intent ink gradient  
  Best for tertiary actions that must remain clear.
- **ghost**: minimal fill + **no border** + intent ink gradient  
  Best for low-friction actions and toolbar buttons.

**Rule:** Weight changes mass, not meaning.

---

## Theme / scheme

### Scheme source of truth
The app sets scheme on the root element:

- `<html data-scheme="light">`
- `<html data-scheme="dark">`

The theme derives neutrals + constraints from `--scheme`. No duplicated palettes.

---

## Contrast + “on” colors

### Solid affordance ink
Solid affordances must compute a readable “on” ink based on the fill.

- Use `contrast-color()` (no fallback in this system).
- Keep gradients: “on” ink is a degenerate gradient (same stop repeated).

**Rule:** Do not hardcode `white` or `black` for affordance ink.

---

## Practical usage patterns (axis composition)

### Surfaces
- Quiet background plane: `surface base quiet`
- Normal card surface: `surface base mid`
- Elevated/attention surface: `surface accent loud`

### Typography / icons
- Standard heading: `ink accent loud`
- Secondary label: `ink base quiet`
- Warning text: `ink caution mid`

### Interactive
- Primary CTA: `affordance accent loud solid`
- Secondary action: `affordance accent mid soft`
- Tertiary action: `affordance base mid outline`
- Toolbar action: `affordance accent quiet ghost`
- Destructive CTA: `affordance destructive loud solid`

---

## Extension rules (do not violate)

### Allowed extensions
- Add new **intents** only when semantics justify it (e.g., `informative`), not for aesthetics.
- Add new **weights** only if they represent a new paint-mass category.

### Disallowed extensions
- Do not add element/component names into tokens (`button.*`, `card.*`).
- Do not add state tokens (`*-hover`, `*-active`) into the token namespace.
- Do not introduce raw palette calls at usage sites.

---

## Design intent (one sentence)

Tokens encode **function + meaning + salience + mass**.  
CSS functions compute the final gradients and readable “on” ink.
