'use client'

/* =============================================================================
   1. SIMPLE UTILITIES DEMOS
   ============================================================================= */

export function ScrollbarDemo() {
  return (
    <div className="flex gap-4 w-full">
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-2">scrollbar-hidden</p>
        <div className="h-24 overflow-y-auto scrollbar-hidden rounded-lg bg-muted/30 p-3">
          {Array.from({ length: 15 }, (_, i) => (
            <p key={i} className="text-sm">Line {i + 1}</p>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-2">scrollbar-styled</p>
        <div className="h-24 overflow-y-auto scrollbar-styled rounded-lg bg-muted/30 p-3">
          {Array.from({ length: 15 }, (_, i) => (
            <p key={i} className="text-sm">Line {i + 1}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FocusRingDemo() {
  return (
    <div className="flex gap-4 items-center">
      <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground focus-ring-gradient">
        Focus me (Tab)
      </button>
      <input
        type="text"
        placeholder="Or focus this input"
        className="px-4 py-2 rounded-lg border bg-background focus-ring-gradient"
      />
    </div>
  )
}

/* =============================================================================
   2. THEME VALUE MATCHING DEMOS
   ============================================================================= */

export function SurfaceDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="surface-critical px-4 py-3 rounded-lg">Critical</div>
      <div className="surface-warning px-4 py-3 rounded-lg">Warning</div>
      <div className="surface-success px-4 py-3 rounded-lg">Success</div>
      <div className="surface-info px-4 py-3 rounded-lg">Info</div>
      <div className="surface-muted px-4 py-3 rounded-lg">Muted</div>
    </div>
  )
}

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="badge-critical">Critical</span>
      <span className="badge-warning">Warning</span>
      <span className="badge-success">Success</span>
      <span className="badge-info">Info</span>
    </div>
  )
}

export function GlowDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="glow-brand px-4 py-3 rounded-lg bg-background">Brand</div>
      <div className="glow-success px-4 py-3 rounded-lg bg-background">Success</div>
      <div className="glow-warning px-4 py-3 rounded-lg bg-background">Warning</div>
      <div className="glow-critical px-4 py-3 rounded-lg bg-background">Critical</div>
    </div>
  )
}

export function TabSizeDemo() {
  return (
    <div className="space-y-3 font-mono text-sm">
      <div>
        <p className="text-xs text-muted-foreground mb-1">tab-2</p>
        <pre className="tab-2 bg-muted/30 p-2 rounded">{`function greet() {\n\treturn "hello";\n}`}</pre>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">tab-github (8)</p>
        <pre className="tab-github bg-muted/30 p-2 rounded">{`function greet() {\n\treturn "hello";\n}`}</pre>
      </div>
    </div>
  )
}

/* =============================================================================
   3. BARE VALUES DEMOS
   ============================================================================= */

export function BareValuesDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">cols-* (integer)</p>
        <div className="cols-3 gap-2">
          <div className="bg-primary/20 p-2 rounded text-center text-sm break-inside-avoid">A</div>
          <div className="bg-primary/20 p-2 rounded text-center text-sm break-inside-avoid">B</div>
          <div className="bg-primary/20 p-2 rounded text-center text-sm break-inside-avoid">C</div>
          <div className="bg-primary/20 p-2 rounded text-center text-sm break-inside-avoid">D</div>
          <div className="bg-primary/20 p-2 rounded text-center text-sm break-inside-avoid">E</div>
          <div className="bg-primary/20 p-2 rounded text-center text-sm break-inside-avoid">F</div>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">layer-* (z-index)</p>
        <div className="relative h-20">
          <div className="layer-10 absolute left-0 top-0 w-16 h-16 bg-red-400/80 rounded flex items-center justify-center text-white text-xs">z-10</div>
          <div className="layer-50 absolute left-8 top-2 w-16 h-16 bg-blue-400/80 rounded flex items-center justify-center text-white text-xs">z-50</div>
          <div className="layer-100 absolute left-16 top-4 w-16 h-16 bg-green-400/80 rounded flex items-center justify-center text-white text-xs">z-100</div>
        </div>
      </div>
    </div>
  )
}

/* =============================================================================
   4. LITERAL VALUES DEMOS
   ============================================================================= */

export function LiteralValuesDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">wrap-* (text-wrap literals)</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs opacity-60">wrap-balance</span>
            <p className="wrap-balance bg-muted/30 p-2 rounded text-sm">
              This is a longer headline that will be balanced across lines for better typography
            </p>
          </div>
          <div>
            <span className="text-xs opacity-60">wrap-pretty</span>
            <p className="wrap-pretty bg-muted/30 p-2 rounded text-sm">
              This is a longer headline that will avoid orphans using text-wrap: pretty
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">clip-* (overflow literals)</p>
        <div className="flex gap-3">
          <div className="w-24 h-16 clip-hidden bg-muted/30 rounded p-2">
            <div className="w-40 text-sm">This text is clipped by overflow: hidden</div>
          </div>
          <div className="w-24 h-16 clip-scroll bg-muted/30 rounded p-2">
            <div className="w-40 text-sm">This text scrolls with overflow: scroll</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =============================================================================
   5. ARBITRARY VALUES DEMOS
   ============================================================================= */

