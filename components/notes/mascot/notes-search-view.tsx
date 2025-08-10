"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ExternalLink, ArrowRight } from "lucide-react"
import { generateCategoryColor } from "./notes-data"
import { ParsedSnippet } from "./parsed-snippet"

import type { NotesDictionary, NotesContent } from "@/lib/notes-extraction/types"

interface SearchResult {
  noteKey: string
  note: NotesContent
  matches: Array<{
    type: 'title' | 'heading' | 'content' | 'code' | 'notation' | 'keyterm'
    text: string
    context: string
    section?: string
  }>
}

export function NotesSearchView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [notesDictionary, setNotesDictionary] = useState<NotesDictionary>({})
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  // Load the notes dictionary
  useEffect(() => {
    const loadNotesDictionary = async () => {
      try {
        // In a real app, this would be an API call or static import
        const response = await fetch('/api/notes-dictionary')
        if (response.ok) {
          const data = await response.json()
          setNotesDictionary(data)
        } else {
          // Fallback: try to load from static file
          const module = await import('@/lib/extracted-metadata/notes_dictionary.json')
          setNotesDictionary(module.default as NotesDictionary)
        }
      } catch (error) {
        console.error('Failed to load notes dictionary:', error)
        // Could show an error state here
      } finally {
        setLoading(false)
      }
    }

    loadNotesDictionary()
  }, [])

  // Perform full-text search across all notes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    const results: SearchResult[] = []
    const query = searchTerm.toLowerCase().trim()
    
    // For numeric searches, be more flexible with matching
    const isNumericQuery = /^\d+$/.test(query)

    Object.entries(notesDictionary).forEach(([key, note]) => {
      const matches: SearchResult['matches'] = []

      // Helper function for better matching - focus on important content
      const matchesQuery = (text: string) => {
        const lowerText = text.toLowerCase()
        
        // Simple contains check for most cases
        if (lowerText.includes(query)) {
          return true
        }
        
        // Special handling for numeric queries (LeetCode problems)
        if (isNumericQuery) {
          // Match LeetCode problem numbers in links like "[208. Problem Name]" or "208."
          return /\[\d+\.|\d+\./.test(text) && text.includes(query)
        }
        
        return false
      }

      // Search in title
      if (matchesQuery(note.title)) {
        matches.push({
          type: 'title',
          text: note.title,
          context: note.title,
        })
      }

      // Search in headings
      note.headings.forEach(heading => {
        if (matchesQuery(heading)) {
          matches.push({
            type: 'heading',
            text: heading,
            context: heading,
            section: heading,
          })
        }
      })

      // Search important content patterns - focus on key elements
      const textLines = note.text.split('\n')
      textLines.forEach((line, index) => {
        const trimmedLine = line.trim()
        if (trimmedLine.length === 0) return
        
        // Focus on important patterns
        const isLeetCodeLink = /\[\d+\..*?\]\(https:\/\/leetcode\.com/.test(trimmedLine)
        const isTimeComplexity = /time.*complexity|O\(|space.*complexity/i.test(trimmedLine)
        const isHeading = /^#{1,6}\s/.test(trimmedLine) || /^\d+\.\s+[A-Z]/.test(trimmedLine)
        const isImportantLine = isLeetCodeLink || isTimeComplexity || isHeading
        
        // Only search important lines or if query matches
        if (isImportantLine || matchesQuery(trimmedLine)) {
          // Skip if already found in headings
          const alreadyFoundInHeadings = matches.some(m => 
            m.type === 'heading' && m.text.toLowerCase() === trimmedLine.toLowerCase()
          )
          
          if (!alreadyFoundInHeadings && matchesQuery(trimmedLine)) {
            const context = textLines.slice(Math.max(0, index - 1), index + 2).join('\n')
            
            let matchType: 'heading' | 'content' = 'content'
            if (isHeading) matchType = 'heading'
            
            matches.push({
              type: matchType,
              text: trimmedLine,
              context: context.length > 200 ? context.slice(0, 200) + '...' : context,
              section: isHeading ? trimmedLine : undefined,
            })
          }
        }
      })

      // Skip code blocks for now - user requested to exclude them

      // Search in notations
      note.notations.forEach(notation => {
        if (matchesQuery(notation)) {
          matches.push({
            type: 'notation',
            text: notation,
            context: `Mathematical notation: ${notation}`,
          })
        }
      })

      // Search in key terms
      note.keyTerms.forEach(term => {
        if (matchesQuery(term)) {
          matches.push({
            type: 'keyterm',
            text: term,
            context: `Key term: ${term}`,
          })
        }
      })

      if (matches.length > 0) {
        results.push({ noteKey: key, note, matches })
      }
    })

    setSearchResults(results)
  }, [searchTerm, notesDictionary])

  const navigateToNote = (note: NotesContent, section?: string) => {
    let url = note.route
    if (section) {
      // Create anchor that matches MDX heading structure
      // Remove numbers and special characters, keep only letters and spaces, then convert to kebab-case
      const anchor = section
        .replace(/^\d+\.\s*/, '') // Remove leading numbers like "208. "
        .replace(/[^\w\s-]/g, ' ') // Replace special chars with spaces
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-') // Convert spaces to hyphens
        .replace(/-+/g, '-') // Collapse multiple hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      url += `#${anchor}`
    }
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
        <p className="text-sm text-muted-foreground mt-2">Loading notes...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search: '208', 'O(n)', 'binary', etc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-800"
        />
      </div>

      {/* Search Stats */}
      {searchTerm && (
        <div className="mb-3 text-xs text-muted-foreground">
          {searchResults.length === 0 
            ? `No results for "${searchTerm}"`
            : `${searchResults.reduce((acc, r) => acc + r.matches.length, 0)} matches in ${searchResults.length} notes`
          }
        </div>
      )}

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {!searchTerm ? (
          <div className="text-center py-8">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Search Navigation</h4>
              <p className="text-xs text-muted-foreground">
                Find specific content across all notes
              </p>
              <div className="mt-4 space-y-2 text-xs">
                <div className="text-muted-foreground">Try searching for:</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {["208", "O(n)", "binary", "dijkstra", "kadane"].map((example) => (
                    <button
                      key={example}
                      onClick={() => setSearchTerm(example)}
                      className="px-2 py-1 rounded-lg border text-muted-foreground hover:bg-muted/50 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-8">
            <Search className="mx-auto h-8 w-8 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">No matches found for "{searchTerm}"</p>
          </div>
        ) : (
          searchResults.map((result) => (
            <div key={result.noteKey} className={`rounded-lg border-l-4 ${generateCategoryColor(result.note.categories[0] || 'default')} overflow-hidden`}>
              {/* Note Header */}
              <div className="p-3 bg-black/5 dark:bg-white/5 border-b border-current/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm">{result.note.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => navigateToNote(result.note)}
                    className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    title={`Open ${result.note.title}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Matches */}
              <div className="divide-y divide-current/10">
                {result.matches.slice(0, 5).map((match, matchIndex) => (
                  <div 
                    key={matchIndex} 
                    className="p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => navigateToNote(result.note, match.section)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {/* Match Type Badge */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            match.type === 'title' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                            match.type === 'heading' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' :
                            match.type === 'code' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                            match.type === 'notation' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
                          }`}>
                            {match.type}
                          </span>
                          {match.section && (
                            <span className="text-xs text-muted-foreground">in {match.section}</span>
                          )}
                        </div>

                        {/* Match Content */}
                        <div className="text-xs">
                          {match.type === 'code' ? (
                            <code className="block bg-black/10 dark:bg-white/10 p-2 rounded font-mono whitespace-pre-wrap">
                              {match.context.length > 200 ? match.context.slice(0, 200) + '...' : match.context}
                            </code>
                          ) : (
                            <ParsedSnippet
                              className="text-muted-foreground"
                              text={match.context.length > 150 ? match.context.slice(0, 150) + '...' : match.context}
                            />
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                ))}
                
                {result.matches.length > 5 && (
                  <div className="p-3 text-center">
                    <button
                      onClick={() => navigateToNote(result.note)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      +{result.matches.length - 5} more matches in {result.note.title}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}