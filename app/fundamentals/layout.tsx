import type React from "react"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Fundamental for Kids",
  description: "Learn about the fundamental concepts of math and science in a fun, interactive way!",
}

export default function FundamentalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fundamental">
      {children}
    </div>
  )
}