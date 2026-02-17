import { createHighlighter } from 'shiki'

let instance: Awaited<ReturnType<typeof createHighlighter>> | null = null

export async function getShikiHighlighter() {
  if (!instance) {
    instance = await createHighlighter({
      themes: ['light-plus', 'dark-plus'],
      langs: ['python'],
    })
  }
  return instance
}
