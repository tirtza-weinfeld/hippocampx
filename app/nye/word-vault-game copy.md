# The Word Vault

A New Year's puzzle game that teaches how AI actually works — through doing, not explaining.

---

## Overview

A mysterious vault with locked chambers. Each lock works differently. He cracks patterns, allocates attention, plots coordinates, and tunes weights — doing exactly what transformers do internally.

**Themes woven in:**
- Wicked & Hadestown vocabulary
- Italian (Duolingo Section 1)
- AI models: GPT-5.2, LLaMA-4, Claude
- Piano & music
- Math: π, binary, factors, roots, Greek letters
- Anatomy: hippocampus, muscles

---

## Chamber 1: The Merge Game (Tokenization)

### What AI Does
BPE (Byte Pair Encoding) — count character pairs, merge the most frequent, repeat. This is how GPT-5.2, LLaMA-4, and Claude all tokenize text before processing.

### What He Does

```
Text: DEFYING GRAVITY FEELS LIKE FLYING

Step 1: Count all adjacent pairs
DE: 1    EF: 1    FY: 2    YI: 2    IN: 2    NG: 2
G_: 1    _G: 1    GR: 1    RA: 1    AV: 1    VI: 1
IT: 1    TY: 1    Y_: 2    _F: 1    FE: 1    EE: 1
EL: 1    LS: 1    S_: 1    _L: 1    LI: 1    IK: 1
KE: 1    E_: 1    FL: 1    LY: 1

Step 2: Merge most common (FY, YI, IN, NG, Y_ all tie at 2)
Pick FY → now "FY" is one token

Step 3: Recount, merge again...
```

### Wicked-Themed Puzzle

```
Training text from Wicked:
"SOMETHING HAS CHANGED WITHIN ME SOMETHING IS NOT THE SAME"

Count pairs. Merge. The sequence of your first 5 merges,
read as letters, gives you a clue.

Merges might be: SO, ME, TH, IN, NG
First letters: S-M-T-I-N → rearrange → MINTS? No...
Or the MERGED pairs spell something when combined.
```

### Binary Variation

After finding merge order, convert position to binary:
```
1st merge at position 3 → 11 in binary
2nd merge at position 7 → 111 in binary
3rd merge at position 2 → 10 in binary

Binary sequence: 11-111-10 → decode as ASCII or sum
```

---

## Chamber 2: The Attention Grid

### What AI Does
Self-attention: each word asks "who should I pay attention to?" — exactly like how you focus on certain words when reading.

### Hadestown-Themed Puzzle

```
Sentence: "ORPHEUS walked down to the ___ to find EURYDICE"

Distribute 10 attention points:
┌────────────┬────────┐
│ Word       │ Points │
├────────────┼────────┤
│ ORPHEUS    │   __   │  → mythology, musician, lover
│ walked     │   __   │  → movement, journey
│ down       │   __   │  → below, descent
│ to         │   __   │  → (empty)
│ the        │   __   │  → (empty)
│ find       │   __   │  → search, rescue
│ EURYDICE   │   __   │  → beloved, lost, below
├────────────┼────────┤
│ TOTAL      │   10   │
└────────────┴────────┘
```

**Good allocation:**
- ORPHEUS: 2, down: 4, EURYDICE: 4
- Gets: descent + below + lost = **UNDERWORLD** ✓

**Bad allocation:**
- walked: 8, to: 2
- Gets: movement + nothing = **PATH**? **ROAD**? (wrong)

### Piano Variation

```
"The pianist played a ___ in the key of C major"

Words and their values:
PIANIST → performer, musician, hands
played → action, performed, made sound
key → tonality, signature, musical
C major → bright, happy, no sharps/flats

Heavy attention on "key" + "C major" → CHORD? SCALE? MELODY?
```

---

## Chamber 3: Word Coordinates (Embeddings)

### What AI Does
Every word becomes a point in space. Similar meanings = nearby points.
Like the hippocampus mapping spatial memories, AI maps word meanings.

### Anatomy-Themed Grid

Plot muscles and concepts on a STRENGTH × LOCATION grid:

```
    UPPER BODY →
    0   2   4   6   8   10
  ┌───────────────────────────┐
10│                 BICEPS    │
  │                  (9,9)    │
 8│  HAMSTRINGS              │
  │    (2,8)                 │
 6│           CORE    DELTOID│  ↑
  │          (5,6)    (8,6)  │  STRENGTH
 4│  QUADRICEPS              │
  │    (3,4)                 │
 2│         RECTUS           │
  │        ABDOMINIS(5,2)    │
 0└───────────────────────────┘
         LOWER BODY →
```

