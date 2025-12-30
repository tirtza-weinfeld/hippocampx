import { describe, it, expect, beforeEach } from 'vitest'

describe('Minimal intent-accent test', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
  })

  it('TEST A: With --intent-accent in first :root + workaround', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 var(--hue)); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        @function --shade(--c <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--c), black var(--pct)); }
        @function --emph() returns <percentage> {
          result: if(style(--emphasis: loud): 12%; style(--emphasis: quiet): 4%; else: 8%;);
        }
        :root {
          --scheme: light;
          --hue: 265;
          --chroma: 0.14;
          --emphasis: mid;
          --intent: base;
          --l-layer-mid-light: 0.94;
          --l-layer-mid-dark: 0.13;
          --ramp-shade: 12%;
          /* THE PROBLEMATIC LINE */
          --intent-accent: oklch(0.6 var(--chroma) var(--hue));
        }
        :root {
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            style(--emphasis: quiet): --neutral(0.97);
            else: --neutral(var(--l-layer-mid));
          );
          --intent-src: var(--layer-base);
          --intent-boost: if(style(--emphasis: loud): 18%; style(--emphasis: quiet): 8%; else: 12%;);
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --i1: var(--intent-color);
          --i2: --shade(var(--intent-color), var(--ramp-shade));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST A (with --intent-accent + workaround):')
    console.log('  --intent-accent:', root.getPropertyValue('--intent-accent').trim())
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST B: Move --intent-accent to second :root', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 var(--hue)); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        @function --shade(--c <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--c), black var(--pct)); }
        @function --emph() returns <percentage> {
          result: if(style(--emphasis: loud): 12%; style(--emphasis: quiet): 4%; else: 8%;);
        }
        :root {
          --scheme: light;
          --hue: 265;
          --chroma: 0.14;
          --emphasis: mid;
          --intent: base;
          --l-layer-mid-light: 0.94;
          --l-layer-mid-dark: 0.13;
          --ramp-shade: 12%;
          /* NO --intent-accent here */
        }
        :root {
          /* MOVE --intent-accent HERE */
          --intent-accent: oklch(0.6 var(--chroma) var(--hue));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            style(--emphasis: quiet): --neutral(0.97);
            else: --neutral(var(--l-layer-mid));
          );
          --intent-src: var(--layer-base);
          --intent-boost: if(style(--emphasis: loud): 18%; style(--emphasis: quiet): 8%; else: 12%;);
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --i1: var(--intent-color);
          --i2: --shade(var(--intent-color), var(--ramp-shade));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST B (--intent-accent in second :root):')
    console.log('  --intent-accent:', root.getPropertyValue('--intent-accent').trim())
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })
})
