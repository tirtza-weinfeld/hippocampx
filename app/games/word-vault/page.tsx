import { Suspense } from "react";
import type { Metadata } from "next";
import { WordVaultGame } from "@/components/games/word-vault/game";
import { GameSkeleton } from "@/components/games/word-vault/game-skeleton";

export const metadata: Metadata = {
  title: "Word Vault",
  description:
    "Unlock AI concepts through 7 challenging chambers. Learn how language models work by doing, not explaining.",
};

export default function WordVaultPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <header className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient-wv-title ">
          Word Vault
        </h1>
        <p className="text-sm text-gradient-wv-muted">
          Unlock the secrets of language models
        </p>
      </header>

      <Suspense fallback={<GameSkeleton />}>
        <WordVaultGame />
      </Suspense>
    </main>
  );
}
