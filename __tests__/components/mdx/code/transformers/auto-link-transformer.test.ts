import { describe, it, expect } from 'vitest'
import { transformerMetaAddIds, transformerMetaAddHrefs } from '@/components/mdx/code/transformers/meta-auto-link'
import type { SymbolMetadata } from '@/lib/types'

describe('auto-link-transformer', () => {
  const mockTooltipMap: Record<string, SymbolMetadata> = {
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
    },
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
    }
  }

  describe('transformerMetaAddIds', () => {
    it('creates transformer with correct name', () => {
      const transformer = transformerMetaAddIds(mockTooltipMap)
      expect(transformer.name).toBe('transformers:meta-add-ids')
    })

    it('has span method for processing elements', () => {
      const transformer = transformerMetaAddIds(mockTooltipMap)
      expect(typeof transformer.span).toBe('function')
    })

    it('accepts custom className option', () => {
      const transformer = transformerMetaAddIds(mockTooltipMap, { className: 'custom-target' })
      expect(transformer.name).toBe('transformers:meta-add-ids')
    })
  })

  describe('transformerMetaAddHrefs', () => {
    it('creates transformer with correct name', () => {
      const transformer = transformerMetaAddHrefs(mockTooltipMap)
      expect(transformer.name).toBe('transformers:meta-add-hrefs')
    })

    it('has span method for processing elements', () => {
      const transformer = transformerMetaAddHrefs(mockTooltipMap)
      expect(typeof transformer.span).toBe('function')
    })

    it('accepts custom className option', () => {
      const transformer = transformerMetaAddHrefs(mockTooltipMap, { className: 'custom-link' })
      expect(transformer.name).toBe('transformers:meta-add-hrefs')
    })
  })
}) 