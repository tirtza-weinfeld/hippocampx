export type MascotCharacter = "newton" | "leibniz" | "euler"
export type MascotPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left"
export type DifficultyLevel = "beginner" | "intermediate" | "advanced"
export type Category = "basics" | "derivatives" | "integrals" | "limits" | "functions" | "advanced"

export interface DictionaryEntry {
  term: string
  definition: string
  detailedExplanation: string
  formula?: string
  example?: string
  illustration?: string
  relatedTerms?: string[]
  category: Category
  difficulty: DifficultyLevel
}

export interface MascotSettings {
  character: MascotCharacter
  position: MascotPosition
  showTips: boolean
}

export const characterImages: Record<MascotCharacter, string> = {
  newton: "🧙‍♂️",
  leibniz: "🧠",
  euler: "👨‍🔬",
}

export const characterNames: Record<MascotCharacter, string> = {
  newton: "Newton",
  leibniz: "Leibniz",
  euler: "Euler",
}

export const characterColors: Record<MascotCharacter, string> = {
  newton: "from-blue-500 to-teal-500",
  leibniz: "from-indigo-500 to-violet-500",
  euler: "from-sky-500 to-cyan-500",
}

export const positionClasses: Record<MascotPosition, string> = {
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
}

export const categoryColors: Record<Category, string> = {
  basics:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
  functions: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
  limits:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700",
  derivatives:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700",
  integrals: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
  advanced:
    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700",
}

export const difficultyColors: Record<DifficultyLevel, string> = {
  beginner: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
  intermediate: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  advanced: "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300",
}

export type GreekLetterUsage = "change" | "limits" | "angles" | "constants" | "functions" | "summation" | "integration"

export interface GreekLetter {
  id: string
  name: string
  symbol: string
  lowercase: string
  uppercase: string
  pronunciation: string
  usage: GreekLetterUsage[]
  calculusUse: string
  funFact: string
  example: string
  difficulty: DifficultyLevel
  color: string
}

