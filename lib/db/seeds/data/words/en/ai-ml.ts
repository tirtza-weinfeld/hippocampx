import type { LexicalEntrySeed } from "../../dictionary";

/**
 * ai & Machine Learning Vocabulary Seed Data
 *
 * Based on transformer architecture documentation and 2026 SOTA.
 *
 * LaTeX conventions:
 * - Inline math delimited by $...$
 * - Matrices: \begin{bmatrix}...\end{bmatrix}
 * - Operators: \softmax, \text{}, \mathrm{}
 * - Greek: \theta, \sigma, \alpha, \beta
 *
 * Render with KaTeX.
 */

export const AI_ML_DATA: LexicalEntrySeed[] = [
  // ============================================================================
  // TRANSFORMER ARCHITECTURE - CORE
  // ============================================================================
  {
    lemma: "transformer",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A neural network architecture that processes sequences using self-attention to capture dependencies regardless of distance, replacing recurrence with parallelizable attention mechanisms.",
        difficulty: "intermediate",
        tags: ["ai", "deep-learning", "architecture"],
        examples: [
          {
            text: "The transformer maps token IDs through embedding, 48 attention+FFN layers, and output projection to produce next-token logits.",
          },
        ],
        relations: [
          { target_lemma: "attention", relation_type: "meronym" },
          { target_lemma: "feed-forward network", relation_type: "meronym" },
          { target_lemma: "embedding", relation_type: "meronym" },
        ],
      },
    ],
  },
  {
    lemma: "embedding",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A learned lookup table that maps discrete token IDs to continuous vectors, converting symbolic inputs into dense representations the network can process.",
        difficulty: "intermediate",
        tags: ["ai", "deep-learning"],
        examples: [
          {
            text: "Token 16425 ('mouse') maps to row 16425 in the embedding table, a 5,120-dimensional vector.",
          },
        ],
        relations: [
          { target_lemma: "token", relation_type: "hypernym" },
          { target_lemma: "vocabulary", relation_type: "holonym" },
        ],
        notations: [
          {
            type: "formula",
            value: "E \\in \\mathbb{R}^{V \\times d}",
          },
        ],
      },
    ],
  },
  {
    lemma: "token",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A discrete unit of text (word, subword, or character) assigned a unique integer ID from a fixed vocabulary, serving as the atomic input/output unit for language models.",
        difficulty: "beginner",
        tags: ["ai", "nlp"],
        examples: [
          {
            text: "'The cat saw the mouse' becomes [954, 10338, 13747, 290, 16425] after tokenization.",
          },
        ],
        relations: [
          { target_lemma: "vocabulary", relation_type: "holonym" },
          { target_lemma: "embedding", relation_type: "hyponym" },
        ],
      },
    ],
  },
  {
    lemma: "vocabulary",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The fixed set of all possible tokens a model can recognize, with each token assigned a unique integer ID from 0 to vocab_size-1.",
        difficulty: "beginner",
        tags: ["ai", "nlp"],
        examples: [
          {
            text: "Llama 4 uses a vocabulary of 202,048 tokens, including words, subwords, and special tokens.",
          },
        ],
        relations: [
          { target_lemma: "token", relation_type: "meronym" },
          { target_lemma: "tokenizer", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "logit",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A raw, unnormalized score output by a neural network before softmax, where higher values indicate higher predicted probability for that class or token.",
        difficulty: "intermediate",
        tags: ["ai", "deep-learning"],
        examples: [
          {
            text: "The model outputs 202,048 logits—one per vocabulary token. After softmax, 'ran' might have probability 0.3, 'hid' 0.25.",
          },
        ],
        relations: [
          { target_lemma: "softmax", relation_type: "analog" },
          { target_lemma: "probability", relation_type: "hyponym" },
        ],
      },
    ],
  },
  {
    lemma: "residual connection",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A skip connection that adds a layer's input directly to its output, enabling gradient flow through deep networks and allowing layers to learn incremental refinements.",
        difficulty: "intermediate",
        tags: ["ai", "deep-learning", "architecture"],
        examples: [
          {
            text: "After attention, the result is added to the input: $h = x + \\text{attention}(x)$.",
          },
        ],
        relations: [
          { target_lemma: "transformer", relation_type: "holonym" },
          { target_lemma: "gradient", relation_type: "analog" },
        ],
        notations: [{ type: "formula", value: "h = x + f(x)" }],
      },
    ],
  },
  {
    lemma: "RMSNorm",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Root Mean Square Layer Normalization—scales vectors so their root-mean-square equals 1, stabilizing training without centering (no mean subtraction).",
        difficulty: "advanced",
        tags: ["ai", "deep-learning", "normalization"],
        examples: [
          {
            text: "Before each sublayer, RMSNorm stabilizes activations: $\\text{RMSNorm}(x) \\to \\text{attention}$.",
          },
        ],
        relations: [
          { target_lemma: "layer normalization", relation_type: "hypernym" },
          { target_lemma: "transformer", relation_type: "holonym" },
        ],
        notations: [
          {
            type: "formula",
            value:
              "\\text{RMSNorm}(x) = \\frac{x}{\\sqrt{\\frac{1}{d}\\sum_{i=1}^d x_i^2}}",
          },
        ],
      },
    ],
  },

  // ============================================================================
  // ATTENTION MECHANISM
  // ============================================================================
  {
    lemma: "attention",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A mechanism where each position computes a weighted sum of all positions' values, with weights determined by query-key similarity scores passed through softmax.",
        difficulty: "intermediate",
        tags: ["ai", "deep-learning", "attention"],
        examples: [
          {
            text: "Position 4 ('mouse') attends 45% to position 1 ('cat'), 20% to 'saw', producing a context-aware representation.",
          },
        ],
        relations: [
          { target_lemma: "query", relation_type: "meronym" },
          { target_lemma: "key", relation_type: "meronym" },
          { target_lemma: "value", relation_type: "meronym" },
          { target_lemma: "softmax", relation_type: "meronym" },
        ],
        notations: [
          {
            type: "formula",
            value:
              "\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V",
          },
        ],
      },
    ],
  },
  {
    lemma: "query",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "In attention, a vector projected from each position that determines what information that position is looking for by computing dot products with keys.",
        difficulty: "intermediate",
        tags: ["ai", "attention"],
        examples: [
          {
            text: "$Q_4$ ('mouse') has high dot product with $K_1$ ('cat'), causing 'mouse' to attend strongly to 'cat'.",
          },
        ],
        relations: [
          { target_lemma: "key", relation_type: "analog" },
          { target_lemma: "attention", relation_type: "holonym" },
        ],
        notations: [{ type: "formula", value: "Q = xW_q" }],
      },
    ],
  },
  {
    lemma: "key",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "In attention, a vector projected from each position that advertises what information that position contains, matched against queries to compute attention weights.",
        difficulty: "intermediate",
        tags: ["ai", "attention"],
        examples: [
          {
            text: "Each position's key $K_i$ is compared against all queries via dot product to determine relevance.",
          },
        ],
        relations: [
          { target_lemma: "query", relation_type: "analog" },
          { target_lemma: "attention", relation_type: "holonym" },
        ],
        notations: [{ type: "formula", value: "K = xW_k" }],
      },
    ],
  },
  {
    lemma: "value",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "In attention, a vector projected from each position containing the actual information to be aggregated, weighted by attention scores and summed.",
        difficulty: "intermediate",
        tags: ["ai", "attention"],
        examples: [
          {
            text: "Output for position 4 is $0.45 \\cdot V_1 + 0.20 \\cdot V_2 + ...$—a weighted mix of all values.",
          },
        ],
        relations: [
          { target_lemma: "query", relation_type: "analog" },
          { target_lemma: "attention", relation_type: "holonym" },
        ],
        notations: [{ type: "formula", value: "V = xW_v" }],
      },
    ],
  },
  {
    lemma: "multi-head attention",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Attention run in parallel across multiple 'heads', each operating on a different learned subspace, then concatenated and projected to mix across heads.",
        difficulty: "advanced",
        tags: ["ai", "deep-learning", "attention"],
        examples: [
          {
            text: "Llama 4 uses 40 heads, each on 128 dims. One head might track syntax, another semantics, another coreference.",
          },
        ],
        relations: [
          { target_lemma: "attention", relation_type: "hypernym" },
          { target_lemma: "attention head", relation_type: "meronym" },
        ],
        notations: [
          {
            type: "formula",
            value:
              "\\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1,...,\\text{head}_h)W_o",
          },
        ],
      },
    ],
  },
  {
    lemma: "attention head",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "One parallel attention computation in multi-head attention, operating on a subset of dimensions with its own learned Q, K, V projections.",
        difficulty: "advanced",
        tags: ["ai", "attention"],
        examples: [
          {
            text: "Head 0 operates on dimensions 0-127, head 1 on 128-255, each learning different attention patterns.",
          },
        ],
        relations: [
          { target_lemma: "multi-head attention", relation_type: "holonym" },
        ],
      },
    ],
  },
  {
    lemma: "grouped query attention",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "An efficient attention variant where multiple query heads share the same key and value heads, reducing KV cache memory while maintaining model quality.",
        difficulty: "advanced",
        tags: ["ai", "attention", "efficiency"],
        examples: [
          {
            text: "Llama 4 uses 40 Q heads but only 8 K/V heads—groups of 5 Q heads share one K/V head, reducing cache by 5×.",
          },
        ],
        relations: [
          { target_lemma: "multi-head attention", relation_type: "hypernym" },
          { target_lemma: "KV cache", relation_type: "analog" },
        ],
      },
    ],
    metadata: { abbreviation: "GQA" },
  },
  {
    lemma: "KV cache",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A memory buffer storing previously computed key and value tensors during autoregressive generation, avoiding O(n²) recomputation by caching O(n) values.",
        difficulty: "advanced",
        tags: ["ai", "efficiency", "inference"],
        examples: [
          {
            text: "After processing 'The cat', K and V are cached. For 'ran', only new K/V is computed; cached values are reused.",
          },
        ],
        relations: [
          { target_lemma: "attention", relation_type: "holonym" },
          {
            target_lemma: "autoregressive",
            target_pos: "adjective",
            relation_type: "analog",
          },
        ],
        notations: [
          {
            type: "formula",
            value:
              "\\text{cache}[\\text{batch}, \\text{seq}, \\text{heads}, \\text{dim}]",
          },
        ],
      },
    ],
  },
  {
    lemma: "causal mask",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "An attention mask that prevents positions from attending to future positions, enforcing autoregressive generation where each token only sees preceding context.",
        difficulty: "intermediate",
        tags: ["ai", "attention"],
        examples: [
          {
            text: "Position 2 can attend to positions 0, 1, 2 but not 3, 4—future tokens are masked to $-\\infty$ before softmax.",
          },
        ],
        relations: [
          { target_lemma: "attention", relation_type: "holonym" },
          {
            target_lemma: "autoregressive",
            target_pos: "adjective",
            relation_type: "analog",
          },
        ],
      },
    ],
  },
  {
    lemma: "softmax",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A function that converts a vector of real numbers into a probability distribution, exponentiating each value then normalizing so outputs sum to 1.",
        difficulty: "intermediate",
        tags: ["ai", "deep-learning", "activation"],
        examples: [
          {
            text: "Attention scores [0.1, 0.8, 0.6] become weights [0.15, 0.40, 0.30, ...] summing to 1 after softmax.",
          },
        ],
        relations: [
          { target_lemma: "attention", relation_type: "holonym" },
          { target_lemma: "probability", relation_type: "hyponym" },
        ],
        notations: [
          {
            type: "formula",
            value: "\\text{softmax}(x_i) = \\frac{e^{x_i}}{\\sum_j e^{x_j}}",
          },
        ],
      },
    ],
  },

  // ============================================================================
  // POSITION ENCODING - RoPE
  // ============================================================================
  {
    lemma: "positional encoding",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A mechanism to inject position information into sequence representations, since attention is permutation-invariant and cannot distinguish token order without it.",
        difficulty: "intermediate",
        tags: ["ai", "attention", "architecture"],
        examples: [
          {
            text: "Without positional encoding, 'cat chased mouse' and 'mouse chased cat' would produce identical attention patterns.",
          },
        ],
        relations: [
          { target_lemma: "RoPE", relation_type: "hyponym" },
          { target_lemma: "attention", relation_type: "holonym" },
        ],
      },
    ],
  },
  {
    lemma: "RoPE",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Rotary Position Embedding—encodes position by rotating Q and K vectors in 2D planes, where the rotation angle is proportional to position, causing dot products to encode relative distance.",
        difficulty: "advanced",
        tags: ["ai", "attention", "position-encoding"],
        examples: [
          {
            text: "Position 4 rotates $Q$ by $4\\theta$, position 1 rotates $K$ by $\\theta$. Their dot product sees angle difference $3\\theta$—the relative distance.",
          },
        ],
        relations: [
          { target_lemma: "positional encoding", relation_type: "hypernym" },
          { target_lemma: "relative position", relation_type: "analog" },
        ],
        notations: [
          {
            type: "formula",
            value:
              "R_\\theta = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}",
          },
        ],
      },
    ],
    metadata: { full_name: "Rotary Position Embedding" },
  },
  {
    lemma: "relative position",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The distance between two positions in a sequence, as opposed to absolute position. Relative encoding ensures '3 tokens apart' produces consistent attention regardless of absolute positions.",
        difficulty: "intermediate",
        tags: ["ai", "attention"],
        examples: [
          {
            text: "Positions (4,1) and (100,97) are both 3 apart—RoPE produces identical angular difference for both pairs.",
          },
        ],
        relations: [
          { target_lemma: "RoPE", relation_type: "holonym" },
          { target_lemma: "absolute position", relation_type: "antonym" },
        ],
      },
    ],
  },
  {
    lemma: "iRoPE",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Interleaved RoPE—alternates between RoPE layers (local attention within chunks) and NoPE layers (global attention without position encoding) for long-context stability.",
        difficulty: "advanced",
        tags: ["ai", "attention", "long-context"],
        examples: [
          {
            text: "Llama 4 uses iRoPE: layers 0-2 use RoPE with chunked masks, layer 3 is NoPE with global attention, then repeats.",
          },
        ],
        relations: [
          { target_lemma: "RoPE", relation_type: "hypernym" },
          { target_lemma: "NoPE", relation_type: "meronym" },
        ],
      },
    ],
    metadata: { full_name: "Interleaved RoPE" },
  },
  {
    lemma: "NoPE",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "No Position Encoding—attention layers without positional encoding that provide global attention across the full sequence, serving as anchor points in iRoPE architectures.",
        difficulty: "advanced",
        tags: ["ai", "attention", "long-context"],
        examples: [
          {
            text: "NoPE layers see the full 128K context without position noise, but cannot distinguish how far apart tokens are.",
          },
        ],
        relations: [
          { target_lemma: "iRoPE", relation_type: "holonym" },
          { target_lemma: "RoPE", relation_type: "antonym" },
        ],
      },
    ],
  },
  {
    lemma: "freqs_cis",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A precomputed lookup table of rotation angles as complex numbers (cis = cos + i·sin), enabling efficient RoPE application via complex multiplication.",
        difficulty: "advanced",
        tags: ["ai", "implementation"],
        examples: [
          {
            text: "freqs_cis[position=1, pair=0] might store $0.71 + 0.71i$ ($45°$ rotation), ready for direct multiplication.",
          },
        ],
        relations: [{ target_lemma: "RoPE", relation_type: "holonym" }],
        notations: [
          {
            type: "formula",
            value: "\\text{cis}(\\theta) = \\cos\\theta + i\\sin\\theta",
          },
        ],
      },
    ],
  },

  // ============================================================================
  // FEED-FORWARD NETWORKS & MOE
  // ============================================================================
  {
    lemma: "feed-forward network",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A position-wise MLP in transformers that processes each token independently, typically expanding to higher dimensions, applying nonlinearity, then projecting back.",
        difficulty: "intermediate",
        tags: ["ai", "deep-learning", "architecture"],
        examples: [
          {
            text: "Each token's 5,120-dim vector expands to 13,824 dims via W1/W3, applies SwiGLU, then projects back via W2.",
          },
        ],
        relations: [
          { target_lemma: "transformer", relation_type: "holonym" },
          { target_lemma: "SwiGLU", relation_type: "meronym" },
          { target_lemma: "mixture of experts", relation_type: "hyponym" },
        ],
      },
    ],
    metadata: { abbreviation: "FFN" },
  },
  {
    lemma: "SwiGLU",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Swish-Gated Linear Unit—an activation combining SiLU (Swish) with gating: applies SiLU to one projection, element-wise multiplies with another projection, providing smooth, learnable nonlinearity.",
        difficulty: "advanced",
        tags: ["ai", "activation", "architecture"],
        examples: [
          {
            text: "$\\text{SwiGLU}(x) = \\text{SiLU}(xW_1) \\odot (xW_3)$—gate B controls which dimensions of activated A pass through.",
          },
        ],
        relations: [
          { target_lemma: "SiLU", relation_type: "meronym" },
          { target_lemma: "feed-forward network", relation_type: "holonym" },
        ],
        notations: [
          { type: "formula", value: "\\text{SiLU}(xW_1) \\odot (xW_3)" },
        ],
      },
    ],
  },
  {
    lemma: "SiLU",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Sigmoid Linear Unit (also called Swish)—a smooth activation function that multiplies input by its sigmoid, providing self-gated nonlinearity.",
        difficulty: "advanced",
        tags: ["ai", "activation"],
        examples: [
          {
            text: "For positive x, sigmoid(x) ≈ 1, so SiLU(x) ≈ x. For negative x, sigmoid(x) ≈ 0, so SiLU(x) ≈ 0.",
          },
        ],
        relations: [
          { target_lemma: "SwiGLU", relation_type: "holonym" },
          { target_lemma: "ReLU", relation_type: "analog" },
        ],
        notations: [
          { type: "formula", value: "\\text{SiLU}(x) = x \\cdot \\sigma(x)" },
        ],
      },
    ],
    metadata: { alias: "Swish" },
  },
  {
    lemma: "mixture of experts",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "An architecture replacing single FFN with multiple parallel 'expert' FFNs, where a router selects which experts process each token, enabling massive capacity with sparse activation.",
        difficulty: "advanced",
        tags: ["ai", "architecture", "efficiency"],
        examples: [
          {
            text: "Maverick has 128 experts per MoE layer but activates only 2 per token (shared + 1 routed)—400B params, 17B active.",
          },
        ],
        relations: [
          { target_lemma: "feed-forward network", relation_type: "hypernym" },
          { target_lemma: "expert", relation_type: "meronym" },
          { target_lemma: "router", relation_type: "meronym" },
        ],
      },
    ],
    metadata: { abbreviation: "MoE" },
  },
  {
    lemma: "expert",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "One FFN within a mixture of experts layer, with its own learned weights. Experts specialize during training—some for code, others for math, conversation, etc.",
        difficulty: "advanced",
        tags: ["ai", "architecture"],
        examples: [
          {
            text: "Expert 47 might specialize in code tokens while expert 12 handles conversational language.",
          },
        ],
        relations: [
          { target_lemma: "mixture of experts", relation_type: "holonym" },
          { target_lemma: "router", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "router",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A learned linear layer in MoE that scores each expert for a given token, selecting top-k experts via softmax or sigmoid gating.",
        difficulty: "advanced",
        tags: ["ai", "architecture"],
        examples: [
          {
            text: "Router projects token to $[1 \\times 128]$ scores, applies sigmoid, selects top-1 expert weighted by its score.",
          },
        ],
        relations: [
          { target_lemma: "mixture of experts", relation_type: "holonym" },
          { target_lemma: "expert", relation_type: "analog" },
        ],
        notations: [
          {
            type: "formula",
            value:
              "\\text{scores} = \\sigma(x \\cdot W_{\\text{router}}), \\quad \\text{select top-}k",
          },
        ],
      },
    ],
  },
  {
    lemma: "shared expert",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "In MoE architectures, an expert that processes every token regardless of routing, providing baseline capacity while routed experts add specialized knowledge.",
        difficulty: "advanced",
        tags: ["ai", "architecture"],
        examples: [
          {
            text: "$\\text{output} = \\text{shared\\_expert}(x) + w \\cdot \\text{routed\\_expert}(x)$. Shared handles common patterns, routed adds specialization.",
          },
        ],
        relations: [
          { target_lemma: "mixture of experts", relation_type: "holonym" },
          { target_lemma: "expert", relation_type: "hypernym" },
        ],
      },
    ],
  },
  {
    lemma: "active parameters",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The subset of model parameters actually used to process a given token, much smaller than total parameters in sparse architectures like MoE.",
        difficulty: "intermediate",
        tags: ["ai", "efficiency"],
        examples: [
          {
            text: "Llama 4 Maverick: 400B total params, but only 17B active per token due to sparse expert selection.",
          },
        ],
        relations: [
          { target_lemma: "mixture of experts", relation_type: "analog" },
          { target_lemma: "sparse activation", relation_type: "analog" },
        ],
      },
    ],
  },

  // ============================================================================
  // 2026 SOTA - ARCHITECTURES & TECHNIQUES
  // ============================================================================
  {
    lemma: "autoregressive",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "A generation paradigm where each output token is conditioned on all previous tokens, producing sequences one token at a time from left to right.",
        difficulty: "intermediate",
        tags: ["ai", "generation"],
        examples: [
          {
            text: "Autoregressive LLMs generate 'The → cat → sat' sequentially, each token conditioned on prior context.",
          },
        ],
        relations: [
          { target_lemma: "causal mask", relation_type: "analog" },
          { target_lemma: "KV cache", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "context length",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The maximum number of tokens a model can process in a single forward pass, determining how much text it can 'see' at once.",
        difficulty: "beginner",
        tags: ["ai"],
        examples: [
          {
            text: "Llama 4 Scout supports 128K context (about 100K words), enabling full-book comprehension in one pass.",
          },
        ],
        relations: [
          { target_lemma: "KV cache", relation_type: "analog" },
          {
            target_lemma: "long-context",
            target_pos: "adjective",
            relation_type: "analog",
          },
        ],
      },
    ],
  },
  {
    lemma: "long-context",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "Models or techniques designed to handle sequences far beyond traditional limits (>32K tokens), requiring innovations in attention, position encoding, and memory.",
        difficulty: "intermediate",
        tags: ["ai"],
        examples: [
          {
            text: "Long-context models in 2026 routinely handle 1M+ tokens via sparse attention, iRoPE, and efficient KV cache.",
          },
        ],
        relations: [
          { target_lemma: "iRoPE", relation_type: "hyponym" },
          { target_lemma: "context length", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "sparse attention",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Attention patterns that attend to a subset of positions rather than all positions, reducing O(n²) complexity for long sequences.",
        difficulty: "advanced",
        tags: ["ai", "efficiency", "attention"],
        examples: [
          {
            text: "Local + global sparse attention: attend densely to nearby tokens, sparsely to distant ones, enabling 1M+ context.",
          },
        ],
        relations: [
          { target_lemma: "attention", relation_type: "hypernym" },
          {
            target_lemma: "long-context",
            target_pos: "adjective",
            relation_type: "analog",
          },
        ],
      },
    ],
  },
  {
    lemma: "speculative decoding",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "An inference acceleration technique using a small draft model to propose multiple tokens, verified in parallel by the large model, reducing latency for matching predictions.",
        difficulty: "advanced",
        tags: ["ai", "inference", "efficiency"],
        examples: [
          {
            text: "Draft model proposes 'cat sat on the', large model verifies all 4 in one pass—3× faster when predictions match.",
          },
        ],
        relations: [
          { target_lemma: "inference", relation_type: "analog" },
          { target_lemma: "draft model", relation_type: "meronym" },
        ],
      },
    ],
  },
  {
    lemma: "quantization",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Reducing model precision from 32/16-bit to 8/4-bit representations, dramatically shrinking memory and compute requirements with minimal quality loss.",
        difficulty: "intermediate",
        tags: ["ai", "efficiency", "deployment"],
        examples: [
          {
            text: "4-bit quantization reduces a 400B model from 800GB to 200GB, enabling consumer GPU deployment.",
          },
        ],
        relations: [
          { target_lemma: "inference", relation_type: "analog" },
          { target_lemma: "precision", relation_type: "analog" },
        ],
      },
    ],
  },

  // ============================================================================
  // 2026 SOTA - TRaiNING & ALIGNMENT
  // ============================================================================
  {
    lemma: "pretraining",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The initial phase of training LLMs on massive text corpora using next-token prediction, learning general language patterns before task-specific fine-tuning.",
        difficulty: "intermediate",
        tags: ["ai", "training"],
        examples: [
          {
            text: "Pretraining on 15T tokens teaches the model grammar, facts, and reasoning patterns before alignment.",
          },
        ],
        relations: [
          { target_lemma: "fine-tuning", relation_type: "analog" },
          { target_lemma: "RLHF", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "fine-tuning",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Continued training on curated datasets to adapt a pretrained model for specific tasks, formats, or behaviors.",
        difficulty: "intermediate",
        tags: ["ai", "training"],
        examples: [
          {
            text: "Instruction fine-tuning on Q&A pairs teaches the model to follow user requests rather than just complete text.",
          },
        ],
        relations: [
          { target_lemma: "pretraining", relation_type: "analog" },
          { target_lemma: "RLHF", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "RLHF",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Reinforcement Learning from Human Feedback—training models using human preference comparisons to optimize for helpfulness, harmlessness, and honesty.",
        difficulty: "advanced",
        tags: ["ai", "alignment", "training"],
        examples: [
          {
            text: "Humans rank model responses; a reward model learns these preferences; the LLM is optimized via PPO to maximize reward.",
          },
        ],
        relations: [
          { target_lemma: "reward model", relation_type: "meronym" },
          { target_lemma: "DPO", relation_type: "analog" },
          { target_lemma: "alignment", relation_type: "analog" },
        ],
      },
    ],
    metadata: { full_name: "Reinforcement Learning from Human Feedback" },
  },
  {
    lemma: "DPO",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Direct Preference Optimization—a simpler alternative to RLHF that directly optimizes the policy from preference pairs without training a separate reward model.",
        difficulty: "advanced",
        tags: ["ai", "alignment", "training"],
        examples: [
          {
            text: "DPO treats preference data as implicit reward, training the LLM directly to prefer chosen over rejected responses.",
          },
        ],
        relations: [
          { target_lemma: "RLHF", relation_type: "analog" },
          { target_lemma: "alignment", relation_type: "analog" },
        ],
      },
    ],
    metadata: { full_name: "Direct Preference Optimization" },
  },
  {
    lemma: "reward model",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A model trained on human preference data to score LLM outputs, providing the reward signal for RLHF training.",
        difficulty: "advanced",
        tags: ["ai", "alignment"],
        examples: [
          {
            text: "The reward model learns from 100K human comparisons, then scores millions of LLM outputs to guide policy training.",
          },
        ],
        relations: [
          { target_lemma: "RLHF", relation_type: "holonym" },
          { target_lemma: "preference data", relation_type: "meronym" },
        ],
      },
    ],
  },
  {
    lemma: "alignment",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The process of training ai systems to behave according to human values and intentions, ensuring helpfulness while avoiding harmful outputs.",
        difficulty: "intermediate",
        tags: ["ai", "safety"],
        examples: [
          {
            text: "Alignment combines instruction tuning, RLHF, and constitutional ai to make models helpful, harmless, and honest.",
          },
        ],
        relations: [
          { target_lemma: "RLHF", relation_type: "hyponym" },
          { target_lemma: "DPO", relation_type: "hyponym" },
        ],
      },
    ],
  },
  {
    lemma: "constitutional ai",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "An alignment approach where models critique and revise their own outputs according to a set of principles (constitution), reducing reliance on human feedback.",
        difficulty: "advanced",
        tags: ["ai", "alignment"],
        examples: [
          {
            text: "The model generates a response, critiques it against 'be helpful and harmless' principles, then revises—self-improving alignment.",
          },
        ],
        relations: [
          { target_lemma: "RLHF", relation_type: "analog" },
          { target_lemma: "alignment", relation_type: "hypernym" },
        ],
      },
    ],
  },

  // ============================================================================
  // 2026 SOTA - CAPABILITIES & MODALITIES
  // ============================================================================
  {
    lemma: "chain-of-thought",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A prompting technique that elicits step-by-step reasoning from LLMs, dramatically improving performance on complex tasks like math and logic.",
        difficulty: "intermediate",
        tags: ["ai", "prompting", "reasoning"],
        examples: [
          {
            text: "'Let's think step by step' triggers explicit reasoning: 'First calculate X, then Y, therefore Z.'",
          },
        ],
        relations: [
          { target_lemma: "reasoning", relation_type: "analog" },
          { target_lemma: "prompting", relation_type: "hypernym" },
        ],
      },
    ],
    metadata: { abbreviation: "CoT" },
  },
  {
    lemma: "reasoning model",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "LLMs specifically trained for complex reasoning tasks, using techniques like process supervision and test-time compute scaling to solve math, code, and logic problems.",
        difficulty: "advanced",
        tags: ["ai"],
        examples: [
          {
            text: "Reasoning models like o1/o3 spend more inference compute on hard problems, achieving expert-level math performance.",
          },
        ],
        relations: [
          { target_lemma: "chain-of-thought", relation_type: "hyponym" },
          { target_lemma: "test-time compute", relation_type: "hyponym" },
        ],
      },
    ],
  },
  {
    lemma: "test-time compute",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Scaling inference-time computation (more tokens, search, verification) to improve output quality, as opposed to scaling training compute.",
        difficulty: "advanced",
        tags: ["ai", "scaling"],
        examples: [
          {
            text: "Test-time compute lets models 'think longer' on hard problems—generating 10K reasoning tokens instead of 100.",
          },
        ],
        relations: [
          { target_lemma: "reasoning model", relation_type: "hypernym" },
          { target_lemma: "inference", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "multimodal",
    part_of_speech: "adjective",
    language_code: "en",
    senses: [
      {
        definition:
          "Models that process and generate multiple data types (text, images, audio, video) through unified architectures, enabling cross-modal understanding.",
        difficulty: "intermediate",
        tags: ["ai"],
        examples: [
          {
            text: "Multimodal models convert images to tokens via vision encoders, processing them alongside text in the same transformer.",
          },
        ],
        relations: [
          { target_lemma: "vision encoder", relation_type: "meronym" },
          { target_lemma: "cross-modal", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "vision encoder",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A component that converts images into token-like representations compatible with language model processing, typically using ViT or CNN architectures.",
        difficulty: "advanced",
        tags: ["ai", "multimodal", "architecture"],
        examples: [
          {
            text: "ViT patches a $256 \\times 256$ image into $16 \\times 16$ patches, encoding each as a 'visual token' for the transformer.",
          },
        ],
        relations: [
          {
            target_lemma: "multimodal",
            target_pos: "adjective",
            relation_type: "holonym",
          },
          { target_lemma: "transformer", relation_type: "holonym" },
        ],
      },
    ],
  },
  {
    lemma: "tool",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The capability of LLMs to invoke external tools (calculators, search engines, APIs, code interpreters) to extend their abilities beyond pure text generation.",
        difficulty: "intermediate",
        tags: ["ai"],
        examples: [
          {
            text: "When asked '$2^{100}$', the model calls a calculator tool rather than approximating, returning the exact 31-digit result.",
          },
        ],
        relations: [
          { target_lemma: "function calling", relation_type: "synonym" },
          { target_lemma: "agent", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "agent",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "An ai system that autonomously plans and executes multi-step tasks, using tools, memory, and reasoning to achieve goals with minimal human intervention.",
        difficulty: "intermediate",
        tags: ["ai"],
        examples: [
          {
            text: "A coding agent reads requirements, writes code, runs tests, debugs failures, and iterates until tests pass.",
          },
        ],
        relations: [
          { target_lemma: "tool", relation_type: "hyponym" },
          { target_lemma: "planning", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "in-context learning",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The ability of LLMs to learn new tasks from examples provided in the prompt, without updating model weights.",
        difficulty: "intermediate",
        tags: ["ai"],
        examples: [
          {
            text: "Given 3 translation examples in the prompt, the model translates new sentences in the same style—no fine-tuning needed.",
          },
        ],
        relations: [
          { target_lemma: "few-shot learning", relation_type: "synonym" },
          { target_lemma: "prompting", relation_type: "hypernym" },
        ],
      },
    ],
    metadata: { abbreviation: "ICL" },
  },
  {
    lemma: "hallucination",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "When an LLM generates plausible-sounding but factually incorrect or fabricated information, a key challenge in deploying language models.",
        difficulty: "beginner",
        tags: ["ai", "safety", "limitation"],
        examples: [
          {
            text: "The model confidently cites a paper that doesn't exist—a hallucination requiring grounding or RAG to prevent.",
          },
        ],
        relations: [
          { target_lemma: "RAG", relation_type: "antonym" },
          { target_lemma: "grounding", relation_type: "antonym" },
        ],
      },
    ],
  },
  {
    lemma: "RAG",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Retrieval-Augmented Generation—augmenting LLM prompts with relevant documents retrieved from a knowledge base, grounding responses in factual sources.",
        difficulty: "intermediate",
        tags: ["ai", "architecture"],
        examples: [
          {
            text: "RAG retrieves 5 relevant docs for the query, injects them into context, reducing hallucination and enabling current info.",
          },
        ],
        relations: [
          { target_lemma: "hallucination", relation_type: "antonym" },
          { target_lemma: "vector database", relation_type: "meronym" },
        ],
      },
    ],
    metadata: { full_name: "Retrieval-Augmented Generation" },
  },

  // ============================================================================
  // MATHEMATICAL FOUNDATIONS
  // ============================================================================
  {
    lemma: "dot product",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The sum of element-wise products of two vectors, measuring similarity—higher values indicate vectors point in similar directions.",
        difficulty: "beginner",
        tags: ["ai", "math", "linear-algebra"],
        examples: [
          {
            text: "Query-key dot product: $Q \\cdot K = \\sum_i q_i k_i$. High score means Q and K are similar, so attend strongly.",
          },
        ],
        relations: [
          { target_lemma: "attention", relation_type: "holonym" },
          { target_lemma: "cosine similarity", relation_type: "analog" },
        ],
        notations: [
          { type: "formula", value: "a \\cdot b = \\sum_{i=1}^n a_i b_i" },
        ],
      },
    ],
  },
  {
    lemma: "matrix multiplication",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The operation combining two matrices where each output element is the dot product of a row from the first matrix and column from the second.",
        difficulty: "beginner",
        tags: ["ai", "math", "linear-algebra"],
        examples: [
          {
            text: "$[1 \\times 5120] \\cdot [5120 \\times 202048] = [1 \\times 202048]$—one token projected to vocabulary logits.",
          },
        ],
        relations: [
          { target_lemma: "linear projection", relation_type: "hyponym" },
        ],
        notations: [
          { type: "formula", value: "(AB)_{ij} = \\sum_k A_{ik}B_{kj}" },
        ],
      },
    ],
  },
  {
    lemma: "element-wise product",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Multiplication of two tensors element by element, requiring identical shapes. Used in gating mechanisms like SwiGLU.",
        difficulty: "intermediate",
        tags: ["ai", "math"],
        examples: [
          {
            text: "SwiGLU: $\\text{SiLU}(A) \\odot B$—each dimension of activated A is scaled by corresponding dimension of gate B.",
          },
        ],
        relations: [
          { target_lemma: "SwiGLU", relation_type: "holonym" },
          { target_lemma: "gating", relation_type: "analog" },
        ],
        notations: [
          { type: "formula", value: "(A \\odot B)_i = A_i \\cdot B_i" },
        ],
      },
    ],
    metadata: { alias: "Hadamard product" },
  },
  {
    lemma: "complex number",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A number with real and imaginary parts (a + bi), used in RoPE to represent 2D rotations efficiently via complex multiplication.",
        difficulty: "intermediate",
        tags: ["ai", "math"],
        examples: [
          {
            text: "RoPE converts $(3, 4)$ to $3+4i$, multiplies by rotation $0.71+0.71i$, getting new coordinates from the result.",
          },
        ],
        relations: [
          { target_lemma: "RoPE", relation_type: "holonym" },
          { target_lemma: "rotation", relation_type: "analog" },
        ],
        notations: [
          { type: "formula", value: "z = a + bi, \\quad i^2 = -1" },
          {
            type: "formula",
            value: "e^{i\\theta} = \\cos\\theta + i\\sin\\theta",
          },
        ],
      },
    ],
  },
  {
    lemma: "gradient",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The vector of partial derivatives indicating the direction of steepest increase of a function, used in backpropagation to update model weights.",
        difficulty: "intermediate",
        tags: ["ai", "math", "training"],
        examples: [
          {
            text: "Gradient descent: $w \\leftarrow w - \\eta \\nabla L$. Move weights opposite to loss gradient to minimize error.",
          },
        ],
        relations: [
          { target_lemma: "backpropagation", relation_type: "analog" },
          { target_lemma: "loss function", relation_type: "analog" },
        ],
        notations: [
          {
            type: "formula",
            value:
              "\\nabla f = \\left( \\frac{\\partial f}{\\partial x_1}, ..., \\frac{\\partial f}{\\partial x_n} \\right)",
          },
        ],
      },
    ],
  },
  {
    lemma: "backpropagation",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The algorithm for computing gradients through a neural network by applying the chain rule backwards from loss to parameters.",
        difficulty: "intermediate",
        tags: ["ai", "training"],
        examples: [
          {
            text: "Loss at output propagates gradients back through 48 layers via chain rule, computing ∂L/∂w for every weight.",
          },
        ],
        relations: [
          { target_lemma: "gradient", relation_type: "analog" },
          { target_lemma: "training", relation_type: "hypernym" },
        ],
      },
    ],
  },
];
