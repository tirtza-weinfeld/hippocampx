import { cn } from "@/lib/utils"

// Chevron icon component
export const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={cn(
      "w-3 h-3 transition-all duration-300 ease-out flex-shrink-0",
      "transform hover:scale-110 active:scale-95",
      isOpen ? "rotate-90" : "rotate-0",
      "text-muted-foreground group-hover:text-foreground"
    )}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
)

// Expand/Collapse all icon
export const ExpandCollapseIcon = ({ isExpanded, className }: { isExpanded: boolean, className?: string }) => (
  <svg
    className={cn(
      "w-4 h-4 transition-all duration-300 ease-out flex-shrink-0",
      "transform hover:scale-110 active:scale-95",
      isExpanded ? "rotate-180" : "rotate-0",
      "text-muted-foreground group-hover:text-foreground",
      className
    )}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
)