export const greekLetters: GreekLetter[] = [
  {
    id: "alpha",
    name: "Alpha",
    symbol: "α",
    lowercase: "α",
    uppercase: "Α",
    pronunciation: "AL-fah",
    usage: ["angles", "constants"],
    calculusUse: "Often used as a parameter or angle in optimization problems and trigonometric functions.",
    funFact: "Alpha is the first letter of the Greek alphabet and gives us the word 'alphabet' itself!",
    example: "In f(x) = sin(αx), α controls the frequency of the sine wave.",
    difficulty: "beginner",
    color: "from-red-400 to-red-600",
  },
  {
    id: "beta",
    name: "Beta",
    symbol: "β",
    lowercase: "β",
    uppercase: "Β",
    pronunciation: "BAY-tah",
    usage: ["angles", "constants"],
    calculusUse: "Commonly used as a second parameter or angle, especially in optimization and statistics.",
    funFact: "Beta testing gets its name from this letter - it's the second phase after alpha testing!",
    example: "In regression analysis: y = αx + β, where β is the y-intercept.",
    difficulty: "beginner",
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "gamma",
    name: "Gamma",
    symbol: "γ",
    lowercase: "γ",
    uppercase: "Γ",
    pronunciation: "GAM-ah",
    usage: ["functions", "constants"],
    calculusUse: "Used in the Gamma function Γ(n), which generalizes factorials to real numbers.",
    funFact:
      "The Gamma function satisfies Γ(n) = (n-1)! for positive integers, extending factorials to all real numbers!",
    example: "Γ(5) = 4! = 24, but Γ(0.5) = √π ≈ 1.77",
    difficulty: "advanced",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "delta",
    name: "Delta",
    symbol: "δ/Δ",
    lowercase: "δ",
    uppercase: "Δ",
    pronunciation: "DEL-tah",
    usage: ["change", "limits"],
    calculusUse: "Δ represents change (Δx, Δy), while δ is used in epsilon-delta limit definitions.",
    funFact: "Delta is probably the most important Greek letter in calculus - it literally means 'change'!",
    example: "The derivative is defined as lim(Δx→0) [f(x+Δx) - f(x)]/Δx",
    difficulty: "beginner",
    color: "from-green-400 to-green-600",
  },
  {
    id: "epsilon",
    name: "Epsilon",
    symbol: "ε",
    lowercase: "ε",
    uppercase: "Ε",
    pronunciation: "EP-si-lon",
    usage: ["limits"],
    calculusUse: "Essential in formal limit definitions - represents arbitrarily small positive numbers.",
    funFact:
      "Epsilon-delta proofs are the foundation of rigorous calculus - they make 'getting close' mathematically precise!",
    example: "lim(x→a) f(x) = L means: for any ε > 0, there exists δ > 0 such that |f(x) - L| < ε when |x - a| < δ",
    difficulty: "intermediate",
    color: "from-teal-400 to-teal-600",
  },
  {
    id: "theta",
    name: "Theta",
    symbol: "θ",
    lowercase: "θ",
    uppercase: "Θ",
    pronunciation: "THEE-tah",
    usage: ["angles"],
    calculusUse: "The standard variable for angles in trigonometric functions and polar coordinates.",
    funFact: "Theta comes from the Phoenician letter 'teth' meaning 'wheel' - perfect for circular angles!",
    example: "In polar coordinates: x = r cos(θ), y = r sin(θ)",
    difficulty: "beginner",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "lambda",
    name: "Lambda",
    symbol: "λ",
    lowercase: "λ",
    uppercase: "Λ",
    pronunciation: "LAM-dah",
    usage: ["functions", "constants"],
    calculusUse: "Used in eigenvalues, Lagrange multipliers, and as a parameter in exponential functions.",
    funFact: "Lambda calculus, invented by Alonzo Church, is the foundation of functional programming languages!",
    example: "In Lagrange multipliers: ∇f = λ∇g for constrained optimization",
    difficulty: "advanced",
    color: "from-indigo-400 to-indigo-600",
  },
  {
    id: "mu",
    name: "Mu",
    symbol: "μ",
    lowercase: "μ",
    uppercase: "Μ",
    pronunciation: "MYOO",
    usage: ["constants"],
    calculusUse: "Often represents the mean in statistics or a parameter in differential equations.",
    funFact: "Mu gives us the prefix 'micro-' meaning one millionth (10⁻⁶)!",
    example: "In normal distribution: f(x) = (1/σ√(2π)) * e^(-(x-μ)²/(2σ²))",
    difficulty: "intermediate",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "pi",
    name: "Pi",
    symbol: "π",
    lowercase: "π",
    uppercase: "Π",
    pronunciation: "PIE",
    usage: ["constants"],
    calculusUse: "The famous ratio of circumference to diameter, appears in trigonometry and integration.",
    funFact:
      "π is transcendental - it can't be expressed as a solution to any polynomial equation with rational coefficients!",
    example: "∫₋∞^∞ e^(-x²) dx = √π (the Gaussian integral)",
    difficulty: "beginner",
    color: "from-pink-400 to-pink-600",
  },
  {
    id: "sigma",
    name: "Sigma",
    symbol: "σ/Σ",
    lowercase: "σ",
    uppercase: "Σ",
    pronunciation: "SIG-mah",
    usage: ["summation"],
    calculusUse: "Σ denotes summation, σ often represents standard deviation or a parameter.",
    funFact: "The summation symbol Σ revolutionized mathematics by providing a compact way to write long sums!",
    example: "Σ(k=1 to n) k = n(n+1)/2 (sum of first n natural numbers)",
    difficulty: "beginner",
    color: "from-cyan-400 to-cyan-600",
  },
  {
    id: "tau",
    name: "Tau",
    symbol: "τ",
    lowercase: "τ",
    uppercase: "Τ",
    pronunciation: "TAU (rhymes with 'how')",
    usage: ["constants"],
    calculusUse: "Sometimes used instead of 2π, represents a full rotation in radians.",
    funFact: "Some mathematicians argue τ = 2π is more natural than π because a full circle is τ radians!",
    example: "A full rotation is τ radians = 2π radians = 360°",
    difficulty: "beginner",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    id: "phi",
    name: "Phi",
    symbol: "φ",
    lowercase: "φ",
    uppercase: "Φ",
    pronunciation: "FEE (or FIE)",
    usage: ["angles", "constants"],
    calculusUse: "Used for angles, the golden ratio (φ = (1+√5)/2), and in polar coordinates.",
    funFact: "The golden ratio φ ≈ 1.618 appears in nature everywhere - from flower petals to galaxy spirals!",
    example: "φ = (1+√5)/2, and φ² = φ + 1 (the defining property of the golden ratio)",
    difficulty: "intermediate",
    color: "from-amber-400 to-amber-600",
  },
  {
    id: "omega",
    name: "Omega",
    symbol: "ω",
    lowercase: "ω",
    uppercase: "Ω",
    pronunciation: "oh-MEG-ah",
    usage: ["functions", "constants"],
    calculusUse: "Represents angular frequency in trigonometry and complex analysis.",
    funFact: "Omega is the last letter of the Greek alphabet, giving us 'alpha and omega' meaning beginning and end!",
    example: "In simple harmonic motion: x(t) = A cos(ωt + φ), where ω is angular frequency",
    difficulty: "intermediate",
    color: "from-violet-400 to-violet-600",
  },
]

