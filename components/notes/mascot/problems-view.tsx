"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"

import type { NotesDictionary, NotesContent } from "@/lib/notes-extraction/types"

interface LeetCodeProblem {
  noteKey: string
  note: NotesContent
  sectionTitle: string
  problemNumber: string
  problemName: string
  problemUrl: string
  section: string
}

export function ProblemsView() {
  const [notesDictionary, setNotesDictionary] = useState<NotesDictionary>({})
  const [loading, setLoading] = useState(true)
  const [problems, setProblems] = useState<LeetCodeProblem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProblems, setFilteredProblems] = useState<LeetCodeProblem[]>([])

  // Load the notes dictionary
  useEffect(() => {
    const loadNotesDictionary = async () => {
      try {
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
      } finally {
        setLoading(false)
      }
    }

    loadNotesDictionary()
  }, [])

  // Extract all LeetCode problems from the pre-processed notes dictionary
  useEffect(() => {
    const extractProblemsFromDictionary = () => {
      const extractedProblems: LeetCodeProblem[] = []

      for (const [key, note] of Object.entries(notesDictionary)) {
        // Use the pre-extracted LeetCode problems from the notes dictionary
        if (note.leetcodeProblems) {
          for (const problem of note.leetcodeProblems) {
            extractedProblems.push({
              noteKey: key,
              note,
              sectionTitle: problem.section,
              problemNumber: problem.number,
              problemName: problem.name,
              problemUrl: problem.url,
              section: problem.section,
            })
          }
        }
      }

      // Sort by problem number
      extractedProblems.sort((a, b) => parseInt(a.problemNumber) - parseInt(b.problemNumber))
      setProblems(extractedProblems)
    }

    if (Object.keys(notesDictionary).length > 0) {
      extractProblemsFromDictionary()
    }
  }, [notesDictionary])

  // Filter problems based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProblems(problems)
      return
    }

    const query = searchTerm.toLowerCase().trim()
    const filtered = problems.filter(problem => {
      return (
        problem.problemNumber.includes(query) ||
        problem.problemName.toLowerCase().includes(query) ||
        problem.sectionTitle.toLowerCase().includes(query) ||
        problem.note.title.toLowerCase().includes(query)
      )
    })

    setFilteredProblems(filtered)
  }, [searchTerm, problems])

  const navigateToNote = (problem: LeetCodeProblem) => {
    // Create anchor that matches MDX heading structure
    // Next.js/MDX converts headings to anchors by:
    // 1. Converting to lowercase
    // 2. Replacing spaces with hyphens
    // 3. Removing special characters except hyphens
    const anchor = problem.sectionTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
      .trim()
      .replace(/\s+/g, '-') // Convert spaces to hyphens
      .replace(/-+/g, '-') // Collapse multiple hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    
    const url = `${problem.note.route}#${anchor}`
    window.open(url, '_blank')
  }

  const openLeetCodeProblem = (problemUrl: string) => {
    window.open(problemUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
        <p className="text-sm text-muted-foreground mt-2">Loading problems...</p>
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
          placeholder="Search problems: '208', 'trie', 'binary'..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-background dark:bg-gray-800"
        />
      </div>

      {/* Problems Stats */}
      <div className="mb-3 text-xs text-muted-foreground">
        {searchTerm ? (
          `${filteredProblems.length} of ${problems.length} problems`
        ) : (
          `${problems.length} problems found across ${Object.keys(notesDictionary).length} notes`
        )}
      </div>

      {/* Problems List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {problems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🧩</div>
            <p className="text-sm text-muted-foreground">No LeetCode problems found</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-sm text-muted-foreground">No problems match "{searchTerm}"</p>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div key={`${problem.noteKey}-${problem.problemNumber}`} 
                 className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Problem Number and Name */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">#{problem.problemNumber}</span>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{problem.problemName}</h3>
                    </div>
                    
                    {/* Context Info */}
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        📚 {problem.note.title} → {problem.sectionTitle}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigateToNote(problem)}
                      className="px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md transition-colors font-medium"
                      title="View solution in notes"
                    >
                      📝 Notes
                    </button>
                    <button
                      onClick={() => openLeetCodeProblem(problem.problemUrl)}
                      className="px-3 py-1.5 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded-md transition-colors font-medium"
                      title="Open on LeetCode"
                    >
                      🔗 LeetCode
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}