import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkTabbedCodeBlocks from './remark-tabbed-code-blocks';
import type { Node, Parent } from 'unist';

// If you get a type error for 'remark-parse', install @types/remark-parse

describe('remark-tabbed-code-blocks', () => {
  it('transforms a tabbed code block into a tabbedCodeBlock node', async () => {
    const md = [
      '```tabbed',
      '---tab:foo.py',
      'print("foo")',
      '---tab:bar.js',
      'console.log("bar")',
      '```',
    ].join('\n');

    const file = await unified()
      .use(remarkParse)
      .use(remarkTabbedCodeBlocks)
      .process(md);

    // The AST is in file.result (if set) or file.value (for vfile)
    const root = file.result ?? file.value;
    const children = (root as Parent).children;
    const tabbedNode = children.find((n: Node) => n.type === 'tabbedCodeBlock') as Node & { data: { tabs: any[] } };
    expect(tabbedNode).toBeDefined();
    expect(tabbedNode.data.tabs).toHaveLength(2);
    expect(tabbedNode.data.tabs[0]).toEqual({
      label: 'foo.py',
      code: 'print("foo")',
      language: 'python',
    });
    expect(tabbedNode.data.tabs[1]).toEqual({
      label: 'bar.js',
      code: 'console.log("bar")',
      language: 'javascript',
    });
  });
}); 