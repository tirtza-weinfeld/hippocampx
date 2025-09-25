import { describe, it, expect, beforeEach } from 'vitest'
import type { SymbolMetadata } from '@/lib/types'

interface TooltipSymbol {
  symbol: string
  signature: string
  description: string
  return_type: string
  parameters?: Record<string, string>
  complexity?: string
  symbolType: 'function' | 'method' | 'variable' | 'expression' | 'builtin'
}

// Mock Python AST extraction functionality
const mockPythonCode = `
from collections import deque
from typing import List, Set, Tuple

def bfs_shortest_path(grid: List[List[int]], start: Tuple[int, int], end: Tuple[int, int]) -> int:
    """
    Find shortest path in grid using BFS algorithm.
    
    Args:
        grid: 2D grid where 0=walkable, 1=wall
        start: Starting coordinates (row, col)
        end: Target coordinates (row, col)
    
    Returns:
        Shortest path length or -1 if no path exists
        
    Time Complexity: O(rows * cols)
    Space Complexity: O(rows * cols)
    """
    if not grid or not grid[0]:
        return -1
    
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start[0], start[1], 0)])
    visited = set()
    visited.add(start)
    
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    
    while queue:
        row, col, distance = queue.popleft()
        
        if (row, col) == end:
            return distance
            
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            
            if (0 <= new_row < rows and 
                0 <= new_col < cols and 
                grid[new_row][new_col] == 0 and 
                (new_row, new_col) not in visited):
                
                visited.add((new_row, new_col))
                queue.append((new_row, new_col, distance + 1))
    
    return -1

# Test helper function
def create_test_grid() -> List[List[int]]:
    """Create a sample test grid for BFS testing."""
    return [
        [0, 0, 1, 0],
        [1, 0, 1, 0], 
        [0, 0, 0, 0],
        [0, 1, 1, 0]
    ]
`.trim()

class PythonASTExtractor {
  extractTooltipSymbols(source: string): Record<string, TooltipSymbol> {
    // Mock implementation that would use Python AST parsing
    const tooltipData: Record<string, TooltipSymbol> = {}
    
    // Extract function definitions with proper docstring parsing
    const functionMatches = source.match(/def\s+(\w+)\s*\([^)]*\)\s*->\s*([^:]+):/g)
    if (functionMatches) {
      functionMatches.forEach(match => {
        const funcName = match.match(/def\s+(\w+)/)?.[1]
        const returnType = match.match(/->\s*([^:]+):/)?.[1]?.trim()
        
        if (funcName) {
          tooltipData[funcName] = {
            symbol: funcName,
            signature: match.replace(/def\s+/, '').replace(/:$/, ''),
            description: this.extractDocstring(source, funcName),
            return_type: returnType || 'None',
            parameters: this.extractParameters(match),
            symbolType: 'function'
          }
        }
      })
    }
    
    // Extract built-in functions and methods
    this.addBuiltinTooltips(tooltipData, source)
    
    // Extract variable types
    this.addVariableTooltips(tooltipData, source)
    
    // Extract expressions
    this.addExpressionTooltips(tooltipData, source)
    
