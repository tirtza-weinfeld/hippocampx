import * as motion from "motion/react-client";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WordSerialized } from "@/lib/db/neon/schema";

interface WordHeaderProps {
  word: Pick<WordSerialized, "word_text" | "language_code" | "created_at">;
}

export function WordHeader({ word }: WordHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-linear-to-br from-card via-card to-muted/30 border border-border/50 shadow-sm"
    >
      <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 via-transparent to-blue-500/5" />
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-sky-500/30 to-transparent" />

      <div className="relative p-6 sm:p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-bold tracking-tight">
              {word.word_text}
            </h1>
            <Badge variant="secondary" className="uppercase text-sm">
              {word.language_code}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {word.created_at
                  ? `Added ${new Date(word.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`
                  : "Recently added"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
