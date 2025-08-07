import { test, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkSmartCodeImport from '../../../plugins/remark-smart-code-import/index.js';

// Helper function to find code nodes in MDX tree
function findCodeNode(node: any): any {
  if (node.type === 'code') {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findCodeNode(child);
      if (found) return found;
    }
  }
  return null;
}

test('should extract Trie class correctly (not TrieNode)', () => {
  const testMdx = `
# Test

\`\`\`python file=backend/algorithms/trie.py#class:Trie
\`\`\`
`;

  const processor = unified()
    .use(remarkParse)
    .use(remarkSmartCodeImport);

  const tree = processor.parse(testMdx);
  processor.runSync(tree);
  
  const codeNode = findCodeNode(tree);
  
  expect(codeNode).toBeTruthy();
  expect(codeNode.value).toContain('class Trie:');
  expect(codeNode.value).not.toContain('class TrieNode:');
  expect(codeNode.value).toContain('def insert');
  expect(codeNode.value).toContain('def search');
  expect(codeNode.value).toContain('def startsWith');
});

test('should extract function from file', () => {
  const testMdx = `
\`\`\`python file=backend/algorithms/trie.py#func:extractFunction
\`\`\`
`;

  const processor = unified()
    .use(remarkParse)
    .use(remarkSmartCodeImport);

  const tree = processor.parse(testMdx);
  processor.runSync(tree);
  
  const codeNode = findCodeNode(tree);
  
  // Should not find anything since extractFunction doesn't exist in trie.py
  expect(codeNode?.value).toBe('');
});