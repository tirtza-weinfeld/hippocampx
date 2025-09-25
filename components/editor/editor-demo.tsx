'use client'

import React from 'react'
import { CodeEditor } from './code-editor'
import type { CodeFile } from './types'

const sampleFiles: CodeFile[] = [
  {
    id: 'file-1',
    name: 'example.py',
    language: 'python',
    content: `def best_time_to_buy_and_sell_stock_IV(k: int, prices: list[int]) -> int:
    cost = [float("inf")] * (k + 1)
    profit = [0] * (k + 1)
    for p in prices:
        for t in range(1, k + 1):
            cost[t] = min(cost[t], p - profit[t - 1])
            profit[t] = max(profit[t], p - cost[t])
    return profit[k]

def best_time_to_buy_and_sell_stock_IV_states(k: int, prices: list[int]) -> int:
    buy  = [float("-inf")] * (k + 1)
    sell = [0] * (k + 1)
    for p in prices:
        for t in range(1, k + 1):
            buy[t]  = max(buy[t],  sell[t - 1] - p)
            sell[t] = max(sell[t], buy[t] + p)
    return sell[k]`,
    isDirty: false
  },
  {
    id: 'file-2',
    name: 'algorithm.ts',
    language: 'typescript',
    content: `interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  
  return Math.max(leftDepth, rightDepth) + 1;
}

export { maxDepth, TreeNode };`,
    isDirty: false
  },
  {
    id: 'file-3',
    name: 'README.md',
    language: 'markdown',
    content: `# Code Editor Demo

This is a VS Code-like editor component with the following features:

## Features

- **Tab Management**: Open multiple files with draggable tabs
- **Split Views**: Horizontal and vertical splits for side-by-side editing
- **Syntax Highlighting**: Powered by Shiki with VS Code themes
- **Professional UI**: VS Code-inspired design with dark/light theme support

## Usage

\`\`\`tsx
import { CodeEditor } from '@/components/editor'

const files = [
  {
    id: 'file-1',
    name: 'example.py',
    language: 'python',
    content: 'print("Hello, World!")'
  }
]

<CodeEditor initialFiles={files} />
\`\`\`

## Keyboard Shortcuts

- \`Ctrl+W\` - Close current tab
- \`Ctrl+Shift+P\` - Command palette (coming soon)
- \`Ctrl+\\\` - Split editor right
`,
    isDirty: false
  }
]

export function EditorDemo() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">VS Code-like Editor</h2>
        <p className="text-muted-foreground">
          Professional code editor with tabs, split views, and syntax highlighting
        </p>
      </div>
      
      <CodeEditor
        initialFiles={sampleFiles}
        height="600px"
        showLineNumbers={true}
        fontSize={14}
        className="shadow-lg"
      />
    </div>
  )
}