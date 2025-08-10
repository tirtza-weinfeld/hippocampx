#!/usr/bin/env tsx

/**
 * Notes Content Extraction Script
 * 
 * Processes MDX files in /app/notes/ through the same remark pipeline
 * as Next.js, resolving code imports and extracting searchable content.
 * 
 * Usage: pnpm extract-notes
 */

import { fileURLToPath } from 'url'
import { extractAndSaveNotesContent } from '../lib/notes-extraction/notes-extractor.js'

// Run the extraction if this is the main module
const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) {
  console.log('🔍 Starting notes content extraction...\n')
  extractAndSaveNotesContent()
}