import type { ReactNode } from "react";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-3xl px-4 py-8">{children}</div>;
}
