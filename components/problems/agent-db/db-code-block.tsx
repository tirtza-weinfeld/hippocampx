import { codeToHast } from 'shiki';
import type { Element, Root } from 'hast';
import { hastToJSX } from '@/components/mdx/code/hast-to-tsx';
import { tooltipifyJSX } from '@/components/mdx/code/tooltipify-jsx';
import { CodeBlockClient } from '@/components/mdx/code/code-block-client';
import { getLspReferencesBySolutionId } from '@/lib/db/queries/problems';
import { getCharacterOffset } from '@/components/mdx/code/transformers/utils';
import { DbTooltipContent } from './db-tooltip-content';
import type { Symbol as DbSymbol, Lsp } from '@/lib/db/schema';

type DbCodeBlockProps = {
  solutionId: string;
  code: string;
  symbols: DbSymbol[];
};

/**
 * Add comment tooltip attributes to HAST line nodes.
 * Comments attach to the whole line, not a specific span — same as the MDX transformer.
 */
function addCommentTooltips(hast: Root, commentRefs: Map<number, string>) {
  if (commentRefs.size === 0) return;

  // HAST structure: root > pre > code > span.line (per line)
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
 * DB-backed code block with tooltips.
 * Receives symbols from parent, fetches only lsp references.
 */
export async function DbCodeBlock({ solutionId, code, symbols }: DbCodeBlockProps) {
  const lspRefs = await getLspReferencesBySolutionId(solutionId);

  // Build symbol lookup map: qname → Symbol
  const symbolMap = new Map<string, DbSymbol>();
  for (const sym of symbols) {
    symbolMap.set(sym.qname, sym);
  }

  // Separate comment refs (handled via HAST line nodes) from symbol/expression refs (handled via decorations)
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
  const lines = code.split('\n');
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

  // Run Shiki highlighting with decorations
  const hast = await codeToHast(code, {
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
  });

  // Post-process: add comment tooltip attributes to line nodes
  addCommentTooltips(hast, commentRefs);

  const jsx = hastToJSX(hast);
  const jsxWithTooltips = tooltipifyJSX(jsx, (qname) => {
    const sym = symbolMap.get(qname);
    if (!sym) return null;
    return <DbTooltipContent symbol={sym} />;
  });

  return (
    <CodeBlockClient
      code={code}
      highlightedCodeWithTooltips={jsxWithTooltips}
      totalLines={lines.length}
    />
  );
}
