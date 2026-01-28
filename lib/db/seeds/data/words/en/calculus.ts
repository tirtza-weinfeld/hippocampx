import type { LexicalEntrySeed } from "../../dictionary";

/**
 * Calculus Vocabulary Seed Data
 *
 * LaTeX conventions:
 * - Inline math delimited by $...$
 * - Fractions: \frac{a}{b}
 * - Limits: \lim_{x \to a}
 * - Derivatives: \frac{d}{dx}, \frac{dy}{dx}, f'(x)
 * - Integrals: \int, \int_a^b
 * - Greek: \Delta, \delta, \epsilon, \pi, \sigma, \theta, \lambda
 * - Spacing in integrals: \, before dx
 *
 * Render with KaTeX.
 */

export const CALCULUS_DATA: LexicalEntrySeed[] = [
  // ============================================================================
  // FOUNDATIONS
  // ============================================================================
  {
    lemma: "slope",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The ratio of vertical change to horizontal change between two points on a line, measuring its steepness.",
        difficulty: "beginner",
        tags: ["calculus", "algebra"],
        examples: [
          {
            text: "A line through $(1, 2)$ and $(4, 8)$ has slope $\\frac{8-2}{4-1} = 2$.",
          },
        ],
        relations: [
          { target_lemma: "derivative", relation_type: "hyponym" },
          { target_lemma: "tangent line", relation_type: "meronym" },
        ],
        notations: [
          { type: "formula", value: "m = \\frac{y_2 - y_1}{x_2 - x_1}" },
          { type: "formula", value: "m = \\frac{\\Delta y}{\\Delta x}" },
        ],
      },
    ],
  },
  {
    lemma: "function",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A rule that assigns exactly one output to each input from a given domain.",
        difficulty: "beginner",
        tags: ["calculus"],
        examples: [
          {
            text: "$f(x) = x^2$ assigns $9$ to input $3$, and $9$ to input $-3$.",
          },
        ],
        relations: [
          { target_lemma: "domain", relation_type: "meronym" },
          { target_lemma: "range", relation_type: "meronym" },
        ],
        notations: [
          { type: "formula", value: "f: X \\to Y" },
          { type: "formula", value: "y = f(x)" },
        ],
      },
    ],
  },
  {
    lemma: "domain",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "The set of all valid input values for a function.",
        difficulty: "beginner",
        tags: ["calculus"],
        examples: [
          {
            text: "For $f(x) = \\sqrt{x}$, the domain is $[0, \\infty)$ since square roots of negatives are undefined in $\\mathbb{R}$.",
          },
        ],
        relations: [
          { target_lemma: "function", relation_type: "holonym" },
          { target_lemma: "range", relation_type: "analog" },
        ],
      },
    ],
  },
  {
    lemma: "range",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The set of all output values that a function actually produces.",
        difficulty: "beginner",
        tags: ["calculus"],
        examples: [
          {
            text: "For $f(x) = x^2$, the range is $[0, \\infty)$ since squares are never negative.",
          },
        ],
        relations: [
          { target_lemma: "function", relation_type: "holonym" },
          { target_lemma: "domain", relation_type: "analog" },
        ],
      },
    ],
  },

  // ============================================================================
  // FUNCTION TYPES
  // ============================================================================
  {
    lemma: "linear function",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A first-degree polynomial function that graphs as a straight line.",
        difficulty: "beginner",
        tags: ["calculus", "functions"],
        examples: [
          {
            text: "$f(x) = 3x - 2$ has slope $3$ and $y$-intercept $-2$.",
          },
        ],
        relations: [
          { target_lemma: "slope", relation_type: "meronym" },
          { target_lemma: "quadratic function", relation_type: "analog" },
        ],
        notations: [{ type: "formula", value: "f(x) = mx + b" }],
      },
    ],
  },
  {
    lemma: "quadratic function",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A second-degree polynomial function that graphs as a parabola.",
        difficulty: "beginner",
        tags: ["calculus", "functions"],
        examples: [
          {
            text: "$f(x) = x^2 - 4x + 3$ has roots at $x = 1$ and $x = 3$, vertex at $(2, -1)$.",
          },
        ],
        relations: [
          { target_lemma: "linear function", relation_type: "analog" },
          { target_lemma: "polynomial", relation_type: "hypernym" },
        ],
        notations: [
          { type: "formula", value: "f(x) = ax^2 + bx + c" },
          { type: "formula", value: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
        ],
      },
    ],
  },
  {
    lemma: "polynomial",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A function consisting of terms with non-negative integer powers of the variable.",
        difficulty: "beginner",
        tags: ["calculus", "functions"],
        examples: [
          {
            text: "$p(x) = 2x^3 - x^2 + 4x - 7$ is a cubic polynomial.",
          },
        ],
        relations: [
          { target_lemma: "quadratic function", relation_type: "hyponym" },
          { target_lemma: "linear function", relation_type: "hyponym" },
        ],
        notations: [
          {
            type: "formula",
            value: "p(x) = a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_1 x + a_0",
          },
        ],
      },
    ],
  },
  {
    lemma: "exponential function",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A function where the variable appears in the exponent, exhibiting constant multiplicative growth.",
        difficulty: "intermediate",
        tags: ["calculus", "functions"],
        examples: [
          {
            text: "$f(x) = 2^x$ doubles for every unit increase in $x$.",
          },
        ],
        relations: [{ target_lemma: "logarithm", relation_type: "antonym" }],
        notations: [
          { type: "formula", value: "f(x) = a^x" },
          { type: "formula", value: "f(x) = e^x" },
        ],
      },
    ],
  },
  {
    lemma: "logarithm",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The inverse of exponentiation; $\\log_b(x)$ answers 'to what power must $b$ be raised to get $x$?'",
        difficulty: "intermediate",
        tags: ["calculus", "functions"],
        examples: [
          {
            text: "$\\log_2(8) = 3$ because $2^3 = 8$.",
          },
        ],
        relations: [
          { target_lemma: "exponential function", relation_type: "antonym" },
        ],
        notations: [
          { type: "formula", value: "\\log_b(x) = y \\iff b^y = x" },
          { type: "formula", value: "\\ln(x) = \\log_e(x)" },
        ],
      },
    ],
  },

  // ============================================================================
  // LIMITS
  // ============================================================================
  {
    lemma: "limit",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The value a function approaches as the input approaches a specified value.",
        difficulty: "beginner",
        tags: ["calculus", "limits"],
        examples: [
          {
            text: "$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = 4$, even though the function is undefined at $x = 2$.",
          },
        ],
        relations: [
          { target_lemma: "continuity", relation_type: "meronym" },
          { target_lemma: "derivative", relation_type: "meronym" },
        ],
        notations: [{ type: "formula", value: "\\lim_{x \\to a} f(x) = L" }],
      },
    ],
  },
  {
    lemma: "continuity",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A function is continuous at a point if the limit equals the function value there.",
        difficulty: "intermediate",
        tags: ["calculus", "limits"],
        examples: [
          {
            text: "$f(x) = \\frac{1}{x}$ is continuous everywhere except $x = 0$.",
          },
        ],
        relations: [
          { target_lemma: "limit", relation_type: "holonym" },
          { target_lemma: "discontinuity", relation_type: "antonym" },
        ],
        notations: [{ type: "formula", value: "\\lim_{x \\to a} f(x) = f(a)" }],
      },
    ],
  },
  {
    lemma: "asymptote",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A line that a curve approaches but never reaches as $x$ or $y$ tends to infinity.",
        difficulty: "intermediate",
        tags: ["calculus", "limits"],
        examples: [
          {
            text: "$y = \\frac{1}{x}$ has vertical asymptote $x = 0$ and horizontal asymptote $y = 0$.",
          },
        ],
        relations: [{ target_lemma: "limit", relation_type: "holonym" }],
        notations: [
          {
            type: "formula",
            value: "\\lim_{x \\to \\infty} f(x) = L \\text{ (horizontal)}",
          },
          {
            type: "formula",
            value: "\\lim_{x \\to a} f(x) = \\pm\\infty \\text{ (vertical)}",
          },
        ],
      },
    ],
  },

  // ============================================================================
  // DERIVATIVES
  // ============================================================================
  {
    lemma: "derivative",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: `In *calculus*, a derivative represents the instantaneous rate of change of a function with 
        respect to one of its variables. *Geometrically*, it is the slope of the tangent line to the function's
        graph at a specific point. \n
        The derivative of a function $f(x)$ at a point $x$ is formally defined by the limit of the difference quotient as the interval $h$ approaches zero:

 $$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$`,
        difficulty: "beginner",
        tags: ["calculus", "derivatives"],
        examples: [
          {
            text: "If $f(x) = x^2$, then $f'(x) = 2x$. At $x = 3$, the derivative is $6$.",
          },
          {
            text: "Velocity is the derivative of position: $v = \\frac{ds}{dt}$.",
          },
        ],
        relations: [
          { target_lemma: "integral", relation_type: "antonym" },
          { target_lemma: "tangent line", relation_type: "holonym" },
          { target_lemma: "slope", relation_type: "hypernym" },
          { target_lemma: "limit", relation_type: "meronym" },
        ],
        notations: [
          { type: "symbol", value: "f'(x)", description: "Lagrange's notation" },
          {
            type: "symbol",
            value: "\\frac{dy}{dx}",
            description: "Leibniz's notation",
          },
          { type: "symbol", value: "\\dot{y}", description: "Newton's notation" },
        ],
      },
    ],
  },
  {
    lemma: "tangent line",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A line that touches a curve at exactly one point and has the same slope as the curve there.",
        difficulty: "beginner",
        tags: ["calculus", "derivatives"],
        examples: [
          {
            text: "The tangent to $y = x^2$ at $(2, 4)$ is $y = 4x - 4$.",
          },
        ],
        relations: [
          { target_lemma: "derivative", relation_type: "meronym" },
          { target_lemma: "slope", relation_type: "meronym" },
        ],
        notations: [{ type: "formula", value: "y - f(a) = f'(a)(x - a)" }],
      },
    ],
  },
  {
    lemma: "power rule",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition: "The derivative of $x^n$ is $nx^{n-1}$.",
        difficulty: "beginner",
        tags: ["calculus", "derivatives"],
        examples: [
          {
            text: "$\\frac{d}{dx}(x^5) = 5x^4$, $\\frac{d}{dx}(x) = 1$, $\\frac{d}{dx}(\\sqrt{x}) = \\frac{1}{2}x^{-1/2}$.",
          },
        ],
        relations: [
          { target_lemma: "derivative", relation_type: "meronym" },
          { target_lemma: "chain rule", relation_type: "analog" },
        ],
        notations: [{ type: "formula", value: "\\frac{d}{dx}(x^n) = nx^{n-1}" }],
      },
    ],
  },
  {
    lemma: "product rule",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The derivative of a product of two functions: $(fg)' = f'g + fg'$.",
        difficulty: "intermediate",
        tags: ["calculus", "derivatives"],
        examples: [
          {
            text: "$\\frac{d}{dx}(x^2 \\sin x) = 2x \\sin x + x^2 \\cos x$.",
          },
        ],
        relations: [
          { target_lemma: "derivative", relation_type: "meronym" },
          { target_lemma: "quotient rule", relation_type: "analog" },
        ],
        notations: [
          {
            type: "formula",
            value: "\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)",
          },
          {
            type: "mnemonic",
            value: "first d-second plus second d-first",
          },
        ],
      },
    ],
  },
  {
    lemma: "quotient rule",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The derivative of a quotient: $(f/g)' = (f'g - fg')/g^2$.",
        difficulty: "intermediate",
        tags: ["calculus", "derivatives"],
        examples: [
          {
            text: "$\\frac{d}{dx}\\left(\\frac{\\sin x}{x}\\right) = \\frac{x \\cos x - \\sin x}{x^2}$.",
          },
        ],
        relations: [
          { target_lemma: "derivative", relation_type: "meronym" },
          { target_lemma: "product rule", relation_type: "analog" },
        ],
        notations: [
          {
            type: "formula",
            value:
              "\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}",
          },
          { type: "mnemonic", value: "lo d-hi minus hi d-lo over lo-lo" },
        ],
      },
    ],
  },
  {
    lemma: "chain rule",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The derivative of a composite function: derivative of outer times derivative of inner.",
        difficulty: "intermediate",
        tags: ["calculus", "derivatives"],
        examples: [
          {
            text: "$\\frac{d}{dx}[\\sin(x^2)] = \\cos(x^2) \\cdot 2x$.",
          },
        ],
        relations: [
          { target_lemma: "derivative", relation_type: "meronym" },
          { target_lemma: "power rule", relation_type: "analog" },
        ],
        notations: [
          {
            type: "formula",
            value: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
          },
          {
            type: "formula",
            value: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",
          },
        ],
      },
    ],
  },
  {
    lemma: "second derivative",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The derivative of the derivative; measures acceleration or concavity.",
        difficulty: "intermediate",
        tags: ["calculus", "derivatives"],
        examples: [
          {
            text: "If position $s(t) = t^3$, velocity is $s'(t) = 3t^2$, acceleration is $s''(t) = 6t$.",
          },
        ],
        relations: [
          { target_lemma: "derivative", relation_type: "derivation" },
          { target_lemma: "concavity", relation_type: "holonym" },
        ],
        notations: [
          { type: "formula", value: "f''(x)" },
          { type: "formula", value: "\\frac{d^2y}{dx^2}" },
        ],
      },
    ],
  },
  {
    lemma: "critical point",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A point where the derivative is zero or undefined; candidate for local extrema.",
        difficulty: "intermediate",
        tags: ["calculus", "derivatives"],
        examples: [
          {
            text: "$f(x) = x^3 - 3x$ has critical points at $x = \\pm 1$ where $f'(x) = 3x^2 - 3 = 0$.",
          },
        ],
        relations: [
          { target_lemma: "derivative", relation_type: "holonym" },
          { target_lemma: "optimization", relation_type: "holonym" },
        ],
        notations: [
          { type: "formula", value: "f'(c) = 0 \\text{ or undefined}" },
        ],
      },
    ],
  },
  {
    lemma: "concavity",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The direction a curve bends: concave up ($f'' > 0$) or concave down ($f'' < 0$).",
        difficulty: "intermediate",
        tags: ["calculus", "derivatives"],
        examples: [
          {
            text: "$y = x^2$ is concave up everywhere ($f'' = 2 > 0$). $y = -x^2$ is concave down.",
          },
        ],
        relations: [
          { target_lemma: "second derivative", relation_type: "meronym" },
          { target_lemma: "inflection point", relation_type: "holonym" },
        ],
        notations: [
          { type: "formula", value: "f''(x) > 0 \\Rightarrow \\text{concave up}" },
          {
            type: "formula",
            value: "f''(x) < 0 \\Rightarrow \\text{concave down}",
          },
        ],
      },
    ],
  },
  {
    lemma: "inflection point",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A point where the curve changes concavity (from up to down or vice versa).",
        difficulty: "intermediate",
        tags: ["calculus", "derivatives"],
        examples: [
          {
            text: "$y = x^3$ has an inflection point at $(0, 0)$ where concavity changes.",
          },
        ],
        relations: [
          { target_lemma: "concavity", relation_type: "meronym" },
          { target_lemma: "second derivative", relation_type: "meronym" },
        ],
        notations: [
          {
            type: "formula",
            value: "f''(x) = 0 \\text{ (necessary, not sufficient)}",
          },
        ],
      },
    ],
  },

  // ============================================================================
  // INTEGRALS
  // ============================================================================
  {
    lemma: "integral",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The accumulation of a quantity; geometrically, the signed area under a curve.",
        difficulty: "beginner",
        tags: ["calculus", "integrals"],
        examples: [
          {
            text: "$\\int_0^2 x \\, dx = \\left[\\frac{x^2}{2}\\right]_0^2 = 2$.",
          },
        ],
        relations: [
          { target_lemma: "derivative", relation_type: "antonym" },
          { target_lemma: "antiderivative", relation_type: "synonym" },
        ],
        notations: [
          { type: "symbol", value: "\\int" },
          { type: "formula", value: "\\int f(x) \\, dx" },
          { type: "formula", value: "\\int_a^b f(x) \\, dx" },
        ],
      },
    ],
  },
  {
    lemma: "antiderivative",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A function $F$ whose derivative equals $f$; written $\\int f \\, dx = F + C$.",
        difficulty: "beginner",
        tags: ["calculus", "integrals"],
        examples: [
          {
            text: "An antiderivative of $2x$ is $x^2$ since $\\frac{d}{dx}(x^2) = 2x$. So is $x^2 + 7$.",
          },
        ],
        relations: [
          { target_lemma: "integral", relation_type: "synonym" },
          { target_lemma: "derivative", relation_type: "antonym" },
        ],
        notations: [
          { type: "formula", value: "F'(x) = f(x)" },
          { type: "formula", value: "\\int f(x) \\, dx = F(x) + C" },
        ],
      },
    ],
  },
  {
    lemma: "definite integral",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "An integral with bounds; evaluates to a number representing net signed area.",
        difficulty: "intermediate",
        tags: ["calculus", "integrals"],
        examples: [
          {
            text: "$\\int_1^3 x^2 \\, dx = \\left[\\frac{x^3}{3}\\right]_1^3 = \\frac{27}{3} - \\frac{1}{3} = \\frac{26}{3}$.",
          },
        ],
        relations: [
          { target_lemma: "integral", relation_type: "hypernym" },
          {
            target_lemma: "fundamental theorem of calculus",
            relation_type: "meronym",
          },
        ],
        notations: [
          { type: "formula", value: "\\int_a^b f(x) \\, dx = F(b) - F(a)" },
        ],
      },
    ],
  },
  {
    lemma: "indefinite integral",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "An integral without bounds; represents a family of antiderivatives differing by a constant.",
        difficulty: "intermediate",
        tags: ["calculus", "integrals"],
        examples: [
          {
            text: "$\\int \\cos x \\, dx = \\sin x + C$.",
          },
        ],
        relations: [
          { target_lemma: "integral", relation_type: "hypernym" },
          { target_lemma: "antiderivative", relation_type: "synonym" },
        ],
        notations: [{ type: "formula", value: "\\int f(x) \\, dx = F(x) + C" }],
      },
    ],
  },
  {
    lemma: "fundamental theorem of calculus",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The theorem linking differentiation and integration as inverse operations.",
        difficulty: "intermediate",
        tags: ["calculus", "integrals"],
        examples: [
          {
            text: "Part 1: $\\frac{d}{dx} \\int_a^x f(t) \\, dt = f(x)$. Part 2: $\\int_a^b f(x) \\, dx = F(b) - F(a)$.",
          },
        ],
        relations: [
          { target_lemma: "integral", relation_type: "holonym" },
          { target_lemma: "derivative", relation_type: "holonym" },
        ],
        notations: [
          { type: "formula", value: "\\frac{d}{dx} \\int_a^x f(t) \\, dt = f(x)" },
          { type: "formula", value: "\\int_a^b f(x) \\, dx = F(b) - F(a)" },
        ],
      },
    ],
  },
  {
    lemma: "integration by substitution",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A technique for evaluating integrals by substituting a new variable to simplify the integrand.",
        difficulty: "intermediate",
        tags: ["calculus", "integrals"],
        examples: [
          {
            text: "$\\int 2x \\cos(x^2) \\, dx$: let $u = x^2$, $du = 2x \\, dx$, giving $\\int \\cos u \\, du = \\sin(x^2) + C$.",
          },
        ],
        relations: [
          { target_lemma: "integral", relation_type: "meronym" },
          { target_lemma: "chain rule", relation_type: "analog" },
        ],
        notations: [
          {
            type: "formula",
            value: "\\int f(g(x)) \\cdot g'(x) \\, dx = \\int f(u) \\, du",
          },
        ],
      },
    ],
  },
  {
    lemma: "integration by parts",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A technique derived from the product rule: $\\int u \\, dv = uv - \\int v \\, du$.",
        difficulty: "advanced",
        tags: ["calculus", "integrals"],
        examples: [
          {
            text: "$\\int x e^x \\, dx$: $u = x$, $dv = e^x dx$ gives $xe^x - e^x + C$.",
          },
        ],
        relations: [
          { target_lemma: "integral", relation_type: "meronym" },
          { target_lemma: "product rule", relation_type: "analog" },
        ],
        notations: [
          { type: "formula", value: "\\int u \\, dv = uv - \\int v \\, du" },
          {
            type: "mnemonic",
            value: "LIATE: Logs, Inverse trig, Algebraic, Trig, Exponential (priority for u)",
          },
        ],
      },
    ],
  },

  // ============================================================================
  // APPLICATIONS
  // ============================================================================
  {
    lemma: "optimization",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Finding maximum or minimum values of a function by analyzing critical points.",
        difficulty: "intermediate",
        tags: ["calculus", "applications"],
        examples: [
          {
            text: "To maximize $A = x(100 - 2x)$: $A' = 100 - 4x = 0$ gives $x = 25$.",
          },
        ],
        relations: [
          { target_lemma: "derivative", relation_type: "holonym" },
          { target_lemma: "critical point", relation_type: "meronym" },
        ],
        notations: [
          { type: "formula", value: "f'(x) = 0" },
          { type: "formula", value: "f''(x) > 0 \\Rightarrow \\text{local min}" },
          { type: "formula", value: "f''(x) < 0 \\Rightarrow \\text{local max}" },
        ],
      },
    ],
  },
  {
    lemma: "related rates",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Problems involving rates of change of related quantities, solved using implicit differentiation with respect to time.",
        difficulty: "intermediate",
        tags: ["calculus", "applications"],
        examples: [
          {
            text: "A ladder slides: $x^2 + y^2 = 25$. Differentiating: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$.",
          },
        ],
        relations: [{ target_lemma: "derivative", relation_type: "holonym" }],
        notations: [
          { type: "formula", value: "\\frac{d}{dt}[\\text{equation}]" },
        ],
      },
    ],
  },

  // ============================================================================
  // GREEK LETTERS & SYMBOLS
  // ============================================================================
  {
    lemma: "Delta",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Uppercase Greek letter denoting finite change or difference between two values.",
        difficulty: "beginner",
        tags: ["calculus", "notation"],
        examples: [
          {
            text: "$\\frac{\\Delta y}{\\Delta x}$ represents the average rate of change between two points.",
          },
        ],
        relations: [
          { target_lemma: "delta", relation_type: "case_variant" },
          { target_lemma: "slope", relation_type: "holonym" },
        ],
        notations: [
          { type: "symbol", value: "\\Delta" },
          { type: "pronunciation", value: "/ˈdɛltə/" },
        ],
      },
    ],
  },
  {
    lemma: "delta",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Lowercase Greek letter used in $\\epsilon$-$\\delta$ limit definitions to represent the allowable deviation in input.",
        difficulty: "intermediate",
        tags: ["calculus", "notation", "limits"],
        examples: [
          {
            text: "For every $\\epsilon > 0$, there exists $\\delta > 0$ such that $|x - a| < \\delta$ implies $|f(x) - L| < \\epsilon$.",
          },
        ],
        relations: [
          { target_lemma: "Delta", relation_type: "case_variant" },
          { target_lemma: "epsilon", relation_type: "analog" },
          { target_lemma: "limit", relation_type: "meronym" },
        ],
        notations: [
          { type: "symbol", value: "\\delta" },
          { type: "pronunciation", value: "/ˈdɛltə/" },
        ],
      },
    ],
  },
  {
    lemma: "epsilon",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Greek letter representing an arbitrarily small positive quantity in limit definitions.",
        difficulty: "intermediate",
        tags: ["calculus", "notation", "limits"],
        examples: [
          {
            text: "$\\lim_{x \\to a} f(x) = L$ means: $\\forall \\epsilon > 0$, $\\exists \\delta > 0$ such that $|x - a| < \\delta \\Rightarrow |f(x) - L| < \\epsilon$.",
          },
        ],
        relations: [
          { target_lemma: "delta", relation_type: "analog" },
          { target_lemma: "limit", relation_type: "meronym" },
        ],
        notations: [
          { type: "symbol", value: "\\epsilon" },
          { type: "pronunciation", value: "/ˈɛpsɪlɒn/" },
        ],
      },
    ],
  },
  {
    lemma: "Sigma",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Uppercase Greek letter denoting summation; the discrete analog of integration.",
        difficulty: "beginner",
        tags: ["calculus", "notation"],
        examples: [
          {
            text: "$\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$ is the sum of the first $n$ natural numbers.",
          },
        ],
        relations: [
          { target_lemma: "integral", relation_type: "analog" },
          { target_lemma: "sigma", relation_type: "case_variant" },
        ],
        notations: [
          { type: "symbol", value: "\\Sigma" },
          { type: "formula", value: "\\sum_{k=1}^{n} a_k" },
          { type: "pronunciation", value: "/ˈsɪɡmə/" },
        ],
      },
    ],
  },
  {
    lemma: "sigma",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Lowercase Greek letter commonly denoting standard deviation in statistics.",
        difficulty: "beginner",
        tags: ["statistics", "notation"],
        examples: [
          {
            text: "A normal distribution with mean $\\mu$ and standard deviation $\\sigma$ is written $N(\\mu, \\sigma^2)$.",
          },
        ],
        relations: [{ target_lemma: "Sigma", relation_type: "case_variant" }],
        notations: [
          { type: "symbol", value: "\\sigma" },
          { type: "pronunciation", value: "/ˈsɪɡmə/" },
        ],
      },
    ],
  },
  {
    lemma: "pi",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "The ratio of a circle's circumference to its diameter, approximately $3.14159$.",
        difficulty: "beginner",
        tags: ["calculus", "constants"],
        examples: [
          {
            text: "Area of a circle: $A = \\pi r^2$. Circumference: $C = 2\\pi r$.",
          },
        ],
        notations: [
          { type: "symbol", value: "\\pi" },
          { type: "formula", value: "\\pi = 3.14159265358979..." },
          { type: "pronunciation", value: "/paɪ/" },
        ],
      },
    ],
  },
  {
    lemma: "e",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "Euler's number, the base of natural logarithms, approximately $2.71828$. The unique number where $\\frac{d}{dx}(e^x) = e^x$.",
        difficulty: "intermediate",
        tags: ["calculus", "constants"],
        examples: [
          {
            text: "$e = \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n \\approx 2.71828$.",
          },
        ],
        relations: [
          { target_lemma: "logarithm", relation_type: "meronym" },
          { target_lemma: "exponential function", relation_type: "meronym" },
        ],
        notations: [
          { type: "symbol", value: "e" },
          {
            type: "formula",
            value: "e = \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n",
          },
          { type: "formula", value: "e = \\sum_{n=0}^{\\infty} \\frac{1}{n!}" },
        ],
      },
    ],
  },
  {
    lemma: "infinity",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A concept representing unboundedness; not a real number but used to describe limits and improper integrals.",
        difficulty: "beginner",
        tags: ["calculus", "notation"],
        examples: [
          {
            text: "$\\lim_{x \\to \\infty} \\frac{1}{x} = 0$. The integral $\\int_1^{\\infty} \\frac{1}{x^2} \\, dx = 1$.",
          },
        ],
        relations: [
          { target_lemma: "limit", relation_type: "meronym" },
          { target_lemma: "asymptote", relation_type: "meronym" },
        ],
        notations: [
          { type: "symbol", value: "\\infty" },
          { type: "pronunciation", value: "/ɪnˈfɪnɪti/" },
        ],
      },
    ],
  },

  // ============================================================================
  // TRIGONOMETRIC DERIVATIVES/INTEGRALS
  // ============================================================================
  {
    lemma: "sine",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A trigonometric function giving the $y$-coordinate on the unit circle; its derivative is cosine.",
        difficulty: "beginner",
        tags: ["calculus", "trigonometry"],
        examples: [
          {
            text: "$\\sin(\\pi/2) = 1$, $\\sin(0) = 0$, $\\sin(\\pi) = 0$.",
          },
        ],
        relations: [{ target_lemma: "cosine", relation_type: "analog" }],
        notations: [
          { type: "formula", value: "\\frac{d}{dx}(\\sin x) = \\cos x" },
          { type: "formula", value: "\\int \\sin x \\, dx = -\\cos x + C" },
        ],
      },
    ],
  },
  {
    lemma: "cosine",
    part_of_speech: "noun",
    language_code: "en",
    senses: [
      {
        definition:
          "A trigonometric function giving the $x$-coordinate on the unit circle; its derivative is negative sine.",
        difficulty: "beginner",
        tags: ["calculus", "trigonometry"],
        examples: [
          {
            text: "$\\cos(0) = 1$, $\\cos(\\pi/2) = 0$, $\\cos(\\pi) = -1$.",
          },
        ],
        relations: [{ target_lemma: "sine", relation_type: "analog" }],
        notations: [
          { type: "formula", value: "\\frac{d}{dx}(\\cos x) = -\\sin x" },
          { type: "formula", value: "\\int \\cos x \\, dx = \\sin x + C" },
        ],
      },
    ],
  },
];
