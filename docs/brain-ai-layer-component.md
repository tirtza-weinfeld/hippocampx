# BrainAILayer Component

## What

Visual component that displays layered Brain ↔ AI concept pairs, showing the connection between neuroscience and modern AI architecture.

## Why

- Educational bridge between neuroscience and AI
- Only shows **strong, honest mappings** (no weak analogies)
- Interactive reveal on hover/tap
- Reinforces HippocampX's brain-AI learning theme

## Concept Pairs (Strong Mappings Only)

| Brain Function | Brain Region | AI Component | Why Strong |
|----------------|--------------|--------------|------------|
| Action Selection | Basal Ganglia | MoE Router | Winner-take-all via softmax, routes to specialized experts |
| Gated Activation | Neurons | SwiGLU | `SiLU(A) ⊙ B` — smooth gate controls which signals pass |
| Distributed Representation | Neocortex | Embeddings | Dense features across dimensions, like cortical population codes |

### Rejected Mappings (With Reasons)

| Mapping | Why Rejected |
|---------|--------------|
| KV Cache ↔ Working Memory | KV cache is passive storage; PFC actively manipulates & prioritizes |
| QKV Attention ↔ Selective Attention | No true inhibition/competition like PFC |
| iRoPE ↔ Episodic Indexing | RoPE is geometric position encoding, not content-addressable |
| Cross-Attention ↔ Hippocampal Binding | LLaMA 4 uses early fusion + self-attention, not true binding |

---

## Component Design

### Props

```typescript
type BrainAILayerProps = {
  readonly variant?: "sides" | "stacked" | "minimal"
  readonly showLabels?: boolean
  readonly interactive?: boolean
}
```

### Variants

1. **sides** (default): Brain terms on left, AI terms on right, labels in center
2. **stacked**: Vertical stack with brain above, AI below
3. **minimal**: Just the terms, no labels

---

## Architecture

```
components/home/
├── brain-ai-layer.tsx      # Main component
└── brain-ai-pair.tsx       # Single pair row
```

---

## Styling

Uses Tailwind with theme colors:

```
Brain side:  text-{color}-500/30 → text-{color}-500/70 on hover
AI side:     text-{color}-500/30 → text-{color}-500/70 on hover
Labels:      Badges that fade in on hover
```

Colors per pair:
- Action Selection: `indigo`
- Gated Activation: `teal`
- Distributed Representation: `violet`

---

## Interactions

| Action | Result |
|--------|--------|
| Hover page | All pairs highlight, labels appear |
| Hover pair | That pair highlights stronger |
| Tap (mobile) | Same as hover via `active` states |

---

## Usage

```tsx
import { BrainAILayer } from "@/components/home/brain-ai-layer"

// In page
<BrainAILayer />

// With options
<BrainAILayer variant="stacked" showLabels={false} />
```

---

## Data

```typescript
const BRAIN_AI_PAIRS = [
  {
    brain: "Basal Ganglia",
    ai: "MoE Router",
    label: "Action Selection",
    color: "indigo",
  },
  {
    brain: "Neurons",
    ai: "SwiGLU",
    label: "Gated Activation",
    color: "teal",
  },
  {
    brain: "Neocortex",
    ai: "Embeddings",
    label: "Distributed Representation",
    color: "violet",
  },
] as const
```

---

## Notes

- Based on LLaMA 4 architecture analysis
- Only includes mappings with strong mechanistic parallels
- Avoids overstating analogies (no "AI hippocampus" claims)
- Educational, not misleading
