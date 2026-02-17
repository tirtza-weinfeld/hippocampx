import { cacheLife } from 'next/cache'
import { createHighlighter } from 'shiki'
import type { Root } from 'hast'

let instance: Awaited<ReturnType<typeof createHighlighter>> | null = null

async function getShikiHighlighter() {
  if (!instance) {
    instance = await createHighlighter({
      themes: ['light-plus', 'dark-plus'],
      langs: ['python'],
    })
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
  decorations: Decoration[] = [],
): Promise<Root> {
  'use cache'
  cacheLife('max')

  const highlighter = await getShikiHighlighter()
  return highlighter.codeToHast(code, {
    lang: 'python',
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
