export interface ProblemMetadata {
  id: string
  title: string
  description: string
  leetcodeUrl?: string
  leetcodeNumber?: number
  difficulty: 'easy' | 'medium' | 'hard'
  topics: string[]
  timeComplexity?: string[]
  insight?: string[]
  functionName: string
  sourceFile: string
  code: string
}

export interface AlgorithmFile {
  filePath: string
  className?: string
  problems: ProblemMetadata[]
}

export interface ProblemFilter {
  difficulty?: 'easy' | 'medium' | 'hard'
  topics?: string[]
  search?: string
}

export type ProblemSortKey = 'title' | 'difficulty' | 'leetcodeNumber'
export type ProblemSortOrder = 'asc' | 'desc'

export interface ProblemSort {
  key: ProblemSortKey
  order: ProblemSortOrder
}