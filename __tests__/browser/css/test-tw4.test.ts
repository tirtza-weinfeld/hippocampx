import { describe, it, expect, beforeEach } from 'vitest'

describe('Tailwind 4 theme (no @function)', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
  })

  it('TEST TW4: All tokens compute correctly without @function', () => {
    const style = document.createElement('style')
    style.textContent = `
      :root {
        color-scheme: light;
        --hue: 265;
        --chroma: 0.14;
        --l-layer-quiet: 0.97;
        --l-layer-mid: 0.94;
        --l-layer-loud: 0.9;
        --l-ink: 0.18;
        --intent-accent: oklch(0.6 var(--chroma) var(--hue));
        --intent-positive: oklch(0.62 var(--chroma) 145);
        --intent-caution: oklch(0.68 var(--chroma) 85);
        --intent-destructive: oklch(0.58 var(--chroma) 25);
        --d-hover: 12%;
        --d-active: 22%;
        --ramp-tint: 10%;
        --ramp-shade: 12%;
        --role: layer;
        --intent: base;
        --emphasis: mid;
        --weight: solid;
        --aura: 8%;
        --intent-boost: 12%;
      }
      :root {
        --layer-base: oklch(var(--l-layer-mid) 0 var(--hue));
        --ink-base: oklch(var(--l-ink) 0 var(--hue));
        --intent-src: var(--layer-base);
        --intent-color: color-mix(in oklch, var(--layer-base), var(--intent-src) var(--intent-boost));
        --border: color-mix(in oklch, var(--layer-base), var(--ink-base) 18%);
        --i0: color-mix(in oklch, var(--intent-color), white var(--ramp-tint));
        --i1: var(--intent-color);
        --i2: color-mix(in oklch, var(--intent-color), black var(--ramp-shade));
        --g-layer-a: color-mix(in oklch, var(--layer-base), var(--intent-color) var(--aura));
        --g-layer-b: color-mix(in oklch, var(--layer-base), var(--intent-color) calc(var(--aura) / 2));
        --g-layer-c: color-mix(in oklch, var(--layer-base), var(--ink-base) 4%);
      }
    `
    document.head.appendChild(style)
    const root = getComputedStyle(document.documentElement)
    console.log('TEST TW4 (no @function):')
    console.log('  --layer-base:', root.getPropertyValue('--layer-base').trim())
    console.log('  --ink-base:', root.getPropertyValue('--ink-base').trim())
    console.log('  --intent-color:', root.getPropertyValue('--intent-color').trim())
    console.log('  --i0:', root.getPropertyValue('--i0').trim())
    console.log('  --i1:', root.getPropertyValue('--i1').trim())
    console.log('  --i2:', root.getPropertyValue('--i2').trim())
    console.log('  --g-layer-a:', root.getPropertyValue('--g-layer-a').trim())
    expect(root.getPropertyValue('--intent-color').trim()).not.toBe('')
    expect(root.getPropertyValue('--g-layer-a').trim()).not.toBe('')
  })
})
