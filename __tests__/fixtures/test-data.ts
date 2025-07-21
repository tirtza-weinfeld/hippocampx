// Test code samples for different languages
export const testCodeSamples = {
  python: {
    simple: 'def test():\n    pass',
    function: `def maxSubArrayLen(nums: list[int], k: int) -> int:
    """Find the maximum length of a subarray that sums to exactly k."""
    prefix_sum = 0
    max_length = 0
    sum_to_index = {0: -1}
    
    for i, num in enumerate(nums):
        prefix_sum += num
        target = prefix_sum - k
        
        if target in sum_to_index:
            max_length = max(max_length, i - sum_to_index[target])
        
        if prefix_sum not in sum_to_index:
            sum_to_index[prefix_sum] = i
    
    return max_length`,
    
    class: `class LRUCache:
    """Least Recently Used Cache implementation using OrderedDict."""
    
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key: int) -> int:
        """
        When an item is accessed, it becomes the most recently used.
        We fetch the item and move it to the end of the OrderedDict.
        """
        if (val := self.cache.get(key)) is None:
            return -1
        self.cache.move_to_end(key)
        return val
    
    def put(self, key: int, value: int) -> None:
        """Add or update a key-value pair."""
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,
            
    algorithm: `def bellman_ford(graph, start):
    """
    Bellman-Ford algorithm for shortest path with negative edge detection.
    
    Args:
        graph: Dictionary representing the graph
        start: Starting vertex
        
    Returns:
        Tuple of (distances, predecessor, has_negative_cycle)
    """
    vertices = list(graph.keys())
    distances = {v: float('inf') for v in vertices}
    distances[start] = 0
    predecessor = {v: None for v in vertices}
    
    # Relax edges V-1 times
    for _ in range(len(vertices) - 1):
        for u in graph:
            for v, weight in graph[u]:
                if distances[u] + weight < distances[v]:
                    distances[v] = distances[u] + weight
                    predecessor[v] = u
    
    # Check for negative cycles
    has_negative_cycle = False
    for u in graph:
        for v, weight in graph[u]:
            if distances[u] + weight < distances[v]:
                has_negative_cycle = True
                break
    
    return distances, predecessor, has_negative_cycle`,
  },
  
  javascript: {
    simple: 'function test() { return true; }',
    function: `function binarySearch(arr, target) {
  /**
   * Binary search implementation
   * @param {number[]} arr - Sorted array to search
   * @param {number} target - Value to find
   * @returns {number} Index of target or -1 if not found
   */
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
    
    class: `class TicTacToe {
  /**
   * Tic Tac Toe game implementation
   */
  constructor() {
    this.board = Array(3).fill(null).map(() => Array(3).fill(null));
    this.currentPlayer = 'X';
  }
  
  makeMove(row, col) {
    if (this.board[row][col] !== null) {
      return false;
    }
    
    this.board[row][col] = this.currentPlayer;
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    return true;
  }
  
  checkWinner() {
    // Check rows, columns, and diagonals
    for (let i = 0; i < 3; i++) {
      // Check rows
      if (this.board[i][0] && 
          this.board[i][0] === this.board[i][1] && 
          this.board[i][1] === this.board[i][2]) {
        return this.board[i][0];
      }
      
      // Check columns
      if (this.board[0][i] && 
          this.board[0][i] === this.board[1][i] && 
          this.board[1][i] === this.board[2][i]) {
        return this.board[0][i];
      }
    }
    
    return null;
  }
}`,
  },
  
  typescript: {
    interface: `interface GameState {
  board: (string | null)[][];
  currentPlayer: 'X' | 'O';
  winner: string | null;
  isGameOver: boolean;
}`,
    
    type: `type Position = {
  row: number;
  col: number;
}

type MoveResult = {
  success: boolean;
  winner?: string;
  gameOver?: boolean;
}`,
    
    generic: `function createCache<T>(initialValue: T): Cache<T> {
  const cache = new Map<string, T>();
  
  return {
    get(key: string): T | undefined {
      return cache.get(key) ?? initialValue;
    },
    
    set(key: string, value: T): void {
      cache.set(key, value);
    },
    
    clear(): void {
      cache.clear();
    }
  };
}`,
  }
}

// Test metadata for tooltips
export const testMetadata = {
  functions: {
    'maxSubArrayLen': {
      type: 'function',
      signature: 'def maxSubArrayLen(nums: list[int], k: int) -> int:',
      docstring: 'Find the maximum length of a subarray that sums to exactly k.',
      parameters: [
        { name: 'nums', type: 'list[int]', description: 'List of integers.' },
        { name: 'k', type: 'int', description: 'Target sum.' }
      ],
      returns: { type: 'int', description: 'Maximum subarray length.' }
    },
    'binarySearch': {
      type: 'function',
      signature: 'function binarySearch(arr: number[], target: number): number',
      docstring: 'Binary search implementation',
      parameters: [
        { name: 'arr', type: 'number[]', description: 'Sorted array to search' },
        { name: 'target', type: 'number', description: 'Value to find' }
      ],
      returns: { type: 'number', description: 'Index of target or -1 if not found' }
    }
  },
  
  classes: {
    'LRUCache': {
      type: 'class',
      signature: 'class LRUCache:',
      docstring: 'Least Recently Used Cache implementation using OrderedDict.',
      methods: {
        'get': {
          signature: 'def get(self, key: int) -> int:',
          docstring: 'When an item is accessed, it becomes the most recently used.',
          parameters: [{ name: 'key', type: 'int', description: 'Cache key' }],
          returns: { type: 'int', description: 'Cached value or -1' }
        },
        'put': {
          signature: 'def put(self, key: int, value: int) -> None:',
          docstring: 'Add or update a key-value pair.',
          parameters: [
            { name: 'key', type: 'int', description: 'Cache key' },
            { name: 'value', type: 'int', description: 'Value to cache' }
          ]
        }
      }
    }
  }
}

// Test props for different components
export const testProps = {
  codeBlock: {
    basic: {
      className: 'language-python',
      children: testCodeSamples.python.simple
    },
    withMeta: {
      className: 'language-python',
      meta: 'title="example.py" highlight="1,3-5"',
      children: testCodeSamples.python.function
    },
    javascript: {
      className: 'language-javascript',
      children: testCodeSamples.javascript.simple
    }
  },
  
  alert: {
    info: { type: 'info', children: 'Information message' },
    warning: { type: 'warning', children: 'Warning message' },
    error: { type: 'error', children: 'Error message' },
    success: { type: 'success', children: 'Success message' }
  },
  
  tooltip: {
    basic: {
      content: 'Tooltip content',
      children: 'Hover me'
    },
    code: {
      symbol: 'maxSubArrayLen',
      metadata: testMetadata.functions.maxSubArrayLen,
      children: 'maxSubArrayLen'
    }
  }
}