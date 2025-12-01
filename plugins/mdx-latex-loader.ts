/**
 * Turbopack loader that converts LaTeX-style math delimiters to KaTeX-compatible format.
 * Runs BEFORE MDX parsing to avoid JSX/expression conflicts with \[ and \( delimiters.
 *
 * Conversions:
 * - \( ... \) → $ ... $ (inline math)
 * - \[ ... \] → $$ ... $$ (display math)
 *
 * This enables direct copy-paste from ChatGPT, Gemini, and other AI tools
 * that output standard LaTeX math notation.
 */

/**
 * Convert LaTeX delimiters to KaTeX-compatible dollar sign delimiters.
 */
function convertLatexDelimiters(source: string): string {
  // Convert display math first: \[ ... \] → $$ ... $$
  // Must be done before inline to avoid nested conflicts
  const withDisplayMath = source.replace(
    /\\\[([\s\S]*?)\\\]/g,
    function replaceDisplay(_match: string, content: string): string {
      return '$$' + content + '$$'
    }
  )

  // Convert inline math: \( ... \) → $ ... $
  const withInlineMath = withDisplayMath.replace(
    /\\\(([\s\S]*?)\\\)/g,
    function replaceInline(_match: string, content: string): string {
      return '$' + content + '$'
    }
  )

  return withInlineMath
}

/**
 * Turbopack/Webpack loader entry point.
 * Receives raw MDX source and returns transformed source with converted math delimiters.
 */
function mdxLatexLoader(source: string): string {
  return convertLatexDelimiters(source)
}

export default mdxLatexLoader
