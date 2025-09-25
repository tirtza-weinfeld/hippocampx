import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import { remarkHeaderSection } from '@/plugins/remark-header-section'

describe('Slug Duplication Issue', () => {
  it('should generate correct slug without duplication', async () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkHeaderSection)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeStringify)

    const input = '## [!COMPONENT:ProblemTimeComplexity] Time Complexity $ElogV$'
    const result = await processor.process(input)
    
    console.log('HTML result:', String(result))
    
    // The slug should be time-complexity-elogv, not time-complexityelogvelogvelogv
    expect(String(result)).toContain('id="time-complexity-elogv"')
    expect(String(result)).not.toContain('elogvelogv')
  })
})