    return tooltipData
  }
  
  private extractDocstring(source: string, funcName: string): string {
    const funcStart = source.indexOf(`def ${funcName}`)
    if (funcStart === -1) return `${funcName} function`
    
    const docstringMatch = source.slice(funcStart).match(/"""([^"]+)"""/s)
    if (docstringMatch) {
      return docstringMatch[1].split('\n')[0].trim()
    }
    
    return `${funcName} function`
  }
  
  private extractParameters(signature: string): Record<string, string> {
    const params: Record<string, string> = {}
    const paramMatch = signature.match(/\(([^)]+)\)/)
    
    if (paramMatch) {
      const paramList = paramMatch[1].split(',')
      paramList.forEach(param => {
        const trimmed = param.trim()
        const [name, type] = trimmed.split(':').map(s => s.trim())
        if (name && type) {
          params[name] = type
        }
      })
    }
    
    return params
  }
  
  private addExpressionTooltips(tooltipData: Record<string, TooltipSymbol>, source: string) {
    // Extract common expressions that users might hover over
    const expressions = [
      {
        pattern: /len\(([^)]+)\)/g,
        generator: (match: string, arg: string) => ({
          symbol: match,
          signature: `len(${arg}) -> int`,
          description: `Number of items in ${arg}`,
          return_type: 'int',
          symbolType: 'expression' as const
        })
      },
      {
        pattern: /range\(([^)]+)\)/g,
        generator: (match: string, arg: string) => ({
          symbol: match,
          signature: `range(${arg}) -> range`,
          description: `Range object from 0 to ${arg}`,
          return_type: 'range',
          symbolType: 'expression' as const
        })
      }
    ]
    
    expressions.forEach(({ pattern, generator }) => {
      let match
      while ((match = pattern.exec(source)) !== null) {
        const fullMatch = match[0]
        const arg = match[1]
        if (!tooltipData[fullMatch]) {
          tooltipData[fullMatch] = generator(fullMatch, arg)
        }
      }
    })
  }
  
  private addBuiltinTooltips(tooltipData: Record<string, TooltipSymbol>, source: string) {
    // Add common built-in functions
    const builtins = {
      'len': {
        symbol: 'len',
        signature: 'len(obj) -> int',
        description: 'Return the length of an object',
        return_type: 'int',
        parameters: { obj: 'object' },
        symbolType: 'builtin' as const
      },
      'deque': {
        symbol: 'deque',
        signature: 'deque([iterable[, maxlen]]) -> deque',
        description: 'Double-ended queue with O(1) append/pop operations',
        return_type: 'deque[T]',
        parameters: { iterable: 'Iterable[T]', maxlen: 'int | None' },
        symbolType: 'builtin' as const
      },
      'set': {
        symbol: 'set',
        signature: 'set([iterable]) -> set',
        description: 'Create a new set object',
        return_type: 'set[T]',
        parameters: { iterable: 'Iterable[T]' },
        symbolType: 'builtin' as const
      },
      'range': {
        symbol: 'range',
        signature: 'range(stop) -> range',
        description: 'Create a range of numbers',
        return_type: 'range',
        parameters: { stop: 'int' },
        symbolType: 'builtin' as const
      }
    }
    
    Object.entries(builtins).forEach(([name, data]) => {
      if (source.includes(name)) {
        tooltipData[name] = data
      }
    })
    
    // Add method calls
    if (source.includes('popleft')) {
      tooltipData['popleft'] = {
        symbol: 'popleft',
        signature: 'deque.popleft() -> T',
        description: 'Remove and return element from left side',
        return_type: 'T',
        complexity: 'O(1)',
        symbolType: 'method'
      }
    }
    
    if (source.includes('append')) {
      tooltipData['append'] = {
        symbol: 'append',
        signature: 'deque.append(item: T) -> None',
        description: 'Add element to right side',
        return_type: 'None',
        parameters: { item: 'T' },
        complexity: 'O(1)',
        symbolType: 'method'
      }
    }
    
    if (source.includes('.add')) {
      tooltipData['add'] = {
        symbol: 'add',
        signature: 'set.add(item: T) -> None',
        description: 'Add element to set',
        return_type: 'None',
        parameters: { item: 'T' },
        complexity: 'O(1) average',
        symbolType: 'method'
      }
    }
  }
  
  private addVariableTooltips(tooltipData: Record<string, TooltipSymbol>, source: string) {
    // Extract typed variables
    const varMatches = source.match(/(\w+):\s*([^=\n]+)/g)
    if (varMatches) {
      varMatches.forEach(match => {
        const [, varName, varType] = match.match(/(\w+):\s*([^=\n]+)/) || []
        if (varName && varType && !tooltipData[varName]) {
          tooltipData[varName] = {
            symbol: varName,
            signature: `${varName}: ${varType.trim()}`,
            description: `Variable of type ${varType.trim()}`,
            return_type: varType.trim(),
            symbolType: 'variable'
          }
        }
      })
    }
  }
}

