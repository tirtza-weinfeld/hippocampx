import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Node, Parent } from 'unist';
import type { Heading, Code, Text } from 'mdast';

/**
 * Remark plugin that transforms headings with [!CodeTabs] marker into CodeTabs components.
 *
 * This plugin detects headings containing [!CodeTabs] and collects all subsequent code blocks,
 * wrapping each in a <CodeTab> component and the whole group in a <CodeTabs> component.
 *
 * @example
 * Input MDX:
 * ```mdx 
 * ### [!CodeTabs] Code Snippet
 * 
 * ```python meta="source=problems/347-top-k-frequent-elements/heap.py"
 * def topKFrequent(nums, k):
 *     freq ,h= Counter(nums), []
 * ```
 * 
 * ```python meta="source=problems/347-top-k-frequent-elements/heap-nlargets.py"
 * def topKFrequent(nums, k):
 *     freq = Counter(nums)
 * ```
 * ```
 * Output:
 * ```tsx
 * <CodeTabs files={['heap.py', 'heap-nlargets.py']}>
 * 
 *     <CodeTab file="heap.py">
 *     ```python meta="source=problems/347-top-k-frequent-elements/heap.py"
 *        def topKFrequent(nums, k):
 *            freq ,h= Counter(nums), []
 *        ```
 *     </CodeTab>
 * 
 *     <CodeTab file="heap-nlargets.py">
 *     ```python meta="source=problems/347-top-k-frequent-elements/heap-nlargets.py"
 *        def topKFrequent(nums, k):
 *            freq = Counter(nums)
 *        ```
 *     </CodeTab>
 * </CodeTabs >
 * ```
 * 
 *
 * The code blocks are then processed through the normal MDX pipeline,
 * getting full syntax highlighting and tooltip support via CodeBlock component.
 */
const remarkCodeTabs: Plugin = () => {
  return (tree: Node) => {
    visit(tree, 'heading', (node: Heading, index: number | undefined, parent: Parent | undefined) => {
      if (index === undefined || !parent) return;

      // Check if heading contains [!CodeTabs] marker
      const headingText = node.children
        .filter((child): child is Text => child.type === 'text')
        .map(child => child.value)
        .join('');

      if (!headingText.includes('[!CodeTabs]')) return;

      // Extract text after [!CodeTabs] marker
      const remainingText = headingText.replace(/\[!CodeTabs\]\s*/, '').trim();

      // Collect all code blocks that follow this heading
      const codeBlocks: Code[] = [];
      let currentIndex = index + 1;

      while (currentIndex < parent.children.length) {
        const currentNode = parent.children[currentIndex];

        // Stop if we hit another heading (section boundary)
        if (currentNode.type === 'heading') {
          break;
        }

        // Collect code blocks
        if (currentNode.type === 'code') {
          codeBlocks.push(currentNode as Code);
          currentIndex++;
          continue;
        }

        // Skip whitespace/paragraph nodes between code blocks
        if (currentNode.type === 'paragraph' || currentNode.type === 'text') {
          const nodeText = 'value' in currentNode ? currentNode.value : '';
          if (typeof nodeText === 'string' && nodeText.trim() === '') {
            currentIndex++;
            continue;
          }
        }

        // If we hit non-code, non-whitespace content, stop collecting
        currentIndex++;
      }

      // Only transform if we found code blocks
      if (codeBlocks.length === 0) return;

      // Extract filenames from code blocks (from source= in meta)
      const files = codeBlocks.map(codeBlock => {
        const meta = codeBlock.meta || '';
        // Extract filename from source="path/to/file.ext" or source=path/to/file.ext
        const sourceMatch = meta.match(/source=["']?(?:.*\/)?([^/"'\s]+)/);
        if (sourceMatch) {
          return sourceMatch[1];
        }
        // Fallback to lang with extension
        return codeBlock.lang ? `code.${codeBlock.lang}` : 'code.txt';
      });

      // Create <CodeTabTrigger> for each file
      const codeTabTriggers = files.map(file => ({
        type: 'mdxJsxFlowElement',
        name: 'CodeTabTrigger',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'file',
            value: file,
          },
        ],
        children: [],
      }));

      // Create <CodeTabsList> with triggers
      const codeTabsList = {
        type: 'mdxJsxFlowElement',
        name: 'CodeTabsList',
        attributes: [],
        children: codeTabTriggers,
      };

      // Create <CodeTab> wrapper for each code block with file attribute
      const codeTabNodes = codeBlocks.map((codeBlock, i) => ({
        type: 'mdxJsxFlowElement',
        name: 'CodeTab',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'file',
            value: files[i],
          },
        ],
        children: [codeBlock],
      }));

      // Create <CodeTabs> wrapper with CodeTabsList and CodeTab children
      const codeTabsNode = {
        type: 'mdxJsxFlowElement',
        name: 'CodeTabs',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'defaultFile',
            value: files[0],
          },
        ],
        children: [codeTabsList, ...codeTabNodes],
      };

      // Calculate how many nodes to remove (heading + all collected code blocks + whitespace between)
      const nodesToRemove = currentIndex - index;

      // Create an array of nodes to insert
      const nodesToInsert: (Heading | typeof codeTabsNode)[] = [];

      // If there's remaining text after [!CodeTabs], preserve the heading
      if (remainingText) {
        const preservedHeading: Heading = {
          type: 'heading',
          depth: node.depth,
          children: [
            {
              type: 'text',
              value: remainingText,
            },
          ],
        };
        nodesToInsert.push(preservedHeading);
      }

      // Add the CodeTabs structure
      nodesToInsert.push(codeTabsNode);

      // Replace heading and all code blocks with the new structure
      parent.children.splice(index, nodesToRemove, ...nodesToInsert);

      // Skip visiting children of the new node
      return 'skip';
    });
  };
};

export default remarkCodeTabs;
