#!/usr/bin/env node

/**
 * Generate Agent MDX structure from problems_metadata.json
 *
 * This script:
 * 1. Reads problems_metadata.json
 * 2. Generates agent-metadata.json (for filtering)
 * 3. For each problem:
 *    - Creates folder structure
 *    - Generates section MDX files
 *    - Generates problem index.tsx with lazy imports
 * 4. Generates Agent.tsx with all problem imports
 *
 * @module generate-agent-mdx
 * @requires fs/promises
 * @requires path
 * @requires url
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
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
  leetcode: string
  difficulty?: string
  topics?: string[]
  time_stamps: {
    created_at: string
    updated_at: string
  }
  solutions: Record<string, Solution>
}


interface ProblemsMetadata {
  problems: Record<string, Problem>
}

// Lightweight metadata for filtering only
interface AgentFilterMetadata {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  topics: string[]
  createdAt: string
  updatedAt: string
}

type SectionType = 'definition' | 'codeSnippet' | 'intuition' | 'timeComplexity' | 'keyVariables' | 'keyExpressions'

type Difficulty = "easy" | "medium" | "hard"

/**
 * Ensures a directory exists at the given path, creating it recursively if needed
 * @param dirPath - Absolute path to directory
 * @throws {Error} If directory creation fails
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

/**
 * Generates lightweight filter metadata from full problems metadata
 * Extracts only fields needed for filtering and sorting
 * @param problemsMetadata - Full problems metadata object
 * @returns Array of filter metadata for all problems with solutions
 */
function generateAgentMetadata(problemsMetadata: ProblemsMetadata): AgentFilterMetadata[] {
  return Object.entries(problemsMetadata.problems)
    .filter(([, problem]) => problem.solutions && Object.keys(problem.solutions).length > 0)
    .map(([problemId, problem]): AgentFilterMetadata => ({
      id: problemId,
      title: problem.title ?? generateTitleFromId(problemId),
      difficulty: extractDifficulty(problem.difficulty),
      topics: problem.topics ?? [],
      createdAt: problem.time_stamps.created_at,
      updatedAt: problem.time_stamps.updated_at
    }))
}

/**
 * Generates human-readable title from problem ID
 * @param problemId - Problem ID in kebab-case format
 * @returns Title in Title Case
 */
function generateTitleFromId(problemId: string): string {
  return problemId
    .split('-')
    .slice(1)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Extracts difficulty level from difficulty string
 * @param difficulty - Raw difficulty string (may include extra text)
 * @returns Normalized difficulty: 'easy', 'medium', or 'hard'
 */
function extractDifficulty(difficulty: string | undefined): Difficulty {
  const normalized = difficulty?.trim().split(/\s+/)[0].toLowerCase()

  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized
  }

  return 'medium'
}

/**
 * Formats code into MDX code block with metadata
 * @param code - Raw code string
 * @param language - Programming language for syntax highlighting
 * @param sourcePath - Path to source file for reference
 * @returns Formatted MDX code block
 */
function formatCodeBlock(code: string, language: string = 'python', sourcePath: string): string {
  const sourceAttr = ` meta="source=problems/${sourcePath}"`
  const normalizedCode = normalizeCodeWhitespace(code)
  return `\`\`\`${language}${sourceAttr}\n${normalizedCode}\n\`\`\``
}

/**
 * Normalizes code whitespace by removing excessive newlines
 * @param code - Raw code string
 * @returns Code with normalized whitespace
 */
function normalizeCodeWhitespace(code: string): string {
  return code.trim().replace(/\n{3,}/g, '\n\n')
}

/**
 * Formats content for MDX by normalizing newlines and escaping
 * @param content - Raw content string
 * @returns Formatted MDX content
 */
function formatContent(content: string): string {
  return content.trim()
    .replace(/\\n/g, '\n')
    .replace(/\n\s*\n/g, '\n\n')
}

/**
 * Formats intuition content with proper list markers
 * @param content - Raw content string
 * @returns Formatted content with list markers
 */
