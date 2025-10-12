import { cache } from 'react'
import { Problems } from './mascot-types'


export const getProblems = cache(() =>
    import('@/lib/extracted-metadata/problems_metadata.json')
        .then(module => module.problems as unknown as Problems)
)
export const getProblem = cache((slug: string) =>
    getProblems().then(problems => problems[slug])
)

const STATS = cache(() =>
    import('@/lib/extracted-metadata/stats.json')
        .then(module => module as unknown as Record<string, string>)
)

export const getTimeComplexities = cache(() =>
    STATS().then(stats => stats.time_complexity as unknown as Record<string, string>)
)

export const getTopics = cache(() =>
    STATS().then(stats => stats.topics as unknown as Record<string, string[]>)
)

