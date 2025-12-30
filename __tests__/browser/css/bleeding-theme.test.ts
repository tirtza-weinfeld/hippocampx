import { describe, it, expect, beforeAll } from 'vitest'

describe('CSS @function isolation tests', () => {
  it('basic @function works', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --double(--v <number>) returns <number> {
        result: calc(var(--v) * 2);
      }
      .test-double { --result: --double(5); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-double'
    document.body.appendChild(el)

    const result = getComputedStyle(el).getPropertyValue('--result').trim()
    console.log('--double(5) =', result)
    expect(result).toBe('10')
  })

  it('@function returning color works', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --make-gray(--l <number>) returns <color> {
        result: oklch(var(--l) 0 0);
      }
      .test-color { background: --make-gray(0.5); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-color'
    document.body.appendChild(el)

    const bg = getComputedStyle(el).backgroundColor
    console.log('--make-gray(0.5) =', bg)
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('nested @function calls work', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --inner(--v <number>) returns <number> {
        result: calc(var(--v) + 1);
      }
      @function --outer(--v <number>) returns <number> {
        result: calc(--inner(var(--v)) * 2);
      }
      .test-nested { --result: --outer(5); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-nested'
    document.body.appendChild(el)

    const result = getComputedStyle(el).getPropertyValue('--result').trim()
    console.log('--outer(5) = --inner(5)*2 = (5+1)*2 =', result)
    // Should be (5+1)*2 = 12
  })

  it('@function result stored in custom prop works', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --make-gray(--l <number>) returns <color> {
        result: oklch(var(--l) 0 0);
      }
      :root { --my-gray: --make-gray(0.7); }
      .test-stored { background: var(--my-gray); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-stored'
    document.body.appendChild(el)

    const bg = getComputedStyle(el).backgroundColor
    console.log('var(--my-gray) stored from --make-gray(0.7) =', bg)
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('@function with if() style query works', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --pick-color(--light <color>, --dark <color>) returns <color> {
        result: if(style(--mode: dark): var(--dark); else: var(--light));
      }
      :root { --mode: light; }
      .dark { --mode: dark; }
      .test-pick { background: --pick-color(red, blue); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-pick'
    document.body.appendChild(el)

    const lightBg = getComputedStyle(el).backgroundColor
    console.log('light mode --pick-color =', lightBg)

    el.classList.add('dark')
    const darkBg = getComputedStyle(el).backgroundColor
    console.log('dark mode --pick-color =', darkBg)

    expect(lightBg).not.toBe(darkBg)
  })

  it('color-mix works directly', () => {
    const style = document.createElement('style')
    style.textContent = `
      .test-mix { background: color-mix(in oklch, red, blue 50%); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-mix'
    document.body.appendChild(el)

    const bg = getComputedStyle(el).backgroundColor
    console.log('color-mix(red, blue 50%) =', bg)
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('@function wrapping color-mix works', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      .test-fn-mix { background: --mix(red, blue, 50%); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-fn-mix'
    document.body.appendChild(el)

    const bg = getComputedStyle(el).backgroundColor
    console.log('--mix(red, blue, 50%) =', bg)
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('@function --mix with oklch colors (like bleeding-theme)', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --layer-base: oklch(0.94 0 265);
        --intent-src: oklch(0.94 0 265);
        --intent-boost: 12%;
        --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
      }
      .test-mix-oklch { background: var(--intent-color); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-mix-oklch'
    document.body.appendChild(el)

    const intentColor = getComputedStyle(el).getPropertyValue('--intent-color').trim()
    const bg = getComputedStyle(el).backgroundColor
    console.log('--intent-color (oklch mix) =', intentColor)
    console.log('bg =', bg)
  })

  it('--emph() exact pattern: nested if with semicolons', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --emph() returns <percentage> {
        result: if(style(--emphasis: loud): 12%; else: if(style(--emphasis: quiet): 4%; else: 8%;));
      }
      :root { --emphasis: mid; }
      .quiet { --emphasis: quiet; }
      .loud { --emphasis: loud; }
      .test-emph { --aura: --emph(); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-emph'
    document.body.appendChild(el)

    const aura = getComputedStyle(el).getPropertyValue('--aura').trim()
    console.log('--emph() mid =', aura)

    el.classList.add('quiet')
    const auraQuiet = getComputedStyle(el).getPropertyValue('--aura').trim()
    console.log('--emph() quiet =', auraQuiet)

    el.classList.remove('quiet')
    el.classList.add('loud')
    const auraLoud = getComputedStyle(el).getPropertyValue('--aura').trim()
    console.log('--emph() loud =', auraLoud)
  })

  it('.layer class name conflict with @layer?', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens, system;

      @layer tokens {
        :root { --test-var: working; }
      }

      @layer system {
        .layer { --from-layer-class: yes; color: red; }
      }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'layer'
    document.body.appendChild(el)

    const testVar = getComputedStyle(el).getPropertyValue('--test-var').trim()
    const fromClass = getComputedStyle(el).getPropertyValue('--from-layer-class').trim()
    const color = getComputedStyle(el).color
    console.log('.layer class test: --test-var =', testVar)
    console.log('.layer class test: --from-layer-class =', fromClass)
    console.log('.layer class test: color =', color)
  })

  it('if() result used in @function (like --layer-base -> --mix)', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;
        --l-layer-quiet: 0.97;
        --l-layer-mid: 0.94;
        --l-layer-loud: 0.90;

        /* This is how bleeding-theme defines --layer-base */
        --layer-base: if(
          style(--emphasis: loud): --neutral(var(--l-layer-loud));
          else: if(style(--emphasis: quiet): --neutral(var(--l-layer-quiet)); else: --neutral(var(--l-layer-mid));)
        );

        --intent-src: oklch(0.60 0.14 265);
        --intent-boost: 12%;
        --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
      }
      .test-if-mix { background: var(--intent-color); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-if-mix'
    document.body.appendChild(el)

    const layerBase = getComputedStyle(el).getPropertyValue('--layer-base').trim()
    const intentColor = getComputedStyle(el).getPropertyValue('--intent-color').trim()
    const bg = getComputedStyle(el).backgroundColor
    console.log('if() --layer-base =', layerBase)
    console.log('--intent-color (if result in mix) =', intentColor)
    console.log('bg =', bg)
  })

  it('linear-gradient with @function colors works', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --make-gray(--l <number>) returns <color> {
        result: oklch(var(--l) 0 0);
      }
      .test-grad { background: linear-gradient(--make-gray(0.9), --make-gray(0.7)); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-grad'
    document.body.appendChild(el)

    const bg = getComputedStyle(el).backgroundImage
    console.log('linear-gradient with @function =', bg)
    expect(bg).toContain('linear-gradient')
  })

  it('@function returning gradient works', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --grad(--a <color>, --b <color>) returns <image> {
        result: linear-gradient(180deg, var(--a), var(--b));
      }
      .test-fn-grad { background: --grad(red, blue); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-fn-grad'
    document.body.appendChild(el)

    const bg = getComputedStyle(el).backgroundImage
    console.log('--grad(red, blue) =', bg)
    expect(bg).toContain('linear-gradient')
  })

  it('chained functions like bleeding-theme: pick -> neutral -> grad', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --pick(--light type(*), --dark type(*)) returns type(*) {
        result: if(style(--scheme: dark): var(--dark); else: var(--light));
      }
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      @function --grad-v3(--a <color>, --b <color>, --c <color>) returns <image> {
        result: linear-gradient(180deg, var(--a), var(--b) 45%, var(--c));
      }
      :root {
        --scheme: light;
        --l-light: 0.97;
        --l-dark: 0.10;
      }
      .test-chain {
        /* This mimics the bleeding-theme pattern */
        --l-layer: --pick(var(--l-light), var(--l-dark));
        --layer-color: --neutral(var(--l-layer));
        background: --grad-v3(var(--layer-color), var(--layer-color), var(--layer-color));
      }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-chain'
    document.body.appendChild(el)

    const lLayer = getComputedStyle(el).getPropertyValue('--l-layer').trim()
    const layerColor = getComputedStyle(el).getPropertyValue('--layer-color').trim()
    const bg = getComputedStyle(el).backgroundImage

    console.log('--l-layer =', lLayer)
    console.log('--layer-color =', layerColor)
    console.log('background =', bg)

    expect(bg).toContain('linear-gradient')
  })

  it('if() with trailing semicolon syntax', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --pick-semi(--light type(*), --dark type(*)) returns type(*) {
        result: if(style(--scheme: dark): var(--dark); else: var(--light););
      }
      :root { --scheme: light; }
      .test-semi { --val: --pick-semi(red, blue); background: var(--val); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-semi'
    document.body.appendChild(el)

    const val = getComputedStyle(el).getPropertyValue('--val').trim()
    const bg = getComputedStyle(el).backgroundColor
    console.log('with trailing semicolon: --val =', val, 'bg =', bg)
  })

  it('if() without trailing semicolon syntax', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --pick-nosemi(--light type(*), --dark type(*)) returns type(*) {
        result: if(style(--scheme: dark): var(--dark); else: var(--light));
      }
      :root { --scheme: light; }
      .test-nosemi { --val: --pick-nosemi(red, blue); background: var(--val); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-nosemi'
    document.body.appendChild(el)

    const val = getComputedStyle(el).getPropertyValue('--val').trim()
    const bg = getComputedStyle(el).backgroundColor
    console.log('without trailing semicolon: --val =', val, 'bg =', bg)
  })

  it('nested function call without var() wrapper', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --pick(--light type(*), --dark type(*)) returns type(*) {
        result: if(style(--scheme: dark): var(--dark); else: var(--light));
      }
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      :root {
        --scheme: light;
        --l-light: 0.18;
        --l-dark: 0.92;
        /* This is how bleeding-theme does it - function call directly as arg */
        --ink-base: --neutral(--pick(var(--l-light), var(--l-dark)));
      }
      .test-nested-fn { background: var(--ink-base); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-nested-fn'
    document.body.appendChild(el)

    const inkBase = getComputedStyle(el).getPropertyValue('--ink-base').trim()
    const bg = getComputedStyle(el).backgroundColor
    console.log('nested fn --ink-base =', inkBase)
    console.log('nested fn bg =', bg)
  })

  it('contrast-color() function', () => {
    const style = document.createElement('style')
    style.textContent = `
      .test-contrast {
        --base: oklch(0.5 0.2 265);
        color: contrast-color(var(--base));
      }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-contrast'
    document.body.appendChild(el)

    const color = getComputedStyle(el).color
    console.log('contrast-color() =', color)
  })

  it('exact bleeding-theme pattern: @layer + functions + nested if', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens, base, system;

      @layer tokens {
        :root { --scheme: light; }
        :root[data-scheme="dark"] { --scheme: dark; }

        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }

        @function --neutral(--l <number>) returns <color> {
          result: oklch(var(--l) 0 265);
        }

        @function --grad-v3(--a <color>, --b <color>, --c <color>) returns <image> {
          result: linear-gradient(180deg, var(--a), var(--b) 45%, var(--c));
        }

        :root {
          --hue: 265;
          --l-layer-light: 0.94;
          --l-layer-dark: 0.13;
          --l-layer: --pick(var(--l-layer-light), var(--l-layer-dark));
          --layer-base: --neutral(var(--l-layer));
        }
      }

      @layer system {
        .layer {
          background: --grad-v3(var(--layer-base), var(--layer-base), var(--layer-base));
        }
      }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'layer'
    document.body.appendChild(el)

    const lLayer = getComputedStyle(el).getPropertyValue('--l-layer').trim()
    const layerBase = getComputedStyle(el).getPropertyValue('--layer-base').trim()
    const bg = getComputedStyle(el).backgroundImage

    console.log('exact pattern --l-layer =', lLayer)
    console.log('exact pattern --layer-base =', layerBase)
    console.log('exact pattern background =', bg)

    expect(bg).toContain('linear-gradient')
  })

  it('simplified: function result in var, then use var in another function', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --get-num() returns <number> {
        result: 0.5;
      }
      @function --make-color(--l <number>) returns <color> {
        result: oklch(var(--l) 0 0);
      }
      :root {
        --num: --get-num();
      }
      .test-var-chain {
        background: --make-color(var(--num));
      }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-var-chain'
    document.body.appendChild(el)

    const num = getComputedStyle(el).getPropertyValue('--num').trim()
    const bg = getComputedStyle(el).backgroundColor

    console.log('--num (from --get-num()) =', num)
    console.log('--make-color(var(--num)) =', bg)

    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('if() result as percentage in --mix() (like --intent-boost)', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;
        --layer-base: oklch(0.94 0 265);
        --intent-src: oklch(0.60 0.14 265);
        /* This is the exact pattern from bleeding-theme */
        --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));
        --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
      }
      .test-if-pct { background: var(--intent-color); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-if-pct'
    document.body.appendChild(el)

    const intentBoost = getComputedStyle(el).getPropertyValue('--intent-boost').trim()
    const intentColor = getComputedStyle(el).getPropertyValue('--intent-color').trim()
    const bg = getComputedStyle(el).backgroundColor

    console.log('--intent-boost (if result) =', intentBoost)
    console.log('--intent-color (mix with if pct) =', intentColor)
    console.log('bg =', bg)
  })

  it('@function INSIDE @layer (bleeding-theme structure)', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;

      @layer tokens {
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
          result: color-mix(in oklch, var(--a), var(--b) var(--pct));
        }
        :root {
          --layer-base: oklch(0.94 0 265);
          --intent-src: oklch(0.60 0.14 265);
          --intent-boost: 12%;
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
        }
      }
      .test-layer-fn { background: var(--intent-color); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-layer-fn'
    document.body.appendChild(el)

    const intentColor = getComputedStyle(el).getPropertyValue('--intent-color').trim()
    const bg = getComputedStyle(el).backgroundColor

    console.log('@function inside @layer: --intent-color =', intentColor)
    console.log('@function inside @layer: bg =', bg)
  })

  it('deeply nested if() for --intent-src (4 levels)', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --intent: base;
        --layer-base: oklch(0.94 0 265);
        --intent-accent: oklch(0.60 0.14 265);
        --intent-positive: oklch(0.62 0.14 145);
        --intent-caution: oklch(0.68 0.14 85);
        --intent-destructive: oklch(0.58 0.14 25);

        /* Exact pattern from bleeding-theme: 4-level nested if() */
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

        --intent-boost: 12%;
        --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));
      }
      .test-deep-if { background: var(--intent-color); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-deep-if'
    document.body.appendChild(el)

    const intentSrc = getComputedStyle(el).getPropertyValue('--intent-src').trim()
    const intentColor = getComputedStyle(el).getPropertyValue('--intent-color').trim()
    const bg = getComputedStyle(el).backgroundColor

    console.log('4-level if --intent-src =', intentSrc)
    console.log('4-level if --intent-color =', intentColor)
    console.log('4-level if bg =', bg)
  })

  it('type(*) generic annotation support', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --generic-pick(--light type(*), --dark type(*)) returns type(*) {
        result: if(style(--mode: dark): var(--dark); else: var(--light));
      }
      :root { --mode: light; }
      .test-generic { --val: --generic-pick(red, blue); background: var(--val); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-generic'
    document.body.appendChild(el)

    // Check what the function rule looks like
    const rules = style.sheet?.cssRules
    if (rules) {
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].constructor.name === 'CSSFunctionRule') {
          console.log('CSSFunctionRule text:', rules[i].cssText)
        }
      }
    }

    const val = getComputedStyle(el).getPropertyValue('--val').trim()
    const bg = getComputedStyle(el).backgroundColor

    console.log('type(*) --val =', val)
    console.log('type(*) bg =', bg)
  })

  it('exact bleeding-theme structure: two :root blocks, fn result -> fn call', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;

      @layer tokens {
        @function --pick(--light type(*), --dark type(*)) returns type(*) {
          result: if(style(--scheme: dark): var(--dark); else: var(--light););
        }

        @function --neutral(--l <number>) returns <color> {
          result: oklch(var(--l) 0 var(--hue));
        }

        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
          result: color-mix(in oklch, var(--a), var(--b) var(--pct));
        }

        @function --emph() returns <percentage> {
          result: if(style(--emphasis: loud): 12%; else: if(style(--emphasis: quiet): 4%; else: 8%;));
        }

        /* First :root - static values */
        :root {
          --scheme: light;
          --hue: 265;
          --l-ink-light: 0.18;
          --l-ink-dark: 0.92;
          --l-layer-mid-light: 0.94;
          --l-layer-mid-dark: 0.13;
        }

        /* Second :root - derived values (exactly like bleeding-theme) */
        :root {
          --emphasis: mid;

          /* nested function call: --neutral(--pick(...)) */
          --ink-base: --neutral(--pick(var(--l-ink-light), var(--l-ink-dark)));

          /* layer-base uses if() with nested function call */
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(var(--l-layer-mid-light));)
          );

          /* intent-src resolves to layer-base for base intent */
          --intent-src: var(--layer-base);

          /* intent-boost from if() */
          --intent-boost: if(style(--emphasis: loud): 18%; else: if(style(--emphasis: quiet): 8%; else: 12%;));

          /* THE PROBLEM: mix of fn result (layer-base), fn result (intent-src), if() result (intent-boost) */
          --intent-color: --mix(var(--layer-base), var(--intent-src), var(--intent-boost));

          /* aura from @function call */
          --aura: --emph();

          /* g-layer-a uses --intent-color */
          --g-layer-a: --mix(var(--layer-base), var(--intent-color), var(--aura));

          /* g-layer-c uses --ink-base (simpler) */
          --g-layer-c: --mix(var(--layer-base), var(--ink-base), 4%);
        }
      }

      .test-exact { background: var(--intent-color); }
    `
    document.head.appendChild(style)

    const el = document.createElement('div')
    el.className = 'test-exact'
    document.body.appendChild(el)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('EXACT STRUCTURE:')
    console.log('  --ink-base:', rootStyle.getPropertyValue('--ink-base').trim())
    console.log('  --layer-base:', rootStyle.getPropertyValue('--layer-base').trim())
    console.log('  --intent-src:', rootStyle.getPropertyValue('--intent-src').trim())
    console.log('  --intent-boost:', rootStyle.getPropertyValue('--intent-boost').trim())
    console.log('  --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())
    console.log('  --aura:', rootStyle.getPropertyValue('--aura').trim())
    console.log('  --g-layer-a:', rootStyle.getPropertyValue('--g-layer-a').trim())
    console.log('  --g-layer-c:', rootStyle.getPropertyValue('--g-layer-c').trim())

    const bg = getComputedStyle(el).backgroundColor
    console.log('  bg:', bg)
  })

  it('isolate: var pct vs literal pct in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --c1: oklch(0.94 0 265);
        --c2: oklch(0.18 0 265);
        --pct-var: 12%;

        /* literal pct */
        --result-literal: --mix(var(--c1), var(--c2), 12%);
        /* var pct */
        --result-var: --mix(var(--c1), var(--c2), var(--pct-var));
      }
    `
    document.head.appendChild(style)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('--pct-var:', rootStyle.getPropertyValue('--pct-var').trim())
    console.log('--result-literal (12%):', rootStyle.getPropertyValue('--result-literal').trim())
    console.log('--result-var (var):', rootStyle.getPropertyValue('--result-var').trim())
  })

  it('isolate: if() result as pct in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --mode: a;
        --c1: oklch(0.94 0 265);
        --c2: oklch(0.18 0 265);
        --pct-if: if(style(--mode: b): 20%; else: 12%);

        /* if result as pct */
        --result-if: --mix(var(--c1), var(--c2), var(--pct-if));
      }
    `
    document.head.appendChild(style)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('--pct-if:', rootStyle.getPropertyValue('--pct-if').trim())
    console.log('--result-if:', rootStyle.getPropertyValue('--result-if').trim())
  })

  it('isolate: if() color result -> var -> --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;

        /* layer-base from if() with fn call */
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );

        /* intent-src references layer-base */
        --intent-src: var(--layer-base);

        /* mix with two if() results */
        --intent-color: --mix(var(--layer-base), var(--intent-src), 12%);
      }
    `
    document.head.appendChild(style)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('if->var->mix --layer-base:', rootStyle.getPropertyValue('--layer-base').trim())
    console.log('if->var->mix --intent-src:', rootStyle.getPropertyValue('--intent-src').trim())
    console.log('if->var->mix --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())
  })

  it('isolate: everything inside @layer tokens', () => {
    const style = document.createElement('style')
    style.textContent = `
      @layer tokens;

      @layer tokens {
        @function --neutral(--l <number>) returns <color> {
          result: oklch(var(--l) 0 265);
        }
        @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
          result: color-mix(in oklch, var(--a), var(--b) var(--pct));
        }
        :root {
          --emphasis: mid;
          --layer-base: if(
            style(--emphasis: loud): --neutral(0.90);
            else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
          );
          --intent-src: var(--layer-base);
          --intent-color: --mix(var(--layer-base), var(--intent-src), 12%);
        }
      }
    `
    document.head.appendChild(style)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('@layer --layer-base:', rootStyle.getPropertyValue('--layer-base').trim())
    console.log('@layer --intent-src:', rootStyle.getPropertyValue('--intent-src').trim())
    console.log('@layer --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())
  })

  it('isolate: NO var alias, direct if() result in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        /* NO alias - use layer-base twice directly */
        --intent-color: --mix(var(--layer-base), var(--layer-base), 12%);
      }
    `
    document.head.appendChild(style)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('NO alias --layer-base:', rootStyle.getPropertyValue('--layer-base').trim())
    console.log('NO alias --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())
  })

  it('isolate: simple color in var alias (clean)', () => {
    // Create isolated container with shadow DOM to avoid style pollution
    const container = document.createElement('div')
    const shadow = container.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = `
      @function --mix-clean(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :host {
        --layer-base: oklch(0.94 0 265);
        --intent-src: var(--layer-base);
        --intent-color: --mix-clean(var(--layer-base), var(--intent-src), 12%);
      }
    `
    shadow.appendChild(style)

    const testEl = document.createElement('div')
    shadow.appendChild(testEl)
    document.body.appendChild(container)

    const hostStyle = getComputedStyle(container)
    console.log('shadow --layer-base:', hostStyle.getPropertyValue('--layer-base').trim())
    console.log('shadow --intent-src:', hostStyle.getPropertyValue('--intent-src').trim())
    console.log('shadow --intent-color:', hostStyle.getPropertyValue('--intent-color').trim())
  })

  it('isolate: if() color stored in var, then used in --mix()', () => {
    const style = document.createElement('style')
    style.textContent = `
      @function --neutral(--l <number>) returns <color> {
        result: oklch(var(--l) 0 265);
      }
      @function --mix(--a <color>, --b <color>, --pct <percentage>) returns <color> {
        result: color-mix(in oklch, var(--a), var(--b) var(--pct));
      }
      :root {
        --emphasis: mid;
        --layer-base: if(
          style(--emphasis: loud): --neutral(0.90);
          else: if(style(--emphasis: quiet): --neutral(0.97); else: --neutral(0.94);)
        );
        /* use layer-base and a different color */
        --other-color: oklch(0.5 0.1 265);
        --intent-color: --mix(var(--layer-base), var(--other-color), 12%);
      }
    `
    document.head.appendChild(style)

    const rootStyle = getComputedStyle(document.documentElement)
    console.log('if+other --layer-base:', rootStyle.getPropertyValue('--layer-base').trim())
    console.log('if+other --intent-color:', rootStyle.getPropertyValue('--intent-color').trim())
  })
})

describe('Bleeding Edge Theme', () => {
  let style: HTMLStyleElement
  let css: string

  beforeAll(async () => {
    // Load the bleeding-theme.css content
    const response = await fetch('/bleeding-theme.css')
    css = await response.text()
    console.log('CSS length:', css.length)
    console.log('CSS first 500 chars:', css.substring(0, 500))

    style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)

    console.log('styleSheet rules:', style.sheet?.cssRules.length)

    // Check what's in the rules
    if (style.sheet) {
      for (let i = 0; i < style.sheet.cssRules.length; i++) {
        const rule = style.sheet.cssRules[i]
        console.log(`Rule ${i}: type=${rule.constructor.name}, text=${rule.cssText.substring(0, 100)}...`)
        // Check nested rules in @layer blocks
        if ('cssRules' in rule) {
          const layerRule = rule as CSSGroupingRule
          console.log(`  -> ${layerRule.cssRules.length} nested rules`)
          for (let j = 0; j < layerRule.cssRules.length; j++) {
            const nested = layerRule.cssRules[j]
            // Show more of :root rules
            const textLen = nested.cssText.startsWith(':root') ? 200 : 80
            console.log(`  Rule ${i}.${j}: ${nested.constructor.name}, ${nested.cssText.substring(0, textLen)}...`)
          }
        }
      }
    }

    // Check root variables
    const rootStyle = getComputedStyle(document.documentElement)
    console.log('Root --scheme:', rootStyle.getPropertyValue('--scheme'))
    console.log('Root --hue:', rootStyle.getPropertyValue('--hue'))
    console.log('Root --ink-base:', rootStyle.getPropertyValue('--ink-base'))
    console.log('Root --l-surface-mid:', rootStyle.getPropertyValue('--l-surface-mid'))
    console.log('Root --surface-mid:', rootStyle.getPropertyValue('--surface-mid'))
    console.log('Root --surface-base:', rootStyle.getPropertyValue('--surface-base'))
    console.log('Root --intent-src:', rootStyle.getPropertyValue('--intent-src'))
    console.log('Root --intent-boost:', rootStyle.getPropertyValue('--intent-boost'))
    console.log('Root --intent-color:', rootStyle.getPropertyValue('--intent-color'))
    console.log('Root --aura:', rootStyle.getPropertyValue('--aura'))
    console.log('Root --g-surface-a:', rootStyle.getPropertyValue('--g-surface-a'))
    console.log('Root --g-surface-b:', rootStyle.getPropertyValue('--g-surface-b'))
    console.log('Root --g-surface-c:', rootStyle.getPropertyValue('--g-surface-c'))

    // Set up test container with all the class combinations
    document.body.innerHTML = `
      <div id="test-container">
        <div class="surface quiet base" data-test="surface-quiet-base">Surface Quiet Base</div>
        <div class="surface mid base" data-test="surface-mid-base">Surface Mid Base</div>
        <div class="surface loud base" data-test="surface-loud-base">Surface Loud Base</div>
        <div class="surface mid accent" data-test="surface-accent">Surface Accent</div>
        <div class="surface mid positive" data-test="surface-positive">Surface Positive</div>
        <div class="surface mid caution" data-test="surface-caution">Surface Caution</div>
        <div class="surface mid destructive" data-test="surface-destructive">Surface Destructive</div>

        <span class="ink mid base" data-test="ink-base">Ink Base</span>
        <span class="ink mid accent" data-test="ink-accent">Ink Accent</span>
        <span class="ink quiet accent" data-test="ink-quiet">Ink Quiet</span>
        <span class="ink loud accent" data-test="ink-loud">Ink Loud</span>

        <button class="affordance solid accent" data-test="btn-solid">Solid</button>
        <button class="affordance soft accent" data-test="btn-soft">Soft</button>
        <button class="affordance outline accent" data-test="btn-outline">Outline</button>
        <button class="affordance ghost accent" data-test="btn-ghost">Ghost</button>
      </div>
    `
  })

  describe('@function support', () => {
    it('CSS is loaded and parsed', () => {
      expect(style.sheet).not.toBeNull()
      expect(style.sheet!.cssRules.length).toBeGreaterThan(0)
    })

    it('@function rules are recognized', () => {
      const rules = Array.from(style.sheet!.cssRules)
      const functionRules = rules.filter(r => r.cssText.includes('@function'))
      console.log('Function rules found:', functionRules.length)
      // If @function is supported, the rules should exist
      // If not supported, they'll be dropped during parsing
    })
  })

  describe('Role: Surface', () => {
    it('.surface has gradient background', () => {
      const el = document.querySelector('[data-test="surface-mid-base"]') as HTMLElement
      const bg = getComputedStyle(el).backgroundImage
      console.log('.surface background:', bg)
      expect(bg).toContain('linear-gradient')
    })

    it('.surface has border', () => {
      const el = document.querySelector('[data-test="surface-mid-base"]') as HTMLElement
      const border = getComputedStyle(el).border
      console.log('.surface border:', border)
      expect(border).not.toBe('0px none rgb(0, 0, 0)')
    })

    it('emphasis changes surface lightness', () => {
      const quiet = document.querySelector('[data-test="surface-quiet-base"]') as HTMLElement
      const loud = document.querySelector('[data-test="surface-loud-base"]') as HTMLElement

      const quietBg = getComputedStyle(quiet).backgroundImage
      const loudBg = getComputedStyle(loud).backgroundImage

      console.log('quiet:', quietBg)
      console.log('loud:', loudBg)

      expect(quietBg).not.toBe(loudBg)
    })

    it('intent changes surface color', () => {
      const base = document.querySelector('[data-test="surface-mid-base"]') as HTMLElement
      const accent = document.querySelector('[data-test="surface-accent"]') as HTMLElement

      const baseBg = getComputedStyle(base).backgroundImage
      const accentBg = getComputedStyle(accent).backgroundImage

      console.log('base:', baseBg)
      console.log('accent:', accentBg)

      expect(baseBg).not.toBe(accentBg)
    })
  })

  describe('Role: Ink', () => {
    it('.ink has gradient text (background-clip: text)', () => {
      const el = document.querySelector('[data-test="ink-base"]') as HTMLElement
      const clip = getComputedStyle(el).backgroundClip
      console.log('.ink background-clip:', clip)
      expect(clip).toBe('text')
    })

    it('.ink has transparent color', () => {
      const el = document.querySelector('[data-test="ink-base"]') as HTMLElement
      const color = getComputedStyle(el).color
      console.log('.ink color:', color)
      expect(color).toBe('rgba(0, 0, 0, 0)')
    })

    it('.ink has gradient background-image', () => {
      const el = document.querySelector('[data-test="ink-base"]') as HTMLElement
      const bg = getComputedStyle(el).backgroundImage
      console.log('.ink background-image:', bg)
      expect(bg).toContain('linear-gradient')
    })
  })

  describe('Role: Affordance', () => {
    it('.affordance.solid has gradient background', () => {
      const el = document.querySelector('[data-test="btn-solid"]') as HTMLElement
      const bg = getComputedStyle(el).backgroundImage
      console.log('.affordance.solid background:', bg)
      expect(bg).toContain('linear-gradient')
    })

    it('.affordance has transparent border for gradient border trick', () => {
      const el = document.querySelector('[data-test="btn-solid"]') as HTMLElement
      const borderColor = getComputedStyle(el).borderColor
      console.log('.affordance border-color:', borderColor)
      expect(borderColor).toBe('rgba(0, 0, 0, 0)')
    })

    it('different weights have different backgrounds', () => {
      const solid = document.querySelector('[data-test="btn-solid"]') as HTMLElement
      const soft = document.querySelector('[data-test="btn-soft"]') as HTMLElement
      const outline = document.querySelector('[data-test="btn-outline"]') as HTMLElement
      const ghost = document.querySelector('[data-test="btn-ghost"]') as HTMLElement

      const solidBg = getComputedStyle(solid).backgroundImage
      const softBg = getComputedStyle(soft).backgroundImage
      const outlineBg = getComputedStyle(outline).backgroundImage
      const ghostBg = getComputedStyle(ghost).backgroundImage

      console.log('solid:', solidBg)
      console.log('soft:', softBg)
      console.log('outline:', outlineBg)
      console.log('ghost:', ghostBg)

      // All should be different
      expect(solidBg).not.toBe(softBg)
      expect(softBg).not.toBe(outlineBg)
      expect(outlineBg).not.toBe(ghostBg)
    })
  })

  describe('Theme Toggle (--scheme)', () => {
    it('light mode is default', () => {
      document.documentElement.setAttribute('data-scheme', 'light')
      const scheme = getComputedStyle(document.documentElement).getPropertyValue('--scheme').trim()
      console.log('--scheme:', scheme)
      expect(scheme).toBe('light')
    })

    it('dark mode changes --scheme', () => {
      document.documentElement.setAttribute('data-scheme', 'dark')
      const scheme = getComputedStyle(document.documentElement).getPropertyValue('--scheme').trim()
      console.log('--scheme (dark):', scheme)
      expect(scheme).toBe('dark')
    })

    it('surface colors change between light and dark', () => {
      const el = document.querySelector('[data-test="surface-mid-base"]') as HTMLElement

      document.documentElement.setAttribute('data-scheme', 'light')
      const lightBg = getComputedStyle(el).backgroundImage

      document.documentElement.setAttribute('data-scheme', 'dark')
      const darkBg = getComputedStyle(el).backgroundImage

      console.log('light:', lightBg)
      console.log('dark:', darkBg)

      expect(lightBg).not.toBe(darkBg)

      // Reset
      document.documentElement.setAttribute('data-scheme', 'light')
    })
  })
})
