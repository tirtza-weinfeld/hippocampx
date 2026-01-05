# The Word Vault

A New Year's puzzle game that teaches how AI actually works — through doing, not explaining.

---

## Overview

**Two phases, one journey:**

1. **Phase A (Chambers 1–6): Build the model** — "You are training a tiny language model"
2. **Phase B (Chamber 7): Use the model** — "Let your AI complete a sentence"

**Target:** Smart kid who loves words
**Goal:** Learn AI mechanics implicitly through gameplay
**Final reward:** The trained AI completes a New Year's message

---

## The Two Phases (Important!)

### Phase A — Training (Chambers 1–6)

What he learns:
- Tokenization (BPE)
- Embeddings
- Attention
- Training / gradient descent
- Context window
- The transformer as a machine

**Key rule:** During training, the model sees **real text**, not gibberish. No secret message yet.

This phase answers: *"How do AIs learn language?"*

### Phase B — Inference (Chamber 7)

Now we switch mindset:
- The model is already trained
- He is *using* it

The AI receives **incomplete input** and uses everything it learned to **complete it**.

This phase answers: *"What can an AI do once it's learned?"*

---

## The Message Reveal (Final Chamber)

AIs don't decrypt. They **complete**.

**Input shown to him:**
```
Happy ___ Year, bright _____.
So _____. So _____.
Keep _____.
```

He presses: "Let the AI complete it"

**The model fills in:**
```
Happy New Year, bright thinker.
So loved. So kind.
Keep shining.
```

He *built* the model, then he *used* it. The reward feels earned.

---

## Vocabulary Sources

Use these throughout all chambers (from interest.md):

| Category | Examples |
|----------|----------|
| Wicked/Hadestown | defying, gravity, emerald, underworld, orpheus, eurydice |
| Italian (Duolingo S1) | ciao, mangio, pizza, acqua, buono, grazie |
| AI Models | Claude, GPT, LLaMA, Gemini, Anthropic |
| Piano/Music | allegro, forte, piano, crescendo, octave |
| Math | π, infinity, binary, delta, sigma, factors |
| Anatomy | hippocampus, quadriceps, biceps, amygdala, hamstrings |

---

## Chamber 1: Tokenization

### What AI Does
BPE (Byte Pair Encoding) — count character pairs, merge the most frequent, repeat. This is how LLMs read text.

### What He Does

See text using themed vocabulary:
```
Text: CLAUDE DEFIES GRAVITY INFINITELY

Step 1: Count all adjacent pairs
CL: 1    LA: 1    AU: 1    UD: 1    DE: 2
EF: 1    FI: 2    IE: 1    ES: 1    GR: 1
RA: 1    AV: 1    VI: 1    IT: 2    TY: 1
IN: 3    NF: 1    NI: 1    TE: 1    EL: 1
LY: 1

Step 2: Which pair appears most? IN appears 3 times!
Tap IN to merge it.

Step 3: Text becomes: CLAUDE DEFIES GRAVITY [IN]F[IN]ITELY
Recount and repeat.
```

### UI Design

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   CLAUDE DEFIES GRAVITY INFINITELY              │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │  IN:3   DE:2   FI:2   IT:2   ...        │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
│   Which pair appears most? Tap to merge.        │
│                                                 │
│   Merges: ○ ○ ○                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Learning Outcome
"I taught the AI to read by finding patterns. Now it sees IN as one piece, not two letters."

---

## Chamber 2: Attention

### What AI Does
Self-attention: each word asks "who should I pay attention to?" and creates a weighted blend of meanings.

### What He Does

