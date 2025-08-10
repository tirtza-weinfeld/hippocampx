import { describe, it, expect } from 'vitest'
import type { NotesContent, CodeBlock } from '@/lib/notes-extraction/types'
import { 
  extractKeyTerms, 
  extractNotations, 
  extractCategories 
} from '@/lib/notes-extraction/content-extractor'

describe('Content Extractor - Generic Domain Agnostic', () => {
  describe('extractKeyTerms', () => {
    it('should extract terms from title and headings (algorithms)', () => {
      const title = "Binary Search Algorithm"
      const headings = ["Implementation", "Time Complexity", "Search Insert Position"]
      const text = "Binary search is an efficient algorithm"
      
      const terms = extractKeyTerms(text, title, headings)
      
      expect(terms).toContain('binary')
      expect(terms).toContain('search')
      expect(terms).toContain('algorithm')
      expect(terms).toContain('implementation')
      expect(terms).toContain('complexity')
    })

    it('should extract terms from calculus content', () => {
      const title = "Derivatives and Limits"
      const headings = ["Chain Rule", "Product Rule", "L'Hôpital's Rule"]
      const text = "The derivative measures the rate of change. Limits approach values."
      
      const terms = extractKeyTerms(text, title, headings)
      
      expect(terms).toContain('derivatives')
      expect(terms).toContain('limits')
      expect(terms).toContain('chain')
      expect(terms).toContain('rule')
      expect(terms).toContain('derivative')
      expect(terms).toContain('rate')
      expect(terms).toContain('change')
    })

    it('should extract terms from literature content', () => {
      const title = "Shakespearean Sonnets"
      const headings = ["Rhyme Scheme", "Iambic Pentameter", "Themes"]
      const text = "Shakespeare wrote 154 sonnets with complex metaphors and symbolism"
      
      const terms = extractKeyTerms(text, title, headings)
      
      expect(terms).toContain('shakespearean')
      expect(terms).toContain('sonnets')
      expect(terms).toContain('rhyme')
      expect(terms).toContain('iambic')
      expect(terms).toContain('pentameter')
      expect(terms).toContain('shakespeare')
      expect(terms).toContain('metaphors')
    })

    it('should extract identifiers from any code language', () => {
      const text = "function calculateArea(radius) { return Math.PI * radius * radius }"
      const terms = extractKeyTerms(text, "", [])
      
      expect(terms).toContain('calculatearea')
      expect(terms).toContain('radius')
    })

    it('should extract camelCase and snake_case identifiers', () => {
      const text = "let maxValue = getMaxValue(); int min_index = find_min_index(arr)"
      const terms = extractKeyTerms(text, "", [])
      
      expect(terms).toContain('maxvalue')
      expect(terms).toContain('getmaxvalue')
      expect(terms).toContain('min_index')
      expect(terms).toContain('find_min_index')
    })

    it('should filter out short and common words', () => {
      const text = "A or B is the answer"
      const terms = extractKeyTerms(text, "", [])
      
      expect(terms).not.toContain('a')
      expect(terms).not.toContain('or')
      expect(terms).not.toContain('is')
      expect(terms).not.toContain('the')
      expect(terms).toContain('answer')
    })
  })

  describe('extractNotations', () => {
    it('should extract mathematical notations (Big O)', () => {
      const text = "Time complexity is O(n log n) and space is O(1)"
      const notations = extractNotations(text)
      
      expect(notations).toContain('O(n log n)')
      expect(notations).toContain('O(1)')
    })

    it('should extract LaTeX formatted expressions', () => {
      const text = "The algorithm runs in $O(n^2)$ time and $\\frac{d}{dx}f(x)$ derivative"
      const notations = extractNotations(text)
      
      expect(notations).toContain('O(n^2)')
      expect(notations).toContain('\\frac{d}{dx}f(x)')
    })

    it('should extract scientific notations', () => {
      const text = "Speed of light: 3×10⁸ m/s, Avogadro's number: 6.022×10²³"
      const notations = extractNotations(text)
      
      expect(notations).toContain('3×10⁸')
      expect(notations).toContain('6.022×10²³')
    })

    it('should extract musical notations', () => {
      const text = "Play C major chord: C-E-G, then F♯ minor"
      const notations = extractNotations(text)
      
      expect(notations).toContain('C-E-G')
      expect(notations).toContain('F♯')
    })

    it('should extract any parenthesized expressions', () => {
      const text = "Chemical formula H₂O, equation (x + y)² = x² + 2xy + y²"
      const notations = extractNotations(text)
      
      expect(notations).toContain('(x + y)²')
      expect(notations).toContain('H₂O')
    })
  })

  describe('extractCategories', () => {
    it('should extract category from file path', () => {
      const filePath = '/app/notes/binary-search/page.mdx'
      const categories = extractCategories(filePath)
      
      expect(categories).toContain('binary-search')
    })

    it('should handle nested paths correctly', () => {
      const filePath = '/Users/dev/project/app/notes/dynamic-programming/page.mdx'
      const categories = extractCategories(filePath)
      
      expect(categories).toContain('dynamic-programming')
      expect(categories).not.toContain('app')
      expect(categories).not.toContain('notes')
    })
  })
})