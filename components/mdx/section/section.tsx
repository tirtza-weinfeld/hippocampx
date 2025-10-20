"use client"

export function Section({ children }: { children: React.ReactNode }) {
    const [header, content] = children as [React.ReactNode, React.ReactNode]
    return (
        <div className="relative section rounded-lg p-2 my-2 transition-all duration-200 hover:shadow-md">
            {header}
            {content}
        </div>
    )
}
