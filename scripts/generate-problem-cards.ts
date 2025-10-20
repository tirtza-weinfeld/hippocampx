#!/usr/bin/env node

/**
 * Generate MDX card files for problems from problems_metadata.json
 *
 * This script reads the problems metadata JSON file and creates individual MDX card components
 * for each problem in components/problems/cards/ directory.
 *
 * Each card uses the ProblemCardCallout component system with:
 * - File-based navigation for multiple solutions
 * - Tab-based content (definition, intuition, time complexity, variables, expressions)
 * - Code snippets with syntax highlighting
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import GithubSlugger from 'github-slugger'
import { convertMathToKatex } from '../lib/utils/math-to-katex'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Solution {
  code: string
  intuition?: string
  time_complexity?: string
  space_complexity?: string
  args?: Record<string, string>
  variables?: Record<string, string>
  expressions?: Record<string, string>
  returns?: string
}

interface Problem {
  title?: string
  definition?: string
  leetcode?: string
  difficulty?: string
  topics?: string[]
  solutions: Record<string, Solution>
  group?: string[][]
  time_stamps?: {
    created_at?: string
    updated_at?: string
  }
}

type ProblemsMetadata = Record<string, Problem>

interface CardMetadata {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  topics: string[]
  createdAt: string
  updatedAt: string
}

function formatIntuitionContent(content: string): string {
  /**
   * Format intuition content with proper bullet point structure.
   * Handles nested indentation and code blocks.
   */
  function hasNumberedMarker(line: string): boolean {
    return /^\d+\.\s/.test(line.trim())
  }

  // Split content into paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim())

  return paragraphs.map(paragraph => {
    const lines = paragraph.split('\n').filter(line => line.trim())
    if (lines.length === 0) return ''

    // First line becomes the main bullet point (unless it already has a numbered marker)
    const firstLine = lines[0].trim()
    let result = hasNumberedMarker(firstLine) ? firstLine : `- ${firstLine}`

    // Remaining lines use indentation from JSON (already MDX-ready from Python script)
    if (lines.length > 1) {
      let inCodeBlock = false
      const nestedLines = lines.slice(1).map(line => {
        const trimmed = line.trim()
        // Extract indentation from the line (already correct from Python)
        const indent = line.substring(0, line.length - line.trimStart().length)

        // Check if this line starts or ends a code block
        if (trimmed.startsWith('```')) {
          inCodeBlock = !inCodeBlock
          // Code block delimiters don't get list markers
          return line
        }

        // If inside code block, preserve line without list marker
        if (inCodeBlock) {
          return line
        }

        // Normal lines get list markers (unless they already have numbered markers)
        if (hasNumberedMarker(trimmed)) {
          return line
        }
        return `${indent}- ${trimmed}`
      })
      result += '\n' + nestedLines.join('\n')
    }

    return result
  }).join('\n\n')
}