### Puzzle: Muscle Math

```
BICEPS is at (9, 9)
HAMSTRINGS is at (2, 8)
QUADRICEPS is at (3, 4)

What's the distance from BICEPS to QUADRICEPS?
√[(9-3)² + (9-4)²] = √[36 + 25] = √61 ≈ 7.8

Round to nearest integer: 8
This is your shift key for the next cipher.
```

### Word Arithmetic with Italian

```
CIAO is at (8, 7)      [greeting, friendly, Italian]
GRAZIE is at (6, 9)    [thanks, polite, Italian]
HELLO is at (8, 5)     [greeting, friendly, English]

CIAO → GRAZIE = (-2, +2)
HELLO + (-2, +2) = (6, 7) = ???

Find the word at (6, 7): THANKS (English equivalent!)
```

---

## Chamber 4: Probability Dice (Temperature)

### What AI Does
GPT-5.2, LLaMA-4, and Claude all use temperature to control creativity.
Low temp = predictable. High temp = surprising.

### AI Model Theme

```
Three models predict the next word in:
"Elphaba learned to ___"

       │ FLY  │ DEFY │ SING │ DREAM │
───────┼──────┼──────┼──────┼───────│
GPT    │  8   │  6   │  3   │  2    │
LLaMA  │  7   │  7   │  4   │  1    │
Claude │  6   │  8   │  3   │  2    │
```

**At temperature 0.3 (cold/focused):**
Each model strongly favors its top choice.
- GPT → almost certainly FLY
- Claude → almost certainly DEFY

**At temperature 1.5 (hot/creative):**
Scores flatten, surprises happen.
- Any model might say DREAM

### π-Based Temperature

```
Use digits of π as temperature: 3.1415926...

Position 1: temp = 0.3 (first digit after decimal = 1, so 0.1? Or use 3?)
Position 2: temp = 0.1
Position 3: temp = 0.4
Position 4: temp = 0.1
Position 5: temp = 0.5

Decode each word using that position's temperature.
Lower temp = pick highest score. Higher temp = more randomness allowed.
```

---

## Chamber 5: Weight Tuning (Training)

### What AI Does
Gradient descent: predict → measure error → adjust → repeat.
Like practicing piano scales until your fingers learn the pattern.

### Musical Weights

```
Starting weights for predicting "mood" of music:
MAJOR    = +3
MINOR    = -2
ALLEGRO  = +2  (fast/lively)
ADAGIO   = -1  (slow/sad)
FORTE    = +1  (loud/strong)
PIANO    = 0   (soft/gentle)
```

**Round 1:**
```
Piece: "MAJOR key, ALLEGRO tempo"
Predict mood: +3 + 2 = +5 (very happy)
Actual rating: +4
Error: +1 (too positive)

Adjust: MAJOR = +2.5, ALLEGRO = +1.5
```

**Round 2:**
```
Piece: "MINOR key, ADAGIO, played PIANO"
Predict: -2 + (-1) + 0 = -3 (sad)
Actual: -4
Error: +1 (not sad enough)

Adjust: MINOR = -2.5, ADAGIO = -1.5
```

### Binary Weight Encoding

After 8 training rounds, your weights might be:
```
MAJOR=3, MINOR=-3, ALLEGRO=2, ADAGIO=-2, FORTE=1, PIANO=-1

Positive weights → 1, Negative → 0
Binary: 1 0 1 0 1 0

Convert: 101010 in binary = 42 in decimal
42 is your key!
```

---

## Chamber 6: Context Window

### What AI Does
Models can only "see" limited text at once. Old information fades.
Like the hippocampus deciding what moves to long-term memory.

### Wicked Story Puzzle

```
Context window: 20 words max

[Part 1]: "The spell requires ELEKA NAHMEN which means fly in the ancient tongue remember"
[Part 2]: "this carefully because Glinda once told me that magic words must be"
[Part 3]: "spoken with pure intention and focus otherwise the spell will fail and"
[Part 4]: "you will remain grounded forever unable to soar above the emerald city"
...
[Part 8]: "Now speak the flying words from the beginning to unlock the sky"
```

If he didn't memorize ELEKA NAHMEN, he can't proceed.

### Italian Memory Chain