```
Sentence: "The WIZARD flew DEFYING ___ on her broom"

Distribute 10 attention points:
┌───────────┬────────┐
│ Word      │ Points │
├───────────┼────────┤
│ The       │   __   │
│ WIZARD    │   __   │
│ flew      │   __   │
│ DEFYING   │   __   │
│ on        │   __   │
│ her       │   __   │
│ broom     │   __   │
├───────────┼────────┤
│ TOTAL     │   10   │
└───────────┴────────┘

Each word contributes meaning:
WIZARD   → magic, spells, power, flying
DEFYING  → rebellion, against, breaking rules
broom    → flying, witch, sweeping
```

**Good allocation:** WIZARD:4, DEFYING:4, broom:2 → GRAVITY
**Bad allocation:** The:5, on:5 → ??? (nothing useful)

### Learning Outcome
"I learned that AI figures out meaning by deciding which words matter most."

---

## Chamber 3: Embeddings

### What AI Does
Word embeddings: every word becomes coordinates in space. Similar meanings = nearby points.

### What He Does

2D grid with themed words:
```
    BODY PART →
    0   2   4   6   8   10
  ┌───────────────────────┐
10│        HIPPOCAMPUS    │ ↑
  │          (7,9)        │ BRAIN
 8│  AMYGDALA             │
  │   (3,8)               │
 6│                       │
  │                       │
 4│           QUADRICEPS  │ ↑
  │            (6,4)      │ LEG
 2│  HAMSTRINGS  BICEPS   │
  │   (4,2)      (8,2)    │
 0└───────────────────────┘
```

**Puzzle:** "Which word is closest to QUADRICEPS?"
Calculate: Distance to HAMSTRINGS = √[(6-4)² + (4-2)²] = √8 ≈ 2.8
Answer: HAMSTRINGS (both leg muscles!)

**Puzzle:** Word arithmetic
HIPPOCAMPUS is brain. QUADRICEPS is leg.
"BRAIN - HIPPOCAMPUS + QUADRICEPS = ?"
Answer: LEG (same relationship)

### Learning Outcome
"AI puts similar words close together in space. That's how it knows HAPPY and EXCITED are related."

---

## Chamber 4: Temperature

### What AI Does
Temperature controls randomness. Low = predictable (always picks best). High = creative (more random).

### What He Does

```
Context: "The AI made by Anthropic is called ___"

Options with scores:
CLAUDE:  score 10 (correct answer)
GPT:     score 4  (wrong company)
LLAMA:   score 3  (wrong company)
GEMINI:  score 2  (wrong company)

Temperature 0.2 (cold/careful):
  CLAUDE: 85%  GPT: 10%  LLAMA: 3%  GEMINI: 2%
  → Almost always picks CLAUDE ✓

Temperature 2.0 (hot/random):
  CLAUDE: 35%  GPT: 25%  LLAMA: 22%  GEMINI: 18%
  → Could pick anything!
```

**Puzzle:** "What temperature gives CLAUDE > 80% chance?"
He adjusts slider, sees probabilities change, finds the right setting.

### Learning Outcome
"AI doesn't always pick the 'best' answer. Temperature controls how careful or creative it is."

---

## Chamber 5: Training

### What AI Does
Gradient descent: predict → measure error → adjust weights → repeat.

### What He Does

Train a tiny sentiment model using music words:
```
Word weights (start):
ALLEGRO  = 0  (fast, lively)
FORTE    = 0  (loud, strong)
PIANO    = 0  (soft, quiet)
ADAGIO   = 0  (slow)

Round 1:
Sentence: "The ALLEGRO FORTE section was exciting!"
His prediction: 0 + 0 = 0
Actual mood: +5 (very positive)
Error: -5 (way too low!)

Adjustment: Increase ALLEGRO and FORTE
New: ALLEGRO=+2, FORTE=+2

Round 2:
Sentence: "The ADAGIO PIANO passage was peaceful"
His prediction: 0 + 0 = 0
Actual mood: +3 (positive but calm)
Error: -3

Adjustment: Increase ADAGIO and PIANO a bit
New: ADAGIO=+1, PIANO=+2
```

After 5 rounds, his weights should match target.