export function ArbitraryValuesDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">curve-* with arbitrary [length]</p>
        <div className="flex gap-3 items-end">
          <div className="w-16 h-16 bg-primary/30 curve-[4px]" />
          <div className="w-16 h-16 bg-primary/30 curve-[12px]" />
          <div className="w-16 h-16 bg-primary/30 curve-[1.5rem]" />
          <div className="w-16 h-16 bg-primary/30 curve-[50%]" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">curve-[4px], curve-[12px], curve-[1.5rem], curve-[50%]</p>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">fade-* with arbitrary [percentage]</p>
        <div className="flex gap-3 items-center">
          <div className="w-16 h-16 bg-primary fade-[100%] rounded" />
          <div className="w-16 h-16 bg-primary fade-[75%] rounded" />
          <div className="w-16 h-16 bg-primary fade-[50%] rounded" />
          <div className="w-16 h-16 bg-primary fade-[25%] rounded" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">fade-[100%], fade-[75%], fade-[50%], fade-[25%]</p>
      </div>
    </div>
  )
}

/* =============================================================================
   6. COMBINED VALUE TYPES DEMOS
   ============================================================================= */

export function CombinedValuesDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">opaque-* accepts theme, bare integer, or arbitrary</p>
        <div className="flex gap-3 items-center">
          <div className="w-16 h-16 bg-primary opaque-50 rounded flex items-center justify-center text-xs">
            opaque-50
          </div>
          <div className="w-16 h-16 bg-primary opaque-75 rounded flex items-center justify-center text-xs">
            opaque-75
          </div>
          <div className="w-16 h-16 bg-primary opaque-[80%] rounded flex items-center justify-center text-xs">
            opaque-[80%]
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">ratio-* with theme tokens, fractions, or arbitrary</p>
        <div className="flex gap-3 items-start">
          <div className="w-20 ratio-square bg-muted/50 rounded flex items-center justify-center text-xs">
            ratio-square
          </div>
          <div className="w-20 ratio-video bg-muted/50 rounded flex items-center justify-center text-xs">
            ratio-video
          </div>
          <div className="w-20 ratio-3/4 bg-muted/50 rounded flex items-center justify-center text-xs">
            ratio-3/4
          </div>
        </div>
      </div>
    </div>
  )
}

/* =============================================================================
   7. NEGATIVE VALUES DEMOS
   ============================================================================= */

export function NegativeValuesDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">slide-x-* and -slide-x-*</p>
        <div className="flex gap-6 items-center justify-center py-4">
          <div className="slide-x-4 w-12 h-12 bg-blue-400 rounded flex items-center justify-center text-xs text-white">
            +4
          </div>
          <div className="w-12 h-12 bg-gray-400 rounded flex items-center justify-center text-xs text-white">
            0
          </div>
          <div className="-slide-x-4 w-12 h-12 bg-red-400 rounded flex items-center justify-center text-xs text-white">
            -4
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">spin-* and -spin-*</p>
        <div className="flex gap-6 items-center justify-center py-4">
          <div className="spin-15 w-12 h-12 bg-blue-400 rounded flex items-center justify-center text-xs text-white">
            +15
          </div>
          <div className="spin-45 w-12 h-12 bg-green-400 rounded flex items-center justify-center text-xs text-white">
            +45
          </div>
          <div className="-spin-45 w-12 h-12 bg-red-400 rounded flex items-center justify-center text-xs text-white">
            -45
          </div>
        </div>
      </div>
    </div>
  )
}

/* =============================================================================
   8. MODIFIERS DEMOS
   ============================================================================= */

export function ModifiersDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">type-* with line-height modifier</p>
        <div className="space-y-2">
          <p className="type-lg/tight bg-muted/20 px-2 rounded">type-lg/tight - Compact line height</p>
          <p className="type-lg/relaxed bg-muted/20 px-2 rounded">type-lg/relaxed - Spacious line height</p>
          <p className="type-xl/loose bg-muted/20 px-2 rounded">type-xl/loose - Very spacious</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">bg-tint-* with opacity modifier</p>
        <div className="flex gap-3">
          <div className="bg-tint-info/100 px-4 py-2 rounded text-sm">info/100</div>
          <div className="bg-tint-info/50 px-4 py-2 rounded text-sm">info/50</div>
          <div className="bg-tint-success/75 px-4 py-2 rounded text-sm">success/75</div>
          <div className="bg-tint-critical/25 px-4 py-2 rounded text-sm">critical/25</div>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">edge-* with width modifier</p>
        <div className="flex gap-3">
          <div className="edge-critical px-4 py-2 rounded">edge-critical</div>
          <div className="edge-success/2 px-4 py-2 rounded">edge-success/2</div>
          <div className="edge-info/[3px] px-4 py-2 rounded">edge-info/[3px]</div>
        </div>
      </div>
    </div>
  )
}