```
[Part 1]: "BUONGIORNO means good morning, GRAZIE means thank you, remember these"
[Part 2]: "... (filler about Italian culture) ..."
[Part 3]: "... (more filler) ..."
[Part 4]: "Now: What do you say when you wake up? Shift answer by 7."

BUONGIORNO shifted by 7:
B+7=I, U+7=B, O+7=V, N+7=U, G+7=N...
```

---

## Chamber 7: The Full Pipeline

### Combined Hadestown + Wicked + Math Challenge

```
STEP 1 — TOKENIZATION (BPE):
Text: "WAIT FOR ME COME HOME DEFYING GRAVITY"
Build tokenizer. Your 3rd merge = temperature setting.
If 3rd merge is "FY" → temp = position of F (6) ÷ 10 = 0.6

STEP 2 — ATTENTION:
"Orpheus turned to look ___ and lost everything"
Distribute 10 points.
Correct answer needs attention on "turned" + "look" + "lost"
Answer: BACK (or BEHIND)

STEP 3 — COORDINATES:
Plot BACK on the grid. Find distance to FORWARD.
Distance = Δ (delta), your Greek letter clue.
Δ = 5 means shift by 5.

STEP 4 — TEMPERATURE DECODE:
Using temp from Step 1, decode: "MFZWJ"
Scores for each position given. Calculate probabilities.
At temp 0.6, which letters win?

STEP 5 — WEIGHT TRAINING:
Train on Wicked lyrics sentiment.
"POPULAR" = ?, "WICKED" = ?, "GOOD" = ?
Final weights sum to your final shift.

STEP 6 — APPLY:
Take decoded message, apply final shift.
Factor the result (math!).
Prime factors spell the answer.

FINAL: [SECRET NEW YEAR MESSAGE]
```

---

## Sample Personalized Puzzle

**Hidden message:** KEEP DEFYING GRAVITY

### Step-by-Step Encryption

**Chamber 1: Tokenization**
```
Text: "SOMETHING HAS CHANGED WITHIN ME"

Pairs: SO:1, OM:1, ME:2, ET:1, TH:1, HI:2, IN:2, NG:1,
       G_:1, _H:1, HA:1, AS:1, S_:1, _C:1, CH:1, AN:1,
       NG:1, GE:1, ED:1, D_:1, _W:1, WI:1, IT:1, N_:1

Tied at 2: ME, HI, IN
First merge: ME (alphabetically first)
Second merge: HI
Third merge: IN

Third merge = IN = letters 9 and 14
Sum: 9 + 14 = 23
23 mod 10 = 3 → temperature = 0.3
```

**Chamber 2: Attention**
```
"The girl who couldn't be held ___ rose above them all"

Points:
- couldn't: 3 → resistance, unable
- held: 3 → trapped, contained
- rose: 3 → ascended, lifted
- above: 1 → up, over

Weighted blend: resistance + trapped + ascended = DOWN ✓
(She couldn't be held DOWN)
```

**Chamber 3: Coordinates**
```
DEFY at (8, 9)
OBEY at (2, 3)

Distance: √[(8-2)² + (9-3)²] = √[36+36] = √72 ≈ 8.49

Use √72 = 6√2
The root (√) is 2.
Factor: 72 = 8 × 9 = 2³ × 3²
Key = 8 (largest factor under 10)
```

**Chamber 4: Temperature**
```
At temp 0.3 from Chamber 1:

"For ___ I've relied on your protection"
Scores: GOOD=9, LONG=7, YEARS=4, EVER=3

Divide by 0.3: GOOD=30, LONG=23, YEARS=13, EVER=10
GOOD dominates → GOOD ✓

(Lyric: "For GOOD I've relied on your protection")
```

**Chamber 5: Weights**
```
Train on Wicked words:
EMERALD = +2 (after training)
WICKED = -1 (after training)
POPULAR = +3 (after training)
DEFYING = +4 (after training)
GRAVITY = +1 (after training)

Words with weight > 2: POPULAR, DEFYING
First letters: P, D

Binary of weights > 0: 11111 = 31
31 - 23 = 8 (confirms our key!)
```

**Chamber 6: Memory**
```
[Part 1]: "OTTO in Italian means eight, like OCTAVE on piano"
... (Hadestown lyrics as filler) ...
[Part 8]: "Use the Italian number from the start"

OTTO = 8 = shift key (triple confirmed!)
```

