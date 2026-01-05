"use client";

import { useState } from "react";
import { PaletteSwitcher } from "./palette-switcher";

export function GamesShell({ children }: { children: React.ReactNode }) {
  const [paletteStyles, setPaletteStyles] = useState<React.CSSProperties>({});

  return (
    <div
      style={paletteStyles}
      className="relative min-h-svh isolate bg-gradient-games-mesh bg-noise-games @container/games"
    >
      <main className="w-full px-4 py-6 @sm/games:px-6 @sm/games:py-8 @lg/games:px-8 @lg/games:py-12 @xl/games:max-w-7xl @xl/games:mx-auto">
        {children}
      </main>

      {/* Decorative gradient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-1/4 -top-1/4 size-[50vh] rounded-full bg-games-glow/20 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 size-[60vh] rounded-full bg-games-accent/15 blur-3xl" />
      </div>

      <PaletteSwitcher onPaletteChange={setPaletteStyles} />
    </div>
  );
}
