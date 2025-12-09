import * as motion from "motion/react-client";
import { Badge } from "@/components/ui/badge";
import type { TagSerialized } from "@/lib/db/neon/schema";

interface WordTagsProps {
  tags: TagSerialized[];
}

export function WordTags({ tags }: WordTagsProps) {
  if (tags.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex flex-wrap gap-2">
        {tags.map(function renderTag(tag) {
          return (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          );
        })}
      </div>
    </motion.div>
  );
}
