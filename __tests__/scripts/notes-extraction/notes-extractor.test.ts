import { describe, it, expect, vi } from 'vitest'
import { extractNotesContent } from '@/lib/notes-extraction/notes-extractor'

// Mock dependencies
vi.mock('glob', () => ({
  glob: vi.fn()
}))

vi.mock('@/lib/notes-extraction/mdx-processor', () => ({
  processMdxFile: vi.fn()
}))

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn()
  }
}))

describe('Notes Extractor', () => {
  it('should extract content from multiple MDX files', async () => {
    // Mock glob to return test files
    const { glob } = await import('glob')
    vi.mocked(glob).mockResolvedValue([
      '/app/notes/binary-search/page.mdx',
      '/app/notes/kadane/page.mdx'
    ])

    // Mock processMdxFile results
    const { processMdxFile } = await import('@/lib/notes-extraction/mdx-processor')
    vi.mocked(processMdxFile)
      .mockResolvedValueOnce({
        title: 'Binary Search',
        route: '/notes/binary-search',
        filePath: 'app/notes/binary-search/page.mdx',
        headings: ['Binary Search', 'Implementation'],
        text: 'Binary search algorithm content',
        codeBlocks: [],
        keyTerms: ['binary', 'search', 'algorithm'],
        notations: ['O(log n)'],
        categories: ['binary-search']
      })
      .mockResolvedValueOnce({
        title: 'Kadane Algorithm',
        route: '/notes/kadane', 
        filePath: 'app/notes/kadane/page.mdx',
        headings: ['Kadane Algorithm', 'Maximum Subarray'],
        text: 'Kadane algorithm for maximum subarray',
        codeBlocks: [],
        keyTerms: ['kadane', 'algorithm', 'maximum', 'subarray'],
        notations: ['O(n)'],
        categories: ['kadane']
      })

    // Mock file system
    const fs = await import('fs')
    vi.mocked(fs.default.existsSync).mockReturnValue(true)

    const result = await extractNotesContent()

    expect(result).toBeDefined()
    expect(Object.keys(result)).toHaveLength(2)
    expect(result['binary-search']).toBeDefined()
    expect(result['kadane']).toBeDefined()
    expect(result['binary-search'].title).toBe('Binary Search')
    expect(result['kadane'].title).toBe('Kadane Algorithm')
  })

  it('should skip files that fail to process', async () => {
    const { glob } = await import('glob')
    vi.mocked(glob).mockResolvedValue([
      '/app/notes/working/page.mdx',
      '/app/notes/broken/page.mdx'
    ])

    const { processMdxFile } = await import('@/lib/notes-extraction/mdx-processor')
    vi.mocked(processMdxFile)
      .mockResolvedValueOnce({
        title: 'Working',
        route: '/notes/working',
        filePath: 'app/notes/working/page.mdx',
        headings: ['Working'],
        text: 'This works',
        codeBlocks: [],
        keyTerms: ['working'],
        complexity: [],
        categories: ['working']
      })
      .mockResolvedValueOnce(null) // Failed processing

    const fs = await import('fs')
    vi.mocked(fs.default.existsSync).mockReturnValue(true)

    const result = await extractNotesContent()

    expect(Object.keys(result)).toHaveLength(1)
    expect(result['working']).toBeDefined()
    expect(result['broken']).toBeUndefined()
  })

  it('should create output directory if it does not exist', async () => {
    const { glob } = await import('glob')
    vi.mocked(glob).mockResolvedValue([])

    const fs = await import('fs')
    vi.mocked(fs.default.existsSync).mockReturnValue(false)

    await extractNotesContent()

    expect(fs.default.mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('lib/extracted-metadata'),
      { recursive: true }
    )
  })

  it('should write dictionary to JSON file', async () => {
    const { glob } = await import('glob')
    vi.mocked(glob).mockResolvedValue([])

    const fs = await import('fs')
    vi.mocked(fs.default.existsSync).mockReturnValue(true)

    await extractNotesContent()

    expect(fs.default.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('notes_dictionary.json'),
      expect.any(String)
    )
  })
})