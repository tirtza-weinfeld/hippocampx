"use client";

import { Lightbulb } from "lucide-react";
import { MathRenderer } from "@/components/mdx/parse/renderers/math-renderer";
import type { NotationInfo } from "@/lib/db/queries/dictionary/types";

interface NotationsDisplayProps {
  notations: NotationInfo[];
}

export function NotationsDisplay({ notations }: NotationsDisplayProps) {
  if (notations.length === 0) return null;

  const formulas = notations.filter(n => n.type === "formula");
  const symbols = notations.filter(n => n.type === "symbol");
  const pronunciations = notations.filter(n => n.type === "pronunciation");
  const mnemonics = notations.filter(n => n.type === "mnemonic");

  return (
    <section className="space-y-4">
      {/* Formulas */}
      {formulas.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-sm font-medium text-dict-text-secondary">
            Notation
          </span>
          <div className="flex flex-wrap gap-3">
            {formulas.map(notation => (
              <span
                key={notation.id}
                className="inline-flex items-center px-4 py-2 rounded-full
                  bg-dict-surface-2 border border-dict-border
                  text-dict-text shadow-xs"
              >
                <MathRenderer latex={notation.value} />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Symbols */}
      {symbols.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-sm font-medium text-dict-text-secondary">
            Symbol
          </span>
          <div className="flex flex-wrap gap-2">
            {symbols.map(notation => (
              <span
                key={notation.id}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                  bg-dict-surface-2 border border-dict-border
                  text-lg text-dict-text shadow-xs"
              >
                <MathRenderer latex={notation.value} />
                {notation.description && (
                  <span className="text-sm text-dict-text-tertiary">
                    {notation.description}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pronunciations */}
      {pronunciations.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-sm font-medium text-dict-text-secondary">
            Pronunciation
          </span>
          <div className="flex flex-wrap gap-2">
            {pronunciations.map(notation => (
              <span
                key={notation.id}
                className="inline-flex items-center px-3.5 py-1.5 rounded-full
                  bg-dict-surface-2 border border-dict-border
                  text-sm font-mono text-dict-text-secondary shadow-xs"
              >
                {notation.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mnemonics */}
      {mnemonics.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-sm font-medium text-dict-text-secondary">
            Memory aid
          </span>
          <div className="space-y-2">
            {mnemonics.map(notation => (
              <div
                key={notation.id}
                className="flex items-start gap-2 px-3.5 py-2 rounded-lg
                  bg-dict-accent/5 border border-dict-accent/20
                  text-sm text-dict-text-secondary"
              >
                <Lightbulb className="h-4 w-4 text-dict-accent shrink-0 mt-0.5" />
                <span>{notation.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
