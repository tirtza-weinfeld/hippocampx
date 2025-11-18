import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import type { Root } from 'mdast';
import remarkGithubAlerts from '@/plugins/remark-github-alerts';
import { VFile } from 'vfile';
import { describe, it, expect } from 'vitest';

// Helper to preprocess markdown before parsing
function preprocessMarkdown(markdown: string): string {
  const lines = markdown.split('\n');
  const result: string[] = [];
  let inAlertBlock = false;
  let alertIndentLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^>\s*\[!\w+(:collapse)?\]/i)) {
      inAlertBlock = true;
      result.push(line);

      alertIndentLevel = 0;
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];
        if (nextLine.trim() === '') continue;
        if (nextLine.startsWith('>')) {
          inAlertBlock = false;
          break;
        }
        const indentMatch = nextLine.match(/^(\s+)/);
        if (indentMatch) {
          alertIndentLevel = indentMatch[1].length;
        } else {
          inAlertBlock = false;
        }
        break;
      }
      continue;
    }

    if (inAlertBlock) {
      if (line.trim() === '') {
        result.push('>');
      } else if (!line.startsWith('>')) {
        const indentMatch = line.match(/^(\s*)/);
        const currentIndent = indentMatch ? indentMatch[1].length : 0;

        if (currentIndent >= alertIndentLevel && alertIndentLevel > 0) {
          const contentAfterIndent = line.slice(alertIndentLevel);
          result.push(`> ${contentAfterIndent}`);
        } else {
          inAlertBlock = false;
          alertIndentLevel = 0;
          result.push(line);
        }
      } else {
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

function processMarkdown(content: string): Root {
  // Preprocess BEFORE creating VFile
  const preprocessed = preprocessMarkdown(content);

  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGithubAlerts);

  const file = new VFile({ value: preprocessed });
  const tree = processor.parse(file) as Root;
  return processor.runSync(tree, file) as Root;
}

function findJSXElements(tree: Root, name?: string): any[] {
  const elements: any[] = [];

  function visit(node: any) {
    if (node.type === 'mdxJsxFlowElement' && (!name || node.name === name)) {
      elements.push(node);
    }
    if (node.children) {
      node.children.forEach(visit);
    }
  }

  visit(tree);
  return elements;
}

function extractTextContent(node: any): string {
  if (node.type === 'text') {
    return node.value;
  }
  if (node.type === 'inlineCode') {
    return node.value;
  }
  if (node.children) {
    return node.children.map(extractTextContent).join('');
  }
  return '';
}

describe('remark-github-alerts plugin', () => {
  it('should transform indented alert content correctly', () => {
    const content = `> [!note:collapse]

    This is the first line
    This is the second line

    This is after empty line`;

    const tree = processMarkdown(content);
    const alerts = findJSXElements(tree, 'Alert');

    expect(alerts).toHaveLength(1);

    const alert = alerts[0];
    expect(alert.name).toBe('Alert');

    // Check type attribute
    const typeAttr = alert.attributes.find((a: any) => a.name === 'type');
    expect(typeAttr?.value).toBe('note');

    // Check collapse attribute
    const collapseAttr = alert.attributes.find((a: any) => a.name === 'collapse');
    expect(collapseAttr?.value).toBe('true');

    // Extract all text content
    const textContent = extractTextContent(alert);

    // Verify all lines are included
    expect(textContent).toContain('This is the first line');
    expect(textContent).toContain('This is the second line');
    expect(textContent).toContain('This is after empty line');
  });

  it('should handle the timecomplexity example from dijkstra page', () => {
    const content = `> [!timecomplexity:collapse]**$O(\\text{len(times)} \\log n)$**

    * *V (Vertices):* The number of vertices corresponds to the input *n*, the total number of nodes.
    * *E (Edges):* The number of edges corresponds to the length of the input list *times*, as each element in \`times\` defines a single directed edge.

    By substituting these into the standard Dijkstra complexity formula, $O(E \\log V)$, you get $O(\\text{len(times)} \\log n)$.`;

    const tree = processMarkdown(content);
    const alerts = findJSXElements(tree, 'Alert');

    expect(alerts).toHaveLength(1);

    const alert = alerts[0];

    // Check attributes
    const typeAttr = alert.attributes.find((a: any) => a.name === 'type');
    expect(typeAttr?.value).toBe('timecomplexity');

    const collapseAttr = alert.attributes.find((a: any) => a.name === 'collapse');
    expect(collapseAttr?.value).toBe('true');

    // Extract all text content
    const textContent = extractTextContent(alert);

    // Verify ALL content is included
    expect(textContent).toContain('V (Vertices)');
    expect(textContent).toContain('The number of vertices corresponds to the input');
    expect(textContent).toContain('E (Edges)');
    expect(textContent).toContain('The number of edges corresponds to the length');
    expect(textContent).toContain('times');
    expect(textContent).toContain('By substituting these into the standard Dijkstra complexity formula');
    expect(textContent).toContain('O(E \\log V)');
  });

  it('should handle regular blockquote syntax with > on each line', () => {
    const content = `> [!warning:collapse]
>
> This is line 1
> This is line 2`;

    const tree = processMarkdown(content);
    const alerts = findJSXElements(tree, 'Alert');

    expect(alerts).toHaveLength(1);

    const alert = alerts[0];
    const typeAttr = alert.attributes.find((a: any) => a.name === 'type');
    expect(typeAttr?.value).toBe('warning');

    const textContent = extractTextContent(alert);
    expect(textContent).toContain('This is line 1');
    expect(textContent).toContain('This is line 2');
  });

  it('should handle alert without collapse modifier', () => {
    const content = `> [!tip]

    This is a tip`;

    const tree = processMarkdown(content);
    const alerts = findJSXElements(tree, 'Alert');

    expect(alerts).toHaveLength(1);

    const alert = alerts[0];
    const typeAttr = alert.attributes.find((a: any) => a.name === 'type');
    expect(typeAttr?.value).toBe('tip');

    const collapseAttr = alert.attributes.find((a: any) => a.name === 'collapse');
    expect(collapseAttr).toBeUndefined();
  });

  it('should end alert block when indentation decreases', () => {
    const content = `> [!note]

    Indented content
    More indented content

Not indented - should be outside alert`;

    const tree = processMarkdown(content);
    const alerts = findJSXElements(tree, 'Alert');

    expect(alerts).toHaveLength(1);

    const textContent = extractTextContent(alerts[0]);
    expect(textContent).toContain('Indented content');
    expect(textContent).toContain('More indented content');
    expect(textContent).not.toContain('Not indented - should be outside alert');
  });

  it('should handle empty lines within indented blocks', () => {
    const content = `> [!note]

    First paragraph

    Second paragraph after empty line

    Third paragraph`;

    const tree = processMarkdown(content);
    const alerts = findJSXElements(tree, 'Alert');

    expect(alerts).toHaveLength(1);

    const textContent = extractTextContent(alerts[0]);
    expect(textContent).toContain('First paragraph');
    expect(textContent).toContain('Second paragraph after empty line');
    expect(textContent).toContain('Third paragraph');
  });
});
