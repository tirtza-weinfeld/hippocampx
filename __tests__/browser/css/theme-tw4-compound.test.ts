import { describe, it, expect, beforeEach } from 'vitest'

describe('TW4 compound selectors', () => {
  beforeEach(() => {
    document.querySelectorAll('style').forEach(s => s.remove())
    document.body.innerHTML = ''
  })

  it('axis classes set --current-intent on same element', async () => {
    const style = document.createElement('style')
    style.textContent = `
      :root {
        --hue: 265;
        --color-intent-accent: oklch(0.6 0.14 265);
        --surface-mid: oklch(0.94 0 265);
        --current-surface: var(--surface-mid);
        --current-intent: var(--surface-mid);
      }
      :where(.accent) { --current-intent: var(--color-intent-accent); }
      .test {
        background-color: var(--current-intent);
      }
    `
    document.head.appendChild(style)

    const div = document.createElement('div')
    div.className = 'test accent'
    document.body.appendChild(div)

    const computed = getComputedStyle(div)
    console.log('--current-intent on .test.accent:', computed.getPropertyValue('--current-intent'))
    console.log('background-color:', computed.backgroundColor)

    // Should be the accent color, not surface-mid
    expect(computed.getPropertyValue('--current-intent').trim()).toContain('0.6')
  })

  it('compound selector .affordance.solid works', async () => {
    const style = document.createElement('style')
    style.textContent = `
      :root {
        --hue: 265;
        --color-intent-accent: oklch(0.6 0.14 265);
        --surface-mid: oklch(0.94 0 265);
        --current-surface: var(--surface-mid);
        --current-intent: var(--surface-mid);
        --ramp-tint: 10%;
        --ramp-shade: 12%;
      }
      :where(.accent) { --current-intent: var(--color-intent-accent); }
      :where(.affordance.solid) {
        background-image:
          linear-gradient(135deg,
            color-mix(in oklch, var(--current-intent), white var(--ramp-tint)),
            var(--current-intent),
            color-mix(in oklch, var(--current-intent), black var(--ramp-shade))),
          linear-gradient(135deg,
            color-mix(in oklch, var(--current-intent), white var(--ramp-tint)),
            var(--current-intent),
            color-mix(in oklch, var(--current-intent), black var(--ramp-shade))),
          linear-gradient(90deg, white, white, white);
        background-origin: padding-box, border-box, padding-box;
        background-clip: padding-box, border-box, text;
        color: transparent;
        border: 1px solid transparent;
        padding: 8px 16px;
      }
    `
    document.head.appendChild(style)

    const btn = document.createElement('button')
    btn.className = 'affordance accent solid'
    btn.textContent = 'Save changes'
    document.body.appendChild(btn)

    const computed = getComputedStyle(btn)
    console.log('COMPOUND .affordance.solid.accent:')
    console.log('  --current-intent:', computed.getPropertyValue('--current-intent'))
    console.log('  background-image (first 100):', computed.backgroundImage.slice(0, 100))
    console.log('  color:', computed.color)

    // Text should be transparent (gradient text via background-clip: text)
    expect(computed.color).toBe('rgba(0, 0, 0, 0)')
    // Background should have gradients
    expect(computed.backgroundImage).toContain('linear-gradient')
    // Should have 3 gradient layers (third is white for text)
    expect(computed.backgroundImage.split('linear-gradient').length).toBeGreaterThanOrEqual(3)
  })
})
