import { describe, it, expect, beforeEach } from 'vitest'

describe('Narrow down bug - which downstream var triggers failure', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
  })

  // Base CSS that works (TEST 25 equivalent)
  const baseCSS = `
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
  `

  it('TEST 26: base + --border only', () => {
    const style = document.createElement('style')
    style.textContent = baseCSS + `
        --border: --mix(var(--layer-base), var(--ink-base), 18%);
      }
    }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 26 (+ --border):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 27: base + --i0 only', () => {
    const style = document.createElement('style')
    style.textContent = baseCSS + `
        --i0: --tint(var(--intent-color), var(--ramp-tint));
      }
    }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 27 (+ --i0):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 28: base + --aura only', () => {
    const style = document.createElement('style')
    style.textContent = baseCSS + `
        --aura: --emph();
      }
    }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 28 (+ --aura):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 29: base + --border + --i0', () => {
    const style = document.createElement('style')
    style.textContent = baseCSS + `
        --border: --mix(var(--layer-base), var(--ink-base), 18%);
        --i0: --tint(var(--intent-color), var(--ramp-tint));
      }
    }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 29 (+ --border + --i0):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 30: base + --border + --i0 + --i1', () => {
    const style = document.createElement('style')
    style.textContent = baseCSS + `
        --border: --mix(var(--layer-base), var(--ink-base), 18%);
        --i0: --tint(var(--intent-color), var(--ramp-tint));
        --i1: var(--intent-color);
      }
    }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 30 (+ --border + --i0 + --i1):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 31: base + --border + --i0 + --i1 + --i2', () => {
    const style = document.createElement('style')
    style.textContent = baseCSS + `
        --border: --mix(var(--layer-base), var(--ink-base), 18%);
        --i0: --tint(var(--intent-color), var(--ramp-tint));
        --i1: var(--intent-color);
        --i2: --shade(var(--intent-color), var(--ramp-shade));
      }
    }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST 31 (+ --border + --i0 + --i1 + --i2):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 32: base + --border + --i0 + --i1 + --i2 + --aura', () => {
    const style = document.createElement('style')
    style.textContent = baseCSS + `
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
    console.log('TEST 32 (+ ...all... + --aura):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 33: base + ...all... + --g-layer-a', () => {
    const style = document.createElement('style')
    style.textContent = baseCSS + `
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
    console.log('TEST 33 (+ ...all... + --g-layer-a):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('TEST 34: base + ...all... + --g-layer-a + --g-layer-b', () => {
    const style = document.createElement('style')
    style.textContent = baseCSS + `
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
    console.log('TEST 34 (+ ...all... + --g-layer-a + --g-layer-b):')
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
  })
})
