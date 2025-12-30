import { describe, it, expect, beforeEach } from 'vitest'

// Test the specific bug: using var(--x) twice in a function when --x is from if()
describe('Alias bug investigation', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
  })

  it('CONTROL: literal color, alias, both in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --layer-base: oklch(0.94 0 265);
        --intent-src: var(--layer-base);
        --result: --mix(var(--layer-base), var(--intent-src), 12%);
      }
    `
    document.head.appendChild(style)
    const result = getComputedStyle(document.documentElement).getPropertyValue('--result').trim()
    console.log('CONTROL (literal): --result =', result)
    expect(result).not.toBe('')
  })

  it('BUG: if() result, alias, both in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        --intent-src: var(--layer-base);
        --result: --mix(var(--layer-base), var(--intent-src), 12%);
      }
    `
    document.head.appendChild(style)
    const layerBase = getComputedStyle(document.documentElement).getPropertyValue('--layer-base').trim()
    const intentSrc = getComputedStyle(document.documentElement).getPropertyValue('--intent-src').trim()
    const result = getComputedStyle(document.documentElement).getPropertyValue('--result').trim()
    console.log('BUG TEST: --layer-base =', layerBase)
    console.log('BUG TEST: --intent-src =', intentSrc)
    console.log('BUG TEST: --result =', result)
    expect(result).not.toBe('')
  })

  it('VARIATION 1: if() result, NO alias, use --layer-base twice', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        --result: --mix(var(--layer-base), var(--layer-base), 12%);
      }
    `
    document.head.appendChild(style)
    const result = getComputedStyle(document.documentElement).getPropertyValue('--result').trim()
    console.log('NO ALIAS (same var twice): --result =', result)
    expect(result).not.toBe('')
  })

  it('VARIATION 2: if() result, alias, use only alias in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        --intent-src: var(--layer-base);
        --result: --mix(var(--intent-src), var(--intent-src), 12%);
      }
    `
    document.head.appendChild(style)
    const result = getComputedStyle(document.documentElement).getPropertyValue('--result').trim()
    console.log('ONLY ALIAS (twice): --result =', result)
    expect(result).not.toBe('')
  })

  it('VARIATION 3: if() result, alias, use only original in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        --intent-src: var(--layer-base);
        --result: --mix(var(--layer-base), var(--layer-base), 12%);
      }
    `
    document.head.appendChild(style)
    const result = getComputedStyle(document.documentElement).getPropertyValue('--result').trim()
    console.log('ONLY ORIGINAL (with alias defined but unused): --result =', result)
    expect(result).not.toBe('')
  })

  it('VARIATION 4: if() result, different second color', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        --other-color: oklch(0.5 0.1 265);
        --result: --mix(var(--layer-base), var(--other-color), 12%);
      }
    `
    document.head.appendChild(style)
    const result = getComputedStyle(document.documentElement).getPropertyValue('--result').trim()
    console.log('DIFFERENT SECOND COLOR: --result =', result)
    expect(result).not.toBe('')
  })

  it('VARIATION 5: simple if() (no nested function), alias, both in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;
        --layer-base: if(
          style(--emphasis: loud): oklch(0.90 0 265);
          else: if(style(--emphasis: quiet): oklch(0.97 0 265); else: oklch(0.94 0 265);)
        );
        --intent-src: var(--layer-base);
        --result: --mix(var(--layer-base), var(--intent-src), 12%);
      }
    `
    document.head.appendChild(style)
    const result = getComputedStyle(document.documentElement).getPropertyValue('--result').trim()
    console.log('SIMPLE IF (no nested fn), alias: --result =', result)
    expect(result).not.toBe('')
  })
})
