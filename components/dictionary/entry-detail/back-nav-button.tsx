"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

/**
 * Back navigation button using browser history to preserve query params and scroll position.
 * Falls back to /dictionary if no history exists.
 */
export function BackNavButton() {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-dict-hover transition-colors"
      aria-label="Go back to dictionary"
    >
      <ChevronLeft className="h-5 w-5 text-dict-text-secondary" />
    </button>
  );
}
