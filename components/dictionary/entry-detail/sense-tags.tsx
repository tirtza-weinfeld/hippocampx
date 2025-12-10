import * as motion from "motion/react-client";

interface TagInfo {
  id: number;
  name: string;
  category: string | null;
  explanation: string | null;
}

interface SenseTagsProps {
  tags: TagInfo[];
}

export function SenseTags({ tags }: SenseTagsProps) {
  if (tags.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-wrap gap-2"
    >
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="px-2.5 py-1 text-xs font-medium text-dict-primary bg-dict-primary/8 hover:bg-dict-primary/12 rounded-full transition-colors cursor-default"
          title={tag.explanation ?? undefined}
        >
          {tag.name}
        </span>
      ))}
    </motion.div>
  );
}
