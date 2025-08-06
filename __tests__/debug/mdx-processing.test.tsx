import { describe, it, expect } from 'vitest'
import { compile } from '@mdx-js/mdx'
import remarkListVariants from '@/plugins/remark-list-variants'

describe('MDX Processing Debug', () => {
  it('should process decimal list patterns and generate correct JSX', async () => {
    const mdxSource = `
1. Item one 
    1.1. Item one.one - this should be nested (the svg should be 1.1)
    1.2. Item one.two - this should be nested (the svg should be 1.2)
2. Item two
`

    const compiled = await compile(mdxSource, {
      remarkPlugins: [remarkListVariants],
      development: false
    })

    console.log('=== COMPILED MDX OUTPUT ===')
    console.log(compiled.toString())
    console.log('============================')

    const compiledString = compiled.toString()
    
    // Check if the compiled output contains the decimal list attributes
    expect(compiledString).toContain('data-is-decimal-list')
    expect(compiledString).toContain('data-custom-number')
  })

  it('should process simple start number patterns', async () => {
    const mdxSource = `
5. Item five - part of the previous list (as 5 comes after 4)
6. Item six
`

    const compiled = await compile(mdxSource, {
      remarkPlugins: [remarkListVariants],
      development: false
    })

    console.log('=== START NUMBER OUTPUT ===')
    console.log(compiled.toString())
    console.log('===========================')

    const compiledString = compiled.toString()
    
    // Check if start attribute is set
    expect(compiledString).toContain('start')
  })
})