### Learning Outcome
"AI learns by making mistakes and adjusting. That's exactly what I just did!"

---

## Chamber 6: Context Window

### What AI Does
Transformers can only see limited text at once. Old information "falls out" of the window.

### What He Does

Rule: He can only see 12 words at a time.

```
[Window 1]: "Remember the number PI equals THREE POINT ONE FOUR"
[Window 2]: "ONE FIVE NINE and it goes on forever"  ← PI value leaving!
[Window 3]: "forever into infinity like an endless river flowing"
[Window 4]: "flowing through time now what was that number?"
```

**Question:** "What is π rounded to 2 decimals?"

If he didn't remember 3.14, he's stuck — just like an AI with limited context!

### Learning Outcome
"AI can only remember so much at once. That's why long conversations sometimes get confused."

---

## Chamber 7: Transformer (Inference)

### The Trained Model

He has now trained a model that knows:
- How to tokenize (Chamber 1)
- Where to pay attention (Chamber 2)
- How words relate in space (Chamber 3)
- How to balance confidence vs creativity (Chamber 4)
- How to learn from examples (Chamber 5)
- How to manage limited memory (Chamber 6)

### What He Does

**Input (incomplete sentence):**
```
Happy ___ Year, bright _____.
So _____. So _____.
Keep _____.
```

**For each blank, he uses the model step by step:**

1. **Attention step**: See which words matter most for this blank
   - Visual: Words light up with attention scores
   - "Happy" and "Year" get high attention → suggests something about new beginnings

2. **Embeddings step**: See related words in space
   - Visual: Small embedding map showing candidate words clustered by meaning
   - Words near "Year" + "Happy" cluster: New, Fresh, Good

3. **Temperature step**: Pick how creative vs safe
   - Slider: Low temp → "New" wins (most likely)
   - He chooses temperature, sees probabilities shift

4. **Select**: He picks the word (or accepts the AI's top choice)

**He actively fills each blank using these steps**, seeing how the model "thinks":

```
Blank 1: "Happy ___ Year" → Attention on Happy+Year → Embeddings show New/Fresh/Good → Temp 0.3 → NEW
Blank 2: "bright _____" → Attention on bright → Embeddings show thinker/star/mind → Temp 0.5 → THINKER
Blank 3: "So _____" → Attention on So+positive context → Embeddings show loved/happy/blessed → LOVED
Blank 4: "So _____" → Similar pattern → KIND
Blank 5: "Keep _____" → Attention on Keep → Embeddings show shining/going/growing → SHINING
```

**Final reveal:**
```
Happy New Year, bright thinker.
So loved. So kind.
Keep shining.
```

### Learning Outcome
"I used the AI I built! I saw how it decides — attention, embeddings, temperature. This is actually how ChatGPT works!"

---

## Summary: What Each Chamber Teaches

| Chamber | What He Does | AI Concept | Skill Used in Final |
|---------|--------------|------------|---------------------|
| 1 | Count pairs, merge most common | Tokenization | Breaks input into tokens |
| 2 | Distribute attention points | Self-Attention | Focuses on meaningful words |
| 3 | Plot words, find neighbors | Embeddings | Finds related completions |
| 4 | Adjust temperature slider | Sampling | Picks confident answers |
| 5 | Train weights from examples | Gradient Descent | Learned word patterns |
| 6 | Manage limited window | Context | Handles input length |
| 7 | Use all skills to fill each blank | Transformer | Completes the message |

---

## Key Design Principles

1. **Training vs Inference clearly separated** — No confusion about what phase we're in
2. **Real text, no gibberish** — Training uses actual words he knows
3. **Completion, not decryption** — AI completes, it doesn't decode ciphers
4. **Vocabulary from his interests** — Wicked, anatomy, AI models, music, math
5. **Learning through doing** — He never reads "this is attention mechanism"

---

## One Sentence Summary

> "First we teach the AI how language works. Then we see what it can say."
