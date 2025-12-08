import { notFound } from "next/navigation";
import { fetchWordCompleteByText } from "@/lib/db/neon/queries/dictionary";
import { WordDetailClient } from "./word-detail-client";
import * as motion from "motion/react-client";
import { BookOpen } from "lucide-react";
import { BackButton } from "@/components/dictionary/back-button";

export default async function WordDetailPage(props: {
  params: Promise<{ lang: string; word: string }>;
}) {
  const params = await props.params;
  const { lang, word: wordText } = params;

  const decodedWord = decodeURIComponent(wordText);

  const word = await fetchWordCompleteByText(decodedWord, lang);

  if (!word) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/10">
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4"
          >
            <BackButton fallbackHref="/dictionary" />
            <div className="h-4 w-px bg-border/60" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{decodedWord}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <WordDetailClient word={word} />
      </div>
    </div>
  );
}
