"use client"


export function Section({ children }: { children: React.ReactNode }) {
    const [header, content] = children as [React.ReactNode, React.ReactNode]
    return (
        <>
            {/* <div className="relative w-fit border-2 border-gray-200  bg-teal-500/10 rounded-lg p-2 my-2"> */}
                {header}
                {content}
            {/* </div> */}

        </>
    )
}
