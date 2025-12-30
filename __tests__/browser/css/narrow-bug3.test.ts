import { describe, it, expect, beforeEach } from 'vitest'

describe('Narrow down bug - chroma and more', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
  })

  it('TEST 12: add --chroma in intent colors', () => {
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
    console.log('TEST 12 (--chroma):')
    console.log('  --intent-accent:', root.getPropertyValue('--intent-accent').trim())
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', root.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', root.getPropertyValue('--intent-boost').trim())
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 13: add --border (uses --ink-base)', () => {
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
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 13 (+ --border):')
    console.log('  --border:', root.getPropertyValue('--border').trim())
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 14: add --tint, --shade, --i0, --i1, --i2', () => {
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
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 14 (+ --i0, --i1, --i2):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --i0:', root.getPropertyValue('--i0').trim())
    console.log('  --i1:', root.getPropertyValue('--i1').trim())
    console.log('  --i2:', root.getPropertyValue('--i2').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 15: add --emph(), --aura, --g-layer-*', () => {
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
          --g-layer-c: --mix(var(--layer-base), var(--ink-base), 4%);
        }
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 15 (full):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --aura:', root.getPropertyValue('--aura').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    console.log('  --g-layer-b:', root.getPropertyValue('--g-layer-b').trim())
    console.log('  --g-layer-c:', root.getPropertyValue('--g-layer-c').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
    expect(root.getPropertyValue('--g-layer-a').trim()).not.toBe('')
  })
})
