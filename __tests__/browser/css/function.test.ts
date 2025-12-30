import { describe, it, expect, beforeAll } from 'vitest'

describe('CSS @function support', () => {
  let container: HTMLDivElement
  let style: HTMLStyleElement

  beforeAll(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    // Inject pure CSS (no Tailwind processing)
    style = document.createElement('style')
    style.textContent = `
      /* Test 1: Basic @function */
      @function --double(--value) {
        result: calc(var(--value) * 2);
      }

      /* Test 2: @function returning color */
      @function --make-red(--lightness) {
        result: oklch(var(--lightness) 0.26 29);
      }

      /* Test 3: @function with light-dark */
      @function --adaptive(--base <color>) returns <color> {
        result: light-dark(
          var(--base),
          oklch(from var(--base) calc(l + 0.15) calc(c * 0.9) h)
        );
      }

      /* Test 4: @function with if() style query */
      @function --if-dark(--light, --dark) {
        result: if(
          style(--scheme: dark): var(--dark);
          else: var(--light);
        );
      }

      @function --adaptive-if(--base <color>) returns <color> {
        result: if(
          style(--scheme: dark): oklch(from var(--base) calc(l + 0.15) calc(c * 0.9) h);
          else: var(--base);
        );
      }

      :root {
        color-scheme: light dark;
        --scheme: light;
        --test-double: --double(10px);
        --test-color: --make-red(0.58);
        --test-adaptive: --adaptive(oklch(0.58 0.26 29));
        --test-direct-lightdark: light-dark(oklch(0.58 0.26 29), oklch(0.73 0.23 29));
        --test-baseline: oklch(0.58 0.26 29);
        --test-if-dark: --if-dark(red, blue);
        --test-adaptive-if: --adaptive-if(oklch(0.58 0.26 29));
      }

      .dark { --scheme: dark; }

      .box-double { width: var(--test-double); height: 20px; background: blue; }
      .box-color { width: 50px; height: 50px; background: var(--test-color); }
      .box-adaptive { width: 50px; height: 50px; background: var(--test-adaptive); }
      .box-direct { width: 50px; height: 50px; background: var(--test-direct-lightdark); }
      .box-baseline { width: 50px; height: 50px; background: var(--test-baseline); }
      .box-if-dark { width: 50px; height: 50px; background: var(--test-if-dark); }
      .box-adaptive-if { width: 50px; height: 50px; background: var(--test-adaptive-if); }
    `
    document.head.appendChild(style)
  })

  it('baseline: plain oklch works', () => {
    const el = document.createElement('div')
    el.className = 'box-baseline'
    container.appendChild(el)

    const bg = getComputedStyle(el).backgroundColor
    // Should be a color, not transparent
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    expect(bg).toMatch(/rgb|oklch/)
  })

  it('light-dark() works directly (no @function)', () => {
    const el = document.createElement('div')
    el.className = 'box-direct'
    container.appendChild(el)

    const bg = getComputedStyle(el).backgroundColor
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    expect(bg).toMatch(/rgb|oklch/)
  })

  it('@function --double works (basic calc)', () => {
    const el = document.createElement('div')
    el.className = 'box-double'
    container.appendChild(el)

    const width = getComputedStyle(el).width
    // Should be 20px (10px * 2)
    expect(width).toBe('20px')
  })

  it('@function --make-red works (returns color)', () => {
    const el = document.createElement('div')
    el.className = 'box-color'
    container.appendChild(el)

    const bg = getComputedStyle(el).backgroundColor
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    expect(bg).toMatch(/rgb|oklch/)
  })

  it('@function --adaptive works (light-dark inside function)', () => {
    const el = document.createElement('div')
    el.className = 'box-adaptive'
    container.appendChild(el)

    const bg = getComputedStyle(el).backgroundColor
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    expect(bg).toMatch(/rgb|oklch/)
  })

  it('color-scheme toggle changes light-dark output', () => {
    const el = document.createElement('div')
    el.className = 'box-direct'
    container.appendChild(el)

    // Get light mode color
    document.documentElement.style.colorScheme = 'light'
    const lightBg = getComputedStyle(el).backgroundColor

    // Toggle to dark
    document.documentElement.style.colorScheme = 'dark'
    const darkBg = getComputedStyle(el).backgroundColor

    // Should be different colors
    expect(lightBg).not.toBe(darkBg)

    // Reset
    document.documentElement.style.colorScheme = ''
  })

  it('@function with if() style query works', () => {
    const el = document.createElement('div')
    el.className = 'box-if-dark'
    container.appendChild(el)

    const bg = getComputedStyle(el).backgroundColor
    // Should be red in light mode (not transparent)
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('@function with if() responds to --scheme change (inline call)', () => {
    // style() queries evaluate at the point of definition
    // So we need to call the function inline, not via a variable from :root
    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
      <style>
        .local-box {
          width: 50px;
          height: 50px;
          background: --if-dark(red, blue);
        }
      </style>
      <div class="local-box"></div>
    `
    container.appendChild(wrapper)
    const el = wrapper.querySelector('.local-box') as HTMLElement

    // Light mode (default)
    const lightBg = getComputedStyle(el).backgroundColor

    // Add .dark class to wrapper (sets --scheme: dark)
    wrapper.classList.add('dark')
    const darkBg = getComputedStyle(el).backgroundColor

    // Should be different (red vs blue)
    expect(lightBg).not.toBe(darkBg)
  })

  it('@function --adaptive-if works with style query', () => {
    const el = document.createElement('div')
    el.className = 'box-adaptive-if'
    container.appendChild(el)

    const bg = getComputedStyle(el).backgroundColor
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })
})
