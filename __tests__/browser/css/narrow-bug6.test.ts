import { describe, it, expect, beforeEach } from 'vitest'

describe('Narrow down bug - minimal g-layer-a trigger', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
  })

  it('TEST 35: --g-layer-a WITHOUT --l-layer-quiet/loud', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 var(--hue)); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        @function --emph() returns <percentage> {
          result: if(style(--emphasis: loud): 12%; else: if(style(--emphasis: quiet): 4%; else: 8%;));
        }
        :root {
          --scheme: light;
          --hue: 265;
          --emphasis: mid;
          --intent: base;
          --l-layer-mid-light: 0.94;
          --l-layer-mid-dark: 0.13;
        }
        :root {
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(var(--l-layer-mid));)
          );
          --intent-src: var(--layer-base);
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 35 (--g-layer-a WITHOUT --l-layer-quiet/loud):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 36: --g-layer-a WITH --l-layer-quiet (defined but not used)', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 var(--hue)); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        @function --emph() returns <percentage> {
          result: if(style(--emphasis: loud): 12%; else: if(style(--emphasis: quiet): 4%; else: 8%;));
        }
        :root {
          --scheme: light;
          --hue: 265;
          --emphasis: mid;
          --intent: base;
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
        }
        :root {
          --l-layer-quiet: --pick(var(--l-layer-quiet-light), var(--l-layer-quiet-dark));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(var(--l-layer-mid));)
          );
          --intent-src: var(--layer-base);
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 36 (--g-layer-a WITH --l-layer-quiet defined but not used):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 37: --g-layer-a WITH --l-layer-quiet USED in layer-base', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 var(--hue)); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        @function --emph() returns <percentage> {
          result: if(style(--emphasis: loud): 12%; else: if(style(--emphasis: quiet): 4%; else: 8%;));
        }
        :root {
          --scheme: light;
          --hue: 265;
          --emphasis: mid;
          --intent: base;
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
        }
        :root {
          --l-layer-quiet: --pick(var(--l-layer-quiet-light), var(--l-layer-quiet-dark));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(var(--l-layer-quiet)); else: --neutral(var(--l-layer-mid));)
          );
          --intent-src: var(--layer-base);
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 37 (--g-layer-a WITH --l-layer-quiet USED in layer-base):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 38: --l-layer-quiet USED but NO --g-layer-a', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 var(--hue)); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        @function --emph() returns <percentage> {
          result: if(style(--emphasis: loud): 12%; else: if(style(--emphasis: quiet): 4%; else: 8%;));
        }
        :root {
          --scheme: light;
          --hue: 265;
          --emphasis: mid;
          --intent: base;
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
        }
        :root {
          --l-layer-quiet: --pick(var(--l-layer-quiet-light), var(--l-layer-quiet-dark));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(var(--l-layer-quiet)); else: --neutral(var(--l-layer-mid));)
          );
          --intent-src: var(--layer-base);
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --aura: --emph();
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 38 (--l-layer-quiet USED, NO --g-layer-a):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 40: Same as TEST 17 (with --ink-base, --border, --i0, etc)', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 var(--hue)); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        @function --tint(--c <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--c), white var(--pct)); }
        @function --shade(--c <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--c), black var(--pct)); }
        @function --emph() returns <percentage> {
          result: if(style(--emphasis: loud): 12%; else: if(style(--emphasis: quiet): 4%; else: 8%;));
        }
        :root {
          --scheme: light;
          --hue: 265;
          --chroma: 0.14;
          --emphasis: mid;
          --intent: base;
          --l-layer-mid-light: 0.94;
          --l-layer-mid-dark: 0.13;
          --l-ink-light: 0.18;
          --l-ink-dark: 0.92;
          --intent-accent: oklch(0.60 var(--chroma) var(--hue));
          --ramp-tint: 10%;
          --ramp-shade: 12%;
        }
        :root {
          --ink-base: --neutral(--pick(var(--l-ink-light), var(--l-ink-dark)));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(var(--l-layer-mid));)
          );
          --intent-src: var(--layer-base);
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --border: --mix(var(--layer-base), var(--ink-base), 18%);
          --i0: --tint(var(--intent-color), var(--ramp-tint));
          --i1: var(--intent-color);
          --i2: --shade(var(--intent-color), var(--ramp-shade));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 40 (exact copy of TEST 17):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 39: --l-layer-quiet in literal branch, --g-layer-a with literal percentage', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;
      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }
        @function --neutral(--l <number>) returns <color> { result: oklch(var(--l) 0 var(--hue)); }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> { result: color-mix(in oklch, var(--a), var(--b) var(--pct)); }
        @function --emph() returns <percentage> {
          result: if(style(--emphasis: loud): 12%; else: if(style(--emphasis: quiet): 4%; else: 8%;));
        }
        :root {
          --scheme: light;
          --hue: 265;
          --emphasis: mid;
          --intent: base;
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
        }
        :root {
          --l-layer-quiet: --pick(var(--l-layer-quiet-light), var(--l-layer-quiet-dark));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(var(--l-layer-quiet)); else: --neutral(var(--l-layer-mid));)
          );
          --intent-src: var(--layer-base);
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), 8%);
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 39 (--l-layer-quiet USED, --g-layer-a with literal 8%):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })
})
