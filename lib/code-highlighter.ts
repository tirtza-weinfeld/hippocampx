// import { codeToHast } from 'shiki'
// // import { transformerMetaHighlight } from '@shikijs/transformers'
// // import { transformerMetaWordHighlight } from '@/components/mdx/code/transformers/meta-highlight-word'
// import { transformerMetaTooltip } from '@/components/mdx/code/transformers/meta-tooltip'
// import { hastToJSX } from '@/components/mdx/code/hast-to-tsx'
// import type { HighlightedCode, HighlightOptions } from './types'

// // Runtime cache for pre-highlighted code with size limit
// const runtimeCache = new Map<string, HighlightedCode>()
// const MAX_CACHE_SIZE = 1000

// // Fast access to pre-highlighted code (runtime optimized)
// export function getHighlightedCode(hash: string): HighlightedCode | null {
//   return runtimeCache.get(hash) || null
// }

// // Main highlighting function (used at build time and for dynamic content)
// export async function highlightCode(
//   code: string, 
//   options: HighlightOptions
// ): Promise<HighlightedCode> {
//   const { lang, meta, inline = false } = options
  
//   // Generate simple hash for caching
//   const hash = `${lang}:${code.length}:${meta || ''}:${inline}`
  
//   // Check runtime cache first
//   if (runtimeCache.has(hash)) {
//     return runtimeCache.get(hash)!
//   }
  
//   // Clean language identifier
//   const cleanLang = lang.replace('language-', '')
  
//   // Optimize transformers based on use case
//   const transformers = inline 
//     ? [] // No transformers for inline code (performance)
//     : [
//         // transformerMetaWordHighlight({ 
//         //   className: `word-highlight shadow-xl`,
//         // }),
//         // transformerMetaHighlight({ className: `line-highlight` }),
//         transformerMetaTooltip({ 
//           className: 'tooltip-marker',
//           enabled: true 
//         }),
//       ]
  
//   // Process with Shiki
//   const hast = await codeToHast(code, {
//     lang: cleanLang,
//     meta: { __raw: meta },
//     themes: {
//       light: 'light-plus',
//       dark: 'dark-plus',
//     },
//     colorReplacements: {
//       'light-plus': {
//         '#ffffff': 'var(--bg-background)',
//         '#f3f4f6': 'var(--bg-muted)',
//       },
//       'dark-plus': {
//         '#1e1e1e': 'var(--bg-background)',
//         '#2d2d30': 'var(--bg-muted)',
//       }
//     },
//     defaultColor: 'light-dark()',
//     transformers,
//   })
  
//   // Convert to JSX
//   const jsx = hastToJSX(hast)
  
//   // Create result with minimal metadata
//   const result: HighlightedCode = {
//     jsx,
//     hash,
//     metadata: {
//       lines: code.split('\n').length,
//       symbols: [], // Simplified - symbols are handled by metadata system
//       complexity: 0, // Simplified - not used in current implementation
//     }
//   }
  
//   // Cache for runtime access with size limit
//   if (runtimeCache.size >= MAX_CACHE_SIZE) {
//     // Remove oldest entries (simple FIFO)
//     const firstKey = runtimeCache.keys().next().value
//     if (firstKey) {
//       runtimeCache.delete(firstKey)
//     }
//   }
  
//   runtimeCache.set(hash, result)
  
//   return result
// }

// // Optimized inline code highlighting
// export async function highlightInlineCode(
//   code: string, 
//   lang: string = 'text'
// ): Promise<React.ReactNode> {
//   const result = await highlightCode(code, {
//     lang,
//     inline: true,
//   })
  
//   return result.jsx
// }

// // Pre-load code blocks for runtime performance
// export function preloadCodeBlocks(blocks: Array<{ code: string; lang: string; meta?: string }>): void {
//   blocks.forEach(async ({ code, lang, meta }) => {
//     await highlightCode(code, { lang, meta })
//   })
// }

// // Clear runtime cache (useful for development)
// export function clearRuntimeCache(): void {
//   runtimeCache.clear()
// }

// // Get cache statistics
// export function getCacheStats(): { size: number; maxSize: number } {
//   return {
//     size: runtimeCache.size,
//     maxSize: MAX_CACHE_SIZE,
//   }
// } 