import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Node, Parent } from 'unist';

// Regex: [!TYPE(:collapse)?] (case-insensitive, allow whitespace)
const ALERT_REGEX = /^\s*\[!(\w+)(:collapse)?\]\s*\n?/i;

interface TextNode extends Node {
  type: 'text';
  value: string;
}

interface ParagraphNode extends Parent {
  type: 'paragraph';
  children: Node[];
}

export const remarkGithubAlerts: Plugin = () => (tree: Node) => {
  visit(tree, 'blockquote', (node: Node, index: number | null, parent: Parent | null) => {
    if (!parent || index === null) return;
    if (!('children' in node) || !Array.isArray(node.children) || node.children.length === 0) return;

    const blockquote = node as Parent;
    const first = blockquote.children[0];
    if (
      first.type !== 'paragraph' ||
      !('children' in first) ||
      !Array.isArray(first.children) ||
      first.children.length === 0
    ) return;

    const paragraph = first as ParagraphNode;
    const firstChild = paragraph.children[0];
    if (firstChild.type !== 'text' || !('value' in firstChild)) return;

    const textNode = firstChild as TextNode;
    const match = textNode.value.match(ALERT_REGEX);
    if (!match) return;

    const type = match[1].toLowerCase();
    const collapse = !!match[2];
    textNode.value = textNode.value.replace(ALERT_REGEX, '');

    const attributes = [
      { type: 'mdxJsxAttribute', name: 'type', value: type },
    ];
    if (collapse) {
      attributes.push({ type: 'mdxJsxAttribute', name: 'collapse', value: 'true' });
    }

    parent.children[index] = {
      type: 'mdxJsxFlowElement',
      name: 'Alert',
      attributes,
      children: blockquote.children,
    } as Node;
  });
};

export default remarkGithubAlerts;