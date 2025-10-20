#!/usr/bin/env node

/**
 * Generate MDX component files for problems from problems_metadata.json
 * 
 * This script reads the new problems metadata JSON file and creates individual MDX components
 * for each problem in the components/problems directory structure.
 * These components are then used by the dynamic route app/problems/[slug]/page.tsx
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { convertMathToKatex } from '../lib/utils/math-to-katex'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Solution {
  code: string,
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
}

type ProblemsMetadata = Record<string, Problem>

function formatSection(title: string, content: string, component?: string, headerLevel: string = '##'): string {
  if (!content?.trim()) return ''


  // Clean up content - handle escaped newlines and normalize formatting
  let cleanContent = content.trim()
    .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
    .replace(/\n\s*\n/g, '\n\n') // Normalize double newlines

  // Special formatting for intuition and complexity sections
  if (component === 'ProblemIntuition') {
    cleanContent = formatIntuitionContent(cleanContent)
  } else if (component === 'ProblemTimeComplexity' || component === 'ProblemSpaceComplexity') {
    cleanContent = convertMathToKatex(formatIntuitionContent(cleanContent))
  } else {
    // Wrap terms before colons in inline code blocks (e.g., "- pq:" becomes "- `pq`:"), but skip if already wrapped
    cleanContent = cleanContent.replace(/^(\s*-\s*)([^`:\s][^:\s]*)(\s*:)/gm, '$1`$2`$3')
  }

  const headerText = component ? `${headerLevel} [!(${component})] ${title}` : `${headerLevel} ${title}`
  return `${headerText}\n\n${cleanContent}\n\n`
}

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


function formatCodeBlock(code: string, language: string = 'python', sourcePath?: string): string {
  const sourceAttr = sourcePath ? ` meta="source=problems/${sourcePath}"` : ''
  // Normalize consecutive newlines (3+ newlines -> 2 newlines = 1 blank line)
  const normalizedCode = code.trim().replace(/\n{3,}/g, '\n\n')
  return `\`\`\`${language}${sourceAttr}\n${normalizedCode}\n\`\`\`\n\n`
}

function formatVariables(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([key, value]) => `- \`${key}\`: ${value}`)
    .join('\n')
}

function formatArgs(args: Record<string, string>): string {
  return Object.entries(args)
    .map(([key, value]) => `- \`${key}\`: ${value}`)
    .join('\n')
}

function formatExpressions(expressions: Record<string, string>): string {
  return Object.entries(expressions)
    .map(([key, value]) => {
      // The key is already the expression, so wrap it in backticks
      return `- \`${key}\`: ${value}`
    })
    .join('\n')
}


function solutionFileNameToTitle(fileName: string): string {
  // Remove .py extension
  const nameWithoutExt = fileName.replace(/\.py$/, '')
  
  // Convert snake_case or kebab-case to Title Case
  return nameWithoutExt
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + ' Solution'
}

function generateSolutionContent(
  problemId: string,
  fileName: string,
  solution: Solution,
  additionalSnippets?: Array<{ fileName: string; solution: Solution }>
): string {
  const solutionTitle = solutionFileNameToTitle(fileName)
  let content = `## ${solutionTitle}\n\n`

  // Add intuition if available
  if (solution.intuition) {
    content += formatSection('Intuition', solution.intuition, 'ProblemIntuition', '###')
  }

  // Add complexity analysis
  if (solution.time_complexity) {
    content += formatSection('Time Complexity', solution.time_complexity, 'ProblemTimeComplexity', '###')
  }

  // if (solution.space_complexity) {
  //   content += formatSection('Space Complexity', solution.space_complexity, 'ProblemSpaceComplexity', '###')
  // }

  // Add variables if available
  if (solution.variables && Object.keys(solution.variables).length > 0) {
    const variablesString = formatVariables(solution.variables)
    if (variablesString.trim()) {
      content += formatSection('Key Variables', variablesString, 'ProblemKeyVariables', '###')
    }
  }

  // Add expressions if available
  if (solution.expressions && Object.keys(solution.expressions).length > 0) {
    const expressionsString = formatExpressions(solution.expressions)
    if (expressionsString.trim()) {
      content += formatSection('Key Expressions', expressionsString, 'ProblemKeyExpressions', '###')
    }
  }

  // Add returns if available
  if (solution.returns && solution.returns.trim()) {
    content += formatSection('Returns', solution.returns, 'ProblemReturns', '###')
  }

  // Add code implementation (using CodeTabs if there are additional snippets)
  if (solution.code) {
    const sourcePath = `${problemId}/${fileName}`

    if (additionalSnippets && additionalSnippets.length > 0) {
      // Use CodeTabs for multiple code snippets
      content += `### [!CodeTabs] Code Snippet\n\n`

      // Add main code block
      content += formatCodeBlock(solution.code, 'python', sourcePath)

      // Add additional snippets
      for (const { fileName: snippetFileName, solution: snippetSolution } of additionalSnippets) {
        const snippetSourcePath = `${problemId}/${snippetFileName}`
        content += formatCodeBlock(snippetSolution.code, 'python', snippetSourcePath)
      }
    } else {
      // Single code snippet
      content += formatSection('Code Snippet', formatCodeBlock(solution.code, 'python', sourcePath), 'ProblemCodeSnippet', '###')
    }
  }

  return content
}

function generateMDXContent(problemId: string, problem: Problem): string {
  const title = problem.title || problemId.split('-').slice(1).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
  
  let content = `# ${title}\n\n`
  content += `## Resizable Table Of contents\n\n`
  
  // Add difficulty badge if available - clean the difficulty value
  if (problem.difficulty && problem.difficulty.trim()) {
    // Clean difficulty value - extract only the first word if corrupted
    const cleanDifficulty = problem.difficulty.trim().split(/\s+/)[0].toLowerCase()
    if (['easy', 'medium', 'hard'].includes(cleanDifficulty)) {
      content += `<DifficultyBadge difficulty="${cleanDifficulty}" />\n\n`
    }
  }
  
  // Add topics if available
  if (problem.topics && Array.isArray(problem.topics) && problem.topics.length > 0) {
    const topicsString = problem.topics.map(topic => `"${topic}"`).join(', ')
    content += `<PillList pills={[${topicsString}]} />\n\n`
  }
  
  // Add LeetCode link
  if (problem.leetcode) {
    // Extract problem number from problemId (e.g., "713-subarray-product-less-than-k" -> "713")
    const problemNumber = problemId.match(/^(\d+)-/)?.[1]

    // Extract problem number and title from the URL or use the title
    const urlMatch = problem.leetcode.match(/leetcode\.com\/problems\/([^\/]+)/)
    if (urlMatch) {
      const linkTitle = problemNumber ? `${problemNumber}. ${title}` : title
      content += `[${linkTitle}](${problem.leetcode})\n\n`
    } else {
      // Fallback to plain link if URL doesn't match expected format
      content += `${problem.leetcode}\n\n`
    }
  }
  
  // Add definition if available
  if (problem.definition && problem.definition.trim()) {
    content += formatSection('Definition', problem.definition, 'ProblemDefinition')
  }
  
  // Handle solutions - process group structure if present
  let solutionsToGenerate: Array<{
    fileName: string
    solution: Solution
    additionalSnippets?: Array<{ fileName: string; solution: Solution }>
  }> = []

  if (problem.group && problem.group.length > 0) {
    // Process grouped solutions
    for (const group of problem.group) {
      if (group.length > 0) {
        // First file in group is the main solution
        const mainFileName = group[0]
        const mainSolution = problem.solutions[mainFileName]

        if (mainSolution) {
          // Remaining files in group are additional snippets
          const additionalSnippets = group.slice(1)
            .map(fileName => ({
              fileName,
              solution: problem.solutions[fileName]
            }))
            .filter(item => item.solution) // Filter out any missing solutions

          solutionsToGenerate.push({
            fileName: mainFileName,
            solution: mainSolution,
            additionalSnippets: additionalSnippets.length > 0 ? additionalSnippets : undefined
          })
        }
      }
    }
  } else {
    // No grouping - process all solutions normally
    const solutionEntries = Object.entries(problem.solutions)
    solutionsToGenerate = solutionEntries.map(([fileName, solution]) => ({
      fileName,
      solution
    }))
  }

  if (solutionsToGenerate.length === 1) {
    // Single solution - don't add solution title, just add the content directly
    const { fileName, solution, additionalSnippets } = solutionsToGenerate[0]

    // Add intuition if available
    if (solution.intuition) {
      content += formatSection('Intuition', solution.intuition, 'ProblemIntuition')
    }

    // Add complexity analysis
    if (solution.time_complexity) {
      content += formatSection('Time Complexity', solution.time_complexity, 'ProblemTimeComplexity')
    }

    // if (solution.space_complexity) {
    //   content += formatSection('Space Complexity', solution.space_complexity, 'ProblemSpaceComplexity')
    // }

    // Add args if available
    if (solution.args && Object.keys(solution.args).length > 0) {
      const argsString = formatArgs(solution.args)
      if (argsString.trim()) {
        content += formatSection('Key Arguments', argsString, 'ProblemArguments')
      }
    }

    // Add variables if available
    if (solution.variables && Object.keys(solution.variables).length > 0) {
      const variablesString = formatVariables(solution.variables)
      if (variablesString.trim()) {
        content += formatSection('Key Variables', variablesString, 'ProblemKeyVariables')
      }
    }

    // Add expressions if available
    if (solution.expressions && Object.keys(solution.expressions).length > 0) {
      const expressionsString = formatExpressions(solution.expressions)
      if (expressionsString.trim()) {
        content += formatSection('Key Expressions', expressionsString, 'ProblemKeyExpressions')
      }
    }

    // Add returns if available
    if (solution.returns && solution.returns.trim()) {
      content += formatSection('Returns', solution.returns, 'ProblemReturns')
    }

    // Add code implementation (with tabs if additional snippets exist)
    if (solution.code) {
      const sourcePath = `${problemId}/${fileName}`

      if (additionalSnippets && additionalSnippets.length > 0) {
        // Use CodeTabs for multiple code snippets
        content += `## [!CodeTabs] Code Snippet\n\n`

        // Add main code block
        content += formatCodeBlock(solution.code, 'python', sourcePath)

        // Add additional snippets
        for (const { fileName: snippetFileName, solution: snippetSolution } of additionalSnippets) {
          const snippetSourcePath = `${problemId}/${snippetFileName}`
          content += formatCodeBlock(snippetSolution.code, 'python', snippetSourcePath)
        }
      } else {
        // Single code snippet
        content += formatSection('Code Snippet', formatCodeBlock(solution.code, 'python', sourcePath), 'ProblemCodeSnippet')
      }
    }
  } else {
    // Multiple solutions - add each solution with its own title
    for (const { fileName, solution, additionalSnippets } of solutionsToGenerate) {
      content += generateSolutionContent(problemId, fileName, solution, additionalSnippets)
      content += '\n---\n\n' // Add separator between solutions
    }

    // Remove trailing separator
    content = content.replace(/\n---\n\n$/, '')
  }
  
  return content
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

function generateComponentRegistry(problemIds: string[]): string {
  let content = `// Auto-generated component registry for problem MDX components\n\n`
  
  // Generate dynamic imports for main components
  content += `export const problemComponents = {\n`
  for (const problemId of problemIds) {
    content += `  '${problemId}': () => import('./${problemId}.mdx'),\n`
  }
  content += `} as const\n\n`
  
  // Generate type-safe slug list
  content += `export const problemSlugs = [\n`
  for (const problemId of problemIds) {
    content += `  '${problemId}',\n`
  }
  content += `] as const\n\n`
  
  content += `export type ProblemSlug = typeof problemSlugs[number]\n\n`
  
  return content
}

async function main(): Promise<void> {
  try {
    // Read the problems metadata
    const metadataPath = path.join(__dirname, '..', 'lib', 'extracted-metadata', 'problems_metadata.json')
    const metadataContent = await fs.readFile(metadataPath, 'utf-8')
    const problemsMetadata: ProblemsMetadata = JSON.parse(metadataContent).problems
    
    console.log(`Found ${Object.keys(problemsMetadata).length} problems to generate MDX files for`)
    
    // Ensure the problems/tutorials components directory exists
    const problemsDir = path.join(__dirname, '..', 'components', 'problems', 'tutorials')
    await ensureDirectoryExists(problemsDir)
    
    let generatedCount = 0
    const problemIds: string[] = []
    
    // Generate MDX component for each problem
    for (const [problemId, problem] of Object.entries(problemsMetadata)) {
      // Skip problems without solutions
      if (!problem.solutions || Object.keys(problem.solutions).length === 0) {
        console.log(`Skipping ${problemId}: No solutions found`)
        continue
      }
      
      const mdxContent = generateMDXContent(problemId, problem)
      
      // Write MDX file
      const componentPath = path.join(problemsDir, `${problemId}.mdx`)
      await fs.writeFile(componentPath, mdxContent, 'utf-8')
      
      problemIds.push(problemId)
      generatedCount++
      
      const solutionCount = Object.keys(problem.solutions).length
      console.log(`Generated: ${problemId}.mdx (${solutionCount} solution${solutionCount > 1 ? 's' : ''})`)
    }
    
    console.log(`\n✅ Successfully generated ${generatedCount} MDX components in ${problemsDir}`)
    
    // Generate component registry for dynamic imports
    const registryContent = generateComponentRegistry(problemIds)
    const registryPath = path.join(problemsDir, 'index.ts')
    await fs.writeFile(registryPath, registryContent, 'utf-8')
    console.log(`Generated components registry: index.ts`)
    
    // Generate the problems index page
    await generateProblemsIndexPage(problemsMetadata)
    console.log(`Generated problems index page at app/problems/page.mdx`)

    // Generate the routes file
    await generateRoutesFile(problemsMetadata)
    console.log(`Generated routes file at lib/problems-routes.ts`)

  } catch (error) {
    console.error('Error generating MDX files:', error)
    process.exit(1)
  }
}

function generateProblemsIndexContent(problemsMetadata: ProblemsMetadata): string {
  let content = `# Algorithm Problems\n\n`
  content += `Collection of ${Object.keys(problemsMetadata).length} algorithm problems with explanations and solutions.\n\n`

  // Create a single flat list of all problems
  const allProblems: Array<{ id: string; problem: Problem }> = []

  for (const [problemId, problem] of Object.entries(problemsMetadata)) {
    allProblems.push({ id: problemId, problem })
  }

  // Sort all problems alphabetically by name (without number prefix)
  const sortedProblems = allProblems.sort((a, b) => {
    // Extract problem name without number prefix for sorting
    const getNameForSorting = (problem: Problem, id: string) => {
      if (problem.title) {
        return problem.title.toLowerCase()
      }
      // Remove number prefix from ID (e.g., "39-combination-sum" -> "combination sum")
      return id.replace(/^\d+-/, '').replace(/-/g, ' ').toLowerCase()
    }

    const aName = getNameForSorting(a.problem, a.id)
    const bName = getNameForSorting(b.problem, b.id)

    return aName.localeCompare(bName)
  })

  for (const [index, { id: problemId, problem }] of sortedProblems.entries()) {
    // Clean title - remove any corrupted content
    let title = problem.title || problemId.split('-').slice(1).join(' ').replace(/\b\w/g, l => l.toUpperCase())

    // If title contains line breaks or strange characters, fall back to problem ID
    if (title.includes('\n') || title.length > 100) {
      title = problemId.split('-').slice(1).join(' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    // Clean difficulty - extract only valid values
    let difficulty = 'medium' // default
    if (problem.difficulty) {
      const cleanDiff = problem.difficulty.trim().split(/\s+/)[0].toLowerCase()
      if (['easy', 'medium', 'hard'].includes(cleanDiff)) {
        difficulty = cleanDiff
      }
    }

    const slug = problemId // The problemId is already the slug

    // Create difficulty badge
    const difficultyBadge = `<DifficultyBadge difficulty="${difficulty}" size="sm" />`

    // Format link with problem number if available
    // const linkText = problemNumber ? `${problemNumber}. ${title}` : title

    // content += `${index+1}. [${linkText}](/problems/${slug}) ${difficultyBadge}\n`
    content += `${index+1}. [${title}](/problems/${slug}) ${difficultyBadge}\n`
  }

  return content
}

async function generateProblemsIndexPage(problemsMetadata: ProblemsMetadata): Promise<void> {
  const indexContent = generateProblemsIndexContent(problemsMetadata)
  const indexPath = path.join(__dirname, '..', 'app', 'problems', 'page.mdx')

  // Ensure the app/problems directory exists
  const problemsDir = path.dirname(indexPath)
  await ensureDirectoryExists(problemsDir)

  await fs.writeFile(indexPath, indexContent, 'utf-8')
}

function getDifficultyColor(difficulty: string): { color: string; bgColor: string } {
  const cleanDiff = difficulty?.trim().split(/\s+/)[0].toLowerCase()
  switch (cleanDiff) {
    case 'easy':
      return { color: "text-green-500", bgColor: "bg-green-500/10" }
    case 'medium':
      return { color: "text-orange-500", bgColor: "bg-orange-500/10" }
    case 'hard':
      return { color: "text-red-500", bgColor: "bg-red-500/10" }
    default:
      return { color: "text-orange-500", bgColor: "bg-orange-500/10" }
  }
}

function generateRoutesContent(problemsMetadata: ProblemsMetadata): string {
  let content = `import { Code, SquareFunction } from "lucide-react"\n`
  content += `import { NavigationItem } from "./routes"\n\n`
  content += `export const PROBLEMS_ROUTES: NavigationItem[] = [\n`
  content += `    {\n`
  content += `        title: 'Problems', href: '/problems', icon: SquareFunction, color: "text-yellow-500", bgColor: "bg-yellow-500/10",\n`
  content += `        children: [\n`

  // Create a sorted list of problems
  const sortedProblems = Object.entries(problemsMetadata)
    .filter(([, problem]) => problem.solutions && Object.keys(problem.solutions).length > 0)
    .sort((a, b) => {
      const getNameForSorting = (problem: Problem, id: string) => {
        if (problem.title) {
          return problem.title.toLowerCase()
        }
        return id.replace(/^\d+-/, '').replace(/-/g, ' ').toLowerCase()
      }

      const aName = getNameForSorting(a[1], a[0])
      const bName = getNameForSorting(b[1], b[0])
      return aName.localeCompare(bName)
    })

  for (const [problemId, problem] of sortedProblems) {
    // Clean title
    let title = problem.title || problemId.split('-').slice(1).join(' ').replace(/\b\w/g, l => l.toUpperCase())

    // If title contains line breaks or strange characters, fall back to problem ID
    if (title.includes('\n') || title.length > 100) {
      title = problemId.split('-').slice(1).join(' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const { color, bgColor } = getDifficultyColor(problem.difficulty || 'medium')

    content += `            { title: '${title.replace(/'/g, "\\'")}', href: '/problems/${problemId}', icon: Code, color: "${color}", bgColor: "${bgColor}" },\n`
  }

  content += `        ],\n`
  content += `    },\n`
  content += `]\n`

  return content
}

async function generateRoutesFile(problemsMetadata: ProblemsMetadata): Promise<void> {
  const routesContent = generateRoutesContent(problemsMetadata)
  const routesPath = path.join(__dirname, '..', 'lib', 'problems-routes.ts')

  await fs.writeFile(routesPath, routesContent, 'utf-8')
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}