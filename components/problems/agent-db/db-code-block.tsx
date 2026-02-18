import type { ReactNode } from 'react';
import type { Element, Root } from 'hast';
import { getHighlightedHast } from '@/lib/shiki';
import { hastToJSX } from '@/components/mdx/code/hast-to-tsx';
import { DbCodeBlockClient } from './db-code-block-client';
import { getLspReferencesBySolutionId } from '@/lib/db/queries/problems';
import { getCharacterOffset } from '@/components/mdx/code/transformers/utils';
import { DbTooltipContent } from './db-tooltip-content';
import type { Symbol as DbSymbol, Lsp } from '@/lib/db/schema';

type DbCodeBlockProps = {
  code: string;
  tooltips?: false;
} | {
  code: string;
  tooltips: true;
  solutionId: string;
  symbols: DbSymbol[];
};

/**
 * Add comment tooltip attributes to HAST line nodes.
 * Comments attach to the whole line, not a specific span — same as the MDX transformer.
 */
function addCommentTooltips(hast: Root, commentRefs: Map<number, string>) {
  if (commentRefs.size === 0) return;

  const pre = hast.children.find(
    (c): c is Element => c.type === 'element' && c.tagName === 'pre'
  );
  if (!pre) return;

  const codeEl = pre.children.find(
    (c): c is Element => c.type === 'element' && c.tagName === 'code'
  );
  if (!codeEl) return;

  let lineIndex = 0;
  for (const child of codeEl.children) {
    if (child.type === 'element' && child.tagName === 'span') {
      const classVal = String(child.properties.class ?? '');
      if (!classVal.includes('line')) continue;

      const qname = commentRefs.get(lineIndex);
      if (qname) {
        child.properties['data-tooltip-symbol'] = qname;
        child.properties.class = `${classVal} tooltip-symbol comment-symbol`;
      }
      lineIndex++;
    }
  }
}

/**
 * DB-backed code block. Tooltips off by default.
 * Pass `tooltips={true}` with `solutionId` and `symbols` to enable.
 *
 * Tooltip content is server-rendered (N entries, one per symbol).
 * A single shared Popover in CodeBlockClient handles display — no OOM at build.
 */
export async function DbCodeBlock(props: DbCodeBlockProps) {
  const { code } = props;
  const lines = code.split('\n');

  if (!props.tooltips) {
    const hast = await getHighlightedHast(code, 'python');
    const jsx = hastToJSX(hast);

    return (
      <DbCodeBlockClient
        code={code}
        highlightedCode={jsx}
        tooltipMap={{}}
        totalLines={lines.length}
      />
    );
  }

  const { solutionId, symbols } = props;
  const lspRefs = await getLspReferencesBySolutionId(solutionId);

  // Build symbol lookup map: qname → Symbol
  const symbolMap = new Map<string, DbSymbol>();
  for (const sym of symbols) {
    symbolMap.set(sym.qname, sym);
  }

  // Separate comment refs from symbol/expression refs
  const commentRefs = new Map<number, string>();
  const decorationRefs: Lsp[] = [];

  for (const ref of lspRefs) {
    const sym = symbolMap.get(ref.qname);
    if (!sym) continue;

    if (sym.kind === 'comment') {
      commentRefs.set(ref.start_line, ref.qname);
    } else {
      decorationRefs.push(ref);
    }
  }

  // Build Shiki decorations from non-comment lsp reference rows
  const decorations: Array<{ start: number; end: number; properties: Record<string, string> }> = [];

  for (const ref of decorationRefs) {
    const sym = symbolMap.get(ref.qname);
    if (!sym) continue;
    const startOffset = getCharacterOffset(lines, ref.start_line, ref.start_char);
    const endOffset = getCharacterOffset(lines, ref.end_line, ref.end_char);

    if (startOffset !== -1 && endOffset !== -1 && startOffset < endOffset) {
      decorations.push({
        start: startOffset,
        end: endOffset,
        properties: {
          'data-tooltip-symbol': ref.qname,
          'class': `tooltip-symbol ${sym.kind}-symbol`,
        },
      });
    }
  }

  const hast = await getHighlightedHast(code, 'python', decorations);
  addCommentTooltips(hast, commentRefs);
  const jsx = hastToJSX(hast);

  // N entries — one per unique symbol, not one Popover per span
  const tooltipMap: Record<string, ReactNode> = {};
  for (const sym of symbols) {
    tooltipMap[sym.qname] = <DbTooltipContent symbol={sym} />;
  }

  return (
    <DbCodeBlockClient
      code={code}
      highlightedCode={jsx}
      tooltipMap={tooltipMap}
      totalLines={lines.length}
    />
  );
}
