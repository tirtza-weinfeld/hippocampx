import type { ShikiTransformer, ShikiTransformerContext } from 'shiki'
import type { Element, ElementContent } from 'hast'

interface HighlightRange {
    start: number;
    end: number;
    className: string;
}

interface ShikiMeta {
    [key: string]: Map<number, HighlightRange[]>;
}

/**
 * Transformer to apply inline highlights based on a JSON meta string.
 * Meta format: [[substr, step, line, index?], ...]
 * - substr: text to highlight (must match exactly, including whitespace)
 * - st-based, as displayed; required)
 * - index: array of occurrence indexes (0-based, optional, if not specified matches all occurrences)
 */
export function transformerStepHighlight(): ShikiTransformer {
    // Use a string key for meta storage to avoid TS symbol index issues
    const symbol = 'step-highlight'

    return {
        name: 'transformers:step-highlight',

        preprocess(code: string, options: { meta?: { __raw?: string } }) {
            const raw = options.meta?.__raw
            if (!raw) return

            const json = raw.trim().match(/\[.*\]/)?.[0]
            if (!json) return

            let specs: Array<[substr: string, step: number, line: number, index?: number[]]>
            try { specs = JSON.parse(json) } catch { return }

            const lines = code.split(/\r?\n/)
            const map = new Map<number, HighlightRange[]>();

            for (const [substr, step, line, idxs] of specs) {
                if (!substr || typeof step !== 'number' || typeof line !== 'number') continue
                const targetLine = line - 1 // Convert 1-based to 0-based
                if (targetLine < 0 || targetLine >= lines.length) continue
                const text = lines[targetLine] || ''
                if (!text) continue
                const re = new RegExp(escapeRegExp(substr), 'g')
                let match: RegExpExecArray | null, count = 0
                while ((match = re.exec(text)) !== null) {
                    if (match[0].length === 0) break
                    if (!idxs || idxs.length === 0 || idxs.includes(count)) {
                        const range: HighlightRange = {
                            start: match.index,
                            end: match.index + substr.length,
                            className: STEPS[step] || ''
                        }
                        if (!map.has(targetLine)) map.set(targetLine, [])
                        map.get(targetLine)!.push(range)
                    }
                    count++
                }
            }

            (this as ShikiTransformerContext).meta = (this as ShikiTransformerContext).meta || {};
            ((this as ShikiTransformerContext).meta as ShikiMeta)[symbol] = map
        },

        span(node: Element, line: number, col: number) {
            const map = ((this as ShikiTransformerContext).meta as ShikiMeta)?.[symbol]
            if (!map) return
            const ranges = map.get(line - 1)
            if (!ranges) return

            // Get token text length safely
            let tokenContent = ''
            const firstChild = node.children[0] as ElementContent | undefined
            if (firstChild && typeof firstChild === 'object' && 'type' in firstChild && firstChild.type === 'text' && 'value' in firstChild) {
                tokenContent = String((firstChild as { value: string }).value)
            }
            const start = col
            const end = col + tokenContent.length

            for (const { start: s, end: e, className } of ranges) {
                // Only highlight if the token exactly matches the highlight range
                if (start > s && end < e) {
                    const prev = node.properties.className
                    node.properties.className = [
                        ...(Array.isArray(prev) ? prev : prev ? [prev] : []),
                        className
                    ].filter(v => typeof v === 'string' || typeof v === 'number')
                }
            }
        }
    }
}

// Helper to escape special chars in substrings for regex
function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
const STEP_CLASS = 'code-step relative  py-[1.5px] border-b-[2px] border-opacity-60'
// Mapping of step → Tailwind classes
const STEPS: Record<number, string> = {
    1: `${STEP_CLASS} bg-blue-400/10 dark:bg-blue-400/20 border-blue-400 text-blue-600 dark:text-blue-300`,
    2: `${STEP_CLASS} bg-yellow-400/10 dark:bg-yellow-400/20 border-yellow-400 text-yellow-600 dark:text-yellow-300`,
    3: `${STEP_CLASS} bg-purple-400/10 dark:bg-purple-400/20 border-purple-400 text-purple-600 dark:text-purple-300`,
    4: `${STEP_CLASS} bg-green-400/10 dark:bg-green-400/20 border-green-400 text-green-600 dark:text-green-300`,
}
