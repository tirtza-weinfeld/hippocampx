import { describe, it, expect, beforeEach } from 'vitest'

// Test if duplicate @function definitions cause issues
describe('Function name collision', () => {
  beforeEach(() => {
    // Clean up all prior styles
    document.querySelectorAll('style').forEach(s => s.remove())
    document.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove())
  })

  it('single @function definition works', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --c1: oklch(0.94 0 265);
        --c2: oklch(0.18 0 265);
        --result: --mix(var(--c1), var(--c2), 12%);
      }
    `
    document.head.appendChild(style)

    const result = getComputedStyle(document.documentElement).getPropertyValue('--result').trim()
    console.log('Single definition --result:', result)
    expect(result).not.toBe('')
  })

  it('duplicate @function definitions - same signature', () => {
    // First style with --mix
    const style1 = document.createElement('style')
    style1.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root { --test1: --mix(red, blue, 50%); }
    `
    document.head.appendChild(style1)

    // Second style with same --mix
    const style2 = document.createElement('style')
    style2.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root { --test2: --mix(green, yellow, 50%); }
    `
    document.head.appendChild(style2)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('Duplicate def --test1:', rootStyle.getPropertyValue('--test1').trim())
    console.log('Duplicate def --test2:', rootStyle.getPropertyValue('--test2').trim())
  })

  it('second style uses function from first style', () => {
    // First style defines --mix
    const style1 = document.createElement('style')
    style1.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root { --from-style1: --mix(red, blue, 50%); }
    `
    document.head.appendChild(style1)

    // Second style does NOT define --mix, just uses it
    const style2 = document.createElement('style')
    style2.textContent = `
      :root { --from-style2: --mix(green, yellow, 50%); }
    `
    document.head.appendChild(style2)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('Cross-style --from-style1:', rootStyle.getPropertyValue('--from-style1').trim())
    console.log('Cross-style --from-style2:', rootStyle.getPropertyValue('--from-style2').trim())
  })

  it('first style references, second style defines (order matters?)', () => {
    // First style tries to use --mix before it's defined
    const style1 = document.createElement('style')
    style1.textContent = `
      :root { --early-use: --mix(red, blue, 50%); }
    `
    document.head.appendChild(style1)

    // Second style defines --mix
    const style2 = document.createElement('style')
    style2.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root { --late-use: --mix(green, yellow, 50%); }
    `
    document.head.appendChild(style2)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('Order: --early-use (before def):', rootStyle.getPropertyValue('--early-use').trim())
    console.log('Order: --late-use (after def):', rootStyle.getPropertyValue('--late-use').trim())
  })

  it('ISOLATED: file CSS only, no prior styles', async () => {
    // This should work since there are no competing definitions
    const response = await fetch('/bleeding-theme-inline-test.css')
    const css = await response.text()

    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)

    await new Promise(r => requestAnimationFrame(r))

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('ISOLATED FILE:')
    console.log('  styles in doc:', document.querySelectorAll('style').length)
    console.log('  --layer-base:', rootStyle.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', rootStyle.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', rootStyle.getPropertyValue('--intent-boost').trim())
    console.log('  --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())

    expect(rootStyle.getPropertyValue('--intent-color').trim()).not.toBe('')
  })
})
