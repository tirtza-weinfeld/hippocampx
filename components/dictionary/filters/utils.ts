import type { TagOption } from "./types";

/** Groups tags by their category */
export function groupTagsByCategory(
  tags: TagOption[]
): Map<string, { displayName: string; tags: TagOption[] }> {
  const grouped = new Map<string, { displayName: string; tags: TagOption[] }>();

  for (const tag of tags) {
    const existing = grouped.get(tag.categoryId);
    if (existing) {
      existing.tags.push(tag);
    } else {
      grouped.set(tag.categoryId, {
        displayName: tag.categoryDisplayName,
        tags: [tag],
      });
    }
  }

  return grouped;
}

export const chipVariants = {
  initial: { opacity: 0, scale: 0.8, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: -4 },
};

export function getChipTransition(reducedMotion: boolean | null) {
  return {
    duration: reducedMotion ? 0 : 0.15,
    ease: "easeOut" as const,
  };
}
