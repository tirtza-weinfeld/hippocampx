import type React from "react"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Binary Buddies - Learn Binary Numbers",
  description: "A fun and interactive way to learn binary numbers for kids and beginners",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div  className="@container">

      {children}

    </div>
  )
}


