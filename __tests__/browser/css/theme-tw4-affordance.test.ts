import { describe, it, expect, beforeEach } from 'vitest'

describe('TW4 Affordance text visibility', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
    document.body.innerHTML = ''
  })

  it('affordance solid shows white text', async () => {
    const style = document.createElement('style')
    style.textContent = `
      :root {
        --hue: 265;
        --ramp-tint: 10%;
        --ramp-shade: 12%;
        --surface-mid: oklch(0.94 0 var(--hue));
        --ink-base: oklch(0.18 0 var(--hue));
        --current-surface: var(--surface-mid);
        --current-intent: oklch(0.6 0.14 265);
      }
      .affordance {
        --i0: color-mix(in oklch, var(--current-intent), white var(--ramp-tint));
        --i1: var(--current-intent);
        --i2: color-mix(in oklch, var(--current-intent), black var(--ramp-shade));
        --fill-grad: linear-gradient(135deg, var(--i0), var(--i1), var(--i2));
        --border-grad: linear-gradient(135deg, var(--i0), var(--i1), var(--i2));
        --on: white;
        --fg-grad: linear-gradient(90deg, var(--on), var(--on), var(--on));
        border: 1px solid transparent;
        background-image: var(--fill-grad), var(--border-grad), var(--fg-grad);
        background-origin: padding-box, border-box, padding-box;
        background-clip: padding-box, border-box, text;
        color: transparent;
        padding: 8px 16px;
      }
    `
    document.head.appendChild(style)

    const btn = document.createElement('button')
    btn.className = 'affordance'
    btn.textContent = 'Save changes'
    document.body.appendChild(btn)

    const computed = getComputedStyle(btn)

    console.log('SOLID AFFORDANCE:')
    console.log('  color:', computed.color)
    console.log('  background-image:', computed.backgroundImage.slice(0, 100) + '...')
    console.log('  --fg-grad:', computed.getPropertyValue('--fg-grad'))
    console.log('  --on:', computed.getPropertyValue('--on'))

    // color should be transparent
    expect(computed.color).toBe('rgba(0, 0, 0, 0)')
    // --on should be white
    expect(computed.getPropertyValue('--on').trim()).toBe('white')
    // background-image should have 3 layers
    expect(computed.backgroundImage.split('linear-gradient').length).toBeGreaterThanOrEqual(3)
  })

  it('affordance soft shows intent gradient text', async () => {
    const style = document.createElement('style')
    style.textContent = `
      :root {
        --hue: 265;
        --ramp-tint: 10%;
        --ramp-shade: 12%;
        --surface-mid: oklch(0.94 0 var(--hue));
        --ink-base: oklch(0.18 0 var(--hue));
        --current-surface: var(--surface-mid);
        --current-intent: oklch(0.6 0.14 265);
      }
      .affordance {
        --fill-a: color-mix(in oklch, var(--current-surface), var(--current-intent) 16%);
        --fill-b: color-mix(in oklch, var(--current-surface), var(--current-intent) 10%);
        --fill-c: color-mix(in oklch, var(--current-surface), var(--ink-base) 4%);
        --fill-grad: linear-gradient(180deg, var(--fill-a), var(--fill-b) 45%, var(--fill-c));
        --border-grad: linear-gradient(135deg, var(--fill-a), var(--fill-b), var(--fill-c));
        --fg-grad: linear-gradient(90deg,
          color-mix(in oklch, var(--current-intent), white var(--ramp-tint)),
          var(--current-intent),
          color-mix(in oklch, var(--current-intent), black var(--ramp-shade)));
        border: 1px solid transparent;
        background-image: var(--fill-grad), var(--border-grad), var(--fg-grad);
        background-origin: padding-box, border-box, padding-box;
        background-clip: padding-box, border-box, text;
        color: transparent;
        padding: 8px 16px;
      }
    `
    document.head.appendChild(style)

    const btn = document.createElement('button')
    btn.className = 'affordance'
    btn.textContent = 'Edit'
    document.body.appendChild(btn)

    const computed = getComputedStyle(btn)

    console.log('SOFT AFFORDANCE:')
    console.log('  color:', computed.color)
    console.log('  background-image:', computed.backgroundImage.slice(0, 100) + '...')
    console.log('  --fg-grad:', computed.getPropertyValue('--fg-grad').slice(0, 80) + '...')

    // color should be transparent
    expect(computed.color).toBe('rgba(0, 0, 0, 0)')
    // --fg-grad should contain color-mix (intent gradient, not white)
    expect(computed.getPropertyValue('--fg-grad')).toContain('color-mix')
    // background-image should have 3 layers
    expect(computed.backgroundImage.split('linear-gradient').length).toBeGreaterThanOrEqual(3)
  })
})