**Final decode:**
```
Encrypted: SKKV JKLÄPUN NYHCPAF

Shift back by 8:
S-8=K, K-8=E, K-8=E, V-8=P...
Wait, that's not right. Let me recalculate:

K+8=S, E+8=M...

Actually shift FORWARD by 8 to encrypt:
KEEP → SMMX (K+8=S, E+8=M, E+8=M, P+8=X)

To decrypt, shift BACK by 8:
SMMX → KEEP ✓
```

**Answer: KEEP DEFYING GRAVITY**

---

## Math Integration Ideas

### π Cipher
```
π = 3.1415926535...

Message: DREAM
D → shift by 3
R → shift by 1
E → shift by 4
A → shift by 1
M → shift by 5

DREAM → GSICR
```

### Factor Keys
```
Clue: "The key is hidden in the factors of 84"
84 = 2 × 2 × 3 × 7 = 4 × 21 = 12 × 7

Use factor pairs: (1,84), (2,42), (3,28), (4,21), (6,14), (7,12)
Pick the pair where both numbers are single-digit: (6,14)? No...
Pick factor sum: 7 + 12 = 19 = S (19th letter)
```

### Binary Messages
```
HOPE in binary (A=1, B=2...):
H=8=1000, O=15=1111, P=16=10000, E=5=101

Full binary: 1000 1111 10000 101

Count the 1s: 3 + 4 + 1 + 2 = 10
10 = J (10th letter) = next clue
```

### Σ (Sigma) Summation
```
Σ from i=1 to 4 of (letter position)

Word: LOVE
L=12, O=15, V=22, E=5
Σ = 12 + 15 + 22 + 5 = 54

54 mod 26 = 2 = B
```

---

## Italian Integration

### Basic Vocabulary (Duolingo Section 1)

```
CIAO = hello/goodbye
GRAZIE = thank you
BUONGIORNO = good morning
BUONASERA = good evening
ACQUA = water
LATTE = milk
PANE = bread
AMORE = love
BENE = good/well
SI = yes
NO = no
UNO, DUE, TRE = one, two, three
```

### Italian Cipher Puzzle
```
Clue: "Say thank you, then good morning, then water"

GRAZIE + BUONGIORNO + ACQUA

Take first letters: G + B + A = positions 7 + 2 + 1 = 10
Or: Count total letters: 6 + 10 + 5 = 21 = U
```

### Bilingual Attention
```
"AMORE means ___ in Italian"

Attention on AMORE (Italian word) + meaning
Answer: LOVE

"ACQUA sounds like the English word ___"
Answer: AQUA (cognate!)
```

---

## Visual Design Notes

### Aesthetic
- Dark emerald (Wicked) and underground bronze (Hadestown) palette
- Musical staff decorations
- Anatomical diagram sketches in margins
- Binary code watermarks
- π symbols scattered decoratively

### Chamber Themes
1. **Merge Game**: Emerald City tower, building upward
2. **Attention**: Spotlight on stage (musical theater)
3. **Coordinates**: Anatomical body map / muscle diagram
4. **Probability**: Dice, piano keys (black/white = probability)
5. **Weights**: Music equalizer sliders
6. **Context**: Train tracks disappearing (Hadestown railroad)
7. **Final**: All themes combined, vault door opening

---

## AI Models as Characters

Optional: Give each AI model a "personality" in the game:

**GPT-5.2**: The confident predictor. Always has an answer. Sometimes too sure.

**LLaMA-4**: The open one. Shows its work. Transparent about uncertainty.

**Claude**: The careful one. Thinks before speaking. Asks clarifying questions.

Each chamber could show how the three models would approach the same puzzle differently — teaching that different AI architectures have different strengths.

---

## Concepts Taught (Implicitly)

| Chamber | Mechanic | AI Concept | His Interest |
|---------|----------|------------|--------------|
| 1 | Counting & merging | BPE Tokenization | Wicked lyrics |
| 2 | Distributing points | Self-Attention | Hadestown story |
| 3 | Plotting & distance | Word Embeddings | Anatomy + Italian |
| 4 | Dividing & sampling | Temperature | AI models + π |
| 5 | Adjusting from error | Gradient Descent | Piano + binary |
| 6 | Limited memory | Context Window | Musical theater |
| 7 | Full pipeline | Transformer | Everything combined |

He never reads "this is how AI works." He plays with Wicked lyrics, calculates muscle distances, uses π for temperature, and trains on piano moods — and the AI understanding emerges naturally.
