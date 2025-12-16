'use server'

import highlightCode from './code-highlighter'

export async function highlightCodeAction(
  code: string,
  lang: string,
  meta?: string,
  transformers: boolean = true,
  isInline: boolean = false
) {
  return highlightCode(code, lang, meta, transformers, isInline)
}
