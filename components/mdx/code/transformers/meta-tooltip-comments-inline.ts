import type { ShikiTransformer } from 'shiki';
import type { LspData, CommentsInlineData } from './types';
import { getFunctionRange } from './utils';


const symbol = Symbol('comment-lines');

interface CommentLine {
  displayLine: number;
  qname: string;
}

/**
 * Shiki transformer that adds tooltip indicators for inline comments.
 *
 * This transformer processes code blocks with `source=` meta attributes to add interactive
 * comment tooltips by appending a comment trigger element to the line node.
 *
 * **Important**: Line numbers in comments-inline.json are in CLEANED code coordinates
 * (after docstrings removed), which matches LSP data coordinates. This ensures correct
 * function scope calculations.
 *
 * The transformer works by:
 * 1. **Meta Parsing** (preprocess): Extracts source file and optional function name from meta attributes
 * 2. **Comment Lookup** (preprocess): Finds inline comments from pre-extracted metadata (comments-inline.json)
 * 3. **Scope Filtering** (preprocess): When function is specified, adjusts line numbers to function-relative positions
 * 4. **Line Decoration** (line hook): Appends comment trigger span as child of line element
 *
 * **QName Format**: `filename:comment-line:LINE_NUMBER`
 * - Example: `problems/265-paint-house-ii/top-down.py:comment-line:12`
 * - The `:comment-line:` marker allows renderTooltipContent to detect and handle comments
 *
 * **Priority**: Runs between expressions (lower) and symbols (higher) in transformer chain
 *
 * @param commentsData - Inline comment data indexed by filename and line number from comments-inline.json
 * @param lspData - Optional LSP symbol definitions for scope filtering from lsp_index.json
 * @returns Shiki transformer that processes code blocks with inline comment decorations
 *
 * @example
 * ```mdx
 * ```python source=algorithm.py:binary_search
 * for c, v in enumerate(nxt):  # Gets 💬 indicator at line end
 * ```
 * ```
 */
export function transformerInlineCommentTooltips(commentsData: CommentsInlineData, lspData?: LspData): ShikiTransformer {
  return {
    name: 'meta-tooltip-comments-inline',

    preprocess(code, options) {
      const rawMeta = options.meta?.__raw;
      if (!rawMeta) return;

      const sourceMatch = rawMeta.match(/source=([^\s]+)/);
      if (!sourceMatch) return;

      const sourceSpec = sourceMatch[1];
      const [sourceFile, functionName] = sourceSpec.includes(':')
        ? sourceSpec.split(':')
        : [sourceSpec, undefined];

      const fileComments = commentsData[sourceFile];
      if (!fileComments) return;

      // Calculate line offset if we're showing a specific function
      // Both comments and LSP use cleaned code coordinates, so this subtraction is correct
      let lineOffset = 0;
      if (functionName && lspData) {
        const functionRange = getFunctionRange(lspData, sourceFile, functionName);
        if (functionRange) {
          lineOffset = functionRange.start.line;
        }
      }

      const lines = code.split('\n');
      const commentLines: CommentLine[] = [];

      // Process each line with a comment
      for (const cleanedCodeLine of fileComments) {
        // Adjust for function scope (subtract function start line)
        const displayLine = cleanedCodeLine - lineOffset;

        // Check if this line exists in the displayed code
        if (displayLine < 0 || displayLine >= lines.length) continue;

        // Create qname that renderTooltipContent can detect as a comment
        const qname = `${sourceFile}:comment-line:${cleanedCodeLine}`;
        commentLines.push({ displayLine, qname });
      }

      // Store comment lines in meta for line hook to access
      if (commentLines.length > 0) {
        const meta = this.meta as { [symbol]: CommentLine[] };
        meta[symbol] = commentLines;
      }
    },

    line(node, line) {
      const meta = this.meta as { [symbol]?: CommentLine[] };
      const commentLines = meta[symbol];
      if (!commentLines) return;

      // Check if this line has a comment (line is 1-indexed)
      const commentLine = commentLines.find(c => c.displayLine === line - 1);
      if (!commentLine) return;

      // Add comment trigger span as child of line element
      // node.children.push({
      //   type: 'element',
      //   tagName: 'span',
      //   properties: {
      //     'data-tooltip-symbol': commentLine.qname,
      //     'class': 'tooltip-symbol comment-symbol',
          
      //   },
        
      //   children: [] ,
      // });
      node.properties['data-tooltip-symbol'] = commentLine.qname;
      this.addClassToHast(node, 'tooltip-symbol comment-symbol')
    },
  };
}
