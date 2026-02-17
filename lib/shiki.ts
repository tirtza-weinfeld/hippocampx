import { cacheLife } from 'next/cache'
import { createHighlighter, type BundledLanguage } from 'shiki'
import type { Root } from 'hast'

let instance: Awaited<ReturnType<typeof createHighlighter>> | null = null
const loadedLangs = new Set<string>(['python'])

async function getShikiHighlighter(lang: BundledLanguage = 'python') {
  if (!instance) {
    instance = await createHighlighter({
      themes: ['light-plus', 'dark-plus'],
      langs: ['python'],
    })
  }
  if (!loadedLangs.has(lang)) {
    await instance.loadLanguage(lang)
    loadedLangs.add(lang)
  }
  return instance
}

type Decoration = { start: number; end: number; properties: Record<string, string> };

/**
 * Cached Shiki highlighting with optional decorations.
 * Returns serializable HAST (JSON) — JSX conversion happens outside the cache boundary.
 */
export async function getHighlightedHast(
  code: string,
  lang: BundledLanguage = 'python',
  decorations: Decoration[] = [],
): Promise<Root> {
  'use cache'
  cacheLife('max')

  const highlighter = await getShikiHighlighter(lang)
  return highlighter.codeToHast(code, {
    lang,
    themes: {
      light: 'light-plus',
      dark: 'dark-plus',
    },
    colorReplacements: {
      'light-plus': { '#ffffff': 'var(--bg-background)' },
      'dark-plus': {},
    },
    defaultColor: 'light-dark()',
    decorations,
  })
}
