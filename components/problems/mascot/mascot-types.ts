export type MascotIcon = "turing" | "lovelace" | "knuth" | "dijkstra" | "hopper" | "berners-lee"
// export type ActiveFeature = "main" | "snippets" | "settings"
export type ActiveFeature = "main" | "settings"

// Organized state structure
export type MascotState = {
  mascot: {
    activeFeature: ActiveFeature
    isOpen: boolean
    isFullscreen: boolean
  }
  problems: {
    searchQuery: string
    difficultyFilter: string
    topicFilter: string
    expandedProblems: string[]
    sortBy: 'number' | 'difficulty' | 'date-updated' | 'date-created'
    sortOrder: 'asc' | 'desc'
  }
}

// Action types for reducer
export type MascotAction =
  | { type: 'SET_ACTIVE_FEATURE'; feature: ActiveFeature }
  | { type: 'SET_IS_OPEN'; value: boolean }
  | { type: 'TOGGLE_OPEN' }
  | { type: 'SET_IS_FULLSCREEN'; value: boolean }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'SET_DIFFICULTY_FILTER'; filter: string }
  | { type: 'SET_TOPIC_FILTER'; filter: string }
  | { type: 'SET_EXPANDED_PROBLEMS'; problems: string[] }
  | { type: 'TOGGLE_PROBLEM_EXPANSION'; slug: string }
  | { type: 'TOGGLE_ALL_PROBLEMS'; allSlugs: string[] }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_SORT_BY'; sortBy: 'number' | 'difficulty' | 'date-updated' | 'date-created' }
  | { type: 'SET_SORT_ORDER'; sortOrder: 'asc' | 'desc' }



export type Topics = Record<string, string[]>

export interface Solution {
  title: string
  timeComplexity: string
  code: string
}

export type Problems = Record<string, Problem>


export type Problem = {
  title: string
  definition: string
  difficulty: 'easy' | 'medium' | 'hard'
  leetcode: string
  topics?: string[]
  solutions: Record<string, Solution>
  time_stamps?: {
    created_at: string
    updated_at: string
  }
}