/* =============================================================================
   9. FRACTIONS DEMOS
   ============================================================================= */

export function FractionsDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">frame-* (aspect-ratio)</p>
        <div className="flex gap-3 items-start">
          <div className="w-20 frame-square bg-primary/20 rounded flex items-center justify-center text-xs">1:1</div>
          <div className="w-20 frame-video bg-primary/20 rounded flex items-center justify-center text-xs">16:9</div>
          <div className="w-20 frame-3/4 bg-primary/20 rounded flex items-center justify-center text-xs">3:4</div>
          <div className="w-20 frame-21/9 bg-primary/20 rounded flex items-center justify-center text-xs">21:9</div>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">span-* (width as fraction)</p>
        <div className="space-y-2">
          <div className="span-1/2 bg-blue-400/30 h-8 rounded flex items-center px-3 text-sm">span-1/2 (50%)</div>
          <div className="span-2/3 bg-green-400/30 h-8 rounded flex items-center px-3 text-sm">span-2/3 (66.67%)</div>
          <div className="span-3/4 bg-purple-400/30 h-8 rounded flex items-center px-3 text-sm">span-3/4 (75%)</div>
        </div>
      </div>
    </div>
  )
}

/* =============================================================================
   ADDITIONAL DEMOS — Complete coverage
   ============================================================================= */

export function TabsBareDemo() {
  return (
    <div className="space-y-3 font-mono text-sm">
      <p className="text-xs text-muted-foreground mb-2">tabs-* accepts any integer</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <span className="text-xs opacity-60">tabs-2</span>
          <pre className="tabs-2 bg-muted/30 p-2 rounded text-xs">{`if (x) {\n\treturn y;\n}`}</pre>
        </div>
        <div>
          <span className="text-xs opacity-60">tabs-4</span>
          <pre className="tabs-4 bg-muted/30 p-2 rounded text-xs">{`if (x) {\n\treturn y;\n}`}</pre>
        </div>
        <div>
          <span className="text-xs opacity-60">tabs-8</span>
          <pre className="tabs-8 bg-muted/30 p-2 rounded text-xs">{`if (x) {\n\treturn y;\n}`}</pre>
        </div>
      </div>
    </div>
  )
}

export function OrderDemo() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-2">ord-* controls flex/grid order</p>
      <div className="flex gap-2">
        <div className="ord-3 px-3 py-2 bg-red-400/30 rounded text-sm">First in DOM (ord-3)</div>
        <div className="ord-1 px-3 py-2 bg-blue-400/30 rounded text-sm">Second in DOM (ord-1)</div>
        <div className="ord-2 px-3 py-2 bg-green-400/30 rounded text-sm">Third in DOM (ord-2)</div>
      </div>
    </div>
  )
}

export function TabModeDemo() {
  return (
    <div className="space-y-3 font-mono text-sm">
      <p className="text-xs text-muted-foreground mb-2">tabmode-* uses literal CSS keywords</p>
      <div className="flex gap-4">
        <div>
          <span className="text-xs opacity-60">tabmode-inherit</span>
          <pre className="tabmode-inherit bg-muted/30 p-2 rounded text-xs">{`{\n\ttab;\n}`}</pre>
        </div>
        <div>
          <span className="text-xs opacity-60">tabmode-initial</span>
          <pre className="tabmode-initial bg-muted/30 p-2 rounded text-xs">{`{\n\ttab;\n}`}</pre>
        </div>
      </div>
    </div>
  )
}

export function VisibilityDemo() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-2">vis-* controls content-visibility for rendering optimization</p>
      <div className="flex gap-3">
        <div className="vis-auto px-4 py-3 bg-muted/30 rounded text-sm">vis-auto (skip if offscreen)</div>
        <div className="vis-visible px-4 py-3 bg-muted/30 rounded text-sm">vis-visible (always render)</div>
      </div>
    </div>
  )
}

