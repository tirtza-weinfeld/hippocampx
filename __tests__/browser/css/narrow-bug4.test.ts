import { describe, it, expect, beforeEach } from 'vitest'

describe('Narrow down bug - emph function', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
  })

  it('TEST 16: add only --emph() and --aura (no --g-layer)', () => {
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
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 16 (+ --emph + --aura only):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --aura:', root.getPropertyValue('--aura').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 17: add --g-layer-a that uses --intent-color', () => {
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
    console.log('TEST 17 (+ --g-layer-a):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --aura:', root.getPropertyValue('--aura').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 18: --g-layer-a without using --intent-color', () => {
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
          --g-layer-a: --mix(var(--layer-base), var(--ink-base), var(--aura));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 18 (--g-layer-a uses --ink-base not --intent-color):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 19: --g-layer-a uses --intent-color with literal percentage', () => {
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
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), 8%);
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 19 (--g-layer-a with literal 8%):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 20: add --g-layer-b with calc(var(--aura) / 2)', () => {
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
          --g-layer-b: --mix(var(--layer-base), var(--intent-color), calc(var(--aura) / 2));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 20 (+ --g-layer-b with calc):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    console.log('  --g-layer-b:', root.getPropertyValue('--g-layer-b').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 21: add full --intent-src nested if', () => {
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
          --intent-positive: oklch(0.62 var(--chroma) 145);
          --intent-caution: oklch(0.68 var(--chroma) 85);
          --intent-destructive: oklch(0.58 var(--chroma) 25);
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
          --intent-src: if(
            style(--intent: accent): var(--intent-accent);
            else: if(
              style(--intent: positive): var(--intent-positive);
              else: if(
                style(--intent: caution): var(--intent-caution);
                else: if(style(--intent: destructive): var(--intent-destructive); else: var(--layer-base);)
              )
            )
          );
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --border: --mix(var(--layer-base), var(--ink-base), 18%);
          --i0: --tint(var(--intent-color), var(--ramp-tint));
          --i1: var(--intent-color);
          --i2: --shade(var(--intent-color), var(--ramp-shade));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
          --g-layer-b: --mix(var(--layer-base), var(--intent-color), calc(var(--aura) / 2));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 21 (+ full --intent-src):')
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 22: add all --l-layer-* variants', () => {
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
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-loud-light: 0.90;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
          --l-layer-loud-dark: 0.18;
          --l-ink-light: 0.18;
          --l-ink-dark: 0.92;
          --intent-accent: oklch(0.60 var(--chroma) var(--hue));
          --intent-positive: oklch(0.62 var(--chroma) 145);
          --intent-caution: oklch(0.68 var(--chroma) 85);
          --intent-destructive: oklch(0.58 var(--chroma) 25);
          --ramp-tint: 10%;
          --ramp-shade: 12%;
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
              style(--intent: positive): var(--intent-positive);
              else: if(
                style(--intent: caution): var(--intent-caution);
                else: if(style(--intent: destructive): var(--intent-destructive); else: var(--layer-base);)
              )
            )
          );
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --border: --mix(var(--layer-base), var(--ink-base), 18%);
          --i0: --tint(var(--intent-color), var(--ramp-tint));
          --i1: var(--intent-color);
          --i2: --shade(var(--intent-color), var(--ramp-shade));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
          --g-layer-b: --mix(var(--layer-base), var(--intent-color), calc(var(--aura) / 2));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 22 (+ all --l-layer-*):')
    console.log('  --l-layer-quiet:', root.getPropertyValue('--l-layer-quiet').trim())
    console.log('  --l-layer-mid:', root.getPropertyValue('--l-layer-mid').trim())
    console.log('  --l-layer-loud:', root.getPropertyValue('--l-layer-loud').trim())
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 23: --l-layer-* but --layer-base uses literals (not vars)', () => {
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
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-loud-light: 0.90;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
          --l-layer-loud-dark: 0.18;
          --l-ink-light: 0.18;
          --l-ink-dark: 0.92;
          --intent-accent: oklch(0.60 var(--chroma) var(--hue));
          --intent-positive: oklch(0.62 var(--chroma) 145);
          --intent-caution: oklch(0.68 var(--chroma) 85);
          --intent-destructive: oklch(0.58 var(--chroma) 25);
          --ramp-tint: 10%;
          --ramp-shade: 12%;
        }
        :root {
          --ink-base: --neutral(--pick(var(--l-ink-light), var(--l-ink-dark)));
          --l-layer-quiet: --pick(var(--l-layer-quiet-light), var(--l-layer-quiet-dark));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --l-layer-loud: --pick(var(--l-layer-loud-light), var(--l-layer-loud-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(var(--l-layer-mid));)
          );
          --intent-src: if(
            style(--intent: accent): var(--intent-accent);
            else: if(
              style(--intent: positive): var(--intent-positive);
              else: if(
                style(--intent: caution): var(--intent-caution);
                else: if(style(--intent: destructive): var(--intent-destructive); else: var(--layer-base);)
              )
            )
          );
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --border: --mix(var(--layer-base), var(--ink-base), 18%);
          --i0: --tint(var(--intent-color), var(--ramp-tint));
          --i1: var(--intent-color);
          --i2: --shade(var(--intent-color), var(--ramp-shade));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
          --g-layer-b: --mix(var(--layer-base), var(--intent-color), calc(var(--aura) / 2));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 23 (--l-layer-* defined but layer-base uses literals):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 24: --layer-base uses var(--l-layer-loud) in one branch', () => {
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
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-loud-light: 0.90;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
          --l-layer-loud-dark: 0.18;
          --l-ink-light: 0.18;
          --l-ink-dark: 0.92;
          --intent-accent: oklch(0.60 var(--chroma) var(--hue));
          --intent-positive: oklch(0.62 var(--chroma) 145);
          --intent-caution: oklch(0.68 var(--chroma) 85);
          --intent-destructive: oklch(0.58 var(--chroma) 25);
          --ramp-tint: 10%;
          --ramp-shade: 12%;
        }
        :root {
          --ink-base: --neutral(--pick(var(--l-ink-light), var(--l-ink-dark)));
          --l-layer-quiet: --pick(var(--l-layer-quiet-light), var(--l-layer-quiet-dark));
          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));
          --l-layer-loud: --pick(var(--l-layer-loud-light), var(--l-layer-loud-dark));
          --layer-base: if(
            style(--emphasis: loud): --neutral(var(--l-layer-loud));
            else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(var(--l-layer-mid));)
          );
          --intent-src: if(
            style(--intent: accent): var(--intent-accent);
            else: if(
              style(--intent: positive): var(--intent-positive);
              else: if(
                style(--intent: caution): var(--intent-caution);
                else: if(style(--intent: destructive): var(--intent-destructive); else: var(--layer-base);)
              )
            )
          );
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
          --border: --mix(var(--layer-base), var(--ink-base), 18%);
          --i0: --tint(var(--intent-color), var(--ramp-tint));
          --i1: var(--intent-color);
          --i2: --shade(var(--intent-color), var(--ramp-shade));
          --aura: --emph();
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));
          --g-layer-b: --mix(var(--layer-base), var(--intent-color), calc(var(--aura) / 2));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 24 (--layer-base with var(--l-layer-loud) in loud branch):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 25: --layer-base uses all var(--l-layer-*)', () => {
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
          --l-layer-quiet-light: 0.97;
          --l-layer-mid-light: 0.94;
          --l-layer-loud-light: 0.90;
          --l-layer-quiet-dark: 0.10;
          --l-layer-mid-dark: 0.13;
          --l-layer-loud-dark: 0.18;
          --l-ink-light: 0.18;
          --l-ink-dark: 0.92;
          --intent-accent: oklch(0.60 var(--chroma) var(--hue));
          --intent-positive: oklch(0.62 var(--chroma) 145);
          --intent-caution: oklch(0.68 var(--chroma) 85);
          --intent-destructive: oklch(0.58 var(--chroma) 25);
          --ramp-tint: 10%;
          --ramp-shade: 12%;
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
              style(--intent: positive): var(--intent-positive);
              else: if(
                style(--intent: caution): var(--intent-caution);
                else: if(style(--intent: destructive): var(--intent-destructive); else: var(--layer-base);)
              )
            )
          );
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 25 (--layer-base with all var(--l-layer-*), no downstream vars):')
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })
})
