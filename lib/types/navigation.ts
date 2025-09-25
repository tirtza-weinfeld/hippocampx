// Types for the problems navigation component

export interface LeetCodeInfo {
  number: number
  title: string
  url: string
}

export interface Problem {
  slug: string
  name: string
  title: string
  filename: string
  definition: string
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert'
  topics?: string[]
  patterns?: string[]
  leetcode?: LeetCodeInfo
  timeComplexity?: string
  spaceComplexity?: string
}

export interface NavigationCategories {
  difficulties: Record<string, number>
  topics: Record<string, number>
  patterns: Record<string, number>
}

export interface NavigationMetadata {
  problems: Problem[]
  categories: NavigationCategories
  metadata: {
    total_problems: number
    total_files: number
    generated_at: string
  }
}

// Filter and search types
export interface ProblemFilters {
  difficulties: string[]
  topics: string[]
  patterns: string[]
  searchQuery: string
}

export interface FilterOption {
  value: string
  label: string
  count: number
}

// Component props
export interface ProblemsNavigationProps {
  problems: Problem[]
  categories: NavigationCategories
  onProblemSelect?: (slug: string) => void
  initialFilters?: Partial<ProblemFilters>
}

export interface ProblemCardProps {
  problem: Problem
  onClick?: () => void
}

export interface FilterSectionProps {
  title: string
  options: FilterOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  maxVisible?: number
}