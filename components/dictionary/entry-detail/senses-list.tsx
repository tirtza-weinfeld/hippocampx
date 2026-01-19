import { Music } from "lucide-react";
import { MarkdownRenderer } from "@/components/mdx/parse";
import { SensesAnimation, SenseItemAnimation } from "./senses-animation";
import type { SenseWithDetails } from "@/lib/db/queries/dictionary/types";

interface SensesListProps {
  senses: SenseWithDetails[];
}

export function SensesList({ senses }: SensesListProps) {
  if (senses.length === 0) {
    return (
      <p className="text-dict-text-tertiary text-sm py-4">
        No definitions available.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <SensesAnimation>
        <ol className="space-y-5 list-none">
          {senses.map((sense, index) => (
            <SenseItemAnimation key={sense.id} index={index}>
              <span className="text-dict-text-tertiary text-sm font-medium mt-0.5 select-none">
                {index + 1}.
              </span>

              <div className="flex-1 space-y-3">
                <p className="text-dict-text leading-relaxed">
                  <MarkdownRenderer>{sense.definition}</MarkdownRenderer>
                </p>

                {sense.examples.length > 0 && (
                  <div className="space-y-2 pl-4 border-l-2 border-dict-border">
                    {sense.examples.map((example) => {
                      const hasSource =
                        example.sourcePartName || example.sourceTitle;
                      return (
                        <div key={example.id} className="space-y-1">
                          <p className="text-sm text-dict-text-secondary">
                            &ldquo;<MarkdownRenderer>{example.text}</MarkdownRenderer>&rdquo;
                          </p>
                          {hasSource && (
                            <div className="flex items-center gap-1.5 text-xs text-dict-text-tertiary">
                              <Music className="h-3 w-3 text-dict-accent" />
                              <span>{example.sourcePartName}</span>
                              {example.sourceTitle && (
                                <>
                                  <span className="opacity-60">-</span>
                                  <span className="text-dict-accent">
                                    {example.sourceTitle}
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </SenseItemAnimation>
          ))}
        </ol>
      </SensesAnimation>
    </div>
  );
}
