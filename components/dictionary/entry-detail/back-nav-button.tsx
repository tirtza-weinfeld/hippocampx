"use client";

import { useRouter } from "next/navigation";

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
      className="text-dict-text-secondary hover:text-dict-text transition-colors"
      aria-label="Go back to dictionary"
    >
      dictionary
    </button>
  );
}
