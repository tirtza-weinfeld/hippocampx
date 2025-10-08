import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Node, Parent } from 'unist';

// Regex: [!TYPE(:collapse)?] (case-insensitive, allow whitespace)
const ALERT_REGEX = /^\s*\[!(\w+)(:collapse)?\]\s*\n?/i;

export const remarkGithubAlerts: Plugin = () => (tree: Node) => {
  visit(tree, 'blockquote', (node: Node, index: number | null, parent: Parent | null) => {
    if (!parent || index === null) return;
    if (!('children' in node) || !Array.isArray((node as Parent).children) || (node as Parent).children.length === 0) return;

    const first = (node as Parent).children[0];
    if (
      !('type' in first) ||
      first.type !== 'paragraph' ||
      !('children' in first) ||
      !Array.isArray(first.children) ||
      first.children.length === 0
    ) return;

    const firstTextNode = first.children[0];
    if (
      !('type' in firstTextNode) ||
      firstTextNode.type !== 'text' ||
      !('value' in firstTextNode)
    ) return;

    const match = (firstTextNode.value as string).match(ALERT_REGEX);
    if (!match) return;

    const type = match[1].toLowerCase();
    const collapse = !!match[2];
    firstTextNode.value = (firstTextNode.value as string).replace(ALERT_REGEX, '');

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
      children: (node as Parent).children,
    } as Node;
  });
};

export default remarkGithubAlerts;