function formatIntuitionContent(content: string): string {
  // Check if line already has a numbered list marker (1. 2. etc)
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

/**
 * Generates MDX content for a specific section type
 * @param section - Type of section to generate
 * @param fileName - Source file name (for code snippets)
 * @param content - Raw content to format
 * @param problemId - Problem identifier for source attribution
 * @returns Formatted MDX content
 */
function generateSectionMDX(
  section: SectionType,
  fileName: string | null,
  content: string,
  problemId: string
): string {
  const sectionFormatters: Record<SectionType, () => string> = {
    definition: () => formatContent(content),
    codeSnippet: () => fileName ? formatCodeBlock(content, 'python', `${problemId}/${fileName}`) : '',
    intuition: () => formatIntuitionContent(content),
    timeComplexity: () => convertMathToKatex(formatIntuitionContent(content)),
    keyVariables: () => content,
    keyExpressions: () => content
  }

  return sectionFormatters[section]()
}

/**
 * Converts file name to PascalCase component name
 * @param fileName - Source file name (e.g., 'heap-sort.py')
 * @returns PascalCase component name (e.g., 'HeapSort')
 */
function fileNameToComponentName(fileName: string): string {
  return fileName
    .replace(/\.py$/, '')
    .split(/[-_]/)
    .map(word => capitalizeFirst(word))
    .join('')
}

/**
 * Capitalizes first letter of a string
 * @param str - Input string
 * @returns String with first letter capitalized
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generates component name from section type and optional file name
 * @param section - Section type
 * @param fileName - Optional source file name
 * @returns PascalCase component name
 */
function sectionToComponentName(section: SectionType, fileName?: string): string {
  const sectionName = capitalizeFirst(section)
  if (fileName) {
    const filePart = fileNameToComponentName(fileName)
    return `${sectionName}${filePart}`
  }
  return sectionName
}

/**
 * Generates complete problem structure including MDX sections and index component
 * @param problemId - Problem identifier
 * @param problem - Problem metadata and solutions
 * @param baseDir - Base directory for agent problems
 */
async function generateProblemStructure(
  problemId: string,
  problem: Problem,
  baseDir: string
): Promise<void> {
  const problemDir = path.join(baseDir, problemId)
  const sectionsDir = path.join(problemDir, 'sections')

  await ensureDirectoryExists(sectionsDir)

  // Generate shared definition section
  await generateDefinitionSection(sectionsDir, problem, problemId)

  // Generate solution-specific sections
  await generateSolutionSections(sectionsDir, problem, problemId)

  // Generate problem index.tsx
  await generateProblemIndex(problemId, problem, problemDir)
}

/**
 * Generates shared definition MDX file
 * @param sectionsDir - Directory for section MDX files
 * @param problem - Problem metadata
 * @param problemId - Problem identifier
 */
async function generateDefinitionSection(
  sectionsDir: string,
  problem: Problem,
  problemId: string
): Promise<void> {
  if (!problem.definition) return

  const definitionPath = path.join(sectionsDir, 'definition.mdx')
  const definitionContent = generateSectionMDX('definition', null, problem.definition, problemId)
  await fs.writeFile(definitionPath, definitionContent, 'utf-8')
}

/**
 * Generates MDX files for all solution-specific sections
 * @param sectionsDir - Directory for section MDX files
 * @param problem - Problem metadata
 * @param problemId - Problem identifier
 */
async function generateSolutionSections(
  sectionsDir: string,
  problem: Problem,
  problemId: string
): Promise<void> {
  const sectionGenerators = Object.entries(problem.solutions).flatMap(([fileName, solution]) =>
    buildSectionGenerators(sectionsDir, fileName, solution, problemId)
  )

  await Promise.all(sectionGenerators)
}

/**
 * Builds array of section file generation promises for a solution
 * @param sectionsDir - Directory for section MDX files
 * @param fileName - Solution file name
 * @param solution - Solution metadata
 * @param problemId - Problem identifier
 * @returns Array of file write promises
 */
function buildSectionGenerators(
  sectionsDir: string,
  fileName: string,
  solution: Solution,
  problemId: string
): Promise<void>[] {
  const fileBaseName = fileName.replace(/\.py$/, '')
  const generators: Promise<void>[] = []

  if (solution.code) {
    generators.push(
      writeSectionFile(sectionsDir, `codeSnippet-${fileBaseName}.mdx`,
        generateSectionMDX('codeSnippet', fileName, solution.code, problemId))
    )
  }

  if (solution.intuition) {
    generators.push(
      writeSectionFile(sectionsDir, `intuition-${fileBaseName}.mdx`,
        generateSectionMDX('intuition', null, solution.intuition, problemId))
    )
  }

  if (solution.time_complexity) {
    generators.push(
      writeSectionFile(sectionsDir, `timeComplexity-${fileBaseName}.mdx`,
        generateSectionMDX('timeComplexity', null, solution.time_complexity, problemId))
    )
  }

  if (solution.variables && Object.keys(solution.variables).length > 0) {
    generators.push(
      writeSectionFile(sectionsDir, `keyVariables-${fileBaseName}.mdx`,
        formatKeyValueList(solution.variables))
    )
  }

  if (solution.expressions && Object.keys(solution.expressions).length > 0) {
    generators.push(
      writeSectionFile(sectionsDir, `keyExpressions-${fileBaseName}.mdx`,
        formatKeyValueList(solution.expressions))
    )
  }

  return generators
}

/**
 * Writes a section MDX file
 * @param sectionsDir - Directory for section files
 * @param fileName - File name for section
 * @param content - MDX content
 */
async function writeSectionFile(
  sectionsDir: string,
  fileName: string,
  content: string
): Promise<void> {
  const filePath = path.join(sectionsDir, fileName)
  await fs.writeFile(filePath, content, 'utf-8')
}

/**
 * Formats key-value object as MDX list
 * @param keyValues - Object with key-value pairs
 * @returns Formatted MDX list string
 */
function formatKeyValueList(keyValues: Record<string, string>): string {
  return Object.entries(keyValues)
    .map(([key, value]) => `- \`${key}\`: ${value}`)
    .join('\n')
}

/**
 * Generates problem index.tsx component with lazy-loaded MDX sections
 * @param problemId - Problem identifier
 * @param problem - Problem metadata
 * @param problemDir - Problem directory path
 */
async function generateProblemIndex(
  problemId: string,
  problem: Problem,
  problemDir: string
): Promise<void> {
  const solutionFiles = Object.keys(problem.solutions)
  const defaultFile = solutionFiles[0]
  const availableSections = collectAvailableSections(problem)
  const fileSectionMap = buildFileSectionMap(problem, availableSections)

  const { imports, sections } = buildComponentImportsAndSections(
    problem,
    solutionFiles,
    // availableSections
  )

  const indexContent = generateIndexComponentContent(
    problemId,
    problem,
    solutionFiles,
    defaultFile,
    availableSections,
    fileSectionMap,
    imports,
    sections
  )

  const indexPath = path.join(problemDir, 'index.tsx')
  await fs.writeFile(indexPath, indexContent, 'utf-8')
}

/**
 * Collects all available section types across problem and solutions
 * @param problem - Problem metadata
 * @returns Set of available section types
 */
function collectAvailableSections(problem: Problem): Set<SectionType> {
  const sections = new Set<SectionType>()

  if (problem.definition) {
    sections.add('definition')
  }

  for (const solution of Object.values(problem.solutions)) {
    sections.add('codeSnippet')

    if (solution.intuition) sections.add('intuition')
    if (solution.time_complexity) sections.add('timeComplexity')
    if (solution.variables && Object.keys(solution.variables).length > 0) {
      sections.add('keyVariables')
    }
    if (solution.expressions && Object.keys(solution.expressions).length > 0) {
      sections.add('keyExpressions')
    }
  }

  return sections
}

/**
 * Builds file-to-sections mapping for tab visibility logic
 * @param problem - Problem metadata
 * @param availableSections - Set of all available sections
 * @returns Record mapping file names to their available sections
 */
function buildFileSectionMap(problem: Problem, availableSections: Set<SectionType>): Record<string, string[]> {
  const map: Record<string, string[]> = {}

  for (const [fileName, solution] of Object.entries(problem.solutions)) {
    const sections: string[] = []

    // Definition is shared across all files if it exists
    if (availableSections.has('definition')) {
      sections.push('definition')
    }

    // File-specific sections
    if (solution.code) sections.push('codeSnippet')
    if (solution.intuition) sections.push('intuition')
    if (solution.time_complexity) sections.push('timeComplexity')
    if (solution.variables && Object.keys(solution.variables).length > 0) {
      sections.push('keyVariables')
    }
    if (solution.expressions && Object.keys(solution.expressions).length > 0) {
      sections.push('keyExpressions')
    }

    map[fileName] = sections
  }

  return map
}

/**
 * Builds component imports and section JSX
 * @param problem - Problem metadata
 * @param solutionFiles - Array of solution file names
 * @param availableSections - Set of available section types
 * @returns Object with imports and sections arrays
 */
function buildComponentImportsAndSections(
  problem: Problem,
  solutionFiles: string[],
): { imports: string[]; sections: string[] } {
  const imports: string[] = []
  const sections: string[] = []

  // Helper to add lazy import
  function addLazyImport(section: SectionType, fileName?: string): string {
    const componentName = sectionToComponentName(section, fileName)
    const fileBaseName = fileName?.replace(/\.py$/, '')
    const mdxFileName = fileName
      ? `${section}-${fileBaseName}.mdx`
      : `${section}.mdx`

    imports.push(`const ${componentName} = lazy(() => import('./sections/${mdxFileName}'))`)
    return componentName
  }

  // Add shared definition section
  if (problem.definition) {
    const definitionComponent = addLazyImport('definition')
    sections.push(generateAgentSectionJSX('definition', definitionComponent))
  }

  // Add per-solution sections
  for (const fileName of solutionFiles) {
    const solution = problem.solutions[fileName]
    addSolutionSections(solution, fileName, addLazyImport, sections)
  }

  return { imports, sections }
}

/**
 * Generates JSX for an AgentSection component
 * @param section - Section type
 * @param componentName - React component name
 * @param fileName - Optional file name for file-specific sections
 * @returns JSX string
 */
function generateAgentSectionJSX(
  section: string,
  componentName: string,
  fileName?: string
): string {
  const fileAttr = fileName ? ` file="${fileName}"` : ''
  return `        <AgentSection section="${section}"${fileAttr}>
          <${componentName} />
        </AgentSection>`
}

/**
 * Adds section JSX for a solution's sections
 * @param solution - Solution metadata
 * @param fileName - Solution file name
 * @param addLazyImport - Function to add lazy import
 * @param sections - Array to append section JSX to
 */
function addSolutionSections(
  solution: Solution,
  fileName: string,
  addLazyImport: (section: SectionType, fileName?: string) => string,
  sections: string[]
): void {
  const sectionMap: Array<{
    condition: boolean
    section: SectionType
  }> = [
    { condition: Boolean(solution.code), section: 'codeSnippet' },
    { condition: Boolean(solution.intuition), section: 'intuition' },
    { condition: Boolean(solution.time_complexity), section: 'timeComplexity' },
    { condition: Boolean(solution.variables && Object.keys(solution.variables).length > 0), section: 'keyVariables' },
    { condition: Boolean(solution.expressions && Object.keys(solution.expressions).length > 0), section: 'keyExpressions' }
  ]

  for (const { condition, section } of sectionMap) {
    if (condition) {
      const componentName = addLazyImport(section, fileName)
      sections.push(generateAgentSectionJSX(section, componentName, fileName))
    }
  }
}

/**
 * Generates complete index.tsx component content
 * @param problemId - Problem identifier
 * @param problem - Problem metadata
 * @param solutionFiles - Array of solution file names
 * @param defaultFile - Default solution file
 * @param availableSections - Set of available sections
 * @param fileSectionMap - File to sections mapping
 * @param imports - Array of import statements
 * @param sections - Array of section JSX
 * @returns Complete component file content
 */
function generateIndexComponentContent(
  problemId: string,
  problem: Problem,
  solutionFiles: string[],
  defaultFile: string,
  availableSections: Set<SectionType>,
  fileSectionMap: Record<string, string[]>,
  imports: string[],
  sections: string[]
): string {
  const title = problem.title ?? generateTitleFromId(problemId)
  const difficulty = extractDifficulty(problem.difficulty)

  return `import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
${imports.join('\n')}

export default async function Problem${fileNameToComponentName(problemId)}() {
  return (
    <AgentCard
      id="${problemId}"
      title="${title}"
      difficulty="${difficulty}"
      topics={${JSON.stringify(problem.topics ?? [])}}
      solutionFiles={${JSON.stringify(solutionFiles)}}
      defaultFile="${defaultFile}"
      fileSectionMap={${JSON.stringify(fileSectionMap)}}
      leetcodeUrl="${problem.leetcode}"
    >
${sections.join('\n\n')}
    </AgentCard>
  )
}
`
}

/**
 * Generates wrapper.tsx component that lazy loads Agent.tsx
 * @param baseDir - Base directory for agent components
 */
async function generateAgentWrapper(baseDir: string): Promise<void> {
  const wrapperContent = `import { lazy, Suspense } from "react";

const AgentComponent = lazy(() => import("@/components/problems/agent/Agent"));
export default function AgentWrapper() {
  return (<Suspense fallback={<div>Loading...</div>}> <AgentComponent /> </Suspense>)
}
`

  const wrapperPath = path.join(baseDir, 'wrapper.tsx')
  await fs.writeFile(wrapperPath, wrapperContent, 'utf-8')
}

/**
 * Generates main Agent.tsx page component with all problem imports
 * @param filterMetadata - Array of problem filter metadata
 * @param baseDir - Base directory for agent components
 */
async function generateAgentTsx(
  filterMetadata: AgentFilterMetadata[],
  baseDir: string
): Promise<void> {
  const imports = generateProblemImports(filterMetadata)
  const problemComponents = generateProblemComponents(filterMetadata)
  const agentContent = buildAgentPageContent(imports, problemComponents)

  const agentPath = path.join(baseDir, 'Agent.tsx')
  await fs.writeFile(agentPath, agentContent, 'utf-8')
}

/**
 * Generates lazy import statements for all problems
 * @param filterMetadata - Array of problem filter metadata
 * @returns Formatted import statements
 */
function generateProblemImports(filterMetadata: AgentFilterMetadata[]): string {
  return filterMetadata
    .map(meta => {
      const componentName = fileNameToComponentName(meta.id)
      return `const Problem${componentName} = lazy(() => import('./${meta.id}'))`
    })
    .join('\n')
}

/**
 * Generates JSX for problem components object mapping
 * @param filterMetadata - Array of problem filter metadata
 * @returns Formatted object with problem ID keys
 */
function generateProblemComponents(filterMetadata: AgentFilterMetadata[]): string {
  const entries = filterMetadata
    .map(meta => {
      const componentName = fileNameToComponentName(meta.id)
      return `    "${meta.id}": (
      <Suspense key="${meta.id}" fallback={<div className="p-4 text-gray-500">Loading...</div>}>
        <Problem${componentName} />
      </Suspense>
    )`
    })
    .join(',\n')

  return `{\n${entries}\n  }`
}

/**
 * Builds complete Agent page component content
 * @param imports - Problem import statements
 * @param problemComponents - Problem component JSX
 * @returns Complete component file content
 */
function buildAgentPageContent(imports: string, problemComponents: string): string {
  return `import { AgentProblemsView, type AgentMetadata } from '@/components/agent'
import { lazy, Suspense, cache } from 'react'

/**
 * Server component - renders all problem cards.
 * Generated by scripts/generate-agent-mdx.ts
 *
 * Architecture (React 19 + Next.js 15.6 streaming):
 * - AgentProblemsView: Client wrapper with filter state, uses use() for promise
 * - Each problem: Pure server component with lazy MDX sections
 * - Filtering: React 19 Activity component handles visibility without re-render
 * - Metadata: Streamed promise, non-blocking
 * - No await blocking, everything streams independently
 */

// Cached metadata loader - returns promise, doesn't block
const getAgentMetadata = cache(() =>
  import('@/lib/extracted-metadata/agent-metadata.json')
    .then(module => module.default as AgentMetadata[])
)

// Lazy imports for all problems
${imports}

// Problem components mapped by ID for O(1) lookup
const problemComponents = ${problemComponents}

export default async function Agent() {
  const agentMetadata = await getAgentMetadata()

  return (
    <AgentProblemsView
      metadata={agentMetadata}
      problemComponents={problemComponents}
    />
  )
}
`
}

/**
 * Main entry point for agent MDX generation
 * Orchestrates the complete generation workflow:
 * 1. Reads problems metadata
 * 2. Generates filter metadata JSON
 * 3. Creates problem structure (folders, MDX files, components)
 * 4. Generates main Agent page component
 */
async function main(): Promise<void> {
  try {
    logStart()

    const problemsMetadata = await loadProblemsMetadata()
    logProblemsCount(problemsMetadata)

    const filterMetadata = await generateAndWriteFilterMetadata(problemsMetadata)
    await generateAllProblemStructures(filterMetadata, problemsMetadata)
    await generateMainAgentPage(filterMetadata)

    logSuccess(filterMetadata.length)
  } catch (error) {
    handleError(error)
  }
}

/**
 * Logs generation start message
 */
function logStart(): void {
  console.log('🚀 Starting agent MDX generation...\n')
}

/**
 * Loads and parses problems metadata from JSON file
 * @returns Parsed problems metadata object
 * @throws {Error} If file cannot be read or parsed
 */
async function loadProblemsMetadata(): Promise<ProblemsMetadata> {
  const metadataPath = path.join(__dirname, '..', 'lib', 'extracted-metadata', 'problems_metadata.json')
  const metadataContent = await fs.readFile(metadataPath, 'utf-8')
  return JSON.parse(metadataContent)
}

/**
 * Logs count of problems found
 * @param problemsMetadata - Problems metadata object
 */
function logProblemsCount(problemsMetadata: ProblemsMetadata): void {
  console.log(`📖 Found ${Object.keys(problemsMetadata.problems).length} problems\n`)
}

/**
 * Generates filter metadata and writes to JSON file
 * @param problemsMetadata - Full problems metadata
 * @returns Generated filter metadata array
 */
async function generateAndWriteFilterMetadata(
  problemsMetadata: ProblemsMetadata
): Promise<AgentFilterMetadata[]> {
  const filterMetadata = generateAgentMetadata(problemsMetadata)

  const agentMetadataPath = path.join(__dirname, '..', 'lib', 'extracted-metadata', 'agent-metadata.json')
  await fs.writeFile(agentMetadataPath, JSON.stringify(filterMetadata, null, 2), 'utf-8')

  console.log(`✅ Generated agent-metadata.json (${filterMetadata.length} problems)\n`)

  return filterMetadata
}

/**
 * Generates all problem structures (folders, MDX, components)
 * @param filterMetadata - Array of problem filter metadata
 * @param problemsMetadata - Full problems metadata
 */
async function generateAllProblemStructures(
  filterMetadata: AgentFilterMetadata[],
  problemsMetadata: ProblemsMetadata
): Promise<void> {
  const baseDir = path.join(__dirname, '..', 'components', 'problems', 'agent')
  await ensureDirectoryExists(baseDir)

  for (const metadata of filterMetadata) {
    const problem = problemsMetadata.problems[metadata.id]
    await generateProblemStructure(metadata.id, problem, baseDir)
    console.log(`✅ Generated ${metadata.id}/`)
  }
}

/**
 * Generates main Agent.tsx page component and wrapper
 * @param filterMetadata - Array of problem filter metadata
 */
async function generateMainAgentPage(filterMetadata: AgentFilterMetadata[]): Promise<void> {
  const baseDir = path.join(__dirname, '..', 'components', 'problems', 'agent')
  await generateAgentWrapper(baseDir)
  await generateAgentTsx(filterMetadata, baseDir)
  console.log(`\n✅ Generated wrapper.tsx`)
  console.log(`✅ Generated Agent.tsx\n`)
}

/**
 * Logs successful completion
 * @param problemCount - Number of problems generated
 */
function logSuccess(problemCount: number): void {
  console.log(`🎉 Successfully generated agent structure for ${problemCount} problems!`)
}

/**
 * Handles and logs errors, then exits process
 * @param error - Error object
 */
function handleError(error: unknown): void {
  console.error('❌ Error generating agent MDX:', error)
  process.exit(1)
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
