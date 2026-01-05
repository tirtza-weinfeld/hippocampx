"use client";

import { useState } from "react";

const PALETTES = {
  forest: { name: "Forest", range: [40, 170], textRange: [40, 170], icon: "🌿", chroma: 1 },
  frost: { name: "Frost", range: [180, 260], textRange: [160, 200], icon: "❄️", chroma: 1 },
  ocean: { name: "Ocean", range: [200, 250], textRange: [140, 190], icon: "🌊", chroma: 1.2 },
  sunset: { name: "Sunset", range: [10, 50], textRange: [30, 80], icon: "🌅", chroma: 1.2 },
  berry: { name: "Berry", range: [280, 330], textRange: [300, 350], icon: "🫐", chroma: 1.2 },
  steel: { name: "Steel", range: [210, 230], textRange: [200, 220], icon: "🔩", chroma: 0.2 },
  mono: { name: "Mono", range: [0, 0], textRange: [0, 0], icon: "⚫", chroma: 0 },
} as const;

type PaletteKey = keyof typeof PALETTES;

// Original hue range from the forest palette (current games.css dark theme)
const ORIGINAL_MIN = 40;
const ORIGINAL_MAX = 170;
const ORIGINAL_RANGE = ORIGINAL_MAX - ORIGINAL_MIN; // 130°

function shiftHue(originalHue: number, targetRange: readonly [number, number]): number {
  const [targetMin, targetMax] = targetRange;

  // Mono palette - return 0 (hue irrelevant when chroma is 0)
  if (targetMin === targetMax && targetMin === 0) return 0;

  const targetRangeSize = targetMax - targetMin;
  const normalizedPosition = (originalHue - ORIGINAL_MIN) / ORIGINAL_RANGE;
  const newHue = targetMin + normalizedPosition * targetRangeSize;

  return Math.round(newHue % 360);
}

function generateSteelVariables(): React.CSSProperties {
  // Steel: cool gray background with vibrant rose→coral→peach text
  return {
    "--gradient-games-mesh": `
      radial-gradient(ellipse 80% 55% at 20% 25%, oklch(0.30 0.03 230 / 55%) 0%, transparent 50%),
      radial-gradient(ellipse 55% 75% at 85% 70%, oklch(0.24 0.04 200 / 45%) 0%, transparent 45%),
      radial-gradient(ellipse 45% 45% at 55% 35%, oklch(0.35 0.025 250 / 40%) 0%, transparent 40%),
      radial-gradient(ellipse 110% 65% at 50% 100%, oklch(0.18 0.035 215 / 50%) 0%, transparent 55%)
    `,
    "--gradient-games-glow": `conic-gradient(
      from 180deg at 50% 50%,
      oklch(0.28 0.03 240) 0deg,
      oklch(0.38 0.04 220) 90deg,
      oklch(0.48 0.035 200) 180deg,
      oklch(0.38 0.04 230) 270deg,
      oklch(0.28 0.03 240) 360deg
    )`,
    "--gradient-games-surface": `linear-gradient(
      145deg,
      oklch(0.35 0.04 230 / 88%) 0%,
      oklch(0.15 0.05 210 / 78%) 50%,
      oklch(0.25 0.035 240 / 72%) 100%
    )`,
    "--color-games-icon-start": "oklch(0.72 0.22 330)",
    "--color-games-icon-end": "oklch(0.85 0.24 25)",
    "--color-games-glow": "oklch(0.55 0.05 220)",
    "--color-games-accent": "oklch(0.75 0.18 15)",
    // Vibrant rose→magenta→coral→peach text gradients
    "--gradient-games-title": "linear-gradient(105deg, oklch(0.72 0.26 330) 0%, oklch(0.88 0.28 360) 35%, oklch(0.95 0.26 25) 65%, oklch(0.82 0.24 50) 100%)",
    "--gradient-games-text": "linear-gradient(100deg, oklch(0.70 0.24 335) 0%, oklch(0.85 0.26 5) 50%, oklch(0.92 0.22 40) 100%)",
    "--gradient-games-muted": "linear-gradient(90deg, oklch(0.58 0.18 325) 0%, oklch(0.72 0.20 355) 50%, oklch(0.78 0.16 20) 100%)",
    "--gradient-games-icon-bg": "linear-gradient(140deg, oklch(0.38 0.06 340 / 92%) 0%, oklch(0.18 0.04 220 / 65%) 100%)",
  } as React.CSSProperties;
}

function generateMonoVariables(): React.CSSProperties {
  // Mono: TRUE grayscale (chroma 0) with dramatic lightness contrast
  return {
    "--gradient-games-mesh": `
      radial-gradient(ellipse 80% 55% at 20% 25%, oklch(0.45 0 0 / 60%) 0%, transparent 50%),
      radial-gradient(ellipse 55% 75% at 85% 70%, oklch(0.15 0 0 / 50%) 0%, transparent 45%),
      radial-gradient(ellipse 45% 45% at 55% 35%, oklch(0.55 0 0 / 45%) 0%, transparent 40%),
      radial-gradient(ellipse 110% 65% at 50% 100%, oklch(0.10 0 0 / 55%) 0%, transparent 55%)
    `,
    "--gradient-games-glow": `conic-gradient(
      from 180deg at 50% 50%,
      oklch(0.12 0 0) 0deg,
      oklch(0.30 0 0) 90deg,
      oklch(0.50 0 0) 180deg,
      oklch(0.30 0 0) 270deg,
      oklch(0.12 0 0) 360deg
    )`,
    "--gradient-games-surface": `linear-gradient(
      145deg,
      oklch(0.35 0 0 / 95%) 0%,
      oklch(0.12 0 0 / 85%) 50%,
      oklch(0.22 0 0 / 80%) 100%
    )`,
    "--color-games-icon-start": "oklch(0.45 0 0)",
    "--color-games-icon-end": "oklch(0.75 0 0)",
    "--color-games-glow": "oklch(0.55 0 0)",
    "--color-games-accent": "oklch(0.75 0 0)",
    "--gradient-games-title": "linear-gradient(105deg, oklch(0.45 0 0) 0%, oklch(0.75 0 0) 50%, oklch(0.98 0 0) 100%)",
    "--gradient-games-text": "linear-gradient(100deg, oklch(0.40 0 0) 0%, oklch(0.95 0 0) 100%)",
    "--gradient-games-muted": "linear-gradient(90deg, oklch(0.38 0 0) 0%, oklch(0.68 0 0) 100%)",
    "--gradient-games-icon-bg": "linear-gradient(140deg, oklch(0.40 0 0 / 95%) 0%, oklch(0.12 0 0 / 70%) 100%)",
  } as React.CSSProperties;
}