export const usageColors: Record<GreekLetterUsage, string> = {
  change: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
  limits: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
  angles:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700",
  constants:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700",
  functions: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
  summation:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
  integration:
    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700",
}

export const dictionaryEntries: DictionaryEntry[] = [
  // Basics - Foundation concepts
  {
    term: "Slope",
    definition: "The steepness of a line, calculated as rise over run (Δy/Δx).",
    detailedExplanation:
      "Slope measures how much a line goes up or down as you move from left to right. It's the foundation of calculus! A positive slope means the line goes upward, negative means downward, and zero means horizontal.",
    formula: "m = (y₂ - y₁) / (x₂ - x₁) = Δy / Δx",
    example:
      "If a line goes from point (1, 2) to (3, 8), the slope is (8-2)/(3-1) = 6/2 = 3. This means for every 1 unit right, the line goes up 3 units.",
    illustration: "📈 Line going up: positive slope\n📉 Line going down: negative slope\n➡️ Horizontal line: zero slope",
    relatedTerms: ["Rise", "Run", "Rate of Change", "Tangent Line"],
    category: "basics",
    difficulty: "beginner",
  },
  {
    term: "Rise",
    definition: "The vertical change between two points on a line.",
    detailedExplanation:
      "Rise is the 'up' part of slope calculation. It's how much the y-coordinate changes when moving from one point to another. Positive rise means going up, negative rise means going down.",
    formula: "Rise = y₂ - y₁ = Δy",
    example: "From point (2, 3) to (5, 7), the rise is 7 - 3 = 4 units upward.",
    illustration: "↑ Positive rise: going up\n↓ Negative rise: going down\n→ Zero rise: horizontal",
    relatedTerms: ["Slope", "Run", "Coordinate"],
    category: "basics",
    difficulty: "beginner",
  },
  {
    term: "Run",
    definition: "The horizontal change between two points on a line.",
    detailedExplanation:
      "Run is the 'across' part of slope calculation. It's how much the x-coordinate changes when moving from one point to another. Run is usually positive when moving left to right.",
    formula: "Run = x₂ - x₁ = Δx",
    example: "From point (2, 3) to (5, 7), the run is 5 - 2 = 3 units to the right.",
    illustration: "→ Positive run: going right\n← Negative run: going left\n| Zero run: vertical line",
    relatedTerms: ["Slope", "Rise", "Coordinate"],
    category: "basics",
    difficulty: "beginner",
  },
  {
    term: "Function",
    definition: "A relation between inputs and outputs where each input has exactly one output.",
    detailedExplanation:
      "Think of a function as a machine: you put in a number (input), and it gives you exactly one number back (output). This 'one-to-one' rule is crucial in calculus.",
    formula: "f(x) = y, where x is input and y is output",
    example:
      "f(x) = 2x + 1 is a function. If you input x = 3, you get f(3) = 2(3) + 1 = 7. Every input gives exactly one output.",
    illustration: "🔢 Input → [Function Machine] → Output\n   x   →      f(x)      →   y",
    relatedTerms: ["Domain", "Range", "Graph", "Variable"],
    category: "basics",
    difficulty: "beginner",
  },
  {
    term: "Coordinate",
    definition: "A pair of numbers (x, y) that shows the position of a point on a graph.",
    detailedExplanation:
      "Coordinates are like addresses for points on a graph. The first number (x) tells you how far right or left, and the second number (y) tells you how far up or down.",
    formula: "Point P = (x, y)",
    example:
      "The point (3, 4) means: go 3 units right from the center, then 4 units up. The point (-2, 1) means: go 2 units left, then 1 unit up.",
    illustration: "📍 (3, 4): 3 right, 4 up\n📍 (-2, 1): 2 left, 1 up\n📍 (0, 0): the origin (center)",
    relatedTerms: ["Graph", "Origin", "Quadrant"],
    category: "basics",
    difficulty: "beginner",
  },
  {
    term: "Graph",
    definition: "A visual representation of mathematical relationships using points, lines, and curves.",
    detailedExplanation:
      "Graphs help us see mathematical relationships visually. They use coordinate systems to show how variables relate to each other, making abstract concepts concrete.",
    formula: "Points plotted on coordinate plane: (x, y)",
    example: "The graph of y = x² is a U-shaped curve called a parabola, showing how y changes as x changes.",
    illustration: "📊 Visual representation of data\n📈 Shows relationships\n🎯 Makes patterns visible",
    relatedTerms: ["Coordinate", "Function", "Domain", "Range"],
    category: "basics",
    difficulty: "beginner",
  },
  {
    term: "Domain",
    definition: "All possible input values (x-values) for a function.",
    detailedExplanation:
      "The domain tells you which x-values you can safely put into a function. Some functions work for all real numbers, others have restrictions.",
    formula: "Domain = {x | function is defined for x}",
    example: "For f(x) = 1/x, the domain is all real numbers except x = 0 (can't divide by zero).",
    illustration: "🔢 All valid inputs\n❌ Excludes problematic values\n✅ Safe zone for function",
    relatedTerms: ["Function", "Range", "Graph"],
    category: "basics",
    difficulty: "beginner",
  },
  {
    term: "Range",
    definition: "All possible output values (y-values) for a function.",
    detailedExplanation:
      "The range shows you all the y-values that a function can produce. It depends on both the function's formula and its domain.",
    formula: "Range = {y | y = f(x) for some x in domain}",
    example: "For f(x) = x², the range is all non-negative real numbers [0, ∞) since x² is never negative.",
    illustration: "📤 All possible outputs\n📊 Depends on function behavior\n🎯 What function can produce",
    relatedTerms: ["Function", "Domain", "Graph"],
    category: "basics",
    difficulty: "beginner",
  },

  // Functions
  {
    term: "Linear Function",
    definition: "A function that creates a straight line when graphed (f(x) = mx + b).",
    detailedExplanation:
      "Linear functions are the simplest type of function - they make perfectly straight lines. The 'm' controls the steepness (slope), and 'b' controls where the line crosses the y-axis.",
    formula: "f(x) = mx + b, where m = slope, b = y-intercept",
    example:
      "f(x) = 2x + 3 has slope 2 and y-intercept 3. This line goes up 2 units for every 1 unit right, and crosses the y-axis at (0, 3).",
    illustration:
      "📏 Straight line: f(x) = mx + b\n↗️ m > 0: line goes up\n↘️ m < 0: line goes down\n➡️ m = 0: horizontal line",
    relatedTerms: ["Slope", "Y-intercept", "Graph"],
    category: "functions",
    difficulty: "beginner",
  },
  {
    term: "Quadratic Function",
    definition: "A function with x squared as the highest power (f(x) = ax² + bx + c).",
    detailedExplanation:
      "Quadratic functions create U-shaped curves called parabolas. They're everywhere in physics - from throwing a ball to satellite dishes! The 'a' value determines if the parabola opens up or down.",
    formula: "f(x) = ax² + bx + c, where a ≠ 0",
    example:
      "f(x) = x² - 4x + 3 is a parabola opening upward. Its vertex (lowest point) can be found, and it has two x-intercepts where it crosses the x-axis.",
    illustration:
      "🌙 a > 0: parabola opens up (U-shape)\n🙃 a < 0: parabola opens down (∩-shape)\n📍 Vertex: highest or lowest point",
    relatedTerms: ["Parabola", "Vertex", "Discriminant"],
    category: "functions",
    difficulty: "intermediate",
  },

  // Limits
  {
    term: "Limit",
    definition: "The value a function approaches as the input approaches some value.",
    detailedExplanation:
      "Limits are about getting really, really close to something without necessarily reaching it. It's like asking 'What happens to f(x) as x gets closer and closer to 2?' even if f(2) doesn't exist.",
    formula: "lim(x→a) f(x) = L",
    example:
      "For f(x) = (x² - 4)/(x - 2), as x approaches 2, the function approaches 4, even though f(2) is undefined. We write: lim(x→2) f(x) = 4.",
    illustration:
      "🎯 Getting closer: x → 2\n📈 Function values → L\n🔍 We don't need to reach the target, just get arbitrarily close",
    relatedTerms: ["Continuity", "Discontinuity", "One-sided Limit"],
    category: "limits",
    difficulty: "beginner",
  },
  {
    term: "Continuity",
    definition: "A function is continuous if you can draw it without lifting your pencil.",
    detailedExplanation:
      "Continuity means no breaks, jumps, or holes in the graph. For a function to be continuous at a point, three things must be true: the function exists there, the limit exists, and they're equal.",
    formula: "f is continuous at x = a if: lim(x→a) f(x) = f(a)",
    example:
      "f(x) = x² is continuous everywhere - you can draw it without lifting your pencil. But f(x) = 1/x has a discontinuity at x = 0.",
    illustration:
      "✅ Continuous: smooth, unbroken curve\n❌ Discontinuous: has jumps, holes, or breaks\n🔗 No gaps = continuous",
    relatedTerms: ["Limit", "Discontinuity", "Jump Discontinuity"],
    category: "limits",
    difficulty: "intermediate",
  },

  // Derivatives
  {
    term: "Derivative",
    definition: "A measure of how a function changes as its input changes (instantaneous rate of change).",
    detailedExplanation:
      "The derivative tells you the slope of a function at any point. It's like having a speedometer for functions - it shows how fast the function is changing at each moment.",
    formula: "f'(x) = lim(h→0) [f(x+h) - f(x)]/h",
    example:
      "If f(x) = x², then f'(x) = 2x. At x = 3, the derivative is f'(3) = 6, meaning the function is increasing at a rate of 6 units per unit input.",
    illustration:
      "📊 Derivative = slope of tangent line\n⚡ Positive: function increasing\n⚡ Negative: function decreasing\n⚡ Zero: function has horizontal tangent",
    relatedTerms: ["Tangent Line", "Rate of Change", "Power Rule"],
    category: "derivatives",
    difficulty: "beginner",
  },
  {
    term: "Tangent Line",
    definition: "A line that touches a curve at exactly one point and has the same slope as the curve there.",
    detailedExplanation:
      "The tangent line is like a straight-line approximation of a curve at a specific point. It's the best linear approximation of the function near that point.",
    formula: "y - f(a) = f'(a)(x - a)",
    example: "For f(x) = x² at x = 2: f(2) = 4, f'(2) = 4. The tangent line is y - 4 = 4(x - 2), or y = 4x - 4.",
    illustration:
      "📏 Tangent line: just touches the curve\n🎯 Same slope as curve at that point\n📐 Best straight-line approximation",
    relatedTerms: ["Derivative", "Slope", "Linear Approximation"],
    category: "derivatives",
    difficulty: "beginner",
  },
  {
    term: "Rate of Change",
    definition: "How quickly one quantity changes with respect to another quantity.",
    detailedExplanation:
      "Rate of change measures how fast something is changing. In calculus, we often look at instantaneous rates of change, which is what derivatives give us.",
    formula: "Average rate = Δy/Δx, Instantaneous rate = dy/dx",
    example:
      "If a car's position is s(t) = t², then its velocity (rate of change of position) is s'(t) = 2t. At t = 3 seconds, the car is moving at 6 units per second.",
    illustration:
      "🚗 Speed = rate of change of position\n📈 Slope = rate of change of function\n⚡ Derivative = instantaneous rate",
    relatedTerms: ["Derivative", "Slope", "Velocity"],
    category: "derivatives",
    difficulty: "beginner",
  },
  {
    term: "Power Rule",
    definition: "The rule that says the derivative of xⁿ is n·xⁿ⁻¹.",
    detailedExplanation:
      "The Power Rule is the most fundamental differentiation rule. It makes finding derivatives of polynomial functions incredibly easy - just multiply by the exponent and reduce the exponent by 1.",
    formula: "If f(x) = xⁿ, then f'(x) = n·xⁿ⁻¹",
    example: "d/dx(x³) = 3x², d/dx(x⁵) = 5x⁴, d/dx(x) = 1, d/dx(constant) = 0",
    illustration: "🔢 x³ → 3x²\n🔢 x⁵ → 5x⁴\n🔢 x¹ → 1\n🔢 x⁰ (constant) → 0",
    relatedTerms: ["Derivative", "Polynomial", "Chain Rule"],
    category: "derivatives",
    difficulty: "beginner",
  },
  {
    term: "Chain Rule",
    definition: "The rule for finding the derivative of composite functions.",
    detailedExplanation:
      "When you have a function inside another function (like f(g(x))), the Chain Rule helps you find the derivative. It's like peeling an onion - you work from the outside in.",
    formula: "If y = f(g(x)), then dy/dx = f'(g(x)) · g'(x)",
    example: "For y = (2x + 1)³: outer function is u³, inner is 2x + 1. dy/dx = 3(2x + 1)² · 2 = 6(2x + 1)²",
    illustration:
      "🧅 Composite function: f(g(x))\n⛓️ Chain: outer derivative × inner derivative\n🔗 Work from outside to inside",
    relatedTerms: ["Composite Function", "Derivative", "Product Rule"],
    category: "derivatives",
    difficulty: "intermediate",
  },

  // Integrals
  {
    term: "Integral",
    definition: "The area under a curve, which can represent total change or accumulation.",
    detailedExplanation:
      "Integration is the opposite of differentiation. While derivatives show rates of change, integrals show total accumulation. Think of it as adding up all the little pieces under a curve.",
    formula: "∫ f(x) dx = F(x) + C, where F'(x) = f(x)",
    example:
      "∫ 2x dx = x² + C. This means the area under the curve y = 2x from 0 to some point gives you x² (plus a constant).",
    illustration: "📊 Area under curve = integral\n📈 Accumulation of change\n🧮 Sum of infinitely many rectangles",
    relatedTerms: ["Antiderivative", "Definite Integral", "Fundamental Theorem"],
    category: "integrals",
    difficulty: "beginner",
  },
  {
    term: "Antiderivative",
    definition: "A function whose derivative gives you the original function.",
    detailedExplanation:
      "An antiderivative 'undoes' differentiation. If F'(x) = f(x), then F(x) is an antiderivative of f(x). There are infinitely many antiderivatives (they differ by a constant).",
    formula: "If F'(x) = f(x), then F(x) is an antiderivative of f(x)",
    example: "Since d/dx(x²) = 2x, we know that x² is an antiderivative of 2x. So are x² + 5, x² - 3, etc.",
    illustration:
      "↩️ Antiderivative undoes derivative\n🔄 F'(x) = f(x) ⟺ ∫f(x)dx = F(x) + C\n♾️ Infinitely many (differ by constant)",
    relatedTerms: ["Integral", "Derivative", "Constant of Integration"],
    category: "integrals",
    difficulty: "beginner",
  },
  {
    term: "Fundamental Theorem",
    definition: "The theorem that connects differentiation and integration.",
    detailedExplanation:
      "This theorem is the bridge between derivatives and integrals. It has two parts: one shows that integration and differentiation are inverse operations, the other gives us a way to evaluate definite integrals.",
    formula: "∫ₐᵇ f(x) dx = F(b) - F(a), where F'(x) = f(x)",
    example: "To find ∫₁³ 2x dx: Find antiderivative F(x) = x², then F(3) - F(1) = 9 - 1 = 8.",
    illustration:
      "🌉 Bridge between derivatives and integrals\n🔗 Part 1: d/dx ∫f(t)dt = f(x)\n🧮 Part 2: ∫ₐᵇ f(x)dx = F(b) - F(a)",
    relatedTerms: ["Integral", "Derivative", "Definite Integral"],
    category: "integrals",
    difficulty: "intermediate",
  },

  // Advanced
  {
    term: "Optimization",
    definition: "Finding the best solution (maximum or minimum) to a problem using calculus.",
    detailedExplanation:
      "Optimization uses derivatives to find the highest or lowest values of functions. This is incredibly useful in real life - from maximizing profits to minimizing costs to finding the most efficient designs.",
    formula: "Find critical points where f'(x) = 0, then use second derivative test",
    example:
      "To maximize the area of a rectangle with perimeter 20: A = x(10-x), A' = 10-2x. Setting A' = 0 gives x = 5, so the square 5×5 has maximum area.",
    illustration:
      "🎯 Find maximum/minimum values\n📈 f'(x) = 0 at critical points\n🔍 Second derivative test: f''(x) > 0 = minimum, f''(x) < 0 = maximum",
    relatedTerms: ["Critical Point", "Maximum", "Minimum", "Second Derivative"],
    category: "advanced",
    difficulty: "intermediate",
  },
]
