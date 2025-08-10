import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET() {
  try {
    const dictionaryPath = path.join(process.cwd(), 'lib/extracted-metadata/notes_dictionary.json')
    
    if (!fs.existsSync(dictionaryPath)) {
      return NextResponse.json(
        { error: 'Notes dictionary not found. Run `pnpm extract-notes` to generate it.' },
        { status: 404 }
      )
    }
    
    const dictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'))
    
    return NextResponse.json(dictionary)
  } catch (error) {
    console.error('Error loading notes dictionary:', error)
    return NextResponse.json(
      { error: 'Failed to load notes dictionary' },
      { status: 500 }
    )
  }
}