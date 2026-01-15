import { HashScrollHandler } from "@/components/mdx/hash-scroll-handler";
import type { ReactNode } from "react";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="@container mx-auto py-8 px-4 notes">
      <div className="max-w-none">
        {children}
      </div>
      <HashScrollHandler />
    </div>
  )


}