function formatContent(content: string, type: 'intuition' | 'timeComplexity' | 'spaceComplexity' | 'default'): string {
  /**
   * Format content based on type with proper cleaning and transformations.
   */
  if (!content?.trim()) return ''

  // Clean up content - handle escaped newlines and normalize formatting
  let cleanContent = content.trim()
    .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
    .replace(/\n\s*\n/g, '\n\n') // Normalize double newlines

  // Special formatting based on type
  if (type === 'intuition') {
    cleanContent = formatIntuitionContent(cleanContent)
  } else if (type === 'timeComplexity' || type === 'spaceComplexity') {
    cleanContent = convertMathToKatex(formatIntuitionContent(cleanContent))
  } else {
    // Wrap terms before colons in inline code blocks (e.g., "- pq:" becomes "- `pq`:"), but skip if already wrapped
    cleanContent = cleanContent.replace(/^(\s*-\s*)([^`:\s][^:\s]*)(\s*:)/gm, '$1`$2`$3')
  }

  return cleanContent
}

function determineDefaultFile(metadata: Problem): string {
  /**
   * Determine which file should be the default based on group/solutions.
   */
  // Check if group field exists and has entries
  if (metadata.group && metadata.group.length > 0) {
    const firstGroup = metadata.group[0]
    if (firstGroup && firstGroup.length > 0) {
      return firstGroup[0]
    }
  }

  // Fallback: use first solution file
  const solutionFiles = Object.keys(metadata.solutions)
  if (solutionFiles.length > 0) {
    return solutionFiles[0]
  }

  return ''
}

function getFilesWithMetadata(solutions: Record<string, Solution>, fieldName: keyof Solution): Set<string> {
  /**
   * Get set of filenames that have a specific metadata field.
   */
  const filesWithField = new Set<string>()

  for (const [filename, solutionData] of Object.entries(solutions)) {
    if (fieldName in solutionData && solutionData[fieldName]) {
      filesWithField.add(filename)
    }
  }

  return filesWithField
}

function formatDictToMarkdownList(data: Record<string, string>, keyBackticks: boolean = true): string {
  /**
   * Convert dictionary to markdown list format.
   * Example: {"freq": "frequency", "h": "heap"} -> "- `freq`: frequency\n- `h`: heap"
   */
  const lines: string[] = []

  for (const [key, value] of Object.entries(data)) {
    const keyFormatted = keyBackticks ? `\`${key}\`` : key
    lines.push(`- ${keyFormatted}: ${value}`)
  }

  return lines.join('\n')
}

function generateFabGroup(solutions: Record<string, Solution>): string {
  /**
   * Generate ProblemCardFabGroup with all buttons always present.
   * Buttons without solutions get empty Set.
   */
  const lines: string[] = ['<FabGroup>']

  // Definition button - always present, no files attribute
  lines.push('  <FabButton tab="definition" />')

  lines.push('  <FabButton tab="codeSnippet" />')

  // Intuition button - always present
  const intuitionFiles = getFilesWithMetadata(solutions, 'intuition')
  if (intuitionFiles.size === 0) {
    lines.push('  <FabButton tab="intuition" files={new Set([])} />')
  } else if (intuitionFiles.size === Object.keys(solutions).length) {
    // All solutions have intuition - no files attribute
    lines.push('  <FabButton tab="intuition" />')
  } else {
    // Only some solutions have intuition - add files attribute
    const filesStr = Array.from(intuitionFiles).sort().map(f => `"${f}"`).join(', ')
    lines.push(`  <FabButton tab="intuition" files={new Set([${filesStr}])} />`)
  }

  // Time Complexity button - always present
  const timeComplexityFiles = getFilesWithMetadata(solutions, 'time_complexity')
  if (timeComplexityFiles.size === 0) {
    lines.push('  <FabButton tab="timeComplexity" files={new Set([])} />')
  } else if (timeComplexityFiles.size === Object.keys(solutions).length) {
    lines.push('  <FabButton tab="timeComplexity" />')
  } else {
    const filesStr = Array.from(timeComplexityFiles).sort().map(f => `"${f}"`).join(', ')
    lines.push(`  <FabButton tab="timeComplexity" files={new Set([${filesStr}])} />`)
  }

  // Key Variables button - always present
  const variablesFiles = getFilesWithMetadata(solutions, 'variables')
  if (variablesFiles.size === 0) {
    lines.push('  <FabButton tab="keyVariables" files={new Set([])} />')
  } else if (variablesFiles.size === Object.keys(solutions).length) {
    lines.push('  <FabButton tab="keyVariables" />')
  } else {
    const filesStr = Array.from(variablesFiles).sort().map(f => `"${f}"`).join(', ')
    lines.push(`  <FabButton tab="keyVariables" files={new Set([${filesStr}])} />`)
  }

  // Key Expressions button - always present
  const expressionsFiles = getFilesWithMetadata(solutions, 'expressions')
  if (expressionsFiles.size === 0) {
    lines.push('  <FabButton tab="keyExpressions" files={new Set([])} />')
  } else if (expressionsFiles.size === Object.keys(solutions).length) {
    lines.push('  <FabButton tab="keyExpressions" />')
  } else {
    const filesStr = Array.from(expressionsFiles).sort().map(f => `"${f}"`).join(', ')
    lines.push(`  <FabButton tab="keyExpressions" files={new Set([${filesStr}])} />`)
  }

  lines.push('</FabGroup>')
  return lines.join('\n')
}

function generateDialogTabs(
  problemMetadata: Problem,
  solutions: Record<string, Solution>,
  isSingleSolution: boolean,
  problemId: string
): string {
  /**
   * Generate all ProblemCardCalloutTab elements.
   */
  const lines: string[] = ['<ProblemCardDialog>', '']

  // Definition tab - problem-level, no file attribute
  const definition = formatContent(problemMetadata.definition || '', 'default')
  lines.push('<ProblemCardTab tab="definition">')
  lines.push(definition)
  lines.push('</ProblemCardTab>')
  lines.push('')

 // File List (only for multiple solutions)
  // if (!isSingleSolution) {
  //   lines.push(generateFileList(Object.keys(solutions)))
  //   lines.push('')
  // }

  // Code snippets
  lines.push(generateCodeSnippets(problemId, solutions, isSingleSolution))
  
  // Intuition tabs - solution-level
  for (const [filename, solutionData] of Object.entries(solutions)) {
    if (solutionData.intuition) {
      const formattedIntuition = formatContent(solutionData.intuition, 'intuition')
      if (isSingleSolution) {
        lines.push('<ProblemCardTab tab="intuition">')
      } else {
        lines.push(`<ProblemCardTab tab="intuition" file="${filename}">`)
      }
      lines.push(formattedIntuition)
      lines.push('</ProblemCardTab>')
      lines.push('')
    }
  }

  // Time Complexity tabs - solution-level
  for (const [filename, solutionData] of Object.entries(solutions)) {
    if (solutionData.time_complexity) {
      const formattedTimeComplexity = formatContent(solutionData.time_complexity, 'timeComplexity')
      if (isSingleSolution) {
        lines.push('<ProblemCardTab tab="timeComplexity">')
      } else {
        lines.push(`<ProblemCardTab tab="timeComplexity" file="${filename}">`)
      }
      lines.push(formattedTimeComplexity)
      lines.push('</ProblemCardTab>')
      lines.push('')
    }
  }

  // Space Complexity tabs - solution-level (optional)
  for (const [filename, solutionData] of Object.entries(solutions)) {
    if (solutionData.space_complexity) {
      const formattedSpaceComplexity = formatContent(solutionData.space_complexity, 'spaceComplexity')
      if (isSingleSolution) {
        lines.push('<ProblemCardTab tab="spaceComplexity">')
      } else {
        lines.push(`<ProblemCardTab tab="spaceComplexity" file="${filename}">`)
      }
      lines.push(formattedSpaceComplexity)
      lines.push('</ProblemCardTab>')
      lines.push('')
    }
  }

  // Key Variables tabs - solution-level
  for (const [filename, solutionData] of Object.entries(solutions)) {
    if (solutionData.variables && Object.keys(solutionData.variables).length > 0) {
      if (isSingleSolution) {
        lines.push('<ProblemCardTab tab="keyVariables">')
      } else {
        lines.push(`<ProblemCardTab tab="keyVariables" file="${filename}">`)
      }
      lines.push(formatDictToMarkdownList(solutionData.variables))
      lines.push('</ProblemCardTab>')
      lines.push('')
    }
  }

  // Key Expressions tabs - solution-level
  for (const [filename, solutionData] of Object.entries(solutions)) {
    if (solutionData.expressions && Object.keys(solutionData.expressions).length > 0) {
      if (isSingleSolution) {
        lines.push('<ProblemCardTab tab="keyExpressions">')
      } else {
        lines.push(`<ProblemCardTab tab="keyExpressions" file="${filename}">`)
      }
      lines.push(formatDictToMarkdownList(solutionData.expressions))
      lines.push('</ProblemCardTab>')
      lines.push('')
    }
  }

  lines.push('</ProblemCardDialog>')
  return lines.join('\n')
}

// function generateFileList(solutionFiles: string[]): string {
//   /**
//    * Generate ProblemFileList with ProblemFileTrigger elements.
//    * Only called for multi-solution problems.
//    */
//   const lines: string[] = ['<ProblemFileList>']

//   for (const filename of solutionFiles) {
//     lines.push(`  <ProblemFileTrigger file="${filename}" />`)
//   }

//   lines.push('</ProblemFileList>')
//   return lines.join('\n')
// }

function generateCodeSnippets(problemId: string, solutions: Record<string, Solution>, isSingleSolution: boolean): string {
  /**
   * Generate all ProblemCardCalloutCodeSnippet elements.
   * Normalizes code by trimming and removing excessive blank lines.
   */
  const lines: string[] = []

  for (const [filename, solutionData] of Object.entries(solutions)) {
    if (!solutionData.code) continue

    const sourcePath = `problems/${problemId}/${filename}`

    // Normalize code: trim and replace 3+ newlines with 2 newlines (1 blank line)
    const normalizedCode = solutionData.code.trim().replace(/\n{3,}/g, '\n\n')

    // For single solution, no file attribute needed
    if (isSingleSolution) {
      lines.push(`<ProblemCardTab tab="codeSnippet">`)
    } else {
      lines.push(`<ProblemCardTab file="${filename}" tab="codeSnippet">`)
    }
    lines.push('```python meta="source=' + sourcePath + '"')
    lines.push(normalizedCode)
    lines.push('```')
    lines.push('</ProblemCardTab>')
    lines.push('')
  }

  return lines.join('\n')
}

function generateMdxFromMetadata(problemId: string, metadata: Problem): string {
  /**
   * Generate complete MDX content for a problem card.
   */
  const solutions = metadata.solutions || {}
  const title = metadata.title || problemId

  // Determine if single solution
  const isSingleSolution = Object.keys(solutions).length === 1

  // Start building MDX
  const lines: string[] = []

  // Export metadata for instant server-side access
  lines.push(`export const metadata = {`)
  lines.push(`  id: "${problemId}",`)
  lines.push(`  title: "${title.replace(/"/g, '\\"')}",`)
  lines.push(`  difficulty: "${metadata.difficulty || 'medium'}",`)
  lines.push(`  topics: ${JSON.stringify(metadata.topics || [])},`)
  lines.push(`  solutionCount: ${Object.keys(solutions).length},`)
  lines.push(`  leetcode: "${metadata.leetcode || ''}",`)
  const defaultFile = isSingleSolution ? '' : determineDefaultFile(metadata)
  lines.push(`  defaultFile: "${defaultFile}",`)
  lines.push(`  solutionFiles: ${JSON.stringify(Object.keys(solutions))},`)
  lines.push(`}`)
  lines.push('')

  // Default export as MDX component
  lines.push(``)
  lines.push(`<ProblemCardContent>`)
  lines.push('')

  // FAB Group
  lines.push(generateFabGroup(solutions))
  lines.push('')

  // Dialog with tabs
  lines.push(generateDialogTabs(metadata, solutions, isSingleSolution, problemId))
  lines.push('')

  // Close content wrapper
  lines.push(`</ProblemCardContent>`)

  return lines.join('\n')
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

function toPascalCase(str: string): string {
  /**
   * Convert kebab-case to PascalCase for component names.
   * Strips leading numbers and capitalizes each word.
   * Example: "347-top-k-frequent-elements" -> "TopKFrequentElements"
   * Example: "two-sum" -> "TwoSum"
   */
  return str
    .split('-')
    .filter(word => !/^\d+$/.test(word)) // Remove segments that are only digits
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function generateCardsIndexFile(problemIds: string[], problemsMetadata: ProblemsMetadata): string {
  /**
   * Generate cards.tsx file with instant rendering.
   * No MDX imports - uses metadata JSON and lazy-loads content.
   * No TOC - just FilterProvider for filtering.
   * Cards render instantly with titles from metadata.
   */
  const lines: string[] = []

  // TypeScript imports
  lines.push(`import { FilterProvider } from '@/components/mdx/problem/card/filter-context'`)
  lines.push(`import { ProblemCardProvider } from '@/components/mdx/problem/card/problem-context'`)
  lines.push(`import { ProblemCardFilterHeader } from '@/components/mdx/problem/card/filter-header'`)
  lines.push(`import { ProblemCard } from '@/components/mdx/problem/card/problem'`)
  lines.push(`import { ProblemCardHeader } from '@/components/mdx/problem/card/callout-header'`)
  lines.push('')

  // Sort problems
  const sortedProblems = problemIds
    .map(problemId => ({
      componentName: toPascalCase(problemId),
      problemId,
      metadata: problemsMetadata[problemId]
    }))
    .sort((a, b) => a.componentName.localeCompare(b.componentName))

  // Inline metadata as const object
  lines.push(`// Metadata extracted during build time`)
  lines.push(`const CARDS_METADATA = {`)
  for (const { problemId, metadata } of sortedProblems) {
    const title = metadata.title || problemId
    const difficulty = metadata.difficulty || 'medium'
    const topics = metadata.topics || []
    const solutionFiles = Object.keys(metadata.solutions || {})
    const defaultFile = solutionFiles.length === 1 ? '' : determineDefaultFile(metadata)

    lines.push(`  "${problemId}": {`)
    lines.push(`    id: "${problemId}",`)
    lines.push(`    title: "${title.replace(/"/g, '\\"')}",`)
    lines.push(`    difficulty: "${difficulty}",`)
    lines.push(`    topics: ${JSON.stringify(topics)},`)
    lines.push(`    solutionFiles: ${JSON.stringify(solutionFiles)},`)
    lines.push(`    defaultFile: "${defaultFile}",`)
    lines.push(`  },`)
  }
  lines.push(`} as const`)
  lines.push('')

  // Dynamic imports for card content components
  lines.push(`// Dynamic imports for card content`)
  for (const { componentName, problemId } of sortedProblems) {
    lines.push(`import ${componentName}Content from './cards/${problemId}.mdx'`)
  }
  lines.push('')

  // Card shell component
  lines.push(`// Card shell renders with metadata and content`)
  lines.push(`function CardShell({ id, Content }: { id: string; Content: React.ComponentType<any> }) {`)
  lines.push(`  const meta = CARDS_METADATA[id as keyof typeof CARDS_METADATA]`)
  lines.push(`  if (!meta) return null`)
  lines.push(``)
  lines.push(`  const topics = meta.topics.join(',')`)
  lines.push(`  const solutionFiles = [...meta.solutionFiles] // Convert readonly to mutable`)
  lines.push(``)
  lines.push(`  return (`)
  lines.push(`    <ProblemCard`)
  lines.push(`      id={meta.id}`)
  lines.push(`      difficulty={meta.difficulty}`)
  lines.push(`      topics={topics}`)
  lines.push(`      title={meta.title}`)
  lines.push(`      defaultFile={meta.defaultFile}`)
  lines.push(`      solutionFiles={solutionFiles}`)
  lines.push(`    >`)
  lines.push(`      <ProblemCardHeader id={meta.id}>`)
  lines.push(`        {meta.title}`)
  lines.push(`      </ProblemCardHeader>`)
  lines.push(`      <Content />`)
  lines.push(`    </ProblemCard>`)
  lines.push(`  )`)
  lines.push(`}`)
  lines.push('')

  // Main export function
  lines.push(`export default function ProblemsCards() {`)
  lines.push(`  return (`)
  lines.push(`    <div className="space-y-6">`)
  lines.push(`      <h1 className="text-3xl font-bold">LeetCode Problems</h1>`)
  lines.push(``)
  lines.push(`      <FilterProvider>`)
  lines.push(`        <ProblemCardProvider`)
  lines.push(`          problemIds={${JSON.stringify(problemIds)}}`)
  lines.push(`          defaultExpanded={false}`)
  lines.push(`        >`)
  lines.push(`          <ProblemCardFilterHeader />`)
  lines.push(``)
  lines.push(`          <div className="space-y-4">`)

  // Render card shells with metadata and lazy content
  for (const { problemId, componentName } of sortedProblems) {
    lines.push(`            <CardShell id="${problemId}" Content={${componentName}Content} />`)
  }

  lines.push(`          </div>`)
  lines.push(`        </ProblemCardProvider>`)
  lines.push(`      </FilterProvider>`)
  lines.push(`    </div>`)
  lines.push(`  )`)
  lines.push(`}`)
  lines.push('')

  return lines.join('\n')
}

async function main(): Promise<void> {
  try {
    // Read the problems metadata
    const metadataPath = path.join(__dirname, '..', 'lib', 'extracted-metadata', 'problems_metadata.json')
    const metadataContent = await fs.readFile(metadataPath, 'utf-8')
    const problemsData: { problems: ProblemsMetadata } = JSON.parse(metadataContent)
    const problemsMetadata = problemsData.problems

    console.log(`Found ${Object.keys(problemsMetadata).length} problems to generate card MDX files for`)

    // Ensure the problems/cards directory exists
    const cardsDir = path.join(__dirname, '..', 'components', 'problems', 'cards')
    await ensureDirectoryExists(cardsDir)

    let generatedCount = 0
    let skippedCount = 0
    const skippedProblems: Array<{ id: string; reason: string }> = []
    const generatedProblemIds: string[] = []
    const cardsMetadata: CardMetadata[] = []

    // Generate MDX card for each problem
    for (const [problemId, problem] of Object.entries(problemsMetadata)) {
      // Validate required fields
      if (!problem.title || !problem.definition) {
        skippedCount++
        skippedProblems.push({ id: problemId, reason: 'Missing title or definition' })
        continue
      }

      // Skip problems without solutions
      if (!problem.solutions || Object.keys(problem.solutions).length === 0) {
        skippedCount++
        skippedProblems.push({ id: problemId, reason: 'No solutions found' })
        continue
      }

      try {
        const mdxContent = generateMdxFromMetadata(problemId, problem)

        // Write MDX file
        const cardPath = path.join(cardsDir, `${problemId}.mdx`)
        await fs.writeFile(cardPath, mdxContent, 'utf-8')

        generatedCount++
        generatedProblemIds.push(problemId)

        // Collect metadata for filtering
        cardsMetadata.push({
          id: problemId,
          title: problem.title || problemId,
          difficulty: (problem.difficulty?.toLowerCase() || 'medium') as 'easy' | 'medium' | 'hard',
          topics: problem.topics || [],
          createdAt: problem.time_stamps?.created_at || new Date().toISOString(),
          updatedAt: problem.time_stamps?.updated_at || new Date().toISOString(),
        })

        const solutionCount = Object.keys(problem.solutions).length
        console.log(`✅ Generated: ${problemId}.mdx (${solutionCount} solution${solutionCount > 1 ? 's' : ''})`)
      } catch (error) {
        skippedCount++
        const errorMsg = error instanceof Error ? error.message : String(error)
        skippedProblems.push({ id: problemId, reason: `Error: ${errorMsg}` })
        console.log(`❌ Failed to generate ${problemId}: ${errorMsg}`)
      }
    }

    // Generate cards.tsx index file
    const cardsIndexContent = generateCardsIndexFile(generatedProblemIds, problemsMetadata)
    const cardsIndexPath = path.join(__dirname, '..', 'components', 'problems', 'cards.tsx')
    await fs.writeFile(cardsIndexPath, cardsIndexContent, 'utf-8')
    console.log(`\n✅ Generated cards.tsx with ${generatedProblemIds.length} problem cards`)

    // Generate cards metadata JSON for instant filtering
    const cardsMetadataPath = path.join(__dirname, '..', 'lib', 'extracted-metadata', 'cards-metadata.json')
    await fs.writeFile(cardsMetadataPath, JSON.stringify(cardsMetadata, null, 2), 'utf-8')
    console.log(`✅ Generated cards-metadata.json with ${cardsMetadata.length} card metadata entries`)

    // Summary
    console.log(`\n${'='.repeat(60)}`)
    console.log(`✅ Generated ${generatedCount} MDX card files`)
    console.log(`❌ Skipped ${skippedCount} problems`)

    if (skippedProblems.length > 0) {
      console.log(`\n${'='.repeat(60)}`)
      console.log('Skipped problems:')
      for (const { id, reason } of skippedProblems) {
        console.log(`  - ${id}: ${reason}`)
      }
    }

    console.log(`\n${'='.repeat(60)}`)
    console.log(`Output directory: ${cardsDir}`)
    console.log(`Index file: ${cardsIndexPath}`)

  } catch (error) {
    console.error('Error generating MDX card files:', error)
    process.exit(1)
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
