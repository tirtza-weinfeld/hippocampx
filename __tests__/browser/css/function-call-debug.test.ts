import { describe, it, expect, beforeAll } from 'vitest'

// This test tries to understand why --mix() fails when CSS loaded from file
// but works with inline CSS

describe('Function call debugging', () => {
  it('inline CSS: --mix with computed vars', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;

      @layer tokens {
        :root { --scheme: light; }

        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }

        @function --neutral(--l <number>) returns <color> {
          result: oklch(var(--l) 0 var(--hue));
        }

        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
          result: color-mix(in oklch, var(--a), var(--b) var(--pct));
        }

        :root {
          --hue: 265;
          --l-layer-mid-light: 0.94;
          --l-layer-mid-dark: 0.13;
          --emphasis: mid;

          --l-layer-mid: --pick(var(--l-layer-mid-light), var(--l-layer-mid-dark));

          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(var(--l-layer-mid));)
          );

          --intent-src: var(--layer-base);
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
        }
      }
    `
    document.head.appendChild(style)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('INLINE:')
    console.log('  --l-layer-mid:', rootStyle.getPropertyValue('--l-layer-mid').trim())
    console.log('  --layer-base:', rootStyle.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', rootStyle.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', rootStyle.getPropertyValue('--intent-boost').trim())
    console.log('  --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())

    expect(rootStyle.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('fetch CSS then inject: --mix with computed vars', async () => {
    // First, let's see what the file contains
    const response = await fetch('/bleeding-theme-inline-test.css')
    const css = await response.text()

    console.log('FILE CSS length:', css.length)
    console.log('FILE CSS first 200:', css.substring(0, 200))

    // Inject via style tag (not link)
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)

    // Wait a tick for style recalc
    await new Promise(r => requestAnimationFrame(r))

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('FETCHED then INJECTED:')
    console.log('  --scheme:', rootStyle.getPropertyValue('--scheme').trim())
    console.log('  --hue:', rootStyle.getPropertyValue('--hue').trim())
    console.log('  --layer-base:', rootStyle.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', rootStyle.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', rootStyle.getPropertyValue('--intent-boost').trim())
    console.log('  --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())

    expect(rootStyle.getPropertyValue('--intent-color').trim()).not.toBe('')
  })

  it('check if prior test polluted the state', async () => {
    // Check current computed values
    const rootStyle = getComputedStyle(document.documentElement)

    // Count style/link elements
    const styles = document.querySelectorAll('style')
    const links = document.querySelectorAll('link[rel="stylesheet"]')

    console.log('POLLUTION CHECK:')
    console.log('  style elements:', styles.length)
    console.log('  link elements:', links.length)
    console.log('  --scheme:', rootStyle.getPropertyValue('--scheme').trim())
    console.log('  --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())

    // Log all style contents
    styles.forEach((s, i) => {
      console.log(`  style[${i}] length:`, s.textContent?.length || 0)
    })
  })

  it('link tag loading preserves @function?', async () => {
    // Clear prior styles
    document.querySelectorAll('style').forEach(s => s.remove())
    document.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove())

    // Load via link tag
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/bleeding-theme-inline-test.css?nocache=' + Date.now()
    document.head.appendChild(link)

    await new Promise(resolve => {
      link.onload = resolve
      link.onerror = () => resolve(undefined)
    })

    // Wait for style recalc
    await new Promise(r => requestAnimationFrame(r))
    await new Promise(r => setTimeout(r, 100))

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('LINK TAG:')
    console.log('  --scheme:', rootStyle.getPropertyValue('--scheme').trim())
    console.log('  --hue:', rootStyle.getPropertyValue('--hue').trim())
    console.log('  --layer-base:', rootStyle.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', rootStyle.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', rootStyle.getPropertyValue('--intent-boost').trim())
    console.log('  --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())

    // Check if the stylesheet loaded and has rules
    const sheets = Array.from(document.styleSheets)
    console.log('  styleSheets:', sheets.length)
    sheets.forEach((sheet, i) => {
      try {
        console.log(`  sheet[${i}] rules:`, sheet.cssRules?.length || 0, 'href:', sheet.href)
      } catch (e) {
        console.log(`  sheet[${i}] CORS blocked`)
      }
    })
  })

  it('raw string injection (no file)', () => {
    // Clear prior styles
    document.querySelectorAll('style').forEach(s => s.remove())
    document.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove())

    // Inject minimal CSS directly
    const css = `
@layer tokens;

@layer tokens {
  :root { --scheme: light; }

  @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
    result: color-mix(in oklch, var(--a), var(--b) var(--pct));
  }

  :root {
    --hue: 265;
    --layer-base: oklch(0.94 0 265);
    --intent-src: oklch(0.94 0 265);
    --intent-boost: 12%;
    --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
  }
}
`
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('RAW STRING (minimal):')
    console.log('  --layer-base:', rootStyle.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', rootStyle.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', rootStyle.getPropertyValue('--intent-boost').trim())
    console.log('  --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())

    expect(rootStyle.getPropertyValue('--intent-color').trim()).not.toBe('')
  })
})
