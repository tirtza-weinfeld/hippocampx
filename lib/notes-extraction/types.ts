export interface CodeBlock {
  language: string
  content: string
  originalMeta?: string
  fileSource?: string
  functionName?: string
  className?: string
  methodName?: string
}

export interface SearchableSection {
  heading: string
  headingLevel: number
  content: string
  anchor?: string  // For navigation to specific sections
}

export interface LeetCodeProblem {
  number: string
  name: string
  url: string
  section: string  // The heading section where this problem was found
  difficulty?: string  // If we can extract it
  topics?: string[]    // If we can extract them
}

export interface NotesContent {
  title: string
  route: string
  filePath: string
  headings: string[]
  text: string
  sections: SearchableSection[]  // Structured content for search
  codeBlocks: CodeBlock[]
  keyTerms: string[]
  notations: string[]  // Generic: mathematical, scientific, musical, etc.
  categories: string[]
  leetcodeProblems: LeetCodeProblem[]  // Extracted LeetCode problems
}

export interface SearchMatch {
  noteKey: string
  note: NotesContent
  matches: Array<{
    section: string
    sectionAnchor?: string
    context: string  // Surrounding text
    matchText: string  // The actual matched text
    type: 'title' | 'heading' | 'content' | 'code' | 'notation'
  }>
}

export interface NotesDictionary {
  [key: string]: NotesContent
}