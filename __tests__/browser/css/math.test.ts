import { describe, it, expect, beforeAll } from 'vitest'
import katex from 'katex'

// Import the CSS files
import '@/styles/globals.css'

describe('math.css - KaTeX color selectors', () => {
  let container: HTMLDivElement

  beforeAll(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  const renderMath = (latex: string): HTMLElement => {
    const el = document.createElement('span')
    el.className = 'katex-container'
    katex.render(latex, el, { throwOnError: false })
    container.appendChild(el)
    return el
  }

  it('KaTeX outputs color style (format varies by environment)', () => {
    const el = renderMath('\\color{red}{x}')
    const coloredSpan = el.querySelector('span[style*="color"]')

    expect(coloredSpan).not.toBeNull()

    const style = coloredSpan?.getAttribute('style') ?? ''
    // KaTeX outputs "color:red" or "color: red" depending on environment
    expect(style).toMatch(/color:\s?\w+/)
  })

  it('red color selector sets correct --step variable', () => {
    const el = renderMath('\\color{red}{\\text{apple}}')
    const coloredSpan = el.querySelector('span[style*="color: red"]')

    expect(coloredSpan).not.toBeNull()

    const step = getComputedStyle(coloredSpan!).getPropertyValue('--step').trim()
    // Tailwind 4 uses oklch - red-500 has hue ~25
    expect(step).toMatch(/oklch.*25\./)
  })

  it('yellow color selector sets correct --step variable', () => {
    const el = renderMath('\\color{yellow}{\\text{banana}}')
    const coloredSpan = el.querySelector('span[style*="color: yellow"]')

    expect(coloredSpan).not.toBeNull()

    const step = getComputedStyle(coloredSpan!).getPropertyValue('--step').trim()
    // yellow-500 has hue ~86
    expect(step).toMatch(/oklch.*86\./)
  })

  it('green color selector sets correct --step variable', () => {
    const el = renderMath('\\textcolor{green}{\\text{cucumber}}')
    const coloredSpan = el.querySelector('span[style*="color: green"]')

    expect(coloredSpan).not.toBeNull()

    const step = getComputedStyle(coloredSpan!).getPropertyValue('--step').trim()
    // green-500 has hue ~149
    expect(step).toMatch(/oklch.*149\./)
  })

  it('blue color selector sets correct --step variable', () => {
    const el = renderMath('\\color{blue}{\\text{dolphin}}')
    const coloredSpan = el.querySelector('span[style*="color: blue"]')

    expect(coloredSpan).not.toBeNull()

    const step = getComputedStyle(coloredSpan!).getPropertyValue('--step').trim()
    // blue-500 has hue ~259
    expect(step).toMatch(/oklch.*259\./)
  })

  it('pink color selector sets correct --step variable', () => {
    const el = renderMath('\\color{pink}{\\text{elephant}}')
    const coloredSpan = el.querySelector('span[style*="color: pink"]')

    expect(coloredSpan).not.toBeNull()

    const step = getComputedStyle(coloredSpan!).getPropertyValue('--step').trim()
    // pink-500 has hue ~354
    expect(step).toMatch(/oklch.*354\./)
  })

  it('indigo color selector sets correct --step variable', () => {
    const el = renderMath('\\color{indigo}{\\text{falcon}}')
    const coloredSpan = el.querySelector('span[style*="color: indigo"]')

    expect(coloredSpan).not.toBeNull()

    const step = getComputedStyle(coloredSpan!).getPropertyValue('--step').trim()
    // indigo-500 has hue ~277
    expect(step).toMatch(/oklch.*277\./)
  })

  it('katex base element exists', () => {
    const el = renderMath('x + y')
    const katexEl = el.querySelector('.katex')

    expect(katexEl).not.toBeNull()
  })

  it('katex-container has inline-flex display', () => {
    const el = renderMath('a')
    const display = getComputedStyle(el).display

    expect(display).toBe('inline-flex')
  })

  it('katex descendants have gradient background', () => {
    const el = renderMath('f(x)')
    const katexEl = el.querySelector('.katex')
    const child = katexEl?.firstElementChild

    if (child) {
      const bgImage = getComputedStyle(child).backgroundImage
      expect(bgImage).toContain('linear-gradient')
    }
  })

  it('math inside em uses sky-teal gradient (not gray default)', () => {
    const wrapper = document.createElement('em')
    wrapper.className = 'text-em-gradient'
    const mathEl = document.createElement('span')
    mathEl.className = 'katex-container'
    katex.render('\\text{papaya}', mathEl, { throwOnError: false })
    wrapper.appendChild(mathEl)
    container.appendChild(wrapper)

    const katexEl = mathEl.querySelector('.katex')
    const descendant = katexEl?.querySelector('span')

    if (descendant) {
      // Should have gradient
      const bgImage = getComputedStyle(descendant).backgroundImage
      expect(bgImage).toContain('linear-gradient')

      // --step should be sky-500 (hue ~237), NOT gray-500 (low chroma ~0.027)
      const step = getComputedStyle(descendant).getPropertyValue('--step').trim()
      // sky-500 = oklch(68.5% 0.169 237.323) - check for hue in 230-240 range
      expect(step).toMatch(/oklch.*23\d\./)
    }
  })

  it('colored math inside em shows red gradient', () => {
    const wrapper = document.createElement('em')
    wrapper.className = 'text-em-gradient'
    const mathEl = document.createElement('span')
    mathEl.className = 'katex-container'
    katex.render('\\textcolor{red}{\\text{cherry}}', mathEl, { throwOnError: false })
    wrapper.appendChild(mathEl)
    container.appendChild(wrapper)

    const coloredSpan = mathEl.querySelector('span[style*="color: red"]')
    expect(coloredSpan).not.toBeNull()

    // --step should be red-500 (hue ~25)
    const step = getComputedStyle(coloredSpan!).getPropertyValue('--step').trim()
    expect(step).toMatch(/oklch.*25\./)

    // Should have gradient background (not solid color)
    const bgImage = getComputedStyle(coloredSpan!).backgroundImage
    expect(bgImage).toContain('linear-gradient')
  })

  it('math inside strong inherits sky-teal gradient from parent', () => {
    const wrapper = document.createElement('strong')
    const innerSpan = document.createElement('span')
    innerSpan.className = 'bg-strong-gradient'
    const mathEl = document.createElement('span')
    mathEl.className = 'katex-container'
    katex.render('y + z', mathEl, { throwOnError: false })
    innerSpan.appendChild(mathEl)
    wrapper.appendChild(innerSpan)
    container.appendChild(wrapper)

    const katexEl = mathEl.querySelector('.katex')
    const descendant = katexEl?.querySelector('span')

    if (descendant) {
      // Should inherit gradient from strong's inner span
      const bgImage = getComputedStyle(descendant).backgroundImage
      expect(bgImage).toContain('linear-gradient')
    }
  })

  it('colored math inside strong shows green gradient', () => {
    const wrapper = document.createElement('strong')
    const innerSpan = document.createElement('span')
    innerSpan.className = 'bg-strong-gradient'
    const mathEl = document.createElement('span')
    mathEl.className = 'katex-container'
    katex.render('\\color{green}{\\text{kiwi}}', mathEl, { throwOnError: false })
    innerSpan.appendChild(mathEl)
    wrapper.appendChild(innerSpan)
    container.appendChild(wrapper)

    const coloredSpan = mathEl.querySelector('span[style*="color: green"]')
    expect(coloredSpan).not.toBeNull()

    // --step should be green-500 (hue ~149)
    const step = getComputedStyle(coloredSpan!).getPropertyValue('--step').trim()
    expect(step).toMatch(/oklch.*149\./)

    // Should have gradient background (not solid color)
    const bgImage = getComputedStyle(coloredSpan!).backgroundImage
    expect(bgImage).toContain('linear-gradient')
  })
})
