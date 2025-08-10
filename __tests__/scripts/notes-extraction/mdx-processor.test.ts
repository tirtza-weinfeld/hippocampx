import { describe, it, expect, vi } from 'vitest'
import type { NotesContent } from '@/lib/notes-extraction/types'
import { processMdxFile } from '@/lib/notes-extraction/mdx-processor'

// Mock file system
vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn()
  }
}))

describe('MDX Processor', () => {
  it('should process MDX file with code imports', async () => {
    const mockContent = `# Binary Search

## Implementation

\`\`\`python file=backend/algorithms/binary_search.py#func:binarySearch
\`\`\`

Binary search is efficient with O(log n) complexity.`

    // Mock fs.readFileSync
    const fs = await import('fs')
    vi.mocked(fs.default.readFileSync).mockReturnValue(mockContent)

    const result = await processMdxFile('/app/notes/binary-search/page.mdx')

    expect(result).toBeDefined()
    expect(result?.title).toBe('Binary Search')
    expect(result?.headings).toContain('Implementation')
    expect(result?.codeBlocks).toHaveLength(1)
    expect(result?.keyTerms).toContain('binary')
    expect(result?.keyTerms).toContain('search')
    expect(result?.notations).toContain('O(log n)')
  })

  it('should handle MDX with resolved code content', async () => {
    const mockContent = `# Kadane Algorithm

\`\`\`python
def maxSubArray(nums):
    max_sum = float('-inf')
    current_sum = 0
    for num in nums:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum
\`\`\`

This algorithm finds maximum subarray sum.`

    const fs = await import('fs')
    vi.mocked(fs.default.readFileSync).mockReturnValue(mockContent)

    const result = await processMdxFile('/app/notes/kadane/page.mdx')

    expect(result?.codeBlocks[0].content).toContain('maxSubArray')
    expect(result?.codeBlocks[0].content).toContain('current_sum')
    expect(result?.keyTerms).toContain('maxsubarray')
    expect(result?.keyTerms).toContain('current_sum')
  })

  it('should extract multiple headings', async () => {
    const mockContent = `# Main Title

## Section One

### Subsection A

## Section Two

Content here.`

    const fs = await import('fs')
    vi.mocked(fs.default.readFileSync).mockReturnValue(mockContent)

    const result = await processMdxFile('/app/notes/test/page.mdx')

    expect(result?.headings).toEqual([
      'Main Title',
      'Section One', 
      'Subsection A',
      'Section Two'
    ])
  })

  it('should handle files without code blocks', async () => {
    const mockContent = `# Simple Note

Just text content with no code.

## Explanation

More text here.`

    const fs = await import('fs')
    vi.mocked(fs.default.readFileSync).mockReturnValue(mockContent)

    const result = await processMdxFile('/app/notes/simple/page.mdx')

    expect(result?.codeBlocks).toHaveLength(0)
    expect(result?.text).toContain('Just text content')
    expect(result?.text).toContain('More text here')
  })

  it('should return null for files that fail to process', async () => {
    const fs = await import('fs')
    vi.mocked(fs.default.readFileSync).mockImplementation(() => {
      throw new Error('File not found')
    })

    const result = await processMdxFile('/non-existent/file.mdx')
    
    expect(result).toBeNull()
  })
})