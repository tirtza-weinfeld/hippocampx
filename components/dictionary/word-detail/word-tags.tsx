import * as motion from "motion/react-client";
import type { Tag } from "@/lib/db/neon/schema";

interface WordTagsProps {
  tags: Tag[];
}

export function WordTags({ tags }: WordTagsProps) {
  if (tags.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-wrap gap-2"
    >
      {tags.map(function renderTag(tag) {
        return (
          <span
            key={tag.id}
            className="px-2.5 py-1 text-xs font-medium text-dict-primary bg-dict-primary/8 hover:bg-dict-primary/12 rounded-full transition-colors cursor-default"
          >
            {tag.name}
          </span>
        );
      })}
    </motion.div>
  );
}