export function TabArbitraryDemo() {
  return (
    <div className="space-y-3 font-mono text-sm">
      <p className="text-xs text-muted-foreground mb-2">tabx-* with arbitrary [integer]</p>
      <div className="flex gap-4">
        <div>
          <span className="text-xs opacity-60">tabx-[3]</span>
          <pre className="tabx-[3] bg-muted/30 p-2 rounded text-xs">{`{\n\ttab;\n}`}</pre>
        </div>
        <div>
          <span className="text-xs opacity-60">tabx-[12]</span>
          <pre className="tabx-[12] bg-muted/30 p-2 rounded text-xs">{`{\n\ttab;\n}`}</pre>
        </div>
      </div>
    </div>
  )
}

export function SpaceDemo() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-2">space-* sets gap with arbitrary [length]</p>
      <div className="space-y-2">
        <div>
          <span className="text-xs opacity-60 block mb-1">space-[0.5rem]</span>
          <div className="flex space-[0.5rem] bg-muted/20 p-2 rounded">
            <div className="w-8 h-8 bg-primary/40 rounded" />
            <div className="w-8 h-8 bg-primary/40 rounded" />
            <div className="w-8 h-8 bg-primary/40 rounded" />
          </div>
        </div>
        <div>
          <span className="text-xs opacity-60 block mb-1">space-[2rem]</span>
          <div className="flex space-[2rem] bg-muted/20 p-2 rounded">
            <div className="w-8 h-8 bg-primary/40 rounded" />
            <div className="w-8 h-8 bg-primary/40 rounded" />
            <div className="w-8 h-8 bg-primary/40 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function AlphaDemo() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-2">alpha-* resolves theme → integer → arbitrary</p>
      <div className="flex gap-3 items-center">
        <div className="w-16 h-16 bg-primary alpha-50 rounded flex items-center justify-center text-xs">
          alpha-50
        </div>
        <div className="w-16 h-16 bg-primary alpha-75 rounded flex items-center justify-center text-xs">
          alpha-75
        </div>
        <div className="w-16 h-16 bg-primary alpha-[60%] rounded flex items-center justify-center text-xs">
          alpha-[60%]
        </div>
      </div>
    </div>
  )
}

export function IndentDemo() {
  return (
    <div className="space-y-3 font-mono text-sm">
      <p className="text-xs text-muted-foreground mb-2">indent-* combines theme, bare, and arbitrary</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <span className="text-xs opacity-60">indent-github</span>
          <pre className="indent-github bg-muted/30 p-2 rounded text-xs">{`{\n\ttab;\n}`}</pre>
        </div>
        <div>
          <span className="text-xs opacity-60">indent-6</span>
          <pre className="indent-6 bg-muted/30 p-2 rounded text-xs">{`{\n\ttab;\n}`}</pre>
        </div>
        <div>
          <span className="text-xs opacity-60">indent-[16]</span>
          <pre className="indent-[16] bg-muted/30 p-2 rounded text-xs">{`{\n\ttab;\n}`}</pre>
        </div>
      </div>
    </div>
  )
}

export function PushDemo() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-2">push-* and -push-* use --spacing() for inset</p>
      <div className="relative h-32 bg-muted/20 rounded-lg">
        <div className="push-4 absolute bg-blue-400/80 px-3 py-2 rounded text-white text-xs">
          push-4 (1rem inset)
        </div>
        <div className="push-[2rem] absolute bg-green-400/80 px-3 py-2 rounded text-white text-xs">
          push-[2rem]
        </div>
      </div>
    </div>
  )
}

export function GridColsModifierDemo() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-2">grid-cols-* with gap modifier</p>
      <div className="space-y-3">
        <div>
          <span className="text-xs opacity-60 block mb-1">grid-cols-3/[0.5rem]</span>
          <div className="grid-cols-3/[0.5rem]">
            <div className="bg-primary/30 p-2 rounded text-center text-sm">1</div>
            <div className="bg-primary/30 p-2 rounded text-center text-sm">2</div>
            <div className="bg-primary/30 p-2 rounded text-center text-sm">3</div>
          </div>
        </div>
        <div>
          <span className="text-xs opacity-60 block mb-1">grid-cols-4/[1.5rem]</span>
          <div className="grid-cols-4/[1.5rem]">
            <div className="bg-primary/30 p-2 rounded text-center text-sm">1</div>
            <div className="bg-primary/30 p-2 rounded text-center text-sm">2</div>
            <div className="bg-primary/30 p-2 rounded text-center text-sm">3</div>
            <div className="bg-primary/30 p-2 rounded text-center text-sm">4</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BasisDemo() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-2">basis-* with fractions for flex-basis</p>
      <div className="flex gap-2">
        <div className="basis-1/4 bg-blue-400/30 p-3 rounded text-sm text-center">basis-1/4</div>
        <div className="basis-1/2 bg-green-400/30 p-3 rounded text-sm text-center">basis-1/2</div>
        <div className="basis-1/4 bg-purple-400/30 p-3 rounded text-sm text-center">basis-1/4</div>
      </div>
    </div>
  )
}
