
import type React from "react"
import type { Metadata } from "next"


export const metadata: Metadata = {
    title: "AI & ML for Kids",
    description: "A fun and interactive way to learn AI and ML for kids and beginners",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className=" @container ai p-4 mt-16">
            {children}
        </div>
    )
}