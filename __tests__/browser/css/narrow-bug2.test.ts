import { describe, it, expect, beforeEach } from 'vitest'

describe('Narrow down bug - add more theme variables', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
  })

  it('TEST 8: add --pick function and --l-layer-mid', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 265); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        :root {
          --scheme: light;
          --emphasis: mid;
          --intent: base;
          --l-layer-mid-light: 0.94;
          --l-layer-mid-dark: 0.13;
          --intent-accent: oklch(0.60 0.14 265);
        }
        :root {
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(var(--l-layer-mid));)
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
    console.log('TEST 8 (--pick + --l-layer-mid):')
    console.log('  --l-layer-mid:', root.getPropertyValue('--l-layer-mid').trim())
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', root.getPropertyValue('--intent-boost').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })

  it('TEST 9: add all --l-layer-* variables', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 265); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        :root {
          --scheme: light;
          --emphasis: mid;
          --intent: base;
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-loud-light: 0.90;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
          --l-layer-loud-dark: 0.18;
          --intent-accent: oklch(0.60 0.14 265);
        }
        :root {
          --l-layer-quiet: --pick(var(--l-layer-quiet-light), var(--l-layer-quiet-dark));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --l-layer-loud: --pick(var(--l-layer-loud-light), var(--l-layer-loud-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(var(--l-layer-loud));
            else: if(style(--emphasis: quiet): --neutral(var(--l-layer-quiet)); else: --neutral(var(--l-layer-mid));)
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
    console.log('TEST 9 (all --l-layer-*):')
    console.log('  --l-layer-mid:', root.getPropertyValue('--l-layer-mid').trim())
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', root.getPropertyValue('--intent-boost').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })

  it('TEST 10: add --ink-base', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 265); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        :root {
          --scheme: light;
          --emphasis: mid;
          --intent: base;
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-loud-light: 0.90;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
          --l-layer-loud-dark: 0.18;
          --l-ink-light: 0.18;
          --l-ink-dark: 0.92;
          --intent-accent: oklch(0.60 0.14 265);
        }
        :root {
          --ink-base: --neutral(--pick(var(--l-ink-light), var(--l-ink-dark)));
          --l-layer-quiet: --pick(var(--l-layer-quiet-light), var(--l-layer-quiet-dark));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --l-layer-loud: --pick(var(--l-layer-loud-light), var(--l-layer-loud-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(var(--l-layer-loud));
            else: if(style(--emphasis: quiet): --neutral(var(--l-layer-quiet)); else: --neutral(var(--l-layer-mid));)
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
    console.log('TEST 10 (+ --ink-base):')
    console.log('  --ink-base:', root.getPropertyValue('--ink-base').trim())
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })

  it('TEST 11: add --hue variable reference', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 var(--hue)); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        :root {
          --scheme: light;
          --hue: 265;
          --emphasis: mid;
          --intent: base;
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-loud-light: 0.90;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
          --l-layer-loud-dark: 0.18;
          --l-ink-light: 0.18;
          --l-ink-dark: 0.92;
          --intent-accent: oklch(0.60 0.14 265);
        }
        :root {
          --ink-base: --neutral(--pick(var(--l-ink-light), var(--l-ink-dark)));
          --l-layer-quiet: --pick(var(--l-layer-quiet-light), var(--l-layer-quiet-dark));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --l-layer-loud: --pick(var(--l-layer-loud-light), var(--l-layer-loud-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(var(--l-layer-loud));
            else: if(style(--emphasis: quiet): --neutral(var(--l-layer-quiet)); else: --neutral(var(--l-layer-mid));)
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
    console.log('TEST 11 (--hue in --neutral):')
    console.log('  --ink-base:', root.getPropertyValue('--ink-base').trim())
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --result:', root.getPropertyValue('--result').trim())
    expect(root.getPropertyValue('--result').trim()).not.toBe('')
  })
})
