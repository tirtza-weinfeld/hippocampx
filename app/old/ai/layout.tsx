
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
        <div className=" @container ai p-4 mt-10 min-h-screen ">
                <div className="max-w-6xl mx-auto ">
                    <header className="text-center mb-8 pb-6 relative">

                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
                            AI & ML for Kids!
                        </h1>
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                            Discover the amazing world of Artificial Intelligence and Machine Learning through fun, interactive
                            examples!
                        </p>
                    </header>
                </div>

                <div className="bg-gradient-to-b from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 p-4 md:p-8 relative rounded-2xl">
                    {children}
                </div>

        </div>
    )
}