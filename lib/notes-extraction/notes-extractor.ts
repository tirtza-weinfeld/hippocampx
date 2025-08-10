import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

import type { NotesDictionary } from './types'
import { processMdxFile } from './mdx-processor'

/**
 * Main notes extraction function that processes all MDX files
 * and creates a searchable dictionary
 */
export async function extractNotesContent(): Promise<NotesDictionary> {
  try {
    // Find all MDX files in the notes directory
    const notesDir = path.join(process.cwd(), 'app/notes')
    const mdxFiles = await glob('**/page.mdx', { cwd: notesDir, absolute: true })
    
    console.log(`Found ${mdxFiles.length} MDX files to process...`)
    
    const dictionary: NotesDictionary = {}
    
    // Process each file
    for (const filePath of mdxFiles) {
      console.log(`Processing: ${path.relative(process.cwd(), filePath)}`)
      
      const content = await processMdxFile(filePath)
      if (content) {
        // Use the folder name as the key
        const key = path.basename(path.dirname(filePath))
        dictionary[key] = content
        
        console.log(`  ✓ Extracted: ${content.title}`)
        console.log(`    - ${content.headings.length} headings`)
        console.log(`    - ${content.codeBlocks.length} code blocks`)
        console.log(`    - ${content.keyTerms.length} key terms: ${content.keyTerms.slice(0, 5).join(', ')}${content.keyTerms.length > 5 ? '...' : ''}`)
        console.log(`    - ${content.notations.length} notations: ${content.notations.slice(0, 3).join(', ')}${content.notations.length > 3 ? '...' : ''}`)
        console.log(`    - Categories: ${content.categories.join(', ')}`)
      }
    }
    
    return dictionary
    
  } catch (error) {
    console.error('Error during extraction:', error)
    throw error
  }
}

/**
 * Extract notes content and save to JSON file
 */
export async function extractAndSaveNotesContent(outputPath?: string): Promise<void> {
  try {
    const dictionary = await extractNotesContent()
    
    // Ensure output directory exists
    const defaultOutputPath = path.join(process.cwd(), 'lib/extracted-metadata/notes_dictionary.json')
    const finalOutputPath = outputPath || defaultOutputPath
    const outputDir = path.dirname(finalOutputPath)
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // Write the dictionary to JSON
    fs.writeFileSync(finalOutputPath, JSON.stringify(dictionary, null, 2))
    
    console.log(`\n✅ Successfully extracted content for ${Object.keys(dictionary).length} notes`)
    console.log(`📝 Output written to: ${path.relative(process.cwd(), finalOutputPath)}`)
    
  } catch (error) {
    console.error('Error during extraction and save:', error)
    process.exit(1)
  }
}