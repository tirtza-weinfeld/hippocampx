import { describe, it, expect, beforeAll } from 'vitest'

// ONLY file loading test - no inline CSS that would define @function first
describe('Bleeding Edge Theme (file only)', () => {
  beforeAll(async () => {
    // Load via link tag
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/bleeding-theme-inline-test.css'
    document.head.appendChild(link)

    await new Promise(resolve => {
      link.onload = resolve
      link.onerror = () => resolve(undefined)
    })

    console.log('File CSS loaded')

    // Check root variables
    const rootStyle = getComputedStyle(document.documentElement)
    console.log('Root --scheme:', rootStyle.getPropertyValue('--scheme'))
    console.log('Root --hue:', rootStyle.getPropertyValue('--hue'))
    console.log('Root --layer-base:', rootStyle.getPropertyValue('--layer-base'))
    console.log('Root --intent-src:', rootStyle.getPropertyValue('--intent-src'))
    console.log('Root --intent-boost:', rootStyle.getPropertyValue('--intent-boost'))
    console.log('Root --intent-color:', rootStyle.getPropertyValue('--intent-color'))
  })

  it('--intent-color is defined', () => {
    const intentColor = getComputedStyle(document.documentElement).getPropertyValue('--intent-color').trim()
    console.log('TEST: --intent-color =', intentColor)
    expect(intentColor).not.toBe('')
  })
})
