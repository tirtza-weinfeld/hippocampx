import { describe, it, expect, beforeEach } from 'vitest'

describe('Narrow down the bug', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
  })

  it('TEST 1: two if() results in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 265); }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
      :root {
        --emphasis: mid;
        --a: if(style(--emphasis: loud): --neutral(0.90); else: --neutral(0.94););
        --b: if(style(--emphasis: loud): --neutral(0.90); else: --neutral(0.94););
        --result: --mix(var(--a), var(--b), 12%);
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 1 (two if results):')
    console.log('  --a:', root.getPropertyValue('--a').trim())
    console.log('  --b:', root.getPropertyValue('--b').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })

  it('TEST 2: if() with nested if() in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 265); }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
      :root {
        --emphasis: mid;
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        --intent-src: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        --result: --mix(var(--layer-base), var(--intent-src), 12%);
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 2 (nested if):')
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })

  it('TEST 3: --intent-src references --layer-base via var()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 265); }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
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
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 3 (alias via var):')
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })

  it('TEST 4: 4-level nested if for --intent-src (like theme)', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 265); }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
      :root {
        --emphasis: mid;
        --intent: base;
        --intent-accent: oklch(0.60 0.14 265);
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        --intent-src: if(
          style(--intent: accent): var(--intent-accent);
          else: if(
            style(--intent: positive): oklch(0.62 0.14 145);
            else: if(
              style(--intent: caution): oklch(0.68 0.14 85);
              else: if(style(--intent: destructive): oklch(0.58 0.14 25); else: var(--layer-base);)
            )
          )
        );
        --result: --mix(var(--layer-base), var(--intent-src), 12%);
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 4 (4-level if):')
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })

  it('TEST 5: add --intent-boost from if()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 265); }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
      :root {
        --emphasis: mid;
        --intent: base;
        --intent-accent: oklch(0.60 0.14 265);
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        --intent-src: if(
          style(--intent: accent): var(--intent-accent);
          else: if(
            style(--intent: positive): oklch(0.62 0.14 145);
            else: if(
              style(--intent: caution): oklch(0.68 0.14 85);
              else: if(style(--intent: destructive): oklch(0.58 0.14 25); else: var(--layer-base);)
            )
          )
        );
        --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
        --result: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 5 (with --intent-boost):')
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', root.getPropertyValue('--intent-boost').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })

  it('TEST 6: two :root blocks (like theme)', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 265); }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
      :root {
        --emphasis: mid;
        --intent: base;
        --intent-accent: oklch(0.60 0.14 265);
      }
      :root {
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        --intent-src: if(
          style(--intent: accent): var(--intent-accent);
          else: if(
            style(--intent: positive): oklch(0.62 0.14 145);
            else: if(
              style(--intent: caution): oklch(0.68 0.14 85);
              else: if(style(--intent: destructive): oklch(0.58 0.14 25); else: var(--layer-base);)
            )
          )
        );
        --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
        --result: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 6 (two :root blocks):')
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', root.getPropertyValue('--intent-boost').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })

  it('TEST 7: wrap in @layer', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 265); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        :root {
          --emphasis: mid;
          --intent: base;
          --intent-accent: oklch(0.60 0.14 265);
        }
        :root {
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
          );
          --intent-src: if(
            style(--intent: accent): var(--intent-accent);
            else: if(
              style(--intent: positive): oklch(0.62 0.14 145);
              else: if(
                style(--intent: caution): oklch(0.68 0.14 85);
                else: if(style(--intent: destructive): oklch(0.58 0.14 25); else: var(--layer-base);)
              )
            )
          );
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --result: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 7 (@layer):')
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', root.getPropertyValue('--intent-boost').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })
})
