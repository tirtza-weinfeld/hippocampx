import { describe, it, expect } from 'vitest'
import { transformerCodeTooltipWords, findAllSubstringIndexes } from '@/components/mdx/code/transformers/meta-tooltip'
import type { SymbolMetadata } from '@/lib/types'

interface Decoration {
  start: number
  end: number
  properties: {
    'data-tooltip-symbol'?: string
    'data-tooltip-parent'?: string
    'data-tooltip-path'?: string
    class?: string
  }
}

interface PreprocessOptions {
  decorations: Decoration[]
}

describe('tooltip-transformer', () => {
  describe('findAllSubstringIndexes', () => {
    it('finds all occurrences of a substring', () => {
      const code = 'def test(): pass\ntest()\nresult = test()'
      const indexes = findAllSubstringIndexes(code, 'test')
      expect(indexes).toEqual([4, 19, 32])
    })

    it('handles overlapping matches correctly', () => {
      const code = 'aaa'
      const indexes = findAllSubstringIndexes(code, 'aa')
      expect(indexes).toEqual([0, 1])
    })

    it('returns empty array for non-existent substring', () => {
      const code = 'def test(): pass'
      const indexes = findAllSubstringIndexes(code, 'nonexistent')
      expect(indexes).toEqual([])
    })

    it('handles empty string', () => {
      const code = ''
      const indexes = findAllSubstringIndexes(code, 'test')
      expect(indexes).toEqual([])
    })
  })

  describe('transformerCodeTooltipWords', () => {
    const mockTooltipMap: Record<string, SymbolMetadata> = {
      'LRUCache': {
        name: 'LRUCache',
        type: 'class',
        language: 'python',
        file: 'examples/code/cache.py',
        line: 4,
        signature: 'class LRUCache:',
        parameters: [],
        return_type: '',
        return_description: '',
        description: '',
        code: 'class LRUCache:\n    def __init__(self, capacity: int):\n        self.cache: OrderedDict[int, int] = OrderedDict()\n        self.capacity = capacity'
      },
      'LRUCache.get': {
        name: 'get',
        type: 'method',
        language: 'python',
        file: 'examples/code/cache.py',
        line: 9,
        signature: 'def get(self, key: int) -> int:',
        parameters: [
          {
            name: 'key',
            type: 'int',
            description: '',
            default: null
          }
        ],
        return_type: 'int',
        return_description: '',
        description: '',
        code: 'def get(self, key: int) -> int:\n        if (val := self.cache.get(key)) is None:\n            return -1\n        self.cache.move_to_end(key)\n        return val',
        parent: 'LRUCache'
      },
      'maxSubArrayLen': {
        name: 'maxSubArrayLen',
        type: 'function',
        language: 'python',
        file: 'examples/code/prefix_sum.py',
        line: 8,
        signature: 'def maxSubArrayLen(nums: list[int], k: int) -> int:',
        parameters: [
          {
            name: 'nums',
            type: 'list[int]',
            description: 'List of integers.',
            default: null
          },
          {
            name: 'k',
            type: 'int',
            description: 'Target sum.',
            default: null
          }
        ],
        return_type: 'int',
        return_description: '',
        description: '',
        code: 'def maxSubArrayLen(nums: list[int], k: int) -> int:\n    prefix_sum = {0: -1}\n    curr_sum = 0\n    max_len = 0\n    \n    for i, num in enumerate(nums):\n        curr_sum += num\n        if curr_sum - k in prefix_sum:\n            max_len = max(max_len, i - prefix_sum[curr_sum - k])\n        if curr_sum not in prefix_sum:\n            prefix_sum[curr_sum] = i\n    \n    return max_len'
      }
    }

    it('creates transformer with correct name', () => {
      const transformer = transformerCodeTooltipWords(mockTooltipMap)
      expect(transformer.name).toBe('data-tooltip-symbol')
    })

    it('finds all occurrences of function names in code', () => {
      const transformer = transformerCodeTooltipWords(mockTooltipMap)
      const code = 'def maxSubArrayLen(nums: list[int], k: int) -> int:\n    result = maxSubArrayLen([1, 2, 3], 5)\n    return maxSubArrayLen(nums, k)'
      
      const options: PreprocessOptions = { decorations: [] }
      transformer.preprocess!(code, options)
      
      const maxSubArrayLenDecorations = options.decorations.filter((d: Decoration) => 
        d.properties['data-tooltip-symbol'] === 'maxSubArrayLen'
      )
      
      expect(maxSubArrayLenDecorations).toHaveLength(3)
      expect(maxSubArrayLenDecorations[0].properties.class).toBe('tooltip-symbol')
    })

    it('finds all occurrences of class names in code', () => {
      const transformer = transformerCodeTooltipWords(mockTooltipMap)
      const code = 'class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\ncache = LRUCache(10)\nresult = LRUCache.get(cache, 5)'
      
      const options: PreprocessOptions = { decorations: [] }
      transformer.preprocess!(code, options)
      
      const lruCacheDecorations = options.decorations.filter((d: Decoration) => 
        d.properties['data-tooltip-symbol'] === 'LRUCache'
      )
      
      expect(lruCacheDecorations).toHaveLength(3)
      expect(lruCacheDecorations[0].properties.class).toBe('tooltip-symbol')
    })

    it('finds all occurrences of method names in code', () => {
      const transformer = transformerCodeTooltipWords(mockTooltipMap)
      const code = 'def get(self, key: int) -> int:\n    return self.cache.get(key)\n\nresult = cache.get(5)\nmethod = get'
      
      const options: PreprocessOptions = { decorations: [] }
      transformer.preprocess!(code, options)
      
      const getDecorations = options.decorations.filter((d: Decoration) => 
        d.properties['data-tooltip-symbol'] === 'LRUCache.get'
      )
      
      // Should find all occurrences of 'get' method
      expect(getDecorations.length).toBeGreaterThan(0)
    })

    it('finds all occurrences of parameters in code', () => {
      const transformer = transformerCodeTooltipWords(mockTooltipMap)
      const code = 'def maxSubArrayLen(nums: list[int], k: int) -> int:\n    for num in nums:\n        if num == k:\n            return len(nums)\n    return 0'
      
      const options: PreprocessOptions = { decorations: [] }
      transformer.preprocess!(code, options)
      
      const numsDecorations = options.decorations.filter((d: Decoration) => 
        d.properties['data-tooltip-symbol'] === 'nums'
      )
      const kDecorations = options.decorations.filter((d: Decoration) => 
        d.properties['data-tooltip-symbol'] === 'k'
      )
      
      expect(numsDecorations.length).toBeGreaterThan(0)
      expect(kDecorations.length).toBeGreaterThan(0)
      
      // Check that parameters have parent information
      expect(numsDecorations[0].properties['data-tooltip-parent']).toBe('maxSubArrayLen')
      expect(kDecorations[0].properties['data-tooltip-parent']).toBe('maxSubArrayLen')
    })

    it('handles parameters with hierarchical paths', () => {
      const transformer = transformerCodeTooltipWords(mockTooltipMap)
      const code = 'def get(self, key: int) -> int:\n    return self.cache.get(key)'
      
      const options: PreprocessOptions = { decorations: [] }
      transformer.preprocess!(code, options)
      
      const keyDecorations = options.decorations.filter((d: Decoration) => 
        d.properties['data-tooltip-symbol'] === 'key'
      )
      
      expect(keyDecorations.length).toBeGreaterThan(0)
      expect(keyDecorations[0].properties['data-tooltip-parent']).toBe('LRUCache.get')
      expect(JSON.parse(keyDecorations[0].properties['data-tooltip-path']!)).toEqual(['LRUCache', 'LRUCache.get'])
    })

    it('handles complex code with multiple symbol types', () => {
      const transformer = transformerCodeTooltipWords(mockTooltipMap)
      const code = `class LRUCache:
    def __init__(self, capacity: int):
        self.cache = {}
        self.capacity = capacity
    
    def get(self, key: int) -> int:
        if key in self.cache:
            return self.cache[key]
        return -1

# Usage
cache = LRUCache(10)
result = cache.get(5)
max_len = maxSubArrayLen([1, 2, 3], 5)`
      
      const options: PreprocessOptions = { decorations: [] }
      transformer.preprocess!(code, options)
      
      // Should find all occurrences of all symbols
      const lruCacheDecorations = options.decorations.filter((d: Decoration) => 
        d.properties['data-tooltip-symbol'] === 'LRUCache'
      )
      const getDecorations = options.decorations.filter((d: Decoration) => 
        d.properties['data-tooltip-symbol'] === 'LRUCache.get'
      )
      const maxSubArrayLenDecorations = options.decorations.filter((d: Decoration) => 
        d.properties['data-tooltip-symbol'] === 'maxSubArrayLen'
      )
      
      expect(lruCacheDecorations.length).toBeGreaterThan(0)
      expect(getDecorations.length).toBeGreaterThan(0)
      expect(maxSubArrayLenDecorations.length).toBeGreaterThan(0)
    })

    it('maintains backward compatibility with span method', () => {
      const transformer = transformerCodeTooltipWords(mockTooltipMap)
      
      // Test that the span method still exists and works
      expect(typeof transformer.span).toBe('function')
      
      // Create a mock element that would be processed by span
      const mockElement = {
        children: [{ type: 'text', value: 'LRUCache' }],
        properties: {}
      }
      
      // This should not throw and should add tooltip properties
      transformer.span!.call({} as any, mockElement)
      expect(mockElement.properties['data-tooltip-symbol']).toBe('LRUCache')
      expect(mockElement.properties['class']).toContain('tooltip-symbol')
    })
  })
}) 