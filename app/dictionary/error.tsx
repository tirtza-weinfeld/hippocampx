"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DictionaryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(function logError() {
    console.error("Dictionary error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
            <div className="relative rounded-2xl bg-linear-to-br from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20 p-5 ring-1 ring-red-200/50 dark:ring-red-800/30">
              <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
          </div>
          <h2 className="mt-6 text-xl font-semibold text-foreground">
            Failed to load dictionary
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">
            We encountered an issue while loading your vocabulary. Please try again.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={reset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="ghost">Go Home</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