function generateCSSVariables(palette: PaletteKey): React.CSSProperties {
  if (palette === "mono") return generateMonoVariables();
  if (palette === "steel") return generateSteelVariables();

  const { range, textRange, chroma: chromaMult } = PALETTES[palette];

  // Helper to create oklch string with palette adjustments
  const oklch = (l: number, c: number, h: number, a?: number) => {
    const newH = shiftHue(h, range);
    const newC = c * chromaMult;
    return a !== undefined
      ? `oklch(${l} ${newC.toFixed(3)} ${newH} / ${a}%)`
      : `oklch(${l} ${newC.toFixed(3)} ${newH})`;
  };

  // Text helper using separate text hue range
  const textOklch = (l: number, c: number, h: number) => {
    const newH = shiftHue(h, textRange);
    const newC = c * chromaMult;
    return `oklch(${l} ${newC.toFixed(3)} ${newH})`;
  };

  return {
    // Mesh gradient
    "--gradient-games-mesh": `
      radial-gradient(ellipse 80% 55% at 20% 25%, ${oklch(0.24, 0.10, 150, 55)} 0%, transparent 50%),
      radial-gradient(ellipse 55% 75% at 85% 70%, ${oklch(0.26, 0.12, 120, 45)} 0%, transparent 45%),
      radial-gradient(ellipse 45% 45% at 55% 35%, ${oklch(0.30, 0.08, 50, 35)} 0%, transparent 40%),
      radial-gradient(ellipse 110% 65% at 50% 100%, ${oklch(0.20, 0.10, 170, 45)} 0%, transparent 55%)
    `,
    // Glow sweep
    "--gradient-games-glow": `conic-gradient(
      from 180deg at 50% 50%,
      ${oklch(0.38, 0.14, 150)} 0deg,
      ${oklch(0.35, 0.16, 120)} 72deg,
      ${oklch(0.40, 0.18, 80)} 144deg,
      ${oklch(0.38, 0.14, 50)} 216deg,
      ${oklch(0.35, 0.12, 170)} 288deg,
      ${oklch(0.38, 0.14, 150)} 360deg
    )`,
    // Surface
    "--gradient-games-surface": `linear-gradient(
      145deg,
      ${oklch(0.38, 0.06, 150, 85)} 0%,
      ${oklch(0.12, 0.07, 130, 70)} 50%,
      ${oklch(0.22, 0.055, 160, 65)} 100%
    )`,
    // Icon colors
    "--color-games-icon-start": oklch(0.70, 0.18, 150),
    "--color-games-icon-end": oklch(0.78, 0.22, 120),
    // Accent colors
    "--color-games-glow": oklch(0.75, 0.22, 140),
    "--color-games-accent": oklch(0.80, 0.20, 100),
    // Text gradients - high lightness for contrast
    "--gradient-games-title": `linear-gradient(105deg, ${textOklch(0.80, 0.24, 170)} 0%, ${textOklch(0.95, 0.28, 100)} 50%, ${textOklch(0.85, 0.26, 50)} 100%)`,
    "--gradient-games-text": `linear-gradient(100deg, ${textOklch(0.78, 0.22, 160)} 0%, ${textOklch(0.92, 0.26, 80)} 100%)`,
    "--gradient-games-muted": `linear-gradient(90deg, ${textOklch(0.65, 0.18, 150)} 0%, ${textOklch(0.80, 0.16, 100)} 100%)`,
    // Icon backdrop
    "--gradient-games-icon-bg": `linear-gradient(140deg, ${oklch(0.45, 0.14, 150, 90)} 0%, ${oklch(0.12, 0.10, 130, 60)} 100%)`,
  } as React.CSSProperties;
}

export function PaletteSwitcher({
  onPaletteChange,
}: {
  onPaletteChange: (styles: React.CSSProperties) => void;
}) {
  const [active, setActive] = useState<PaletteKey>("forest");

  const handleSelect = (key: PaletteKey) => {
    setActive(key);
    const styles = key === "forest" ? {} : generateCSSVariables(key);
    onPaletteChange(styles);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-1 rounded-xl bg-black/60 p-2 backdrop-blur-md">
      {Object.entries(PALETTES).map(([key, { name, icon }]) => (
        <button
          key={key}
          onClick={() => handleSelect(key as PaletteKey)}
          className={`rounded-lg px-3 py-2 text-sm transition-all ${
            active === key
              ? "bg-white/20 text-white"
              : "text-white/60 hover:bg-white/10 hover:text-white"
          }`}
          title={name}
        >
          <span className="mr-1">{icon}</span>
          <span className="hidden @sm/games:inline">{name}</span>
        </button>
      ))}
    </div>
  );
}
