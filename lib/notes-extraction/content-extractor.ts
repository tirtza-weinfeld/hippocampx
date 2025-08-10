/**
 * Generic, domain-agnostic content extraction utilities
 * Works for any subject: algorithms, calculus, literature, science, etc.
 */

/**
 * Extract key terms from title, headings, and content dynamically
 * No hardcoded domain assumptions
 */
export function extractKeyTerms(text: string, title: string, headings: string[]): string[] {
  const terms = new Set<string>()
  
  // Add title words (split and clean)
  if (title) {
    addWordsToSet(title, terms)
  }
  
  // Add heading words
  headings.forEach(heading => {
    addWordsToSet(heading, terms)
  })
  
  // Extract significant words from text (skip common words)
  const words = text.match(/\b[a-zA-Z][a-zA-Z0-9_-]*\b/g) || []
  words.forEach(word => {
    const cleaned = word.toLowerCase()
    if (isSignificantWord(cleaned)) {
      terms.add(cleaned)
    }
  })
  
  // Extract programming identifiers (camelCase, snake_case, etc.)
  const identifiers = extractProgrammingIdentifiers(text)
  identifiers.forEach(id => terms.add(id.toLowerCase()))
  
  return Array.from(terms).sort()
}

/**
 * Extract any kind of notation: mathematical, scientific, musical, etc.
 */
export function extractNotations(text: string): string[] {
  const notations = new Set<string>()
  
  // LaTeX expressions: $...$ or \\...
  const latexMatches = text.match(/\$[^$]+\$|\\[a-zA-Z]+\{[^}]*\}|\\[a-zA-Z]+/g)
  if (latexMatches) {
    latexMatches.forEach(match => {
      const cleaned = match.replace(/^\$|\$$/, '') // Remove $ delimiters
      notations.add(cleaned)
    })
  }
  
  // Parenthesized expressions
  const parenthesized = text.match(/\([^)]+\)/g)
  if (parenthesized) {
    parenthesized.forEach(match => notations.add(match))
  }
  
  // Scientific notation: 3×10⁸, 6.022e23, etc.
  const scientificNotation = text.match(/\d+(?:\.\d+)?[×x]10[⁰-⁹⁺⁻]+|\d+(?:\.\d+)?[eE][+-]?\d+/g)
  if (scientificNotation) {
    scientificNotation.forEach(match => notations.add(match))
  }
  
  // Mathematical symbols with numbers/letters
  const mathSymbols = text.match(/[a-zA-Z]\d*[₀-₉]*[⁰-⁹]*[♯♭]?/g)
  if (mathSymbols) {
    mathSymbols.forEach(match => {
      if (match.length > 1) { // Skip single letters
        notations.add(match)
      }
    })
  }
  
  // Greek letters and special symbols
  const greekSymbols = text.match(/[αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]/g)
  if (greekSymbols) {
    greekSymbols.forEach(symbol => notations.add(symbol))
  }
  
  return Array.from(notations).sort()
}

/**
 * Extract categories based solely on file path structure
 */
export function extractCategories(filePath: string): string[] {
  const categories = new Set<string>()
  
  // Extract folder name from path
  const pathSegments = filePath.split('/')
  const folderName = pathSegments[pathSegments.length - 2]
  
  if (folderName && folderName !== 'notes' && folderName !== 'app') {
    categories.add(folderName)
  }
  
  return Array.from(categories)
}

// Helper functions

function addWordsToSet(text: string, terms: Set<string>) {
  const words = text
    .replace(/[^\w\s-]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter(word => word.length > 0)
  
  words.forEach(word => {
    const cleaned = word.toLowerCase()
    if (isSignificantWord(cleaned)) {
      terms.add(cleaned)
    }
  })
}

function isSignificantWord(word: string): boolean {
  // Filter out short words and common English words
  if (word.length <= 2) return false
  
  const commonWords = new Set([
    'the', 'and', 'are', 'for', 'not', 'but', 'can', 'you', 'all', 'this',
    'was', 'had', 'her', 'his', 'she', 'has', 'one', 'our', 'out', 'day',
    'get', 'use', 'man', 'new', 'now', 'way', 'may', 'say', 'how', 'its',
    'who', 'did', 'yes', 'let', 'put', 'end', 'why', 'try', 'got', 'run',
    'too', 'any', 'set', 'own', 'see', 'him', 'two', 'how', 'old', 'big',
    'top', 'bit', 'yet', 'few', 'lot', 'per', 'via', 'due', 'off', 'add'
  ])
  
  return !commonWords.has(word)
}

function extractProgrammingIdentifiers(text: string): string[] {
  const identifiers: string[] = []
  
  // camelCase: myVariable, getElementById
  const camelCase = text.match(/\b[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*\b/g)
  if (camelCase) {
    identifiers.push(...camelCase)
  }
  
  // snake_case: my_variable, find_max_value
  const snakeCase = text.match(/\b[a-z][a-z0-9]*_[a-z0-9_]+\b/g)
  if (snakeCase) {
    identifiers.push(...snakeCase)
  }
  
  // Function calls: functionName(), method.call()
  const functionCalls = text.match(/\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g)
  if (functionCalls) {
    identifiers.push(...functionCalls)
  }
  
  return identifiers
}