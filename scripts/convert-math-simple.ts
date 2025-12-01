#!/usr/bin/env node

/**
 * Convert Math Notation in Problems Metadata
 *
 * This script processes the problems metadata JSON file and converts mathematical
 * notation to KaTeX syntax using the simple math converter.
 *
 * Processes these fields:
 * - time_complexity
 * - space_complexity
 * - intuition
 * - definition
 *
 * Usage:
 *   npx tsx scripts/convert-math-simple.ts
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { MathConverter } from '../lib/simple-math-converter.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Hardcoded file path
const METADATA_FILE = path.join(__dirname, '..', 'lib', 'extracted-metadata', 'problems_metadata.json')

// Fields to process for math notation conversion
const CONVERTIBLE_FIELDS = [
  'time_complexity',
  'space_complexity',
  'intuition',
  'definition'
] as const

interface Solution {
  code?: string
  intuition?: string
  time_complexity?: string
  space_complexity?: string
  args?: string
  variables?: string
  expressions?: string
  returns?: string
  full_file_code?: string
}

interface Problem {
  title?: string
  definition?: string
  leetcode?: string
  difficulty?: string
  topics?: string[]
  solutions: Record<string, Solution>
}

type ProblemsMetadata = Record<string, Problem>

/**
 * Convert mathematical notation in a text string
 */
function convertMathInText(text: string): string {
  if (!text || typeof text !== 'string') {
    return text
  }

  // Skip if already has KaTeX syntax
  if (text.includes('\\') || text.match(/\$.*\$/)) {
    return text
  }

  // Check if text contains mathematical notation
  if (!MathConverter.containsMathNotation(text)) {
    return text
  }

  // Convert using the math converter
  return MathConverter.convertText(text, { preserveExisting: true })
}

/**
 * Process a solution object, converting math notation in relevant fields
 */
function processSolution(solutionKey: string, solution: Solution): Solution {
  const processedSolution = { ...solution }

  for (const field of CONVERTIBLE_FIELDS) {
    if (field in processedSolution && processedSolution[field as keyof Solution]) {
      const originalValue = processedSolution[field as keyof Solution] as string
      const convertedValue = convertMathInText(originalValue)

      if (convertedValue !== originalValue) {
        console.log(`    📐 Converted math notation in solution "${solutionKey}" field "${field}"`)
        ;(processedSolution as Record<string, unknown>)[field] = convertedValue
      }
    }
  }

  return processedSolution
}

/**
 * Process a problem object, converting math notation in relevant fields
 */
function processProblem(problemId: string, problem: Problem): Problem {
  console.log(`Processing: ${problemId}`)

  const processedProblem = { ...problem }
  let hasChanges = false

  // Process problem-level fields
  for (const field of CONVERTIBLE_FIELDS) {
    if (field in processedProblem && processedProblem[field as keyof Problem]) {
      const originalValue = processedProblem[field as keyof Problem] as string
      const convertedValue = convertMathInText(originalValue)

      if (convertedValue !== originalValue) {
        console.log(`  📐 Converted math notation in problem field "${field}"`)
        ;(processedProblem as Record<string, unknown>)[field] = convertedValue
        hasChanges = true
      }
    }
  }

  // Process solutions
  const processedSolutions: Record<string, Solution> = {}
  for (const [solutionKey, solution] of Object.entries(problem.solutions)) {
    const processedSolution = processSolution(solutionKey, solution)
    processedSolutions[solutionKey] = processedSolution

    // Check if any solution field was modified
    if (JSON.stringify(processedSolution) !== JSON.stringify(solution)) {
      hasChanges = true
    }
  }

  processedProblem.solutions = processedSolutions

  if (!hasChanges) {
    console.log(`  ℹ️  No math notation found`)
  }

  return processedProblem
}

/**
 * Process the entire problems metadata JSON
 */
function processProblemsMetadata(metadata: ProblemsMetadata): ProblemsMetadata {
  const processedMetadata: ProblemsMetadata = {}

  for (const [problemId, problem] of Object.entries(metadata)) {
    processedMetadata[problemId] = processProblem(problemId, problem)
  }

  return processedMetadata
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    console.log(`📖 Reading problems metadata from: ${METADATA_FILE}`)

    // Read and parse input JSON
    const inputContent = await fs.readFile(METADATA_FILE, 'utf-8')
    const problemsMetadata: ProblemsMetadata = JSON.parse(inputContent)

    console.log(`Found ${Object.keys(problemsMetadata).length} problems to process\n`)

    // Process the metadata
    const processedMetadata = processProblemsMetadata(problemsMetadata)

    // Write processed JSON back to the same file
    console.log(`\n💾 Writing converted metadata to: ${METADATA_FILE}`)
    await fs.writeFile(METADATA_FILE, JSON.stringify(processedMetadata, null, 2), 'utf-8')

    console.log(`\n✅ Math notation conversion completed successfully!`)
    console.log(`📊 Processed ${Object.keys(processedMetadata).length} problems`)

  } catch (error) {
    console.error('❌ Error converting math notation:', error)
    process.exit(1)
  }
}

// Show usage if --help is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Math Notation Converter for Problem Metadata

Usage:
  npx tsx scripts/convert-math-simple.ts

This script processes the problems metadata file and converts mathematical
notation in the following fields:
- time_complexity
- space_complexity
- intuition
- definition

Examples of conversions:
  O(N) → $O(N)$
  O(m * n) → $O(m \\times n)$
  p/k → $\\frac{p}{k}$
  **k∈ℕ** → **$k \\in \\mathbb{N}$**
`)
  process.exit(0)
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}