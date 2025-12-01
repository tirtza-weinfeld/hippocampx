#!/usr/bin/env node

/**
 * Convert Math Notation in JSON Files
 *
 * This script takes a JSON file containing problem metadata and converts Unicode
 * mathematical notation to KaTeX syntax using the math notation converter.
 *
 * Usage:
 *   npx tsx scripts/convert-math-notation.ts --input path/to/input.json --output path/to/output.json
 *
 * The script processes specific fields that may contain mathematical notation:
 * - Problem definition
 * - Solution intuition
 * - Time complexity
 * - Space complexity
 * - Variables descriptions
 * - Expressions
 * - Arguments descriptions
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { MathNotationConverter } from '../lib/math-notation-converter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
 * Fields that should be processed for math notation conversion
 */
const MATH_CONVERTIBLE_FIELDS = {
  // Problem-level fields
  problem: ['definition'],
  // Solution-level fields
  solution: ['intuition', 'time_complexity', 'space_complexity', 'args', 'variables', 'expressions', 'returns']
} as const

/**
 * Convert mathematical notation in a text string using inline expressions
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
  if (!MathNotationConverter.containsMathNotation(text)) {
    return text
  }

  // Convert using inline expressions method for proper $...$ wrapping
  return MathNotationConverter.convertInlineExpressions(text, { preserveExisting: true })
}

/**
 * Process a solution object, converting math notation in relevant fields
 */
function processSolution(solution: Solution): Solution {
  const processedSolution = { ...solution }

  for (const field of MATH_CONVERTIBLE_FIELDS.solution) {
    if (field in processedSolution && processedSolution[field as keyof Solution]) {
      const originalValue = processedSolution[field as keyof Solution] as string
      const convertedValue = convertMathInText(originalValue)

      if (convertedValue !== originalValue) {
        console.log(`  📐 Converted math notation in ${field}`)
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
  for (const field of MATH_CONVERTIBLE_FIELDS.problem) {
    if (field in processedProblem && processedProblem[field as keyof Problem]) {
      const originalValue = processedProblem[field as keyof Problem] as string
      const convertedValue = convertMathInText(originalValue)

      if (convertedValue !== originalValue) {
        console.log(`  📐 Converted math notation in ${field}`)
        ;(processedProblem as Record<string, unknown>)[field] = convertedValue
        hasChanges = true
      }
    }
  }

  // Process solutions
  const processedSolutions: Record<string, Solution> = {}
  for (const [solutionKey, solution] of Object.entries(problem.solutions)) {
    const processedSolution = processSolution(solution)
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
 * Parse command line arguments
 */
function parseArgs(): { input: string; output: string } {
  const args = process.argv.slice(2)

  let input = ''
  let output = ''

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' || args[i] === '-i') {
      input = args[i + 1]
      i++
    } else if (args[i] === '--output' || args[i] === '-o') {
      output = args[i + 1]
      i++
    }
  }

  // Default paths if not provided
  if (!input) {
    input = path.join(__dirname, '..', 'lib', 'extracted-metadata', 'problems_metadata.json')
  }

  if (!output) {
    output = input // Overwrite input file by default
  }

  return { input, output }
}

/**
 * Ensure directory exists for output file
 */
async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = path.dirname(filePath)
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    const { input, output } = parseArgs()

    console.log(`📖 Reading problems metadata from: ${input}`)

    // Read and parse input JSON
    const inputContent = await fs.readFile(input, 'utf-8')
    const problemsMetadata: ProblemsMetadata = JSON.parse(inputContent)

    console.log(`Found ${Object.keys(problemsMetadata).length} problems to process\n`)

    // Process the metadata
    const processedMetadata = processProblemsMetadata(problemsMetadata)

    // Ensure output directory exists
    await ensureDirectoryExists(output)

    // Write processed JSON
    console.log(`\n💾 Writing converted metadata to: ${output}`)
    await fs.writeFile(output, JSON.stringify(processedMetadata, null, 2), 'utf-8')

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
  npx tsx scripts/convert-math-notation.ts [options]

Options:
  -i, --input <file>   Input JSON file (default: lib/extracted-metadata/problems_metadata.json)
  -o, --output <file>  Output JSON file (default: overwrites input file)
  -h, --help          Show this help message

Examples:
  # Convert in-place (default)
  npx tsx scripts/convert-math-notation.ts

  # Specify input and output files
  npx tsx scripts/convert-math-notation.ts -i input.json -o output.json

  # Convert specific file in-place
  npx tsx scripts/convert-math-notation.ts -i /path/to/metadata.json
`)
  process.exit(0)
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}