describe('PythonASTExtractor', () => {
  let extractor: PythonASTExtractor
  
  beforeEach(() => {
    extractor = new PythonASTExtractor()
  })
  
  describe('extractTooltipSymbols', () => {
    it('should extract function signatures with type annotations', () => {
      const tooltips = extractor.extractTooltipSymbols(mockPythonCode)
      
      expect(tooltips['bfs_shortest_path']).toEqual({
        symbol: 'bfs_shortest_path',
        signature: 'bfs_shortest_path(grid: List[List[int]], start: Tuple[int, int], end: Tuple[int, int]) -> int',
        description: 'Find shortest path in grid using BFS algorithm.',
        return_type: 'int',
        parameters: {
          grid: 'List[List[int]]',
          start: 'Tuple[int, int]',
          end: 'Tuple[int, int]'
        },
        complexity: 'O(rows * cols)'
      })
    })
    
    it('should extract helper function signatures', () => {
      const tooltips = extractor.extractTooltipSymbols(mockPythonCode)
      
      expect(tooltips['create_test_grid']).toEqual({
        symbol: 'create_test_grid',
        signature: 'create_test_grid() -> List[List[int]]',
        description: 'Create a sample test grid for BFS testing.',
        return_type: 'List[List[int]]',
        parameters: {},
        complexity: undefined
      })
    })
    
    it('should extract built-in function tooltips', () => {
      const tooltips = extractor.extractTooltipSymbols(mockPythonCode)
      
      expect(tooltips['len']).toEqual({
        symbol: 'len',
        signature: 'len(obj) -> int',
        description: 'Return the length of an object',
        return_type: 'int',
        parameters: { obj: 'object' }
      })
      
      expect(tooltips['deque']).toEqual({
        symbol: 'deque',
        signature: 'deque([iterable[, maxlen]]) -> deque',
        description: 'Double-ended queue with O(1) append/pop operations',
        return_type: 'deque[T]',
        parameters: { iterable: 'Iterable[T]', maxlen: 'int | None' }
      })
    })
    
    it('should extract method call tooltips', () => {
      const tooltips = extractor.extractTooltipSymbols(mockPythonCode)
      
      expect(tooltips['popleft']).toEqual({
        symbol: 'popleft',
        signature: 'deque.popleft() -> T',
        description: 'Remove and return element from left side',
        return_type: 'T',
        parameters: {},
        complexity: 'O(1)'
      })
      
      expect(tooltips['append']).toEqual({
        symbol: 'append',
        signature: 'deque.append(item: T) -> None',
        description: 'Add element to right side',
        return_type: 'None',
        parameters: { item: 'T' },
        complexity: 'O(1)'
      })
      
      expect(tooltips['add']).toEqual({
        symbol: 'add',
        signature: 'set.add(item: T) -> None',
        description: 'Add element to set',
        return_type: 'None',
        parameters: { item: 'T' },
        complexity: 'O(1) average'
      })
    })
    
    it('should extract variable type annotations', () => {
      const tooltips = extractor.extractTooltipSymbols(mockPythonCode)
      
      expect(tooltips['queue']).toEqual({
        symbol: 'queue',
        signature: 'queue: deque',
        description: 'Variable of type deque',
        return_type: 'deque',
        parameters: {}
      })
      
      expect(tooltips['visited']).toEqual({
        symbol: 'visited',
        signature: 'visited: set',
        description: 'Variable of type set',
        return_type: 'set',
        parameters: {}
      })
    })
    
    it('should handle code with proper indentation', () => {
      const indentedCode = `
def nested_function():
    if True:
        queue = deque()
        while queue:
            item = queue.popleft()
            process(item)
`.trim()
      
      const tooltips = extractor.extractTooltipSymbols(indentedCode)
      
      expect(tooltips['popleft']).toBeDefined()
      expect(tooltips['deque']).toBeDefined()
    })
    
    it('should extract hierarchical complexity information matching BFS docstring format', () => {
      const bfsStyleCode = `
def levelOrder(root: TreeNode | None) -> list[list[int]]:
    """
    Problem:
     - Binary Tree Level Order Traversal
     - Given the root of a binary tree, return its nodes' values organized by level, from left to right.
     
    Leetcode: 
      - [102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

    Insight:
      - the core logic hinges on the inner \`for\` loop. The expression \`len(queue)\`
   takes a *"snapshot"* of the number of nodes on the current level before the loop begins.

    Time Complexity:
      - O(N)
      - where N is the total number of nodes in the tree. This is optimal as every node must be visited once.

    Topics: 
      - BFS

    Difficulty: 
      - medium
    """
    if not root:
        return []
    return result
`.trim()
      
      const tooltips = extractor.extractTooltipSymbols(bfsStyleCode)
      
      expect(tooltips['levelOrder']).toEqual({
        symbol: 'levelOrder',
        signature: 'levelOrder(root: TreeNode | None) -> list[list[int]]',
        description: 'Binary Tree Level Order Traversal',
        return_type: 'list[list[int]]',
        parameters: {
          root: 'TreeNode | None'
        },
        complexity: 'O(N)', // Summary for collapsed state
        complexityDetails: ['where N is the total number of nodes in the tree. This is optimal as every node must be visited once.'], // Details for expanded state
        insight: 'the core logic hinges on the inner `for` loop. The expression `len(queue)` takes a *"snapshot"* of the number of nodes on the current level before the loop begins.',
        insightDetails: undefined // Single insight bullet, no collapse needed
      })
    })

    it('should handle multiple complexity detail bullets', () => {
      const multiDetailCode = `
def complexAlgorithm() -> int:
    """
    Time Complexity:
      - O(m * n * k)
      - where m and n are the dimensions of the grid
      - k is the maximum number of obstacles that can be eliminated
      - Worst-case scenario visits every cell with every possible k value
    """
    return 42
`.trim()
      
      const tooltips = extractor.extractTooltipSymbols(multiDetailCode)
      
      expect(tooltips['complexAlgorithm'].complexity).toBe('O(m * n * k)')
      expect(tooltips['complexAlgorithm'].complexityDetails).toEqual([
        'where m and n are the dimensions of the grid',
        'k is the maximum number of obstacles that can be eliminated',
        'Worst-case scenario visits every cell with every possible k value'
      ])
    })

    it('should extract complexity information from docstrings', () => {
      const codeWithComplexity = `
def algorithm() -> int:
    """
    Sample algorithm.
    
    Time Complexity:
      - O(n log n)
    Space Complexity:
      - O(n)
    """
    return 42
`.trim()
      
      const tooltips = extractor.extractTooltipSymbols(codeWithComplexity)
      
      expect(tooltips['algorithm'].complexity).toBe('O(n log n)')
      expect(tooltips['algorithm'].complexityDetails).toBeUndefined()
    })
  })
})